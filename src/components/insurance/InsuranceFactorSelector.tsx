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
    applicable: ['empty-plot']
  },
  'soil_stability': {
    id: 'soil_stability',
    name: 'Soil Stability',
    description: 'Geotechnical assessment',
    defaultWeight: 25,
    applicable: ['empty-plot']
  },
  'slope_terrain': {
    id: 'slope_terrain',
    name: 'Slope/Terrain',
    description: 'Topographic risk factors',
    defaultWeight: 20,
    applicable: ['empty-plot']
  },
  'hazard_proximity': {
    id: 'hazard_proximity',
    name: 'Hazard Proximity',
    description: 'Distance to hazard zones',
    defaultWeight: 20,
    applicable: ['empty-plot']
  },
  'structural_integrity': {
    id: 'structural_integrity',
    name: 'Structural Integrity',
    description: 'Building condition analysis',
    defaultWeight: 30,
    applicable: ['home-ready']
  },
  'disaster_history': {
    id: 'disaster_history',
    name: 'Disaster History',
    description: 'Past event footprints',
    defaultWeight: 25,
    applicable: ['home-ready']
  },
  'fire_risk': {
    id: 'fire_risk',
    name: 'Fire Risk',
    description: 'Vegetation + wildfire zones',
    defaultWeight: 25,
    applicable: ['home-ready']
  },
  'emergency_access': {
    id: 'emergency_access',
    name: 'Emergency Access',
    description: 'Response time analysis',
    defaultWeight: 20,
    applicable: ['home-ready']
  },
  'damage_assessment': {
    id: 'damage_assessment',
    name: 'Damage Assessment',
    description: 'Post-event damage mapping',
    defaultWeight: 35,
    applicable: ['post-disaster']
  },
  'accessibility': {
    id: 'accessibility',
    name: 'Access/Recovery',
    description: 'Infrastructure status',
    defaultWeight: 25,
    applicable: ['post-disaster']
  },
  'secondary_hazards': {
    id: 'secondary_hazards',
    name: 'Secondary Hazards',
    description: 'Aftershocks/flooding',
    defaultWeight: 25,
    applicable: ['post-disaster']
  },
  'resource_availability': {
    id: 'resource_availability',
    name: 'Resource Availability',
    description: 'Repair material access',
    defaultWeight: 15,
    applicable: ['post-disaster']
  }
};

const DEFAULT_CONFIGS: Record<string, { selectedFactors: string[]; weights: Record<string, number> }> = {
  'empty-plot': {
    selectedFactors: ['flood_risk', 'soil_stability', 'slope_terrain', 'hazard_proximity'],
    weights: {
      flood_risk: 35,
      soil_stability: 25,
      slope_terrain: 20,
      hazard_proximity: 20
    }
  },
  'home-ready': {
    selectedFactors: ['structural_integrity', 'disaster_history', 'fire_risk', 'emergency_access'],
    weights: {
      structural_integrity: 30,
      disaster_history: 25,
      fire_risk: 25,
      emergency_access: 20
    }
  },
  'post-disaster': {
    selectedFactors: ['damage_assessment', 'accessibility', 'secondary_hazards', 'resource_availability'],
    weights: {
      damage_assessment: 35,
      accessibility: 25,
      secondary_hazards: 25,
      resource_availability: 15
    }
  }
};

interface InsuranceFactorSelectorProps {
  insuranceType: 'empty-plot' | 'home-ready' | 'post-disaster';
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
    'empty-plot': 'Empty Plot Risk',
    'home-ready': 'Built Home Risk',
    'post-disaster': 'Post-Disaster Impact'
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
