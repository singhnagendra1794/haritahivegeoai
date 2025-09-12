import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Waves, 
  Flame, 
  Zap, 
  Home, 
  MapPin,
  Upload,
  Play,
  Download,
  BarChart3,
  Wind
} from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import ResultsPanel from '@/components/ResultsPanel';
import { useToast } from '@/hooks/use-toast';

const DisasterManagement = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const { toast } = useToast();

  const tools = [
    {
      id: 'flood-simulation',
      icon: Waves,
      title: 'Flood Simulation',
      description: 'Hydraulic modeling and flood risk assessment using DEM and rainfall data',
      badge: 'Hydrology',
      inputs: ['DEM data', 'Rainfall data', 'River networks', 'Land use'],
      outputs: ['Flood maps', 'Risk zones', 'Evacuation routes', 'Damage assessment']
    },
    {
      id: 'fire-detection',
      icon: Flame,
      title: 'Fire Hotspot Detection',
      description: 'Real-time wildfire detection and spread prediction using satellite imagery',
      badge: 'Fire',
      inputs: ['Thermal imagery', 'Weather data', 'Fuel maps', 'Topography'],
      outputs: ['Hotspot maps', 'Spread models', 'Risk assessment', 'Suppression plans']
    },
    {
      id: 'shelter-access',
      icon: Home,
      title: 'Shelter Accessibility',
      description: 'Emergency shelter network analysis and evacuation route optimization',
      badge: 'Evacuation',
      inputs: ['Shelter locations', 'Population data', 'Road networks', 'Capacity data'],
      outputs: ['Access maps', 'Route optimization', 'Capacity analysis', 'Gap identification']
    },
    {
      id: 'earthquake-risk',
      icon: Zap,
      title: 'Earthquake Risk Assessment',
      description: 'Seismic hazard mapping and building vulnerability analysis',
      badge: 'Seismic',
      inputs: ['Fault lines', 'Building data', 'Soil conditions', 'Historical events'],
      outputs: ['Hazard maps', 'Vulnerability assessment', 'Loss estimates', 'Retrofitting priorities']
    },
    {
      id: 'hurricane-tracking',
      icon: Wind,
      title: 'Hurricane Tracking',
      description: 'Storm path prediction and impact assessment for coastal areas',
      badge: 'Weather',
      inputs: ['Weather models', 'Historical tracks', 'Coastal data', 'Infrastructure'],
      outputs: ['Track forecasts', 'Impact zones', 'Storm surge maps', 'Damage predictions']
    },
    {
      id: 'emergency-response',
      icon: AlertTriangle,
      title: 'Emergency Response Planning',
      description: 'Resource allocation and response coordination optimization',
      badge: 'Response',
      inputs: ['Resource inventory', 'Response teams', 'Infrastructure', 'Population'],
      outputs: ['Response plans', 'Resource allocation', 'Timeline optimization', 'Coordination maps']
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
        featuresProcessed: Math.floor(Math.random() * 500) + 100,
        processingTime: `${(Math.random() * 6 + 2).toFixed(1)}s`,
        totalArea: `${(Math.random() * 2000 + 200).toFixed(1)} km²`,
        riskLevel: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
      });
      toast({
        title: 'Analysis Complete',
        description: `${tool.title} analysis finished successfully.`,
      });
    }, 4000);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-primary">Disaster Management</h1>
              <p className="text-muted-foreground">Emergency response and disaster risk reduction tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Tools Sidebar */}
        <div className="w-96 bg-background border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-charcoal-primary mb-4">Emergency Management Tools</h2>
            
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTool === tool.id ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <tool.icon className="h-5 w-5 text-red-600" />
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
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      {selectedToolData && <selectedToolData.icon className="h-5 w-5 text-red-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-primary">{selectedToolData?.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedToolData?.description}</p>
                    </div>
                  </div>
                  <Button onClick={handleRunAnalysis} className="bg-red-600 hover:bg-red-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>

                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Disaster Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select disaster" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="wildfire">Wildfire</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="hurricane">Hurricane</SelectItem>
                        <SelectItem value="tsunami">Tsunami</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="catastrophic">Catastrophic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Frame</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="24hours">24 Hours</SelectItem>
                        <SelectItem value="72hours">72 Hours</SelectItem>
                        <SelectItem value="1week">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Population at Risk</Label>
                    <Input 
                      type="number" 
                      placeholder="Number of people" 
                      min="0"
                      max="10000000"
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
                <div className="p-4 bg-red-500/10 rounded-2xl inline-block mb-6">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal-primary mb-4">
                  Emergency Management Tools
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select a tool from the sidebar to start your disaster management analysis. 
                  Simulate floods, detect fires, plan evacuations, and coordinate emergency response.
                </p>
                <Badge variant="secondary" className="bg-red-500/10 text-red-600">
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

export default DisasterManagement;