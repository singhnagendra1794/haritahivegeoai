import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Tractor, 
  Wheat, 
  Droplets, 
  Bug, 
  CloudRain, 
  BarChart3,
  Upload,
  Play,
  Download,
  MapPin,
  Thermometer
} from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import ResultsPanel from '@/components/ResultsPanel';
import { useToast } from '@/hooks/use-toast';

const Agriculture = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const { toast } = useToast();

  const tools = [
    {
      id: 'crop-health',
      icon: Wheat,
      title: 'Crop Health Monitoring',
      description: 'NDVI/NDWI analysis for crop stress detection and health assessment',
      badge: 'Health',
      inputs: ['Multispectral imagery', 'Field boundaries'],
      outputs: ['NDVI maps', 'Stress areas', 'Health reports']
    },
    {
      id: 'yield-prediction',
      icon: BarChart3,
      title: 'Yield Prediction',
      description: 'ML-powered crop yield forecasting using satellite and weather data',
      badge: 'Prediction',
      inputs: ['Historical yields', 'Weather data', 'Satellite imagery'],
      outputs: ['Yield maps', 'Forecasts', 'Risk assessment']
    },
    {
      id: 'irrigation-mapping',
      icon: Droplets,
      title: 'Irrigation Optimization',
      description: 'Soil moisture analysis and irrigation planning tools',
      badge: 'Water',
      inputs: ['Soil moisture data', 'Topography', 'Crop type'],
      outputs: ['Moisture maps', 'Irrigation zones', 'Water schedules']
    },
    {
      id: 'pest-detection',
      icon: Bug,
      title: 'Pest & Disease Detection',
      description: 'Early detection of crop pests and diseases using AI image analysis',
      badge: 'Protection',
      inputs: ['High-res imagery', 'Drone data', 'Field reports'],
      outputs: ['Detection maps', 'Risk zones', 'Treatment plans']
    },
    {
      id: 'soil-analysis',
      icon: Thermometer,
      title: 'Soil Analysis',
      description: 'Comprehensive soil health and nutrient mapping',
      badge: 'Soil',
      inputs: ['Soil samples', 'Lab results', 'Terrain data'],
      outputs: ['Nutrient maps', 'pH distribution', 'Fertilizer plans']
    },
    {
      id: 'weather-impact',
      icon: CloudRain,
      title: 'Weather Impact Analysis',
      description: 'Climate risk assessment and weather pattern analysis',
      badge: 'Climate',
      inputs: ['Weather stations', 'Climate models', 'Historical data'],
      outputs: ['Risk maps', 'Climate trends', 'Adaptation plans']
    }
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    const tool = tools.find(t => t.id === toolId);
    toast({
      title: `${tool?.title} Selected`,
      description: 'Configure your analysis parameters and run the tool.',
    });
  };

  const handleRunAnalysis = () => {
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return;

    setShowResults(true);
    toast({
      title: 'Analysis Started',
      description: `Running ${tool.title} analysis...`,
    });

    // Simulate processing
    setTimeout(() => {
      setAnalysisResults({
        featuresProcessed: Math.floor(Math.random() * 100) + 20,
        processingTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
        totalArea: `${(Math.random() * 500 + 50).toFixed(1)} hectares`,
        avgYield: `${(Math.random() * 5 + 3).toFixed(1)} tons/ha`
      });
      toast({
        title: 'Analysis Complete',
        description: `${tool.title} analysis finished successfully.`,
      });
    }, 2500);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Tractor className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-primary">Agriculture</h1>
              <p className="text-muted-foreground">Precision farming and crop management tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Tools Sidebar */}
        <div className="w-96 bg-background border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-charcoal-primary mb-4">Agricultural Tools</h2>
            
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTool === tool.id ? 'ring-2 ring-amber-500/50 bg-amber-500/5' : ''
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <tool.icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{tool.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {tool.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3">
                      {tool.description}
                    </CardDescription>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-charcoal-primary">Inputs:</span>
                        <div className="mt-1">
                          {tool.inputs.map((input, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                              {input}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-charcoal-primary">Outputs:</span>
                        <div className="mt-1">
                          {tool.outputs.map((output, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                              {output}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTool ? (
            <>
              {/* Tool Configuration */}
              <div className="bg-background border-b border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      {selectedToolData && <selectedToolData.icon className="h-5 w-5 text-amber-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-primary">{selectedToolData?.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedToolData?.description}</p>
                    </div>
                  </div>
                  <Button onClick={handleRunAnalysis} className="bg-amber-600 hover:bg-amber-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>

                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Crop Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Growing Season</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10m">10m (Sentinel-2)</SelectItem>
                        <SelectItem value="30m">30m (Landsat)</SelectItem>
                        <SelectItem value="1m">1m (Drone)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Field Size (ha)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter area" 
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 relative">
                <MapComponent />
                
                <ResultsPanel
                  isVisible={showResults}
                  onClose={() => setShowResults(false)}
                  results={analysisResults}
                  logs={[]}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                />
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="p-4 bg-amber-500/10 rounded-2xl inline-block mb-6">
                  <Tractor className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal-primary mb-4">
                  Precision Agriculture Tools
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select a tool from the sidebar to start your agricultural analysis. 
                  Monitor crop health, predict yields, optimize irrigation, and detect pests.
                </p>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                  6 Tools Available
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agriculture;