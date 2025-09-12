import { NDVIProcessor } from '../../processors/ndvi-processor';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Supabase
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

describe('NDVIProcessor', () => {
  let processor: NDVIProcessor;

  beforeEach(() => {
    processor = new NDVIProcessor(mockSupabase as any, mockLogger);
    jest.clearAllMocks();
  });

  describe('process', () => {
    const validJobParams = {
      jobId: 'ndvi-job-123',
      parameters: {
        raster_url: 'https://example.com/satellite-image.tif',
        red_band: 1,
        nir_band: 2,
        output_format: 'geotiff' as const
      },
      organizationId: 'org-123',
      projectId: 'project-123',
      userId: 'user-123'
    };

    it('should successfully process NDVI calculation', async () => {
      // Mock successful raster download
      const mockRasterData = new ArrayBuffer(1024);
      mockedAxios.get.mockResolvedValue({
        data: mockRasterData
      });

      // Mock successful database operations
      mockSupabase.single.mockResolvedValue({
        data: {
          id: 'ndvi-result-123',
          raster_data_url: 'https://storage.example.com/ndvi/result.tif',
          statistics: {
            min: -0.2,
            max: 0.8,
            mean: 0.4,
            std: 0.15
          }
        },
        error: null
      });

      const result = await processor.process(validJobParams);

      expect(result).toMatchObject({
        ndvi_result_id: 'ndvi-result-123',
        raster_url: expect.any(String),
        statistics: expect.objectContaining({
          min: expect.any(Number),
          max: expect.any(Number),
          mean: expect.any(Number),
          std: expect.any(Number)
        }),
        processing_time: expect.any(Number),
        output_format: 'geotiff'
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        validJobParams.parameters.raster_url,
        expect.objectContaining({
          responseType: 'arraybuffer',
          timeout: 300000
        })
      );
    });

    it('should handle dataset_id parameter', async () => {
      const datasetParams = {
        ...validJobParams,
        parameters: {
          dataset_id: 'dataset-123',
          red_band: 1,
          nir_band: 2
        }
      };

      // Mock dataset lookup
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          file_path: 'https://storage.example.com/dataset.tif',
          metadata: {}
        },
        error: null
      });

      // Mock raster download
      mockedAxios.get.mockResolvedValue({
        data: new ArrayBuffer(2048)
      });

      // Mock NDVI result insertion
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'ndvi-result-456' },
        error: null
      });

      const result = await processor.process(datasetParams);

      expect(result.ndvi_result_id).toBe('ndvi-result-456');
      expect(mockSupabase.from).toHaveBeenCalledWith('project_datasets');
    });

    it('should throw error when no raster source provided', async () => {
      const invalidParams = {
        ...validJobParams,
        parameters: {
          red_band: 1,
          nir_band: 2
        }
      };

      await expect(processor.process(invalidParams)).rejects.toThrow(
        'No raster data source provided'
      );
    });

    it('should handle raster download failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(processor.process(validJobParams)).rejects.toThrow();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle database insertion failure', async () => {
      mockedAxios.get.mockResolvedValue({
        data: new ArrayBuffer(1024)
      });

      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Database insertion failed' }
      });

      await expect(processor.process(validJobParams)).rejects.toThrow(
        'Failed to save NDVI results: Database insertion failed'
      );
    });

    it('should calculate vegetation statistics correctly', async () => {
      mockedAxios.get.mockResolvedValue({
        data: new ArrayBuffer(1024)
      });

      mockSupabase.single.mockResolvedValue({
        data: {
          id: 'ndvi-result-789',
          statistics: {
            min: -0.1,
            max: 0.9,
            mean: 0.5,
            std: 0.2,
            count: 262144,
            categories: {
              water: 1000,
              bare_soil: 50000,
              low_vegetation: 100000,
              moderate_vegetation: 80000,
              high_vegetation: 31144
            },
            vegetation_percentage: 80.5
          }
        },
        error: null
      });

      const result = await processor.process(validJobParams);

      expect(result.statistics.vegetation_percentage).toBeGreaterThan(0);
      expect(result.statistics.categories).toBeDefined();
      expect(typeof result.statistics.vegetation_percentage).toBe('number');
    });

    it('should support different output formats', async () => {
      const pngParams = {
        ...validJobParams,
        parameters: {
          ...validJobParams.parameters,
          output_format: 'png' as const
        }
      };

      mockedAxios.get.mockResolvedValue({
        data: new ArrayBuffer(1024)
      });

      mockSupabase.single.mockResolvedValue({
        data: { id: 'ndvi-result-png' },
        error: null
      });

      const result = await processor.process(pngParams);

      expect(result.output_format).toBe('png');
    });
  });
});