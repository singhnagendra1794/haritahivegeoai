import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Filter, Download, Eye } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClaimItem {
  id: string;
  policyId: string;
  address: string;
  damageFlag: boolean;
  changeScore: number;
  claimDate: string;
  status: 'pending' | 'approved' | 'escalated';
  priority: 'high' | 'medium' | 'low';
  recommendedAction: string;
}

const InsuranceTriage = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock claims data
  const claimsData: ClaimItem[] = [
    {
      id: '1',
      policyId: 'POL-2024-001',
      address: '123 Flood St, Miami, FL',
      damageFlag: true,
      changeScore: 85,
      claimDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      recommendedAction: 'Immediate inspection required - High structural change detected'
    },
    {
      id: '2',
      policyId: 'POL-2024-002',
      address: '456 Safe Ave, Denver, CO',
      damageFlag: false,
      changeScore: 12,
      claimDate: '2024-01-14',
      status: 'approved',
      priority: 'low',
      recommendedAction: 'Approve claim - No significant damage detected'
    },
    {
      id: '3',
      policyId: 'POL-2024-003',
      address: '789 Wildfire Rd, Los Angeles, CA',
      damageFlag: true,
      changeScore: 72,
      claimDate: '2024-01-14',
      status: 'escalated',
      priority: 'high',
      recommendedAction: 'Escalate to senior adjuster - Wildfire damage confirmed'
    },
    {
      id: '4',
      policyId: 'POL-2024-004',
      address: '321 Moderate Ln, Austin, TX',
      damageFlag: true,
      changeScore: 45,
      claimDate: '2024-01-13',
      status: 'pending',
      priority: 'medium',
      recommendedAction: 'Schedule site visit - Moderate structural changes'
    }
  ];

  const filteredClaims = claimsData.filter(claim => {
    const statusMatch = filterStatus === 'all' || claim.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || claim.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'escalated': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  const pendingCount = claimsData.filter(c => c.status === 'pending').length;
  const highPriorityCount = claimsData.filter(c => c.priority === 'high').length;

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
                <h1 className="text-2xl font-bold text-primary">Claims Triage Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Prioritized claims review with change detection
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {highPriorityCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {claimsData.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In system
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <CardTitle>Claims Queue</CardTitle>
            <CardDescription>
              Sorted by priority and damage detection score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Damage Flag</TableHead>
                  <TableHead>Change Score</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Claim Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims
                  .sort((a, b) => {
                    // Sort by priority first, then by change score
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    return b.changeScore - a.changeScore;
                  })
                  .map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">
                        {claim.policyId}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {claim.address}
                      </TableCell>
                      <TableCell>
                        {claim.damageFlag ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <AlertTriangle className="h-3 w-3" />
                            Detected
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            None
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          claim.changeScore >= 70 ? 'text-destructive' :
                          claim.changeScore >= 40 ? 'text-accent' :
                          'text-primary'
                        }`}>
                          {claim.changeScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(claim.priority)}>
                          {claim.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(claim.status)}>
                          {claim.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {claim.claimDate}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recommendations Panel */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>
              AI-generated recommendations for pending high-priority claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClaims
                .filter(c => c.status === 'pending' && c.priority === 'high')
                .map((claim) => (
                  <div key={claim.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{claim.policyId} - {claim.address}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {claim.recommendedAction}
                      </p>
                    </div>
                    <Button size="sm">Take Action</Button>
                  </div>
                ))}
              {filteredClaims.filter(c => c.status === 'pending' && c.priority === 'high').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No high-priority pending claims
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InsuranceTriage;
