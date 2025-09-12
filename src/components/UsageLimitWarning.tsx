import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

interface UsageLimitWarningProps {
  type: 'projects' | 'storage';
  currentUsage: number;
  maxUsage: number;
  onUpgrade?: () => void;
}

const UsageLimitWarning: React.FC<UsageLimitWarningProps> = ({
  type,
  currentUsage,
  maxUsage,
  onUpgrade
}) => {
  const { isProUser, isEnterpriseUser } = useSubscription();
  const navigate = useNavigate();
  
  // Don't show warning for unlimited plans
  if (maxUsage === -1) return null;
  
  const usagePercentage = (currentUsage / maxUsage) * 100;
  
  // Only show warning when above 80% usage
  if (usagePercentage <= 80) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/app/pricing');
    }
  };

  const getWarningText = () => {
    if (usagePercentage >= 100) {
      return `You've reached your ${type} limit. Upgrade to continue using advanced features.`;
    } else if (usagePercentage >= 90) {
      return `You're approaching your ${type} limit (${Math.round(usagePercentage)}% used).`;
    } else {
      return `You're using ${Math.round(usagePercentage)}% of your ${type} limit.`;
    }
  };

  const getAlertVariant = () => {
    if (usagePercentage >= 100) return 'destructive';
    return 'default';
  };

  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">
          {getWarningText()}
        </span>
        {!isEnterpriseUser && (
          <Button
            size="sm"
            variant={usagePercentage >= 100 ? 'default' : 'outline'}
            onClick={handleUpgrade}
            className="ml-4"
          >
            <Crown className="w-4 h-4 mr-1" />
            Upgrade
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UsageLimitWarning;