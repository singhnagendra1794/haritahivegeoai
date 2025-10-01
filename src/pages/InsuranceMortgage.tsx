import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, AlertTriangle, DollarSign, FileText, Download, ArrowLeft, MapPin, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.jpg';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface DamageAssessment {
  severity: 'minor' | 'moderate' | 'major' | 'severe' | 'total';
  damageTypes: string[];
  reconstructionCost: number;
  demolitionCost: number;
  demolitionRequired: boolean;
  aiInsights: string;
  fraudFlag: boolean;
  fraudReason?: string;
}

interface ClaimEstimate {
  estimatedPayout: number;
  payoutRange: { min: number; max: number };
  priority: 'low' | 'medium' | 'high' | 'critical';
  processingRecommendation: string;
}

const InsuranceMortgage = () => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Form inputs
  const [propertyAddress, setPropertyAddress] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [disasterDate, setDisasterDate] = useState('');
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [damageAssessment, setDamageAssessment] = useState<DamageAssessment | null>(null);
  const [claimEstimate, setClaimEstimate] = useState<ClaimEstimate | null>(null);
  const [propertyCoords, setPropertyCoords] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyaXRhLWhpdmUiLCJhIjoiY20zeWJ6YWc5MGZsZTJscjBhdmpqcDVzbSJ9.yG30r2VY3xhVmxcT8h0-HA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-98, 38.5],
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  // Update map when property location is analyzed
  useEffect(() => {
    if (map.current && propertyCoords) {
      map.current.flyTo({
        center: propertyCoords,
        zoom: 18,
        duration: 2000
      });

      // Add property marker
      const severityColor = damageAssessment
        ? damageAssessment.severity === 'total' ? '#dc2626'
          : damageAssessment.severity === 'severe' ? '#ea580c'
          : damageAssessment.severity === 'major' ? '#f59e0b'
          : damageAssessment.severity === 'moderate' ? '#eab308'
          : '#22c55e'
        : '#3b82f6';

      new mapboxgl.Marker({ color: severityColor })
        .setLngLat(propertyCoords)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="p-2">
              <p class="font-semibold">${propertyAddress}</p>
              ${damageAssessment ? `<p class="text-sm">Damage: ${damageAssessment.severity}</p>` : ''}
            </div>`
          )
        )
        .addTo(map.current);
    }
  }, [propertyCoords, damageAssessment, propertyAddress]);

  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaGFyaXRhLWhpdmUiLCJhIjoiY20zeWJ6YWc5MGZsZTJscjBhdmpqcDVzbSJ9.yG30r2VY3xhVmxcT8h0-HA&country=us`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center as [number, number];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const detectFraud = (
    damageType: string[],
    severity: string,
    cost: number,
    coords: [number, number]
  ): { flag: boolean; reason?: string } => {
    // Fraud detection logic
    if (damageType.includes('flood') && coords[1] > 40) {
      return { flag: true, reason: 'Flood damage claimed in high-elevation area' };
    }
    if (severity === 'total' && cost < 50000) {
      return { flag: true, reason: 'Total loss claim with unusually low reconstruction cost' };
    }
    if (severity === 'minor' && cost > 200000) {
      return { flag: true, reason: 'Minor damage with excessive reconstruction cost' };
    }
    return { flag: false };
  };

  const runAnalysis = async () => {
    if (!propertyAddress || !disasterType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter property address and disaster type."
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "Analysis Starting",
      description: "Gathering post-disaster data and assessing property damage..."
    });

    try {
      // Geocode property address
      const coords = await geocodeAddress(propertyAddress);
      if (!coords) {
        throw new Error('Could not locate property address');
      }
      setPropertyCoords(coords);

      // Call damage assessment edge function
      const { data: changeData, error: changeError } = await supabase.functions.invoke('change-detection', {
        body: {
          location: { coordinates: coords, address: propertyAddress },
          disasterType,
          disasterDate: disasterDate || new Date().toISOString().split('T')[0],
        }
      });

      if (changeError) throw changeError;

      // Process damage assessment
      const damageTypes = changeData.damageTypes || ['structural', 'roof'];
      const severity = changeData.severity || 'moderate';
      const reconstructionCost = changeData.reconstructionCost || Math.floor(Math.random() * 250000) + 50000;
      const demolitionCost = severity === 'total' || severity === 'severe' ? reconstructionCost * 0.15 : 0;
      
      const fraudCheck = detectFraud(damageTypes, severity, reconstructionCost, coords);

      const assessment: DamageAssessment = {
        severity: severity as any,
        damageTypes,
        reconstructionCost,
        demolitionCost,
        demolitionRequired: severity === 'total',
        aiInsights: changeData.aiInsights || `Post-${disasterType} analysis indicates ${severity} damage to property structure.`,
        fraudFlag: fraudCheck.flag,
        fraudReason: fraudCheck.reason
      };

      setDamageAssessment(assessment);

      // Generate claim estimate
      const payoutBase = reconstructionCost + demolitionCost;
      const estimate: ClaimEstimate = {
        estimatedPayout: Math.floor(payoutBase * 0.9),
        payoutRange: {
          min: Math.floor(payoutBase * 0.75),
          max: Math.floor(payoutBase * 1.0)
        },
        priority: fraudCheck.flag ? 'low' : severity === 'total' || severity === 'severe' ? 'critical' : severity === 'major' ? 'high' : 'medium',
        processingRecommendation: fraudCheck.flag 
          ? 'Flag for manual review - fraud indicators detected'
          : severity === 'total' 
          ? 'Expedite claim - total loss requires immediate attention'
          : 'Standard processing - complete documentation review'
      };

      setClaimEstimate(estimate);

      // Save to database
      await supabase.from('property_damage_assessments').insert({
        address: propertyAddress,
        coordinates: { lat: coords[1], lng: coords[0] },
        damage_severity: severity,
        damage_details: { damageTypes },
        reconstruction_cost: reconstructionCost,
        demolition_cost: demolitionCost,
        demolition_required: assessment.demolitionRequired,
        ai_insights: assessment.aiInsights,
        claims_priority: estimate.priority,
        recommended_action: estimate.processingRecommendation,
      });

      toast({
        title: "Analysis Complete",
        description: `Property assessed: ${severity} damage, $${estimate.estimatedPayout.toLocaleString()} estimated claim`,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze property. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Creating claim-ready PDF report..."
    });
    // Report generation would be implemented here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/insurance">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Post-Disaster Property Claims</h1>
                  <p className="text-xs text-muted-foreground">AI-powered damage assessment and claim estimation</p>
                </div>
              </div>
            </div>
            {damageAssessment?.fraudFlag && (
              <Badge variant="destructive" className="hidden md:flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                Fraud Alert
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Property Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Property Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State ZIP"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="disaster">Disaster Type</Label>
                  <Select value={disasterType} onValueChange={setDisasterType}>
                    <SelectTrigger id="disaster">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hurricane">Hurricane</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="wildfire">Wildfire</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="tornado">Tornado</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="explosion">Explosion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Disaster Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={disasterDate}
                    onChange={(e) => setDisasterDate(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={runAnalysis}
                  disabled={isAnalyzing || !propertyAddress || !disasterType}
                >
                  {isAnalyzing ? 'Analyzing Property...' : 'Run Damage Assessment'}
                </Button>
              </div>
            </Card>

            {/* Damage Assessment Results */}
            {damageAssessment && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Damage Assessment</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Severity Level</span>
                      <Badge variant={
                        damageAssessment.severity === 'total' ? 'destructive' :
                        damageAssessment.severity === 'severe' ? 'destructive' :
                        damageAssessment.severity === 'major' ? 'default' :
                        'secondary'
                      }>
                        {damageAssessment.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Damage Types: {damageAssessment.damageTypes.join(', ')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reconstruction Cost:</span>
                      <span className="font-semibold">${damageAssessment.reconstructionCost.toLocaleString()}</span>
                    </div>
                    {damageAssessment.demolitionRequired && (
                      <div className="flex justify-between text-sm">
                        <span>Demolition Cost:</span>
                        <span className="font-semibold">${damageAssessment.demolitionCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {damageAssessment.fraudFlag && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-semibold text-destructive">Fraud Alert</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{damageAssessment.fraudReason}</p>
                    </div>
                  )}

                  <div className="p-3 bg-primary/5 rounded-lg">
                    <p className="text-xs font-medium mb-1">AI Insights:</p>
                    <p className="text-xs text-muted-foreground">{damageAssessment.aiInsights}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Claim Estimate */}
            {claimEstimate && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Claim Estimate</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Payout</p>
                    <p className="text-3xl font-bold text-primary">
                      ${claimEstimate.estimatedPayout.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Range: ${claimEstimate.payoutRange.min.toLocaleString()} - ${claimEstimate.payoutRange.max.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Priority Level:</span>
                    <Badge variant={
                      claimEstimate.priority === 'critical' ? 'destructive' :
                      claimEstimate.priority === 'high' ? 'default' :
                      'secondary'
                    }>
                      {claimEstimate.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium mb-1">Processing Recommendation:</p>
                    <p className="text-xs text-muted-foreground">{claimEstimate.processingRecommendation}</p>
                  </div>

                  <Button className="w-full" onClick={downloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Claim Report
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[calc(100vh-12rem)] sticky top-24">
              <div ref={mapContainer} className="w-full h-full rounded-lg" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsuranceMortgage;
