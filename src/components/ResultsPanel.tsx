import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  BarChart3, 
  MapPin, 
  Layers,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ResultsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  results?: any;
  logs?: string[];
  isExpanded?: boolean;
  onToggleExpand: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  isVisible,
  onClose,
  results,
  logs = [],
  isExpanded = false,
  onToggleExpand,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed right-4 top-20 bottom-4 z-20 transition-all duration-300 ${
      isExpanded ? 'w-1/2' : 'w-80'
    }`}>
      <Card className="h-full bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-between py-3">
          <div>
            <CardTitle className="text-lg">Analysis Results</CardTitle>
            <CardDescription>Output and processing logs</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full">
          <Tabs defaultValue="results" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Output
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Logs
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="results" className="h-full mt-0">
                <ScrollArea className="h-full p-4">
                  {results ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Features Processed</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-forest-primary">
                              {results.featuresProcessed || 0}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Processing Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                              {results.processingTime || '0s'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Spatial Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Area:</span>
                              <span className="font-medium">{results.totalArea || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Perimeter:</span>
                              <span className="font-medium">{results.perimeter || 'N/A'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Layers className="h-4 w-4 mr-2" />
                          Add to Map
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No results yet</p>
                        <p className="text-sm">Run an analysis to see results here</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="output" className="h-full mt-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <pre className="bg-muted/30 p-3 rounded-lg text-xs overflow-x-auto">
                      {results ? JSON.stringify(results, null, 2) : 'No output data available'}
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="logs" className="h-full mt-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <div key={index} className="text-xs bg-muted/30 p-2 rounded font-mono">
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No logs available</p>
                          <p className="text-sm">Processing logs will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPanel;