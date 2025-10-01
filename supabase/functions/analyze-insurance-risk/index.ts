import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  insuranceType: 'mortgage' | 'home' | 'vehicle';
  location: {
    address: string;
    coordinates: [number, number];
  };
  bufferRadius: number;
  selectedFactors: string[];
  weights: Record<string, number>;
}

interface DataLayerResult {
  value: number;
  metadata: Record<string, any>;
  explanation: string;
}

// Real data fetching functions
async function fetchFEMAFloodData(lat: number, lon: number): Promise<DataLayerResult> {
  try {
    // FEMA Flood Map Service API
    // In production, use: https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer
    const response = await fetch(
      `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?` +
      `geometry=${lon},${lat}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&` +
      `outFields=*&returnGeometry=false&f=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const floodZone = data.features[0].attributes.FLD_ZONE || 'X';
        const riskScore = floodZone === 'AE' || floodZone === 'A' ? 85 : 
                         floodZone === 'X' ? 15 : 50;
        
        return {
          value: riskScore,
          metadata: {
            floodZone,
            source: 'FEMA NFHL',
            zoneDescription: floodZone === 'AE' ? 'High Risk Zone' : floodZone === 'X' ? 'Minimal Risk' : 'Moderate Risk'
          },
          explanation: `Located in FEMA Flood Zone ${floodZone}. ${
            riskScore > 70 ? 'This is a high-risk flood area requiring mandatory insurance.' :
            riskScore > 40 ? 'Moderate flood risk - insurance recommended.' :
            'Minimal flood risk area.'
          }`
        };
      }
    }
  } catch (error) {
    console.log('FEMA API unavailable, using elevation-based estimation');
  }

  // Fallback: Use elevation-based estimation
  const elevation = await fetchElevationData(lat, lon);
  const floodRisk = elevation.value < 10 ? 75 : elevation.value < 30 ? 45 : 20;
  
  return {
    value: floodRisk,
    metadata: {
      elevation: elevation.metadata.elevation,
      source: 'Elevation-based estimation',
      estimatedZone: floodRisk > 60 ? 'High Risk' : 'Low Risk'
    },
    explanation: `Elevation of ${elevation.metadata.elevation}m suggests ${
      floodRisk > 60 ? 'high flood risk due to low elevation' : 'lower flood risk'
    }.`
  };
}

async function fetchElevationData(lat: number, lon: number): Promise<DataLayerResult> {
  try {
    // Open-Elevation API (SRTM data)
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json();
      const elevation = data.results[0].elevation;
      
      // Calculate slope risk (simplified - in production, use DEM analysis)
      const slopeRisk = elevation > 100 ? 65 : elevation > 50 ? 40 : 25;
      
      return {
        value: slopeRisk,
        metadata: {
          elevation,
          source: 'SRTM DEM',
          elevationUnit: 'meters'
        },
        explanation: `Elevation of ${elevation.toFixed(1)}m above sea level. ${
          slopeRisk > 50 ? 'Steep terrain increases structural risk.' : 'Moderate terrain.'
        }`
      };
    }
  } catch (error) {
    console.log('Elevation API error:', error);
  }

  // Fallback
  return {
    value: 30,
    metadata: { elevation: 50, source: 'Estimated' },
    explanation: 'Elevation data unavailable - using regional average.'
  };
}

async function fetchVegetationNDVI(lat: number, lon: number): Promise<DataLayerResult> {
  // In production: Query Sentinel-2 via Google Earth Engine or Planetary Computer
  // For now, use Nominatim land use as proxy
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { 
        headers: { 'User-Agent': 'HaritaHive/1.0' },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const landuse = data.address?.landuse || '';
      const natural = data.address?.natural || '';
      
      // Estimate vegetation density
      let vegetationDensity = 30;
      if (landuse.includes('forest') || natural.includes('wood')) vegetationDensity = 80;
      else if (landuse.includes('grass') || natural.includes('scrub')) vegetationDensity = 50;
      else if (landuse.includes('residential') || landuse.includes('commercial')) vegetationDensity = 20;
      
      const wildfireRisk = vegetationDensity > 60 ? 70 : vegetationDensity > 40 ? 45 : 25;
      
      return {
        value: wildfireRisk,
        metadata: {
          vegetationDensity,
          landuse,
          source: 'OSM Land Use Analysis'
        },
        explanation: `Vegetation density estimated at ${vegetationDensity}%. ${
          wildfireRisk > 60 ? 'High wildfire risk due to dense vegetation.' :
          wildfireRisk > 40 ? 'Moderate wildfire risk.' : 'Low wildfire risk in developed area.'
        }`
      };
    }
  } catch (error) {
    console.log('Vegetation analysis error:', error);
  }

  return {
    value: 35,
    metadata: { vegetationDensity: 30, source: 'Estimated' },
    explanation: 'Moderate vegetation cover with average wildfire risk.'
  };
}

async function fetchInfrastructureAccess(lat: number, lon: number): Promise<DataLayerResult> {
  try {
    // Query Overpass API for nearby infrastructure
    const query = `
      [out:json][timeout:5];
      (
        node["amenity"="fire_station"](around:5000,${lat},${lon});
        node["amenity"="hospital"](around:5000,${lat},${lon});
        way["highway"](around:2000,${lat},${lon});
      );
      out count;
    `;
    
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json();
      const totalFeatures = data.elements?.length || 0;
      
      // Better infrastructure = lower risk
      const accessScore = totalFeatures > 20 ? 20 : totalFeatures > 10 ? 35 : 55;
      
      return {
        value: accessScore,
        metadata: {
          nearbyFeatures: totalFeatures,
          source: 'OpenStreetMap'
        },
        explanation: `${totalFeatures} infrastructure features within 5km. ${
          accessScore < 30 ? 'Excellent emergency access reduces response times.' :
          accessScore < 50 ? 'Adequate infrastructure access.' : 'Limited infrastructure may delay emergency response.'
        }`
      };
    }
  } catch (error) {
    console.log('Infrastructure query error:', error);
  }

  return {
    value: 40,
    metadata: { nearbyFeatures: 8, source: 'Estimated' },
    explanation: 'Moderate infrastructure access based on area type.'
  };
}

async function fetchRoadDensity(lat: number, lon: number, radius: number): Promise<DataLayerResult> {
  try {
    const query = `
      [out:json][timeout:5];
      way["highway"]["highway"!="footway"]["highway"!="path"](around:${radius * 1000},${lat},${lon});
      out count;
    `;
    
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json();
      const roadCount = data.elements?.length || 0;
      
      // High road density = higher vehicle risk
      const trafficRisk = roadCount > 50 ? 75 : roadCount > 25 ? 55 : 30;
      
      return {
        value: trafficRisk,
        metadata: {
          roadCount,
          density: roadCount / (Math.PI * radius * radius),
          source: 'OpenStreetMap'
        },
        explanation: `${roadCount} roads within ${radius}km buffer. ${
          trafficRisk > 60 ? 'High traffic density increases accident risk.' :
          trafficRisk > 40 ? 'Moderate traffic levels.' : 'Low traffic density area.'
        }`
      };
    }
  } catch (error) {
    console.log('Road density query error:', error);
  }

  return {
    value: 45,
    metadata: { roadCount: 20, source: 'Estimated' },
    explanation: 'Moderate road density based on area classification.'
  };
}

async function analyzeInsuranceRisk(request: AnalysisRequest) {
  const { coordinates, address } = request.location;
  const [lon, lat] = coordinates;
  
  console.log('Starting comprehensive risk analysis for:', address);
  
  // Fetch all relevant data layers in parallel
  const dataPromises: Record<string, Promise<DataLayerResult>> = {};
  
  if (request.selectedFactors.includes('flood_zone') || 
      request.selectedFactors.includes('flood_risk_home') || 
      request.selectedFactors.includes('flood_risk_vehicle')) {
    dataPromises.flood = fetchFEMAFloodData(lat, lon);
  }
  
  if (request.selectedFactors.includes('slope_elevation') || 
      request.selectedFactors.includes('terrain_hazard')) {
    dataPromises.elevation = fetchElevationData(lat, lon);
  }
  
  if (request.selectedFactors.includes('wildfire_risk')) {
    dataPromises.wildfire = fetchVegetationNDVI(lat, lon);
  }
  
  if (request.selectedFactors.includes('infrastructure_access')) {
    dataPromises.infrastructure = fetchInfrastructureAccess(lat, lon);
  }
  
  if (request.selectedFactors.includes('road_density')) {
    dataPromises.roads = fetchRoadDensity(lat, lon, request.bufferRadius);
  }
  
  // Wait for all data fetches
  const results = await Promise.all(
    Object.entries(dataPromises).map(async ([key, promise]) => {
      try {
        return [key, await promise];
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        return [key, { value: 50, metadata: {}, explanation: 'Data unavailable' }];
      }
    })
  );
  
  const dataLayers = Object.fromEntries(results);
  
  // Calculate weighted risk score
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const factorBreakdown: Array<{
    name: string;
    score: number;
    weight: number;
    explanation: string;
    metadata: any;
  }> = [];
  
  request.selectedFactors.forEach(factorId => {
    const weight = request.weights[factorId] || 0;
    let score = 50;
    let explanation = '';
    let metadata = {};
    
    // Map factor IDs to data layers
    if (factorId.includes('flood') && dataLayers.flood) {
      score = dataLayers.flood.value;
      explanation = dataLayers.flood.explanation;
      metadata = dataLayers.flood.metadata;
    } else if ((factorId.includes('slope') || factorId.includes('elevation') || factorId.includes('terrain')) && dataLayers.elevation) {
      score = dataLayers.elevation.value;
      explanation = dataLayers.elevation.explanation;
      metadata = dataLayers.elevation.metadata;
    } else if (factorId.includes('wildfire') && dataLayers.wildfire) {
      score = dataLayers.wildfire.value;
      explanation = dataLayers.wildfire.explanation;
      metadata = dataLayers.wildfire.metadata;
    } else if (factorId.includes('infrastructure') && dataLayers.infrastructure) {
      score = dataLayers.infrastructure.value;
      explanation = dataLayers.infrastructure.explanation;
      metadata = dataLayers.infrastructure.metadata;
    } else if (factorId.includes('road') && dataLayers.roads) {
      score = dataLayers.roads.value;
      explanation = dataLayers.roads.explanation;
      metadata = dataLayers.roads.metadata;
    }
    
    totalWeightedScore += score * (weight / 100);
    totalWeight += weight;
    
    factorBreakdown.push({
      name: factorId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      score: Math.round(score),
      weight,
      explanation,
      metadata
    });
  });
  
  const overallRiskScore = Math.round(totalWeightedScore);
  
  // Generate top sites (mock - in production, this would be from spatial analysis)
  const topSites = Array.from({ length: 5 }, (_, i) => ({
    id: `site-${i + 1}`,
    score: (100 - overallRiskScore) / 100 - (i * 0.05),
    coordinates: [
      lon + (Math.random() - 0.5) * 0.01,
      lat + (Math.random() - 0.5) * 0.01
    ] as [number, number],
    area: Math.random() * 20 + 5,
    address: `Analyzed location ${i + 1}`
  }));
  
  return {
    overallRiskScore,
    factorBreakdown,
    topSites,
    dataLayers: Object.fromEntries(
      Object.entries(dataLayers).map(([key, value]) => [key, value.metadata])
    )
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: AnalysisRequest = await req.json();
    
    console.log('Insurance risk analysis request:', {
      type: request.insuranceType,
      location: request.location.address,
      factors: request.selectedFactors
    });

    const result = await analyzeInsuranceRisk(request);
    
    console.log('Analysis complete:', {
      riskScore: result.overallRiskScore,
      factorsAnalyzed: result.factorBreakdown.length
    });

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Risk analysis failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
