import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Layers, MapPin, Combine, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SpatialAnalysisToolsProps {
  storedFeatures: Array<{ id: string; name: string }>;
  onAnalysisResult: (result: any) => void;
}

const SpatialAnalysisTools: React.FC<SpatialAnalysisToolsProps> = ({ 
  storedFeatures, 
  onAnalysisResult 
}) => {
  // Buffer tool state
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [bufferDistance, setBufferDistance] = useState<string>('1000');
  const [bufferLoading, setBufferLoading] = useState(false);

  // Overlay analysis state
  const [selectedFeature1, setSelectedFeature1] = useState<string>('');
  const [selectedFeature2, setSelectedFeature2] = useState<string>('');
  const [overlayOperation, setOverlayOperation] = useState<string>('intersection');
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Hotspot detection state
  const [numClusters, setNumClusters] = useState<string>('3');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [hotspotLoading, setHotspotLoading] = useState(false);

  const { session } = useAuth();
  const { toast } = useToast();

  const handleBufferAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFeatureId || !bufferDistance) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a feature and enter a buffer distance."
      });
      return;
    }

    setBufferLoading(true);

    try {
      const response = await supabase.functions.invoke('process-buffer', {
        body: {
          polygon_id: selectedFeatureId,
          distance: parseFloat(bufferDistance)
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      if (response.data?.success) {
        onAnalysisResult({
          type: 'buffer',
          data: response.data.data
        });
        toast({
          title: "Buffer Created",
          description: `Buffer created with ${bufferDistance}m distance.`
        });
      }
    } catch (error) {
      console.error('Buffer analysis error:', error);
      toast({
        variant: "destructive",
        title: "Buffer Error",
        description: "Failed to create buffer. Please try again."
      });
    } finally {
      setBufferLoading(false);
    }
  };

  const handleOverlayAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFeature1 || !selectedFeature2) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select two features for overlay analysis."
      });
      return;
    }

    if (selectedFeature1 === selectedFeature2) {
      toast({
        variant: "destructive",
        title: "Invalid Selection",
        description: "Please select two different features."
      });
      return;
    }

    setOverlayLoading(true);

    try {
      const response = await supabase.functions.invoke('overlay-analysis', {
        body: {
          polygon_id_1: selectedFeature1,
          polygon_id_2: selectedFeature2,
          operation: overlayOperation
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      if (response.data?.success) {
        onAnalysisResult({
          type: 'overlay',
          operation: overlayOperation,
          data: response.data.data
        });
        toast({
          title: "Overlay Analysis Complete",
          description: `${overlayOperation} analysis completed successfully.`
        });
      }
    } catch (error) {
      console.error('Overlay analysis error:', error);
      toast({
        variant: "destructive",
        title: "Overlay Error",
        description: "Failed to perform overlay analysis. Please try again."
      });
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleHotspotDetection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const clusters = parseInt(numClusters);
    if (clusters < 2 || clusters > 10) {
      toast({
        variant: "destructive",
        title: "Invalid Clusters",
        description: "Number of clusters must be between 2 and 10."
      });
      return;
    }

    setHotspotLoading(true);

    try {
      const response = await supabase.functions.invoke('hotspot-detection', {
        body: {
          num_clusters: clusters,
          feature_ids: selectedFeatures.length > 0 ? selectedFeatures : []
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      if (response.data?.success) {
        onAnalysisResult({
          type: 'hotspot',
          data: response.data.data
        });
        toast({
          title: "Hotspot Detection Complete",
          description: `Found ${response.data.data.analysis_summary.num_clusters} clusters.`
        });
      }
    } catch (error) {
      console.error('Hotspot detection error:', error);
      toast({
        variant: "destructive",
        title: "Hotspot Error",
        description: "Failed to perform hotspot detection. Please try again."
      });
    } finally {
      setHotspotLoading(false);
    }
  };

  return (
    <Card className="bg-sidebar-accent border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-sidebar-foreground flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Spatial Analysis Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buffer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-sidebar">
            <TabsTrigger value="buffer" className="text-xs">Buffer</TabsTrigger>
            <TabsTrigger value="overlay" className="text-xs">Overlay</TabsTrigger>
            <TabsTrigger value="hotspot" className="text-xs">Hotspot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buffer" className="space-y-4">
            <form onSubmit={handleBufferAnalysis} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sidebar-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Select Feature
                </Label>
                <Select value={selectedFeatureId} onValueChange={setSelectedFeatureId}>
                  <SelectTrigger className="bg-sidebar border-sidebar-border">
                    <SelectValue placeholder="Choose a polygon" />
                  </SelectTrigger>
                  <SelectContent className="bg-sidebar border-sidebar-border">
                    {storedFeatures.map((feature) => (
                      <SelectItem key={feature.id} value={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Distance (meters)</Label>
                <Input
                  type="number"
                  value={bufferDistance}
                  onChange={(e) => setBufferDistance(e.target.value)}
                  placeholder="1000"
                  min="1"
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-geo-secondary hover:bg-geo-secondary/90"
                disabled={bufferLoading || !selectedFeatureId}
              >
                {bufferLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Buffer...
                  </>
                ) : (
                  'Create Buffer'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="overlay" className="space-y-4">
            <form onSubmit={handleOverlayAnalysis} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sidebar-foreground flex items-center gap-1">
                  <Combine className="h-3 w-3" />
                  First Feature
                </Label>
                <Select value={selectedFeature1} onValueChange={setSelectedFeature1}>
                  <SelectTrigger className="bg-sidebar border-sidebar-border">
                    <SelectValue placeholder="Choose first polygon" />
                  </SelectTrigger>
                  <SelectContent className="bg-sidebar border-sidebar-border">
                    {storedFeatures.map((feature) => (
                      <SelectItem key={feature.id} value={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Second Feature</Label>
                <Select value={selectedFeature2} onValueChange={setSelectedFeature2}>
                  <SelectTrigger className="bg-sidebar border-sidebar-border">
                    <SelectValue placeholder="Choose second polygon" />
                  </SelectTrigger>
                  <SelectContent className="bg-sidebar border-sidebar-border">
                    {storedFeatures.filter(f => f.id !== selectedFeature1).map((feature) => (
                      <SelectItem key={feature.id} value={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Operation</Label>
                <Select value={overlayOperation} onValueChange={setOverlayOperation}>
                  <SelectTrigger className="bg-sidebar border-sidebar-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-sidebar border-sidebar-border">
                    <SelectItem value="intersection">Intersection</SelectItem>
                    <SelectItem value="union">Union</SelectItem>
                    <SelectItem value="difference">Difference</SelectItem>
                    <SelectItem value="symmetric_difference">Symmetric Difference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-geo-primary hover:bg-geo-primary/90"
                disabled={overlayLoading || !selectedFeature1 || !selectedFeature2}
              >
                {overlayLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Perform Analysis'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="hotspot" className="space-y-4">
            <form onSubmit={handleHotspotDetection} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sidebar-foreground">Number of Clusters</Label>
                <Input
                  type="number"
                  value={numClusters}
                  onChange={(e) => setNumClusters(e.target.value)}
                  placeholder="3"
                  min="2"
                  max="10"
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                />
              </div>

              <div className="text-xs text-sidebar-foreground/70 p-2 bg-sidebar rounded">
                <p>• Uses all your features by default</p>
                <p>• Identifies spatial clusters using K-means</p>
                <p>• Creates centroid points for each cluster</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-geo-accent hover:bg-geo-accent/90"
                disabled={hotspotLoading || storedFeatures.length < 2}
              >
                {hotspotLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  'Detect Hotspots'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {storedFeatures.length < 2 && (
          <div className="mt-4 p-3 bg-sidebar rounded border border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/70 text-center">
              Create at least 2 features to enable all analysis tools
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpatialAnalysisTools;