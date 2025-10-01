import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Car, Building2, Upload, ArrowLeft, Shield, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import logoImage from '@/assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

const InsuranceLanding = () => {
  const navigate = useNavigate();
  
  const insuranceModules = [
    {
      id: 'mortgage',
      title: 'Mortgage Insurance Risk',
      description: 'Analyze property risk factors for mortgage underwriting including flood zones, wildfire risk, and infrastructure access.',
      icon: Building2,
      route: '/insurance/mortgage',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      factors: ['Flood Zone', 'Wildfire Risk', 'Slope/Elevation', 'Infrastructure']
    },
    {
      id: 'home',
      title: 'Home Insurance Risk',
      description: 'Comprehensive home insurance risk assessment covering structure condition, natural hazards, and emergency access.',
      icon: Home,
      route: '/insurance/home',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      factors: ['Structure/Roof', 'Flood Risk', 'Wildfire Risk', 'Road Access']
    },
    {
      id: 'vehicle',
      title: 'Vehicle Insurance Risk',
      description: 'Evaluate vehicle insurance risks based on road density, traffic patterns, environmental hazards, and terrain.',
      icon: Car,
      route: '/insurance/vehicle',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      factors: ['Road Density', 'Flood Risk', 'Crime Proxy', 'Terrain Hazard']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Insurance Risk Intelligence</h1>
                  <p className="text-xs text-muted-foreground">AI-powered property and vehicle risk analysis</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/insurance/triage')}
              >
                <AlertTriangle className="h-4 w-4" />
                Claims Triage
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/insurance/portfolio')}
              >
                <BarChart3 className="h-4 w-4" />
                Portfolio
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/insurance/admin')}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Select Insurance Risk Analysis</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage GeoAI and multi-source geospatial data to assess insurance risks with precision. 
            Choose your analysis type below to get started.
          </p>
        </div>

        {/* Insurance Module Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {insuranceModules.map((module) => (
            <Link key={module.id} to={module.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Key Risk Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.factors.map((factor) => (
                          <Badge key={factor} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Start Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Batch Mode Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-dashed hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Upload className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle>Batch Analysis Mode</CardTitle>
                    <CardDescription>Upload CSV with multiple addresses for portfolio-level risk analysis</CardDescription>
                  </div>
                </div>
                <Link to="/insurance/batch">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                 <div className="flex items-center gap-2">
                   <Badge variant="outline">
                     Portfolio Analysis
                   </Badge>
                   <span>Analyze 100+ properties at once</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Badge variant="outline">
                     Bulk Export
                   </Badge>
                   <span>CSV + PDF reports</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Source Data</h3>
            <p className="text-sm text-muted-foreground">
              FEMA flood zones, USGS DEM, Sentinel-2, ESA WorldCover, OSM data integration
            </p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Risk Heatmaps</h3>
            <p className="text-sm text-muted-foreground">
              Visual risk scoring with Gold/Silver/Bronze rankings for properties
            </p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Export & API</h3>
            <p className="text-sm text-muted-foreground">
              PDF reports, GeoTIFF, PNG maps, and JSON API for integrations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsuranceLanding;
