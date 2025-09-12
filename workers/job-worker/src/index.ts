import { Worker, Queue, QueueEvents } from 'bullmq';
import { createClient } from '@supabase/supabase-js';
import { Redis } from 'redis';
import winston from 'winston';
import dotenv from 'dotenv';
import { NDVIProcessor } from './processors/ndvi-processor';
import { BufferProcessor } from './processors/buffer-processor';
import { ZonalStatsProcessor } from './processors/zonal-stats-processor';
import { ChangeDetectionProcessor } from './processors/change-detection-processor';
import { ReportGenerationProcessor } from './processors/report-processor';

dotenv.config();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Redis connection
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Job queue setup
const jobQueue = new Queue('geoai-jobs', { connection: redisConnection });
const queueEvents = new QueueEvents('geoai-jobs', { connection: redisConnection });

// Job processors
const processors = {
  ndvi: new NDVIProcessor(supabase, logger),
  buffer: new BufferProcessor(supabase, logger),
  zonal_stats: new ZonalStatsProcessor(supabase, logger),
  change_detection: new ChangeDetectionProcessor(supabase, logger),
  report_generation: new ReportGenerationProcessor(supabase, logger),
};

// Main job processor function
async function processJob(job: any) {
  const { id: jobId, data } = job;
  const { job_type, parameters, session_id, project_id } = data;

  logger.info(`Processing job ${jobId} of type ${job_type}`, {
    jobId,
    jobType: job_type,
    sessionId: session_id,
    projectId: project_id
  });

  try {
    // Update job status to 'running'
    await supabase
      .from('jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Get the appropriate processor
    const processor = processors[job_type as keyof typeof processors];
    if (!processor) {
      throw new Error(`No processor found for job type: ${job_type}`);
    }

    // Process the job
    const result = await processor.process({
      jobId,
      parameters,
      sessionId: session_id,
      projectId: project_id
    });

    // Update job status to 'completed'
    await supabase
      .from('jobs')
      .update({
        status: 'completed',
        result_data: result,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    logger.info(`Job ${jobId} completed successfully`, {
      jobId,
      jobType: job_type,
      resultKeys: Object.keys(result || {})
    });

    return result;

  } catch (error) {
    logger.error(`Job ${jobId} failed`, {
      jobId,
      jobType: job_type,
      error: error.message,
      stack: error.stack
    });

    // Update job status to 'failed'
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    throw error;
  }
}

// Create worker
const worker = new Worker('geoai-jobs', processJob, {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
  removeOnComplete: 100,
  removeOnFail: 50,
});

// Worker event handlers
worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`, { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed`, { 
    jobId: job?.id, 
    error: err.message 
  });
});

worker.on('error', (err) => {
  logger.error('Worker error', { error: err.message });
});

// Queue event handlers
queueEvents.on('waiting', ({ jobId }) => {
  logger.info(`Job ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId }) => {
  logger.info(`Job ${jobId} is active`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  logger.info(`Job ${jobId} completed with result`, { jobId, returnvalue });
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Job ${jobId} failed`, { jobId, failedReason });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await worker.close();
  await queueEvents.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await worker.close();
  await queueEvents.close();
  process.exit(0);
});

// Health check endpoint (if running in HTTP mode)
if (process.env.HEALTH_CHECK_PORT) {
  const http = require('http');
  const server = http.createServer((req: any, res: any) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(process.env.HEALTH_CHECK_PORT, () => {
    logger.info(`Health check server running on port ${process.env.HEALTH_CHECK_PORT}`);
  });
}

logger.info('Harita Hive Job Worker started', {
  redisHost: redisConnection.host,
  redisPort: redisConnection.port,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5')
});

export { jobQueue, worker, queueEvents };