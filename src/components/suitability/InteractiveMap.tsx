import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';

interface InteractiveMapProps {
  onPolygonDrawn?: (polygon: any) => void;
  allowDrawing?: boolean;
  center?: [number, number];
  zoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onPolygonDrawn,
  allowDrawing = false,
  center = [77.5946, 12.9716], // Bangalore
  zoom = 6
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if using demo token
    const isDemoToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN === 'pk.demo_token';
    
    if (isDemoToken) {
      // Show message for demo token
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-muted rounded-lg">
            <div class="text-center p-8">
              <div class="w-16 h-16 bg-forest-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-forest-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-charcoal-primary mb-2">Interactive Map</h3>
              <p class="text-muted-foreground mb-4 max-w-sm">
                Add your Mapbox access token to enable interactive mapping features for region selection
              </p>
              <div class="text-xs text-muted-foreground bg-muted-foreground/10 rounded px-3 py-2">
                Get your token at mapbox.com
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    // Initialize map with real token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (allowDrawing) {
      // Initialize drawing controls
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        styles: [
          {
            'id': 'gl-draw-polygon-fill-inactive',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            'paint': {
              'fill-color': '#3bb2d0',
              'fill-outline-color': '#3bb2d0',
              'fill-opacity': 0.1
            }
          },
          {
            'id': 'gl-draw-polygon-stroke-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            'layout': {
              'line-cap': 'round',
              'line-join': 'round'
            },
            'paint': {
              'line-color': '#3bb2d0',
              'line-width': 2
            }
          }
        ]
      });

      map.current.addControl(draw.current, 'top-left');

      // Handle polygon creation
      map.current.on('draw.create', (e: any) => {
        if (onPolygonDrawn && e.features && e.features.length > 0) {
          onPolygonDrawn(e.features[0].geometry);
        }
      });

      map.current.on('draw.update', (e: any) => {
        if (onPolygonDrawn && e.features && e.features.length > 0) {
          onPolygonDrawn(e.features[0].geometry);
        }
      });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [onPolygonDrawn, allowDrawing, center, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
};