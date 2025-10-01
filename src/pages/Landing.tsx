import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Shield, 
  Home, 
  Car, 
  Sun, 
  Battery, 
  Sprout,
  ChevronRight,
  Layers
} from 'lucide-react';
import logoImage from '@/assets/logo.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'site-suitability',
      title: 'Site Suitability Analysis',
      description: 'AI-powered analysis for solar farms, battery storage, and agricultural projects',
      icon: MapPin,
      route: '/site-suitability',
      badge: 'GeoAI Ready',
      subModules: [
        { name: 'Solar Farm Analysis', icon: Sun },
        { name: 'Battery Storage (BESS)', icon: Battery },
        { name: 'Agriculture Suitability', icon: Sprout }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance Risk Intelligence',
      description: 'Assess risks for empty plots, built homes, and post-disaster impacts with AI-powered analysis',
      icon: Shield,
      badge: 'Risk Analytics',
      subModules: [
        { name: 'Empty Plot Risk Analysis', icon: Layers, route: '/insurance/empty-plot' },
        { name: 'Built Home Risk Analysis', icon: Home, route: '/insurance/home-ready' },
        { name: 'Post-Disaster Impact', icon: Car, route: '/insurance/post-disaster' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Harita Hive</h1>
                <p className="text-xs text-muted-foreground">GeoAI Platform</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/site-suitability')}
                className="text-sm"
              >
                Site Suitability
              </Button>
              <div className="relative group">
                <Button variant="ghost" className="text-sm">
                  Insurance
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:rotate-90" />
                </Button>
                <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-background border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => navigate('/insurance/empty-plot')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    Empty Plot Risk
                  </button>
                  <button
                    onClick={() => navigate('/insurance/home-ready')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    Built Home Risk
                  </button>
                  <button
                    onClick={() => navigate('/insurance/post-disaster')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    Post-Disaster Impact
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Layers className="mr-2 h-4 w-4" />
              Powered by Advanced GeoAI
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Harita Hive GeoAI Platform
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            GeoAI-powered platform for risk intelligence and site suitability analysis
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage cutting-edge machine learning and geospatial intelligence to make data-driven decisions 
            for renewable energy projects, insurance risk assessment, and beyond.
          </p>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Module</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden"
                  onClick={() => module.route ? navigate(module.route) : null}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      {module.badge && (
                        <Badge variant="outline" className="group-hover:border-primary transition-colors">
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {module.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Includes:</p>
                      {module.subModules.map((subModule, idx) => {
                        const SubIcon = subModule.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            onClick={(e) => {
                              if (subModule.route) {
                                e.stopPropagation();
                                navigate(subModule.route);
                              }
                            }}
                          >
                            <SubIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{subModule.name}</span>
                            {subModule.route && (
                              <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {module.route && (
                      <Button 
                        className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        variant="outline"
                      >
                        Get Started
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Coming Soon Card */}
          <Card className="mt-8 border-dashed hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-muted-foreground">
                <Layers className="h-5 w-5" />
                More Modules Coming Soon
              </CardTitle>
              <CardDescription>
                Urban planning, disaster management, environmental monitoring, and more...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Harita Hive. Advanced GeoAI Platform for Risk Intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
