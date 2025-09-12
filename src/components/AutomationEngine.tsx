import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AutomationEngine = () => {
  const workflowTemplates = [
    {
      name: "Buffer Analysis Workflow",
      icon: "🔍",
      description: "Automated buffer analysis with multiple distance zones and impact assessment",
      steps: [
        "Load vector data sources",
        "Validate geometries",
        "Create buffer zones (100m, 500m, 1km)",
        "Perform intersection analysis",
        "Calculate area statistics",
        "Generate impact report"
      ],
      inputs: ["Points/Lines layer", "Buffer distances", "Analysis polygons"],
      outputs: ["Buffer zones", "Intersection results", "Statistical report"],
      use_cases: ["Environmental impact assessment", "Site planning", "Proximity analysis"]
    },
    {
      name: "Zonal Statistics Pipeline",
      icon: "📊",
      description: "Automated extraction of statistics from raster data within defined zones",
      steps: [
        "Load raster datasets",
        "Load zone polygons",
        "Validate CRS alignment",
        "Extract zonal statistics",
        "Calculate derived metrics",
        "Export results to database"
      ],
      inputs: ["Raster data", "Zone polygons", "Statistics parameters"],
      outputs: ["Zonal statistics table", "Summary statistics", "Visualization charts"],
      use_cases: ["Land cover analysis", "Climate data processing", "Resource assessment"]
    },
    {
      name: "Hotspot Detection Workflow",
      icon: "🔥",
      description: "Automated spatial clustering and hotspot identification using statistical methods",
      steps: [
        "Load point data",
        "Data quality validation",
        "Spatial clustering (DBSCAN)",
        "Hotspot analysis (Getis-Ord Gi*)",
        "Significance testing",
        "Generate hotspot maps"
      ],
      inputs: ["Point features", "Clustering parameters", "Significance threshold"],
      outputs: ["Cluster assignments", "Hotspot polygons", "Statistical results"],
      use_cases: ["Crime analysis", "Disease outbreak detection", "Event clustering"]
    }
  ];

  const workflowComponents = [
    {
      category: "Data Sources",
      icon: "📂",
      components: [
        { name: "File Loader", type: "input", formats: ["Shapefile", "GeoJSON", "GeoTIFF", "CSV"] },
        { name: "Database Reader", type: "input", sources: ["PostGIS", "MongoDB", "SQLite"] },
        { name: "API Connector", type: "input", apis: ["WFS", "WMS", "REST APIs"] },
        { name: "Stream Reader", type: "input", streams: ["Kafka", "IoT sensors"] }
      ]
    },
    {
      category: "Processing",
      icon: "⚙️",
      components: [
        { name: "Buffer Analysis", type: "process", operations: ["Fixed distance", "Variable distance", "Multi-ring"] },
        { name: "Overlay Operations", type: "process", operations: ["Intersect", "Union", "Difference", "Clip"] },
        { name: "Spatial Joins", type: "process", operations: ["Point in polygon", "Nearest neighbor", "Distance joins"] },
        { name: "Raster Calculator", type: "process", operations: ["Band math", "NDVI", "Classification"] }
      ]
    },
    {
      category: "Analysis",
      icon: "🧮",
      components: [
        { name: "Zonal Statistics", type: "analysis", stats: ["Mean", "Sum", "Count", "Std Dev"] },
        { name: "Hotspot Analysis", type: "analysis", methods: ["Getis-Ord", "Moran's I", "LISA"] },
        { name: "Clustering", type: "analysis", algorithms: ["DBSCAN", "K-means", "Hierarchical"] },
        { name: "Change Detection", type: "analysis", methods: ["Pixel-based", "Object-based", "Hybrid"] }
      ]
    },
    {
      category: "Output",
      icon: "📤",
      components: [
        { name: "File Export", type: "output", formats: ["Shapefile", "GeoJSON", "GeoTIFF", "PDF"] },
        { name: "Database Writer", type: "output", targets: ["PostGIS", "MongoDB", "InfluxDB"] },
        { name: "API Publisher", type: "output", endpoints: ["REST", "GraphQL", "Webhooks"] },
        { name: "Notification", type: "output", channels: ["Email", "Slack", "SMS"] }
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold">GIS Automation Engine</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Transform manual GIS workflows into automated, reproducible processes with visual workflow builder and robust orchestration
            </p>
          </div>

          {/* Architecture Overview */}
          <Card className="p-8 mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">Automation Architecture</h3>
            <div className="bg-muted/20 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-2">
                  <div className="bg-geo-primary/20 p-3 rounded border border-geo-primary/30">
                    <h4 className="font-semibold text-sm text-geo-primary mb-1">Workflow Builder</h4>
                    <div className="text-xs space-y-1">
                      <div>🎨 Drag & Drop UI</div>
                      <div>📝 Template Library</div>
                      <div>🔗 Component Catalog</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-lg text-geo-primary">→</div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-geo-secondary/20 p-3 rounded border border-geo-secondary/30">
                    <h4 className="font-semibold text-sm text-geo-secondary mb-1">Orchestration Engine</h4>
                    <div className="text-xs space-y-1">
                      <div>⚡ Apache Airflow</div>
                      <div>📊 Job Queuing</div>
                      <div>🔄 Dependency Management</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-lg text-geo-secondary">→</div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-geo-accent/20 p-3 rounded border border-geo-accent/30">
                    <h4 className="font-semibold text-sm text-geo-accent mb-1">Execution & Monitoring</h4>
                    <div className="text-xs space-y-1">
                      <div>🏃 Task Execution</div>
                      <div>📈 Progress Tracking</div>
                      <div>🚨 Error Handling</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-card p-4 rounded border">
                  <h5 className="font-semibold text-sm mb-2">Version Control</h5>
                  <div className="text-xs text-muted-foreground">
                    <div>📋 Workflow versioning</div>
                    <div>📊 Parameter tracking</div>
                    <div>📁 Output lineage</div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded border">
                  <h5 className="font-semibold text-sm mb-2">Logging & Audit</h5>
                  <div className="text-xs text-muted-foreground">
                    <div>📝 Execution logs</div>
                    <div>🕐 Timing metrics</div>
                    <div>👤 User tracking</div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded border">
                  <h5 className="font-semibold text-sm mb-2">Retry & Recovery</h5>
                  <div className="text-xs text-muted-foreground">
                    <div>🔄 Automatic retries</div>
                    <div>💾 State snapshots</div>
                    <div>🛠️ Error recovery</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Workflow Builder Interface */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Visual Workflow Builder</h3>
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="canvas">Canvas View</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="space-y-6">
                {workflowComponents.map((category, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-semibold text-lg">{category.category}</h4>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {category.components.map((component, i) => (
                        <div key={i} className="bg-muted/30 p-3 rounded border cursor-pointer hover:bg-muted/50 transition-colors">
                          <h5 className="font-medium text-sm mb-1">{component.name}</h5>
                          <Badge variant="outline" className="text-xs mb-2">{component.type}</Badge>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(component).filter(([key]) => !['name', 'type'].includes(key)).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '') : String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="canvas" className="space-y-4">
                <Card className="p-6">
                  <div className="bg-muted/20 p-8 rounded-lg border-2 border-dashed border-muted-foreground/20 min-h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <h4 className="font-semibold mb-2">Workflow Canvas</h4>
                      <p className="text-sm mb-6">Drag components here to build your workflow</p>
                      
                      {/* Sample workflow visualization */}
                      <div className="flex justify-center items-center space-x-8 mt-8">
                        <div className="bg-geo-primary/20 p-3 rounded border border-geo-primary/30 text-center">
                          <div className="text-sm font-medium">📂 Load Data</div>
                          <div className="text-xs mt-1">Shapefile Input</div>
                        </div>
                        <div className="text-xl">→</div>
                        <div className="bg-geo-secondary/20 p-3 rounded border border-geo-secondary/30 text-center">
                          <div className="text-sm font-medium">⚙️ Buffer</div>
                          <div className="text-xs mt-1">100m radius</div>
                        </div>
                        <div className="text-xl">→</div>
                        <div className="bg-geo-accent/20 p-3 rounded border border-geo-accent/30 text-center">
                          <div className="text-sm font-medium">📤 Export</div>
                          <div className="text-xs mt-1">GeoJSON output</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Workflow Parameters</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Input Parameters</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">Input Dataset</span>
                          <Badge variant="outline">Required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">Buffer Distance</span>
                          <Badge variant="secondary">100m</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">Output Format</span>
                          <Badge variant="secondary">GeoJSON</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Environment Variables</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">GDAL_DATA_PATH</span>
                          <Badge variant="outline">Environment</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">OUTPUT_DIR</span>
                          <Badge variant="outline">Environment</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">LOG_LEVEL</span>
                          <Badge variant="secondary">INFO</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="scheduling" className="space-y-4">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Workflow Scheduling</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Trigger Types</h5>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted/30 rounded text-sm">⏰ Time-based (Cron)</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">📁 File trigger</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">📡 API trigger</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">🔗 Dependency-based</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Schedule Examples</h5>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <div className="font-medium">Daily at 2 AM</div>
                          <code>0 2 * * *</code>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <div className="font-medium">Weekly on Sunday</div>
                          <code>0 0 * * 0</code>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <div className="font-medium">Every 15 minutes</div>
                          <code>*/15 * * * *</code>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Advanced Options</h5>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted/30 rounded text-sm">🔄 Retry policy</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">⏱️ Timeout settings</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">🚨 Alert notifications</div>
                        <div className="p-2 bg-muted/30 rounded text-sm">📊 SLA monitoring</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Workflow Templates */}
          <div className="mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">Pre-built Workflow Templates</h3>
            <div className="grid gap-6">
              {workflowTemplates.map((template, index) => (
                <Card key={index} className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{template.icon}</span>
                        <h4 className="font-semibold text-lg">{template.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-2">Workflow Steps:</h5>
                        <div className="space-y-1">
                          {template.steps.map((step, i) => (
                            <div key={i} className="text-xs flex items-center gap-2">
                              <span className="w-4 h-4 bg-geo-primary/20 rounded-full flex items-center justify-center text-[10px] font-semibold">
                                {i + 1}
                              </span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Inputs</h5>
                      <div className="space-y-1 mb-4">
                        {template.inputs.map((input, i) => (
                          <Badge key={i} variant="outline" className="text-xs block mb-1">{input}</Badge>
                        ))}
                      </div>
                      
                      <h5 className="font-medium text-sm mb-2">Outputs</h5>
                      <div className="space-y-1">
                        {template.outputs.map((output, i) => (
                          <Badge key={i} variant="secondary" className="text-xs block mb-1">{output}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Use Cases</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {template.use_cases.map((use_case, i) => (
                          <li key={i}>• {use_case}</li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 space-y-2">
                        <button className="w-full bg-geo-primary text-white text-xs py-2 px-3 rounded hover:bg-geo-primary/90 transition-colors">
                          Use Template
                        </button>
                        <button className="w-full border border-geo-primary text-geo-primary text-xs py-2 px-3 rounded hover:bg-geo-primary/5 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* API Contracts & Integration */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">API Contracts & Integration</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="workflow-api">
                <AccordionTrigger>Workflow Management API</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Create Workflow</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
{`POST /api/v1/workflows
Content-Type: application/json

{
  "name": "buffer_analysis_v1",
  "description": "Automated buffer analysis workflow",
  "version": "1.0.0",
  "workflow_definition": {
    "steps": [
      {
        "id": "load_data",
        "type": "data_loader",
        "config": {
          "source_type": "file",
          "file_path": "{{input.data_path}}",
          "format": "shapefile"
        }
      },
      {
        "id": "create_buffer",
        "type": "buffer_analysis", 
        "depends_on": ["load_data"],
        "config": {
          "distance": "{{params.buffer_distance}}",
          "units": "meters",
          "dissolve": true
        }
      },
      {
        "id": "export_results",
        "type": "data_exporter",
        "depends_on": ["create_buffer"],
        "config": {
          "output_path": "{{output.result_path}}",
          "format": "geojson"
        }
      }
    ],
    "parameters": {
      "buffer_distance": {
        "type": "number",
        "default": 100,
        "description": "Buffer distance in meters"
      }
    }
  },
  "retry_policy": {
    "max_retries": 3,
    "retry_delay": "5s",
    "exponential_backoff": true
  }
}`}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="execution-api">
                <AccordionTrigger>Workflow Execution API</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Execute Workflow</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
{`POST /api/v1/workflows/{workflow_id}/execute
Content-Type: application/json

{
  "execution_id": "exec_20240115_001",
  "inputs": {
    "data_path": "/uploads/parcels.shp"
  },
  "parameters": {
    "buffer_distance": 150
  },
  "outputs": {
    "result_path": "/outputs/buffer_results.geojson"
  },
  "metadata": {
    "user_id": "user_123",
    "project_id": "proj_456",
    "priority": "normal"
  }
}

Response:
{
  "execution_id": "exec_20240115_001",
  "workflow_id": "wf_789",
  "status": "queued",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_duration": "5m",
  "progress_url": "/api/v1/executions/exec_20240115_001/progress"
}`}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="monitoring-api">
                <AccordionTrigger>Monitoring & Status API</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Get Execution Status</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
{`GET /api/v1/executions/{execution_id}/status

Response:
{
  "execution_id": "exec_20240115_001",
  "status": "running",
  "progress": {
    "completed_steps": 2,
    "total_steps": 3,
    "current_step": "create_buffer",
    "percentage": 66
  },
  "started_at": "2024-01-15T10:31:00Z",
  "estimated_completion": "2024-01-15T10:36:00Z",
  "steps": [
    {
      "step_id": "load_data",
      "status": "completed",
      "started_at": "2024-01-15T10:31:00Z",
      "completed_at": "2024-01-15T10:32:30Z",
      "duration": "1m30s",
      "logs_url": "/api/v1/executions/exec_20240115_001/steps/load_data/logs"
    },
    {
      "step_id": "create_buffer",
      "status": "running",
      "started_at": "2024-01-15T10:32:30Z",
      "progress": 45
    },
    {
      "step_id": "export_results",
      "status": "pending"
    }
  ],
  "resource_usage": {
    "cpu_usage": "65%",
    "memory_usage": "2.1GB",
    "disk_io": "45MB/s"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="scheduling-api">
                <AccordionTrigger>Scheduling API</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Create Schedule</h5>
                      <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
{`POST /api/v1/schedules
Content-Type: application/json

{
  "name": "daily_land_use_update",
  "workflow_id": "wf_789",
  "schedule_type": "cron",
  "cron_expression": "0 2 * * *",
  "timezone": "UTC",
  "enabled": true,
  "default_inputs": {
    "data_path": "/data/daily/{{date}}/parcels.shp"
  },
  "default_parameters": {
    "buffer_distance": 100
  },
  "notifications": {
    "on_success": ["admin@company.com"],
    "on_failure": ["admin@company.com", "ops@company.com"]
  },
  "sla": {
    "max_duration": "30m",
    "alert_threshold": "20m"
  }
}

Response:
{
  "schedule_id": "sched_001",
  "status": "active",
  "next_execution": "2024-01-16T02:00:00Z",
  "created_at": "2024-01-15T10:30:00Z"
}`}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Backend Implementation */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibent text-center">Backend Orchestration Architecture</h3>
            <Tabs defaultValue="airflow" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="airflow">Apache Airflow</TabsTrigger>
                <TabsTrigger value="error-handling">Error Handling</TabsTrigger>
                <TabsTrigger value="versioning">Version Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="airflow" className="space-y-4">
                <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`# DAG Definition for Buffer Analysis Workflow
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
import geopandas as gpd
import logging

default_args = {
    'owner': 'gis-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(hours=1)
}

dag = DAG(
    'buffer_analysis_workflow',
    default_args=default_args,
    description='Automated buffer analysis workflow',
    schedule_interval='@daily',
    catchup=False,
    tags=['gis', 'analysis', 'automation']
)

def load_spatial_data(**context):
    """Load and validate spatial data"""
    file_path = context['dag_run'].conf.get('input_file')
    
    try:
        gdf = gpd.read_file(file_path)
        logging.info(f"Loaded {len(gdf)} features from {file_path}")
        
        # Validate geometries
        invalid_geoms = gdf[~gdf.is_valid]
        if len(invalid_geoms) > 0:
            logging.warning(f"Found {len(invalid_geoms)} invalid geometries")
            gdf = gdf[gdf.is_valid]
        
        # Store in XCom for next task
        return gdf.to_json()
        
    except Exception as e:
        logging.error(f"Failed to load spatial data: {str(e)}")
        raise

def create_buffer_analysis(**context):
    """Perform buffer analysis"""
    import json
    
    # Get data from previous task
    gdf_json = context['task_instance'].xcom_pull(task_ids='load_data')
    gdf = gpd.read_file(json.loads(gdf_json))
    
    # Get parameters
    buffer_distance = context['dag_run'].conf.get('buffer_distance', 100)
    
    try:
        # Create buffer
        buffered = gdf.buffer(buffer_distance)
        
        # Create result GeoDataFrame
        result_gdf = gpd.GeoDataFrame({
            'original_id': gdf.index,
            'buffer_distance': buffer_distance,
            'geometry': buffered
        })
        
        logging.info(f"Created {len(result_gdf)} buffer polygons")
        return result_gdf.to_json()
        
    except Exception as e:
        logging.error(f"Buffer analysis failed: {str(e)}")
        raise

def export_results(**context):
    """Export results to specified format"""
    import json
    
    # Get data from previous task
    result_json = context['task_instance'].xcom_pull(task_ids='buffer_analysis')
    result_gdf = gpd.read_file(json.loads(result_json))
    
    # Get output parameters
    output_path = context['dag_run'].conf.get('output_path')
    output_format = context['dag_run'].conf.get('output_format', 'geojson')
    
    try:
        if output_format.lower() == 'geojson':
            result_gdf.to_file(output_path, driver='GeoJSON')
        elif output_format.lower() == 'shapefile':
            result_gdf.to_file(output_path, driver='ESRI Shapefile')
        else:
            raise ValueError(f"Unsupported output format: {output_format}")
        
        logging.info(f"Results exported to {output_path}")
        
    except Exception as e:
        logging.error(f"Export failed: {str(e)}")
        raise

# Define tasks
load_data_task = PythonOperator(
    task_id='load_data',
    python_callable=load_spatial_data,
    dag=dag
)

buffer_task = PythonOperator(
    task_id='buffer_analysis',
    python_callable=create_buffer_analysis,
    dag=dag
)

export_task = PythonOperator(
    task_id='export_results',
    python_callable=export_results,
    dag=dag
)

# Set task dependencies
load_data_task >> buffer_task >> export_task`}
                </pre>
              </TabsContent>
              
              <TabsContent value="error-handling" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Retry Strategies</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-geo-primary pl-3">
                        <h5 className="font-medium">Exponential Backoff</h5>
                        <p className="text-xs text-muted-foreground">Increasing delays between retries</p>
                      </div>
                      <div className="border-l-4 border-geo-secondary pl-3">
                        <h5 className="font-medium">Fixed Interval</h5>
                        <p className="text-xs text-muted-foreground">Consistent retry intervals</p>
                      </div>
                      <div className="border-l-4 border-geo-accent pl-3">
                        <h5 className="font-medium">Immediate Retry</h5>
                        <p className="text-xs text-muted-foreground">For transient failures</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Error Recovery</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-geo-primary pl-3">
                        <h5 className="font-medium">State Checkpoints</h5>
                        <p className="text-xs text-muted-foreground">Resume from last successful step</p>
                      </div>
                      <div className="border-l-4 border-geo-secondary pl-3">
                        <h5 className="font-medium">Fallback Workflows</h5>
                        <p className="text-xs text-muted-foreground">Alternative processing paths</p>
                      </div>
                      <div className="border-l-4 border-geo-accent pl-3">
                        <h5 className="font-medium">Manual Intervention</h5>
                        <p className="text-xs text-muted-foreground">Human review for complex errors</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="versioning" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Workflow Versioning</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <span>v1.0.0 - Initial release</span>
                        <Badge variant="default">Production</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <span>v1.1.0 - Performance improvements</span>
                        <Badge variant="secondary">Staging</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <span>v2.0.0-beta - New features</span>
                        <Badge variant="outline">Development</Badge>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Data Lineage</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="font-medium">Input Dataset</div>
                        <div className="text-xs text-muted-foreground">parcels_2024_01_15.shp</div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="font-medium">Processing Parameters</div>
                        <div className="text-xs text-muted-foreground">buffer_distance: 150m</div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="font-medium">Output Result</div>
                        <div className="text-xs text-muted-foreground">buffer_results_v1.0.0.geojson</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Implementation Phases */}
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">Implementation Roadmap</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-primary mb-2">
                    1
                  </div>
                  <h4 className="font-semibold text-geo-primary">Core Engine (Weeks 1-4)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Backend Infrastructure</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Apache Airflow setup</li>
                      <li>• Job queue (Redis/Celery)</li>
                      <li>• Basic API framework</li>
                      <li>• Database schema</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-secondary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-secondary mb-2">
                    2
                  </div>
                  <h4 className="font-semibold text-geo-secondary">Workflow Builder (Weeks 5-8)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">UI Components</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Drag & drop interface</li>
                      <li>• Component library</li>
                      <li>• Parameter configuration</li>
                      <li>• Workflow validation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-accent/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-accent mb-2">
                    3
                  </div>
                  <h4 className="font-semibold text-geo-accent">GIS Operations (Weeks 9-12)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Core GIS Tools</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Buffer analysis</li>
                      <li>• Overlay operations</li>
                      <li>• Zonal statistics</li>
                      <li>• Hotspot detection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-primary mb-2">
                    4
                  </div>
                  <h4 className="font-semibold text-primary">Advanced Features (Weeks 13-16)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Enterprise Features</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Advanced scheduling</li>
                      <li>• Monitoring & alerts</li>
                      <li>• Performance optimization</li>
                      <li>• Multi-tenant support</li>
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

export default AutomationEngine;