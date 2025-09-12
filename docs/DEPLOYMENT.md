# Harita Hive Backend Deployment Guide

## Overview
This guide covers deploying the Harita Hive multi-tenant GeoAI platform in production using Kubernetes.

## Architecture Components

- **Supabase Edge Functions**: API endpoints for data ingestion, job management, and model inference
- **Job Worker**: Node.js workers for processing NDVI, buffer, and spatial analysis jobs
- **TensorFlow Serving**: Model serving infrastructure for ML inference
- **Redis**: Job queue and caching
- **MinIO**: Object storage for raster data and results
- **Monitoring**: Prometheus + Grafana + AlertManager

## Prerequisites

- Kubernetes cluster (1.21+)
- kubectl configured
- Helm 3.x
- Docker registry access
- Supabase project with configured database

## Deployment Steps

### 1. Setup Secrets

Create the required secrets:

```bash
# Create namespace
kubectl create namespace harita-hive

# Create secrets
kubectl create secret generic harita-secrets \
  --from-literal=supabase-url="https://your-project.supabase.co" \
  --from-literal=supabase-service-key="your-service-role-key" \
  --from-literal=redis-password="your-redis-password" \
  -n harita-hive
```

### 2. Deploy Infrastructure Dependencies

```bash
# Add Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Deploy Redis
helm install redis bitnami/redis \
  --namespace harita-hive \
  --set auth.enabled=true \
  --set auth.password="your-redis-password" \
  --set master.persistence.enabled=true \
  --set master.persistence.size=10Gi

# Deploy MinIO
helm install minio bitnami/minio \
  --namespace harita-hive \
  --set auth.rootUser=admin \
  --set auth.rootPassword="your-minio-password" \
  --set persistence.enabled=true \
  --set persistence.size=100Gi

# Deploy Prometheus Stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword="your-grafana-password"
```

### 3. Build and Push Container Images

```bash
# Build job worker image
cd workers/job-worker
docker build -t ghcr.io/your-org/harita-hive-worker:latest .
docker push ghcr.io/your-org/harita-hive-worker:latest

# Build TensorFlow Serving image
cd ../../model-serving/tensorflow-serving
docker build -t ghcr.io/your-org/harita-tensorflow-serving:latest .
docker push ghcr.io/your-org/harita-tensorflow-serving:latest
```

### 4. Deploy Harita Hive Components

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/manifests/harita-hive-stack.yaml

# Verify deployments
kubectl get pods -n harita-hive
kubectl get services -n harita-hive
```

### 5. Deploy Supabase Edge Functions

```bash
# Install Supabase CLI
npm i -g supabase

# Deploy edge functions
supabase functions deploy --project-ref your-project-ref

# Set environment variables for edge functions
supabase secrets set REDIS_HOST=redis-master.harita-hive.svc.cluster.local
supabase secrets set MODEL_SERVING_URL=http://tensorflow-serving.harita-hive.svc.cluster.local:8501
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Yes |
| `REDIS_HOST` | Redis hostname | Yes |
| `REDIS_PASSWORD` | Redis password | Yes |
| `MODEL_SERVING_URL` | TensorFlow Serving URL | Yes |
| `WORKER_CONCURRENCY` | Job worker concurrency | No (default: 5) |

### Resource Requirements

#### Minimum Requirements
- **Job Worker**: 1 CPU, 1GB RAM per replica
- **TensorFlow Serving**: 2 CPU, 2GB RAM per replica
- **Redis**: 1 CPU, 2GB RAM
- **MinIO**: 1 CPU, 1GB RAM

#### Production Recommendations
- **Job Worker**: 3+ replicas with HPA
- **TensorFlow Serving**: 2+ replicas
- **Persistent storage**: 100GB+ for object storage
- **Monitoring**: Dedicated monitoring namespace

## Monitoring and Observability

### Accessing Grafana
```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Default credentials: admin / your-grafana-password

### Key Metrics to Monitor
- Job processing rate and queue depth
- Model inference latency and throughput
- API error rates and response times
- Resource utilization (CPU, memory, disk)
- Database connection pool usage

### Alerts Configuration
Critical alerts are configured for:
- Service downtime
- High error rates (>5%)
- High latency (>2s for model inference)
- Resource exhaustion (>90% memory/disk)
- Job queue backlog (>100 pending jobs)

## Security Considerations

### Network Security
- Network policies restrict inter-pod communication
- TLS enabled for all external traffic
- Service mesh (optional) for mTLS between services

### Access Control
- RBAC configured for service accounts
- Secrets stored in Kubernetes secrets (consider external secret management)
- Pod security standards enforced

### Data Protection
- Encryption at rest for persistent volumes
- Regular backups of critical data
- Multi-tenant data isolation via RLS policies

## Scaling

### Horizontal Scaling
- Job workers auto-scale based on CPU/memory usage
- Redis can be scaled to cluster mode for high availability
- TensorFlow Serving replicas can be increased for higher throughput

### Vertical Scaling
- Increase resource limits for compute-intensive workloads
- Consider GPU nodes for ML inference acceleration
- Scale storage volumes as data grows

## Troubleshooting

### Common Issues

1. **Jobs stuck in pending state**
   ```bash
   kubectl logs -n harita-hive deployment/harita-job-worker
   kubectl describe pods -n harita-hive -l app=harita-job-worker
   ```

2. **Model inference failures**
   ```bash
   kubectl logs -n harita-hive deployment/tensorflow-serving
   kubectl exec -it -n harita-hive deployment/tensorflow-serving -- curl localhost:8501/v1/models
   ```

3. **Database connection issues**
   ```bash
   kubectl get secrets -n harita-hive
   kubectl describe secret harita-secrets -n harita-hive
   ```

### Debug Commands
```bash
# Check pod logs
kubectl logs -f -n harita-hive <pod-name>

# Exec into pod
kubectl exec -it -n harita-hive <pod-name> -- /bin/bash

# Check resource usage
kubectl top pods -n harita-hive
kubectl top nodes

# Check events
kubectl get events -n harita-hive --sort-by='.lastTimestamp'
```

## Backup and Recovery

### Database Backups
- Supabase handles automated backups
- Configure point-in-time recovery if needed
- Regular exports of critical configuration data

### Application State
- Redis persistence enabled for job queue state
- MinIO bucket replication for geographic redundancy
- Container images stored in redundant registries

## Performance Optimization

### Job Processing
- Tune worker concurrency based on workload
- Implement job prioritization for critical tasks
- Monitor and optimize memory usage for large raster processing

### Model Inference
- Batch multiple requests when possible
- Consider model quantization for faster inference
- Use GPU acceleration for compute-intensive models

### Storage
- Use SSD storage for high-IOPS workloads
- Implement data lifecycle policies for cost optimization
- Consider CDN for frequently accessed results

## Cost Optimization

- Use cluster autoscaling to match demand
- Implement resource quotas and limits
- Monitor and optimize storage usage
- Consider spot instances for non-critical workloads
- Review and rightsize resource allocations regularly