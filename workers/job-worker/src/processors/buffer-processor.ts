import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'winston';
import * as turf from '@turf/turf';

interface BufferJobParams {
  jobId: string;
  parameters: {
    geometry: GeoJSON.Geometry;
    distance: number;
    units?: 'meters' | 'kilometers' | 'miles' | 'feet';
    steps?: number;
  };
  sessionId: string;
  projectId?: string;
}

export class BufferProcessor {
  constructor(
    private supabase: SupabaseClient,
    private logger: Logger
  ) {}

  async process(params: BufferJobParams) {
    const { jobId, parameters, sessionId, projectId } = params;
    
    this.logger.info(`Starting buffer processing for job ${jobId}`, {
      jobId,
      distance: parameters.distance,
      units: parameters.units || 'meters'
    });

    try {
      // Validate input geometry
      if (!parameters.geometry || !parameters.geometry.type) {
        throw new Error('Invalid or missing geometry');
      }

      if (!parameters.distance || parameters.distance <= 0) {
        throw new Error('Distance must be a positive number');
      }

      // Create Turf.js feature from geometry
      const inputFeature = turf.feature(parameters.geometry);
      
      // Validate that the feature is valid
      if (!inputFeature || !inputFeature.geometry) {
        throw new Error('Could not create valid feature from geometry');
      }

      // Perform buffer operation
      const bufferedFeature = turf.buffer(
        inputFeature,
        parameters.distance,
        {
          units: parameters.units || 'meters',
          steps: parameters.steps || 64
        }
      );

      if (!bufferedFeature) {
        throw new Error('Buffer operation failed');
      }

      // Calculate area and perimeter of buffer
      const area = turf.area(bufferedFeature);
      const bbox = turf.bbox(bufferedFeature);
      
      // Create statistics
      const statistics = {
        original_area: turf.area(inputFeature),
        buffered_area: area,
        buffer_distance: parameters.distance,
        buffer_units: parameters.units || 'meters',
        perimeter: this.calculatePerimeter(bufferedFeature),
        bbox: {
          minX: bbox[0],
          minY: bbox[1],
          maxX: bbox[2],
          maxY: bbox[3]
        }
      };

      // Store the buffered geometry as a new feature
      const { data: geoFeature, error: featureError } = await this.supabase
        .from('geo_features')
        .insert({
          name: `Buffer ${parameters.distance}${parameters.units || 'm'}`,
          feature_type: bufferedFeature.geometry.type,
          geometry: bufferedFeature.geometry,
          properties: {
            buffer_distance: parameters.distance,
            buffer_units: parameters.units || 'meters',
            original_job_id: jobId,
            created_from: 'buffer_operation'
          },
          session_id: sessionId
        })
        .select()
        .single();

      if (featureError) {
        this.logger.error(`Failed to store buffered geometry: ${featureError.message}`);
        // Continue without storing - return the geometry in results
      }

      this.logger.info(`Buffer processing completed for job ${jobId}`, {
        jobId,
        bufferedArea: area,
        featureId: geoFeature?.id
      });

      return {
        buffered_geometry: bufferedFeature,
        stored_feature_id: geoFeature?.id,
        statistics,
        processing_time: Date.now(),
        operation_type: 'buffer'
      };

    } catch (error) {
      this.logger.error(`Buffer processing failed for job ${jobId}`, {
        jobId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private calculatePerimeter(feature: GeoJSON.Feature): number {
    try {
      if (feature.geometry.type === 'Polygon') {
        return turf.length(turf.polygonToLine(feature as turf.Feature<turf.Polygon>), { units: 'meters' });
      } else if (feature.geometry.type === 'MultiPolygon') {
        let totalLength = 0;
        const multiPolygon = feature as turf.Feature<turf.MultiPolygon>;
        
        multiPolygon.geometry.coordinates.forEach(polygonCoords => {
          const polygon = turf.polygon(polygonCoords);
          totalLength += turf.length(turf.polygonToLine(polygon), { units: 'meters' });
        });
        
        return totalLength;
      }
      
      return 0;
    } catch (error) {
      this.logger.warn(`Could not calculate perimeter: ${error.message}`);
      return 0;
    }
  }
}