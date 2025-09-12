import { BufferProcessor } from '../../processors/buffer-processor';
import { createClient } from '@supabase/supabase-js';
import winston from 'winston';

// Mock Supabase
jest.mock('@supabase/supabase-js');
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: jest.fn(),
  rpc: jest.fn()
};

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
} as any;

describe('BufferProcessor', () => {
  let processor: BufferProcessor;

  beforeEach(() => {
    processor = new BufferProcessor(mockSupabase as any, mockLogger);
    jest.clearAllMocks();
  });

  describe('process', () => {
    const validJobParams = {
      jobId: 'test-job-123',
      parameters: {
        geometry: {
          type: 'Point',
          coordinates: [-74.0059, 40.7128]
        },
        distance: 1000,
        units: 'meters' as const
      },
      organizationId: 'org-123',
      projectId: 'project-123',
      userId: 'user-123'
    };

    it('should successfully process a buffer job', async () => {
      // Mock successful database operations
      mockSupabase.single.mockResolvedValue({
        data: { id: 'feature-123' },
        error: null
      });

      const result = await processor.process(validJobParams);

      expect(result).toMatchObject({
        operation_type: 'buffer',
        processing_time: expect.any(Number)
      });
      expect(result.buffered_geometry).toBeDefined();
      expect(result.statistics).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Starting buffer processing'),
        expect.any(Object)
      );
    });

    it('should throw error for invalid geometry', async () => {
      const invalidParams = {
        ...validJobParams,
        parameters: {
          ...validJobParams.parameters,
          geometry: null as any
        }
      };

      await expect(processor.process(invalidParams)).rejects.toThrow('Invalid or missing geometry');
    });

    it('should throw error for invalid distance', async () => {
      const invalidParams = {
        ...validJobParams,
        parameters: {
          ...validJobParams.parameters,
          distance: -100
        }
      };

      await expect(processor.process(invalidParams)).rejects.toThrow('Distance must be a positive number');
    });

    it('should handle different geometry types', async () => {
      const polygonParams = {
        ...validJobParams,
        parameters: {
          ...validJobParams.parameters,
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-74.0059, 40.7128],
              [-74.0049, 40.7128],
              [-74.0049, 40.7138],
              [-74.0059, 40.7138],
              [-74.0059, 40.7128]
            ]]
          }
        }
      };

      mockSupabase.single.mockResolvedValue({
        data: { id: 'feature-456' },
        error: null
      });

      const result = await processor.process(polygonParams);

      expect(result.buffered_geometry).toBeDefined();
      expect(result.statistics.original_area).toBeGreaterThan(0);
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      });

      const result = await processor.process(validJobParams);

      // Should still return result even if database storage fails
      expect(result.buffered_geometry).toBeDefined();
      expect(result.stored_feature_id).toBeUndefined();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should calculate statistics correctly', async () => {
      mockSupabase.single.mockResolvedValue({
        data: { id: 'feature-789' },
        error: null
      });

      const result = await processor.process(validJobParams);

      expect(result.statistics).toMatchObject({
        original_area: expect.any(Number),
        buffered_area: expect.any(Number),
        buffer_distance: 1000,
        buffer_units: 'meters',
        perimeter: expect.any(Number),
        bbox: expect.objectContaining({
          minX: expect.any(Number),
          minY: expect.any(Number),
          maxX: expect.any(Number),
          maxY: expect.any(Number)
        })
      });
    });
  });
});