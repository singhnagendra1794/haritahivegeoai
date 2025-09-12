import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sprout, 
  Droplets, 
  Wind, 
  TreePine, 
  Mountain, 
  Fish,
  Upload,
  Play,
  BarChart3,
  Download,
  MapPin,
  Leaf
} from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import ResultsPanel from '@/components/ResultsPanel';
import { useToast } from '@/hooks/use-toast';

const Environment = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const { toast } = useToast();

  const tools = [
    {
      id: 'forest-health',
      icon: TreePine,
      title: 'Forest Health Monitoring',
      description: 'NDVI-based forest canopy analysis and deforestation detection',
      badge: 'Vegetation',
      inputs: ['Satellite imagery', 'Time series data'],
      outputs: ['Health index', 'Change maps', 'Risk areas']
    },
    {
      id: 'water-quality',
      icon: Droplets,
      title: 'Water Quality Assessment',
      description: 'Multi-spectral analysis for water pollution and quality monitoring',
      badge: 'Hydrology',
      inputs: ['Landsat/Sentinel data', 'Field samples'],
      outputs: ['Quality maps', 'Pollution sources', 'Trend analysis']
    },
    {
      id: 'carbon-footprint',
      icon: Leaf,
      title: 'Carbon Footprint Analysis',
      description: 'Biomass estimation and carbon sequestration mapping',
      badge: 'Climate',
      inputs: ['LiDAR data', 'Forest inventory'],
      outputs: ['Carbon maps', 'Sequestration rates', 'Offset potential']
    },
    {
      id: 'biodiversity',
      icon: Fish,
      title: 'Biodiversity Mapping',
      description: 'Species habitat modeling and conservation planning',
      badge: 'Ecology',
      inputs: ['Species data', 'Environmental layers'],
      outputs: ['Habitat suitability', 'Corridors', 'Priority areas']
    },
    {
      id: 'air-quality',
      icon: Wind,
      title: 'Air Quality Monitoring',
      description: 'Atmospheric pollution tracking and dispersion modeling',
      badge: 'Atmosphere',
      inputs: ['Sensor data', 'Weather data'],
      outputs: ['Pollution maps', 'Health risk', 'Forecasts']
    },
    {
      id: 'ecosystem-services',
      icon: Mountain,
      title: 'Ecosystem Services',
      description: 'Natural capital valuation and ecosystem service mapping',
      badge: 'Services',
      inputs: ['Land cover', 'Socio-economic data'],
      outputs: ['Service maps', 'Economic value', 'Trade-offs']
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
        featuresProcessed: Math.floor(Math.random() * 50) + 10,
        processingTime: `${(Math.random() * 5 + 1).toFixed(1)}s`,
        totalArea: `${(Math.random() * 1000 + 100).toFixed(1)} km²`,
        healthIndex: `${(Math.random() * 40 + 60).toFixed(1)}%`
      });
      toast({
        title: 'Analysis Complete',
        description: `${tool.title} analysis finished successfully.`,
      });
    }, 3000);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-primary">Environment</h1>
              <p className="text-muted-foreground">Environmental monitoring and conservation tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Tools Sidebar */}
        <div className="w-96 bg-background border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-charcoal-primary mb-4">Environmental Tools</h2>
            
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTool === tool.id ? 'ring-2 ring-green-500/50 bg-green-500/5' : ''
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <tool.icon className="h-5 w-5 text-green-600" />
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
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      {selectedToolData && <selectedToolData.icon className="h-5 w-5 text-green-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-primary">{selectedToolData?.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedToolData?.description}</p>
                    </div>
                  </div>
                  <Button onClick={handleRunAnalysis} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>

                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sentinel2">Sentinel-2</SelectItem>
                        <SelectItem value="landsat8">Landsat 8</SelectItem>
                        <SelectItem value="modis">MODIS</SelectItem>
                        <SelectItem value="upload">Upload Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">Last Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Analysis Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select analysis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current State</SelectItem>
                        <SelectItem value="change">Change Detection</SelectItem>
                        <SelectItem value="trend">Trend Analysis</SelectItem>
                        <SelectItem value="prediction">Prediction</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="p-4 bg-green-500/10 rounded-2xl inline-block mb-6">
                  <Sprout className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal-primary mb-4">
                  Environmental Analysis Tools
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select a tool from the sidebar to start your environmental analysis. 
                  Monitor forest health, assess water quality, track biodiversity, and more.
                </p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
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

export default Environment;