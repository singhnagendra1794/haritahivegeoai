import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'winston';
import axios from 'axios';

interface ChangeDetectionJobParams {
  jobId: string;
  parameters: {
    before_image: string; // URL or dataset ID
    after_image: string; // URL or dataset ID
    threshold?: number;
    method?: 'simple_difference' | 'normalized_difference' | 'ratio';
    mask_geometry?: GeoJSON.Geometry;
  };
  organizationId: string;
  projectId?: string;
  userId: string;
}

interface ChangeDetectionResult {
  change_map_url: string;
  statistics: {
    total_pixels: number;
    changed_pixels: number;
    unchanged_pixels: number;
    change_percentage: number;
    change_areas: {
      positive_change: number; // Area of positive change (gain)
      negative_change: number; // Area of negative change (loss)
      no_change: number;       // Area of no significant change
    };
  };
  method_used: string;
  threshold_used: number;
  processing_metadata: {
    before_image_info: any;
    after_image_info: any;
    processing_time: number;
  };
}

export class ChangeDetectionProcessor {
  constructor(
    private supabase: SupabaseClient,
    private logger: Logger
  ) {}

  async process(params: ChangeDetectionJobParams): Promise<ChangeDetectionResult> {
    const { jobId, parameters, organizationId } = params;
    
    this.logger.info(`Starting change detection processing for job ${jobId}`, {
      jobId,
      method: parameters.method || 'simple_difference',
      threshold: parameters.threshold || 0.1
    });

    const startTime = Date.now();

    try {
      // Download and validate input images
      const beforeImageData = await this.loadImageData(parameters.before_image);
      const afterImageData = await this.loadImageData(parameters.after_image);

      if (!beforeImageData || !afterImageData) {
        throw new Error('Failed to load input images');
      }

      // Validate image dimensions match
      if (beforeImageData.width !== afterImageData.width || 
          beforeImageData.height !== afterImageData.height) {
        throw new Error('Input images must have the same dimensions');
      }

      // Perform change detection
      const method = parameters.method || 'simple_difference';
      const threshold = parameters.threshold || 0.1;

      const changeResult = await this.detectChanges(
        beforeImageData,
        afterImageData,
        method,
        threshold,
        parameters.mask_geometry
      );

      // Calculate statistics
      const statistics = this.calculateChangeStatistics(
        changeResult.changeMap,
        beforeImageData.width,
        beforeImageData.height,
        beforeImageData.pixelSize
      );

      // Save change map (in production, upload to object storage)
      const changeMapUrl = await this.saveChangeMap(changeResult.changeMap, jobId);

      const processingTime = Date.now() - startTime;

      this.logger.info(`Change detection processing completed for job ${jobId}`, {
        jobId,
        changePercentage: statistics.change_percentage,
        processingTime
      });

      return {
        change_map_url: changeMapUrl,
        statistics,
        method_used: method,
        threshold_used: threshold,
        processing_metadata: {
          before_image_info: {
            width: beforeImageData.width,
            height: beforeImageData.height,
            bounds: beforeImageData.bounds
          },
          after_image_info: {
            width: afterImageData.width,
            height: afterImageData.height,
            bounds: afterImageData.bounds
          },
          processing_time: processingTime
        }
      };

    } catch (error) {
      this.logger.error(`Change detection processing failed for job ${jobId}`, {
        jobId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async loadImageData(imageSource: string) {
    try {
      if (imageSource.startsWith('http')) {
        // Download image data
        this.logger.info(`Downloading image data from ${imageSource}`);
        const response = await axios.get(imageSource, {
          responseType: 'arraybuffer',
          timeout: 300000
        });
        
        // In production, use GDAL to read actual raster data
        return {
          data: new Float32Array(response.data),
          width: 512,
          height: 512,
          bounds: [-180, -90, 180, 90],
          pixelSize: [0.01, 0.01],
          noDataValue: -9999
        };
      } else {
        // Load from dataset ID
        const { data: dataset } = await this.supabase
          .from('project_datasets')
          .select('file_path, metadata')
          .eq('id', imageSource)
          .single();
        
        if (dataset?.file_path) {
          return this.loadImageData(dataset.file_path);
        }
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Failed to load image data: ${error.message}`);
      return null;
    }
  }

  private async detectChanges(
    beforeImage: any,
    afterImage: any,
    method: string,
    threshold: number,
    maskGeometry?: GeoJSON.Geometry
  ) {
    const width = beforeImage.width;
    const height = beforeImage.height;
    const changeMap = new Float32Array(width * height);

    // Mock change detection algorithm
    // In production, implement actual algorithms:
    // - Simple difference: after - before
    // - Normalized difference: (after - before) / (after + before)
    // - Ratio: after / before

    for (let i = 0; i < changeMap.length; i++) {
      const beforeValue = beforeImage.data[i];
      const afterValue = afterImage.data[i];

      // Skip no-data pixels
      if (beforeValue === beforeImage.noDataValue || afterValue === afterImage.noDataValue) {
        changeMap[i] = beforeImage.noDataValue;
        continue;
      }

      let changeValue = 0;

      switch (method) {
        case 'simple_difference':
          changeValue = afterValue - beforeValue;
          break;
        case 'normalized_difference':
          if (afterValue + beforeValue !== 0) {
            changeValue = (afterValue - beforeValue) / (afterValue + beforeValue);
          }
          break;
        case 'ratio':
          if (beforeValue !== 0) {
            changeValue = afterValue / beforeValue;
          } else {
            changeValue = afterValue > 0 ? 1 : 0;
          }
          break;
        default:
          changeValue = afterValue - beforeValue;
      }

      // Apply threshold to classify as change/no-change
      if (Math.abs(changeValue) > threshold) {
        changeMap[i] = changeValue;
      } else {
        changeMap[i] = 0; // No significant change
      }
    }

    // Apply mask if provided
    if (maskGeometry) {
      // In production, rasterize mask geometry and apply to change map
      this.logger.info('Mask geometry provided - would apply spatial mask in production');
    }

    return {
      changeMap,
      width,
      height
    };
  }

  private calculateChangeStatistics(
    changeMap: Float32Array,
    width: number,
    height: number,
    pixelSize: number[]
  ) {
    const totalPixels = width * height;
    let changedPixels = 0;
    let positiveChange = 0;
    let negativeChange = 0;
    let noChange = 0;

    const pixelArea = pixelSize[0] * pixelSize[1]; // Area per pixel

    for (let i = 0; i < changeMap.length; i++) {
      const value = changeMap[i];
      
      if (value > 0) {
        positiveChange++;
        changedPixels++;
      } else if (value < 0) {
        negativeChange++;
        changedPixels++;
      } else {
        noChange++;
      }
    }

    const unchangedPixels = totalPixels - changedPixels;
    const changePercentage = (changedPixels / totalPixels) * 100;

    return {
      total_pixels: totalPixels,
      changed_pixels: changedPixels,
      unchanged_pixels: unchangedPixels,
      change_percentage: changePercentage,
      change_areas: {
        positive_change: positiveChange * pixelArea,  // Area of gains
        negative_change: negativeChange * pixelArea,  // Area of losses
        no_change: noChange * pixelArea               // Area of no change
      }
    };
  }

  private async saveChangeMap(changeMap: Float32Array, jobId: string): Promise<string> {
    // In production:
    // 1. Convert change map to appropriate format (GeoTIFF, PNG, etc.)
    // 2. Upload to object storage (S3/MinIO)
    // 3. Return public URL
    
    const mockUrl = `https://storage.haritahive.com/change-detection/${jobId}/change_map.tif`;
    
    this.logger.info(`Change map would be saved to: ${mockUrl}`);
    
    return mockUrl;
  }
}