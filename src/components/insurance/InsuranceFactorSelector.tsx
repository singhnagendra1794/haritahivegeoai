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
  'flood_risk': {
    id: 'flood_risk',
    name: 'Flood Risk',
    description: 'FEMA flood zones + DEM elevation analysis',
    defaultWeight: 35,
    applicable: ['mortgage']
  },
  'fire_risk': {
    id: 'fire_risk',
    name: 'Fire Risk',
    description: 'Vegetation cover + slope + historical fire data',
    defaultWeight: 25,
    applicable: ['mortgage', 'home']
  },
  'crime_stability': {
    id: 'crime_stability',
    name: 'Crime/Neighborhood Stability',
    description: 'Population + crime proxies analysis',
    defaultWeight: 20,
    applicable: ['mortgage']
  },
  'emergency_services': {
    id: 'emergency_services',
    name: 'Emergency Services Access',
    description: 'Distance to fire stations, hospitals, hydrants',
    defaultWeight: 20,
    applicable: ['mortgage', 'home']
  },
  'building_condition': {
    id: 'building_condition',
    name: 'Roof/Building Condition',
    description: 'Remote sensing overlays for structural analysis',
    defaultWeight: 30,
    applicable: ['home']
  },
  'disaster_footprint': {
    id: 'disaster_footprint',
    name: 'Historical Disaster Footprint',
    description: 'Hurricane, flood, wildfire historical maps',
    defaultWeight: 25,
    applicable: ['home']
  },
  'accident_hotspots': {
    id: 'accident_hotspots',
    name: 'Road Accident Hotspots',
    description: 'Traffic + crash datasets analysis',
    defaultWeight: 35,
    applicable: ['vehicle']
  },
  'theft_likelihood': {
    id: 'theft_likelihood',
    name: 'Theft Likelihood',
    description: 'Crime data + population density correlation',
    defaultWeight: 25,
    applicable: ['vehicle']
  },
  'environmental_risk': {
    id: 'environmental_risk',
    name: 'Environmental Risk',
    description: 'Flood-prone roads, snow/ice zones',
    defaultWeight: 25,
    applicable: ['vehicle']
  },
  'major_roads': {
    id: 'major_roads',
    name: 'Proximity to Major Roads',
    description: 'Distance to highways and arterials',
    defaultWeight: 15,
    applicable: ['vehicle']
  }
};

const DEFAULT_CONFIGS: Record<string, { selectedFactors: string[]; weights: Record<string, number> }> = {
  mortgage: {
    selectedFactors: ['flood_risk', 'fire_risk', 'crime_stability', 'emergency_services'],
    weights: {
      flood_risk: 35,
      fire_risk: 25,
      crime_stability: 20,
      emergency_services: 20
    }
  },
  home: {
    selectedFactors: ['building_condition', 'disaster_footprint', 'fire_risk', 'emergency_services'],
    weights: {
      building_condition: 30,
      disaster_footprint: 25,
      fire_risk: 25,
      emergency_services: 20
    }
  },
  vehicle: {
    selectedFactors: ['accident_hotspots', 'theft_likelihood', 'environmental_risk', 'major_roads'],
    weights: {
      accident_hotspots: 35,
      theft_likelihood: 25,
      environmental_risk: 25,
      major_roads: 15
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
    mortgage: 'Mortgage Insurance',
    home: 'Home Insurance',
    vehicle: 'Vehicle Insurance'
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
