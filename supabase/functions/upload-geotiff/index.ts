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

    console.log(`GeoTIFF upload request from user: ${user.id}`)

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string || 'satellite_image.tif'
    const description = formData.get('description') as string || ''

    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    const allowedTypes = ['image/tiff', 'image/tif', 'application/octet-stream']
    if (!allowedTypes.includes(file.type) && !fileName.toLowerCase().endsWith('.tif') && !fileName.toLowerCase().endsWith('.tiff')) {
      throw new Error('Invalid file type. Please upload a GeoTIFF (.tif/.tiff) file.')
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 50MB.')
    }

    // Upload to Supabase Storage
    const fileExt = fileName.toLowerCase().endsWith('.tiff') ? 'tiff' : 'tif'
    const filePath = `${user.id}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('geotiff-uploads')
      .upload(filePath, file, {
        contentType: file.type || 'image/tiff',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('geotiff-uploads')
      .getPublicUrl(filePath)

    // Store metadata in database
    const { data: metadataRecord, error: metadataError } = await supabase
      .from('raster_data')
      .insert({
        user_id: user.id,
        name: fileName,
        description,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: fileExt,
        upload_status: 'uploaded',
        properties: {
          original_name: fileName,
          upload_timestamp: new Date().toISOString(),
          content_type: file.type
        }
      })
      .select()
      .single()

    if (metadataError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('geotiff-uploads').remove([filePath])
      throw new Error(`Failed to save metadata: ${metadataError.message}`)
    }

    // Basic raster analysis (placeholder for ML integration)
    // In a real implementation, you'd process the GeoTIFF here
    // For now, we'll just mark it as ready for processing
    const { error: updateError } = await supabase
      .from('raster_data')
      .update({
        processing_status: 'ready_for_analysis',
        properties: {
          ...metadataRecord.properties,
          bands_detected: 'auto-detection-pending',
          spatial_reference: 'to-be-determined'
        }
      })
      .eq('id', metadataRecord.id)

    if (updateError) {
      console.error('Failed to update processing status:', updateError)
    }

    console.log(`Successfully uploaded GeoTIFF: ${fileName}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'GeoTIFF uploaded successfully',
        data: {
          id: metadataRecord.id,
          name: fileName,
          file_url: urlData.publicUrl,
          file_size: file.size,
          status: 'ready_for_analysis'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('GeoTIFF upload error:', error)
    
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