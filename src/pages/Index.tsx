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
  Building2,
  AlertTriangle,
  Shield,
  Map as MapIcon,
  Zap,
  Users,
  Globe
} from 'lucide-react';
import logoImage from '@/assets/logo.jpg';

const Index = () => {
  const workflows = [
    {
      icon: Sprout,
      title: "Crop Health Analysis",
      description: "NDVI/NDWI monitoring with ML-powered yield predictions",
      badge: "Agriculture"
    },
    {
      icon: AlertTriangle,
      title: "Disaster Response",
      description: "Real-time flood simulation and emergency planning",
      badge: "Emergency"
    },
    {
      icon: Building2,
      title: "Urban Planning",
      description: "Smart city development with population analytics",
      badge: "Planning"
    }
  ];

  const stats = [
    { value: "50K+", label: "Datasets Processed" },
    { value: "15+", label: "AI Models" },
    { value: "500+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" }
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
                <p className="text-xs text-muted-foreground">GeoAI Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/app">
                <Button size="sm" className="bg-forest-primary hover:bg-forest-primary/90">
                  Launch Platform
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
            Next-Generation GeoAI
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal-primary mb-6 leading-tight">
            GeoAI Platform
            <br />
            <span className="text-forest-primary">Intelligent Mapping & Analytics</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform spatial data into actionable insights with advanced AI models, 
            real-time processing, and sector-specific tools for agriculture, urban planning, 
            disaster management, and defense applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/app">
              <Button size="lg" className="bg-forest-primary hover:bg-forest-primary/90 text-lg px-8 py-6">
                <MapIcon className="w-5 h-5 mr-2" />
                Launch Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Users className="w-5 h-5 mr-2" />
                Sign In
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

      {/* Map Preview */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal-primary mb-4">
              Interactive Mapping at Your Fingertips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualize, analyze, and make decisions with our powerful mapping platform
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-forest-primary/10 to-blue-500/10 rounded-2xl p-8 border border-forest-primary/20">
              <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-forest-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-charcoal-primary mb-2">
                    Interactive Map Preview
                  </h3>
                  <p className="text-muted-foreground">
                    Real-time geospatial analysis and visualization
                  </p>
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
              Sector-Specific Workflows
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Purpose-built tools for agriculture, disaster management, urban planning, and more
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
            <Link to="/app">
              <Button size="lg" variant="outline" className="group">
                Explore All Tools
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal-primary mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for advanced geospatial analysis and decision making
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "AI-Powered Analysis", desc: "Advanced machine learning models" },
              { icon: Zap, title: "Real-time Processing", desc: "Instant results and live updates" },
              { icon: BarChart3, title: "Rich Analytics", desc: "Comprehensive data visualization" },
              { icon: Shield, title: "Enterprise Security", desc: "Military-grade data protection" }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="p-3 bg-forest-primary/10 rounded-lg inline-block">
                      <feature.icon className="w-6 h-6 text-forest-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-charcoal-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-forest-primary to-forest-primary/80">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Spatial Analysis?
          </h2>
          <p className="text-forest-primary/20 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals using Harita Hive for intelligent mapping and analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <MapIcon className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-forest-primary">
                Learn More
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
              <p className="text-xs text-white/60">GeoAI Platform</p>
            </div>
          </div>
          <p className="text-white/60">
            © 2024 Harita Hive GeoAI Platform - Intelligent Mapping & Analytics
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
