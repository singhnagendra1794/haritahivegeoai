import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedRegionSelector } from '@/components/suitability/EnhancedRegionSelector';
import { SuitabilityMap } from '@/components/suitability/SuitabilityMap';
import { ResultsPanel } from '@/components/suitability/ResultsPanel';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Home, MapPin, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.jpg';
import { InsuranceFactorSelector } from '@/components/insurance/InsuranceFactorSelector';

type AnalysisStep = 'region-factors' | 'analysis' | 'results';

interface Region {
  type: 'buffer';
  data: {
    center: [number, number];
    radius: number;
    address: string;
  };
  name: string;
}

interface FactorConfig {
  selectedFactors: string[];
  weights: Record<string, number>;
}

interface AnalysisConfig {
  insuranceType: string;
  region?: Region;
  factors?: FactorConfig;
}

interface AnalysisResult {
  projectId: string;
  suitabilityData: any;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
    address?: string;
  }>;
  breakdown: Record<string, number>;
}

const InsuranceHome = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('region-factors');
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    insuranceType: 'home'
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRegionSelect = (region: Region) => {
    setAnalysisConfig(prev => ({ ...prev, region }));
  };

  const handleFactorSelect = (factors: FactorConfig) => {
    setAnalysisConfig(prev => ({ ...prev, factors }));
    setCurrentStep('analysis');
  };

  const runAnalysis = async () => {
    if (!analysisConfig.region || !analysisConfig.factors) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete region and factor selection."
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "Analysis Starting",
      description: "Running home insurance risk analysis..."
    });

    try {
      const sessionId = crypto.randomUUID();
      
      const { data: result, error } = await supabase.functions.invoke('insurance-risk-analysis', {
        body: {
          insuranceType: 'home',
          weights: analysisConfig.factors.weights,
          selectedFactors: analysisConfig.factors.selectedFactors,
          region: {
            center: analysisConfig.region.data.center,
            bufferRadius: analysisConfig.region.data.radius,
            address: analysisConfig.region.data.address
          },
          sessionId: sessionId,
        }
      });

      if (error) throw error;
      setAnalysisResult(result);
      setCurrentStep('results');
      
      toast({
        title: "Analysis Complete",
        description: "Home insurance risk assessment generated successfully!"
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to complete risk analysis. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('region-factors');
    setAnalysisConfig({ insuranceType: 'home' });
    setAnalysisResult(null);
  };

  const handleDownload = async (format: 'geotiff' | 'png' | 'pdf') => {
    toast({
      title: "Preparing Download",
      description: `Generating ${format.toUpperCase()} export...`
    });
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
                  <h1 className="text-xl font-bold text-foreground">Home Insurance Risk Analysis</h1>
                  <p className="text-xs text-muted-foreground">Comprehensive home property risk assessment</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="hidden md:flex items-center gap-2">
              <Home className="h-3 w-3" />
              Home Risk
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Step 1 & 2: Region and Factors */}
            {currentStep === 'region-factors' && (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Step 1: Select Location</h2>
                  </div>
                  <EnhancedRegionSelector 
                    onSelect={handleRegionSelect}
                    projectType="Home Insurance"
                  />
                </Card>

                {analysisConfig.region && (
                  <InsuranceFactorSelector
                    insuranceType="home"
                    onSelect={handleFactorSelect}
                  />
                )}
              </>
            )}

            {/* Step 3: Run Analysis */}
            {currentStep === 'analysis' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Step 3: Run Analysis</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Analysis Configuration</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>📍 Location: {analysisConfig.region?.data.address}</p>
                      <p>🎯 Buffer: {analysisConfig.region?.data.radius} km</p>
                      <p>⚖️ Factors: {analysisConfig.factors?.selectedFactors.length}</p>
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
                        Analyzing...
                      </>
                    ) : (
                      'Run Risk Analysis'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentStep('region-factors')}
                  >
                    Back to Configuration
                  </Button>
                </div>
              </Card>
            )}

            {/* Results Panel */}
            {currentStep === 'results' && analysisResult && (
              <>
                <ResultsPanel 
                  result={analysisResult} 
                  projectType="Home Insurance"
                  onDownload={handleDownload}
                />
                <Button variant="outline" className="w-full" onClick={handleRestart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start New Analysis
                </Button>
              </>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[calc(100vh-12rem)] sticky top-24">
              <SuitabilityMap
                region={analysisConfig.region}
                result={analysisResult}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsuranceHome;
