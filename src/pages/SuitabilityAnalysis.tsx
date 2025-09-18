import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, MapPin, BarChart3, Settings } from 'lucide-react';
import { EnhancedProjectTypeSelector } from '@/components/suitability/EnhancedProjectTypeSelector';
import { EnhancedRegionSelector } from '@/components/suitability/EnhancedRegionSelector';
import { FactorSelector } from '@/components/suitability/FactorSelector';
import { SuitabilityMap } from '@/components/suitability/SuitabilityMap';
import { ResultsPanel } from '@/components/suitability/ResultsPanel';
import { useToast } from '@/hooks/use-toast';
import logoImage from '@/assets/logo.jpg';

type AnalysisStep = 'project-type' | 'region-factors' | 'analysis' | 'results';

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
  projectType: string;
  region: Region;
  factors: FactorConfig;
}

interface AnalysisResult {
  projectId: string;
  suitabilityData: any;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
  }>;
  breakdown: Record<string, number>;
}

const SuitabilityAnalysis = () => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('project-type');
  const [analysisConfig, setAnalysisConfig] = useState<Partial<AnalysisConfig>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleProjectTypeSelect = (projectType: string) => {
    setAnalysisConfig(prev => ({ ...prev, projectType }));
    setCurrentStep('region-factors');
  };

  const handleRegionSelect = (region: Region) => {
    setAnalysisConfig(prev => ({ ...prev, region }));
  };

  const handleFactorSelect = (factors: FactorConfig) => {
    setAnalysisConfig(prev => ({ ...prev, factors }));
    setCurrentStep('analysis');
  };

  const runAnalysis = async () => {
    if (!analysisConfig.projectType || !analysisConfig.region || !analysisConfig.factors) return;

    setIsAnalyzing(true);
    try {
      // Generate a temporary session ID for this analysis
      const sessionId = crypto.randomUUID();
      
      const response = await fetch('https://letyizogbpeyclzvsagt.supabase.co/functions/v1/suitability-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldHlpem9nYnBleWNsenZzYWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODI4ODcsImV4cCI6MjA3MzI1ODg4N30.ONtaKjzbr-HkqnU8w4G13g_V77e14sfzTwaAnHjsX-U`
        },
        body: JSON.stringify({
          projectType: analysisConfig.projectType,
          weights: analysisConfig.factors.weights,
          selectedFactors: analysisConfig.factors.selectedFactors,
          region: analysisConfig.region,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentStep('results');
      
      toast({
        title: "Analysis Complete! 🎉",
        description: `Found ${result.topSites.length} suitable sites for ${analysisConfig.projectType!.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadResults = async (format: 'geotiff' | 'png' | 'pdf') => {
    if (!analysisResult) return;

    try {
      if (format === 'pdf') {
        // Generate comprehensive PDF report
        const response = await fetch('https://letyizogbpeyclzvsagt.supabase.co/functions/v1/generate-pdf-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldHlpem9nYnBleWNsenZzYWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODI4ODcsImV4cCI6MjA3MzI1ODg4N30.ONtaKjzbr-HkqnU8w4G13g_V77e14sfzTwaAnHjsX-U`
          },
          body: JSON.stringify({
            result: analysisResult,
            projectType: analysisConfig.projectType!,
            region: analysisConfig.region,
            weights: analysisConfig.factors!.weights
          })
        });
        
        if (!response.ok) throw new Error('PDF generation failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${analysisConfig.projectType!.replace(/\s+/g, '_')}_Feasibility_Report_${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "PDF Report Generated! 📄",
          description: "Professional feasibility report with AI recommendations ready for investors",
        });
      } else {
        // Original download logic for GeoTIFF and PNG
        const response = await fetch(`https://letyizogbpeyclzvsagt.supabase.co/functions/v1/download-results/${analysisResult.projectId}?format=${format}`, {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldHlpem9nYnBleWNsenZzYWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODI4ODcsImV4cCI6MjA3MzI1ODg4N30.ONtaKjzbr-HkqnU8w4G13g_V77e14sfzTwaAnHjsX-U`
          }
        });
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `suitability_analysis.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('project-type');
    setAnalysisConfig({});
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                  <p className="text-sm text-muted-foreground">Site Suitability Analysis</p>
                </div>
              </div>
              {currentStep === 'project-type' && (
                <div className="ml-8 flex items-center gap-2 text-muted-foreground">
                  <div className="h-6 w-px bg-border" />
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Free • No Login Required
                  </Badge>
                </div>
              )}
            </div>
            {currentStep === 'results' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResults('geotiff')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  GeoTIFF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResults('pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF Report
                </Button>
                <Button onClick={resetAnalysis} size="sm">
                  New Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[
            { key: 'project-type', label: '1. Project Type', icon: BarChart3 },
            { key: 'region-factors', label: '2. Location & Factors', icon: Settings },
            { key: 'analysis', label: '3. Run Analysis', icon: BarChart3 },
            { key: 'results', label: 'Results', icon: MapPin }
          ].map((step, index) => {
            const isActive = currentStep === step.key;
            const isCompleted = ['project-type', 'region-factors', 'analysis', 'results'].indexOf(currentStep) > index;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isActive 
                    ? 'border-forest-primary bg-forest-primary text-white' 
                    : isCompleted 
                      ? 'border-forest-primary bg-forest-primary text-white'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive || isCompleted ? 'text-forest-primary' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-px ml-4 ${
                    isCompleted ? 'bg-forest-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'project-type' && (
            <EnhancedProjectTypeSelector onSelect={handleProjectTypeSelect} />
          )}

          {currentStep === 'region-factors' && analysisConfig.projectType && (
            <div className="space-y-8">
              {!analysisConfig.region && (
                <EnhancedRegionSelector 
                  onSelect={handleRegionSelect} 
                  projectType={analysisConfig.projectType} 
                />
              )}
              {analysisConfig.region && (
                <FactorSelector 
                  projectType={analysisConfig.projectType}
                  onSelect={handleFactorSelect}
                />
              )}
            </div>
          )}

          {currentStep === 'analysis' && analysisConfig.projectType && analysisConfig.region && analysisConfig.factors && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Ready to Analyze</CardTitle>
                <CardDescription>
                  Our GeoAI engine will analyze your {analysisConfig.region.data.radius}km buffer area using your selected 
                  factors: {analysisConfig.factors.selectedFactors.map(f => f.replace(/_/g, ' ')).join(', ')} to identify 
                  the top 5 most suitable sites within the buffer zone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                    <div className="mt-1">
                      <Badge variant="secondary">{analysisConfig.projectType}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Analysis Area</label>
                    <div className="mt-1 space-y-1">
                      <Badge variant="outline">{analysisConfig.region.data.radius}km Buffer</Badge>
                      <p className="text-xs text-muted-foreground">
                        Center: {analysisConfig.region.data.center[1].toFixed(4)}, {analysisConfig.region.data.center[0].toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Selected Factors</span>
                    <span className="font-medium">{analysisConfig.factors.selectedFactors.length} factors</span>
                  </div>
                  {Object.entries(analysisConfig.factors.weights).map(([criterion, weight]) => (
                    <div key={criterion} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{criterion.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{(weight * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={runAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full bg-forest-primary hover:bg-forest-primary/90"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running GeoAI Analysis...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Run Suitability Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'results' && analysisResult && analysisConfig.region && analysisConfig.projectType && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SuitabilityMap 
                  result={analysisResult}
                  region={analysisConfig.region}
                />
              </div>
              <div>
                <ResultsPanel 
                  result={analysisResult}
                  projectType={analysisConfig.projectType}
                  onDownload={downloadResults}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuitabilityAnalysis;