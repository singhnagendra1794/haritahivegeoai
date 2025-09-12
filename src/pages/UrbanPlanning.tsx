import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Car, 
  Trees, 
  Zap, 
  Home,
  Upload,
  Play,
  Download,
  MapPin,
  BarChart3
} from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import ResultsPanel from '@/components/ResultsPanel';
import { useToast } from '@/hooks/use-toast';

const UrbanPlanning = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const { toast } = useToast();

  const tools = [
    {
      id: 'population-density',
      icon: Users,
      title: 'Population Density Analysis',
      description: 'Demographic analysis and population distribution mapping',
      badge: 'Demographics',
      inputs: ['Census data', 'Building footprints', 'Mobile data'],
      outputs: ['Density maps', 'Growth projections', 'Housing demand']
    },
    {
      id: 'land-use',
      icon: Building2,
      title: 'Land Use Classification',
      description: 'Automated land use mapping and urban growth monitoring',
      badge: 'Classification',
      inputs: ['Satellite imagery', 'OSM data', 'Zoning maps'],
      outputs: ['Land use maps', 'Change detection', 'Growth patterns']
    },
    {
      id: 'transport-planning',
      icon: Car,
      title: 'Transportation Planning',
      description: 'Traffic flow analysis and transportation network optimization',
      badge: 'Mobility',
      inputs: ['Traffic data', 'Road networks', 'Public transit'],
      outputs: ['Flow maps', 'Congestion analysis', 'Route optimization']
    },
    {
      id: 'green-spaces',
      icon: Trees,
      title: 'Green Space Planning',
      description: 'Urban forest mapping and green infrastructure planning',
      badge: 'Environment',
      inputs: ['NDVI data', 'Tree inventory', 'Park boundaries'],
      outputs: ['Green cover maps', 'Air quality impact', 'Recreation access']
    },
    {
      id: 'infrastructure',
      icon: Zap,
      title: 'Infrastructure Assessment',
      description: 'Utility network analysis and smart city infrastructure planning',
      badge: 'Infrastructure',
      inputs: ['Utility maps', 'Service data', 'Asset conditions'],
      outputs: ['Coverage maps', 'Capacity analysis', 'Upgrade priorities']
    },
    {
      id: 'housing-market',
      icon: Home,
      title: 'Housing Market Analysis',
      description: 'Real estate trends and affordable housing site selection',
      badge: 'Housing',
      inputs: ['Property data', 'Market prices', 'Demographic trends'],
      outputs: ['Price maps', 'Market trends', 'Development sites']
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
        featuresProcessed: Math.floor(Math.random() * 1000) + 100,
        processingTime: `${(Math.random() * 4 + 2).toFixed(1)}s`,
        totalArea: `${(Math.random() * 100 + 10).toFixed(1)} km²`,
        populationServed: `${Math.floor(Math.random() * 500000 + 50000).toLocaleString()}`
      });
      toast({
        title: 'Analysis Complete',
        description: `${tool.title} analysis finished successfully.`,
      });
    }, 3500);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-primary">Urban Planning</h1>
              <p className="text-muted-foreground">Smart city development and urban analytics tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Tools Sidebar */}
        <div className="w-96 bg-background border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-charcoal-primary mb-4">Urban Planning Tools</h2>
            
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTool === tool.id ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <tool.icon className="h-5 w-5 text-blue-600" />
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
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      {selectedToolData && <selectedToolData.icon className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-primary">{selectedToolData?.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedToolData?.description}</p>
                    </div>
                  </div>
                  <Button onClick={handleRunAnalysis} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>

                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>City Size</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt;100k)</SelectItem>
                        <SelectItem value="medium">Medium (100k-1M)</SelectItem>
                        <SelectItem value="large">Large (1M-5M)</SelectItem>
                        <SelectItem value="megacity">Megacity (&gt;5M)</SelectItem>
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
                        <SelectItem value="scenario">Scenario Planning</SelectItem>
                        <SelectItem value="forecast">Growth Forecast</SelectItem>
                        <SelectItem value="impact">Impact Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Horizon</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Planning period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="10years">10 Years</SelectItem>
                        <SelectItem value="20years">20 Years</SelectItem>
                        <SelectItem value="50years">50 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Population Growth (%)</Label>
                    <Input 
                      type="number" 
                      placeholder="Annual growth rate" 
                      min="0"
                      max="10"
                      step="0.1"
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
                <div className="p-4 bg-blue-500/10 rounded-2xl inline-block mb-6">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal-primary mb-4">
                  Smart City Planning Tools
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select a tool from the sidebar to start your urban planning analysis. 
                  Analyze population density, optimize transportation, plan green spaces, and more.
                </p>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
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

export default UrbanPlanning;