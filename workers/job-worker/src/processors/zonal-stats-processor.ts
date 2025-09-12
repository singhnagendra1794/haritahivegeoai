import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'winston';
import * as turf from '@turf/turf';
import axios from 'axios';

interface ZonalStatsJobParams {
  jobId: string;
  parameters: {
    zones: GeoJSON.FeatureCollection | GeoJSON.Feature[];
    raster_data: string; // URL or dataset ID
    statistics: ('mean' | 'min' | 'max' | 'sum' | 'count' | 'std')[];
    zone_id_field?: string;
  };
  organizationId: string;
  projectId?: string;
  userId: string;
}

interface ZoneStatistics {
  zone_id: string | number;
  zone_name?: string;
  area: number;
  pixel_count: number;
  valid_pixel_count: number;
  statistics: {
    mean?: number;
    min?: number;
    max?: number;
    sum?: number;
    count?: number;
    std?: number;
  };
  geometry: GeoJSON.Geometry;
}

export class ZonalStatsProcessor {
  constructor(
    private supabase: SupabaseClient,
    private logger: Logger
  ) {}

  async process(params: ZonalStatsJobParams) {
    const { jobId, parameters, organizationId, projectId } = params;
    
    this.logger.info(`Starting zonal statistics processing for job ${jobId}`, {
      jobId,
      zonesCount: Array.isArray(parameters.zones) ? parameters.zones.length : parameters.zones.features?.length || 1,
      statistics: parameters.statistics
    });

    try {
      // Normalize zones to FeatureCollection
      let zones: GeoJSON.FeatureCollection;
      if (Array.isArray(parameters.zones)) {
        zones = {
          type: 'FeatureCollection',
          features: parameters.zones as GeoJSON.Feature[]
        };
      } else if (parameters.zones.type === 'FeatureCollection') {
        zones = parameters.zones;
      } else {
        zones = {
          type: 'FeatureCollection',
          features: [parameters.zones as GeoJSON.Feature]
        };
      }

      // Validate zones
      if (!zones.features || zones.features.length === 0) {
        throw new Error('No valid zones provided');
      }

      // Get raster data
      const rasterData = await this.getRasterData(parameters.raster_data);
      if (!rasterData) {
        throw new Error('Could not retrieve raster data');
      }

      // Process each zone
      const results: ZoneStatistics[] = [];
      const requestedStats = parameters.statistics || ['mean', 'min', 'max', 'count'];

      for (let i = 0; i < zones.features.length; i++) {
        const zone = zones.features[i];
        
        try {
          const zoneStats = await this.calculateZoneStatistics(
            zone,
            rasterData,
            requestedStats,
            parameters.zone_id_field,
            i
          );
          
          results.push(zoneStats);
        } catch (error) {
          this.logger.error(`Failed to process zone ${i}`, {
            jobId,
            zoneIndex: i,
            error: error.message
          });
          
          // Create error result for this zone
          results.push({
            zone_id: zone.properties?.[parameters.zone_id_field || 'id'] || i,
            zone_name: zone.properties?.name,
            area: 0,
            pixel_count: 0,
            valid_pixel_count: 0,
            statistics: {},
            geometry: zone.geometry,
          });
        }
      }

      // Generate summary statistics
      const summary = this.generateSummary(results, requestedStats);

      this.logger.info(`Zonal statistics processing completed for job ${jobId}`, {
        jobId,
        zonesProcessed: results.length,
        totalValidPixels: summary.total_valid_pixels
      });

      return {
        zone_statistics: results,
        summary,
        processing_time: Date.now(),
        statistics_requested: requestedStats,
        zones_processed: results.length
      };

    } catch (error) {
      this.logger.error(`Zonal statistics processing failed for job ${jobId}`, {
        jobId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async getRasterData(rasterSource: string) {
    // In production, this would:
    // 1. Check if it's a URL or dataset ID
    // 2. Download raster data if URL
    // 3. Load from storage if dataset ID
    // 4. Use GDAL to read raster metadata and data
    
    try {
      if (rasterSource.startsWith('http')) {
        // Download raster data
        this.logger.info(`Downloading raster data from ${rasterSource}`);
        const response = await axios.get(rasterSource, {
          responseType: 'arraybuffer',
          timeout: 300000
        });
        
        return {
          data: new Float32Array(response.data),
          width: 512, // Mock values - in production get from GDAL
          height: 512,
          bounds: [-180, -90, 180, 90], // [minX, minY, maxX, maxY]
          pixelSize: [0.01, 0.01], // [xPixelSize, yPixelSize]
          noDataValue: -9999
        };
      } else {
        // Assume it's a dataset ID
        const { data: dataset } = await this.supabase
          .from('project_datasets')
          .select('file_path, metadata')
          .eq('id', rasterSource)
          .single();
        
        if (dataset?.file_path) {
          return this.getRasterData(dataset.file_path);
        }
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Failed to get raster data: ${error.message}`);
      return null;
    }
  }

  private async calculateZoneStatistics(
    zone: GeoJSON.Feature,
    rasterData: any,
    requestedStats: string[],
    zoneIdField?: string,
    zoneIndex?: number
  ): Promise<ZoneStatistics> {
    
    // Calculate zone area
    const area = turf.area(zone);
    
    // Get zone identifier
    const zoneId = zone.properties?.[zoneIdField || 'id'] || zoneIndex || 0;
    const zoneName = zone.properties?.name;

    // In production, use GDAL to:
    // 1. Rasterize the zone polygon
    // 2. Extract pixel values within the zone
    // 3. Calculate statistics on valid pixels
    
    // Mock pixel extraction and statistics calculation
    const mockPixelCount = Math.floor(area / 100); // Rough estimate
    const mockPixelValues = Array.from({ length: mockPixelCount }, () => 
      Math.random() * 100 + (Math.random() > 0.1 ? 0 : rasterData.noDataValue)
    );
    
    // Filter out no-data values
    const validPixels = mockPixelValues.filter(v => v !== rasterData.noDataValue);
    
    const statistics: any = {};
    
    if (validPixels.length > 0) {
      if (requestedStats.includes('mean')) {
        statistics.mean = validPixels.reduce((sum, val) => sum + val, 0) / validPixels.length;
      }
      
      if (requestedStats.includes('min')) {
        statistics.min = Math.min(...validPixels);
      }
      
      if (requestedStats.includes('max')) {
        statistics.max = Math.max(...validPixels);
      }
      
      if (requestedStats.includes('sum')) {
        statistics.sum = validPixels.reduce((sum, val) => sum + val, 0);
      }
      
      if (requestedStats.includes('count')) {
        statistics.count = validPixels.length;
      }
      
      if (requestedStats.includes('std')) {
        const mean = statistics.mean || validPixels.reduce((sum, val) => sum + val, 0) / validPixels.length;
        const variance = validPixels.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validPixels.length;
        statistics.std = Math.sqrt(variance);
      }
    }

    return {
      zone_id: zoneId,
      zone_name: zoneName,
      area,
      pixel_count: mockPixelCount,
      valid_pixel_count: validPixels.length,
      statistics,
      geometry: zone.geometry
    };
  }

  private generateSummary(results: ZoneStatistics[], requestedStats: string[]) {
    const summary: any = {
      total_zones: results.length,
      total_area: results.reduce((sum, zone) => sum + zone.area, 0),
      total_pixels: results.reduce((sum, zone) => sum + zone.pixel_count, 0),
      total_valid_pixels: results.reduce((sum, zone) => sum + zone.valid_pixel_count, 0),
    };

    // Calculate aggregate statistics across all zones
    const allValidStats = results
      .map(zone => zone.statistics)
      .filter(stats => Object.keys(stats).length > 0);

    if (allValidStats.length > 0) {
      if (requestedStats.includes('mean')) {
        const means = allValidStats.map(s => s.mean).filter(m => m !== undefined);
        if (means.length > 0) {
          summary.overall_mean = means.reduce((sum, val) => sum + val, 0) / means.length;
        }
      }

      if (requestedStats.includes('min')) {
        const mins = allValidStats.map(s => s.min).filter(m => m !== undefined);
        if (mins.length > 0) {
          summary.overall_min = Math.min(...mins);
        }
      }

      if (requestedStats.includes('max')) {
        const maxs = allValidStats.map(s => s.max).filter(m => m !== undefined);
        if (maxs.length > 0) {
          summary.overall_max = Math.max(...maxs);
        }
      }
    }

    return summary;
  }
}