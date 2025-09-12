import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DataIngestionWorkflow = () => {
  const dataSourceTypes = [
    {
      type: "Vector Data",
      icon: "📍",
      sources: ["Shapefile", "GeoJSON", "KML/KMZ", "PostGIS", "WFS Endpoints"],
      processing: ["Coordinate reprojection", "Topology validation", "Attribute standardization"],
      storage: "PostGIS tables with spatial indexing",
      priority: "Phase 1"
    },
    {
      type: "Raster Data", 
      icon: "🗺️",
      sources: ["GeoTIFF", "NetCDF", "HDF5", "WMS Endpoints", "COG (Cloud Optimized GeoTIFF)"],
      processing: ["Tiling (XYZ/TMS)", "Compression", "Overview generation", "CRS transformation"],
      storage: "Object storage + PostGIS metadata",
      priority: "Phase 1"
    },
    {
      type: "Satellite Imagery",
      icon: "🛰️", 
      sources: ["Sentinel Hub", "Landsat", "Planet Labs", "Maxar", "Custom satellite providers"],
      processing: ["Atmospheric correction", "Mosaic creation", "Multi-temporal stacking", "Tile pyramid generation"],
      storage: "Object storage (S3/MinIO) + Tile server",
      priority: "Phase 2"
    },
    {
      type: "IoT Telemetry",
      icon: "📡",
      sources: ["MQTT brokers", "HTTP/REST APIs", "WebSocket streams", "LoRaWAN gateways"],
      processing: ["Real-time validation", "Time-series aggregation", "Outlier detection", "Geofencing"],
      storage: "InfluxDB + PostGIS for spatial queries",
      priority: "Phase 2"
    },
    {
      type: "Crowdsourced Data",
      icon: "👥",
      sources: ["Mobile apps", "Web forms", "OpenStreetMap", "Social media APIs", "Citizen science platforms"],
      processing: ["Quality scoring", "Duplicate detection", "Community validation", "Privacy filtering"],
      storage: "PostGIS with user attribution",
      priority: "Phase 3"
    }
  ];

  const ingestionTools = {
    openSource: [
      { name: "Apache Airflow", use: "Workflow orchestration", type: "Orchestration" },
      { name: "Apache Kafka", use: "Stream processing", type: "Streaming" },
      { name: "GDAL/OGR", use: "Format conversion", type: "Processing" },
      { name: "PostGIS", use: "Spatial database", type: "Storage" },
      { name: "GeoServer", use: "OGC services", type: "API" },
      { name: "STAC (SpatioTemporal Asset Catalog)", use: "Metadata catalog", type: "Metadata" }
    ],
    cloud: [
      { name: "AWS Glue", use: "ETL service", type: "Processing" },
      { name: "Google Earth Engine", use: "Satellite processing", type: "Processing" },
      { name: "Azure Stream Analytics", use: "IoT processing", type: "Streaming" },
      { name: "AWS S3", use: "Object storage", type: "Storage" },
      { name: "BigQuery GIS", use: "Analytics", type: "Analytics" }
    ]
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold">Data Ingestion & Storage Workflow</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Comprehensive pipeline for ingesting, processing, and storing multi-modal geospatial data at scale
            </p>
          </div>

          {/* Data Flow Diagram */}
          <Card className="p-8 mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">End-to-End Data Flow Architecture</h3>
            <div className="bg-muted/20 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                <div className="space-y-3">
                  <div className="bg-geo-primary/20 p-4 rounded-lg border border-geo-primary/30">
                    <h4 className="font-semibold mb-2 text-geo-primary">Data Sources</h4>
                    <div className="text-xs space-y-1">
                      <div>📍 Vector</div>
                      <div>🗺️ Raster</div>
                      <div>🛰️ Satellite</div>
                      <div>📡 IoT Streams</div>
                      <div>👥 Crowdsourced</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-2xl text-geo-primary">→</div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-geo-secondary/20 p-4 rounded-lg border border-geo-secondary/30">
                    <h4 className="font-semibold mb-2 text-geo-secondary">ETL Pipeline</h4>
                    <div className="text-xs space-y-1">
                      <div>🔄 Transformation</div>
                      <div>🧹 Validation</div>
                      <div>🗂️ Standardization</div>
                      <div>🔍 Quality Control</div>
                      <div>📊 Metadata</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-2xl text-geo-secondary">→</div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-geo-accent/20 p-4 rounded-lg border border-geo-accent/30">
                    <h4 className="font-semibold mb-2 text-geo-accent">Storage Layer</h4>
                    <div className="text-xs space-y-1">
                      <div>🗄️ PostGIS</div>
                      <div>☁️ Object Storage</div>
                      <div>📈 Time Series DB</div>
                      <div>🔍 Vector DB</div>
                      <div>💾 Cache Layer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Source Details */}
          <div className="mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">Data Source Connectors & Processing</h3>
            <div className="grid gap-6">
              {dataSourceTypes.map((source, index) => (
                <Card key={index} className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{source.icon}</span>
                        <h4 className="font-semibold">{source.type}</h4>
                        <Badge variant="outline" className="text-xs">{source.priority}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Sources:</strong>
                        <ul className="mt-1 space-y-1">
                          {source.sources.map((src, i) => (
                            <li key={i} className="text-xs">• {src}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <strong>Processing Steps:</strong>
                      <ul className="mt-1 space-y-1">
                        {source.processing.map((step, i) => (
                          <li key={i} className="text-xs">• {step}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <strong>Storage Strategy:</strong>
                      <p className="text-xs mt-1">{source.storage}</p>
                    </div>
                    
                    <div className="text-sm">
                      <div className="bg-muted/30 p-3 rounded text-xs">
                        <strong>Key Considerations:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Scalability patterns</li>
                          <li>• Data quality metrics</li>
                          <li>• Performance optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack Tabs */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Ingestion Tools & Technologies</h3>
            <Tabs defaultValue="opensource" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="opensource">Open Source First</TabsTrigger>
                <TabsTrigger value="cloud">Cloud Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="opensource" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ingestionTools.openSource.map((tool, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{tool.name}</h4>
                        <Badge variant="secondary" className="text-xs">{tool.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.use}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="cloud" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ingestionTools.cloud.map((tool, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{tool.name}</h4>
                        <Badge variant="secondary" className="text-xs">{tool.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.use}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Storage Architecture */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Storage Architecture & Schemas</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Storage Layer Distribution</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-geo-primary pl-4">
                    <h5 className="font-medium">PostGIS Database</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vector geometries, spatial relationships, metadata tables, user management
                    </p>
                  </div>
                  <div className="border-l-4 border-geo-secondary pl-4">
                    <h5 className="font-medium">Object Storage (S3/MinIO)</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Raster files, satellite imagery, large datasets, processed tiles
                    </p>
                  </div>
                  <div className="border-l-4 border-geo-accent pl-4">
                    <h5 className="font-medium">Time Series (InfluxDB)</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      IoT sensor data, temporal measurements, real-time analytics
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h5 className="font-medium">Vector Database (Qdrant)</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      ML embeddings, similarity search, AI-generated features
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Backup & Recovery Strategy</h4>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Point-in-time recovery</span>
                    <Badge variant="outline">Daily</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Incremental backups</span>
                    <Badge variant="outline">Hourly</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cross-region replication</span>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disaster recovery testing</span>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sample Schemas & APIs */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Sample Schemas & API Endpoints</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="geojson">
                <AccordionTrigger>GeoJSON Feature Schema</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "type": "Feature",
  "id": "uuid-v4-identifier",
  "geometry": {
    "type": "Point|Polygon|LineString",
    "coordinates": [longitude, latitude]
  },
  "properties": {
    "name": "Feature name",
    "category": "land_use|infrastructure|poi",
    "source": "satellite|survey|crowdsourced",
    "confidence": 0.95,
    "timestamp": "2024-01-15T10:30:00Z",
    "attributes": {
      "custom_field_1": "value",
      "custom_field_2": 123.45
    },
    "metadata": {
      "collection_method": "automated|manual",
      "quality_score": 0.88,
      "validation_status": "pending|approved|rejected"
    }
  }
}`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="raster">
                <AccordionTrigger>Raster Metadata Schema</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "id": "raster-dataset-uuid",
  "name": "Sentinel-2 L2A Collection",
  "type": "satellite_imagery",
  "spatial_reference": "EPSG:4326",
  "extent": {
    "xmin": -180, "ymin": -90,
    "xmax": 180, "ymax": 90
  },
  "resolution": {
    "x": 10, "y": 10, "unit": "meters"
  },
  "temporal": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z",
    "frequency": "daily"
  },
  "bands": [
    {"name": "B04", "wavelength": "665nm", "description": "Red"},
    {"name": "B08", "wavelength": "842nm", "description": "NIR"}
  ],
  "storage": {
    "format": "COG",
    "compression": "JPEG",
    "tile_size": [512, 512],
    "overview_levels": [2, 4, 8, 16]
  }
}`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="iot">
                <AccordionTrigger>IoT Telemetry Schema</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "device_id": "sensor-001",
  "timestamp": "2024-01-15T10:30:00.123Z",
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude],
    "accuracy": 5.2
  },
  "measurements": {
    "temperature": {"value": 23.5, "unit": "celsius"},
    "humidity": {"value": 65.2, "unit": "percent"},
    "air_quality": {"pm2_5": 12.3, "pm10": 18.7}
  },
  "device_info": {
    "model": "EnviroSensor-Pro",
    "firmware": "v2.1.3",
    "battery_level": 87
  },
  "quality_flags": {
    "calibration_status": "valid",
    "data_completeness": 1.0,
    "anomaly_score": 0.02
  }
}`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="apis">
                <AccordionTrigger>OGC Service Endpoints</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">WFS (Web Feature Service)</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs">
GET /geoserver/haritahive/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=land_parcels&outputFormat=application/json
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">WMS (Web Map Service)</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs">
GET /geoserver/haritahive/ows?service=WMS&version=1.3.0&request=GetMap&layers=satellite_imagery&styles=&bbox=-180,-90,180,90&crs=EPSG:4326&format=image/png&width=512&height=512
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">STAC API (SpatioTemporal Asset Catalog)</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs">
GET /stac/collections/sentinel-2/items?bbox=-122.4,37.7,-122.3,37.8&datetime=2024-01-01T00:00:00Z/2024-01-31T23:59:59Z
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Implementation Phases */}
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Prioritized Implementation Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-primary mb-2">
                    1
                  </div>
                  <h4 className="font-semibold text-geo-primary">Phase 1: Foundation (Weeks 1-4)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Core Infrastructure</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• PostGIS setup & spatial extensions</li>
                      <li>• MinIO object storage</li>
                      <li>• Apache Airflow orchestration</li>
                      <li>• Basic ETL pipelines</li>
                    </ul>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Data Sources</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Vector data ingestion (Shapefile, GeoJSON)</li>
                      <li>• Basic raster support (GeoTIFF)</li>
                      <li>• Metadata schema definition</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-secondary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-secondary mb-2">
                    2
                  </div>
                  <h4 className="font-semibold text-geo-secondary">Phase 2: Expansion (Weeks 5-8)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Advanced Processing</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Satellite imagery pipelines</li>
                      <li>• IoT streaming with Kafka</li>
                      <li>• InfluxDB time-series storage</li>
                      <li>• Tile generation services</li>
                    </ul>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Quality & Validation</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Data quality metrics</li>
                      <li>• Automated validation rules</li>
                      <li>• Error handling & retry logic</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-accent/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-accent mb-2">
                    3
                  </div>
                  <h4 className="font-semibold text-geo-accent">Phase 3: Scale (Weeks 9-12)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Crowdsourced & Social</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Community data validation</li>
                      <li>• Social media data ingestion</li>
                      <li>• Mobile app integration</li>
                      <li>• Privacy compliance tools</li>
                    </ul>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Enterprise Features</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Multi-tenant isolation</li>
                      <li>• Advanced backup strategies</li>
                      <li>• Performance optimization</li>
                      <li>• Cloud migration options</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DataIngestionWorkflow;