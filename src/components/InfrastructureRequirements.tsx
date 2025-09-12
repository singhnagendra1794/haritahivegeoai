import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const InfrastructureRequirements = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Infrastructure Requirements</h2>
          <p className="text-xl text-muted-foreground">
            MVP to enterprise-scale infrastructure specifications
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">MVP Infrastructure (10K Users)</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-lg font-medium flex items-center gap-2">
                  <span className="text-geo-primary">☁️</span>
                  Cloud Resources
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Kubernetes Cluster</span>
                    <Badge>3 nodes, 4 vCPU each</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory</span>
                    <Badge>48 GB total RAM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage</span>
                    <Badge>500 GB SSD</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge>PostGIS 2 vCPU, 8GB</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-medium flex items-center gap-2">
                  <span className="text-geo-secondary">💰</span>
                  Estimated Monthly Cost
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Compute</span>
                    <span>$200-400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span>$50-100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network</span>
                    <span>$25-50</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>$275-550/month</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Enterprise Scale (1M+ Users)</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-lg font-medium flex items-center gap-2">
                  <span className="text-geo-accent">🏢</span>
                  Enterprise Resources
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Kubernetes Cluster</span>
                    <Badge>50+ nodes, 16 vCPU each</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory</span>
                    <Badge>2+ TB total RAM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage</span>
                    <Badge>50+ TB NVMe</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Cluster</span>
                    <Badge>Multi-region PostGIS</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-medium flex items-center gap-2">
                  <span className="text-tech-blue">📊</span>
                  Performance Targets
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>API Response Time</span>
                      <span>&lt; 100ms</span>
                    </div>
                    <Progress value={95} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Data Processing Throughput</span>
                      <span>1M+ records/sec</span>
                    </div>
                    <Progress value={90} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Uptime SLA</span>
                      <span>99.9%</span>
                    </div>
                    <Progress value={99} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Multi-Tenant SaaS Architecture</h3>
            <div className="bg-muted/20 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Tenant Management Layer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-3 rounded text-sm">Tenant Manager</div>
                    <div className="bg-card p-3 rounded text-sm">Namespace 1</div>
                    <div className="bg-card p-3 rounded text-sm">Namespace N</div>
                  </div>
                </div>
                
                <div className="text-center text-2xl">↓</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">Shared Infrastructure</h4>
                    <div className="space-y-2">
                      <div className="bg-card p-3 rounded text-sm">Authentication</div>
                      <div className="bg-card p-3 rounded text-sm">Monitoring</div>
                      <div className="bg-card p-3 rounded text-sm">Logging</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">Tenant Resources</h4>
                    <div className="space-y-2">
                      <div className="bg-card p-3 rounded text-sm">Isolated Database</div>
                      <div className="bg-card p-3 rounded text-sm">Dedicated Services</div>
                      <div className="bg-card p-3 rounded text-sm">Compute Resources</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-2xl">↓</div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Data Isolation Layer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-3 rounded text-sm">Row Level Security</div>
                    <div className="bg-card p-3 rounded text-sm">Encryption at Rest</div>
                    <div className="bg-card p-3 rounded text-sm">Network Isolation</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span className="text-geo-primary">🔒</span>
              Security Requirements
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• End-to-end encryption</li>
              <li>• OAuth 2.0 / OIDC</li>
              <li>• RBAC & ABAC</li>
              <li>• API rate limiting</li>
              <li>• Audit logging</li>
              <li>• Compliance (SOC2, GDPR)</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span className="text-geo-secondary">📈</span>
              Monitoring & Observability
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Prometheus metrics</li>
              <li>• Distributed tracing</li>
              <li>• Grafana dashboards</li>
              <li>• Alert manager</li>
              <li>• Log aggregation</li>
              <li>• Performance APM</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span className="text-geo-accent">🔄</span>
              CI/CD & DevOps
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• GitOps workflows</li>
              <li>• Automated testing</li>
              <li>• Blue/green deployment</li>
              <li>• Canary releases</li>
              <li>• Infrastructure as Code</li>
              <li>• Model versioning</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureRequirements;