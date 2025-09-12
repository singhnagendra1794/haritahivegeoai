import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';

interface BufferToolsSidebarProps {
  storedFeatures: Array<{ id: string; name: string }>;
  onBufferResult: (geometry: any) => void;
}

const BufferToolsSidebar: React.FC<BufferToolsSidebarProps> = ({ 
  storedFeatures, 
  onBufferResult 
}) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [bufferDistance, setBufferDistance] = useState<string>('1000');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const handleBufferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFeatureId || !bufferDistance) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a feature and enter a buffer distance."
      });
      return;
    }

    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to create buffers."
      });
      return;
    }

    setLoading(true);

    try {
      const response = await supabase.functions.invoke('process-buffer', {
        body: {
          polygon_id: selectedFeatureId,
          distance: parseFloat(bufferDistance)
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data?.success) {
        onBufferResult(response.data.data);
        toast({
          title: "Buffer Created",
          description: `Buffer created with ${bufferDistance}m distance.`
        });
      } else {
        throw new Error(response.data?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating buffer:', error);
      toast({
        variant: "destructive",
        title: "Buffer Error",
        description: "Failed to create buffer. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-geo-primary" />
        <h2 className="text-xl font-semibold text-sidebar-foreground">GeoAI Tools</h2>
      </div>

      <Card className="bg-sidebar-accent border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-sidebar-foreground">Drawing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-sidebar-foreground space-y-2">
          <p>• Click on the map to start drawing a polygon</p>
          <p>• Click to add each point</p>
          <p>• Double-click to finish the polygon</p>
          <p>• Your polygon will be saved automatically</p>
        </CardContent>
      </Card>

      <Card className="bg-sidebar-accent border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-sidebar-foreground">Buffer Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBufferSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-select" className="text-sidebar-foreground">
                Select Feature
              </Label>
              <Select value={selectedFeatureId} onValueChange={setSelectedFeatureId}>
                <SelectTrigger id="feature-select" className="bg-sidebar border-sidebar-border">
                  <SelectValue placeholder="Choose a saved polygon" />
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
              <Label htmlFor="buffer-distance" className="text-sidebar-foreground">
                Buffer Distance (meters)
              </Label>
              <Input
                id="buffer-distance"
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
              disabled={loading || !selectedFeatureId}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Buffer...
                </>
              ) : (
                'Create Buffer'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-sidebar-accent border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-sidebar-foreground">Stored Features</CardTitle>
        </CardHeader>
        <CardContent>
          {storedFeatures.length === 0 ? (
            <p className="text-sm text-sidebar-foreground">
              No features saved yet. Draw a polygon on the map to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {storedFeatures.map((feature) => (
                <div 
                  key={feature.id} 
                  className="p-2 bg-sidebar rounded border border-sidebar-border"
                >
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {feature.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">
                    ID: {feature.id.substring(0, 8)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferToolsSidebar;