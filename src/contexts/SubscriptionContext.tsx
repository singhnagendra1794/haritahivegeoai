import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: any;
  loading: boolean;
  isProUser: boolean;
  isEnterpriseUser: boolean;
  usageStats: {
    projects: number;
    storage: number;
    maxProjects: number;
    maxStorage: number;
  };
  refreshSubscription: () => Promise<void>;
  checkUsageLimit: (type: 'projects' | 'storage', amount?: number) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState({
    projects: 0,
    storage: 0,
    maxProjects: 2,
    maxStorage: 50 * 1024 * 1024, // 50MB in bytes
  });
  const { user } = useAuth();

  const isProUser = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';
  const isEnterpriseUser = subscription?.plan === 'enterprise';

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsageStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data || { plan: 'free', status: 'active' });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ plan: 'free', status: 'active' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    try {
      // Fetch project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user?.id);

      // Fetch storage usage (simplified - would need actual file size calculation)
      const { data: datasets } = await supabase
        .from('project_datasets')
        .select('metadata')
        .in('project_id', [user?.id]); // This would need proper project filtering

      let storageUsed = 0;
      datasets?.forEach(dataset => {
        const size = dataset.metadata?.file_size || 0;
        storageUsed += size;
      });

      const plan = subscription?.plan || 'free';
      const limits = getUsageLimits(plan);

      setUsageStats({
        projects: projectCount || 0,
        storage: storageUsed,
        maxProjects: limits.projects,
        maxStorage: limits.storage,
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    }
  };

  const getUsageLimits = (plan: string) => {
    switch (plan) {
      case 'pro':
        return {
          projects: 10,
          storage: 2 * 1024 * 1024 * 1024, // 2GB
        };
      case 'enterprise':
        return {
          projects: -1, // unlimited
          storage: -1, // unlimited
        };
      default: // free
        return {
          projects: 2,
          storage: 50 * 1024 * 1024, // 50MB
        };
    }
  };

  const checkUsageLimit = (type: 'projects' | 'storage', amount: number = 0) => {
    const current = usageStats[type === 'projects' ? 'projects' : 'storage'];
    const max = usageStats[type === 'projects' ? 'maxProjects' : 'maxStorage'];
    
    // Unlimited for enterprise
    if (max === -1) return true;
    
    return (current + amount) <= max;
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscription();
    await fetchUsageStats();
  };

  const value = {
    subscription,
    loading,
    isProUser,
    isEnterpriseUser,
    usageStats,
    refreshSubscription,
    checkUsageLimit,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};