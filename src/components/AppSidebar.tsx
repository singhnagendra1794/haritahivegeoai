import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  CircleDot, 
  Layers3, 
  Settings, 
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Edit
} from 'lucide-react';

interface AppSidebarProps {
  storedFeatures: Array<{ id: string; name: string }>;
  onBufferResult: (geometry: any) => void;
  onFeatureVisibilityToggle: (featureId: string) => void;
  visibleFeatures: Set<string>;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  storedFeatures,
  onBufferResult,
  onFeatureVisibilityToggle,
  visibleFeatures
}) => {
  const [collapsed, setCollapsed] = useState(false);
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
    <Sidebar className={`${collapsed ? 'w-16' : 'w-80'} border-r border-sidebar-border bg-sidebar transition-all duration-300`}>
      <SidebarContent className="p-4">
        {/* Header */}
        <div className={`flex items-center gap-3 mb-6 ${collapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-forest-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-forest-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">GeoAI Tools</h2>
              <p className="text-xs text-muted-foreground">Spatial analysis toolkit</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <>
            {/* Drawing Instructions */}
            <SidebarGroup className="mb-6">
              <SidebarGroupLabel className="text-forest-primary font-medium">
                Quick Start Guide
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Card className="bg-sidebar-accent/50 border-sidebar-border">
                  <CardContent className="p-4 text-sm text-sidebar-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-forest-primary rounded-full" />
                      <span>Click map to draw polygons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-charcoal-primary rounded-full" />
                      <span>Double-click to finish shape</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-forest-light rounded-full" />
                      <span>Features save automatically</span>
                    </div>
                  </CardContent>
                </Card>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Buffer Tool */}
            <SidebarGroup className="mb-6">
              <SidebarGroupLabel className="text-forest-primary font-medium flex items-center gap-2">
                <CircleDot className="h-4 w-4" />
                Buffer Analysis
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Card className="bg-sidebar-accent/30 border-sidebar-border">
                  <CardContent className="p-4">
                    <form onSubmit={handleBufferSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="feature-select" className="text-sidebar-foreground text-sm">
                          Select Feature
                        </Label>
                        <Select value={selectedFeatureId} onValueChange={setSelectedFeatureId}>
                          <SelectTrigger className="bg-sidebar border-sidebar-border">
                            <SelectValue placeholder="Choose a polygon" />
                          </SelectTrigger>
                          <SelectContent>
                            {storedFeatures.map((feature) => (
                              <SelectItem key={feature.id} value={feature.id}>
                                {feature.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buffer-distance" className="text-sidebar-foreground text-sm">
                          Distance (meters)
                        </Label>
                        <Input
                          id="buffer-distance"
                          type="number"
                          value={bufferDistance}
                          onChange={(e) => setBufferDistance(e.target.value)}
                          placeholder="1000"
                          min="1"
                          className="bg-sidebar border-sidebar-border"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-forest-primary hover:bg-forest-primary/90 rounded-lg"
                        disabled={loading || !selectedFeatureId}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CircleDot className="mr-2 h-4 w-4" />
                            Create Buffer
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Layer Manager */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-forest-primary font-medium flex items-center gap-2">
                <Layers3 className="h-4 w-4" />
                Layer Manager
                <Badge variant="secondary" className="ml-auto text-xs">
                  {storedFeatures.length}
                </Badge>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {storedFeatures.length === 0 ? (
                    <div className="text-center py-6">
                      <Layers3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No layers yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Draw a polygon to get started
                      </p>
                    </div>
                  ) : (
                    storedFeatures.map((feature) => {
                      const isVisible = visibleFeatures.has(feature.id);
                      return (
                        <div 
                          key={feature.id} 
                          className="flex items-center justify-between p-3 bg-sidebar-accent/30 rounded-lg border border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sidebar-foreground truncate">
                              {feature.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {feature.id.substring(0, 8)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onFeatureVisibilityToggle(feature.id)}
                              className="h-8 w-8 p-0 hover:bg-sidebar-accent"
                            >
                              {isVisible ? (
                                <Eye className="h-4 w-4 text-forest-primary" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Collapsed state icons */}
        {collapsed && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <CircleDot className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <Layers3 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;