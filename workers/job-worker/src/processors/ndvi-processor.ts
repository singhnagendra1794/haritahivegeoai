import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'winston';
import sharp from 'sharp';
import axios from 'axios';

interface NDVIJobParams {
  jobId: string;
  parameters: {
    dataset_id?: string;
    raster_url?: string;
    red_band?: number;
    nir_band?: number;
    output_format?: 'geotiff' | 'png';
  };
  organizationId: string;
  projectId?: string;
  userId: string;
}

export class NDVIProcessor {
  constructor(
    private supabase: SupabaseClient,
    private logger: Logger
  ) {}

  async process(params: NDVIJobParams) {
    const { jobId, parameters, organizationId, projectId } = params;
    
    this.logger.info(`Starting NDVI processing for job ${jobId}`, {
      jobId,
      parameters
    });

    try {
      // Get raster data source
      let rasterUrl = parameters.raster_url;
      
      if (!rasterUrl && parameters.dataset_id) {
        // Get dataset info from database
        const { data: dataset, error: datasetError } = await this.supabase
          .from('project_datasets')
          .select('file_path, metadata')
          .eq('id', parameters.dataset_id)
          .single();

        if (datasetError || !dataset) {
          throw new Error('Dataset not found');
        }

        rasterUrl = dataset.file_path;
      }

      if (!rasterUrl) {
        throw new Error('No raster data source provided');
      }

      // Download raster data
      this.logger.info(`Downloading raster data from ${rasterUrl}`);
      const rasterResponse = await axios.get(rasterUrl, {
        responseType: 'arraybuffer',
        timeout: 300000, // 5 minutes timeout
      });

      const rasterBuffer = Buffer.from(rasterResponse.data);

      // Process NDVI calculation
      const ndviResult = await this.calculateNDVI(rasterBuffer, {
        redBand: parameters.red_band || 1,
        nirBand: parameters.nir_band || 2,
        outputFormat: parameters.output_format || 'geotiff'
      });

      // Generate statistics
      const statistics = await this.generateNDVIStatistics(ndviResult.data);

      // Store results in database
      const { data: ndviRecord, error: insertError } = await this.supabase
        .from('ndvi_results')
        .insert({
          job_id: jobId,
          organization_id: organizationId,
          project_id: projectId,
          raster_data_url: ndviResult.url,
          statistics,
          metadata: {
            red_band: parameters.red_band || 1,
            nir_band: parameters.nir_band || 2,
            output_format: parameters.output_format || 'geotiff',
            processing_time: Date.now(),
            file_size: ndviResult.size
          }
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to save NDVI results: ${insertError.message}`);
      }

      this.logger.info(`NDVI processing completed for job ${jobId}`, {
        jobId,
        resultId: ndviRecord.id,
        statistics
      });

      return {
        ndvi_result_id: ndviRecord.id,
        raster_url: ndviResult.url,
        statistics,
        processing_time: Date.now(),
        output_format: parameters.output_format || 'geotiff'
      };

    } catch (error) {
      this.logger.error(`NDVI processing failed for job ${jobId}`, {
        jobId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async calculateNDVI(
    rasterBuffer: Buffer, 
    options: { redBand: number; nirBand: number; outputFormat: string }
  ) {
    // This is a simplified NDVI calculation using Sharp
    // In production, you would use GDAL or a specialized library
    
    try {
      // For demonstration, we'll create a mock NDVI raster
      // In reality, you'd use GDAL to:
      // 1. Extract red and NIR bands
      // 2. Calculate NDVI = (NIR - Red) / (NIR + Red)
      // 3. Generate output raster

      const mockNDVIBuffer = await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 1,
          background: 0
        }
      })
      .raw()
      .toBuffer();

      // Generate mock NDVI data (in production, this would be actual calculation)
      const ndviData = new Float32Array(512 * 512);
      for (let i = 0; i < ndviData.length; i++) {
        // Mock NDVI values between -1 and 1
        ndviData[i] = (Math.random() * 2) - 1;
      }

      // Convert to appropriate output format
      let outputBuffer: Buffer;
      let contentType: string;
      let extension: string;

      if (options.outputFormat === 'png') {
        // Convert NDVI to 8-bit for PNG
        const uint8Data = new Uint8Array(ndviData.length);
        for (let i = 0; i < ndviData.length; i++) {
          // Scale from [-1, 1] to [0, 255]
          uint8Data[i] = Math.round(((ndviData[i] + 1) / 2) * 255);
        }

        outputBuffer = await sharp(Buffer.from(uint8Data), {
          raw: { width: 512, height: 512, channels: 1 }
        })
        .png()
        .toBuffer();
        
        contentType = 'image/png';
        extension = 'png';
      } else {
        // For GeoTIFF, we'd use GDAL to create proper georeferenced output
        outputBuffer = Buffer.from(ndviData.buffer);
        contentType = 'image/tiff';
        extension = 'tif';
      }

      // In production, upload to object storage (S3/MinIO)
      const mockUrl = `https://storage.haritahive.com/ndvi/${Date.now()}.${extension}`;

      return {
        data: ndviData,
        url: mockUrl,
        size: outputBuffer.length,
        format: options.outputFormat
      };

    } catch (error) {
      throw new Error(`NDVI calculation failed: ${error.message}`);
    }
  }

  private async generateNDVIStatistics(ndviData: Float32Array) {
    // Calculate basic statistics
    const validValues = Array.from(ndviData).filter(v => !isNaN(v) && v >= -1 && v <= 1);
    
    if (validValues.length === 0) {
      return {
        min: null,
        max: null,
        mean: null,
        std: null,
        count: 0
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const mean = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
    
    // Calculate standard deviation
    const variance = validValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validValues.length;
    const std = Math.sqrt(variance);

    // Calculate vegetation categories
    const categories = {
      water: validValues.filter(v => v < 0).length,
      bare_soil: validValues.filter(v => v >= 0 && v < 0.2).length,
      low_vegetation: validValues.filter(v => v >= 0.2 && v < 0.4).length,
      moderate_vegetation: validValues.filter(v => v >= 0.4 && v < 0.6).length,
      high_vegetation: validValues.filter(v => v >= 0.6).length
    };

    return {
      min,
      max,
      mean,
      std,
      count: validValues.length,
      categories,
      vegetation_percentage: (categories.low_vegetation + categories.moderate_vegetation + categories.high_vegetation) / validValues.length * 100
    };
  }
}