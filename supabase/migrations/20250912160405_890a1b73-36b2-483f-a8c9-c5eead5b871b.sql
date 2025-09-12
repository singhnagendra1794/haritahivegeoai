-- Harita Hive Multi-Tenant GeoAI Platform Schema
-- Core tables for multi-tenant architecture

-- Organizations/Tenants table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced user roles for multi-tenancy
CREATE TYPE public.organization_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Organization memberships
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role public.organization_role NOT NULL DEFAULT 'member',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, user_id)
);

-- Job types and statuses
CREATE TYPE public.job_type AS ENUM ('ndvi', 'change_detection', 'zonal_stats', 'buffer', 'report_generation');
CREATE TYPE public.job_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- Jobs table for async processing
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  job_type public.job_type NOT NULL,
  status public.job_status NOT NULL DEFAULT 'pending',
  parameters JSONB DEFAULT '{}',
  result_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- NDVI results table
CREATE TABLE public.ndvi_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  raster_data_url TEXT,
  statistics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Usage tracking for billing and quotas
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  resource_type TEXT NOT NULL, -- 'project', 'storage', 'api_call', 'job'
  resource_id UUID,
  quantity NUMERIC DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quota definitions
CREATE TABLE public.quota_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_tier TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  limit_value NUMERIC NOT NULL, -- -1 for unlimited
  reset_period TEXT, -- 'monthly', 'daily', 'yearly'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subscription_tier, resource_type)
);

-- Insert default quota definitions
INSERT INTO public.quota_definitions (subscription_tier, resource_type, limit_value, reset_period) VALUES
('free', 'projects', 2, 'monthly'),
('free', 'storage_mb', 50, 'monthly'),
('free', 'api_calls', 1000, 'monthly'),
('free', 'jobs', 10, 'monthly'),
('pro', 'projects', 10, 'monthly'),
('pro', 'storage_mb', 2048, 'monthly'),
('pro', 'api_calls', 10000, 'monthly'),
('pro', 'jobs', 100, 'monthly'),
('enterprise', 'projects', -1, 'monthly'),
('enterprise', 'storage_mb', -1, 'monthly'),
('enterprise', 'api_calls', -1, 'monthly'),
('enterprise', 'jobs', -1, 'monthly');

-- Update existing projects table to include organization
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tenant_id UUID; -- For backward compatibility

-- Create indexes for performance
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organization_members_org_user ON public.organization_members(organization_id, user_id);
CREATE INDEX idx_jobs_org_status ON public.jobs(organization_id, status);
CREATE INDEX idx_jobs_project_type ON public.jobs(project_id, job_type);
CREATE INDEX idx_usage_tracking_org_date ON public.usage_tracking(organization_id, created_at);
CREATE INDEX idx_ndvi_results_project ON public.ndvi_results(project_id);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndvi_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quota_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = organizations.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can update their organization" ON public.organizations
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = organizations.id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- RLS Policies for Organization Members
CREATE POLICY "Users can view members of their organizations" ON public.organization_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners and admins can manage members" ON public.organization_members
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = organization_members.organization_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- RLS Policies for Jobs
CREATE POLICY "Users can view jobs in their organizations" ON public.jobs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = jobs.organization_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create jobs in their organizations" ON public.jobs
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = jobs.organization_id 
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin', 'member')
  )
);

-- RLS Policies for NDVI Results
CREATE POLICY "Users can view NDVI results in their organizations" ON public.ndvi_results
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = ndvi_results.organization_id AND user_id = auth.uid()
  )
);

-- RLS Policies for Usage Tracking
CREATE POLICY "Users can view usage for their organizations" ON public.usage_tracking
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = usage_tracking.organization_id AND user_id = auth.uid()
  )
);

CREATE POLICY "System can create usage records" ON public.usage_tracking
FOR INSERT WITH CHECK (true);

-- RLS Policies for Quota Definitions
CREATE POLICY "Anyone can view quota definitions" ON public.quota_definitions
FOR SELECT USING (true);

-- Functions for quota checking
CREATE OR REPLACE FUNCTION public.check_organization_quota(
  org_id UUID,
  resource_type TEXT,
  requested_quantity NUMERIC DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  quota_limit NUMERIC;
  current_usage NUMERIC;
  org_tier TEXT;
BEGIN
  -- Get organization subscription tier
  SELECT subscription_tier INTO org_tier
  FROM public.organizations
  WHERE id = org_id;
  
  -- Get quota limit for this tier and resource
  SELECT limit_value INTO quota_limit
  FROM public.quota_definitions
  WHERE subscription_tier = org_tier AND resource_type = check_organization_quota.resource_type;
  
  -- If unlimited (-1), allow
  IF quota_limit = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate current usage
  SELECT COALESCE(SUM(quantity), 0) INTO current_usage
  FROM public.usage_tracking
  WHERE organization_id = org_id
  AND resource_type = check_organization_quota.resource_type
  AND created_at >= date_trunc('month', now());
  
  -- Check if adding requested quantity would exceed limit
  RETURN (current_usage + requested_quantity) <= quota_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track usage
CREATE OR REPLACE FUNCTION public.track_usage(
  org_id UUID,
  resource_type TEXT,
  quantity NUMERIC DEFAULT 1,
  resource_id UUID DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_tracking (
    organization_id,
    user_id,
    resource_type,
    resource_id,
    quantity,
    metadata
  ) VALUES (
    org_id,
    auth.uid(),
    resource_type,
    resource_id,
    quantity,
    metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;