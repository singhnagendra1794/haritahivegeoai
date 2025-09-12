import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Square, 
  Move3D, 
  MapPin, 
  BarChart3, 
  Flame, 
  Layers, 
  Upload,
  RotateCcw,
  RotateCw,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapToolbarProps {
  drawingMode?: boolean;
  onDrawPolygon: () => void;
  onCreateBuffer: () => void;
  onUploadData: () => void;
  onZonalStats: () => void;
  onHotspotDetection: () => void;
  onToggleLayers: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
  drawingMode,
  onDrawPolygon,
  onCreateBuffer,
  onUploadData,
  onZonalStats,
  onHotspotDetection,
  onToggleLayers,
  onUndo,
  onRedo,
  onClearAll,
  canUndo = false,
  canRedo = false,
}) => {
  const { toast } = useToast();

  const handleToolClick = (toolName: string, action: () => void) => {
    action();
    toast({
      title: `${toolName} activated`,
      description: `${toolName} tool is now active. Check the map for interactions.`,
    });
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-2">
        <div className="flex items-center gap-2">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant={drawingMode ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick("Draw Polygon", onDrawPolygon)}
              className="h-9 w-9 p-0"
              title="Draw Polygon"
            >
              <Square className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Buffer Analysis", onCreateBuffer)}
              className="h-9 w-9 p-0"
              title="Buffer Analysis"
            >
              <Move3D className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Point Upload", onUploadData)}
              className="h-9 w-9 p-0"
              title="Upload Data"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          {/* Analysis Tools */}
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Zonal Statistics", onZonalStats)}
              className="h-9 w-9 p-0"
              title="Zonal Statistics"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Hotspot Detection", onHotspotDetection)}
              className="h-9 w-9 p-0"
              title="Hotspot Detection"
            >
              <Flame className="h-4 w-4" />
            </Button>
          </div>

          {/* Layer Management */}
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLayers}
              className="h-9 w-9 p-0"
              title="Toggle Layers"
            >
              <Layers className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onUploadData}
              className="h-9 w-9 p-0"
              title="Upload Data"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-9 w-9 p-0"
              title="Undo"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-9 w-9 p-0"
              title="Redo"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Clear All"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapToolbar;