import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Edit3, 
  MapPin, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { useToast } from '@/hooks/use-toast';

interface Region {
  type: 'polygon' | 'district' | 'shapefile';
  data: any;
  name: string;
}

interface RegionSelectorProps {
  onSelect: (region: Region) => void;
  projectType: string;
}

const sampleDistricts = [
  { id: 'bengaluru-urban', name: 'Bengaluru Urban', state: 'Karnataka' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'delhi', name: 'New Delhi', state: 'Delhi' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
];

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelect, projectType }) => {
  const [selectedTab, setSelectedTab] = useState('draw');
  const [drawnPolygon, setDrawnPolygon] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePolygonDrawn = (polygon: any) => {
    setDrawnPolygon(polygon);
    toast({
      title: "Region Drawn",
      description: "You can now proceed with this region or continue editing.",
    });
  };

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId);
    const district = sampleDistricts.find(d => d.id === districtId);
    if (district) {
      onSelect({
        type: 'district',
        data: { id: districtId, bounds: null }, // In real app, would fetch district boundaries
        name: `${district.name}, ${district.state}`
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.shp') || file.name.endsWith('.zip')) {
        setUploadedFile(file);
        // In real app, would parse the shapefile
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully. Processing shapefile...`,
        });
        
        // Simulate processing
        setTimeout(() => {
          onSelect({
            type: 'shapefile',
            data: { file: file, geometry: null },
            name: file.name
          });
        }, 2000);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a shapefile (.shp) or zipped shapefile (.zip)",
          variant: "destructive",
        });
      }
    }
  };

  const proceedWithDrawnRegion = () => {
    if (drawnPolygon) {
      onSelect({
        type: 'polygon',
        data: drawnPolygon,
        name: 'Custom Drawn Region'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal-primary mb-2">
          Select Region of Interest
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Define the area where you want to analyze {projectType.toLowerCase()} suitability. 
          You can draw on the map, select a district, or upload a shapefile.
        </p>
      </div>

      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-forest-primary" />
            Region Selection
          </CardTitle>
          <CardDescription>
            Choose your preferred method to define the analysis area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draw" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Draw Polygon
              </TabsTrigger>
              <TabsTrigger value="district" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select District
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Shapefile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Drawing Instructions</h4>
                      <p className="text-sm text-blue-700">
                        Click on the map to start drawing a polygon. Click each point to define your region, 
                        then click the first point again to close the polygon.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-96 rounded-lg overflow-hidden border border-border">
                  <InteractiveMap 
                    onPolygonDrawn={handlePolygonDrawn}
                    allowDrawing={true}
                  />
                </div>

                {drawnPolygon && (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Region Defined</p>
                        <p className="text-sm text-green-700">
                          Polygon with {drawnPolygon.coordinates?.[0]?.length || 0} points
                        </p>
                      </div>
                    </div>
                    <Button onClick={proceedWithDrawnRegion}>
                      Use This Region
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="district" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Select District
                  </label>
                  <Select value={selectedDistrict} onValueChange={handleDistrictSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a district..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}, {district.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">District Boundaries</h4>
                      <p className="text-sm text-yellow-700">
                        Administrative boundaries are automatically loaded from our database. 
                        The analysis will cover the entire district area.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Upload Shapefile
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".shp,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <FileText className="w-12 h-12 text-forest-primary mx-auto" />
                        <div>
                          <p className="font-medium text-charcoal-primary">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Badge variant="secondary">Processing...</Badge>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="font-medium text-charcoal-primary">Upload Shapefile</p>
                          <p className="text-sm text-muted-foreground">
                            Drop your .shp file or zipped shapefile here
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Supported Formats</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• ESRI Shapefile (.shp with associated files)</li>
                        <li>• Zipped shapefile containing .shp, .shx, .dbf files</li>
                        <li>• Maximum file size: 50MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};