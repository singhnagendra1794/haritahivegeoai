import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TechnologyStack = () => {
  const techStacks = {
    frontend: {
      title: "Frontend Layer",
      icon: "💻",
      color: "tech-blue",
      technologies: [
        { name: "React/Next.js", type: "Framework", openSource: true },
        { name: "TypeScript", type: "Language", openSource: true },
        { name: "Leaflet/MapboxGL", type: "Mapping", openSource: true },
        { name: "D3.js", type: "Visualization", openSource: true },
        { name: "Tailwind CSS", type: "Styling", openSource: true }
      ]
    },
    backend: {
      title: "Backend Services", 
      icon: "🔧",
      color: "geo-primary",
      technologies: [
        { name: "Node.js/Python", type: "Runtime", openSource: true },
        { name: "FastAPI/Express", type: "Framework", openSource: true },
        { name: "GraphQL/REST", type: "API", openSource: true },
        { name: "Docker/Kubernetes", type: "Container", openSource: true },
        { name: "Nginx/Traefik", type: "Gateway", openSource: true }
      ]
    },
    data: {
      title: "Data Layer",
      icon: "🗄️", 
      color: "geo-secondary",
      technologies: [
        { name: "PostGIS", type: "Spatial DB", openSource: true },
        { name: "Apache Kafka", type: "Streaming", openSource: true },
        { name: "Redis", type: "Cache", openSource: true },
        { name: "InfluxDB", type: "Time Series", openSource: true },
        { name: "MinIO/S3", type: "Object Storage", openSource: false }
      ]
    },
    ml: {
      title: "ML/AI Engine",
      icon: "🤖",
      color: "geo-accent",
      technologies: [
        { name: "TensorFlow/PyTorch", type: "ML Framework", openSource: true },
        { name: "MLflow", type: "ML Ops", openSource: true },
        { name: "Apache Airflow", type: "Orchestration", openSource: true },
        { name: "Kubeflow", type: "ML Pipeline", openSource: true },
        { name: "Qdrant", type: "Vector DB", openSource: true }
      ]
    },
    infrastructure: {
      title: "Infrastructure",
      icon: "☁️",
      color: "tech-green", 
      technologies: [
        { name: "Kubernetes", type: "Orchestration", openSource: true },
        { name: "Prometheus/Grafana", type: "Monitoring", openSource: true },
        { name: "ELK Stack", type: "Logging", openSource: true },
        { name: "Terraform", type: "IaC", openSource: true },
        { name: "GitLab CI/CD", type: "DevOps", openSource: true }
      ]
    },
    cloud: {
      title: "Cloud Options",
      icon: "🌩️",
      color: "primary",
      technologies: [
        { name: "AWS/GCP/Azure", type: "Public Cloud", openSource: false },
        { name: "OpenShift", type: "Hybrid", openSource: false },
        { name: "Rancher", type: "K8s Management", openSource: true },
        { name: "Istio", type: "Service Mesh", openSource: true },
        { name: "Vault", type: "Secrets", openSource: true }
      ]
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Technology Stack</h2>
          <p className="text-xl text-muted-foreground">
            Open-source first approach with enterprise-grade cloud integration
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(techStacks).map((stack, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{stack.icon}</span>
                <h3 className="text-xl font-semibold">{stack.title}</h3>
              </div>
              
              <div className="space-y-3">
                {stack.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-muted-foreground">{tech.type}</div>
                    </div>
                    <Badge 
                      variant={tech.openSource ? "default" : "secondary"}
                      className={tech.openSource ? "bg-geo-secondary text-white" : ""}
                    >
                      {tech.openSource ? "Open Source" : "Enterprise"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Deployment Architecture Options</h3>
            <div className="bg-muted/20 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="bg-card p-4 rounded border">
                  <h4 className="font-semibold mb-3">Cloud Native</h4>
                  <div className="text-xs space-y-1">
                    <div>Kubernetes Cluster</div>
                    <div>↓</div>
                    <div>Microservices</div>
                    <div>Auto-scaling</div>
                    <div>Service Mesh</div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded border">
                  <h4 className="font-semibold mb-3">Hybrid Cloud</h4>
                  <div className="text-xs space-y-1">
                    <div>On-Premises Core</div>
                    <div>↔</div>
                    <div>Cloud Burst</div>
                    <div>Sensitive Data</div>
                    <div>Compute Scale</div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded border">
                  <h4 className="font-semibold mb-3">Multi-Cloud</h4>
                  <div className="text-xs space-y-1">
                    <div>Primary Cloud</div>
                    <div>↓</div>
                    <div>Secondary Cloud</div>
                    <div>Edge Locations</div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded border">
                  <h4 className="font-semibold mb-3">Edge Computing</h4>
                  <div className="text-xs space-y-1">
                    <div>Edge Nodes</div>
                    <div>↓</div>
                    <div>Local Processing</div>
                    <div>Data Sync</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
      </div>
    </section>
  );
};

export default TechnologyStack;