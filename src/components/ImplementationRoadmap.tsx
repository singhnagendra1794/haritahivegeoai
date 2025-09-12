import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

const ImplementationRoadmap = () => {
  const phases = [
    {
      phase: "Phase 1: MVP Foundation",
      duration: "3-4 months",
      status: "upcoming",
      features: [
        "Basic data ingestion pipeline",
        "PostGIS database setup",
        "Simple REST APIs",
        "Basic React dashboard",
        "User authentication",
        "Docker containerization"
      ],
      deliverables: [
        "10K users support",
        "Basic geospatial queries",
        "Simple visualization",
        "Multi-tenant architecture"
      ]
    },
    {
      phase: "Phase 2: ML Integration", 
      duration: "4-5 months",
      status: "planning",
      features: [
        "MLflow integration",
        "Model training pipelines", 
        "TensorFlow serving",
        "Vector database (Qdrant)",
        "Advanced analytics APIs",
        "Interactive mapping"
      ],
      deliverables: [
        "AI/ML model deployment",
        "Predictive analytics",
        "Advanced visualizations",
        "API optimization"
      ]
    },
    {
      phase: "Phase 3: Enterprise Scale",
      duration: "6+ months",
      status: "future",
      features: [
        "Kubernetes orchestration",
        "Auto-scaling implementation",
        "Multi-cloud deployment",
        "Advanced monitoring",
        "Enterprise security",
        "CI/CD automation"
      ],
      deliverables: [
        "1M+ users support",
        "99.9% uptime SLA",
        "Global deployment",
        "Enterprise features"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "upcoming":
        return <Clock className="w-5 h-5 text-geo-primary" />;
      case "planning":
        return <Clock className="w-5 h-5 text-geo-secondary" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "upcoming":
        return "bg-geo-primary";
      case "planning":
        return "bg-geo-secondary";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Implementation Roadmap</h2>
          <p className="text-xl text-muted-foreground">
            Strategic phased approach to building the Harita Hive platform
          </p>
        </div>

        <div className="space-y-12">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < phases.length - 1 && (
                <div className="absolute left-6 top-20 w-0.5 h-32 bg-border"></div>
              )}
              
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getStatusColor(phase.status)} flex items-center justify-center text-white font-bold`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <Card className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-2">
                        {getStatusIcon(phase.status)}
                        <h3 className="text-2xl font-semibold">{phase.phase}</h3>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="mb-4 text-lg font-medium flex items-center gap-2">
                          <span className="text-geo-primary">🛠️</span>
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {phase.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="w-4 h-4 text-geo-secondary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-4 text-lg font-medium flex items-center gap-2">
                          <span className="text-geo-secondary">🎯</span>
                          Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((deliverable, deliverableIndex) => (
                            <li key={deliverableIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 text-center">
            <div className="mb-4 text-3xl">📋</div>
            <h3 className="mb-2 font-semibold">Data Versioning</h3>
            <p className="text-sm text-muted-foreground">
              DVC + Git for reproducible data science workflows
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4 text-3xl">🔄</div>
            <h3 className="mb-2 font-semibold">Model CI/CD</h3>
            <p className="text-sm text-muted-foreground">
              Automated ML model testing, validation, and deployment
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4 text-3xl">🏗️</div>
            <h3 className="mb-2 font-semibold">Infrastructure as Code</h3>
            <p className="text-sm text-muted-foreground">
              Terraform + Helm charts for reproducible deployments
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4 text-3xl">🌐</div>
            <h3 className="mb-2 font-semibold">Hybrid Cloud</h3>
            <p className="text-sm text-muted-foreground">
              Seamless cloud + on-premises integration strategy
            </p>
          </Card>
        </div>

        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-geo-primary/5 to-geo-secondary/5 border-geo-primary/20">
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-semibold">Ready to Build?</h3>
              <p className="mb-6 text-muted-foreground">
                This comprehensive architecture provides a solid foundation for your GeoAI platform. 
                Each phase builds upon the previous, ensuring scalable and maintainable growth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-geo-primary">Open Source Ready</Badge>
                <Badge className="bg-geo-secondary">Cloud Native</Badge>
                <Badge className="bg-geo-accent">Enterprise Scale</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImplementationRoadmap;