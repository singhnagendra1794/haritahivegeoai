import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TopBar from '@/components/TopBar';
import { 
  CreditCard, 
  Calendar, 
  Database, 
  FolderOpen, 
  Crown, 
  Building, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { subscription, usageStats, refreshSubscription, isProUser, isEnterpriseUser } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle successful checkout
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      toast({
        title: "Subscription Updated!",
        description: "Your subscription has been successfully updated.",
      });
      refreshSubscription();
      // Remove session_id from URL
      navigate('/app/billing', { replace: true });
    }
  }, [searchParams, refreshSubscription, navigate, toast]);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          returnUrl: `${window.location.origin}/app/billing`
        }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open billing portal. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return Crown;
      case 'enterprise': return Building;
      default: return FolderOpen;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'enterprise': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsagePercentage = () => {
    if (usageStats.maxStorage === -1) return 0; // Unlimited
    return (usageStats.storage / usageStats.maxStorage) * 100;
  };

  const getProjectUsagePercentage = () => {
    if (usageStats.maxProjects === -1) return 0; // Unlimited
    return (usageStats.projects / usageStats.maxProjects) * 100;
  };

  const PlanIcon = getPlanIcon(subscription?.plan || 'free');
  const planColor = getPlanColor(subscription?.plan || 'free');

  return (
    <div className="min-h-screen bg-background">
      <TopBar onDashboardOpen={() => navigate('/app')} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and monitor usage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${planColor}`}>
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      {getPlanDisplayName(subscription?.plan || 'free')} subscription
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${planColor} text-white`}>
                  {getPlanDisplayName(subscription?.plan || 'free')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription?.current_period_end && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {subscription.status === 'active' ? 'Renews on' : 'Expires on'}{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  {subscription?.status === 'active' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm capitalize">
                    Status: {subscription?.status || 'Active'}
                  </span>
                </div>

                {(isProUser || isEnterpriseUser) && (
                  <Button 
                    onClick={handleManageBilling}
                    disabled={loading}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loading ? 'Loading...' : 'Manage Billing'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {!isProUser && !isEnterpriseUser && (
                  <Button 
                    onClick={() => navigate('/app/pricing')}
                    className="w-full sm:w-auto"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Projects Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Projects</span>
                  <span>
                    {usageStats.projects} / {usageStats.maxProjects === -1 ? '∞' : usageStats.maxProjects}
                  </span>
                </div>
                <Progress 
                  value={getProjectUsagePercentage()} 
                  className="h-2"
                />
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage</span>
                  <span>
                    {formatBytes(usageStats.storage)} / {usageStats.maxStorage === -1 ? '∞' : formatBytes(usageStats.maxStorage)}
                  </span>
                </div>
                <Progress 
                  value={getStorageUsagePercentage()} 
                  className="h-2"
                />
              </div>

              {/* Usage warnings */}
              {getProjectUsagePercentage() > 80 && usageStats.maxProjects !== -1 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                    <p className="text-xs text-yellow-800">
                      You're approaching your project limit
                    </p>
                  </div>
                </div>
              )}

              {getStorageUsagePercentage() > 80 && usageStats.maxStorage !== -1 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                    <p className="text-xs text-yellow-800">
                      You're approaching your storage limit
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plan Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              What's included in your {getPlanDisplayName(subscription?.plan || 'free')} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscription?.plan === 'free' && (
                <>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">2 projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">50MB storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Basic tools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Community support</span>
                  </div>
                </>
              )}
              
              {subscription?.plan === 'pro' && (
                <>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">10 projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">2GB storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced AI models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Batch processing</span>
                  </div>
                </>
              )}
              
              {subscription?.plan === 'enterprise' && (
                <>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">All Pro features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Multi-user workspaces</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Role-based access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Dedicated support</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;