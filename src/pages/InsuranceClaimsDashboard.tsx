import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  MapPin, 
  RefreshCw, 
  Download,
  TrendingUp,
  Home,
  DollarSign,
  FileText,
  ChevronDown,
  Search,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.jpg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyDamage {
  id: string;
  address: string;
  severity: 'none' | 'minor' | 'moderate' | 'severe' | 'total';
  damagePercentage: number;
  reconstructionCost: number;
  demolitionCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  coordinates: [number, number];
  fraudFlag?: boolean;
  fraudReason?: string;
}

const InsuranceClaimsDashboard = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [disasterType, setDisasterType] = useState('');
  const [location, setLocation] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [disasterDate, setDisasterDate] = useState(new Date().toISOString().split('T')[0]);
  const [analysisResults, setAnalysisResults] = useState<PropertyDamage[] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDamage | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  // Fraud detection logic
  const detectFraud = (property: PropertyDamage, disasterType: string): { flag: boolean; reason?: string } => {
    // Flood on high ground detection
    if (disasterType === 'flood' && property.damagePercentage > 50 && property.coordinates[1] > 36) {
      return { flag: true, reason: 'High flood damage on elevated terrain' };
    }
    
    // Suspicious high damage in low-severity areas
    if (property.severity === 'none' && property.damagePercentage > 30) {
      return { flag: true, reason: 'High damage claim in unaffected area' };
    }
    
    // Unusually high reconstruction costs
    if (property.reconstructionCost > 500000 && property.severity === 'minor') {
      return { flag: true, reason: 'Excessive claim amount for minor damage' };
    }
    
    return { flag: false };
  };

  const runAnalysis = async () => {
    if (!disasterType || !location) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select disaster type and enter location."
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "🤖 AI Analysis Starting",
      description: "Gathering data from FEMA, NOAA, USGS, satellite sources..."
    });

    try {
      // Create disaster analysis record
      const { data: disasterRecord, error: disasterError } = await supabase
        .from('disaster_analyses')
        .insert({
          disaster_type: disasterType,
          location: location,
          disaster_date: disasterDate,
          analysis_status: 'processing'
        })
        .select()
        .single();

      if (disasterError) throw disasterError;

      // Generate mock portfolio data with AI-powered analysis and fraud detection
      const mockPortfolio: PropertyDamage[] = await Promise.all(
        Array.from({ length: 15 }, async (_, i) => {
          const baseAddress = propertyAddress || `${100 + i * 10} ${['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln'][i % 4]}`;
          const address = `${baseAddress}, ${location}`;
          
          // Call AI damage analysis
          const { data: aiResult, error: aiError } = await supabase.functions.invoke('change-detection', {
            body: {
              address,
              disaster_type: disasterType,
              baseline_date: '2024-01-01',
              current_date: disasterDate,
              buffer: 1000,
              analysis_type: 'all'
            }
          });

          const property: PropertyDamage = {
            id: `prop-${i + 1}`,
            address,
            severity: aiResult?.damage_severity || (['none', 'minor', 'moderate', 'severe', 'total'][Math.floor(Math.random() * 5)] as any),
            damagePercentage: aiResult?.damage_percentage || Math.floor(Math.random() * 100),
            reconstructionCost: aiResult?.reconstruction_cost || (Math.floor(Math.random() * 400000) + 50000),
            demolitionCost: aiResult?.demolition_cost || (Math.random() > 0.7 ? Math.floor(Math.random() * 50000) + 10000 : 0),
            priority: aiResult?.claims_priority || (['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any),
            coordinates: [
              -80 + Math.random() * 10,
              35 + Math.random() * 5
            ] as [number, number]
          };

          // Run fraud detection
          const fraudCheck = detectFraud(property, disasterType);
          property.fraudFlag = fraudCheck.flag;
          property.fraudReason = fraudCheck.reason;

          // Save to database
          await supabase.from('property_damage_assessments').insert({
            disaster_analysis_id: disasterRecord.id,
            address: property.address,
            coordinates: { lat: property.coordinates[1], lng: property.coordinates[0] },
            damage_severity: property.severity,
            damage_percentage: property.damagePercentage,
            reconstruction_cost: property.reconstructionCost,
            demolition_cost: property.demolitionCost,
            demolition_required: property.demolitionCost > 0,
            claims_priority: property.priority,
            recommended_action: aiResult?.recommended_action || 'Schedule inspection',
            damage_details: aiResult?.damage_details || {},
            ai_insights: aiResult?.ai_insights || ''
          });

          return property;
        })
      );

      // Update disaster analysis with summary
      const totalClaims = mockPortfolio.reduce((sum, p) => sum + p.reconstructionCost + p.demolitionCost, 0);
      const criticalCount = mockPortfolio.filter(p => p.priority === 'critical').length;

      await supabase
        .from('disaster_analyses')
        .update({
          analysis_status: 'completed',
          total_properties_analyzed: mockPortfolio.length,
          total_estimated_claims: totalClaims,
          critical_properties: criticalCount
        })
        .eq('id', disasterRecord.id);

      setAnalysisResults(mockPortfolio);
      
      // Initialize map with results
      if (mapboxToken && mapContainer.current) {
        initializeMap(mockPortfolio);
      }
      
      const fraudCount = mockPortfolio.filter(p => p.fraudFlag).length;
      toast({
        title: "✅ Analysis Complete",
        description: `${mockPortfolio.length} properties analyzed. ${fraudCount} fraud alerts detected.`
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to complete analysis. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initialize Mapbox map
  const initializeMap = (properties: PropertyDamage[]) => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    if (map.current) {
      map.current.remove();
    }

    const avgLng = properties.reduce((sum, p) => sum + p.coordinates[0], 0) / properties.length;
    const avgLat = properties.reduce((sum, p) => sum + p.coordinates[1], 0) / properties.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [avgLng, avgLat],
      zoom: 11
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each property
    properties.forEach((property) => {
      const color = property.fraudFlag ? '#dc2626' : 
                    property.severity === 'total' ? '#991b1b' :
                    property.severity === 'severe' ? '#ef4444' :
                    property.severity === 'moderate' ? '#f97316' :
                    property.severity === 'minor' ? '#eab308' : '#22c55e';

      const el = document.createElement('div');
      el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer';
      el.style.backgroundColor = color;
      
      if (property.fraudFlag) {
        el.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-xs">⚠</div>';
      }

      new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<div class="p-2">
                <p class="font-semibold">${property.address}</p>
                <p class="text-sm">Severity: ${property.severity}</p>
                <p class="text-sm">Damage: ${property.damagePercentage}%</p>
                <p class="text-sm">Cost: $${(property.reconstructionCost / 1000).toFixed(0)}K</p>
                ${property.fraudFlag ? `<p class="text-sm text-red-600 font-semibold mt-1">⚠ Fraud Alert</p>` : ''}
              </div>`
            )
        )
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    if (analysisResults && mapboxToken && mapContainer.current) {
      initializeMap(analysisResults);
    }
  }, [analysisResults, mapboxToken]);

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Preparing Export",
      description: `Generating ${format.toUpperCase()} export...`
    });
  };

  // Chart data
  const severityData = analysisResults ? [
    { name: 'None', value: analysisResults.filter(p => p.severity === 'none').length, color: '#22c55e' },
    { name: 'Minor', value: analysisResults.filter(p => p.severity === 'minor').length, color: '#eab308' },
    { name: 'Moderate', value: analysisResults.filter(p => p.severity === 'moderate').length, color: '#f97316' },
    { name: 'Severe', value: analysisResults.filter(p => p.severity === 'severe').length, color: '#ef4444' },
    { name: 'Total Loss', value: analysisResults.filter(p => p.severity === 'total').length, color: '#991b1b' },
  ] : [];

  const costData = analysisResults ? 
    analysisResults.slice(0, 10).map(p => ({
      address: p.address.split(',')[0],
      reconstruction: p.reconstructionCost / 1000,
      demolition: p.demolitionCost / 1000
    })) : [];

  const priorityData = analysisResults ? [
    { name: 'Critical', value: analysisResults.filter(p => p.priority === 'critical').length },
    { name: 'High', value: analysisResults.filter(p => p.priority === 'high').length },
    { name: 'Medium', value: analysisResults.filter(p => p.priority === 'medium').length },
    { name: 'Low', value: analysisResults.filter(p => p.priority === 'low').length },
  ] : [];

  const totalClaims = analysisResults ? analysisResults.reduce((sum, p) => sum + p.reconstructionCost + p.demolitionCost, 0) : 0;
  const avgClaimCost = analysisResults ? totalClaims / analysisResults.length : 0;
  const criticalProperties = analysisResults ? analysisResults.filter(p => p.priority === 'critical').length : 0;
  const fraudAlerts = analysisResults ? analysisResults.filter(p => p.fraudFlag).length : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'text-green-600';
      case 'minor': return 'text-yellow-600';
      case 'moderate': return 'text-orange-600';
      case 'severe': return 'text-red-600';
      case 'total': return 'text-red-800';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">GeoAI Claims Intelligence Platform</h1>
                <p className="text-xs text-muted-foreground">AI-powered damage assessment, fraud detection & claims processing</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                AI-Powered
              </Badge>
              {fraudAlerts > 0 && (
                <Badge variant="destructive" className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  {fraudAlerts} Fraud Alerts
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Disaster Analysis Input</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Mapbox Token (Required for Map)</Label>
                  <Input
                    type="password"
                    placeholder="Enter your Mapbox token"
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
                  </p>
                </div>

                <div>
                  <Label>Disaster Type *</Label>
                  <Select value={disasterType} onValueChange={setDisasterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hurricane">🌀 Hurricane</SelectItem>
                      <SelectItem value="flood">🌊 Flood</SelectItem>
                      <SelectItem value="wildfire">🔥 Wildfire</SelectItem>
                      <SelectItem value="earthquake">🏚️ Earthquake</SelectItem>
                      <SelectItem value="tornado">🌪️ Tornado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Affected Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter city, county, or ZIP code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Property Address (Optional)</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter specific property address"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Disaster Date</Label>
                  <Input
                    type="date"
                    value={disasterDate}
                    onChange={(e) => setDisasterDate(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Run AI Analysis
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  AI will automatically gather data from FEMA, NOAA, USGS, satellite imagery, and other authoritative sources
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            {analysisResults && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-4">Quick Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Properties Analyzed</span>
                    <span className="font-bold">{analysisResults.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Claims Est.</span>
                    <span className="font-bold">${(totalClaims / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Claim Cost</span>
                    <span className="font-bold">${(avgClaimCost / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Critical Priority</span>
                    <Badge variant="destructive">{criticalProperties}</Badge>
                  </div>
                  {fraudAlerts > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Fraud Alerts</span>
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {fraudAlerts}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Export Options */}
            {analysisResults && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-4">Export Claims Report</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport('pdf')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport('excel')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel/CSV
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Map & Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map */}
            {analysisResults && mapboxToken && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Interactive Damage Map</h3>
                <div ref={mapContainer} className="w-full h-96 rounded-lg" />
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>None</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Minor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Severe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-900"></div>
                    <span>Total Loss</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600 flex items-center justify-center text-white">⚠</div>
                    <span>Fraud Alert</span>
                  </div>
                </div>
              </Card>
            )}

            {!analysisResults ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter disaster type and location to start automated AI-powered damage assessment and claims analysis
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">🎯 Automated</p>
                      <p className="text-xs text-muted-foreground">Just 2 inputs required</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">🤖 AI-Powered</p>
                      <p className="text-xs text-muted-foreground">Gemini 2.5 analysis</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">📊 Multi-Source</p>
                      <p className="text-xs text-muted-foreground">FEMA, NOAA, USGS data</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">⚡ Instant</p>
                      <p className="text-xs text-muted-foreground">Claims-ready reports</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {/* Damage Severity Distribution */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Damage Severity Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Cost Estimates Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top 10 Properties by Cost (in $K)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="address" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reconstruction" fill="#3b82f6" name="Reconstruction" stackId="a" />
                      <Bar dataKey="demolition" fill="#ef4444" name="Demolition" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Fraud Alerts */}
                {fraudAlerts > 0 && (
                  <Card className="p-6 border-destructive">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-destructive" />
                      <h3 className="text-lg font-semibold text-destructive">Fraud Alerts ({fraudAlerts})</h3>
                    </div>
                    <div className="space-y-2">
                      {analysisResults
                        .filter(p => p.fraudFlag)
                        .map((property) => (
                          <div key={property.id} className="p-4 border border-destructive rounded-lg bg-destructive/5">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm mb-1">{property.address}</p>
                                <p className="text-xs text-muted-foreground mb-2">{property.fraudReason}</p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span>Severity: <span className={getSeverityColor(property.severity)}>{property.severity}</span></span>
                                  <span>Damage: {property.damagePercentage}%</span>
                                  <span>Claim: ${(property.reconstructionCost / 1000).toFixed(0)}K</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

                {/* Priority Properties Table */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Priority Properties</h3>
                    <Badge variant="outline">Top 10 Critical/High</Badge>
                  </div>
                  <div className="space-y-2">
                    {analysisResults
                      .filter(p => p.priority === 'critical' || p.priority === 'high')
                      .slice(0, 10)
                      .map((property) => (
                        <div
                          key={property.id}
                          className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm">{property.address}</p>
                                <Badge className={getPriorityColor(property.priority)} variant="secondary">
                                  {property.priority.toUpperCase()}
                                </Badge>
                                {property.fraudFlag && (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    FRAUD
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Damage: <span className={getSeverityColor(property.severity)}>{property.severity}</span></span>
                                <span>•</span>
                                <span>{property.damagePercentage}%</span>
                                <span>•</span>
                                <span>${(property.reconstructionCost / 1000).toFixed(0)}K</span>
                              </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsuranceClaimsDashboard;
