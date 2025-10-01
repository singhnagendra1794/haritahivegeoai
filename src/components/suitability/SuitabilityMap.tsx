import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';
import MapboxTokenGate from '@/components/MapboxTokenGate';

interface AnalysisResult {
  projectId: string;
  suitabilityData: any;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
  }>;
  breakdown: Record<string, number>;
}

interface Region {
  type: 'buffer';
  data: {
    center: [number, number];
    radius: number;
    address: string;
  };
  name: string;
}

interface SuitabilityMapProps {
  result?: AnalysisResult | null;
  region?: Region | null;
}

export const SuitabilityMap: React.FC<SuitabilityMapProps> = ({ result, region }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('mapbox_public_token') : null;
      const envToken = (import.meta as any).env?.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;
      return stored || envToken || null;
    } catch {
      const envToken = (import.meta as any).env?.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;
      return envToken || null;
    }
  });
  useEffect(() => {
    if (!mapContainer.current || !region || !result) return;

    if (!token) {
      if (mapContainer.current) mapContainer.current.innerHTML = '';
      return;
    }

    // Check if using demo token
    const isDemoToken = token === 'pk.demo_token';
    
    if (isDemoToken) {
      // Show demo visualization
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="h-full bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 relative rounded-lg overflow-hidden">
            <!-- Simulated Heatmap -->
            <div class="absolute inset-0">
              <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/30 rounded-full blur-xl"></div>
              <div class="absolute top-1/3 right-1/4 w-24 h-24 bg-green-400/40 rounded-full blur-lg"></div>
              <div class="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-500/30 rounded-full blur-lg"></div>
              <div class="absolute bottom-1/4 right-1/3 w-16 h-16 bg-red-500/30 rounded-full blur-md"></div>
              <div class="absolute top-1/2 left-1/2 w-28 h-28 bg-green-600/50 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            <!-- Legend -->
            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 class="font-semibold text-sm mb-2">Suitability Score</h4>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-green-500 rounded"></div>
                  <span class="text-xs">High (0.8-1.0)</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span class="text-xs">Medium (0.5-0.8)</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-red-500 rounded"></div>
                  <span class="text-xs">Low (0.0-0.5)</span>
                </div>
              </div>
            </div>

            <!-- Top Sites Markers -->
            ${result.topSites.map((site, index) => `
              <div class="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold border-2 border-green-500 transform -translate-x-1/2 -translate-y-1/2" 
                   style="top: ${30 + (index * 15)}%; left: ${40 + (index * 10)}%;">
                ${index + 1}
              </div>
            `).join('')}

            <!-- Demo Label -->
            <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
              Demo Visualization
            </div>
          </div>
        `;
      }
      return;
    }

    // Initialize real map with Mapbox token
    mapboxgl.accessToken = token;

    // Calculate zoom level based on buffer radius
    const getZoomLevel = (radiusKm: number) => {
      if (radiusKm <= 2) return 12;
      if (radiusKm <= 5) return 10;
      return 8;
    };

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: region.data.center,
      zoom: getZoomLevel(region.data.radius),
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add buffer circle visualization
      map.current!.addSource('buffer-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: region.data.center
          }
        }
      });

      // Add buffer circle layer
      map.current!.addLayer({
        id: 'buffer-fill',
        type: 'circle',
        source: 'buffer-circle',
        paint: {
          'circle-radius': {
            stops: [
              [8, region.data.radius * 8],
              [12, region.data.radius * 32],
              [16, region.data.radius * 128]
            ]
          },
          'circle-color': '#22c55e',
          'circle-opacity': 0.1,
          'circle-stroke-color': '#22c55e',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8
        }
      });

      // Add center point
      map.current!.addLayer({
        id: 'buffer-center',
        type: 'circle',
        source: 'buffer-circle',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ef4444',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2
        }
      });

      // Add markers for top sites
      result.topSites.forEach((site, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: #22c55e;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        el.textContent = (index + 1).toString();

        new mapboxgl.Marker(el)
          .setLngLat(site.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h4 class="font-semibold">Site #${index + 1}</h4>
                  <p class="text-sm">Score: ${site.score.toFixed(2)}</p>
                  <p class="text-sm">Area: ${site.area.toFixed(1)} hectares</p>
                </div>
              `)
          )
          .addTo(map.current!);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [result, region, token]);

  // Show placeholder when no data is available yet
  if (!region || !result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-forest-primary" />
            Map Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a location and run analysis to view results</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-forest-primary" />
          Suitability Analysis Results
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{region.name}</Badge>
          <Badge variant="outline" className="text-xs">
            {result.topSites.length} Sites Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden border border-border">
          {token ? (
            <div 
              ref={mapContainer} 
              className="w-full h-full"
            />
          ) : (
            <MapboxTokenGate 
              onTokenSaved={(t) => setToken(t)}
              title="Mapbox Token Required"
              description="Enter your Mapbox public token to render the interactive map. Or use the Demo Preview."
            />
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          {result.topSites.slice(0, 3).map((site, index) => (
            <div key={site.id} className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold mx-auto mb-2">
                {index + 1}
              </div>
              <p className="text-sm font-medium">Score: {site.score.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{site.area.toFixed(1)} ha</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};