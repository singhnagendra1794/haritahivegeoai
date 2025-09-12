import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  LayoutDashboard, 
  Users, 
  Download, 
  Database, 
  Shield,
  Layers,
  MousePointer,
  Eye,
  FileText,
  Image,
  BarChart3,
  Globe,
  Settings,
  Play,
  Upload
} from "lucide-react";

const GeoDashboard = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Interactive GeoDashboard Module
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            One-click custom dashboards and maps with advanced visualization, authentication, and export capabilities
          </p>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="frontend">Frontend Stack</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="tileserving">Tile Serving</TabsTrigger>
            <TabsTrigger value="userflow">User Flow</TabsTrigger>
            <TabsTrigger value="wireframes">UI/UX</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard Architecture
                  </CardTitle>
                  <CardDescription>
                    Modular component-based dashboard system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Core Components</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• DashboardCanvas - Drag & drop layout</li>
                      <li>• MapWidget - Interactive map container</li>
                      <li>• ChartWidget - Statistical visualizations</li>
                      <li>• FilterPanel - Dynamic data filtering</li>
                      <li>• LegendController - Layer management</li>
                      <li>• ExportManager - Multi-format exports</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Component Tree</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`GeoDashboard
├── DashboardHeader
│   ├── TitleBar
│   ├── ActionToolbar
│   └── ExportDropdown
├── DashboardCanvas
│   ├── GridLayout
│   ├── MapWidget[]
│   ├── ChartWidget[]
│   └── InfoWidget[]
└── SidePanel
    ├── LayerManager
    ├── FilterControls
    └── SettingsPanel`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Layout System
                  </CardTitle>
                  <CardDescription>
                    Responsive grid-based dashboard layouts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Layout Options</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• React Grid Layout - Draggable widgets</li>
                      <li>• CSS Grid - Responsive breakpoints</li>
                      <li>• Flexbox - Dynamic sizing</li>
                      <li>• Custom Templates - Pre-built layouts</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Layout Configuration</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`const layouts = {
  lg: [
    { i: 'map', x: 0, y: 0, w: 8, h: 6 },
    { i: 'chart1', x: 8, y: 0, w: 4, h: 3 },
    { i: 'chart2', x: 8, y: 3, w: 4, h: 3 },
    { i: 'filters', x: 0, y: 6, w: 12, h: 2 }
  ],
  md: [...],
  sm: [...]
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Capabilities
                  </CardTitle>
                  <CardDescription>
                    Multi-format dashboard and data exports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="outline">Image Formats</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• PNG - High quality raster</li>
                        <li>• SVG - Vector graphics</li>
                        <li>• WebP - Compressed images</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">Data Formats</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• CSV - Tabular data</li>
                        <li>• GeoJSON - Spatial data</li>
                        <li>• PDF - Reports</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Export Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Export service
class DashboardExporter {
  async exportToPNG(dashboard) {
    const canvas = await html2canvas(dashboard);
    return canvas.toDataURL('image/png');
  }
  
  async exportToPDF(dashboard, data) {
    const pdf = new jsPDF();
    // Add dashboard screenshot
    // Add data tables
    return pdf.output('blob');
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Integration
                  </CardTitle>
                  <CardDescription>
                    Seamless dataset integration and management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Data Sources</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• PostGIS databases</li>
                      <li>• REST APIs (GeoJSON)</li>
                      <li>• File uploads (Shapefile, GeoPackage)</li>
                      <li>• OGC services (WMS, WFS, WMTS)</li>
                      <li>• Streaming data feeds</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Data Adapter Pattern</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`interface DataAdapter {
  connect(config: DataSourceConfig): Promise<void>;
  query(params: QueryParams): Promise<GeoData>;
  subscribe?(callback: DataCallback): void;
}

class PostGISAdapter implements DataAdapter {
  async query(params) {
    const { data } = await supabase
      .from('spatial_data')
      .select('*')
      .overlaps('geom', params.bbox);
    return transformToGeoJSON(data);
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frontend">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Leaflet
                  </CardTitle>
                  <CardDescription>
                    Lightweight, mobile-friendly mapping
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Recommended for: Basic mapping
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">Pros</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Small bundle size (~150KB)</li>
                      <li>• Extensive plugin ecosystem</li>
                      <li>• Easy to learn and implement</li>
                      <li>• Great mobile performance</li>
                      <li>• Strong community support</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600">Cons</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Limited 3D capabilities</li>
                      <li>• Canvas rendering only</li>
                      <li>• No built-in clustering for large datasets</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

// Add GeoJSON layer
L.geoJSON(geoData, {
  style: feature => ({
    fillColor: getColor(feature.properties.value),
    weight: 2,
    opacity: 1,
    fillOpacity: 0.7
  })
}).addTo(map);`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Mapbox GL JS
                  </CardTitle>
                  <CardDescription>
                    Vector-based, GPU-accelerated mapping
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Recommended for: Performance & styling
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">Pros</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Vector tile rendering</li>
                      <li>• GPU acceleration</li>
                      <li>• Advanced styling capabilities</li>
                      <li>• 3D terrain and buildings</li>
                      <li>• Smooth animations</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600">Cons</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Requires API key</li>
                      <li>• Larger bundle size (~500KB)</li>
                      <li>• Steeper learning curve</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'your-token';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-74.5, 40],
  zoom: 9
});

// Add data source and layer
map.addSource('data', {
  type: 'geojson',
  data: geoData
});

map.addLayer({
  id: 'data-layer',
  type: 'fill',
  source: 'data',
  paint: {
    'fill-color': ['get', 'color'],
    'fill-opacity': 0.8
  }
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Kepler.gl
                  </CardTitle>
                  <CardDescription>
                    Advanced geospatial data visualization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Recommended for: Big data visualization
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">Pros</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Built for large datasets</li>
                      <li>• Multiple visualization types</li>
                      <li>• Time-based animations</li>
                      <li>• 3D visualizations</li>
                      <li>• No-code interface</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600">Cons</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Large bundle size (~2MB)</li>
                      <li>• Less customizable UI</li>
                      <li>• Opinionated design</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';

const App = () => {
  const [keplerGl, setKeplerGl] = useState(null);
  
  useEffect(() => {
    if (keplerGl) {
      keplerGl.dispatch(addDataToMap({
        datasets: {
          info: { label: 'My Dataset', id: 'data' },
          data: geoData
        },
        config: mapConfig
      }));
    }
  }, [keplerGl, geoData]);

  return <KeplerGl ref={setKeplerGl} />;
};`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Visualization Components
                  </CardTitle>
                  <CardDescription>
                    Supporting libraries for charts and UI components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Chart Libraries</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">Recharts</h5>
                            <p className="text-sm text-muted-foreground">React-native charting</p>
                          </div>
                          <Badge variant="outline">Recommended</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">D3.js</h5>
                            <p className="text-sm text-muted-foreground">Custom visualizations</p>
                          </div>
                          <Badge variant="secondary">Advanced</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">Chart.js</h5>
                            <p className="text-sm text-muted-foreground">Canvas-based charts</p>
                          </div>
                          <Badge variant="outline">Alternative</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">UI Components</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">React Grid Layout</h5>
                            <p className="text-sm text-muted-foreground">Draggable grid system</p>
                          </div>
                          <Badge variant="outline">Core</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">React DnD</h5>
                            <p className="text-sm text-muted-foreground">Drag and drop</p>
                          </div>
                          <Badge variant="outline">Core</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">Shadcn UI</h5>
                            <p className="text-sm text-muted-foreground">Design system</p>
                          </div>
                          <Badge variant="outline">UI</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    JWT Authentication
                  </CardTitle>
                  <CardDescription>
                    Stateless token-based authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Token Structure</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Header: Algorithm & token type</li>
                      <li>• Payload: User claims & permissions</li>
                      <li>• Signature: Security verification</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">JWT Payload Example</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "sub": "user123",
  "email": "user@example.com",
  "role": "analyst",
  "permissions": [
    "dashboard:read",
    "dashboard:create",
    "data:read"
  ],
  "org_id": "org456",
  "exp": 1735689600,
  "iat": 1735603200
}`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Auth Service</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`class AuthService {
  async login(credentials) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const { token } = await response.json();
    localStorage.setItem('auth_token', token);
    return this.decodeToken(token);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return { Authorization: \`Bearer \${token}\` };
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    RBAC System
                  </CardTitle>
                  <CardDescription>
                    Role-based access control for dashboards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Permission Matrix</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="font-semibold">Role</div>
                      <div className="font-semibold">Dashboard</div>
                      <div className="font-semibold">Data</div>
                      
                      <div>Viewer</div>
                      <div className="text-green-600">Read</div>
                      <div className="text-green-600">Read</div>
                      
                      <div>Analyst</div>
                      <div className="text-green-600">Read, Create</div>
                      <div className="text-green-600">Read, Query</div>
                      
                      <div>Admin</div>
                      <div className="text-green-600">Full Access</div>
                      <div className="text-green-600">Full Access</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Permission Check</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (resource, action) => {
    return user?.permissions?.includes(\`\${resource}:\${action}\`);
  };

  const canAccessDashboard = (dashboardId) => {
    return hasPermission('dashboard', 'read') || 
           user?.owned_dashboards?.includes(dashboardId);
  };

  return { hasPermission, canAccessDashboard };
};`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Protected Route</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`const ProtectedRoute = ({ children, permission }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(...permission.split(':'))) {
    return <UnauthorizedPage />;
  }
  
  return children;
};

// Usage
<ProtectedRoute permission="dashboard:create">
  <DashboardBuilder />
</ProtectedRoute>`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Authentication Flow
                  </CardTitle>
                  <CardDescription>
                    Complete authentication and authorization workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
{`sequenceDiagram
    participant Client
    participant AuthAPI
    participant JWT
    participant Dashboard
    participant TileServer

    Client->>AuthAPI: POST /login (credentials)
    AuthAPI->>JWT: Create token with permissions
    JWT-->>AuthAPI: Signed JWT
    AuthAPI-->>Client: Return JWT token

    Client->>Dashboard: GET /dashboard (Bearer token)
    Dashboard->>JWT: Verify token & extract permissions
    JWT-->>Dashboard: Valid user + permissions
    Dashboard-->>Client: Dashboard data (filtered by permissions)

    Client->>TileServer: GET /tiles/{z}/{x}/{y} (Bearer token)
    TileServer->>JWT: Verify token
    JWT-->>TileServer: Valid user
    TileServer-->>Client: Map tiles

    Note over Client: Token expires after 1 hour
    
    Client->>AuthAPI: POST /refresh (refresh token)
    AuthAPI-->>Client: New JWT token`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tileserving">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Tile Server Architecture
                  </CardTitle>
                  <CardDescription>
                    High-performance tile serving for large datasets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Server Components</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Tile Generator (PostGIS → Vector tiles)</li>
                      <li>• Cache Layer (Redis/Memcached)</li>
                      <li>• CDN Distribution (CloudFront/Cloudflare)</li>
                      <li>• Load Balancer (Nginx/HAProxy)</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Tile Endpoint</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Express.js tile server
app.get('/tiles/:layer/:z/:x/:y.mvt', async (req, res) => {
  const { layer, z, x, y } = req.params;
  const cacheKey = \`tile:\${layer}:\${z}:\${x}:\${y}\`;
  
  // Check cache first
  let tile = await redis.get(cacheKey);
  
  if (!tile) {
    // Generate tile from PostGIS
    tile = await generateVectorTile(layer, z, x, y);
    await redis.setex(cacheKey, 3600, tile);
  }
  
  res.set('Content-Type', 'application/x-protobuf');
  res.set('Content-Encoding', 'gzip');
  res.send(tile);
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    PostGIS Integration
                  </CardTitle>
                  <CardDescription>
                    Spatial database optimization for tile generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Optimization Strategies</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Spatial indexes (GIST)</li>
                      <li>• Generalization by zoom level</li>
                      <li>• Pre-computed aggregations</li>
                      <li>• Materialized views</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Tile Query</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- Vector tile generation query
SELECT ST_AsMVT(tile.*)
FROM (
  SELECT 
    id,
    name,
    ST_AsMVTGeom(
      CASE 
        WHEN $4 < 10 THEN ST_Simplify(geom, $4 * 10)
        ELSE geom
      END,
      ST_TileEnvelope($1, $2, $3),
      4096,
      256,
      true
    ) AS geom
  FROM spatial_data
  WHERE ST_Intersects(
    geom, 
    ST_TileEnvelope($1, $2, $3)
  )
) AS tile;`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Caching Strategy
                  </CardTitle>
                  <CardDescription>
                    Multi-layer caching for optimal performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Cache Layers</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Browser Cache</span>
                        <Badge variant="outline">1 day</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">CDN Cache</span>
                        <Badge variant="outline">7 days</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Redis Cache</span>
                        <Badge variant="outline">1 hour</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">File System</span>
                        <Badge variant="outline">Permanent</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Cache Configuration</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`const cacheConfig = {
  // Browser cache headers
  browserCache: {
    'Cache-Control': 'public, max-age=86400',
    'ETag': 'tile-version-hash'
  },
  
  // Redis cache
  redis: {
    host: 'redis-cluster',
    keyPrefix: 'tiles:',
    ttl: 3600
  },
  
  // CDN settings
  cdn: {
    provider: 'cloudflare',
    zones: ['global', 'eu', 'us'],
    purgeOnUpdate: true
  }
};`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Performance Monitoring
                  </CardTitle>
                  <CardDescription>
                    Real-time tile server performance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">Key Metrics</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Response time (p95)</li>
                        <li>• Cache hit ratio</li>
                        <li>• Tiles/second throughput</li>
                        <li>• Error rate</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Alerts</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Response time &gt; 500ms</li>
                        <li>• Cache hit &lt; 80%</li>
                        <li>• Error rate &gt; 1%</li>
                        <li>• Queue depth &gt; 100</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Monitoring Setup</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Prometheus metrics
const promClient = require('prom-client');

const tileRequestDuration = new promClient.Histogram({
  name: 'tile_request_duration_seconds',
  help: 'Duration of tile requests',
  labelNames: ['layer', 'zoom_level', 'cache_status']
});

const cacheHitRatio = new promClient.Gauge({
  name: 'tile_cache_hit_ratio',
  help: 'Ratio of cache hits to total requests'
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="userflow">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5" />
                    One-Click Dashboard Creation
                  </CardTitle>
                  <CardDescription>
                    Automated dashboard generation from dataset analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">1. Upload Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload CSV, GeoJSON, or connect to database
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Eye className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">2. Auto-Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        AI analyzes data structure and spatial properties
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">3. Generate Layout</h4>
                      <p className="text-sm text-muted-foreground">
                        Create optimal dashboard layout automatically
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">4. Customize</h4>
                      <p className="text-sm text-muted-foreground">
                        Fine-tune widgets, colors, and interactions
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Dataset Analysis Algorithm</h4>
                    <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
{`class DatasetAnalyzer {
  async analyzeDataset(data) {
    const analysis = {
      rowCount: data.length,
      columns: this.analyzeColumns(data),
      spatial: this.detectSpatialData(data),
      temporal: this.detectTemporalData(data),
      categorical: this.identifyCategorical(data),
      numerical: this.identifyNumerical(data)
    };
    
    return this.generateDashboardConfig(analysis);
  }
  
  generateDashboardConfig(analysis) {
    const widgets = [];
    
    // Add map if spatial data detected
    if (analysis.spatial.hasGeometry) {
      widgets.push({
        type: 'map',
        position: { x: 0, y: 0, w: 8, h: 6 },
        config: {
          layers: analysis.spatial.layers,
          defaultView: analysis.spatial.bounds
        }
      });
    }
    
    // Add charts for numerical data
    analysis.numerical.forEach((column, index) => {
      widgets.push({
        type: 'histogram',
        position: { x: 8, y: index * 3, w: 4, h: 3 },
        config: {
          field: column.name,
          bins: this.calculateOptimalBins(column.values)
        }
      });
    });
    
    return { widgets, filters: analysis.categorical };
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Complete User Journey
                  </CardTitle>
                  <CardDescription>
                    Step-by-step user interaction flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Data Input Phase</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                            <div>
                              <h5 className="font-medium">Choose Data Source</h5>
                              <p className="text-sm text-muted-foreground">Upload file, connect database, or paste URL</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                            <div>
                              <h5 className="font-medium">Data Validation</h5>
                              <p className="text-sm text-muted-foreground">System validates format and structure</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                            <div>
                              <h5 className="font-medium">Preview Sample</h5>
                              <p className="text-sm text-muted-foreground">Show first 100 rows for confirmation</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Dashboard Generation</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                            <div>
                              <h5 className="font-medium">AI Analysis</h5>
                              <p className="text-sm text-muted-foreground">Automatic data profiling and visualization selection</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                            <div>
                              <h5 className="font-medium">Layout Generation</h5>
                              <p className="text-sm text-muted-foreground">Create responsive dashboard layout</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">6</div>
                            <div>
                              <h5 className="font-medium">Widget Population</h5>
                              <p className="text-sm text-muted-foreground">Add maps, charts, and filters</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">User Flow Diagram</h4>
                      <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
{`flowchart TD
    A[Start] --&gt; B{Data Source?}
    B --&gt;|Upload| C[File Upload]
    B --&gt;|Database| D[Connection Form]
    B --&gt;|URL| E[API Endpoint]
    
    C --&gt; F[Validate Data]
    D --&gt; F
    E --&gt; F
    
    F --&gt; G{Valid?}
    G --&gt;|No| H[Show Errors]
    G --&gt;|Yes| I[Data Preview]
    
    H --&gt; B
    I --&gt; J[User Confirms]
    J --&gt; K[AI Analysis]
    
    K --&gt; L[Generate Widgets]
    L --&gt; M[Create Layout]
    M --&gt; N[Render Dashboard]
    
    N --&gt; O[User Reviews]
    O --&gt; P{Satisfied?}
    P --&gt;|No| Q[Manual Customization]
    P --&gt;|Yes| R[Save Dashboard]
    
    Q --&gt; N
    R --&gt; S[Success Page]`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wireframes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Dashboard Builder Interface
                  </CardTitle>
                  <CardDescription>
                    Wireframes and UI components for dashboard creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Main Dashboard View</h4>
                      <div className="border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg space-y-2">
                        <div className="h-8 bg-muted/50 rounded flex items-center px-3">
                          <div className="w-4 h-4 bg-primary/30 rounded mr-2"></div>
                          <span className="text-sm">Dashboard Title</span>
                          <div className="ml-auto flex gap-2">
                            <div className="w-6 h-6 bg-muted rounded"></div>
                            <div className="w-6 h-6 bg-muted rounded"></div>
                            <div className="w-6 h-6 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-2/3 h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                            <Map className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                          <div className="w-1/3 space-y-2">
                            <div className="h-24 bg-muted/30 rounded-lg flex items-center justify-center">
                              <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="h-22 bg-muted/30 rounded-lg flex items-center justify-center">
                              <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          </div>
                        </div>
                        <div className="h-16 bg-muted/30 rounded-lg flex items-center px-4">
                          <span className="text-sm text-muted-foreground">Filter Controls</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Widget Library Panel</h4>
                      <div className="border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg space-y-3">
                        <div className="text-sm font-medium text-muted-foreground">Available Widgets</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 border rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30">
                            <Map className="h-6 w-6" />
                            <span className="text-xs">Map</span>
                          </div>
                          <div className="p-3 border rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30">
                            <BarChart3 className="h-6 w-6" />
                            <span className="text-xs">Bar Chart</span>
                          </div>
                          <div className="p-3 border rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30">
                            <FileText className="h-6 w-6" />
                            <span className="text-xs">Table</span>
                          </div>
                          <div className="p-3 border rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30">
                            <Settings className="h-6 w-6" />
                            <span className="text-xs">Filter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Data Source Selection</h4>
                      <div className="border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg space-y-4">
                        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">Drag & drop files here</p>
                          <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">or</div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">
                            <Database className="h-4 w-4 mr-2" />
                            Database
                          </Button>
                          <Button variant="outline" size="sm">
                            <Globe className="h-4 w-4 mr-2" />
                            API URL
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Export Options</h4>
                      <div className="border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg space-y-3">
                        <div className="text-sm font-medium text-muted-foreground">Export Formats</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              <span className="text-sm">PNG Image</span>
                            </div>
                            <Button size="sm" variant="outline">Export</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">PDF Report</span>
                            </div>
                            <Button size="sm" variant="outline">Export</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4" />
                              <span className="text-sm">CSV Data</span>
                            </div>
                            <Button size="sm" variant="outline">Export</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5" />
                    Interactive Elements
                  </CardTitle>
                  <CardDescription>
                    User interaction patterns and micro-interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Drag & Drop</h4>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Widget Placement</div>
                          <p className="text-xs text-muted-foreground mt-1">Drag widgets from library to canvas</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Layout Adjustment</div>
                          <p className="text-xs text-muted-foreground mt-1">Resize and reposition widgets</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Data Field Mapping</div>
                          <p className="text-xs text-muted-foreground mt-1">Drag fields to widget properties</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Contextual Menus</h4>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Widget Options</div>
                          <p className="text-xs text-muted-foreground mt-1">Right-click for settings, delete, clone</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Data Actions</div>
                          <p className="text-xs text-muted-foreground mt-1">Filter, sort, aggregate options</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Export Menu</div>
                          <p className="text-xs text-muted-foreground mt-1">Format selection and settings</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Real-time Feedback</h4>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Live Preview</div>
                          <p className="text-xs text-muted-foreground mt-1">Instant visualization updates</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Validation Messages</div>
                          <p className="text-xs text-muted-foreground mt-1">Data format and compatibility alerts</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-muted/10">
                          <div className="text-sm font-medium">Progress Indicators</div>
                          <p className="text-xs text-muted-foreground mt-1">Loading states for data operations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            Start Building Your GeoDashboard
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GeoDashboard;