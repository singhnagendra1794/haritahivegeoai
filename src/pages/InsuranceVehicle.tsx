import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedRegionSelector } from '@/components/suitability/EnhancedRegionSelector';
import { SuitabilityMap } from '@/components/suitability/SuitabilityMap';
import { ResultsPanel } from '@/components/suitability/ResultsPanel';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Car, MapPin, Download, RefreshCw, ArrowLeft } from 'lucide-react';
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

const InsuranceVehicle = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('region-factors');
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    insuranceType: 'vehicle'
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
      description: "Running vehicle insurance risk analysis..."
    });

    try {
      const sessionId = crypto.randomUUID();
      
      const { data: result, error } = await supabase.functions.invoke('insurance-risk-analysis', {
        body: {
          insuranceType: 'vehicle',
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
        description: "Vehicle insurance risk assessment generated successfully!"
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

  const downloadResults = async (format: 'geotiff' | 'png' | 'pdf') => {
    if (!analysisResult) return;

    toast({
      title: "Download Starting",
      description: `Generating ${format.toUpperCase()} file...`
    });

    try {
      if (format === 'pdf') {
        const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
          body: {
            result: analysisResult,
            projectType: 'Vehicle Insurance Risk',
            region: analysisConfig.region,
            weights: analysisConfig.factors!.weights
          }
        });
        
        if (error) throw error;

        const blob = new Blob([data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicle-insurance-risk-report-${analysisResult.projectId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Download Complete",
          description: "PDF report has been downloaded."
        });
      } else {
        const { data, error } = await supabase.functions.invoke('download-results', {
          body: {
            projectId: analysisResult.projectId,
            format: format
          }
        });
        
        if (error) throw error;

        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicle-insurance-risk-${analysisResult.projectId}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Download Complete",
          description: `${format.toUpperCase()} file has been downloaded.`
        });
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download results. Please try again."
      });
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('region-factors');
    setAnalysisConfig({ insuranceType: 'vehicle' });
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logoImage} alt="Harita Hive Logo" className="h-10 w-10 rounded-lg object-cover" />
              <div>
                <h1 className="text-xl font-bold text-primary">Harita Hive</h1>
                <p className="text-xs text-muted-foreground">Insurance Risk Intelligence</p>
              </div>
            </Link>
            <Badge variant="outline" className="ml-2">
              <Car className="w-3 h-3 mr-1" />
              Vehicle Insurance
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { step: 'region-factors', label: 'Location & Factors', icon: MapPin },
              { step: 'analysis', label: 'Run Analysis', icon: Car },
              { step: 'results', label: 'View Results', icon: Download }
            ].map((item, index) => {
              const isActive = currentStep === item.step;
              const isCompleted = ['region-factors', 'analysis'].indexOf(item.step as any) < ['region-factors', 'analysis'].indexOf(currentStep as any);
              
              return (
                <React.Fragment key={item.step}>
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-primary text-primary-foreground shadow-lg' : 
                    isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isActive ? 'bg-primary-foreground text-primary' : 
                      isCompleted ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {index < 2 && (
                    <div className={`h-0.5 w-12 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {currentStep === 'region-factors' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <EnhancedRegionSelector 
              onSelect={handleRegionSelect}
              projectType="Vehicle Insurance"
            />
            <InsuranceFactorSelector 
              insuranceType="vehicle"
              onSelect={handleFactorSelect}
            />
          </div>
        )}

        {currentStep === 'analysis' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Analyze</h2>
                <p className="text-muted-foreground">
                  Click the button below to run vehicle insurance risk analysis for your selected location.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance Type:</span>
                  <span className="font-medium">Vehicle Insurance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{analysisConfig.region?.data.address || 'Custom coordinates'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buffer Radius:</span>
                  <span className="font-medium">{analysisConfig.region?.data.radius}km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Factors:</span>
                  <span className="font-medium">{analysisConfig.factors?.selectedFactors.length || 0} selected</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={runAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Car className="w-4 h-4 mr-2" />
                    Run Vehicle Risk Analysis
                  </>
                )}
              </Button>
            </Card>
          </div>
        )}

        {currentStep === 'results' && analysisResult && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <SuitabilityMap result={analysisResult} region={analysisConfig.region!} />
              <ResultsPanel 
                result={analysisResult} 
                projectType="Vehicle Insurance Risk" 
                onDownload={downloadResults}
              />
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Download Results</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => downloadResults('png')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button onClick={() => downloadResults('geotiff')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download GeoTIFF
                </Button>
                <Button onClick={() => downloadResults('pdf')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button onClick={resetAnalysis} variant="secondary" className="ml-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default InsuranceVehicle;
