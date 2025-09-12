import { Card } from "@/components/ui/card";

const ArchitectureOverview = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Platform Architecture</h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive system design for scalable geospatial AI processing
          </p>
        </div>

        <div className="mb-16">
          <Card className="p-8">
            <div className="text-center">
              <h3 className="mb-6 text-2xl font-semibold text-center">System Architecture Diagram</h3>
              <div className="bg-muted/20 p-8 rounded-lg">
                <div className="text-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">Frontend Layer</h4>
                      <ul className="text-xs space-y-1">
                        <li>• React Dashboard</li>
                        <li>• Mobile App</li>
                        <li>• WebGIS Interface</li>
                      </ul>
                    </div>
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">API Gateway</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Rate Limiting</li>
                        <li>• Authentication</li>
                        <li>• Load Balancing</li>
                      </ul>
                    </div>
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">Core Services</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Data Ingestion API</li>
                        <li>• ML Processing API</li>
                        <li>• Visualization API</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-2xl">↓ Data Flow ↓</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">Data Pipeline</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Apache Kafka</li>
                        <li>• Apache Flink</li>
                        <li>• Apache Airflow</li>
                      </ul>
                    </div>
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">ML/AI Engine</h4>
                      <ul className="text-xs space-y-1">
                        <li>• MLflow Pipeline</li>
                        <li>• TensorFlow Serving</li>
                        <li>• Kubernetes Jobs</li>
                      </ul>
                    </div>
                    <div className="bg-card p-4 rounded border">
                      <h4 className="font-semibold mb-2">Storage Layer</h4>
                      <ul className="text-xs space-y-1">
                        <li>• PostGIS Database</li>
                        <li>• Object Storage</li>
                        <li>• Vector Database</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
              <span className="text-geo-primary">🏗️</span>
              Key Modules
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Data Ingestion Pipeline</h4>
                <p className="text-sm text-muted-foreground">Real-time geospatial data processing with Kafka and Flink</p>
              </div>
              <div>
                <h4 className="font-medium">ML/AI Engine</h4>
                <p className="text-sm text-muted-foreground">Scalable ML workflows with MLflow and TensorFlow</p>
              </div>
              <div>
                <h4 className="font-medium">Visualization Engine</h4>
                <p className="text-sm text-muted-foreground">Interactive maps and dashboards with WebGL rendering</p>
              </div>
              <div>
                <h4 className="font-medium">API Gateway</h4>
                <p className="text-sm text-muted-foreground">Unified API layer with authentication and rate limiting</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
              <span className="text-geo-secondary">⚡</span>
              Data Flow Patterns
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Ingestion → Processing</h4>
                <p className="text-sm text-muted-foreground">Streaming geospatial data through Kafka to Flink processors</p>
              </div>
              <div>
                <h4 className="font-medium">Processing → Storage</h4>
                <p className="text-sm text-muted-foreground">Processed data stored in PostGIS and vector databases</p>
              </div>
              <div>
                <h4 className="font-medium">ML Training → Serving</h4>
                <p className="text-sm text-muted-foreground">Automated model training and deployment pipeline</p>
              </div>
              <div>
                <h4 className="font-medium">API → Frontend</h4>
                <p className="text-sm text-muted-foreground">Real-time data delivery to visualization interfaces</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureOverview;