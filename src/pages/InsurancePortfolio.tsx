import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Download, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PortfolioProperty {
  id: string;
  address: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  primaryFactor: string;
  lastAnalyzed: string;
}

const InsurancePortfolio = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'overview' | 'list'>('overview');

  // Mock portfolio data
  const portfolioData: PortfolioProperty[] = [
    {
      id: '1',
      address: '123 Flood St, Miami, FL',
      riskScore: 85,
      riskLevel: 'high',
      primaryFactor: 'Flood (FEMA Zone AE)',
      lastAnalyzed: '2024-01-15'
    },
    {
      id: '2',
      address: '456 Safe Ave, Denver, CO',
      riskScore: 28,
      riskLevel: 'low',
      primaryFactor: 'Good infrastructure',
      lastAnalyzed: '2024-01-14'
    },
    {
      id: '3',
      address: '789 Wildfire Rd, Los Angeles, CA',
      riskScore: 72,
      riskLevel: 'high',
      primaryFactor: 'Wildfire exposure',
      lastAnalyzed: '2024-01-14'
    },
    {
      id: '4',
      address: '321 Moderate Ln, Austin, TX',
      riskScore: 52,
      riskLevel: 'medium',
      primaryFactor: 'Mixed factors',
      lastAnalyzed: '2024-01-13'
    },
    {
      id: '5',
      address: '654 Valley Dr, Portland, OR',
      riskScore: 45,
      riskLevel: 'medium',
      primaryFactor: 'Moderate elevation',
      lastAnalyzed: '2024-01-13'
    }
  ];

  const highRisk = portfolioData.filter(p => p.riskLevel === 'high').length;
  const mediumRisk = portfolioData.filter(p => p.riskLevel === 'medium').length;
  const lowRisk = portfolioData.filter(p => p.riskLevel === 'low').length;
  const avgScore = Math.round(portfolioData.reduce((sum, p) => sum + p.riskScore, 0) / portfolioData.length);

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/insurance')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Portfolio Analytics</h1>
                <p className="text-sm text-muted-foreground">
                  Risk distribution and performance metrics
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Map className="mr-2 h-4 w-4" />
                View Heatmap
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {portfolioData.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzed properties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {avgScore}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Portfolio average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {highRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {lowRisk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Favorable profiles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>
              Portfolio breakdown by risk level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* High Risk */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    High Risk (70-100)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {highRisk} properties ({Math.round((highRisk / portfolioData.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-destructive h-2 rounded-full"
                    style={{ width: `${(highRisk / portfolioData.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Medium Risk */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Medium Risk (40-69)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {mediumRisk} properties ({Math.round((mediumRisk / portfolioData.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(mediumRisk / portfolioData.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Low Risk */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Low Risk (0-39)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {lowRisk} properties ({Math.round((lowRisk / portfolioData.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(lowRisk / portfolioData.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Riskiest Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Riskiest Properties</CardTitle>
            <CardDescription>
              Properties requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Primary Factor</TableHead>
                  <TableHead>Last Analyzed</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .slice(0, 10)
                  .map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.address}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          property.riskScore >= 70 ? 'text-destructive' :
                          property.riskScore >= 40 ? 'text-accent' :
                          'text-primary'
                        }`}>
                          {property.riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(property.riskLevel)} className="flex items-center gap-1 w-fit">
                          {getRiskIcon(property.riskLevel)}
                          {property.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {property.primaryFactor}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {property.lastAnalyzed}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InsurancePortfolio;
