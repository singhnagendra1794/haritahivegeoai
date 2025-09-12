-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create geo_features table for storing geospatial data
CREATE TABLE IF NOT EXISTS public.geo_features (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    geometry GEOMETRY(GEOMETRY, 4326) NOT NULL,
    properties JSONB DEFAULT '{}',
    feature_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.geo_features ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own geo features" 
ON public.geo_features 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own geo features" 
ON public.geo_features 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own geo features" 
ON public.geo_features 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own geo features" 
ON public.geo_features 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create spatial index for better performance
CREATE INDEX IF NOT EXISTS idx_geo_features_geometry ON public.geo_features USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geo_features_user_id ON public.geo_features(user_id);
CREATE INDEX IF NOT EXISTS idx_geo_features_feature_type ON public.geo_features(feature_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_geo_features_updated_at
    BEFORE UPDATE ON public.geo_features
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create PostGIS buffer function for processing
CREATE OR REPLACE FUNCTION public.create_buffer_geojson(
    feature_id UUID,
    buffer_distance NUMERIC,
    requesting_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    feature_record public.geo_features;
    buffered_geometry GEOMETRY;
BEGIN
    -- Check if feature exists and user has access
    SELECT * INTO feature_record 
    FROM public.geo_features 
    WHERE id = feature_id AND user_id = requesting_user_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Create buffer around the geometry
    buffered_geometry := ST_Buffer(feature_record.geometry::geography, buffer_distance)::geometry;
    
    -- Convert to GeoJSON and return
    RETURN ST_AsGeoJSON(buffered_geometry)::JSON;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;