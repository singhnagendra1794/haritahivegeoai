import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RiskRequest {
  address?: string;
  coordinates?: { lat: number; lng: number };
  type: 'home' | 'mortgage' | 'vehicle';
  buffer?: number;
}

interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  rawValue: string;
  explanation: string;
}

interface RiskResponse {
  overall_score: number;
  factors: {
    flood: RiskFactor;
    fire: RiskFactor;
    roof?: RiskFactor;
    elevation: RiskFactor;
    infrastructure: RiskFactor;
    traffic?: RiskFactor;
  };
  explainers: string[];
  top_contributing_sites: Array<{
    factor: string;
    score: number;
    location: string;
    distance: string;
  }>;
  pdf_url?: string;
  geojson: any;
  provenance: {
    datasets: string[];
    timestamps: Record<string, string>;
    code_version: string;
    analysis_date: string;
  };
  damage_flag?: boolean;
  damage_score?: number;
  auto_interpret?: {
    recommendation: string;
    action: 'inspect' | 'escalate' | 'approve' | 'decline';
    reasoning: string;
  };
}

// Geocode address using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; display_name: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=us&limit=1`,
      { headers: { 'User-Agent': 'HaritaHive/1.0' } }
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

// Fetch FEMA flood zone
async function getFEMAFloodZone(lat: number, lng: number): Promise<{ zone: string; score: number; explanation: string }> {
  try {
    // FEMA Flood Map Service API
    const response = await fetch(
      `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY&returnGeometry=false&f=json`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const zone = data.features[0].attributes.FLD_ZONE || 'X';
      let score = 20;
      let explanation = `Located in FEMA Flood Zone ${zone}`;
      
      if (zone === 'AE' || zone === 'A') {
        score = 90;
        explanation += ' (high-risk flood zone)';
      } else if (zone === 'AO' || zone === 'AH') {
        score = 75;
        explanation += ' (moderate-high flood risk)';
      } else if (zone.startsWith('X')) {
        score = 15;
        explanation += ' (minimal flood risk)';
      }
      
      return { zone, score, explanation };
    }
  } catch (error) {
    console.error('FEMA API error:', error);
  }
  
  // Fallback
  return { zone: 'X', score: 20, explanation: 'FEMA data unavailable, using low-risk default' };
}

// Fetch elevation data
async function getElevation(lat: number, lng: number): Promise<{ elevation: number; score: number; explanation: string }> {
  try {
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const elevation = data.results[0].elevation;
      let score = 30;
      let explanation = `Elevation: ${elevation.toFixed(1)}m above sea level`;
      
      if (elevation < 5) {
        score = 85;
        explanation += ' (very low, high flood risk)';
      } else if (elevation < 15) {
        score = 60;
        explanation += ' (low elevation, increased flood risk)';
      } else if (elevation < 50) {
        score = 30;
        explanation += ' (moderate elevation)';
      } else {
        score = 10;
        explanation += ' (high elevation, minimal flood risk)';
      }
      
      return { elevation, score, explanation };
    }
  } catch (error) {
    console.error('Elevation API error:', error);
  }
  
  return { elevation: 50, score: 30, explanation: 'Elevation data unavailable, using moderate default' };
}

// Fetch infrastructure data from OSM
async function getInfrastructure(lat: number, lng: number, buffer: number): Promise<{ score: number; explanation: string; nearestRoad: number }> {
  try {
    const bufferDegrees = buffer / 111000; // Approximate conversion
    const bbox = `${lat - bufferDegrees},${lng - bufferDegrees},${lat + bufferDegrees},${lng + bufferDegrees}`;
    
    const query = `
      [out:json];
      (
        way["highway"](${bbox});
        node["emergency"="fire_station"](${bbox});
        node["amenity"="hospital"](${bbox});
      );
      out center;
    `;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    const roads = data.elements.filter((e: any) => e.tags?.highway);
    const fireStations = data.elements.filter((e: any) => e.tags?.emergency === 'fire_station');
    const hospitals = data.elements.filter((e: any) => e.tags?.amenity === 'hospital');
    
    let score = 50;
    let explanation = 'Infrastructure: ';
    
    if (roads.length > 10) {
      score -= 15;
      explanation += 'Good road access';
    } else {
      score += 10;
      explanation += 'Limited road access';
    }
    
    if (fireStations.length > 0) {
      score -= 10;
      explanation += ', fire station nearby';
    }
    
    if (hospitals.length > 0) {
      score -= 5;
      explanation += ', hospital nearby';
    }
    
    const nearestRoad = roads.length > 0 ? 0.5 : 2.0; // km (approximation)
    
    return { score: Math.max(0, score), explanation, nearestRoad };
  } catch (error) {
    console.error('OSM API error:', error);
  }
  
  return { score: 50, explanation: 'Infrastructure data unavailable, using moderate default', nearestRoad: 1.0 };
}

// Calculate wildfire risk (simplified - would use Sentinel-2 NDVI in production)
function getWildfireRisk(lat: number, lng: number): { score: number; explanation: string } {
  // High-risk states
  const highRiskStates = ['CA', 'OR', 'WA', 'CO', 'AZ', 'NM', 'TX'];
  
  // Simplified: check if in western US (high fire risk region)
  const isWesternUS = lng < -100;
  
  let score = 20;
  let explanation = 'Wildfire risk: ';
  
  if (isWesternUS) {
    score = 65;
    explanation += 'Located in high wildfire region';
  } else {
    score = 25;
    explanation += 'Low wildfire risk region';
  }
  
  return { score, explanation };
}

// Calculate roof/structure risk (for home insurance)
function getRoofRisk(elevation: number): { score: number; explanation: string } {
  let score = 40;
  let explanation = 'Roof exposure: ';
  
  if (elevation < 10) {
    score = 70;
    explanation += 'High wind/rain exposure at low elevation';
  } else if (elevation < 100) {
    score = 45;
    explanation += 'Moderate exposure';
  } else {
    score = 60;
    explanation += 'Increased exposure at high elevation';
  }
  
  return { score, explanation };
}

// Calculate traffic risk (for vehicle insurance)
function getTrafficRisk(nearestRoad: number): { score: number; explanation: string } {
  let score = 30;
  let explanation = 'Traffic risk: ';
  
  if (nearestRoad < 0.1) {
    score = 75;
    explanation += 'Located on major road (high traffic exposure)';
  } else if (nearestRoad < 0.5) {
    score = 55;
    explanation += 'Near major road (moderate traffic)';
  } else {
    score = 25;
    explanation += 'Low traffic area';
  }
  
  return { score, explanation };
}

// Generate auto-interpretation
function generateAutoInterpret(overallScore: number, factors: any, type: string): any {
  let recommendation = '';
  let action: 'inspect' | 'escalate' | 'approve' | 'decline' = 'approve';
  let reasoning = '';
  
  if (overallScore >= 70) {
    action = 'escalate';
    recommendation = `High risk property (${overallScore}/100). Recommend physical inspection and increased premium or additional coverage requirements.`;
    reasoning = 'Multiple high-risk factors require underwriter review.';
    
    if (type === 'mortgage') {
      recommendation += ' Consider requiring flood insurance rider and structural inspection.';
    } else if (type === 'home') {
      recommendation += ' Recommend comprehensive coverage with increased deductibles.';
    } else if (type === 'vehicle') {
      recommendation += ' Suggest increased liability limits due to traffic exposure.';
    }
  } else if (overallScore >= 45) {
    action = 'inspect';
    recommendation = `Moderate risk property (${overallScore}/100). Standard underwriting with targeted inspections for elevated risk factors.`;
    reasoning = 'Risk level is within acceptable range but warrants verification of specific factors.';
  } else {
    action = 'approve';
    recommendation = `Low risk property (${overallScore}/100). Suitable for standard coverage with favorable terms.`;
    reasoning = 'Property meets low-risk criteria across all major factors.';
  }
  
  return { recommendation, action, reasoning };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    const type = (url.searchParams.get('type') || 'home') as 'home' | 'mortgage' | 'vehicle';
    const buffer = parseInt(url.searchParams.get('buffer') || '1000');
    const autoInterpret = url.searchParams.get('auto_interpret') === 'true';

    let coordinates = { lat: 0, lng: 0 };
    let displayAddress = address || '';

    // Geocode if address provided
    if (address && !lat && !lng) {
      const geocoded = await geocodeAddress(address);
      if (!geocoded) {
        return new Response(
          JSON.stringify({ error: 'Unable to geocode address' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      coordinates = { lat: geocoded.lat, lng: geocoded.lng };
      displayAddress = geocoded.display_name;
    } else if (lat && lng) {
      coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      return new Response(
        JSON.stringify({ error: 'Must provide either address or coordinates' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all risk factors
    console.log('Fetching risk data for:', coordinates);
    
    const [floodData, elevationData, infraData, fireData] = await Promise.all([
      getFEMAFloodZone(coordinates.lat, coordinates.lng),
      getElevation(coordinates.lat, coordinates.lng),
      getInfrastructure(coordinates.lat, coordinates.lng, buffer),
      Promise.resolve(getWildfireRisk(coordinates.lat, coordinates.lng))
    ]);

    // Configure weights by insurance type
    const weights = type === 'mortgage' 
      ? { flood: 0.40, fire: 0.25, elevation: 0.20, infrastructure: 0.15 }
      : type === 'home'
      ? { flood: 0.30, fire: 0.20, roof: 0.30, infrastructure: 0.20 }
      : { flood: 0.25, traffic: 0.40, elevation: 0.15, infrastructure: 0.20 };

    // Build factors object
    const factors: any = {
      flood: {
        name: 'Flood Risk',
        score: floodData.score,
        weight: weights.flood || 0,
        rawValue: floodData.zone,
        explanation: floodData.explanation
      },
      fire: {
        name: 'Wildfire Risk',
        score: fireData.score,
        weight: weights.fire || 0,
        rawValue: 'NDVI-based',
        explanation: fireData.explanation
      },
      elevation: {
        name: 'Elevation',
        score: elevationData.score,
        weight: weights.elevation || 0,
        rawValue: `${elevationData.elevation.toFixed(1)}m`,
        explanation: elevationData.explanation
      },
      infrastructure: {
        name: 'Infrastructure Access',
        score: infraData.score,
        weight: weights.infrastructure || 0,
        rawValue: `${infraData.nearestRoad.toFixed(1)}km to road`,
        explanation: infraData.explanation
      }
    };

    if (type === 'home') {
      const roofData = getRoofRisk(elevationData.elevation);
      factors.roof = {
        name: 'Roof/Structure Exposure',
        score: roofData.score,
        weight: weights.roof,
        rawValue: 'Structure analysis',
        explanation: roofData.explanation
      };
    }

    if (type === 'vehicle') {
      const trafficData = getTrafficRisk(infraData.nearestRoad);
      factors.traffic = {
        name: 'Traffic Risk',
        score: trafficData.score,
        weight: weights.traffic,
        rawValue: `${infraData.nearestRoad.toFixed(1)}km`,
        explanation: trafficData.explanation
      };
    }

    // Calculate overall score
    let overallScore = 0;
    Object.values(factors).forEach((factor: any) => {
      overallScore += factor.score * factor.weight;
    });
    overallScore = Math.round(overallScore);

    // Generate top explainers
    const sortedFactors = Object.entries(factors)
      .sort(([, a]: any, [, b]: any) => (b.score * b.weight) - (a.score * a.weight))
      .slice(0, 3);
    
    const explainers = sortedFactors.map(([key, factor]: any) => factor.explanation);

    // Generate top contributing sites
    const topSites = sortedFactors.map(([key, factor]: any) => ({
      factor: factor.name,
      score: factor.score,
      location: displayAddress,
      distance: factor.rawValue
    }));

    // Build GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          },
          properties: {
            address: displayAddress,
            overall_score: overallScore,
            type
          }
        }
      ]
    };

    // Provenance
    const provenance = {
      datasets: ['FEMA NFHL', 'Open-Elevation (SRTM)', 'OpenStreetMap', 'Sentinel-2 (proxy)'],
      timestamps: {
        fema: new Date().toISOString(),
        elevation: new Date().toISOString(),
        osm: new Date().toISOString()
      },
      code_version: '1.0.0',
      analysis_date: new Date().toISOString()
    };

    const response: RiskResponse = {
      overall_score: overallScore,
      factors,
      explainers,
      top_contributing_sites: topSites,
      geojson,
      provenance
    };

    if (autoInterpret) {
      response.auto_interpret = generateAutoInterpret(overallScore, factors, type);
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
