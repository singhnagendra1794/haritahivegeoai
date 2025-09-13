import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Sprout, 
  ShoppingCart, 
  Home, 
  GraduationCap,
  Zap,
  Wheat,
  Building,
  MapPin,
  Stethoscope
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
    id: 'solar-farm',
    title: 'Solar Farm',
    description: 'Optimal locations for solar energy installations',
    icon: Sun,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    criteria: ['Solar Radiation', 'Slope', 'Grid Distance', 'Land Use'],
    weights: {
      'solar_radiation': 0.35,
      'slope': 0.25,
      'grid_distance': 0.20,
      'land_use': 0.20
    }
  },
  {
    id: 'agriculture',
    title: 'Agriculture Crop',
    description: 'Best areas for crop cultivation and farming',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    criteria: ['Soil Quality', 'Rainfall', 'Temperature', 'Slope'],
    weights: {
      'soil_quality': 0.30,
      'rainfall': 0.25,
      'temperature': 0.25,
      'slope': 0.20
    }
  },
  {
    id: 'retail-store',
    title: 'Retail Store',
    description: 'High-traffic locations for retail businesses',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    criteria: ['Population Density', 'Road Access', 'Competition', 'Income Level'],
    weights: {
      'population_density': 0.30,
      'road_access': 0.25,
      'competition': 0.25,
      'income_level': 0.20
    }
  },
  {
    id: 'housing',
    title: 'Housing Development',
    description: 'Suitable areas for residential development',
    icon: Home,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    criteria: ['Slope', 'Flood Risk', 'Infrastructure', 'Zoning'],
    weights: {
      'slope': 0.30,
      'flood_risk': 0.25,
      'infrastructure': 0.25,
      'zoning': 0.20
    }
  },
  {
    id: 'school-hospital',
    title: 'School/Hospital',
    description: 'Accessible locations for public services',
    icon: GraduationCap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    criteria: ['Population Access', 'Road Network', 'Land Availability', 'Safety'],
    weights: {
      'population_access': 0.35,
      'road_network': 0.25,
      'land_availability': 0.20,
      'safety': 0.20
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((project) => (
          <Card 
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-2 hover:border-forest-primary/50"
            onClick={() => handleProjectSelect(project)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${project.bgColor} group-hover:scale-110 transition-transform`}>
                  <project.icon className={`w-6 h-6 ${project.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  GeoAI
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-forest-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Analysis Criteria:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.criteria.map((criterion) => (
                      <Badge key={criterion} variant="outline" className="text-xs">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    Multi-criteria analysis with AI optimization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-charcoal-primary mb-2">
          Custom Project Type
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Need a different type of analysis? Contact us for custom project configurations.
        </p>
        <Badge variant="outline" className="text-xs">
          Coming Soon
        </Badge>
      </div>
    </div>
  );
};