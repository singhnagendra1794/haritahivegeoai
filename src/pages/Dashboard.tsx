import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MapComponent from '@/components/MapComponent';
import BufferToolsSidebar from '@/components/BufferToolsSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const [storedFeatures, setStoredFeatures] = useState<Array<{ id: string; name: string }>>([]);
  const [bufferedGeometry, setBufferedGeometry] = useState<any>(null);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStoredFeatures();
    }
  }, [user]);

  const fetchStoredFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('geo_features')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStoredFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stored features."
      });
    }
  };

  const handleFeatureCreated = (featureId: string) => {
    // Refresh the stored features list
    fetchStoredFeatures();
  };

  const handleBufferResult = (geometry: any) => {
    setBufferedGeometry(geometry);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-geo-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-geo-primary to-geo-secondary bg-clip-text text-transparent">
              Harita Hive
            </h1>
            <span className="text-muted-foreground">GeoAI Platform</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user.email}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <BufferToolsSidebar 
          storedFeatures={storedFeatures}
          onBufferResult={handleBufferResult}
        />
        
        <main className="flex-1 p-4">
          <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
            <MapComponent 
              onFeatureCreated={handleFeatureCreated}
              bufferedGeometry={bufferedGeometry}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;