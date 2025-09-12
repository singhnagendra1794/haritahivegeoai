-- Remove authentication dependencies from Harita Hive schema
-- Keep data structures but make them authentication-free

-- Disable RLS on all tables to remove authentication requirements
ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_datasets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndvi_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON public.organizations;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view projects they own or collaborate on" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can update their projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can delete their projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view datasets of their projects" ON public.project_datasets;
DROP POLICY IF EXISTS "Project owners and editors can manage datasets" ON public.project_datasets;
DROP POLICY IF EXISTS "Project owners and editors can update datasets" ON public.project_datasets;
DROP POLICY IF EXISTS "Project owners and editors can delete datasets" ON public.project_datasets;
DROP POLICY IF EXISTS "Users can view jobs in their organizations" ON public.jobs;
DROP POLICY IF EXISTS "Users can create jobs in their organizations" ON public.jobs;
DROP POLICY IF EXISTS "Users can view NDVI results in their organizations" ON public.ndvi_results;
DROP POLICY IF EXISTS "Users can view analysis results of their projects" ON public.analysis_results;
DROP POLICY IF EXISTS "Project owners and editors can create analysis results" ON public.analysis_results;
DROP POLICY IF EXISTS "Users can view reports of their projects" ON public.reports;
DROP POLICY IF EXISTS "Project owners and editors can create reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view usage for their organizations" ON public.usage_tracking;
DROP POLICY IF EXISTS "System can create usage records" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.usage_analytics;
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.usage_analytics;
DROP POLICY IF EXISTS "System can create analytics" ON public.usage_analytics;
DROP POLICY IF EXISTS "Users can view their own geo features" ON public.geo_features;
DROP POLICY IF EXISTS "Users can create their own geo features" ON public.geo_features;
DROP POLICY IF EXISTS "Users can update their own geo features" ON public.geo_features;
DROP POLICY IF EXISTS "Users can delete their own geo features" ON public.geo_features;

-- Make user_id columns nullable and add default session identifiers
ALTER TABLE public.projects ALTER COLUMN owner_id DROP NOT NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

ALTER TABLE public.geo_features ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.geo_features ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

ALTER TABLE public.jobs ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

ALTER TABLE public.project_comments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.project_comments ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

ALTER TABLE public.usage_tracking ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.usage_tracking ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

ALTER TABLE public.reports ALTER COLUMN generated_by DROP NOT NULL;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT gen_random_uuid()::text;

-- Make organization_id optional for standalone projects
ALTER TABLE public.projects ALTER COLUMN organization_id DROP NOT NULL;

-- Add indexes for session-based queries
CREATE INDEX IF NOT EXISTS idx_projects_session_id ON public.projects(session_id);
CREATE INDEX IF NOT EXISTS idx_geo_features_session_id ON public.geo_features(session_id);
CREATE INDEX IF NOT EXISTS idx_jobs_session_id ON public.jobs(session_id);

-- Create a simplified public API key table for optional API rate limiting
CREATE TABLE IF NOT EXISTS public.api_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  request_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Create index for API session lookup
CREATE INDEX IF NOT EXISTS idx_api_sessions_session_id ON public.api_sessions(session_id);

-- Update quota checking function to work without authentication
CREATE OR REPLACE FUNCTION public.check_session_quota(
  session_identifier TEXT,
  resource_type TEXT,
  requested_quantity NUMERIC DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  current_usage NUMERIC;
  daily_limit NUMERIC := 100; -- Default daily limit for anonymous sessions
BEGIN
  -- For MVP, use generous limits for all users
  CASE resource_type
    WHEN 'projects' THEN daily_limit := 10;
    WHEN 'storage_mb' THEN daily_limit := 500;
    WHEN 'api_calls' THEN daily_limit := 1000;
    WHEN 'jobs' THEN daily_limit := 50;
    ELSE daily_limit := 100;
  END CASE;
  
  -- Calculate current usage (daily)
  SELECT COALESCE(SUM(quantity), 0) INTO current_usage
  FROM public.usage_tracking
  WHERE session_id = session_identifier
  AND resource_type = check_session_quota.resource_type
  AND created_at >= date_trunc('day', now());
  
  -- Check if adding requested quantity would exceed limit
  RETURN (current_usage + requested_quantity) <= daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update usage tracking function to work with sessions
CREATE OR REPLACE FUNCTION public.track_session_usage(
  session_identifier TEXT,
  resource_type TEXT,
  quantity NUMERIC DEFAULT 1,
  resource_id UUID DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_tracking (
    session_id,
    resource_type,
    resource_id,
    quantity,
    metadata
  ) VALUES (
    session_identifier,
    resource_type,
    resource_id,
    quantity,
    metadata
  );
  
  -- Update API session last used time
  INSERT INTO public.api_sessions (session_id, last_used_at, request_count)
  VALUES (session_identifier, now(), 1)
  ON CONFLICT (session_id) 
  DO UPDATE SET 
    last_used_at = now(),
    request_count = api_sessions.request_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Auth re-enablement hooks: Store auth-related columns with default values
-- These columns can be easily re-activated when authentication is re-added
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS auth_owner_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS auth_organization_id UUID;
ALTER TABLE public.geo_features ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS auth_organization_id UUID;

-- Create a function to migrate session data to authenticated data (for future use)
CREATE OR REPLACE FUNCTION public.migrate_session_to_user(
  session_identifier TEXT,
  target_user_id UUID,
  target_organization_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  migrated_count INTEGER := 0;
BEGIN
  -- This function will be used when re-enabling authentication
  -- to migrate anonymous session data to authenticated users
  
  UPDATE public.projects 
  SET auth_owner_id = target_user_id, 
      auth_organization_id = target_organization_id
  WHERE session_id = session_identifier;
  
  GET DIAGNOSTICS migrated_count = ROW_COUNT;
  
  UPDATE public.geo_features 
  SET auth_user_id = target_user_id
  WHERE session_id = session_identifier;
  
  UPDATE public.jobs 
  SET auth_user_id = target_user_id,
      auth_organization_id = target_organization_id
  WHERE session_id = session_identifier;
  
  RETURN migrated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;