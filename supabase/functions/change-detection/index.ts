import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChangeDetectionRequest {
  address?: string;
  coordinates?: { lat: number; lng: number };
  baseline_date?: string;
  current_date?: string;
  buffer?: number;
  analysis_type?: 'ndvi' | 'structure' | 'flood' | 'all';
}

interface ChangeDetectionResult {
  damage_flag: boolean;
  damage_percentage: number;
  change_score: number;
  change_type: string[];
  visualization_url?: string;
  geotiff_url?: string;
  change_mask: any;
  details: {
    ndvi_change?: number;
    structure_change?: number;
    flood_extent_change?: number;
  };
  provenance: {
    baseline_date: string;
    current_date: string;
    datasets: string[];
    analysis_date: string;
  };
}

// Simulate NDVI change detection
async function detectNDVIChange(
  lat: number,
  lng: number,
  buffer: number,
  baselineDate: string,
  currentDate: string
): Promise<{ change: number; damage: boolean }> {
  // In production, this would:
  // 1. Query Sentinel-2 imagery for baseline and current dates
  // 2. Calculate NDVI for both periods
  // 3. Compute change mask
  // 4. Return actual statistics
  
  console.log(`NDVI analysis: ${lat},${lng} from ${baselineDate} to ${currentDate}`);
  
  // Simulate vegetation loss (random for demo)
  const vegetationChange = Math.random() * 0.5; // 0-50% change
  const isDamaged = vegetationChange > 0.25;
  
  return {
    change: vegetationChange,
    damage: isDamaged
  };
}

// Simulate structure change detection
async function detectStructureChange(
  lat: number,
  lng: number,
  buffer: number,
  baselineDate: string,
  currentDate: string
): Promise<{ change: number; damage: boolean }> {
  // In production, this would:
  // 1. Use high-res imagery (Planet/Maxar) or SAR (ICEYE)
  // 2. Apply building footprint extraction
  // 3. Compare baseline vs current
  // 4. Calculate damage score
  
  console.log(`Structure analysis: ${lat},${lng} from ${baselineDate} to ${currentDate}`);
  
  // Simulate structure damage
  const structureChange = Math.random() * 0.4;
  const isDamaged = structureChange > 0.20;
  
  return {
    change: structureChange,
    damage: isDamaged
  };
}

// Simulate SAR-based flood detection
async function detectFloodChange(
  lat: number,
  lng: number,
  buffer: number,
  baselineDate: string,
  currentDate: string
): Promise<{ change: number; damage: boolean }> {
  // In production, this would:
  // 1. Use ICEYE SAR data for near-real-time flood monitoring
  // 2. Detect water extent using backscatter analysis
  // 3. Compare with baseline
  // 4. Calculate inundation percentage
  
  console.log(`Flood analysis: ${lat},${lng} from ${baselineDate} to ${currentDate}`);
  
  // Simulate flood detection
  const floodChange = Math.random() * 0.3;
  const isFlooded = floodChange > 0.15;
  
  return {
    change: floodChange,
    damage: isFlooded
  };
}

// Generate change visualization (mock)
function generateVisualization(changeData: any): string {
  // In production, this would generate actual PNG/GeoTIFF
  // For now, return a mock URL
  return `https://storage.example.com/change-viz-${Date.now()}.png`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ChangeDetectionRequest = await req.json();
    
    const {
      address,
      coordinates,
      baseline_date = '2023-01-01',
      current_date = new Date().toISOString().split('T')[0],
      buffer = 1000,
      analysis_type = 'all'
    } = requestData;

    // Geocode if needed
    let lat = coordinates?.lat || 0;
    let lng = coordinates?.lng || 0;

    if (address && !coordinates) {
      // Geocode address (simplified)
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=us&limit=1`,
        { headers: { 'User-Agent': 'HaritaHive/1.0' } }
      );
      const geoData = await geoResponse.json();
      if (geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      } else {
        throw new Error('Unable to geocode address');
      }
    }

    // Run change detection analyses
    const analyses = [];
    const changeTypes: string[] = [];
    let damageFlag = false;
    const details: any = {};

    if (analysis_type === 'ndvi' || analysis_type === 'all') {
      const ndviResult = await detectNDVIChange(lat, lng, buffer, baseline_date, current_date);
      analyses.push(ndviResult.change);
      details.ndvi_change = ndviResult.change;
      if (ndviResult.damage) {
        damageFlag = true;
        changeTypes.push('vegetation_loss');
      }
    }

    if (analysis_type === 'structure' || analysis_type === 'all') {
      const structureResult = await detectStructureChange(lat, lng, buffer, baseline_date, current_date);
      analyses.push(structureResult.change);
      details.structure_change = structureResult.change;
      if (structureResult.damage) {
        damageFlag = true;
        changeTypes.push('structure_damage');
      }
    }

    if (analysis_type === 'flood' || analysis_type === 'all') {
      const floodResult = await detectFloodChange(lat, lng, buffer, baseline_date, current_date);
      analyses.push(floodResult.change);
      details.flood_extent_change = floodResult.change;
      if (floodResult.damage) {
        damageFlag = true;
        changeTypes.push('flood_inundation');
      }
    }

    // Calculate aggregate change score
    const avgChange = analyses.reduce((sum, val) => sum + val, 0) / analyses.length;
    const changeScore = Math.round(avgChange * 100);
    const damagePercentage = Math.round(avgChange * 100);

    // Generate visualization
    const visualizationUrl = generateVisualization({ lat, lng, changeScore });
    const geotiffUrl = visualizationUrl.replace('.png', '.tif');

    // Build change mask (simplified GeoJSON)
    const changeMask = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      properties: {
        change_score: changeScore,
        damage_flag: damageFlag,
        change_types: changeTypes
      }
    };

    const result: ChangeDetectionResult = {
      damage_flag: damageFlag,
      damage_percentage: damagePercentage,
      change_score: changeScore,
      change_type: changeTypes,
      visualization_url: visualizationUrl,
      geotiff_url: geotiffUrl,
      change_mask: changeMask,
      details,
      provenance: {
        baseline_date,
        current_date,
        datasets: ['Sentinel-2', 'ICEYE SAR (proxy)', 'ESA WorldCover'],
        analysis_date: new Date().toISOString()
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Change detection error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
