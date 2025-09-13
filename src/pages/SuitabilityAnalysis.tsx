import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, MapPin, BarChart3 } from 'lucide-react';
import { ProjectTypeSelector } from '@/components/suitability/ProjectTypeSelector';
import { RegionSelector } from '@/components/suitability/RegionSelector';
import { SuitabilityMap } from '@/components/suitability/SuitabilityMap';
import { ResultsPanel } from '@/components/suitability/ResultsPanel';
import { useToast } from '@/hooks/use-toast';
import logoImage from '@/assets/logo.jpg';

type AnalysisStep = 'project-type' | 'region' | 'analysis' | 'results';

interface ProjectConfig {
  type: string;
  weights: Record<string, number>;
}

interface Region {
  type: 'polygon' | 'district' | 'shapefile';
  data: any;
  name: string;
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
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleProjectTypeSelect = (config: ProjectConfig) => {
    setProjectConfig(config);
    setCurrentStep('region');
  };

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setCurrentStep('analysis');
  };

  const runAnalysis = async () => {
    if (!projectConfig || !selectedRegion) return;

    setIsAnalyzing(true);
    try {
      // Generate a temporary session ID for this analysis
      const sessionId = crypto.randomUUID();
      
      const response = await fetch('https://letyizogbpeyclzvsagt.supabase.co/functions/v1/suitability-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldHlpem9nYnBleWNsenZzYWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODI4ODcsImV4cCI6MjA3MzI1ODg4N30.ONtaKjzbr-HkqnU8w4G13g_V77e14sfzTwaAnHjsX-U'}`
        },
        body: JSON.stringify({
          projectType: projectConfig.type,
          weights: projectConfig.weights,
          region: selectedRegion,
          sessionId: sessionId, // Include session ID
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentStep('results');
      
      toast({
        title: "Analysis Complete! 🎉",
        description: `Found ${result.topSites.length} suitable sites for ${projectConfig.type.toLowerCase()}`,
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
      const response = await fetch(`https://letyizogbpeyclzvsagt.supabase.co/functions/v1/download-results/${analysisResult.projectId}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldHlpem9nYnBleWNsenZzYWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODI4ODcsImV4cCI6MjA3MzI1ODg4N30.ONtaKjzbr-HkqnU8w4G13g_V77e14sfzTwaAnHjsX-U'}`
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
    setProjectConfig(null);
    setSelectedRegion(null);
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
            { key: 'region', label: '2. Select Region', icon: MapPin },
            { key: 'analysis', label: '3. Run Analysis', icon: BarChart3 },
            { key: 'results', label: 'Results', icon: BarChart3 }
          ].map((step, index) => {
            const isActive = currentStep === step.key;
            const isCompleted = ['project-type', 'region', 'analysis', 'results'].indexOf(currentStep) > index;
            
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
            <ProjectTypeSelector onSelect={handleProjectTypeSelect} />
          )}

          {currentStep === 'region' && projectConfig && (
            <RegionSelector onSelect={handleRegionSelect} projectType={projectConfig.type} />
          )}

          {currentStep === 'analysis' && projectConfig && selectedRegion && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Ready to Analyze</CardTitle>
              <CardDescription>
                Our GeoAI engine will analyze your region using multiple datasets: DEM (slope), land cover (ESA WorldCover), 
                infrastructure (OpenStreetMap), {projectConfig.type === 'Solar Farm' ? 'solar radiation, and grid connectivity' : 
                projectConfig.type === 'Battery Energy Storage (BESS)' ? 'grid connectivity, and suitable land use' : 
                'soil fertility (FAO SoilGrids), and rainfall (WorldClim)'} to identify the top 5 most suitable sites.
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                    <div className="mt-1">
                      <Badge variant="secondary">{projectConfig.type}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Region</label>
                    <div className="mt-1">
                      <Badge variant="outline">{selectedRegion.name}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Analysis Criteria</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(projectConfig.weights).map(([criterion, weight]) => (
                      <Badge key={criterion} variant="outline" className="text-xs">
                        {criterion}: {(weight * 100).toFixed(0)}%
                      </Badge>
                    ))}
                  </div>
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

          {currentStep === 'results' && analysisResult && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SuitabilityMap 
                  result={analysisResult}
                  region={selectedRegion!}
                />
              </div>
              <div>
                <ResultsPanel 
                  result={analysisResult}
                  projectType={projectConfig!.type}
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