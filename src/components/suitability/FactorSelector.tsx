import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sun, 
  Mountain,
  Sprout,
  Zap,
  Car,
  Cloud,
  Layers,
  Settings,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface FactorConfig {
  selectedFactors: string[];
  weights: Record<string, number>;
}

interface FactorSelectorProps {
  projectType: string;
  onSelect: (config: FactorConfig) => void;
}

// Available geospatial factors with their metadata
const availableFactors = {
  'slope': {
    name: 'DEM (Slope)',
    description: 'Terrain slope analysis from SRTM Digital Elevation Model',
    icon: Mountain,
    color: 'text-orange-600',
    datasets: ['srtm_dem'],
    applicableFor: ['Solar Farm', 'Battery Energy Storage (BESS)', 'Agriculture', 'Wind Energy', 'Urban Development', 'Mining', 'Infrastructure Planning']
  },
  'solar_radiation': {
    name: 'Solar Radiation',
    description: 'Solar irradiance data for photovoltaic potential',
    icon: Sun,
    color: 'text-yellow-600',
    datasets: ['solar_radiation'],
    applicableFor: ['Solar Farm']
  },
  'wind_speed': {
    name: 'Wind Speed / Wind Potential',
    description: 'Wind resource assessment from Global Wind Atlas',
    icon: Cloud,
    color: 'text-cyan-600',
    datasets: ['global_wind_atlas'],
    applicableFor: ['Wind Energy']
  },
  'soil_fertility': {
    name: 'Soil Fertility',
    description: 'Soil quality analysis from FAO SoilGrids',
    icon: Sprout,
    color: 'text-green-600',
    datasets: ['fao_soilgrids'],
    applicableFor: ['Agriculture']
  },
  'rainfall': {
    name: 'Rainfall / Climate Data',
    description: 'Precipitation data from WorldClim',
    icon: Cloud,
    color: 'text-blue-600',
    datasets: ['worldclim_precip'],
    applicableFor: ['Agriculture', 'Urban Development']
  },
  'land_cover': {
    name: 'Land Cover',
    description: 'Land use classification from ESA WorldCover',
    icon: Layers,
    color: 'text-green-500',
    datasets: ['esa_worldcover'],
    applicableFor: ['Agriculture', 'Battery Energy Storage (BESS)', 'Urban Development', 'Mining']
  },
  'land_use': {
    name: 'Land Use Suitability',
    description: 'Land use suitability analysis from ESA WorldCover',
    icon: Layers,
    color: 'text-green-500',
    datasets: ['esa_worldcover'],
    applicableFor: ['Battery Energy Storage (BESS)', 'Urban Development']
  },
  'population_density': {
    name: 'Population Density',
    description: 'Population distribution from WorldPop database',
    icon: Settings,
    color: 'text-indigo-600',
    datasets: ['worldpop_density'],
    applicableFor: ['Urban Development', 'Infrastructure Planning']
  },
  'protected_areas': {
    name: 'Protected Areas / Environmental Constraints',
    description: 'Environmental protection zones and restricted areas',
    icon: Settings,
    color: 'text-red-600',
    datasets: ['protected_areas_wdpa'],
    applicableFor: ['Wind Energy', 'Urban Development', 'Mining', 'Infrastructure Planning']
  },
  'grid_distance': {
    name: 'Grid Connection Distance',
    description: 'Distance to electrical grid infrastructure from OpenStreetMap',
    icon: Zap,
    color: 'text-purple-600',
    datasets: ['osm_grid'],
    applicableFor: ['Solar Farm', 'Battery Energy Storage (BESS)', 'Wind Energy']
  },
  'road_access': {
    name: 'Road Network Distance',
    description: 'Proximity to road infrastructure from OpenStreetMap',
    icon: Car,
    color: 'text-gray-600',
    datasets: ['osm_roads'],
    applicableFor: ['Solar Farm', 'Battery Energy Storage (BESS)', 'Mining', 'Infrastructure Planning']
  },
  'highway_access': {
    name: 'Highway Access',
    description: 'Distance to major highways and transportation corridors',
    icon: Car,
    color: 'text-slate-600',
    datasets: ['osm_highways'],
    applicableFor: ['Urban Development', 'Mining', 'Infrastructure Planning']
  },
  'geology': {
    name: 'Geological Conditions',
    description: 'Geological stability and mineral resource data',
    icon: Mountain,
    color: 'text-amber-600',
    datasets: ['geological_survey'],
    applicableFor: ['Mining', 'Infrastructure Planning']
  },
  'water_resources': {
    name: 'Water Resources',
    description: 'Proximity to water bodies and availability',
    icon: Cloud,
    color: 'text-teal-600',
    datasets: ['water_bodies_osm'],
    applicableFor: ['Urban Development', 'Mining', 'Infrastructure Planning']
  }
};

// Default configurations for each project type
const defaultConfigurations = {
  'Solar Farm': {
    factors: ['solar_radiation', 'slope', 'grid_distance', 'road_access'],
    weights: {
      'solar_radiation': 0.40,
      'slope': 0.25,
      'grid_distance': 0.20,
      'road_access': 0.15
    }
  },
  'Battery Energy Storage (BESS)': {
    factors: ['grid_distance', 'road_access', 'slope', 'land_use'],
    weights: {
      'grid_distance': 0.35,
      'road_access': 0.30,
      'slope': 0.20,
      'land_use': 0.15
    }
  },
  'Agriculture': {
    factors: ['soil_fertility', 'rainfall', 'land_cover', 'slope'],
    weights: {
      'soil_fertility': 0.35,
      'rainfall': 0.30,
      'land_cover': 0.20,
      'slope': 0.15
    }
  },
  'Wind Energy': {
    factors: ['wind_speed', 'slope', 'grid_distance', 'protected_areas'],
    weights: {
      'wind_speed': 0.45,
      'slope': 0.25,
      'grid_distance': 0.20,
      'protected_areas': 0.10
    }
  },
  'Urban Development': {
    factors: ['population_density', 'slope', 'highway_access', 'water_resources', 'protected_areas'],
    weights: {
      'population_density': 0.30,
      'slope': 0.25,
      'highway_access': 0.20,
      'water_resources': 0.15,
      'protected_areas': 0.10
    }
  },
  'Mining': {
    factors: ['geology', 'slope', 'road_access', 'water_resources', 'protected_areas'],
    weights: {
      'geology': 0.35,
      'slope': 0.25,
      'road_access': 0.20,
      'water_resources': 0.12,
      'protected_areas': 0.08
    }
  },
  'Infrastructure Planning': {
    factors: ['population_density', 'slope', 'highway_access', 'geology', 'protected_areas'],
    weights: {
      'population_density': 0.30,
      'slope': 0.25,
      'highway_access': 0.20,
      'geology': 0.15,
      'protected_areas': 0.10
    }
  }
};

export const FactorSelector: React.FC<FactorSelectorProps> = ({ projectType, onSelect }) => {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [useCustomConfiguration, setUseCustomConfiguration] = useState(false);

  // Initialize with default configuration
  useEffect(() => {
    const defaultConfig = defaultConfigurations[projectType as keyof typeof defaultConfigurations];
    if (defaultConfig) {
      setSelectedFactors(defaultConfig.factors);
      setWeights(defaultConfig.weights);
    }
  }, [projectType]);

  // Get factors applicable to current project type
  const applicableFactors = Object.entries(availableFactors).filter(([_, factor]) => 
    factor.applicableFor.includes(projectType)
  );

  const handleFactorToggle = (factorId: string, checked: boolean) => {
    setUseCustomConfiguration(true);
    
    if (checked) {
      setSelectedFactors(prev => {
        const newFactors = [...prev, factorId];
        // Give new factor a default weight
        const defaultWeight = 1 / (newFactors.length);
        setWeights(prevWeights => {
          const newWeights = { ...prevWeights };
          newFactors.forEach(factor => {
            newWeights[factor] = newWeights[factor] || defaultWeight;
          });
          return newWeights;
        });
        return newFactors;
      });
    } else {
      setSelectedFactors(prev => {
        const newFactors = prev.filter(f => f !== factorId);
        setWeights(prevWeights => {
          const newWeights = { ...prevWeights };
          delete newWeights[factorId];
          return newWeights;
        });
        return newFactors;
      });
    }
  };

  const handleWeightChange = (factorId: string, value: number[]) => {
    setUseCustomConfiguration(true);
    setWeights(prev => ({
      ...prev,
      [factorId]: value[0] / 100
    }));
  };

  const normalizeWeights = () => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    if (total === 0) return;
    
    const normalized = Object.fromEntries(
      Object.entries(weights).map(([key, weight]) => [key, weight / total])
    );
    
    setWeights(normalized);
  };

  const resetToDefaults = () => {
    const defaultConfig = defaultConfigurations[projectType as keyof typeof defaultConfigurations];
    if (defaultConfig) {
      setSelectedFactors(defaultConfig.factors);
      setWeights(defaultConfig.weights);
      setUseCustomConfiguration(false);
    }
  };

  const handleProceed = () => {
    // Ensure weights are normalized
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const finalWeights = total > 0 ? Object.fromEntries(
      Object.entries(weights).map(([key, weight]) => [key, weight / total])
    ) : weights;

    onSelect({
      selectedFactors,
      weights: finalWeights
    });
  };

  const getTotalWeight = () => {
    return Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  };

  const isValidConfiguration = () => {
    return selectedFactors.length > 0 && getTotalWeight() > 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Select Analysis Factors
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose which geospatial factors to include in your {projectType.toLowerCase()} suitability analysis 
          and adjust their importance weights.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-forest-primary" />
              Factor Configuration for {projectType}
            </div>
            <div className="flex items-center gap-2">
              {useCustomConfiguration && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Custom Configuration
                </Badge>
              )}
              <Badge variant="secondary" className="bg-forest-primary/10 text-forest-primary">
                {selectedFactors.length} factors selected
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Select the geospatial datasets and adjust their weights for your analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Factor Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-charcoal-primary">Available Factors:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {applicableFactors.map(([factorId, factor]) => {
                const isSelected = selectedFactors.includes(factorId);
                const weight = weights[factorId] || 0;
                
                return (
                  <Card key={factorId} className={`relative transition-all duration-200 ${
                    isSelected 
                      ? 'border-forest-primary/50 bg-forest-primary/5' 
                      : 'border-border hover:border-forest-primary/30'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleFactorToggle(factorId, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <factor.icon className={`w-4 h-4 ${factor.color}`} />
                            <h4 className="font-medium text-sm">{factor.name}</h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-forest-primary ml-auto" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {factor.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {factor.datasets.map(dataset => (
                              <Badge key={dataset} variant="outline" className="text-xs">
                                {dataset}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Weight Configuration */}
          {selectedFactors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-charcoal-primary">Weight Configuration:</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className={`font-medium ${
                    Math.abs(getTotalWeight() - 1) < 0.01 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {(getTotalWeight() * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFactors.map(factorId => {
                  const factor = availableFactors[factorId as keyof typeof availableFactors];
                  const weight = weights[factorId] || 0;
                  
                  return (
                    <div key={factorId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <factor.icon className={`w-4 h-4 ${factor.color}`} />
                          <label className="text-sm font-medium">
                            {factor.name}
                          </label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(weight * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[weight * 100]}
                        onValueChange={(value) => handleWeightChange(factorId, value)}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={normalizeWeights}
                  className="flex-1"
                >
                  Normalize to 100%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetToDefaults}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Defaults
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4 border-t border-border">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Selected Configuration:</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Factors:</p>
                  <p className="font-medium">{selectedFactors.length} datasets</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Weight:</p>
                  <p className={`font-medium ${
                    Math.abs(getTotalWeight() - 1) < 0.01 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {(getTotalWeight() * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleProceed}
              disabled={!isValidConfiguration()}
              className="w-full bg-forest-primary hover:bg-forest-primary/90"
              size="lg"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Proceed to Analysis Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};