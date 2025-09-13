import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Sun, 
  Sprout, 
  Zap,
  MapPin,
  TrendingUp,
  Settings,
  RotateCcw
} from 'lucide-react';

interface ProjectConfig {
  type: string;
  weights: Record<string, number>;
}

interface ProjectTypeProps {
  onSelect: (config: ProjectConfig) => void;
}

const projectTypes = [
  {
    id: 'solar',
    title: 'Solar Farm',
    description: 'Optimal locations for photovoltaic solar installations',
    icon: Sun,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    criteria: ['Solar Radiation', 'Slope (DEM)', 'Grid Distance', 'Road Access'],
    details: 'Analyzes solar irradiance, terrain slope, and infrastructure proximity using satellite data and OpenStreetMap',
    weights: {
      'solar_radiation': 0.40,
      'slope': 0.25,
      'grid_distance': 0.20,
      'road_access': 0.15
    }
  },
  {
    id: 'bess',
    title: 'Battery Energy Storage (BESS)',
    description: 'Strategic locations for energy storage systems',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    criteria: ['Grid Proximity', 'Road Access', 'Slope (DEM)', 'Land Use'],
    details: 'Focuses on electrical grid connectivity, transportation access, and suitable terrain for large-scale batteries',
    weights: {
      'grid_distance': 0.35,
      'road_access': 0.30,
      'slope': 0.20,
      'land_use': 0.15
    }
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    description: 'Prime areas for crop cultivation and farming',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    criteria: ['Soil Fertility', 'Rainfall', 'Land Cover', 'Slope'],
    details: 'Uses FAO SoilGrids, WorldClim data, and ESA WorldCover to identify optimal growing conditions',
    weights: {
      'soil_fertility': 0.35,
      'rainfall': 0.30,
      'land_cover': 0.20,
      'slope': 0.15
    }
  }
];

export const ProjectTypeSelector: React.FC<ProjectTypeProps> = ({ onSelect }) => {
  const [customWeights, setCustomWeights] = useState<Record<string, Record<string, number>>>({});
  const [selectedProjectForCustomization, setSelectedProjectForCustomization] = useState<string | null>(null);

  const handleProjectSelect = (project: typeof projectTypes[0], useCustomWeights = false) => {
    const weights = useCustomWeights && customWeights[project.id] 
      ? customWeights[project.id] 
      : project.weights;
      
    onSelect({
      type: project.title,
      weights: weights
    });
  };

  const handleWeightChange = (projectId: string, criterion: string, value: number[]) => {
    setCustomWeights(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [criterion]: value[0] / 100
      }
    }));
  };

  const resetWeights = (projectId: string) => {
    setCustomWeights(prev => {
      const updated = { ...prev };
      delete updated[projectId];
      return updated;
    });
  };

  const getCurrentWeights = (projectId: string) => {
    const project = projectTypes.find(p => p.id === projectId);
    return customWeights[projectId] || project?.weights || {};
  };

  const normalizeWeights = (projectId: string) => {
    const currentWeights = getCurrentWeights(projectId);
    const total = Object.values(currentWeights).reduce((sum, weight) => sum + weight, 0);
    
    if (total === 0) return currentWeights;
    
    const normalized = Object.fromEntries(
      Object.entries(currentWeights).map(([key, weight]) => [key, weight / total])
    );
    
    setCustomWeights(prev => ({
      ...prev,
      [projectId]: normalized
    }));
  };

  const CustomWeightsDialog = ({ project }: { project: typeof projectTypes[0] }) => {
    const currentWeights = getCurrentWeights(project.id);
    const hasCustomWeights = Boolean(customWeights[project.id]);
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setSelectedProjectForCustomization(project.id)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize Weights
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize {project.title} Weights</DialogTitle>
            <DialogDescription>
              Adjust the importance of each factor for your specific needs. Weights will be automatically normalized.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {Object.entries(currentWeights).map(([criterion, weight]) => (
              <div key={criterion} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">
                    {criterion.replace(/_/g, ' ')}
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(weight * 100)}%
                  </span>
                </div>
                <Slider
                  value={[weight * 100]}
                  onValueChange={(value) => handleWeightChange(project.id, criterion, value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => normalizeWeights(project.id)}
                className="flex-1"
              >
                Normalize (100%)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => resetWeights(project.id)}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <Button
              onClick={() => handleProjectSelect(project, true)}
              className="w-full bg-forest-primary hover:bg-forest-primary/90"
            >
              Use Custom Weights
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Select Your Project Type
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the type of project you want to analyze. Each project type uses different criteria 
          and weights to determine site suitability.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {projectTypes.map((project) => (
          <Card 
            key={project.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 group border-2 hover:border-forest-primary/50 ${project.borderColor}`}
            onClick={() => handleProjectSelect(project)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-xl ${project.bgColor} group-hover:scale-110 transition-transform`}>
                  <project.icon className={`w-8 h-8 ${project.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs bg-forest-primary/10 text-forest-primary border-forest-primary/20">
                  GeoAI
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-forest-primary transition-colors mb-2">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm mb-3">
                {project.description}
              </CardDescription>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {project.details}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Analysis Factors:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.criteria.map((criterion) => (
                      <Badge key={criterion} variant="outline" className="text-xs justify-center py-1">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    Weighted overlay analysis with satellite data
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleProjectSelect(project, false)}
                      className="w-full bg-forest-primary hover:bg-forest-primary/90"
                      size="sm"
                    >
                      Use Default Settings
                    </Button>
                    
                    <CustomWeightsDialog project={project} />
                    
                    {customWeights[project.id] && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 justify-center">
                        Custom weights configured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-8 text-center mt-8">
        <div className="max-w-md mx-auto">
          <h3 className="font-semibold text-charcoal-primary mb-3 text-lg">
            Need a Custom Analysis?
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Our GeoAI platform can be configured for additional project types including wind energy, 
            urban development, mining, and infrastructure planning.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              Custom Weights
            </Badge>
            <Badge variant="outline" className="text-xs">
              Additional Datasets  
            </Badge>
            <Badge variant="outline" className="text-xs">
              Enterprise Solutions
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};