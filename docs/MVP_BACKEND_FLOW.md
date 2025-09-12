# Harita Hive MVP Backend Flow (Authentication-Free)

## System Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Client    │───▶│  Edge Functions  │───▶│   PostgreSQL    │
│  (React SPA)    │    │  (Public APIs)   │    │   + PostGIS     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
┌─────────────────┐    ┌──────────────────┐             │
│   Job Worker    │◀───│   Redis Queue    │             │
│  (Node.js BullMQ)│    │  (Job Storage)   │             │
└─────────────────┘    └──────────────────┘             │
          │                                              │
          ▼                                              │
┌─────────────────┐    ┌──────────────────┐             │
│ TensorFlow      │    │     MinIO        │◀────────────┘
│ Serving         │    │ (Object Storage) │
│ (ML Models)     │    │                  │
└─────────────────┘    └──────────────────┘
```

## Core Data Flow

### 1. Session-Based Data Upload
```
Client Request → Edge Function (ingest-vector)
  ├─ Generate session_id (UUID)
  ├─ Validate GeoJSON data
  ├─ Check daily quota (session-based)
  ├─ Store in PostGIS (geo_features table)
  ├─ Track usage (session_id)
  └─ Return: session_id + feature_ids
```

### 2. Geospatial Job Processing
```
Client Request → Edge Function (start-job)
  ├─ Generate session_id (if not provided)
  ├─ Validate job parameters
  ├─ Check daily job quota
  ├─ Create job record (session-based)
  ├─ Queue job in Redis
  └─ Return: job_id + session_id

Redis Queue → Job Worker
  ├─ Process job (NDVI/Buffer/Analysis)
  ├─ Update job status in PostgreSQL
  ├─ Store results in PostGIS/MinIO
  └─ Optional: Model inference via TensorFlow Serving
```

### 3. Results Retrieval
```
Client Request → Edge Function (job-status)
  ├─ Query job by job_id (+ optional session_id)
  ├─ Return job status + results
  └─ Track lightweight API usage

Client Request → Edge Function (download-report)
  ├─ Generate report from job results
  ├─ Export in multiple formats (JSON/CSV/GeoJSON)
  └─ Return file or stream
```

## Database Schema (Authentication-Free)

### Core Tables
```sql
-- Projects (optional session association)
projects:
  - id: UUID (PK)
  - title: TEXT
  - session_id: TEXT (nullable)
  - organization_id: UUID (nullable)
  - auth_owner_id: UUID (future auth hook)

-- Geospatial Features
geo_features:
  - id: UUID (PK)  
  - session_id: TEXT (not null)
  - geometry: GEOMETRY (PostGIS)
  - properties: JSONB
  - auth_user_id: UUID (future auth hook)

-- Processing Jobs
jobs:
  - id: UUID (PK)
  - session_id: TEXT (not null)
  - job_type: ENUM
  - parameters: JSONB
  - status: ENUM
  - result_data: JSONB
  - auth_user_id: UUID (future auth hook)

-- Usage Tracking (Rate Limiting)
usage_tracking:
  - session_id: TEXT (not null)
  - resource_type: TEXT
  - quantity: NUMERIC
  - created_at: TIMESTAMP

-- API Sessions (Optional Rate Limiting)
api_sessions:
  - session_id: TEXT (PK)
  - request_count: INTEGER
  - last_used_at: TIMESTAMP
```

## API Endpoints (Public, No Auth)

### Data Ingestion
```http
POST /functions/v1/ingest-vector
Content-Type: application/json

{
  "geojson": { 
    "type": "FeatureCollection",
    "features": [...]
  },
  "sessionId": "optional-uuid",
  "projectId": "optional-uuid"
}

Response:
{
  "success": true,
  "session_id": "generated-or-provided-uuid",
  "message": "Ingested N features",
  "data": [feature_records]
}
```

### Job Management
```http
POST /functions/v1/start-job
Content-Type: application/json

{
  "jobType": "buffer|ndvi|change_detection|zonal_stats",
  "sessionId": "optional-uuid",
  "projectId": "optional-uuid",
  "parameters": {
    // Job-specific parameters
  }
}

Response:
{
  "success": true,
  "job_id": "uuid",
  "session_id": "uuid", 
  "status": "pending",
  "estimated_completion": "2024-01-15T10:30:00Z"
}
```

```http
GET /functions/v1/job-status?job_id=uuid&session_id=uuid

Response:
{
  "success": true,
  "job": {
    "id": "uuid",
    "session_id": "uuid",
    "status": "completed|pending|running|failed",
    "progress": 100,
    "result_data": { ... },
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Model Inference (Optional)
```http
POST /functions/v1/model-inference
Content-Type: application/json

{
  "model_name": "ndvi_model|buffer_model",
  "input_data": { ... },
  "sessionId": "uuid"
}

Response:
{
  "success": true,
  "predictions": [...]
}
```

## Rate Limiting (Session-Based)

### Daily Limits (Anonymous Sessions)
- **Projects**: 10 per day
- **API Calls**: 1,000 per day
- **Jobs**: 50 per day  
- **Storage**: 500MB per day

### Implementation
```sql
-- Check quota before processing
SELECT check_session_quota('session-id', 'jobs', 1);

-- Track usage after processing  
SELECT track_session_usage('session-id', 'jobs', 1, 'job-uuid');
```

## Job Processing Workflows

### 1. Buffer Analysis
```
Input: Geometry + Distance + Units
Process: 
  ├─ Validate geometry (Point/Polygon/LineString)
  ├─ Apply buffer using Turf.js/PostGIS
  ├─ Calculate area and perimeter statistics
  └─ Store result geometry
Output: Buffered geometry + statistics
```

### 2. NDVI Calculation
```
Input: Raster URL/Dataset + Band Numbers
Process:
  ├─ Download raster data
  ├─ Extract Red and NIR bands
  ├─ Calculate NDVI = (NIR - Red) / (NIR + Red)
  ├─ Generate vegetation statistics
  └─ Store result raster in MinIO
Output: NDVI raster URL + statistics
```

### 3. Change Detection
```
Input: Before/After Images + Threshold
Process:
  ├─ Download both raster images
  ├─ Align and validate dimensions  
  ├─ Calculate pixel differences
  ├─ Apply threshold for change classification
  └─ Generate change map
Output: Change map + change statistics
```

## Storage Strategy

### PostGIS (Structured Data)
- Vector geometries and properties
- Job metadata and status
- Usage analytics and session tracking

### MinIO/S3 (Blob Storage)  
- Raster datasets (GeoTIFF, PNG)
- Processing results (NDVI maps, change detection)
- Generated reports (PDF, HTML)

### Redis (Ephemeral)
- Job queue (BullMQ)
- Session cache (optional)
- Rate limiting counters

## Monitoring & Logging

### Key Metrics
- API request rate and error rate
- Job processing time and success rate
- Storage usage by session
- Daily active sessions

### Structured Logging
```json
{
  "timestamp": "2024-01-15T10:00:00Z",
  "level": "info",
  "service": "edge-function",
  "endpoint": "start-job", 
  "session_id": "uuid",
  "job_type": "buffer",
  "processing_time_ms": 1250,
  "success": true
}
```

## Authentication Re-enablement Hooks

### Database Migration Path
```sql
-- Enable authentication
UPDATE projects SET auth_owner_id = owner_id WHERE owner_id IS NOT NULL;
UPDATE geo_features SET auth_user_id = user_id WHERE user_id IS NOT NULL;

-- Re-enable RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- Add back user-based policies...

-- Migrate session data to authenticated users
SELECT migrate_session_to_user('session-id', 'user-uuid', 'org-uuid');
```

### Code Changes Required
```typescript
// 1. Re-add JWT verification to Edge Functions
// 2. Update API calls to include Authorization header
// 3. Replace session_id with user_id in database queries
// 4. Re-enable organization-based multi-tenancy
// 5. Add authentication UI components back
```

## Security Considerations (MVP)

### Current Security Model
- **No authentication** - all endpoints are public
- **Rate limiting** - session-based daily quotas
- **Input validation** - parameter validation and sanitization
- **CORS enabled** - for web client access

### Risks & Mitigations
- **Data exposure**: All data is publicly accessible
  - Mitigation: Session-based isolation, temporary data
- **Abuse potential**: No user accountability
  - Mitigation: Rate limiting, monitoring, IP-based blocking
- **Storage costs**: Unlimited anonymous uploads
  - Mitigation: Daily quotas, automated cleanup

### Production Hardening
- Add API key authentication as intermediate step
- Implement IP-based rate limiting
- Add request logging and abuse detection
- Consider Cloudflare or similar DDoS protection

## Scalability Patterns

### Horizontal Scaling
- **Edge Functions**: Auto-scale with Supabase
- **Job Workers**: Scale via Kubernetes HPA
- **Database**: Connection pooling + read replicas
- **Storage**: Auto-scaling object storage

### Performance Optimization  
- **Caching**: Redis for frequently accessed data
- **CDN**: Static assets and processed results
- **Async Processing**: All heavy computation via job queue
- **Database Indexing**: Session-based queries optimized

## Deployment Pipeline

### Development
```bash
# 1. Deploy Edge Functions
supabase functions deploy

# 2. Run database migrations  
supabase db push

# 3. Build and deploy job workers
docker build -t harita-worker:latest .
kubectl apply -f k8s/job-worker.yaml

# 4. Deploy TensorFlow Serving
kubectl apply -f k8s/model-serving.yaml
```

### Production Checklist
- [ ] Configure monitoring and alerts
- [ ] Set up automated backups
- [ ] Enable SSL/TLS certificates
- [ ] Configure rate limiting and DDoS protection
- [ ] Set up log aggregation
- [ ] Configure auto-scaling policies
- [ ] Test disaster recovery procedures