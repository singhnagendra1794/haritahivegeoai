import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MapboxTokenGateProps {
  onTokenSaved?: (token: string) => void;
  title?: string;
  description?: string;
}

const MapboxTokenGate: React.FC<MapboxTokenGateProps> = ({
  onTokenSaved,
  title = 'Mapbox Token Required',
  description = 'Enter your Mapbox public access token to enable the interactive map.'
}) => {
  const [value, setValue] = useState('');
  const { toast } = useToast();

  const saveToken = () => {
    if (!value || !value.startsWith('pk.')) {
      toast({
        variant: 'destructive',
        title: 'Invalid token',
        description: 'Please paste a valid Mapbox public token (starts with pk.).'
      });
      return;
    }
    try {
      localStorage.setItem('mapbox_public_token', value);
      onTokenSaved?.(value);
      toast({ title: 'Token saved', description: 'Map will load with your token.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Failed to save token' });
    }
  };

  const useDemo = () => {
    const demo = 'pk.demo_token';
    try {
      localStorage.setItem('mapbox_public_token', demo);
      onTokenSaved?.(demo);
      toast({ title: 'Demo mode', description: 'Showing simulated map preview.' });
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="flex items-center justify-center h-96 bg-muted rounded-lg border border-border">
      <div className="w-full max-w-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-2">
          <Input
            placeholder="pk.YourMapboxPublicToken"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveToken}>Save</Button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Find your token at
          <a
            href="https://mapbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline text-geo-primary"
          >
            mapbox.com
          </a>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={useDemo} className="text-xs">Use Demo Preview</Button>
        </div>
      </div>
    </div>
  );
};

export default MapboxTokenGate;
