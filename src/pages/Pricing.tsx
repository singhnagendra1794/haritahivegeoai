import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Building, Zap, Users, Shield, BarChart3, Map, Upload, Cpu } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TopBar from '@/components/TopBar';

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { subscription, refreshSubscription } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(plan);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: plan === 'pro' ? 'price_pro_monthly' : 'price_enterprise_monthly',
          successUrl: `${window.location.origin}/app/billing?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/app/pricing`,
        }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start checkout process. Please try again."
      });
    } finally {
      setLoading(null);
    }
  };

  const handleContactSales = () => {
    window.open('mailto:sales@haritahive.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with GeoAI',
      icon: Map,
      features: [
        '2 projects',
        '50MB storage',
        'Basic polygon tools',
        'Buffer analysis',
        'Data upload (GeoJSON)',
        'Community support',
        'Map visualization',
        'Export capabilities'
      ],
      limitations: [
        'No advanced AI models',
        'Limited storage',
        'Basic features only'
      ],
      cta: subscription?.plan === 'free' ? 'Current Plan' : 'Get Started',
      popular: false,
      disabled: subscription?.plan === 'free'
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Advanced GeoAI tools for professionals',
      icon: Crown,
      features: [
        '10 projects',
        '2GB storage',
        'All basic features',
        'NDVI analysis',
        'Land cover classification',
        'Change detection',
        'Advanced ML models',
        'Priority support',
        'API access',
        'Batch processing',
        'Custom export formats',
        'Satellite data integration'
      ],
      cta: subscription?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      popular: true,
      disabled: subscription?.plan === 'pro'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Full-scale solution for organizations',
      icon: Building,
      features: [
        'Unlimited projects',
        'Unlimited storage',
        'All Pro features',
        'Multi-user workspaces',
        'Role-based access control',
        'Audit logs',
        'Private cloud deployment',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
        'Training & onboarding'
      ],
      cta: subscription?.plan === 'enterprise' ? 'Current Plan' : 'Contact Sales',
      popular: false,
      disabled: subscription?.plan === 'enterprise'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar onDashboardOpen={() => navigate('/app')} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-geo-primary to-geo-secondary bg-clip-text text-transparent">
            Choose Your GeoAI Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scale your geospatial analysis with advanced AI models and enterprise features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-2 border-geo-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-geo-primary to-geo-secondary text-white px-4 py-1">
                      <Zap className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period !== 'pricing' && (
                      <span className="text-base font-normal text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-geo-primary to-geo-secondary hover:opacity-90' : ''}`}
                    disabled={plan.disabled || loading === plan.name.toLowerCase()}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        handleContactSales();
                      } else if (plan.name === 'Pro') {
                        handleSubscribe('pro');
                      } else {
                        navigate('/auth');
                      }
                    }}
                  >
                    {loading === plan.name.toLowerCase() ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </div>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">Data Ingestion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support for GeoJSON, Shapefiles, GeoTIFF, and direct satellite data APIs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Cpu className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">AI/ML Models</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NDVI, land cover classification, change detection, and custom model deployment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Zonal statistics, hotspot detection, and advanced spatial analysis
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle className="text-lg">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  SOC2 compliance, audit logs, RBAC, and private cloud deployment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Open Source CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Open Source Option</CardTitle>
              <CardDescription className="text-lg">
                Self-host the core platform for free
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Our core GeoAI platform is open source. Deploy it on your own infrastructure 
                with basic features and community support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => window.open('https://github.com/haritahive/geoai-platform', '_blank')}>
                  View on GitHub
                </Button>
                <Button variant="outline" onClick={() => window.open('/docs/self-hosting', '_blank')}>
                  Self-Hosting Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;