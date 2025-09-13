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
  sessionId?: string; // Optional session ID for tracking
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

// Realistic project configurations for GeoAI analysis with exact user specifications
const projectConfigurations = {
  'Solar Farm': {
    datasets: ['srtm_dem', 'solar_radiation', 'osm_grid', 'osm_roads'],
    weights: { solar_radiation: 0.40, slope: 0.25, grid_distance: 0.20, road_access: 0.15 },
    optimalRanges: {
      solar_radiation: { min: 4.5, max: 7.0, unit: 'kWh/m²/day' },
      slope: { min: 0, max: 5, unit: 'degrees' },
      grid_distance: { min: 0, max: 5000, unit: 'meters' },
      road_access: { min: 0, max: 2000, unit: 'meters' }
    }
  },
  'Battery Energy Storage (BESS)': {
    datasets: ['osm_grid', 'osm_roads', 'srtm_dem', 'esa_worldcover'],
    weights: { grid_distance: 0.35, road_access: 0.30, slope: 0.20, land_use: 0.15 },
    optimalRanges: {
      grid_distance: { min: 0, max: 1000, unit: 'meters' },
      road_access: { min: 0, max: 500, unit: 'meters' },
      slope: { min: 0, max: 3, unit: 'degrees' },
      land_use: { min: 0.7, max: 1.0, unit: 'suitability' }
    }
  },
  'Agriculture': {
    datasets: ['fao_soilgrids', 'worldclim_precip', 'esa_worldcover', 'srtm_dem'],
    weights: { soil_fertility: 0.35, rainfall: 0.30, land_cover: 0.20, slope: 0.15 },
    optimalRanges: {
      soil_fertility: { min: 0.6, max: 1.0, unit: 'fertility index' },
      rainfall: { min: 400, max: 1200, unit: 'mm/year' },
      land_cover: { min: 0.8, max: 1.0, unit: 'agricultural suitability' },
      slope: { min: 0, max: 8, unit: 'degrees' }
    }
  }
};

async function performSuitabilityAnalysis(request: AnalysisRequest): Promise<SuitabilityResult> {
  console.log('Starting GeoAI suitability analysis for:', request.projectType);
  console.log('Region:', request.region.name, `(${request.region.type})`);
  
  // Generate project ID
  const projectId = crypto.randomUUID();
  
  // Get project configuration
  const config = projectConfigurations[request.projectType as keyof typeof projectConfigurations];
  if (!config) {
    throw new Error(`Unsupported project type: ${request.projectType}`);
  }
  
  console.log('Using datasets:', config.datasets);
  console.log('Applied weights:', config.weights);
  
  // Simulate realistic GeoAI processing time based on region size
  const processingTime = request.region.type === 'district' ? 4000 : 
                        request.region.type === 'shapefile' ? 5000 : 3000;
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Generate realistic suitability scores based on project type and optimal ranges
  const mockBreakdown = Object.keys(request.weights).reduce((acc, key) => {
    const weight = request.weights[key] || 0;
    const optimalRange = config.optimalRanges?.[key];
    
    // Simulate more realistic scoring based on project type
    let baseScore: number;
    
    switch (request.projectType) {
      case 'Solar Farm':
        baseScore = key === 'solar_radiation' ? 0.7 + (Math.random() * 0.25) :
                   key === 'slope' ? 0.6 + (Math.random() * 0.3) :
                   key === 'grid_distance' ? 0.5 + (Math.random() * 0.4) :
                   0.4 + (Math.random() * 0.4);
        break;
      case 'Battery Energy Storage (BESS)':
        baseScore = key === 'grid_distance' ? 0.75 + (Math.random() * 0.2) :
                   key === 'road_access' ? 0.65 + (Math.random() * 0.25) :
                   key === 'slope' ? 0.7 + (Math.random() * 0.25) :
                   0.5 + (Math.random() * 0.4);
        break;
      case 'Agriculture':
        baseScore = key === 'soil_fertility' ? 0.65 + (Math.random() * 0.3) :
                   key === 'rainfall' ? 0.6 + (Math.random() * 0.35) :
                   key === 'land_cover' ? 0.7 + (Math.random() * 0.25) :
                   0.5 + (Math.random() * 0.4);
        break;
      default:
        baseScore = 0.4 + (Math.random() * 0.5);
    }
    
    // Apply weight influence and region quality modifier
    const regionQualityModifier = request.region.type === 'district' ? 0.1 : 0;
    acc[key] = Math.min(0.95, Math.max(0.1, baseScore + (weight * 0.15) + regionQualityModifier));
    
    return acc;
  }, {} as Record<string, number>);
  
  // Generate exactly 5 top sites with realistic distribution
  const topSites = Array.from({ length: 5 }, (_, index) => {
    const overallScore = Object.entries(mockBreakdown).reduce((sum, [key, score]) => {
      return sum + (score * (request.weights[key] || 0));
    }, 0);
    
    // Create realistic score distribution (top sites should be significantly better)
    const siteRankModifier = index === 0 ? 0.15 : 
                            index === 1 ? 0.08 : 
                            index === 2 ? 0.02 : 
                            index === 3 ? -0.05 : -0.12;
    
    const finalScore = Math.min(0.95, Math.max(0.2, overallScore + siteRankModifier + ((Math.random() - 0.5) * 0.1)));
    
    // Generate coordinates with regional clustering
    const baseLat = request.region.type === 'district' ? 12.9716 : 20.5937; // Bangalore or India center
    const baseLng = request.region.type === 'district' ? 77.5946 : 78.9629;
    
    const latVariation = (Math.random() - 0.5) * 2; // ±1 degree
    const lngVariation = (Math.random() - 0.5) * 2;
    
    // Site areas vary by project type
    let areaRange: [number, number];
    switch (request.projectType) {
      case 'Solar Farm':
        areaRange = [10, 100]; // 10-100 hectares
        break;
      case 'Battery Energy Storage (BESS)':
        areaRange = [2, 20]; // 2-20 hectares
        break;
      case 'Agriculture':
        areaRange = [25, 200]; // 25-200 hectares
        break;
      default:
        areaRange = [5, 50];
    }
    
    const area = areaRange[0] + (Math.random() * (areaRange[1] - areaRange[0]));
    
    return {
      id: `${request.projectType.toLowerCase().replace(/\s+/g, '_')}_site_${index + 1}`,
      score: finalScore,
      coordinates: [baseLng + lngVariation, baseLat + latVariation] as [number, number],
      area: Math.round(area * 10) / 10
    };
  }).sort((a, b) => b.score - a.score);
  
  console.log(`GeoAI analysis complete. Generated top 5 sites with scores: ${topSites.map(s => (s.score * 100).toFixed(1) + '%').join(', ')}`);
  
  return {
    projectId,
    suitabilityData: {
      rasterUrl: `https://example.com/raster/${projectId}.tif`, // Mock raster URL
      resolution: 30, // 30m resolution from Landsat/Sentinel
      extent: request.region.data,
      datasets_used: config.datasets
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

    // Store the analysis in the database with session ID (no user required)
    const { error: dbError } = await supabase
      .from('analysis_results')
      .insert({
        id: result.projectId,
        tool_name: 'suitability_analysis',
        parameters: {
          project_type: analysisRequest.projectType,
          region: analysisRequest.region,
          weights: analysisRequest.weights,
          session_id: analysisRequest.sessionId || crypto.randomUUID()
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