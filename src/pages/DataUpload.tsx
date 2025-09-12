import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Database, 
  Satellite, 
  CheckCircle, 
  AlertCircle,
  X,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  format: string;
  features?: number;
  bounds?: string;
}

const DataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const supportedFormats = {
    vector: ['GeoJSON', 'Shapefile', 'KML', 'GPX', 'CSV with coordinates'],
    raster: ['GeoTIFF', 'NetCDF', 'HDF5', 'JPEG 2000', 'PNG with world file'],
    database: ['PostGIS', 'SQLite', 'FileGDB', 'MySQL Spatial']
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading',
        progress: 0,
        format: getFileFormat(file.name)
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload process
      simulateUpload(fileId);
    });

    toast({
      title: 'Files Added',
      description: `${files.length} file(s) added to upload queue.`,
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: file.progress + 10 };
          } else if (file.status === 'uploading') {
            return { 
              ...file, 
              status: 'processing',
              progress: 0
            };
          } else if (file.status === 'processing' && file.progress < 100) {
            return { ...file, progress: file.progress + 15 };
          } else {
            clearInterval(interval);
            return { 
              ...file, 
              status: 'success',
              progress: 100,
              features: Math.floor(Math.random() * 1000) + 10,
              bounds: 'Global extent detected'
            };
          }
        }
        return file;
      }));
    }, 500);
  };

  const getFileFormat = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const formatMap: { [key: string]: string } = {
      'geojson': 'GeoJSON',
      'shp': 'Shapefile',
      'kml': 'KML',
      'gpx': 'GPX',
      'csv': 'CSV',
      'tif': 'GeoTIFF',
      'tiff': 'GeoTIFF',
      'nc': 'NetCDF',
      'hdf5': 'HDF5'
    };
    return formatMap[ext || ''] || 'Unknown';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: 'File Removed',
      description: 'File has been removed from the upload queue.',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-primary">Data Upload</h1>
              <p className="text-muted-foreground">Upload and manage your geospatial datasets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="manage">Manage Files</TabsTrigger>
            <TabsTrigger value="connect">Connect Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Geospatial Data</CardTitle>
                <CardDescription>
                  Drag and drop your files or click to browse. Supports multiple formats including vector, raster, and database files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-muted-foreground/25 hover:border-purple-500/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-primary mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Maximum file size: 100MB per file
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Browse Files
                    </Button>
                  </label>
                </div>

                {/* Supported Formats */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div>
                    <h4 className="font-medium text-charcoal-primary mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Vector Data
                    </h4>
                    <div className="space-y-1">
                      {supportedFormats.vector.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs mr-1">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-charcoal-primary mb-3 flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-green-500" />
                      Raster Data
                    </h4>
                    <div className="space-y-1">
                      {supportedFormats.raster.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs mr-1">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-charcoal-primary mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-purple-500" />
                      Database
                    </h4>
                    <div className="space-y-1">
                      {supportedFormats.database.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs mr-1">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Queue */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Queue</CardTitle>
                  <CardDescription>
                    Monitor your file uploads and processing status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              file.status === 'success' ? 'bg-green-500/10' :
                              file.status === 'error' ? 'bg-red-500/10' :
                              'bg-blue-500/10'
                            }`}>
                              {file.status === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : file.status === 'error' ? (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              ) : (
                                <Upload className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-charcoal-primary">{file.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {file.format}
                                </Badge>
                                <span>{formatFileSize(file.size)}</span>
                                {file.features && <span>• {file.features} features</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.status === 'success' && (
                              <>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {file.status !== 'success' && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                {file.status === 'uploading' ? 'Uploading' : 'Processing'}
                              </span>
                              <span className="text-muted-foreground">{file.progress}%</span>
                            </div>
                            <Progress value={file.progress} className="h-2" />
                          </div>
                        )}
                        
                        {file.bounds && (
                          <p className="text-sm text-muted-foreground">{file.bounds}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>
                  View and manage your uploaded datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-primary mb-2">
                    No files uploaded yet
                  </h3>
                  <p className="text-muted-foreground">
                    Upload some files to see them listed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connect" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Connections</CardTitle>
                  <CardDescription>
                    Connect to your existing spatial databases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Database Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgis">PostGIS</SelectItem>
                        <SelectItem value="sqlite">SQLite</SelectItem>
                        <SelectItem value="mysql">MySQL Spatial</SelectItem>
                        <SelectItem value="oracle">Oracle Spatial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Host</Label>
                      <Input placeholder="localhost" />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input placeholder="5432" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Database Name</Label>
                    <Input placeholder="spatial_db" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input placeholder="user" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" placeholder="password" />
                    </div>
                  </div>
                  
                  <Button className="w-full">Test Connection</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Connections</CardTitle>
                  <CardDescription>
                    Connect to external data APIs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select API type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wfs">WFS (Web Feature Service)</SelectItem>
                        <SelectItem value="wms">WMS (Web Map Service)</SelectItem>
                        <SelectItem value="rest">REST API</SelectItem>
                        <SelectItem value="arcgis">ArcGIS Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Endpoint URL</Label>
                    <Input placeholder="https://api.example.com/gis" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Your API key" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Layer/Service</Label>
                    <Input placeholder="layer_name" />
                  </div>
                  
                  <Button className="w-full">Connect to API</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataUpload;