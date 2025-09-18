import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search,
  Target,
  Info,
  Navigation
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

interface EnhancedRegionSelectorProps {
  onSelect: (region: Region) => void;
  projectType: string;
}

const getDefaultBufferRadius = (projectType: string): number => {
  switch (projectType) {
    case 'Solar Farm':
      return 1.5; // 1.5 km default
    case 'Battery Energy Storage (BESS)':
      return 2; // 2 km
    case 'Agriculture':
      return 5; // 5 km
    default:
      return 2;
  }
};

export const EnhancedRegionSelector: React.FC<EnhancedRegionSelectorProps> = ({ onSelect, projectType }) => {
  const [addressInput, setAddressInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number];
    address: string;
    displayAddress?: string;
  } | null>(null);
  const [bufferRadius, setBufferRadius] = useState(getDefaultBufferRadius(projectType));
  const [bufferUnit] = useState('km'); // Future enhancement: allow unit selection
  const { toast } = useToast();

  // Reset buffer radius when project type changes
  useEffect(() => {
    setBufferRadius(getDefaultBufferRadius(projectType));
  }, [projectType]);

  const reverseGeocode = async (coordinates: [number, number]) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const result = await response.json();
      return result.display_name || `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleGeocode = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Please enter an address or coordinates",
        description: "Enter an address or coordinates to continue",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      // Check if input looks like coordinates (lat, lon or lon, lat)
      const coordMatch = addressInput.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      
      if (coordMatch) {
        // Input is coordinates - handle both lat,lon and lon,lat formats
        let lat = parseFloat(coordMatch[1]);
        let lon = parseFloat(coordMatch[2]);
        
        // Auto-detect format: if first number is > 90 or < -90, assume it's longitude first
        if (Math.abs(lat) > 90) {
          [lat, lon] = [lon, lat]; // Swap if longitude came first
        }
        
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          const coordinates: [number, number] = [lon, lat];
          
          // Get address for these coordinates
          const displayAddress = await reverseGeocode(coordinates);
          
          const location = {
            coordinates,
            address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
            displayAddress
          };
          setSelectedLocation(location);
          
          toast({
            title: "Location Found",
            description: displayAddress,
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
          address: result.display_name,
          displayAddress: result.display_name
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
          address: selectedLocation.displayAddress || selectedLocation.address
        },
        name: `${bufferRadius}km buffer around ${selectedLocation.displayAddress || selectedLocation.address}`
      });
    }
  };

  const getBufferArea = () => (Math.PI * bufferRadius * bufferRadius).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Define Analysis Area
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter an address or coordinates, then customize your analysis buffer radius. 
          We'll automatically show the nearest address for coordinates you enter.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-forest-primary" />
            Location & Buffer Setup
          </CardTitle>
          <CardDescription>
            Set your analysis center point and customize the buffer radius
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Address/Coordinate Input */}
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

            {/* Buffer Radius Customization */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Buffer Radius
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={bufferRadius}
                    onChange={(e) => setBufferRadius(parseFloat(e.target.value) || getDefaultBufferRadius(projectType))}
                    className="flex-1"
                  />
                  <Select value={bufferUnit} disabled>
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Default for {projectType}: {getDefaultBufferRadius(projectType)}km
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Analysis Area
                </label>
                <div className="h-10 px-3 py-2 border border-input bg-muted/50 rounded-md flex items-center text-sm">
                  ~{getBufferArea()} km²
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Smart Address Recognition</h4>
                  <p className="text-sm text-blue-700">
                    Enter coordinates in lat,lon or lon,lat format. We'll automatically detect the format 
                    and show you the nearest address using reverse geocoding.
                  </p>
                </div>
              </div>
            </div>

            {selectedLocation && (
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 flex items-center gap-2">
                        Location Confirmed
                        {isReverseGeocoding && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
                        )}
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        {selectedLocation.displayAddress || selectedLocation.address}
                      </p>
                      {selectedLocation.displayAddress && selectedLocation.address !== selectedLocation.displayAddress && (
                        <p className="text-xs text-green-600 mt-1 font-mono">
                          {selectedLocation.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-forest-primary/10 text-forest-primary">
                    {bufferRadius}km Buffer
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Coordinates</p>
                    <p className="font-mono text-sm">
                      {selectedLocation.coordinates[1].toFixed(4)}, {selectedLocation.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Buffer Radius</p>
                    <p className="text-sm font-medium">
                      {bufferRadius} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Analysis Area</p>
                    <p className="text-sm font-medium">
                      ~{getBufferArea()} km²
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleConfirmLocation}
                  className="w-full bg-forest-primary hover:bg-forest-primary/90"
                  size="lg"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Confirm Location & Continue to Factor Selection
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};