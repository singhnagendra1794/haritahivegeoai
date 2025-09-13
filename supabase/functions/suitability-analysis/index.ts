import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  projectType: string;
  weights: Record<string, number>;
  region: {
    type: 'polygon' | 'district' | 'shapefile';
    data: any;
    name: string;
  };
}

interface SuitabilityResult {
  projectId: string;
  suitabilityData: any;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
  }>;
  breakdown: Record<string, number>;
}

// Sample project configurations
const projectConfigurations = {
  'Solar Farm': {
    datasets: ['dem', 'solar_radiation', 'landcover', 'infrastructure'],
    weights: { solar_radiation: 0.35, slope: 0.25, grid_distance: 0.20, land_use: 0.20 }
  },
  'Agriculture Crop': {
    datasets: ['soil', 'climate', 'dem', 'water'],
    weights: { soil_quality: 0.30, rainfall: 0.25, temperature: 0.25, slope: 0.20 }
  },
  'Retail Store': {
    datasets: ['population', 'roads', 'poi', 'demographics'],
    weights: { population_density: 0.30, road_access: 0.25, competition: 0.25, income_level: 0.20 }
  },
  'Housing Development': {
    datasets: ['dem', 'flood', 'infrastructure', 'zoning'],
    weights: { slope: 0.30, flood_risk: 0.25, infrastructure: 0.25, zoning: 0.20 }
  },
  'School/Hospital': {
    datasets: ['population', 'roads', 'safety', 'land'],
    weights: { population_access: 0.35, road_network: 0.25, land_availability: 0.20, safety: 0.20 }
  }
};

async function performSuitabilityAnalysis(request: AnalysisRequest): Promise<SuitabilityResult> {
  console.log('Starting suitability analysis for:', request.projectType);
  
  // Generate project ID
  const projectId = crypto.randomUUID();
  
  // Simulate GeoAI processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock analysis results based on project type and region
  const mockBreakdown = Object.keys(request.weights).reduce((acc, key) => {
    // Generate realistic scores based on weights
    const baseScore = 0.3 + (Math.random() * 0.6); // 0.3 to 0.9
    const weightInfluence = request.weights[key] || 0;
    acc[key] = Math.min(0.95, baseScore + (weightInfluence * 0.2));
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate overall scores and generate top sites
  const numSites = Math.floor(Math.random() * 8) + 3; // 3-10 sites
  const topSites = Array.from({ length: numSites }, (_, index) => {
    const overallScore = Object.values(mockBreakdown).reduce((sum, score) => sum + score, 0) / Object.values(mockBreakdown).length;
    const siteVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
    const finalScore = Math.max(0.1, Math.min(0.98, overallScore + siteVariation));
    
    // Generate coordinates within India (rough bounds)
    const lat = 8.0 + (Math.random() * 29.0); // 8°N to 37°N
    const lng = 68.0 + (Math.random() * 29.0); // 68°E to 97°E
    
    return {
      id: `site_${index + 1}`,
      score: finalScore,
      coordinates: [lng, lat] as [number, number],
      area: 5 + (Math.random() * 45) // 5-50 hectares
    };
  }).sort((a, b) => b.score - a.score);
  
  console.log(`Analysis complete. Found ${topSites.length} suitable sites.`);
  
  return {
    projectId,
    suitabilityData: {
      rasterUrl: null, // Would contain actual raster data URL
      resolution: 30, // 30m resolution
      extent: request.region.data
    },
    topSites,
    breakdown: mockBreakdown
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const analysisRequest: AnalysisRequest = await req.json();
    
    // Validate request
    if (!analysisRequest.projectType || !analysisRequest.region) {
      throw new Error('Invalid request: missing projectType or region');
    }

    console.log('Received analysis request:', {
      projectType: analysisRequest.projectType,
      regionType: analysisRequest.region.type,
      regionName: analysisRequest.region.name
    });

    // Perform the suitability analysis
    const result = await performSuitabilityAnalysis(analysisRequest);

    // Store the analysis in the database (optional - for tracking/caching)
    const { error: dbError } = await supabase
      .from('analysis_results')
      .insert({
        id: result.projectId,
        tool_name: 'suitability_analysis',
        parameters: {
          project_type: analysisRequest.projectType,
          region: analysisRequest.region,
          weights: analysisRequest.weights
        },
        result_data: result,
        status: 'completed'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - analysis was successful
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Suitability analysis error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Suitability analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});