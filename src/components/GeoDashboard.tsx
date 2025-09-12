import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Camera, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DashboardStats {
  totalFeatures: number;
  featureTypes: Array<{ type: string; count: number; color: string }>;
  analysisTypes: Array<{ type: string; count: number; color: string }>;
  recentActivity: Array<{ name: string; type: string; date: string }>;
}

interface GeoDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const COLORS = ['hsl(195 85% 35%)', 'hsl(150 60% 45%)', 'hsl(220 70% 50%)', 'hsl(270 70% 50%)', 'hsl(300 70% 50%)'];

const GeoDashboard: React.FC<GeoDashboardProps> = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFeatures: 0,
    featureTypes: [],
    analysisTypes: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible && user) {
      fetchDashboardStats();
    }
  }, [isVisible, user]);

  const fetchDashboardStats = async () => {
    try {
      const { data: features, error } = await supabase
        .from('geo_features')
        .select('id, name, feature_type, properties, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!features) {
        setStats({
          totalFeatures: 0,
          featureTypes: [],
          analysisTypes: [],
          recentActivity: []
        });
        return;
      }

      // Calculate feature type distribution
      const typeCount = features.reduce((acc, feature) => {
        acc[feature.feature_type] = (acc[feature.feature_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const featureTypes = Object.entries(typeCount).map(([type, count], index) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        color: COLORS[index % COLORS.length]
      }));

      // Calculate analysis type distribution
      const analysisCount = features.reduce((acc, feature) => {
        const analysisType = feature.properties?.analysis_type || 'manual';
        acc[analysisType] = (acc[analysisType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const analysisTypes = Object.entries(analysisCount).map(([type, count], index) => ({
        type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        color: COLORS[index % COLORS.length]
      }));

      // Recent activity
      const recentActivity = features.slice(0, 10).map(feature => ({
        name: feature.name,
        type: feature.properties?.analysis_type || 'manual',
        date: new Date(feature.created_at).toLocaleDateString()
      }));

      setStats({
        totalFeatures: features.length,
        featureTypes,
        analysisTypes,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics."
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const dashboardElement = document.getElementById('geo-dashboard');
      if (!dashboardElement) throw new Error('Dashboard element not found');

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`harita-hive-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: "Export Complete",
        description: "Dashboard exported to PDF successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export dashboard to PDF."
      });
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ['Feature Name', 'Type', 'Analysis Type', 'Created Date'],
      ...stats.recentActivity.map(activity => [
        activity.name,
        'Feature',
        activity.type,
        activity.date
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harita-hive-features-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Feature data exported to CSV successfully."
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GeoAI Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={exporting}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div id="geo-dashboard" className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Features</p>
                        <p className="text-2xl font-bold text-primary">{stats.totalFeatures}</p>
                      </div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Feature Types</p>
                        <p className="text-2xl font-bold text-secondary">{stats.featureTypes.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <PieChartIcon className="h-4 w-4 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Analysis Types</p>
                        <p className="text-2xl font-bold text-accent">{stats.analysisTypes.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Recent Items</p>
                        <p className="text-2xl font-bold text-primary">{Math.min(stats.recentActivity.length, 10)}</p>
                      </div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Types Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.featureTypes.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.featureTypes}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={(entry: any) => `${entry.type}: ${entry.count}`}
                          >
                            {stats.featureTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data to display
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.analysisTypes.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.analysisTypes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(195 85% 35%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data to display
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentActivity.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent activity to display.
                      </p>
                    ) : (
                      stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full" />
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{activity.date}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoDashboard;