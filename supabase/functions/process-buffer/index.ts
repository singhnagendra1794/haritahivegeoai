import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid or expired token')
    }

    console.log(`Buffer processing request from user: ${user.id}`)

    // Parse request body
    const body = await req.json()
    const { polygon_id, distance } = body

    if (!polygon_id || distance === undefined) {
      throw new Error('Missing polygon_id or distance parameter')
    }

    if (typeof distance !== 'number' || distance <= 0) {
      throw new Error('Distance must be a positive number')
    }

    console.log(`Processing buffer for polygon ${polygon_id} with distance ${distance}`)

    // Get the original polygon and create buffer using PostGIS
    const { data, error } = await supabase.rpc('create_buffer_geojson', {
      feature_id: polygon_id,
      buffer_distance: distance,
      requesting_user_id: user.id
    })

    if (error) {
      throw new Error(`Buffer processing failed: ${error.message}`)
    }

    if (!data) {
      throw new Error('Polygon not found or access denied')
    }

    console.log(`Successfully created buffer for polygon ${polygon_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Buffer created with distance ${distance}`,
        data: {
          original_id: polygon_id,
          buffer_distance: distance,
          buffered_geometry: data
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Buffer processing error:', error)
    
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