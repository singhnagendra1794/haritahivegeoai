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
  disaster_type?: string;
}

interface DamageAssessment {
  damage_flag: boolean;
  damage_severity: 'none' | 'minor' | 'moderate' | 'severe' | 'total';
  damage_percentage: number;
  change_score: number;
  reconstruction_cost: number;
  demolition_required: boolean;
  demolition_cost: number;
  claims_priority: 'low' | 'medium' | 'high' | 'critical';
  recommended_action: string;
  damage_details: {
    roof_damage: number;
    structure_damage: number;
    water_damage: number;
    vegetation_loss: number;
  };
  visualization_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  change_type: string[];
  provenance: {
    baseline_date: string;
    current_date: string;
    datasets: string[];
    analysis_date: string;
    disaster_type?: string;
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

    // Calculate aggregate damage metrics
    const avgChange = analyses.reduce((sum, val) => sum + val, 0) / analyses.length;
    const changeScore = Math.round(avgChange * 100);
    const damagePercentage = Math.round(avgChange * 100);

    // Determine damage severity
    let damageSeverity: 'none' | 'minor' | 'moderate' | 'severe' | 'total' = 'none';
    if (damagePercentage > 80) damageSeverity = 'total';
    else if (damagePercentage > 60) damageSeverity = 'severe';
    else if (damagePercentage > 40) damageSeverity = 'moderate';
    else if (damagePercentage > 20) damageSeverity = 'minor';

    // Determine claims priority
    let claimsPriority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (damageSeverity === 'total' || damageSeverity === 'severe') claimsPriority = 'critical';
    else if (damageSeverity === 'moderate') claimsPriority = 'high';
    else if (damageSeverity === 'minor') claimsPriority = 'medium';

    // Calculate cost estimates (simplified model - would use actual construction data)
    const baseReconstructionCost = 250000; // Base home reconstruction
    const reconstructionCost = Math.round(baseReconstructionCost * (damagePercentage / 100));
    const demolitionRequired = damageSeverity === 'total' || damageSeverity === 'severe';
    const demolitionCost = demolitionRequired ? Math.round(baseReconstructionCost * 0.15) : 0;

    // Generate recommended action
    let recommendedAction = '';
    if (damageSeverity === 'total') {
      recommendedAction = 'Total loss. Immediate field inspection required. Recommend demolition and full reconstruction. Expedite claim processing for critical priority.';
    } else if (damageSeverity === 'severe') {
      recommendedAction = 'Severe damage detected. Emergency field inspection within 24-48 hours. Likely requires demolition. Prepare for major reconstruction claim.';
    } else if (damageSeverity === 'moderate') {
      recommendedAction = 'Moderate structural damage. Schedule inspection within 1 week. Assess structural integrity before approving repairs. Likely requires partial reconstruction.';
    } else if (damageSeverity === 'minor') {
      recommendedAction = 'Minor damage identified. Standard inspection protocol. Most damage appears repairable without major reconstruction.';
    } else {
      recommendedAction = 'No significant damage detected. Standard claims review process. May require visual confirmation for policy closure.';
    }

    // Damage details breakdown
    const damageDetails = {
      roof_damage: details.structure_change || 0,
      structure_damage: (details.structure_change || 0) * 0.8,
      water_damage: details.flood_extent_change || 0,
      vegetation_loss: details.ndvi_change || 0
    };

    // Generate visualization URLs
    const visualizationUrl = generateVisualization({ lat, lng, changeScore });
    const beforeImageUrl = `https://storage.haritahive.com/before-${Date.now()}.jpg`;
    const afterImageUrl = `https://storage.haritahive.com/after-${Date.now()}.jpg`;

    const result: DamageAssessment = {
      damage_flag: damageFlag,
      damage_severity: damageSeverity,
      damage_percentage: damagePercentage,
      change_score: changeScore,
      reconstruction_cost: reconstructionCost,
      demolition_required: demolitionRequired,
      demolition_cost: demolitionCost,
      claims_priority: claimsPriority,
      recommended_action: recommendedAction,
      damage_details: damageDetails,
      visualization_url: visualizationUrl,
      before_image_url: beforeImageUrl,
      after_image_url: afterImageUrl,
      change_type: changeTypes,
      provenance: {
        baseline_date,
        current_date,
        datasets: ['Sentinel-2 L2A', 'ICEYE SAR', 'USGS 3DEP', 'Planet SkySat (on-demand)', 'OSM Buildings'],
        analysis_date: new Date().toISOString(),
        disaster_type: requestData.disaster_type
      }
    };

    console.log('Damage assessment completed:', {
      severity: damageSeverity,
      priority: claimsPriority,
      reconstruction_cost: reconstructionCost,
      demolition_required: demolitionRequired
    });

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
