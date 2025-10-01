import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Brain, 
  Satellite, 
  BarChart3, 
  ArrowRight,
  Sprout,
  Shield,
  Map as MapIcon,
  Zap,
  Globe,
  Sun,
  CheckCircle
} from 'lucide-react';
import logoImage from '@/assets/logo.png';

const PublicLanding = () => {
  const workflows = [
    {
      icon: Sun,
      title: "Solar Farm Analysis",
      description: "Optimal site selection using solar radiation, slope, and grid connectivity data",
      badge: "Renewable Energy"
    },
    {
      icon: Zap,
      title: "Battery Storage (BESS)",
      description: "Strategic locations for energy storage with grid proximity and terrain analysis",
      badge: "Energy Storage"
    },
    {
      icon: Sprout,
      title: "Agriculture Suitability",
      description: "Crop-optimal areas using soil, climate, and land cover analysis",
      badge: "Agriculture"
    }
  ];

  const stats = [
    { value: "3", label: "Analysis Types" },
    { value: "< 3min", label: "Analysis Time" },
    { value: "30m", label: "Resolution" },
    { value: "Free", label: "Access" }
  ];

  const features = [
    "No registration required - start analyzing immediately",
    "Real-time GeoAI processing with satellite data",
    "Export results as GeoTIFF, PNG, and PDF reports",
    "Draw regions, upload shapefiles, or select districts",
    "Weighted overlay analysis with multiple data sources"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-bg to-forest-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-forest-primary/10 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Harita Hive" 
                  className="w-8 h-8 object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-charcoal-primary">Harita Hive</h1>
                <p className="text-xs text-muted-foreground">Site Suitability Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button className="bg-forest-primary hover:bg-forest-primary/90">
                  <MapIcon className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-6 bg-forest-primary/10 text-forest-primary border-forest-primary/20">
            <Satellite className="w-4 h-4 mr-2" />
            Free GeoAI Analysis
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal-primary mb-6 leading-tight">
            Site Suitability Analysis
            <br />
            <span className="text-forest-primary">Solar • BESS • Agriculture</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered site selection for renewable energy and agriculture projects. 
            Analyze terrain, climate, infrastructure, and soil data to identify 
            optimal locations in under 3 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <Button size="lg" className="bg-forest-primary hover:bg-forest-primary/90 text-lg px-8 py-6">
                <MapIcon className="w-5 h-5 mr-2" />
                Start Analysis Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-forest-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal-primary mb-4">
              No Login Required
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jump straight into analyzing your sites with our streamlined workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-forest-primary mt-0.5" />
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-forest-primary/10 to-blue-500/10 rounded-2xl p-8 border border-forest-primary/20">
                <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-forest-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-charcoal-primary mb-2">
                      Interactive Analysis
                    </h3>
                    <p className="text-muted-foreground">
                      Real-time results with downloadable outputs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Workflows */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal-primary mb-4">
              Specialized Analysis Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GeoAI-powered suitability analysis for renewable energy and agriculture projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {workflows.map((workflow, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-forest-primary/10 rounded-lg group-hover:bg-forest-primary/20 transition-colors">
                      <workflow.icon className="w-6 h-6 text-forest-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {workflow.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{workflow.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {workflow.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/">
              <Button size="lg" className="bg-forest-primary hover:bg-forest-primary/90">
                Start Your Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-forest-primary to-forest-primary/80">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Optimal Sites?
          </h2>
          <p className="text-forest-primary/20 text-xl mb-8 max-w-2xl mx-auto">
            No registration, no delays. Start analyzing potential sites for your renewable energy or agriculture projects right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <MapIcon className="w-5 h-5 mr-2" />
                Start Free Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-charcoal-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-forest-primary/20 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Harita Hive" 
                className="w-6 h-6 object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">Harita Hive</h3>
              <p className="text-xs text-white/60">Site Suitability Analysis</p>
            </div>
          </div>
          <p className="text-white/60">
            © 2024 Harita Hive - Free GeoAI Site Analysis Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;