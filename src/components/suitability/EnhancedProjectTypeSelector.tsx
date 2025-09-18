import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Sprout, 
  Zap,
  MapPin,
  TrendingUp,
  Layers
} from 'lucide-react';

interface ProjectTypeProps {
  onSelect: (projectType: string) => void;
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
    defaultRadius: '1.5 km',
    factors: ['Solar Radiation', 'DEM (Slope)', 'Grid Distance', 'Road Access'],
    details: 'Analyzes solar irradiance, terrain slope, and infrastructure proximity using satellite data'
  },
  {
    id: 'bess',
    title: 'Battery Energy Storage (BESS)',
    description: 'Strategic locations for energy storage systems',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultRadius: '2 km',
    factors: ['Grid Proximity', 'Road Access', 'DEM (Slope)', 'Land Use'],
    details: 'Focuses on electrical grid connectivity, transportation access, and suitable terrain'
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    description: 'Prime areas for crop cultivation and farming',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    defaultRadius: '5 km',
    factors: ['Soil Fertility', 'Rainfall', 'Land Cover', 'DEM (Slope)'],
    details: 'Uses FAO SoilGrids, WorldClim data, and ESA WorldCover for optimal growing conditions'
  }
];

export const EnhancedProjectTypeSelector: React.FC<ProjectTypeProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Select Your Project Type
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your project type to start the customizable suitability analysis. Each type comes with 
          optimized default settings that you can customize in the next steps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {projectTypes.map((project) => (
          <Card 
            key={project.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 group border-2 hover:border-forest-primary/50 ${project.borderColor}`}
            onClick={() => onSelect(project.title)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-xl ${project.bgColor} group-hover:scale-110 transition-transform`}>
                  <project.icon className={`w-8 h-8 ${project.color}`} />
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs bg-forest-primary/10 text-forest-primary border-forest-primary/20 mb-1">
                    GeoAI Ready
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Default: {project.defaultRadius}
                  </div>
                </div>
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
                    <Layers className="w-3 h-3" />
                    Default Analysis Factors:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {project.factors.map((factor) => (
                      <Badge key={factor} variant="outline" className="text-xs justify-start py-1">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>Fully customizable in next steps</span>
                  </div>
                  
                  <Button
                    onClick={() => onSelect(project.title)}
                    className="w-full bg-forest-primary hover:bg-forest-primary/90"
                    size="sm"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Select {project.title}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-8 text-center mt-8">
        <div className="max-w-md mx-auto">
          <h3 className="font-semibold text-charcoal-primary mb-3 text-lg">
            Enhanced Customization Available
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            After selecting your project type, you'll be able to customize buffer radius, 
            select specific geospatial factors, and adjust analysis weights to match your requirements.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              Custom Buffer Radius
            </Badge>
            <Badge variant="outline" className="text-xs">
              Factor Selection  
            </Badge>
            <Badge variant="outline" className="text-xs">
              Weight Adjustment
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};