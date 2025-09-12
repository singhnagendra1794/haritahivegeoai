import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ScalabilityPatterns = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Scalability Patterns</h2>
          <p className="text-xl text-muted-foreground">
            Enterprise-grade patterns for handling massive geospatial workloads
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
              <span className="text-geo-primary">📈</span>
              Horizontal Scaling Patterns
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-geo-primary pl-4">
                <h4 className="font-medium">Microservices Architecture</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Independent scaling of data ingestion, ML processing, and visualization services
                </p>
              </div>
              <div className="border-l-4 border-geo-secondary pl-4">
                <h4 className="font-medium">Event-Driven Processing</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Asynchronous processing with Kafka for high-throughput data ingestion
                </p>
              </div>
              <div className="border-l-4 border-geo-accent pl-4">
                <h4 className="font-medium">Container Orchestration</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Kubernetes-based auto-scaling with HPA and VPA for dynamic workloads
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
              <span className="text-geo-secondary">🔄</span>
              Data Partitioning Strategies
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-geo-primary pl-4">
                <h4 className="font-medium">Spatial Partitioning</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Geographic-based sharding for optimal query performance
                </p>
              </div>
              <div className="border-l-4 border-geo-secondary pl-4">
                <h4 className="font-medium">Temporal Partitioning</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Time-based data distribution for historical analysis workflows
                </p>
              </div>
              <div className="border-l-4 border-geo-accent pl-4">
                <h4 className="font-medium">Multi-Tenant Isolation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Secure tenant separation with dedicated resources and data isolation
                </p>
              </div>
            </div>
          </Card>
        </div>

          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Scalability Architecture Flow</h3>
            <div className="bg-muted/20 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="font-semibold">Load Balancing Layer</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-3 rounded text-sm">Load Balancer</div>
                    <div className="bg-card p-3 rounded text-sm">API Gateway 1</div>
                    <div className="bg-card p-3 rounded text-sm">API Gateway N</div>
                  </div>
                </div>
                
                <div className="text-center text-2xl">↓</div>
                
                <div className="text-center">
                  <h4 className="font-semibold">Auto-Scaling Services</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-3 rounded text-sm">Service Instance 1</div>
                    <div className="bg-card p-3 rounded text-sm">Service Instance 2</div>
                    <div className="bg-card p-3 rounded text-sm">HPA Controller</div>
                  </div>
                </div>
                
                <div className="text-center text-2xl">↓</div>
                
                <div className="text-center">
                  <h4 className="font-semibold">Data & Storage Layer</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card p-3 rounded text-sm">PostGIS Primary</div>
                    <div className="bg-card p-3 rounded text-sm">Redis Cluster</div>
                    <div className="bg-card p-3 rounded text-sm">Vector DB</div>
                    <div className="bg-card p-3 rounded text-sm">Object Storage</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-geo-primary/10 rounded-full flex items-center justify-center text-2xl">
                🚀
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Performance Optimization</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sub-second query response times through intelligent caching and indexing
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Redis Caching</Badge>
              <Badge variant="outline">Spatial Indexing</Badge>
              <Badge variant="outline">Query Optimization</Badge>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-geo-secondary/10 rounded-full flex items-center justify-center text-2xl">
                🛡️
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Fault Tolerance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              High availability with automatic failover and disaster recovery
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Circuit Breakers</Badge>
              <Badge variant="outline">Health Checks</Badge>
              <Badge variant="outline">Backup Systems</Badge>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-geo-accent/10 rounded-full flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Resource Monitoring</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time metrics and intelligent alerting for proactive scaling
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Prometheus</Badge>
              <Badge variant="outline">Grafana</Badge>
              <Badge variant="outline">Alert Manager</Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ScalabilityPatterns;