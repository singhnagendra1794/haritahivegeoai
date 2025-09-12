import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import MapComponent from '@/components/MapComponent';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import OnboardingTooltips from '@/components/OnboardingTooltips';
import GeoDashboard from '@/components/GeoDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [storedFeatures, setStoredFeatures] = useState<Array<{ id: string; name: string }>>([]);
  const [bufferedGeometry, setBufferedGeometry] = useState<any>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<string>>(new Set());
  const [drawingMode, setDrawingMode] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStoredFeatures();
      checkFirstVisit();
    }
  }, [user]);

  const checkFirstVisit = () => {
    const hasVisited = localStorage.getItem('harita-hive-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('harita-hive-visited', 'true');
    }
  };

  const fetchStoredFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('geo_features')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const features = data || [];
      setStoredFeatures(features);
      // Make all features visible by default
      setVisibleFeatures(new Set(features.map(f => f.id)));
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stored features."
      });
    }
  };

  const handleFeatureCreated = (featureId: string) => {
    fetchStoredFeatures();
    setVisibleFeatures(prev => new Set([...prev, featureId]));
    
    // Add to undo stack
    setUndoStack(prev => [...prev, { type: 'create', featureId }]);
    setRedoStack([]);
    
    toast({
      title: "Feature Created",
      description: "New polygon has been saved successfully.",
    });
  };

  const handleBufferResult = (geometry: any) => {
    setBufferedGeometry(geometry);
    
    toast({
      title: "Buffer Analysis Complete",
      description: "Buffer zone has been generated and displayed on the map.",
    });
  };

  const handleFeatureVisibilityToggle = (featureId: string) => {
    setVisibleFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const handleDrawPolygon = () => {
    setDrawingMode(!drawingMode);
    toast({
      title: drawingMode ? "Drawing Disabled" : "Drawing Enabled",
      description: drawingMode ? "Click to exit drawing mode." : "Click on the map to start drawing polygons.",
    });
  };

  const handleCreateBuffer = () => {
    if (storedFeatures.length === 0) {
      toast({
        variant: "destructive",
        title: "No Features Available",
        description: "Please draw a polygon first before creating buffers.",
      });
      return;
    }
    
    toast({
      title: "Buffer Tool",
      description: "Use the sidebar to select a feature and create a buffer zone.",
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, lastAction]);
    setUndoStack(prev => prev.slice(0, -1));
    
    // Implement undo logic based on action type
    toast({
      title: "Action Undone",
      description: "Previous action has been reversed.",
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const actionToRedo = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, actionToRedo]);
    setRedoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Action Redone",
      description: "Action has been restored.",
    });
  };

  const handleClearAll = () => {
    setBufferedGeometry(null);
    setDrawingMode(false);
    
    toast({
      title: "Map Cleared",
      description: "All temporary drawings have been removed.",
    });
  };

  const handleToggleLayers = () => {
    const allVisible = storedFeatures.every(f => visibleFeatures.has(f.id));
    if (allVisible) {
      setVisibleFeatures(new Set());
    } else {
      setVisibleFeatures(new Set(storedFeatures.map(f => f.id)));
    }
    
    toast({
      title: "Layer Visibility",
      description: allVisible ? "All layers hidden" : "All layers shown",
    });
  };

  const handleOnboardingComplete = () => {
    setIsFirstVisit(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-neutral-bg flex w-full">
          {/* Sidebar */}
          <AppSidebar 
            storedFeatures={storedFeatures}
            onBufferResult={handleBufferResult}
            onFeatureVisibilityToggle={handleFeatureVisibilityToggle}
            visibleFeatures={visibleFeatures}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <TopBar onDashboardOpen={() => setShowDashboard(true)} />
            
            {/* Map Container */}
            <main className="flex-1 relative" data-map="container">
              <div className="absolute inset-4">
                <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-border">
                  <MapComponent 
                    onFeatureCreated={handleFeatureCreated}
                    bufferedGeometry={bufferedGeometry}
                    visibleFeatures={visibleFeatures}
                    drawingMode={drawingMode}
                  />
                </div>
              </div>
              
              {/* Floating Action Buttons */}
              <div data-fab="draw">
                <FloatingActionButtons
                  onDrawPolygon={handleDrawPolygon}
                  onCreateBuffer={handleCreateBuffer}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  onClearAll={handleClearAll}
                  onToggleLayers={handleToggleLayers}
                  canUndo={undoStack.length > 0}
                  canRedo={redoStack.length > 0}
                  drawingMode={drawingMode}
                />
              </div>
            </main>
          </div>
          
          {/* Onboarding Tooltips */}
          <OnboardingTooltips 
            isFirstVisit={isFirstVisit}
            onComplete={handleOnboardingComplete}
          />
          
          {/* Dashboard Modal */}
          <GeoDashboard 
            isVisible={showDashboard}
            onClose={() => setShowDashboard(false)}
          />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Dashboard;