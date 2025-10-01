import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  BarChart3, 
  TrendingUp, 
  MapPin,
  FileImage,
  FileText,
  Database
} from 'lucide-react';

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

interface ResultsPanelProps {
  result: AnalysisResult;
  projectType: string;
  onDownload: (format: 'geotiff' | 'png' | 'pdf') => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  result, 
  projectType, 
  onDownload 
}) => {
  const overallScore = result.topSites.length > 0 
    ? result.topSites.reduce((sum, site) => sum + site.score, 0) / result.topSites.length 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-primary';
    if (score >= 0.6) return 'text-accent-foreground';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <BarChart3 className="w-5 h-5 text-primary" />
             Analysis Summary
           </CardTitle>
          <CardDescription>
            {projectType} suitability analysis results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)} mb-1`}>
              {(overallScore * 100).toFixed(0)}%
            </div>
            <p className="text-sm text-muted-foreground">
              Overall Suitability Score
            </p>
            <Badge variant={overallScore >= 0.6 ? 'default' : 'secondary'} className="mt-2">
              {getScoreLabel(overallScore)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Sites Found</span>
              <span className="font-medium">{result.topSites.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Best Site Score</span>
              <span className={`font-medium ${getScoreColor(result.topSites[0]?.score || 0)}`}>
                {((result.topSites[0]?.score || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total Area</span>
              <span className="font-medium">
                {result.topSites.reduce((sum, site) => sum + site.area, 0).toFixed(1)} ha
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Breakdown */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-primary" />
             Criteria Breakdown
           </CardTitle>
          <CardDescription>
            How each factor influenced the suitability scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.breakdown).map(([criterion, score]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{criterion}</span>
                <span className={getScoreColor(score)}>
                  {(score * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={score * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top 5 Sites */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <MapPin className="w-5 h-5 text-primary" />
             Top 5 Recommended Sites
           </CardTitle>
          <CardDescription>
            Best locations ranked by {projectType.toLowerCase()} suitability score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.topSites.slice(0, 5).map((site, index) => {
            const rank = index + 1;
            const isTopSite = rank <= 3;
            return (
               <div key={site.id} className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                 isTopSite 
                   ? 'bg-primary/10 border-primary shadow-sm' 
                   : 'bg-muted/30 border-border'
               }`}>
             <div className="flex items-center gap-3">
               <div className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold shadow-lg ${
                 rank === 1 
                   ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' 
                   : rank === 2 
                     ? 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground'
                     : rank === 3
                       ? 'bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground'
                       : 'bg-gradient-to-br from-muted to-muted/80 text-muted-foreground'
               }`}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  Site #{rank}
                  {rank <= 3 && <span className="ml-2 text-xs text-muted-foreground">Top Performer</span>}
                </p>
                    <p className="text-xs text-muted-foreground">
                      {site.area.toFixed(1)} hectares • {getScoreLabel(site.score)} suitability
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(site.score)} mb-1`}>
                    {(site.score * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {site.coordinates[1].toFixed(4)}°N, {site.coordinates[0].toFixed(4)}°E
                  </div>
                </div>
              </div>
            );
          })}
          
          {result.topSites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No suitable sites found in the selected region</p>
              <p className="text-xs mt-1">Try adjusting the region or project parameters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Options */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Download className="w-5 h-5 text-primary" />
             Export Results
           </CardTitle>
          <CardDescription>
            Download your analysis results in different formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onDownload('geotiff')}
          >
            <Database className="w-4 h-4 mr-2" />
            Download GeoTIFF
            <Badge variant="secondary" className="ml-auto text-xs">
              Raster Data
            </Badge>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onDownload('png')}
          >
            <FileImage className="w-4 h-4 mr-2" />
            Download PNG Image
            <Badge variant="secondary" className="ml-auto text-xs">
              Visualization
            </Badge>
          </Button>
          
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload('pdf')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF Report
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Investor-Ready
                  </Badge>
                </Button>
        </CardContent>
      </Card>
    </div>
  );
};