import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Building } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureGateProps {
  feature: string;
  requiredPlan: 'pro' | 'enterprise';
  children: React.ReactNode;
  description?: string;
  showUpgrade?: boolean;
}

const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  feature,
  requiredPlan,
  children,
  description,
  showUpgrade = true
}) => {
  const { isProUser, isEnterpriseUser, subscription } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = requiredPlan === 'pro' ? (isProUser || isEnterpriseUser) : isEnterpriseUser;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const handleUpgrade = () => {
    navigate('/app/pricing');
  };

  const PlanIcon = requiredPlan === 'enterprise' ? Building : Crown;
  const planName = requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro';
  const planColor = requiredPlan === 'enterprise' ? 'bg-purple-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500';

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2">
          <Badge className={`${planColor} text-white px-3 py-1`}>
            <PlanIcon className="w-4 h-4 mr-1" />
            {planName} Feature
          </Badge>
        </div>
        <CardTitle className="text-lg">{feature}</CardTitle>
        <CardDescription>
          {description || `This feature requires a ${planName} subscription to unlock advanced capabilities.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Upgrade to {planName} to access this feature
          </p>
        </div>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade to {planName}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatureGate;