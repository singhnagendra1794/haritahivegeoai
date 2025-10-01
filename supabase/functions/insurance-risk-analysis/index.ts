import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  insuranceType: 'mortgage' | 'home' | 'vehicle';
  weights: Record<string, number>;
  selectedFactors: string[];
  region: {
    center: [number, number];
    bufferRadius: number;
    address: string;
  };
  sessionId: string;
}

interface SuitabilityResult {
  projectId: string;
  suitabilityData: any;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
    address?: string;
  }>;
  breakdown: Record<string, number>;
}

// Insurance risk configurations
const insuranceConfigurations: Record<string, any> = {
  mortgage: {
    factors: ['flood_zone', 'wildfire_risk', 'slope_elevation', 'infrastructure_access'],
    defaultWeights: {
      flood_zone: 40,
      wildfire_risk: 25,
      slope_elevation: 20,
      infrastructure_access: 15
    },
    riskRanges: {
      flood_zone: { low: [0, 2], medium: [2, 5], high: [5, 10] },
      wildfire_risk: { low: [0, 3], medium: [3, 6], high: [6, 10] },
      slope_elevation: { low: [0, 2], medium: [2, 5], high: [5, 10] },
      infrastructure_access: { low: [0, 3], medium: [3, 5], high: [5, 10] }
    }
  },
  home: {
    factors: ['roof_structure', 'flood_risk_home', 'wildfire_risk', 'infrastructure_access'],
    defaultWeights: {
      roof_structure: 30,
      flood_risk_home: 30,
      wildfire_risk: 20,
      infrastructure_access: 20
    },
    riskRanges: {
      roof_structure: { low: [0, 3], medium: [3, 6], high: [6, 10] },
      flood_risk_home: { low: [0, 2], medium: [2, 5], high: [5, 10] },
      wildfire_risk: { low: [0, 3], medium: [3, 6], high: [6, 10] },
      infrastructure_access: { low: [0, 3], medium: [3, 5], high: [5, 10] }
    }
  },
  vehicle: {
    factors: ['road_density', 'flood_risk_vehicle', 'crime_proxy', 'terrain_hazard'],
    defaultWeights: {
      road_density: 40,
      flood_risk_vehicle: 25,
      crime_proxy: 20,
      terrain_hazard: 15
    },
    riskRanges: {
      road_density: { low: [0, 3], medium: [3, 7], high: [7, 10] },
      flood_risk_vehicle: { low: [0, 2], medium: [2, 5], high: [5, 10] },
      crime_proxy: { low: [0, 3], medium: [3, 6], high: [6, 10] },
      terrain_hazard: { low: [0, 2], medium: [2, 4], high: [4, 10] }
    }
  }
};

async function performInsuranceRiskAnalysis(request: AnalysisRequest): Promise<SuitabilityResult> {
  const projectId = crypto.randomUUID();
  const config = insuranceConfigurations[request.insuranceType];
  
  // Simulate processing time
  const bufferArea = Math.PI * request.region.bufferRadius * request.region.bufferRadius;
  const processingTime = Math.min(1000 + (bufferArea / 10000), 3000);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Generate mock risk scores based on weights
  const mockBreakdown: Record<string, number> = {};
  request.selectedFactors.forEach(factor => {
    const weight = request.weights[factor] || config.defaultWeights[factor];
    mockBreakdown[factor] = weight;
  });
  
  // Generate top risk sites (lower score = higher risk)
  const numSites = 5;
  const topSites = Array.from({ length: numSites }, (_, i) => {
    // Generate realistic risk scores (inverted - lower score = higher risk)
    const baseScore = 0.95 - (i * 0.08) - (Math.random() * 0.1);
    const riskScore = Math.max(0.4, Math.min(1.0, baseScore));
    
    // Generate random coordinates within buffer
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * request.region.bufferRadius * 0.8;
    const lat = request.region.center[1] + (distance * Math.cos(angle)) / 111000;
    const lon = request.region.center[0] + (distance * Math.sin(angle)) / (111000 * Math.cos(request.region.center[1] * Math.PI / 180));
    
    return {
      id: `site-${i + 1}`,
      score: riskScore,
      coordinates: [lon, lat] as [number, number],
      area: Math.random() * 50 + 10 // 10-60 hectares
    };
  }).sort((a, b) => b.score - a.score); // Sort by risk score (descending)
  
  return {
    projectId,
    suitabilityData: {
      type: 'insurance-risk',
      insuranceType: request.insuranceType,
      timestamp: new Date().toISOString()
    },
    topSites,
    breakdown: mockBreakdown
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: AnalysisRequest = await req.json();
    
    console.log('Insurance risk analysis request:', {
      insuranceType: request.insuranceType,
      region: request.region,
      factors: request.selectedFactors
    });

    // Validate insurance type
    if (!['mortgage', 'home', 'vehicle'].includes(request.insuranceType)) {
      throw new Error('Invalid insurance type');
    }

    // Perform analysis
    const result = await performInsuranceRiskAnalysis(request);
    
    console.log('Insurance risk analysis completed:', {
      projectId: result.projectId,
      numSites: result.topSites.length
    });

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Insurance risk analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Insurance risk analysis failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
