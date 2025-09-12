import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layers, Eye, EyeOff, Edit2, Trash2, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LayerFeature {
  id: string;
  name: string;
  feature_type: string;
  properties: any;
  created_at: string;
  visible: boolean;
}

interface LayerManagerProps {
  onLayerToggle: (featureId: string, visible: boolean) => void;
  onFeatureUpdate: () => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({ onLayerToggle, onFeatureUpdate }) => {
  const [features, setFeatures] = useState<LayerFeature[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFeatures();
    }
  }, [user]);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('geo_features')
        .select('id, name, feature_type, properties, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeatures(data.map(f => ({ ...f, visible: true })));
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load features."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (featureId: string) => {
    setFeatures(prev => 
      prev.map(f => 
        f.id === featureId ? { ...f, visible: !f.visible } : f
      )
    );
    
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      onLayerToggle(featureId, !feature.visible);
    }
  };

  const handleStartEdit = (feature: LayerFeature) => {
    setEditingId(feature.id);
    setEditName(feature.name);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from('geo_features')
        .update({ name: editName.trim() })
        .eq('id', editingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => 
          f.id === editingId ? { ...f, name: editName.trim() } : f
        )
      );

      setEditingId(null);
      setEditName('');
      onFeatureUpdate();

      toast({
        title: "Feature Updated",
        description: "Feature name updated successfully."
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "Failed to update feature name."
      });
    }
  };

  const handleDelete = async (featureId: string) => {
    try {
      const { error } = await supabase
        .from('geo_features')
        .delete()
        .eq('id', featureId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFeatures(prev => prev.filter(f => f.id !== featureId));
      onLayerToggle(featureId, false); // Remove from map
      onFeatureUpdate();

      toast({
        title: "Feature Deleted",
        description: "Feature removed successfully."
      });
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Failed to delete feature."
      });
    }
  };

  const getFeatureTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'polygon': return 'bg-geo-primary';
      case 'point': return 'bg-geo-secondary';
      case 'linestring': return 'bg-geo-accent';
      default: return 'bg-muted';
    }
  };

  const getFeatureTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'polygon': return '⬟';
      case 'point': return '●';
      case 'linestring': return '━';
      default: return '?';
    }
  };

  if (loading) {
    return (
      <Card className="bg-sidebar-accent border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-geo-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-sidebar-accent border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-sidebar-foreground flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Layer Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.length === 0 ? (
          <div className="text-center py-8">
            <Map className="h-12 w-12 text-sidebar-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-sidebar-foreground/70">
              No features created yet. Draw some polygons to get started!
            </p>
          </div>
        ) : (
          features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between p-3 bg-sidebar rounded-lg border border-sidebar-border"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFeatureTypeIcon(feature.feature_type)}</span>
                  <Switch
                    checked={feature.visible}
                    onCheckedChange={() => handleToggleVisibility(feature.id)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === feature.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-7 text-xs bg-sidebar border-sidebar-border"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        onBlur={handleSaveEdit}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-sidebar-foreground truncate">
                        {feature.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs ${getFeatureTypeColor(feature.feature_type)} text-white`}
                        >
                          {feature.feature_type}
                        </Badge>
                        {feature.properties?.analysis_type && (
                          <Badge variant="outline" className="text-xs">
                            {feature.properties.analysis_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartEdit(feature)}
                  className="h-7 w-7 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-sidebar-foreground/70 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Feature</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{feature.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(feature.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LayerManager;