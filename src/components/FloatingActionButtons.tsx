import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shapes, 
  CircleDot, 
  Undo2, 
  Redo2, 
  Trash2, 
  Plus,
  Layers3,
  Zap
} from 'lucide-react';

interface FloatingActionButtonsProps {
  onDrawPolygon: () => void;
  onCreateBuffer: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  onToggleLayers: () => void;
  canUndo: boolean;
  canRedo: boolean;
  drawingMode: boolean;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onDrawPolygon,
  onCreateBuffer,
  onUndo,
  onRedo,
  onClearAll,
  onToggleLayers,
  canUndo,
  canRedo,
  drawingMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Secondary Actions - Appear when expanded */}
      <div className={`flex flex-col gap-2 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Undo/Redo Actions */}
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onUndo}
                disabled={!canUndo}
                className="rounded-full h-10 w-10 bg-white shadow-md hover:shadow-lg hover:bg-forest-primary/10 border-forest-primary/20"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo last action</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onRedo}
                disabled={!canRedo}
                className="rounded-full h-10 w-10 bg-white shadow-md hover:shadow-lg hover:bg-forest-primary/10 border-forest-primary/20"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo last action</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Layer Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleLayers}
              className="rounded-full h-12 w-12 bg-white shadow-md hover:shadow-lg hover:bg-forest-primary/10 border-forest-primary/20"
            >
              <Layers3 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle layer visibility</p>
          </TooltipContent>
        </Tooltip>

        {/* Clear All */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onClearAll}
              className="rounded-full h-12 w-12 bg-white shadow-md hover:shadow-lg hover:bg-destructive/10 border-destructive/20 text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear all drawings</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Primary Actions - Always visible */}
      <div className="flex flex-col gap-3">
        {/* Buffer Tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onCreateBuffer}
              className="rounded-full h-14 w-14 bg-charcoal-primary hover:bg-charcoal-light shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CircleDot className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create buffer around selected polygon</p>
          </TooltipContent>
        </Tooltip>

        {/* Draw Polygon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDrawPolygon}
              className={`rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all duration-200 ${
                drawingMode 
                  ? 'bg-forest-light hover:bg-forest-light/90 animate-pulse' 
                  : 'bg-forest-primary hover:bg-forest-primary/90'
              }`}
            >
              <Shapes className="h-7 w-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{drawingMode ? 'Exit drawing mode' : 'Start drawing polygons'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Main Menu Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleExpanded}
              variant="outline"
              className={`rounded-full h-12 w-12 bg-white shadow-md hover:shadow-lg border-forest-primary/20 transition-all duration-200 ${
                isExpanded ? 'rotate-45' : ''
              }`}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isExpanded ? 'Close menu' : 'More actions'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default FloatingActionButtons;