import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { 
      jobType, 
      organizationId, 
      projectId, 
      parameters 
    } = await req.json();

    if (!jobType || !organizationId) {
      throw new Error('Missing required fields: jobType, organizationId');
    }

    // Validate job type
    const validJobTypes = ['ndvi', 'change_detection', 'zonal_stats', 'buffer', 'report_generation'];
    if (!validJobTypes.includes(jobType)) {
      throw new Error(`Invalid job type. Must be one of: ${validJobTypes.join(', ')}`);
    }

    // Check organization membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin', 'member'].includes(membership.role)) {
      throw new Error('User not authorized to create jobs for this organization');
    }

    // Check quota for jobs
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_organization_quota', {
        org_id: organizationId,
        resource_type: 'jobs',
        requested_quantity: 1
      });

    if (quotaError || !quotaCheck) {
      throw new Error('Job quota exceeded for this organization');
    }

    // Validate project if provided
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('id, organization_id')
        .eq('id', projectId)
        .eq('organization_id', organizationId)
        .single();

      if (!project) {
        throw new Error('Project not found or not accessible');
      }
    }

    // Validate parameters based on job type
    let validatedParameters = parameters || {};
    
    switch (jobType) {
      case 'ndvi':
        if (!validatedParameters.dataset_id && !validatedParameters.raster_url) {
          throw new Error('NDVI job requires dataset_id or raster_url parameter');
        }
        break;
      case 'buffer':
        if (!validatedParameters.geometry || !validatedParameters.distance) {
          throw new Error('Buffer job requires geometry and distance parameters');
        }
        break;
      case 'zonal_stats':
        if (!validatedParameters.zones || !validatedParameters.raster_data) {
          throw new Error('Zonal stats job requires zones and raster_data parameters');
        }
        break;
      case 'change_detection':
        if (!validatedParameters.before_image || !validatedParameters.after_image) {
          throw new Error('Change detection job requires before_image and after_image parameters');
        }
        break;
    }

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        organization_id: organizationId,
        project_id: projectId,
        user_id: user.id,
        job_type: jobType,
        parameters: validatedParameters,
        status: 'pending'
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      throw new Error('Failed to create job record');
    }

    // Track usage
    await supabase.rpc('track_usage', {
      org_id: organizationId,
      resource_type: 'jobs',
      quantity: 1,
      resource_id: job.id,
      metadata: {
        job_type: jobType,
        endpoint: 'start-job'
      }
    });

    // For demonstration, we'll simulate job processing for buffer operations
    if (jobType === 'buffer') {
      // Process buffer job immediately for simple geometries
      try {
        const { geometry, distance } = validatedParameters;
        
        // Use PostGIS ST_Buffer function via RPC
        const { data: bufferResult, error: bufferError } = await supabase
          .rpc('st_buffer_geojson', {
            geom: geometry,
            radius: distance
          });

        if (!bufferError && bufferResult) {
          // Update job with results
          await supabase
            .from('jobs')
            .update({
              status: 'completed',
              result_data: {
                buffered_geometry: bufferResult,
                processing_time: Date.now() - new Date(job.created_at).getTime()
              },
              completed_at: new Date().toISOString()
            })
            .eq('id', job.id);
        }
      } catch (bufferError) {
        console.error('Buffer processing error:', bufferError);
        // Job will remain pending and be picked up by worker
      }
    }

    // TODO: For production, send job to Redis/BullMQ queue
    // await addJobToQueue(job.id, jobType, validatedParameters);

    console.log(`Created job ${job.id} of type ${jobType} for organization ${organizationId}`);

    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
        status: 'pending',
        estimated_completion: new Date(Date.now() + (5 * 60 * 1000)).toISOString() // 5 minutes estimate
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error in start-job function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});