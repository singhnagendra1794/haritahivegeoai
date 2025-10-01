-- Create disaster_analyses table for storing disaster event data
CREATE TABLE IF NOT EXISTS public.disaster_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_type TEXT NOT NULL CHECK (disaster_type IN ('hurricane', 'flood', 'wildfire', 'earthquake', 'tornado')),
  location TEXT NOT NULL,
  disaster_date DATE NOT NULL,
  baseline_date DATE NOT NULL DEFAULT '2024-01-01',
  coordinates JSONB,
  analysis_status TEXT NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  total_properties_analyzed INTEGER DEFAULT 0,
  total_estimated_claims NUMERIC(15,2) DEFAULT 0,
  critical_properties INTEGER DEFAULT 0,
  ai_summary TEXT,
  data_sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  session_id TEXT DEFAULT gen_random_uuid()::text
);

-- Create property_damage_assessments table for individual property analyses
CREATE TABLE IF NOT EXISTS public.property_damage_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_analysis_id UUID REFERENCES public.disaster_analyses(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  coordinates JSONB,
  damage_severity TEXT NOT NULL CHECK (damage_severity IN ('none', 'minor', 'moderate', 'severe', 'total')),
  damage_percentage INTEGER CHECK (damage_percentage >= 0 AND damage_percentage <= 100),
  reconstruction_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  demolition_cost NUMERIC(12,2) DEFAULT 0,
  demolition_required BOOLEAN DEFAULT false,
  claims_priority TEXT NOT NULL CHECK (claims_priority IN ('low', 'medium', 'high', 'critical')),
  recommended_action TEXT,
  damage_details JSONB DEFAULT '{}'::jsonb,
  ai_insights TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  visualization_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_disaster_analyses_location ON public.disaster_analyses(location);
CREATE INDEX IF NOT EXISTS idx_disaster_analyses_disaster_type ON public.disaster_analyses(disaster_type);
CREATE INDEX IF NOT EXISTS idx_disaster_analyses_status ON public.disaster_analyses(analysis_status);
CREATE INDEX IF NOT EXISTS idx_disaster_analyses_created_at ON public.disaster_analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_assessments_disaster_id ON public.property_damage_assessments(disaster_analysis_id);
CREATE INDEX IF NOT EXISTS idx_property_assessments_severity ON public.property_damage_assessments(damage_severity);
CREATE INDEX IF NOT EXISTS idx_property_assessments_priority ON public.property_damage_assessments(claims_priority);

-- Enable RLS
ALTER TABLE public.disaster_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_damage_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for disaster_analyses (public read for demo, can be restricted)
CREATE POLICY "Anyone can view disaster analyses"
  ON public.disaster_analyses
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create disaster analyses"
  ON public.disaster_analyses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update disaster analyses"
  ON public.disaster_analyses
  FOR UPDATE
  USING (true);

-- RLS Policies for property_damage_assessments
CREATE POLICY "Anyone can view property assessments"
  ON public.property_damage_assessments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create property assessments"
  ON public.property_damage_assessments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update property assessments"
  ON public.property_damage_assessments
  FOR UPDATE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_disaster_analyses_updated_at
  BEFORE UPDATE ON public.disaster_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_assessments_updated_at
  BEFORE UPDATE ON public.property_damage_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();