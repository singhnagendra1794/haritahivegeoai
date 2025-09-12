import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModelInferenceRequest {
  model_name: 'ndvi_model' | 'buffer_model' | 'change_detection_model';
  model_version?: string;
  input_data: any;
  organization_id: string;
  project_id?: string;
  batch_mode?: boolean;
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

    const requestData: ModelInferenceRequest = await req.json();
    const { 
      model_name, 
      model_version = 'latest', 
      input_data, 
      organization_id,
      project_id,
      batch_mode = false 
    } = requestData;

    // Validate required fields
    if (!model_name || !input_data || !organization_id) {
      throw new Error('Missing required fields: model_name, input_data, organization_id');
    }

    // Check organization membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organization_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      throw new Error('User not authorized for this organization');
    }

    // Check quota for API calls
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_organization_quota', {
        org_id: organization_id,
        resource_type: 'api_calls',
        requested_quantity: batch_mode ? 5 : 1 // Batch requests cost more
      });

    if (quotaError || !quotaCheck) {
      throw new Error('API call quota exceeded');
    }

    // Prepare model serving request
    const modelServingUrl = Deno.env.get('MODEL_SERVING_URL') || 'http://tensorflow-serving:8501';
    const inferenceUrl = `${modelServingUrl}/v1/models/${model_name}${model_version !== 'latest' ? `/versions/${model_version}` : ''}:predict`;

    console.log(`Making inference request to: ${inferenceUrl}`);

    // Transform input data based on model type
    const transformedInput = transformInputForModel(model_name, input_data);

    // Make inference request
    const inferenceResponse = await fetch(inferenceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [transformedInput]
      })
    });

    if (!inferenceResponse.ok) {
      const errorText = await inferenceResponse.text();
      throw new Error(`Model inference failed: ${errorText}`);
    }

    const inferenceResult = await inferenceResponse.json();

    // Transform output based on model type
    const transformedOutput = transformOutputFromModel(model_name, inferenceResult);

    // Track usage
    await supabase.rpc('track_usage', {
      org_id: organization_id,
      resource_type: 'api_calls',
      quantity: batch_mode ? 5 : 1,
      resource_id: project_id,
      metadata: {
        endpoint: 'model-inference',
        model_name,
        model_version,
        input_size: JSON.stringify(input_data).length,
        batch_mode
      }
    });

    // Log inference for monitoring
    console.log(`Model inference completed`, {
      modelName: model_name,
      modelVersion: model_version,
      organizationId: organization_id,
      userId: user.id,
      inputSize: JSON.stringify(input_data).length,
      outputSize: JSON.stringify(transformedOutput).length
    });

    return new Response(
      JSON.stringify({
        success: true,
        model_name,
        model_version,
        predictions: transformedOutput,
        inference_time: Date.now(),
        batch_mode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error in model-inference function:', error);
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

function transformInputForModel(modelName: string, inputData: any) {
  switch (modelName) {
    case 'ndvi_model':
      // Transform raster data for NDVI model
      if (inputData.raster_data) {
        return {
          red_band: inputData.raster_data.red || inputData.red_band,
          nir_band: inputData.raster_data.nir || inputData.nir_band,
          metadata: inputData.metadata || {}
        };
      }
      return inputData;

    case 'buffer_model':
      // Transform geometry data for buffer model
      return {
        geometry: inputData.geometry,
        distance: inputData.distance,
        units: inputData.units || 'meters'
      };

    case 'change_detection_model':
      // Transform image pair for change detection
      return {
        before_image: inputData.before_image,
        after_image: inputData.after_image,
        threshold: inputData.threshold || 0.1
      };

    default:
      return inputData;
  }
}

function transformOutputFromModel(modelName: string, modelOutput: any) {
  const predictions = modelOutput.predictions || [];
  
  switch (modelName) {
    case 'ndvi_model':
      return predictions.map((pred: any) => ({
        ndvi_values: pred.ndvi_values || pred[0],
        statistics: pred.statistics || pred[1],
        confidence: pred.confidence || pred[2] || 0.95
      }));

    case 'buffer_model':
      return predictions.map((pred: any) => ({
        buffered_geometry: pred.buffered_geometry || pred[0],
        area: pred.area || pred[1],
        perimeter: pred.perimeter || pred[2]
      }));

    case 'change_detection_model':
      return predictions.map((pred: any) => ({
        change_map: pred.change_map || pred[0],
        change_percentage: pred.change_percentage || pred[1],
        changed_areas: pred.changed_areas || pred[2]
      }));

    default:
      return predictions;
  }
}