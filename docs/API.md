# Harita Hive API Documentation

## Overview
The Harita Hive API provides endpoints for geospatial data ingestion, processing, and analysis. All APIs are implemented as Supabase Edge Functions with proper authentication and rate limiting.

## Authentication
All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Base URL
```
https://your-project.supabase.co/functions/v1/
```

## Rate Limits
- Free tier: 1,000 requests/month
- Pro tier: 10,000 requests/month  
- Enterprise tier: Unlimited

## Endpoints

### Data Ingestion

#### Ingest Vector Data
**POST** `/ingest-vector`

Ingest GeoJSON vector data into the platform.

**Request Body:**
```json
{
  "projectId": "uuid",
  "organizationId": "uuid", 
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
  ],
  "metadata": {
    "source": "user_upload",
    "crs": "EPSG:4326"
  }
}
```

**Response:**
```json
{
  "success": true,
  "dataset_id": "uuid",
  "features_processed": 1,
  "feature_ids": ["uuid"]
}
```

**Error Codes:**
- `400` - Invalid GeoJSON or missing required fields
- `401` - Authentication required
- `403` - Insufficient permissions or quota exceeded
- `429` - Rate limit exceeded

---

### Job Management

#### Start Job
**POST** `/start-job`

Create and start a new processing job.

**Request Body:**
```json
{
  "jobType": "ndvi|buffer|change_detection|zonal_stats|report_generation",
  "organizationId": "uuid",
  "projectId": "uuid",
  "parameters": {
    // Job-specific parameters
  }
}
```

**Job Types and Parameters:**

##### NDVI Job
```json
{
  "jobType": "ndvi",
  "parameters": {
    "dataset_id": "uuid",
    "red_band": 1,
    "nir_band": 2,
    "output_format": "geotiff"
  }
}
```

##### Buffer Job
```json
{
  "jobType": "buffer", 
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

##### Change Detection Job
```json
{
  "jobType": "change_detection",
  "parameters": {
    "before_image": "dataset_id_or_url",
    "after_image": "dataset_id_or_url", 
    "threshold": 0.1,
    "method": "simple_difference"
  }
}
```

**Response:**
```json
{
  "success": true,
  "job_id": "uuid",
  "status": "pending",
  "estimated_completion": "2024-01-15T10:30:00Z"
}
```

#### Get Job Status
**GET** `/job-status?job_id=uuid&organization_id=uuid`

Get the current status and results of a job.

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "uuid",
    "organization_id": "uuid", 
    "project_id": "uuid",
    "job_type": "ndvi",
    "status": "completed",
    "progress": 100,
    "created_at": "2024-01-15T10:00:00Z",
    "completed_at": "2024-01-15T10:05:00Z",
    "result_data": {
      "ndvi_result_id": "uuid",
      "raster_url": "https://storage.example.com/result.tif",
      "statistics": {
        "min": -0.2,
        "max": 0.8,
        "mean": 0.4,
        "vegetation_percentage": 65.5
      }
    }
  }
}
```

**Job Statuses:**
- `pending` - Job queued for processing
- `running` - Job currently being processed  
- `completed` - Job finished successfully
- `failed` - Job failed with error
- `cancelled` - Job was cancelled

---

### Model Inference

#### Model Inference
**POST** `/model-inference`

Run inference on trained models for real-time predictions.

**Request Body:**
```json
{
  "model_name": "ndvi_model|buffer_model|change_detection_model",
  "model_version": "latest",
  "input_data": {
    // Model-specific input data
  },
  "organization_id": "uuid",
  "project_id": "uuid",
  "batch_mode": false
}
```

**NDVI Model Input:**
```json
{
  "model_name": "ndvi_model",
  "input_data": {
    "red_band": [/* pixel values */],
    "nir_band": [/* pixel values */],
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
      "ndvi_values": [/* calculated NDVI values */],
      "statistics": {
        "mean": 0.45,
        "std": 0.15
      },
      "confidence": 0.95
    }
  ],
  "inference_time": 1642248600000
}
```

---

### Reports

#### Download Report
**GET** `/download-report?report_id=uuid&format=json`

Download generated reports in various formats.

**Query Parameters:**
- `report_id` - UUID of the report
- `project_id` - Alternative to report_id, gets latest report for project
- `format` - Output format: `json|csv|geojson|html`

**Response Headers:**
```
Content-Type: application/json
Content-Disposition: attachment; filename="report.json"
```

**JSON Report Structure:**
```json
{
  "id": "uuid",
  "title": "Spatial Analysis Report - Project Name",
  "project": {
    "id": "uuid", 
    "title": "Project Name",
    "organization": "Organization Name"
  },
  "content": {
    "sections": [
      {
        "type": "overview",
        "title": "Project Overview",
        "content": {
          "description": "Project description",
          "sector": "agriculture",
          "created_date": "2024-01-01T00:00:00Z"
        }
      }
    ]
  },
  "generated_at": "2024-01-15T10:00:00Z"
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `AUTHENTICATION_REQUIRED` - Missing or invalid JWT token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `QUOTA_EXCEEDED` - Organization has exceeded usage limits
- `INVALID_INPUT` - Request body validation failed
- `RESOURCE_NOT_FOUND` - Requested resource does not exist
- `PROCESSING_ERROR` - Error during job processing
- `RATE_LIMIT_EXCEEDED` - Too many requests

## SDKs and Examples

### JavaScript/TypeScript
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// Start an NDVI job
const { data, error } = await supabase.functions.invoke('start-job', {
  body: {
    jobType: 'ndvi',
    organizationId: 'your-org-id',
    projectId: 'your-project-id', 
    parameters: {
      dataset_id: 'your-dataset-id',
      red_band: 1,
      nir_band: 2
    }
  }
})
```

### Python
```python
import requests

def start_ndvi_job(auth_token, org_id, project_id, dataset_id):
    url = "https://your-project.supabase.co/functions/v1/start-job"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "jobType": "ndvi",
        "organizationId": org_id,
        "projectId": project_id,
        "parameters": {
            "dataset_id": dataset_id,
            "red_band": 1,
            "nir_band": 2
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
```

### cURL
```bash
curl -X POST https://your-project.supabase.co/functions/v1/start-job \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobType": "buffer",
    "organizationId": "your-org-id",
    "parameters": {
      "geometry": {
        "type": "Point", 
        "coordinates": [-74.0059, 40.7128]
      },
      "distance": 1000,
      "units": "meters"
    }
  }'
```

## Webhooks

Configure webhooks to receive notifications about job completion:

**Webhook Payload:**
```json
{
  "event": "job.completed",
  "job_id": "uuid",
  "organization_id": "uuid",
  "status": "completed",
  "result_data": {
    // Job results
  },
  "timestamp": "2024-01-15T10:05:00Z"
}
```

## Usage Analytics

Track API usage through the usage analytics endpoints:

```json
{
  "organization_id": "uuid",
  "period": "2024-01",
  "usage": {
    "api_calls": 150,
    "jobs_processed": 25,
    "storage_used_mb": 512,
    "model_inferences": 75
  },
  "limits": {
    "api_calls": 1000,
    "jobs": 50,
    "storage_mb": 2048
  }
}
```