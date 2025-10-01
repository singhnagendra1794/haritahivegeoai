import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedRegionSelector } from '@/components/suitability/EnhancedRegionSelector';
import { SuitabilityMap } from '@/components/suitability/SuitabilityMap';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, MapPin, RefreshCw, ArrowLeft, Calendar, DollarSign, Home, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AnalysisStep = 'configuration' | 'analysis' | 'results';

interface Region {
  type: 'buffer';
  data: {
    center: [number, number];
    radius: number;
    address: string;
  };
  name: string;
}

interface DamageAssessment {
  damage_flag: boolean;
  damage_severity: 'none' | 'minor' | 'moderate' | 'severe' | 'total';
  damage_percentage: number;
  change_score: number;
  reconstruction_cost: number;
  demolition_required: boolean;
  demolition_cost: number;
  claims_priority: 'low' | 'medium' | 'high' | 'critical';
  recommended_action: string;
  damage_details: {
    roof_damage: number;
    structure_damage: number;
    water_damage: number;
    vegetation_loss: number;
  };
  ai_insights?: string;
  ai_full_analysis?: string;
  data_sources_used?: string[];
  visualization_url?: string;
  before_image_url?: string;
  after_image_url?: string;
}

interface AnalysisConfig {
  region?: Region;
  disaster_type?: string;
  baseline_date?: string;
  current_date?: string;
}

interface AnalysisResult {
  projectId: string;
  assessment: DamageAssessment;
  provenance: {
    baseline_date: string;
    current_date: string;
    datasets: string[];
    analysis_date: string;
  };
}

const InsurancePostDisaster = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('configuration');
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    baseline_date: '2024-01-01',
    current_date: new Date().toISOString().split('T')[0],
    disaster_type: 'hurricane'
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRegionSelect = (region: Region) => {
    setAnalysisConfig(prev => ({ ...prev, region }));
  };

  const runAnalysis = async () => {
    if (!analysisConfig.region) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a property location."
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "🤖 AI Analysis Starting",
      description: "Gathering data from FEMA, NOAA, USGS, satellite imagery... AI analyzing damage..."
    });

    try {
      const { data: result, error } = await supabase.functions.invoke('change-detection', {
        body: {
          address: analysisConfig.region.data.address,
          coordinates: {
            lat: analysisConfig.region.data.center[1],
            lng: analysisConfig.region.data.center[0]
          },
          baseline_date: analysisConfig.baseline_date,
          current_date: analysisConfig.current_date,
          buffer: analysisConfig.region.data.radius * 1000, // Convert to meters
          analysis_type: 'all',
          disaster_type: analysisConfig.disaster_type
        }
      });

      if (error) throw error;
      
      setAnalysisResult({
        projectId: crypto.randomUUID(),
        assessment: result,
        provenance: result.provenance
      });
      setCurrentStep('results');
      
      toast({
        title: "✅ AI Analysis Complete",
        description: "Claim-ready damage assessment with cost estimates generated!"
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to complete damage assessment. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('configuration');
    setAnalysisConfig({
      baseline_date: '2024-01-01',
      current_date: new Date().toISOString().split('T')[0],
      disaster_type: 'hurricane'
    });
    setAnalysisResult(null);
  };

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
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">AI-Powered Disaster Claims Intelligence</h1>
                  <p className="text-xs text-muted-foreground">Automated damage assessment • Just input disaster & location</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="hidden md:flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" />
              Insurance Risk Intelligence
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {currentStep === 'configuration' && (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Step 1: Property Location</h2>
                  </div>
                  <EnhancedRegionSelector 
                    onSelect={handleRegionSelect}
                    projectType="Damage Assessment"
                  />
                </Card>

                {analysisConfig.region && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Step 2: Disaster Details</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Disaster Type</Label>
                        <Select
                          value={analysisConfig.disaster_type}
                          onValueChange={(value) => setAnalysisConfig(prev => ({ ...prev, disaster_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hurricane">Hurricane</SelectItem>
                            <SelectItem value="flood">Flood</SelectItem>
                            <SelectItem value="wildfire">Wildfire</SelectItem>
                            <SelectItem value="earthquake">Earthquake</SelectItem>
                            <SelectItem value="tornado">Tornado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Baseline Date (Before)</Label>
                        <Input
                          type="date"
                          value={analysisConfig.baseline_date}
                          onChange={(e) => setAnalysisConfig(prev => ({ ...prev, baseline_date: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>Current Date (After)</Label>
                        <Input
                          type="date"
                          value={analysisConfig.current_date}
                          onChange={(e) => setAnalysisConfig(prev => ({ ...prev, current_date: e.target.value }))}
                        />
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setCurrentStep('analysis')}
                      >
                        Continue to Analysis
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {currentStep === 'analysis' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Step 3: Run Damage Assessment</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Assessment Configuration</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>📍 Property: {analysisConfig.region?.data.address}</p>
                      <p>🌪️ Disaster: {analysisConfig.disaster_type}</p>
                      <p>📅 Before: {analysisConfig.baseline_date}</p>
                      <p>📅 After: {analysisConfig.current_date}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Imagery...
                      </>
                    ) : (
                      'Run Damage Assessment'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentStep('configuration')}
                  >
                    Back to Configuration
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 'results' && analysisResult && (
              <>
                {/* Damage Summary Card */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Damage Assessment Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Damage Detected</span>
                      {analysisResult.assessment.damage_flag ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Severity</Label>
                      <p className={`text-lg font-bold ${getSeverityColor(analysisResult.assessment.damage_severity)}`}>
                        {analysisResult.assessment.damage_severity.toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Damage Extent</Label>
                      <p className="text-2xl font-bold">{analysisResult.assessment.damage_percentage}%</p>
                    </div>

                    <div className="pt-2 border-t">
                      <Badge className={getPriorityColor(analysisResult.assessment.claims_priority)}>
                        {analysisResult.assessment.claims_priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Cost Estimates Card */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Cost Estimates</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Reconstruction</Label>
                      <p className="text-xl font-bold">
                        ${(analysisResult.assessment.reconstruction_cost / 1000).toFixed(0)}K
                      </p>
                    </div>

                    {analysisResult.assessment.demolition_required && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Demolition</Label>
                        <p className="text-xl font-bold">
                          ${(analysisResult.assessment.demolition_cost / 1000).toFixed(0)}K
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <Label className="text-xs text-muted-foreground">Total Estimated</Label>
                      <p className="text-2xl font-bold text-primary">
                        ${((analysisResult.assessment.reconstruction_cost + analysisResult.assessment.demolition_cost) / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Damage Details Card */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Damage Breakdown</h2>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(analysisResult.assessment.damage_details).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className="font-medium">{Math.round(value * 100)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* AI Insights Card */}
                {analysisResult.assessment.ai_insights && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">🤖 AI-Powered Analysis</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-line">{analysisResult.assessment.ai_insights}</p>
                      </div>
                      {analysisResult.assessment.data_sources_used && (
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">Data Sources:</p>
                          <p>{analysisResult.assessment.data_sources_used.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Recommendations Card */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Claims Processing Action</h2>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{analysisResult.assessment.recommended_action}</p>
                  </div>
                  {analysisResult.assessment.demolition_required && (
                    <Badge variant="destructive" className="mt-3">
                      ⚠️ Demolition Required
                    </Badge>
                  )}
                </Card>

                <Button variant="outline" className="w-full" onClick={handleRestart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Assess Another Property
                </Button>
              </>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[calc(100vh-12rem)] sticky top-24">
              <SuitabilityMap
                region={analysisConfig.region}
                result={analysisResult ? {
                  projectId: analysisResult.projectId,
                  suitabilityData: analysisResult.assessment,
                  topSites: [],
                  breakdown: {}
                } : undefined}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsurancePostDisaster;
