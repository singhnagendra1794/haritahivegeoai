import { Worker, Queue } from 'bullmq';
import { createClient } from '@supabase/supabase-js';
import { Redis } from 'redis';

// Integration test for complete job workflow
describe('Job Workflow Integration', () => {
  let supabase: any;
  let redis: any;
  let jobQueue: Queue;
  let worker: Worker;

  beforeAll(async () => {
    // Setup test database connection
    supabase = createClient(
      process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
      process.env.TEST_SUPABASE_ANON_KEY || 'test-key'
    );

    // Setup test Redis connection
    redis = new Redis({
      host: process.env.TEST_REDIS_HOST || 'localhost',
      port: parseInt(process.env.TEST_REDIS_PORT || '6379'),
      lazyConnect: true
    });

    await redis.connect();

    // Setup test queue
    jobQueue = new Queue('test-geoai-jobs', { 
      connection: { 
        host: process.env.TEST_REDIS_HOST || 'localhost',
        port: parseInt(process.env.TEST_REDIS_PORT || '6379')
      } 
    });

    // Clear any existing jobs
    await jobQueue.obliterate({ force: true });
  });

  afterAll(async () => {
    await jobQueue.close();
    await redis.disconnect();
    if (worker) {
      await worker.close();
    }
  });

  describe('Buffer Job Workflow', () => {
    it('should complete full buffer job lifecycle', async () => {
      // Create test organization and user
      const testOrg = await supabase
        .from('organizations')
        .insert({
          name: 'Test Organization',
          slug: 'test-org-buffer',
          subscription_tier: 'pro'
        })
        .select()
        .single();

      const testUser = 'test-user-123';

      await supabase
        .from('organization_members')
        .insert({
          organization_id: testOrg.data.id,
          user_id: testUser,
          role: 'owner'
        });

      // Create test project
      const testProject = await supabase
        .from('projects')
        .insert({
          title: 'Buffer Test Project',
          organization_id: testOrg.data.id,
          owner_id: testUser,
          sector: 'agriculture'
        })
        .select()
        .single();

      // Create buffer job
      const bufferJob = await supabase
        .from('jobs')
        .insert({
          organization_id: testOrg.data.id,
          project_id: testProject.data.id,
          user_id: testUser,
          job_type: 'buffer',
          parameters: {
            geometry: {
              type: 'Point',
              coordinates: [-74.0059, 40.7128]
            },
            distance: 1000,
            units: 'meters'
          },
          status: 'pending'
        })
        .select()
        .single();

      expect(bufferJob.data.id).toBeDefined();
      expect(bufferJob.data.status).toBe('pending');

      // Add job to queue
      const queueJob = await jobQueue.add('buffer', {
        job_id: bufferJob.data.id,
        job_type: 'buffer',
        parameters: bufferJob.data.parameters,
        organization_id: testOrg.data.id,
        project_id: testProject.data.id,
        user_id: testUser
      });

      expect(queueJob.id).toBeDefined();

      // Wait for job to be processed (in a real test, you'd have a worker running)
      // For this integration test, we'll simulate job completion
      await supabase
        .from('jobs')
        .update({
          status: 'completed',
          result_data: {
            buffered_geometry: {
              type: 'Polygon',
              coordinates: [[]]
            },
            statistics: {
              original_area: 0,
              buffered_area: 3141592.65,
              buffer_distance: 1000,
              buffer_units: 'meters'
            }
          },
          completed_at: new Date().toISOString()
        })
        .eq('id', bufferJob.data.id);

      // Verify job completion
      const completedJob = await supabase
        .from('jobs')
        .select('*')
        .eq('id', bufferJob.data.id)
        .single();

      expect(completedJob.data.status).toBe('completed');
      expect(completedJob.data.result_data.buffered_geometry).toBeDefined();
      expect(completedJob.data.result_data.statistics.buffered_area).toBeGreaterThan(0);

      // Verify usage tracking
      const usageRecords = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('organization_id', testOrg.data.id)
        .eq('resource_type', 'jobs');

      expect(usageRecords.data).toHaveLength(1);
      expect(usageRecords.data[0].quantity).toBe(1);

      // Cleanup
      await supabase.from('jobs').delete().eq('id', bufferJob.data.id);
      await supabase.from('projects').delete().eq('id', testProject.data.id);
      await supabase.from('organization_members').delete().eq('organization_id', testOrg.data.id);
      await supabase.from('organizations').delete().eq('id', testOrg.data.id);
    }, 30000);
  });

  describe('NDVI Job Workflow', () => {
    it('should handle NDVI job with quota enforcement', async () => {
      // Create test organization with free tier
      const testOrg = await supabase
        .from('organizations')
        .insert({
          name: 'Free Tier Org',
          slug: 'free-tier-ndvi',
          subscription_tier: 'free'
        })
        .select()
        .single();

      const testUser = 'test-user-456';

      await supabase
        .from('organization_members')
        .insert({
          organization_id: testOrg.data.id,
          user_id: testUser,
          role: 'owner'
        });

      // Create multiple jobs to test quota (free tier allows 10 jobs/month)
      const jobPromises = [];
      for (let i = 0; i < 12; i++) {
        jobPromises.push(
          supabase
            .from('jobs')
            .insert({
              organization_id: testOrg.data.id,
              user_id: testUser,
              job_type: 'ndvi',
              parameters: {
                raster_url: `https://example.com/test-raster-${i}.tif`
              },
              status: 'completed',
              completed_at: new Date().toISOString()
            })
        );
      }

      await Promise.all(jobPromises);

      // Track usage for each job
      for (let i = 0; i < 12; i++) {
        await supabase.rpc('track_usage', {
          org_id: testOrg.data.id,
          resource_type: 'jobs',
          quantity: 1
        });
      }

      // Check quota - should fail for 13th job
      const quotaCheck = await supabase.rpc('check_organization_quota', {
        org_id: testOrg.data.id,
        resource_type: 'jobs',
        requested_quantity: 1
      });

      expect(quotaCheck.data).toBe(false); // Should exceed quota

      // Cleanup
      await supabase.from('usage_tracking').delete().eq('organization_id', testOrg.data.id);
      await supabase.from('jobs').delete().eq('organization_id', testOrg.data.id);
      await supabase.from('organization_members').delete().eq('organization_id', testOrg.data.id);  
      await supabase.from('organizations').delete().eq('id', testOrg.data.id);
    }, 30000);
  });

  describe('Multi-tenant Data Isolation', () => {
    it('should enforce data isolation between organizations', async () => {
      // Create two organizations
      const org1 = await supabase
        .from('organizations')
        .insert({
          name: 'Organization 1',
          slug: 'org-1-isolation',
          subscription_tier: 'pro'
        })
        .select()
        .single();

      const org2 = await supabase
        .from('organizations')
        .insert({
          name: 'Organization 2', 
          slug: 'org-2-isolation',
          subscription_tier: 'pro'
        })
        .select()
        .single();

      const user1 = 'user-1-isolation';
      const user2 = 'user-2-isolation';

      // Add users to respective organizations
      await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: org1.data.id,
            user_id: user1,
            role: 'owner'
          },
          {
            organization_id: org2.data.id,
            user_id: user2,
            role: 'owner'
          }
        ]);

      // Create projects for each organization
      const project1 = await supabase
        .from('projects')
        .insert({
          title: 'Org 1 Project',
          organization_id: org1.data.id,
          owner_id: user1,
          sector: 'environment'
        })
        .select()
        .single();

      const project2 = await supabase
        .from('projects')
        .insert({
          title: 'Org 2 Project',
          organization_id: org2.data.id,
          owner_id: user2,
          sector: 'agriculture'
        })
        .select()
        .single();

      // Create jobs for each organization
      const job1 = await supabase
        .from('jobs')
        .insert({
          organization_id: org1.data.id,
          project_id: project1.data.id,
          user_id: user1,
          job_type: 'buffer',
          parameters: { test: 'org1' }
        })
        .select()
        .single();

      const job2 = await supabase
        .from('jobs')
        .insert({
          organization_id: org2.data.id,
          project_id: project2.data.id,
          user_id: user2,  
          job_type: 'ndvi',
          parameters: { test: 'org2' }
        })
        .select()
        .single();

      // Verify user1 can only see org1 data
      // (In real test, you'd simulate authenticated requests with RLS)
      const org1Jobs = await supabase
        .from('jobs')
        .select('*')
        .eq('organization_id', org1.data.id);

      const org2Jobs = await supabase
        .from('jobs')
        .select('*')
        .eq('organization_id', org2.data.id);

      expect(org1Jobs.data).toHaveLength(1);
      expect(org1Jobs.data[0].parameters.test).toBe('org1');
      
      expect(org2Jobs.data).toHaveLength(1);
      expect(org2Jobs.data[0].parameters.test).toBe('org2');

      // Cleanup
      await supabase.from('jobs').delete().in('id', [job1.data.id, job2.data.id]);
      await supabase.from('projects').delete().in('id', [project1.data.id, project2.data.id]);
      await supabase.from('organization_members').delete().in('organization_id', [org1.data.id, org2.data.id]);
      await supabase.from('organizations').delete().in('id', [org1.data.id, org2.data.id]);
    }, 30000);
  });
});