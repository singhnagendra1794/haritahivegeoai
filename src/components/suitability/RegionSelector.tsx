import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search,
  Target,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Region {
  type: 'buffer';
  data: {
    center: [number, number];
    radius: number;
    address: string;
  };
  name: string;
}

interface RegionSelectorProps {
  onSelect: (region: Region) => void;
  projectType: string;
}

const getBufferRadius = (projectType: string): number => {
  switch (projectType) {
    case 'Solar Farm':
      return 1.5; // 1.5 km default, can be 1-2km
    case 'Battery Energy Storage (BESS)':
      return 2; // 2 km
    case 'Agriculture':
      return 5; // 5 km
    default:
      return 2;
  }
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelect, projectType }) => {
  const [addressInput, setAddressInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number];
    address: string;
  } | null>(null);
  const { toast } = useToast();

  const bufferRadius = getBufferRadius(projectType);

  const handleGeocode = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Please enter an address",
        description: "Enter an address or coordinates to continue",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      // Check if input looks like coordinates (lat, lon)
      const coordMatch = addressInput.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      
      if (coordMatch) {
        // Input is coordinates
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          const location = {
            coordinates: [lon, lat] as [number, number],
            address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
          };
          setSelectedLocation(location);
          
          toast({
            title: "Location Found",
            description: `Using coordinates: ${location.address}`,
          });
        } else {
          throw new Error('Invalid coordinates');
        }
      } else {
        // Input is an address - use Nominatim for geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1&addressdetails=1`
        );
        
        if (!response.ok) throw new Error('Geocoding failed');
        
        const results = await response.json();
        
        if (results.length === 0) {
          throw new Error('Location not found');
        }
        
        const result = results[0];
        const location = {
          coordinates: [parseFloat(result.lon), parseFloat(result.lat)] as [number, number],
          address: result.display_name
        };
        setSelectedLocation(location);
        
        toast({
          title: "Location Found",
          description: result.display_name,
        });
      }
    } catch (error) {
      toast({
        title: "Geocoding Failed",
        description: "Could not find the specified location. Please try a different address or coordinates.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelect({
        type: 'buffer',
        data: {
          center: selectedLocation.coordinates,
          radius: bufferRadius,
          address: selectedLocation.address
        },
        name: `${bufferRadius}km buffer around ${selectedLocation.address}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Enter Location
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter an address or coordinates to analyze {projectType.toLowerCase()} suitability. 
          We'll automatically create a {bufferRadius}km analysis area around your location.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-forest-primary" />
            Location Input
          </CardTitle>
          <CardDescription>
            System will auto-generate a {bufferRadius}km buffer for {projectType.toLowerCase()} analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Address or Coordinates
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Mumbai, India or 19.0760, 72.8777"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleGeocode}
                  disabled={isGeocoding || !addressInput.trim()}
                >
                  {isGeocoding ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Auto Buffer Generation</h4>
                  <p className="text-sm text-blue-700">
                    Based on your project type, we'll create a {bufferRadius}km radius analysis area. 
                    You can enter city names, full addresses, or latitude,longitude coordinates.
                  </p>
                </div>
              </div>
            </div>

            {selectedLocation && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Location Confirmed</p>
                      <p className="text-sm text-green-700 max-w-md truncate">
                        {selectedLocation.address}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-forest-primary/10 text-forest-primary">
                    {bufferRadius}km Buffer
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Coordinates</p>
                    <p className="font-mono text-sm">
                      {selectedLocation.coordinates[1].toFixed(4)}, {selectedLocation.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Analysis Area</p>
                    <p className="text-sm font-medium">
                      ~{(Math.PI * bufferRadius * bufferRadius).toFixed(1)} km²
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleConfirmLocation}
                  className="w-full bg-forest-primary hover:bg-forest-primary/90"
                  size="lg"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Confirm Location & Create Analysis Area
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};