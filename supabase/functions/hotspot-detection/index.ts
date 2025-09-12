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

    console.log(`Hotspot detection request from user: ${user.id}`)

    // Parse request body
    const body = await req.json()
    const { num_clusters = 3, feature_ids = [] } = body

    if (feature_ids.length === 0) {
      throw new Error('No features provided for hotspot analysis')
    }

    if (num_clusters < 2 || num_clusters > 10) {
      throw new Error('Number of clusters must be between 2 and 10')
    }

    // Get all user features if none specified, otherwise use provided IDs
    let query = supabase
      .from('geo_features')
      .select('id, name, geometry, properties')
      .eq('user_id', user.id)

    if (feature_ids.length > 0) {
      query = query.in('id', feature_ids)
    }

    const { data: features, error: fetchError } = await query

    if (fetchError) {
      throw new Error(`Failed to fetch features: ${fetchError.message}`)
    }

    if (!features || features.length < num_clusters) {
      throw new Error(`Insufficient features for clustering. Need at least ${num_clusters} features.`)
    }

    // Perform K-means clustering using PostGIS
    const { data: clusters, error: clusterError } = await supabase.rpc('perform_kmeans_clustering', {
      feature_ids: features.map(f => f.id),
      k_clusters: num_clusters,
      user_id: user.id
    })

    if (clusterError) {
      throw new Error(`Clustering failed: ${clusterError.message}`)
    }

    // Calculate cluster statistics
    const clusterStats = await Promise.all(
      Array.from({ length: num_clusters }, async (_, i) => {
        const clusterFeatures = clusters.filter((c: any) => c.cluster_id === i)
        
        if (clusterFeatures.length === 0) return null

        // Calculate centroid and statistics for this cluster
        const { data: stats, error: statsError } = await supabase.rpc('calculate_cluster_stats', {
          feature_ids: clusterFeatures.map((f: any) => f.feature_id),
          user_id: user.id
        })

        if (statsError) {
          console.error(`Error calculating stats for cluster ${i}:`, statsError)
          return null
        }

        return {
          cluster_id: i,
          feature_count: clusterFeatures.length,
          centroid: stats.centroid,
          total_area: stats.total_area,
          avg_area: stats.avg_area,
          features: clusterFeatures
        }
      })
    )

    const validClusters = clusterStats.filter(c => c !== null)

    // Store cluster results
    const clusterResults = await Promise.all(
      validClusters.map(async (cluster) => {
        const { data: newFeature, error: insertError } = await supabase
          .from('geo_features')
          .insert({
            user_id: user.id,
            name: `Hotspot_Cluster_${cluster.cluster_id + 1}`,
            geometry: cluster.centroid,
            properties: {
              cluster_id: cluster.cluster_id,
              feature_count: cluster.feature_count,
              total_area: cluster.total_area,
              avg_area: cluster.avg_area,
              analysis_type: 'hotspot_detection',
              k_clusters: num_clusters
            },
            feature_type: 'point'
          })
          .select()
          .single()

        if (insertError) {
          console.error(`Failed to store cluster ${cluster.cluster_id}:`, insertError)
          return null
        }

        return {
          ...newFeature,
          cluster_info: cluster
        }
      })
    )

    console.log(`Successfully performed hotspot detection with ${num_clusters} clusters`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Hotspot detection completed with ${num_clusters} clusters`,
        data: {
          clusters: clusterResults.filter(c => c !== null),
          analysis_summary: {
            total_features: features.length,
            num_clusters: validClusters.length,
            avg_features_per_cluster: Math.round(features.length / validClusters.length)
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Hotspot detection error:', error)
    
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