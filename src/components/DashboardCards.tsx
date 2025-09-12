import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  FileText, 
  Database, 
  Zap, 
  BarChart3, 
  Brain, 
  Workflow, 
  Calendar, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DashboardCardsProps {
  onUploadVector: () => void;
  onUploadRaster: () => void;
  onConnectAPI: () => void;
  onRunBuffer: () => void;
  onOverlayAnalysis: () => void;
  onRunMLModel: () => void;
  onCreateWorkflow: () => void;
  onScheduleJob: () => void;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  onUploadVector,
  onUploadRaster,
  onConnectAPI,
  onRunBuffer,
  onOverlayAnalysis,
  onRunMLModel,
  onCreateWorkflow,
  onScheduleJob,
}) => {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-forest-primary/5 to-forest-primary/10 border-forest-primary/20 hover:shadow-md transition-all cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forest-primary/10 rounded-lg">
                <Upload className="h-5 w-5 text-forest-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Upload Data</CardTitle>
                <CardDescription>Import your geospatial datasets</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 hover:shadow-md transition-all cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Run Analysis</CardTitle>
                <CardDescription>Process your spatial data</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20 hover:shadow-md transition-all cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">View Results</CardTitle>
                <CardDescription>Analyze your outputs</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Data Sources */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal-primary mb-4">Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload Vector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onUploadVector} className="w-full" size="sm">
                Select Files
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Upload Raster
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onUploadRaster} className="w-full" size="sm">
                Select Files
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Connect API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onConnectAPI} variant="outline" className="w-full" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Processing Tools */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal-primary mb-4">Processing Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Run Buffer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onRunBuffer} className="w-full" size="sm">
                Execute
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overlay Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onOverlayAnalysis} className="w-full" size="sm">
                Execute
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Run ML Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onRunMLModel} className="w-full" size="sm">
                Execute
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Automation */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal-primary mb-4">Automation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Create Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onCreateWorkflow} className="w-full" size="sm">
                New Workflow
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Job
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onScheduleJob} variant="outline" className="w-full" size="sm">
                Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal-primary mb-4">System Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Jobs Running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">3</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  MLflow Tracking
                </span>
                <Switch defaultChecked />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Experiment tracking enabled
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;