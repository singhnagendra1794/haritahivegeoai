import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted to-primary/5 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-geo-primary/10 via-transparent to-geo-secondary/10" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              <span className="bg-gradient-to-r from-geo-primary to-geo-secondary bg-clip-text text-transparent">
                Harita Hive
              </span>
              <br />
              GeoAI Platform Architecture
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Scalable, multi-tenant SaaS platform for geospatial data ingestion, AI/ML processing, 
              automation, and intelligent visualization with hybrid cloud architecture.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-geo-primary hover:bg-geo-primary/90" asChild>
              <a href="/app">Launch GeoAI Platform</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-geo-primary/20 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="mb-2 text-lg font-semibold">Geospatial Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Advanced GIS processing with real-time spatial analytics and ML-powered insights
              </p>
            </Card>
            
            <Card className="border-geo-secondary/20 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-4 text-3xl">🤖</div>
              <h3 className="mb-2 text-lg font-semibold">AI/ML Engine</h3>
              <p className="text-sm text-muted-foreground">
                Scalable machine learning pipelines for predictive geospatial modeling
              </p>
            </Card>
            
            <Card className="border-geo-accent/20 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-4 text-3xl">☁️</div>
              <h3 className="mb-2 text-lg font-semibold">Hybrid Cloud</h3>
              <p className="text-sm text-muted-foreground">
                Flexible deployment across cloud and on-premises infrastructure
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;