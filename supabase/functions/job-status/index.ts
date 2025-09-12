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

    const url = new URL(req.url);
    const jobId = url.searchParams.get('job_id');
    const organizationId = url.searchParams.get('organization_id');

    if (!jobId) {
      throw new Error('Missing required parameter: job_id');
    }

    // Get job with organization check
    let query = supabase
      .from('jobs')
      .select(`
        id,
        organization_id,
        project_id,
        user_id,
        job_type,
        status,
        parameters,
        result_data,
        error_message,
        started_at,
        completed_at,
        created_at,
        retry_count,
        max_retries,
        organizations!inner(name, subscription_tier)
      `)
      .eq('id', jobId);

    // Apply organization filter if provided
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data: job, error: jobError } = await query.single();

    if (jobError || !job) {
      throw new Error('Job not found or access denied');
    }

    // Check if user has access to this job
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', job.organization_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      throw new Error('User not authorized to view this job');
    }

    // Calculate progress and estimated completion
    let progress = 0;
    let estimatedCompletion: string | null = null;

    switch (job.status) {
      case 'pending':
        progress = 0;
        estimatedCompletion = new Date(Date.now() + (5 * 60 * 1000)).toISOString();
        break;
      case 'running':
        progress = 50;
        estimatedCompletion = new Date(Date.now() + (2 * 60 * 1000)).toISOString();
        break;
      case 'completed':
        progress = 100;
        break;
      case 'failed':
        progress = 0;
        break;
      case 'cancelled':
        progress = 0;
        break;
    }

    // Get related results if available
    let relatedResults = null;
    if (job.job_type === 'ndvi' && job.status === 'completed') {
      const { data: ndviResults } = await supabase
        .from('ndvi_results')
        .select('*')
        .eq('job_id', job.id)
        .single();
      
      relatedResults = ndviResults;
    }

    // Track API call usage (lightweight operation)
    await supabase.rpc('track_usage', {
      org_id: job.organization_id,
      resource_type: 'api_calls',
      quantity: 0.1, // Fractional cost for status checks
      resource_id: job.id,
      metadata: {
        endpoint: 'job-status',
        job_type: job.job_type
      }
    });

    const response = {
      success: true,
      job: {
        id: job.id,
        organization_id: job.organization_id,
        project_id: job.project_id,
        job_type: job.job_type,
        status: job.status,
        progress,
        error_message: job.error_message,
        created_at: job.created_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
        estimated_completion: estimatedCompletion,
        retry_count: job.retry_count,
        max_retries: job.max_retries,
        parameters: job.parameters,
        result_data: job.result_data,
        related_results: relatedResults
      },
      organization: {
        name: job.organizations.name,
        subscription_tier: job.organizations.subscription_tier
      }
    };

    console.log(`Retrieved status for job ${jobId}: ${job.status}`);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error in job-status function:', error);
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