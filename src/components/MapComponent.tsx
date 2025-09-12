import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// You'll need to add your Mapbox token here
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';

interface MapComponentProps {
  onFeatureCreated?: (featureId: string) => void;
  bufferedGeometry?: any;
  visibleFeatures?: Set<string>;
  drawingMode?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onFeatureCreated, 
  bufferedGeometry, 
  visibleFeatures, 
  drawingMode 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 0],
      zoom: 2
    });

    // Add drawing controls
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    map.current.addControl(draw.current);
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Handle drawing events
    map.current.on('draw.create', async (e: any) => {
      const feature = e.features[0];
      await handleFeatureSave(feature);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add buffered geometry to map
  useEffect(() => {
    if (!mapLoaded || !map.current || !bufferedGeometry) return;

    const sourceId = 'buffered-polygon';
    const layerId = 'buffered-polygon-layer';

    // Remove existing source and layer if they exist
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Add new buffered geometry
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: bufferedGeometry
    });

    map.current.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': 'hsl(var(--geo-secondary))',
        'fill-opacity': 0.3
      }
    });

    map.current.addLayer({
      id: `${layerId}-outline`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': 'hsl(var(--geo-secondary))',
        'line-width': 2
      }
    });

    // Fit map to buffered geometry bounds
    const coordinates = bufferedGeometry.geometry.coordinates[0];
    const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, { padding: 50 });
  }, [mapLoaded, bufferedGeometry]);

  const handleFeatureSave = async (feature: any) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to save features."
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('ingest-vector', {
        body: {
          geojson: feature
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      const featureId = response.data?.data?.[0]?.id;
      if (featureId && onFeatureCreated) {
        onFeatureCreated(featureId);
      }

      toast({
        title: "Feature Saved",
        description: "Your polygon has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving feature:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save the feature. Please try again."
      });
    }
  };

  if (MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-muted-foreground mb-4">
            Please add your Mapbox public token to use the map component.
          </p>
          <p className="text-sm text-muted-foreground">
            Get your token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-geo-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default MapComponent;