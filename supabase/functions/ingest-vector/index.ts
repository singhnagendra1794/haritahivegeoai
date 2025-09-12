import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: string
    coordinates: any
  }
  properties: Record<string, any>
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const body = await req.json()
    const { geojson, sessionId, projectId } = body

    if (!geojson) {
      throw new Error('Missing geojson data')
    }

    // Generate session ID if not provided
    const session_id = sessionId || crypto.randomUUID()
    console.log(`Vector ingestion request for session: ${session_id}`)

    // Check session quota for API calls
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_session_quota', {
        session_identifier: session_id,
        resource_type: 'api_calls',
        requested_quantity: 1
      });

    if (quotaError || !quotaCheck) {
      throw new Error('Daily API call limit exceeded for this session');
    }

    // Validate GeoJSON structure
    if (!isValidGeoJSON(geojson)) {
      throw new Error('Invalid GeoJSON format')
    }

    // Store in PostGIS
    const results = []
    
    if (geojson.type === 'FeatureCollection') {
      for (const feature of geojson.features) {
        const result = await storeFeature(supabase, feature, session_id, projectId)
        results.push(result)
      }
    } else if (geojson.type === 'Feature') {
      const result = await storeFeature(supabase, geojson, session_id, projectId)
      results.push(result)
    }

    // Track usage
    await supabase.rpc('track_session_usage', {
      session_identifier: session_id,
      resource_type: 'api_calls',
      quantity: 1,
      metadata: {
        endpoint: 'ingest-vector',
        feature_count: results.length
      }
    });

    console.log(`Successfully ingested ${results.length} features`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Ingested ${results.length} features`,
        session_id: session_id,
        data: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Ingestion error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function isValidGeoJSON(geojson: any): boolean {
  if (!geojson || typeof geojson !== 'object') {
    return false
  }

  if (geojson.type === 'FeatureCollection') {
    return Array.isArray(geojson.features) && 
           geojson.features.every((f: any) => isValidFeature(f))
  }
  
  if (geojson.type === 'Feature') {
    return isValidFeature(geojson)
  }

  return false
}

function isValidFeature(feature: any): boolean {
  return feature &&
         feature.type === 'Feature' &&
         feature.geometry &&
         typeof feature.geometry.type === 'string' &&
         Array.isArray(feature.geometry.coordinates)
}

async function storeFeature(supabase: any, feature: GeoJSONFeature, sessionId: string, projectId?: string) {
  const { data, error } = await supabase
    .from('geo_features')
    .insert({
      session_id: sessionId,
      name: feature.properties?.name || 'Unnamed Feature',
      geometry: `SRID=4326;${geometryToWKT(feature.geometry)}`,
      properties: feature.properties || {},
      feature_type: feature.geometry.type.toLowerCase()
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  // Create dataset record if projectId provided
  if (projectId) {
    await supabase
      .from('project_datasets')
      .insert({
        project_id: projectId,
        name: `Vector Data - ${feature.properties?.name || 'Feature'}`,
        file_type: 'geojson',
        metadata: {
          feature_id: data.id,
          geometry_type: feature.geometry.type,
          ingested_at: new Date().toISOString()
        }
      })
  }

  return data
}

function geometryToWKT(geometry: any): string {
  // Simple WKT conversion for common geometry types
  switch (geometry.type) {
    case 'Point':
      return `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`
    case 'Polygon':
      const rings = geometry.coordinates.map((ring: number[][]) => 
        `(${ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ')})`
      ).join(', ')
      return `POLYGON(${rings})`
    case 'LineString':
      const coords = geometry.coordinates.map((coord: number[]) => 
        `${coord[0]} ${coord[1]}`
      ).join(', ')
      return `LINESTRING(${coords})`
    default:
      throw new Error(`Unsupported geometry type: ${geometry.type}`)
  }
}