# Harita Hive API Documentation (Authentication-Free MVP)

## Overview
The Harita Hive MVP provides public geospatial processing APIs without authentication requirements. All endpoints use session-based tracking for rate limiting and data association.

## Base URL
```
https://your-project.supabase.co/functions/v1/
```

## Rate Limits (Per Session/Day)
- **API Calls**: 1,000 requests
- **Jobs**: 50 processing jobs  
- **Projects**: 10 projects
- **Storage**: 500MB data upload

## Session Management
All APIs support optional `sessionId` parameter. If not provided, a new session ID is generated and returned. Use the same session ID across requests to maintain data association.

---

## Data Ingestion

### Ingest Vector Data
**POST** `/ingest-vector`

Upload GeoJSON vector data for processing.

**Request:**
```json
{
  "geojson": {
    "type": "FeatureCollection", 
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-74.0059, 40.7128]
        },
        "properties": {
          "name": "New York City",
          "population": 8000000
        }
      }
    ]
  },
  "sessionId": "optional-uuid-for-session-tracking",
  "projectId": "optional-uuid-if-associating-with-project"
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "generated-or-provided-uuid",
  "message": "Ingested 1 features", 
  "data": [
    {
      "id": "feature-uuid",
      "name": "New York City",
      "feature_type": "point",
      "geometry": "SRID=4326;POINT(-74.0059 40.7128)",
      "properties": {"name": "New York City", "population": 8000000}
    }
  ]
}
```

**Usage Example:**
```javascript
const response = await fetch('/functions/v1/ingest-vector', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    geojson: myGeoJSON,
    sessionId: localStorage.getItem('harita_session_id') // Optional
  })
});

const result = await response.json();
localStorage.setItem('harita_session_id', result.session_id);
```

---

## Job Processing

### Start Processing Job
**POST** `/start-job`

Create and queue a geospatial processing job.

**Request:**
```json
{
  "jobType": "buffer|ndvi|change_detection|zonal_stats|report_generation",
  "sessionId": "optional-session-uuid",
  "projectId": "optional-project-uuid", 
  "parameters": {
    // Job-specific parameters (see examples below)
  }
}
```

#### Buffer Analysis Job
```json
{
  "jobType": "buffer",
  "sessionId": "my-session-id",
  "parameters": {
    "geometry": {
      "type": "Point",
      "coordinates": [-74.0059, 40.7128]
    },
    "distance": 1000,
    "units": "meters"
  }
}
```

#### NDVI Calculation Job
```json
{
  "jobType": "ndvi", 
  "sessionId": "my-session-id",
  "parameters": {
    "raster_url": "https://example.com/satellite-image.tif",
    "red_band": 1,
    "nir_band": 2,
    "output_format": "geotiff"
  }
}
```

#### Change Detection Job
```json
{
  "jobType": "change_detection",
  "sessionId": "my-session-id", 
  "parameters": {
    "before_image": "https://example.com/before.tif",
    "after_image": "https://example.com/after.tif",
    "threshold": 0.1,
    "method": "simple_difference"
  }
}
```

**Response:**
```json
{
  "success": true,
  "job_id": "job-uuid",
  "session_id": "session-uuid",
  "status": "pending",
  "estimated_completion": "2024-01-15T10:35:00Z"
}
```

### Check Job Status
**GET** `/job-status?job_id={uuid}&session_id={uuid}`

Monitor job progress and retrieve results.

**Parameters:**
- `job_id` (required): UUID of the job
- `session_id` (optional): Session ID for additional filtering

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "job-uuid",
    "session_id": "session-uuid", 
    "project_id": "project-uuid",
    "job_type": "buffer",
    "status": "completed",
    "progress": 100,
    "created_at": "2024-01-15T10:30:00Z",
    "started_at": "2024-01-15T10:30:15Z", 
    "completed_at": "2024-01-15T10:32:45Z",
    "estimated_completion": null,
    "parameters": {
      "geometry": {"type": "Point", "coordinates": [-74.0059, 40.7128]},
      "distance": 1000,
      "units": "meters"
    },
    "result_data": {
      "buffered_geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      },
      "statistics": {
        "original_area": 0,
        "buffered_area": 3141592.65,
        "buffer_distance": 1000,
        "buffer_units": "meters",
        "perimeter": 6283.18
      },
      "processing_time": 150000
    },
    "related_results": null
  }
}
```

**Job Status Values:**
- `pending` - Job queued for processing
- `running` - Currently being processed
- `completed` - Successfully finished
- `failed` - Processing failed with error
- `cancelled` - Job was cancelled

**Polling Example:**
```javascript
async function pollJobStatus(jobId, sessionId) {
  const response = await fetch(
    `/functions/v1/job-status?job_id=${jobId}&session_id=${sessionId}`
  );
  const result = await response.json();
  
  if (result.job.status === 'completed') {
    return result.job.result_data;
  } else if (result.job.status === 'failed') {
    throw new Error(result.job.error_message);
  } else {
    // Still processing, poll again in 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    return pollJobStatus(jobId, sessionId);
  }
}
```

---

## Model Inference (Optional Advanced Feature)

### Real-time Model Inference
**POST** `/model-inference`

Run inference on trained models for immediate predictions.

**Request:**
```json
{
  "model_name": "ndvi_model|buffer_model|change_detection_model",
  "model_version": "latest",
  "sessionId": "session-uuid",
  "input_data": {
    // Model-specific input format
  },
  "batch_mode": false
}
```

**NDVI Model Example:**
```json
{
  "model_name": "ndvi_model",
  "sessionId": "my-session-id",
  "input_data": {
    "red_band": [0.1, 0.2, 0.15, ...], // Pixel values
    "nir_band": [0.8, 0.9, 0.85, ...], // Pixel values
    "metadata": {
      "width": 256,
      "height": 256
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "model_name": "ndvi_model",
  "model_version": "1", 
  "predictions": [
    {
      "ndvi_values": [0.78, 0.82, 0.76, ...],
      "statistics": {
        "mean": 0.45,
        "std": 0.15,
        "min": -0.1,
        "max": 0.9
      },
      "confidence": 0.95
    }
  ],
  "inference_time": 1642248600000,
  "batch_mode": false
}
```

---

## Reports & Downloads

### Download Job Results
**GET** `/download-report?job_id={uuid}&format={format}`

Download processing results in various formats.

**Parameters:**
- `job_id` - UUID of completed job
- `format` - Output format: `json|csv|geojson|html`

**Response Headers:**
```
Content-Type: application/json (or text/csv, application/geo+json, text/html)
Content-Disposition: attachment; filename="results.json"
```

**JSON Format Response:**
```json
{
  "id": "job-uuid",
  "title": "Buffer Analysis Results",
  "generated_at": "2024-01-15T10:35:00Z",
  "job_info": {
    "id": "job-uuid", 
    "type": "buffer",
    "parameters": {...},
    "session_id": "session-uuid"
  },
  "results": {
    "buffered_geometry": {...},
    "statistics": {...}
  }
}
```

**GeoJSON Format (for spatial results):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", 
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      },
      "properties": {
        "job_id": "job-uuid",
        "job_type": "buffer",
        "buffer_distance": 1000,
        "area": 3141592.65
      }
    }
  ]
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

**Common Error Scenarios:**

### Rate Limiting
```json
{
  "success": false,
  "error": "Daily API call limit exceeded for this session"
}
```

### Invalid Input
```json
{
  "success": false,
  "error": "Invalid GeoJSON format: missing coordinates"
}
```

### Job Processing Errors
```json
{
  "success": false,
  "error": "NDVI calculation failed: could not download raster data"
}
```

### Resource Not Found
```json
{
  "success": false,
  "error": "Job not found"
}
```

---

## SDK Examples

### JavaScript/Browser
```javascript
class HaritaHiveClient {
  constructor(baseUrl = '/functions/v1') {
    this.baseUrl = baseUrl;
    this.sessionId = localStorage.getItem('harita_session_id');
  }

  async ingestGeoJSON(geojson, projectId = null) {
    const response = await fetch(`${this.baseUrl}/ingest-vector`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        geojson,
        sessionId: this.sessionId,
        projectId
      })
    });
    
    const result = await response.json();
    this.sessionId = result.session_id;
    localStorage.setItem('harita_session_id', this.sessionId);
    
    return result;
  }

  async startBufferJob(geometry, distance, units = 'meters') {
    const response = await fetch(`${this.baseUrl}/start-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobType: 'buffer',
        sessionId: this.sessionId,
        parameters: { geometry, distance, units }
      })
    });
    
    return response.json();
  }

  async getJobStatus(jobId) {
    const url = new URL(`${this.baseUrl}/job-status`);
    url.searchParams.set('job_id', jobId);
    if (this.sessionId) url.searchParams.set('session_id', this.sessionId);
    
    const response = await fetch(url);
    return response.json();
  }
}

// Usage
const client = new HaritaHiveClient();
const result = await client.startBufferJob(
  { type: 'Point', coordinates: [-74.0059, 40.7128] },
  1000
);
```

### Python
```python
import requests
import json
import time

class HaritaHiveClient:
    def __init__(self, base_url="https://your-project.supabase.co/functions/v1"):
        self.base_url = base_url
        self.session_id = None
    
    def ingest_geojson(self, geojson, project_id=None):
        response = requests.post(
            f"{self.base_url}/ingest-vector",
            json={
                "geojson": geojson,
                "sessionId": self.session_id,
                "projectId": project_id
            }
        )
        result = response.json()
        self.session_id = result.get("session_id")
        return result
    
    def start_buffer_job(self, geometry, distance, units="meters"):
        response = requests.post(
            f"{self.base_url}/start-job",
            json={
                "jobType": "buffer",
                "sessionId": self.session_id,
                "parameters": {
                    "geometry": geometry,
                    "distance": distance,
                    "units": units
                }
            }
        )
        return response.json()
    
    def wait_for_job(self, job_id, timeout=300):
        start_time = time.time()
        while time.time() - start_time < timeout:
            response = requests.get(
                f"{self.base_url}/job-status",
                params={
                    "job_id": job_id,
                    "session_id": self.session_id
                }
            )
            result = response.json()
            status = result["job"]["status"]
            
            if status == "completed":
                return result["job"]["result_data"]
            elif status == "failed":
                raise Exception(result["job"]["error_message"])
            
            time.sleep(5)
        
        raise TimeoutError("Job did not complete within timeout")

# Usage
client = HaritaHiveClient()
job = client.start_buffer_job(
    {"type": "Point", "coordinates": [-74.0059, 40.7128]},
    1000
)
results = client.wait_for_job(job["job_id"])
```

### cURL Examples

**Upload GeoJSON:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ingest-vector \
  -H "Content-Type: application/json" \
  -d '{
    "geojson": {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [-74.0059, 40.7128]},
        "properties": {"name": "NYC"}
      }]
    }
  }'
```

**Start Buffer Job:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/start-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobType": "buffer",
    "sessionId": "your-session-id",
    "parameters": {
      "geometry": {"type": "Point", "coordinates": [-74.0059, 40.7128]},
      "distance": 1000,
      "units": "meters"
    }
  }'
```

**Check Job Status:**
```bash
curl "https://your-project.supabase.co/functions/v1/job-status?job_id=your-job-id&session_id=your-session-id"
```

---

## Best Practices

### Session Management
- Store `session_id` in localStorage/sessionStorage for web apps
- Use consistent session ID across API calls for data association
- Session data persists for 30 days, then may be cleaned up

### Error Handling
- Always check `success` field in API responses
- Implement exponential backoff for job status polling
- Handle rate limiting by storing session quota status

### Performance
- Use batch operations when possible (multiple features in one ingest call)
- Poll job status at reasonable intervals (5-10 seconds)
- Download large results using streaming when available

### Data Management
- Associate related data using the same session ID
- Clean up temporary data when no longer needed
- Consider creating projects for better organization