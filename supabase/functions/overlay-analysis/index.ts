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

    console.log(`Overlay analysis request from user: ${user.id}`)

    // Parse request body
    const body = await req.json()
    const { polygon_id_1, polygon_id_2, operation = 'intersection' } = body

    if (!polygon_id_1 || !polygon_id_2) {
      throw new Error('Missing polygon IDs for overlay analysis')
    }

    // Validate operation type
    const validOperations = ['intersection', 'union', 'difference', 'symmetric_difference']
    if (!validOperations.includes(operation)) {
      throw new Error(`Invalid operation. Must be one of: ${validOperations.join(', ')}`)
    }

    // Get the geometries for both polygons
    const { data: polygon1, error: error1 } = await supabase
      .from('geo_features')
      .select('geometry, name')
      .eq('id', polygon_id_1)
      .eq('user_id', user.id)
      .single()

    if (error1 || !polygon1) {
      throw new Error('First polygon not found or access denied')
    }

    const { data: polygon2, error: error2 } = await supabase
      .from('geo_features')
      .select('geometry, name')
      .eq('id', polygon_id_2)
      .eq('user_id', user.id)
      .single()

    if (error2 || !polygon2) {
      throw new Error('Second polygon not found or access denied')
    }

    // Perform overlay analysis using PostGIS functions
    let sqlFunction = ''
    switch (operation) {
      case 'intersection':
        sqlFunction = 'ST_Intersection'
        break
      case 'union':
        sqlFunction = 'ST_Union'
        break
      case 'difference':
        sqlFunction = 'ST_Difference'
        break
      case 'symmetric_difference':
        sqlFunction = 'ST_SymDifference'
        break
    }

    const { data: result, error: overlayError } = await supabase.rpc('perform_overlay_analysis', {
      geom1: polygon1.geometry,
      geom2: polygon2.geometry,
      operation: sqlFunction
    })

    if (overlayError) {
      throw new Error(`Overlay analysis failed: ${overlayError.message}`)
    }

    // Store the result as a new feature
    const resultName = `${operation}_${polygon1.name}_${polygon2.name}`
    const { data: newFeature, error: insertError } = await supabase
      .from('geo_features')
      .insert({
        user_id: user.id,
        name: resultName,
        geometry: result,
        properties: {
          operation,
          source_polygons: [polygon_id_1, polygon_id_2],
          created_by: 'overlay_analysis'
        },
        feature_type: 'polygon'
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to store result: ${insertError.message}`)
    }

    console.log(`Successfully performed ${operation} analysis`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `${operation} analysis completed`,
        data: {
          result_id: newFeature.id,
          result_name: resultName,
          geometry: result
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Overlay analysis error:', error)
    
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