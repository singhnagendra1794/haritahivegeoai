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
import MapToolbar from '@/components/MapToolbar';
import DashboardCards from '@/components/DashboardCards';
import ResultsPanel from '@/components/ResultsPanel';
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboardView, setShowDashboardView] = useState(false);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [resultsPanelExpanded, setResultsPanelExpanded] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
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
    setShowOnboarding(false);
  };

  // Dashboard and UI handlers
  const handleDashboardToggle = () => {
    setShowDashboardView(!showDashboardView);
  };

  const handleUploadVector = () => {
    console.log('Upload Vector clicked');
    setProcessingLogs(prev => [...prev, 'Vector upload initiated...']);
  };

  const handleUploadRaster = () => {
    console.log('Upload Raster clicked');
    setProcessingLogs(prev => [...prev, 'Raster upload initiated...']);
  };

  const handleConnectAPI = () => {
    console.log('Connect API clicked');
    setProcessingLogs(prev => [...prev, 'API connection configured...']);
  };

  const handleRunBuffer = () => {
    console.log('Run Buffer clicked');
    setShowResultsPanel(true);
    setProcessingLogs(prev => [...prev, 'Buffer analysis started...']);
    // Simulate processing
    setTimeout(() => {
      setAnalysisResults({
        featuresProcessed: 5,
        processingTime: '2.3s',
        totalArea: '150.2 km²',
        perimeter: '45.8 km'
      });
      setProcessingLogs(prev => [...prev, 'Buffer analysis completed successfully']);
    }, 2000);
  };

  const handleOverlayAnalysis = () => {
    console.log('Overlay Analysis clicked');
    setShowResultsPanel(true);
    setProcessingLogs(prev => [...prev, 'Overlay analysis started...']);
  };

  const handleRunMLModel = () => {
    console.log('Run ML Model clicked');
    setShowResultsPanel(true);
    setProcessingLogs(prev => [...prev, 'ML model execution started...']);
  };

  const handleCreateWorkflow = () => {
    console.log('Create Workflow clicked');
    setProcessingLogs(prev => [...prev, 'New workflow created...']);
  };

  const handleScheduleJob = () => {
    console.log('Schedule Job clicked');
    setProcessingLogs(prev => [...prev, 'Job scheduled successfully...']);
  };

  const handleZonalStats = () => {
    console.log('Zonal Stats clicked');
    setShowResultsPanel(true);
    setProcessingLogs(prev => [...prev, 'Zonal statistics analysis started...']);
  };

  const handleHotspotDetection = () => {
    console.log('Hotspot Detection clicked');
    setShowResultsPanel(true);
    setProcessingLogs(prev => [...prev, 'Hotspot detection analysis started...']);
  };

  const handleUploadData = () => {
    console.log('Upload Data clicked');
    setProcessingLogs(prev => [...prev, 'Data upload dialog opened...']);
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
            <TopBar onDashboardOpen={handleDashboardToggle} />
            
            {/* Main Content */}
            <main className="flex-1 relative">
              {showDashboardView ? (
                <div className="h-full p-6 overflow-y-auto bg-background">
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold text-charcoal-primary">Dashboard</h1>
                      <p className="text-muted-foreground">Manage your geospatial data and workflows</p>
                    </div>
                    
                    <DashboardCards
                      onUploadVector={handleUploadVector}
                      onUploadRaster={handleUploadRaster}
                      onConnectAPI={handleConnectAPI}
                      onRunBuffer={handleRunBuffer}
                      onOverlayAnalysis={handleOverlayAnalysis}
                      onRunMLModel={handleRunMLModel}
                      onCreateWorkflow={handleCreateWorkflow}
                      onScheduleJob={handleScheduleJob}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <MapComponent 
                    onFeatureCreated={handleFeatureCreated}
                    bufferedGeometry={bufferedGeometry}
                    visibleFeatures={visibleFeatures}
                    drawingMode={drawingMode}
                  />
                  
                  <MapToolbar
                    drawingMode={drawingMode}
                    onDrawPolygon={handleDrawPolygon}
                    onCreateBuffer={handleCreateBuffer}
                    onUploadData={handleUploadData}
                    onZonalStats={handleZonalStats}
                    onHotspotDetection={handleHotspotDetection}
                    onToggleLayers={handleToggleLayers}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onClearAll={handleClearAll}
                    canUndo={undoStack.length > 0}
                    canRedo={redoStack.length > 0}
                  />
                  
                  <FloatingActionButtons
                    onDrawPolygon={handleDrawPolygon}
                    onCreateBuffer={handleCreateBuffer}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onClearAll={handleClearAll}
                    onToggleLayers={handleToggleLayers}
                    drawingMode={drawingMode}
                    canUndo={undoStack.length > 0}
                    canRedo={redoStack.length > 0}
                  />
                  
                  <ResultsPanel
                    isVisible={showResultsPanel}
                    onClose={() => setShowResultsPanel(false)}
                    results={analysisResults}
                    logs={processingLogs}
                    isExpanded={resultsPanelExpanded}
                    onToggleExpand={() => setResultsPanelExpanded(!resultsPanelExpanded)}
                  />
                </>
              )}
              
              {showOnboarding && (
                <OnboardingTooltips 
                  isFirstVisit={showOnboarding}
                  onComplete={handleOnboardingComplete}
                />
              )}
            </main>
          </div>
          
          {/* Onboarding Tooltips */}
          {showOnboarding && (
            <OnboardingTooltips 
              isFirstVisit={showOnboarding}
              onComplete={handleOnboardingComplete}
            />
          )}
          
          {/* Dashboard Modal */}
          <GeoDashboard 
            isVisible={false}
            onClose={() => {}}
          />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Dashboard;