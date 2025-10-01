import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface InsuranceFactor {
  id: string;
  name: string;
  description: string;
  defaultWeight: number;
  applicable: string[];
}

const INSURANCE_FACTORS: Record<string, InsuranceFactor> = {
  // Mortgage Insurance Factors
  'flood_zone': {
    id: 'flood_zone',
    name: 'Flood Zone',
    description: 'FEMA flood zones + DEM elevation',
    defaultWeight: 40,
    applicable: ['mortgage']
  },
  'wildfire_risk': {
    id: 'wildfire_risk',
    name: 'Wildfire Risk',
    description: 'Vegetation cover + historical fire data',
    defaultWeight: 25,
    applicable: ['mortgage', 'home']
  },
  'slope_elevation': {
    id: 'slope_elevation',
    name: 'Slope/Elevation',
    description: 'Topographic risk factors',
    defaultWeight: 20,
    applicable: ['mortgage', 'vehicle']
  },
  'infrastructure_access': {
    id: 'infrastructure_access',
    name: 'Infrastructure Access',
    description: 'Roads, utilities, emergency services',
    defaultWeight: 15,
    applicable: ['mortgage', 'home']
  },
  
  // Home Insurance Factors
  'roof_structure': {
    id: 'roof_structure',
    name: 'Roof/Structure Proxy',
    description: 'Land cover analysis for building condition',
    defaultWeight: 30,
    applicable: ['home']
  },
  'flood_risk_home': {
    id: 'flood_risk_home',
    name: 'Flood Risk',
    description: 'FEMA zones + elevation analysis',
    defaultWeight: 30,
    applicable: ['home']
  },
  
  // Vehicle Insurance Factors
  'road_density': {
    id: 'road_density',
    name: 'Road Density/Traffic',
    description: 'OSM road network + traffic risk',
    defaultWeight: 40,
    applicable: ['vehicle']
  },
  'flood_risk_vehicle': {
    id: 'flood_risk_vehicle',
    name: 'Flood Risk',
    description: 'Flood-prone roads and areas',
    defaultWeight: 25,
    applicable: ['vehicle']
  },
  'crime_proxy': {
    id: 'crime_proxy',
    name: 'Crime Proxy',
    description: 'Population density analysis',
    defaultWeight: 20,
    applicable: ['vehicle']
  },
  'terrain_hazard': {
    id: 'terrain_hazard',
    name: 'Terrain Hazard',
    description: 'Slope and elevation risks',
    defaultWeight: 15,
    applicable: ['vehicle']
  }
};

const DEFAULT_CONFIGS: Record<string, { selectedFactors: string[]; weights: Record<string, number> }> = {
  'mortgage': {
    selectedFactors: ['flood_zone', 'wildfire_risk', 'slope_elevation', 'infrastructure_access'],
    weights: {
      flood_zone: 40,
      wildfire_risk: 25,
      slope_elevation: 20,
      infrastructure_access: 15
    }
  },
  'home': {
    selectedFactors: ['roof_structure', 'flood_risk_home', 'wildfire_risk', 'infrastructure_access'],
    weights: {
      roof_structure: 30,
      flood_risk_home: 30,
      wildfire_risk: 20,
      infrastructure_access: 20
    }
  },
  'vehicle': {
    selectedFactors: ['road_density', 'flood_risk_vehicle', 'crime_proxy', 'terrain_hazard'],
    weights: {
      road_density: 40,
      flood_risk_vehicle: 25,
      crime_proxy: 20,
      terrain_hazard: 15
    }
  }
};

interface InsuranceFactorSelectorProps {
  insuranceType: 'mortgage' | 'home' | 'vehicle';
  onSelect: (config: { selectedFactors: string[]; weights: Record<string, number> }) => void;
}

export const InsuranceFactorSelector: React.FC<InsuranceFactorSelectorProps> = ({ 
  insuranceType,
  onSelect 
}) => {
  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(new Set());
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [isCustom, setIsCustom] = useState(false);

  const applicableFactors = Object.values(INSURANCE_FACTORS).filter(
    factor => factor.applicable.includes(insuranceType)
  );

  useEffect(() => {
    const defaultConfig = DEFAULT_CONFIGS[insuranceType];
    setSelectedFactors(new Set(defaultConfig.selectedFactors));
    setWeights(defaultConfig.weights);
    setIsCustom(false);
  }, [insuranceType]);

  const handleFactorToggle = (factorId: string) => {
    const newSelected = new Set(selectedFactors);
    if (newSelected.has(factorId)) {
      newSelected.delete(factorId);
      const newWeights = { ...weights };
      delete newWeights[factorId];
      setWeights(normalizeWeights(newWeights));
    } else {
      newSelected.add(factorId);
      const factor = INSURANCE_FACTORS[factorId];
      setWeights(normalizeWeights({ ...weights, [factorId]: factor.defaultWeight }));
    }
    setSelectedFactors(newSelected);
    setIsCustom(true);
  };

  const handleWeightChange = (factorId: string, value: number[]) => {
    setWeights({ ...weights, [factorId]: value[0] });
    setIsCustom(true);
  };

  const normalizeWeights = (currentWeights: Record<string, number>) => {
    const total = Object.values(currentWeights).reduce((sum, val) => sum + val, 0);
    if (total === 0) return currentWeights;
    
    const normalized: Record<string, number> = {};
    Object.keys(currentWeights).forEach(key => {
      normalized[key] = Math.round((currentWeights[key] / total) * 100);
    });
    return normalized;
  };

  const resetToDefaults = () => {
    const defaultConfig = DEFAULT_CONFIGS[insuranceType];
    setSelectedFactors(new Set(defaultConfig.selectedFactors));
    setWeights(defaultConfig.weights);
    setIsCustom(false);
  };

  const handleProceed = () => {
    const finalWeights = normalizeWeights(weights);
    onSelect({
      selectedFactors: Array.from(selectedFactors),
      weights: finalWeights
    });
  };

  const isValidConfig = selectedFactors.size > 0 && 
    Object.values(weights).reduce((sum, val) => sum + val, 0) > 0;

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);
  const insuranceTypeLabels = {
    'mortgage': 'Mortgage Insurance',
    'home': 'Home Insurance',
    'vehicle': 'Vehicle Insurance'
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Risk Factors</CardTitle>
            <CardDescription>
              Select and weight risk factors for {insuranceTypeLabels[insuranceType]}
            </CardDescription>
          </div>
          {isCustom && (
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              Custom
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Factor Selection */}
        <div className="space-y-4">
          {applicableFactors.map((factor) => {
            const isSelected = selectedFactors.has(factor.id);
            const weight = weights[factor.id] || 0;
            
            return (
              <div
                key={factor.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={factor.id}
                    checked={isSelected}
                    onCheckedChange={() => handleFactorToggle(factor.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label 
                        htmlFor={factor.id}
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        {factor.name}
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
                            {weight}%
                          </Badge>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {factor.description}
                      </p>
                    </div>
                    
                    {isSelected && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Weight</span>
                          <span>{weight}%</span>
                        </div>
                        <Slider
                          value={[weight]}
                          onValueChange={(value) => handleWeightChange(factor.id, value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weight Summary */}
        {selectedFactors.size > 0 && (
          <div className={`p-4 rounded-lg border ${
            Math.abs(totalWeight - 100) < 2 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
              : 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'
          }`}>
            <div className="flex items-start gap-2">
              {Math.abs(totalWeight - 100) < 2 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Total Weight: {totalWeight}%
                </p>
                {Math.abs(totalWeight - 100) >= 2 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Weights will be automatically normalized to 100%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            disabled={!isCustom}
            className="flex-1"
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleProceed}
            disabled={!isValidConfig}
            className="flex-1"
          >
            Next: Analysis
          </Button>
        </div>

        {!isValidConfig && selectedFactors.size === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Please select at least one risk factor</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
