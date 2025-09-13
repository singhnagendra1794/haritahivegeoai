import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Sprout, 
  Zap,
  MapPin,
  TrendingUp
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
  const handleProjectSelect = (project: typeof projectTypes[0]) => {
    onSelect({
      type: project.title,
      weights: project.weights
    });
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    Weighted overlay analysis with satellite data
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