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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const jobId = url.searchParams.get('job_id');
    const sessionId = url.searchParams.get('session_id');

    if (!jobId) {
      throw new Error('Missing required parameter: job_id');
    }

    // Get job - optionally filter by session
    let query = supabase
      .from('jobs')
      .select(`
        id,
        session_id,
        project_id,
        job_type,
        status,
        parameters,
        result_data,
        error_message,
        started_at,
        completed_at,
        created_at,
        retry_count,
        max_retries
      `)
      .eq('id', jobId);

    // Apply session filter if provided
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: job, error: jobError } = await query.single();

    if (jobError || !job) {
      throw new Error('Job not found');
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
    if (job.session_id) {
      await supabase.rpc('track_session_usage', {
        session_identifier: job.session_id,
        resource_type: 'api_calls',
        quantity: 0.1, // Fractional cost for status checks
        resource_id: job.id,
        metadata: {
          endpoint: 'job-status',
          job_type: job.job_type
        }
      });
    }

    const response = {
      success: true,
      job: {
        id: job.id,
        session_id: job.session_id,
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