terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

# Redis for job queue
resource "helm_release" "redis" {
  name       = "harita-redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  version    = "18.0.0"

  values = [
    file("${path.module}/values/redis-values.yaml")
  ]
}

# MinIO for object storage
resource "helm_release" "minio" {
  name       = "harita-minio"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "minio"
  version    = "12.0.0"

  values = [
    file("${path.module}/values/minio-values.yaml")
  ]
}

# Job Worker Deployment
resource "kubernetes_deployment" "job_worker" {
  metadata {
    name = "harita-job-worker"
    labels = {
      app = "harita-job-worker"
    }
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "harita-job-worker"
      }
    }

    template {
      metadata {
        labels = {
          app = "harita-job-worker"
        }
      }

      spec {
        container {
          image = "ghcr.io/your-org/harita-hive-worker:latest"
          name  = "worker"

          env {
            name  = "REDIS_HOST"
            value = "harita-redis-master"
          }

          env {
            name = "SUPABASE_URL"
            value_from {
              secret_key_ref {
                name = "harita-secrets"
                key  = "supabase-url"
              }
            }
          }

          env {
            name = "SUPABASE_SERVICE_ROLE_KEY"
            value_from {
              secret_key_ref {
                name = "harita-secrets"
                key  = "supabase-service-key"
              }
            }
          }

          resources {
            limits = {
              cpu    = "1000m"
              memory = "2Gi"
            }
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
        }
      }
    }
  }
}