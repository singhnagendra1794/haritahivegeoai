import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Database, Image, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const InsuranceAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Data source toggles
  const [usePlanetImagery, setUsePlanetImagery] = useState(false);
  const [useMaxarImagery, setUseMaxarImagery] = useState(false);
  const [useICEYESAR, setUseICEYESAR] = useState(false);
  const [useVexcelAerial, setUseVexcelAerial] = useState(false);
  
  // Feature toggles
  const [enableAutoInterpret, setEnableAutoInterpret] = useState(true);
  const [enableChangeDetection, setEnableChangeDetection] = useState(true);
  const [enableWebhooks, setEnableWebhooks] = useState(false);
  
  // Webhook settings
  const [webhookUrl, setWebhookUrl] = useState("");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
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
                <h1 className="text-2xl font-bold text-primary">Admin Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Configure data sources and operational settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Commercial Imagery Sources */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <CardTitle>High-Resolution Imagery Sources</CardTitle>
            </div>
            <CardDescription>
              Enable commercial imagery providers for enhanced analysis quality (additional costs apply)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="planet" className="font-medium">Planet Labs</Label>
                <p className="text-sm text-muted-foreground">
                  Daily 3-5m resolution optical imagery
                </p>
              </div>
              <Switch
                id="planet"
                checked={usePlanetImagery}
                onCheckedChange={setUsePlanetImagery}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="maxar" className="font-medium">Maxar SecureWatch</Label>
                <p className="text-sm text-muted-foreground">
                  30-50cm resolution satellite imagery
                </p>
              </div>
              <Switch
                id="maxar"
                checked={useMaxarImagery}
                onCheckedChange={setUseMaxarImagery}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="iceye" className="font-medium">ICEYE SAR</Label>
                <p className="text-sm text-muted-foreground">
                  Near real-time flood detection and damage assessment
                </p>
              </div>
              <Switch
                id="iceye"
                checked={useICEYESAR}
                onCheckedChange={setUseICEYESAR}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="vexcel" className="font-medium">Vexcel Aerial</Label>
                <p className="text-sm text-muted-foreground">
                  7.5cm resolution aerial imagery for US markets
                </p>
              </div>
              <Switch
                id="vexcel"
                checked={useVexcelAerial}
                onCheckedChange={setUseVexcelAerial}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Feature Configuration</CardTitle>
            </div>
            <CardDescription>
              Enable or disable platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-interpret" className="font-medium">Auto-Interpret Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Generate underwriting recommendations automatically
                </p>
              </div>
              <Switch
                id="auto-interpret"
                checked={enableAutoInterpret}
                onCheckedChange={setEnableAutoInterpret}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="change-detection" className="font-medium">Change Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automated before/after analysis for claims
                </p>
              </div>
              <Switch
                id="change-detection"
                checked={enableChangeDetection}
                onCheckedChange={setEnableChangeDetection}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="webhooks" className="font-medium">Webhook Delivery</Label>
                <p className="text-sm text-muted-foreground">
                  Send analysis results to external systems
                </p>
              </div>
              <Switch
                id="webhooks"
                checked={enableWebhooks}
                onCheckedChange={setEnableWebhooks}
              />
            </div>
            
            {enableWebhooks && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://your-system.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Results will be POST to this endpoint upon completion
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Retention & Compliance</CardTitle>
            </div>
            <CardDescription>
              Configure data storage and audit settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Data Retention Period</Label>
              <Input
                id="retention"
                type="number"
                placeholder="90"
                defaultValue="90"
              />
              <p className="text-sm text-muted-foreground">
                Number of days to retain analysis results and reports
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Audit Trail</Label>
              <p className="text-sm text-muted-foreground">
                Full provenance logging is enabled by default for all analyses. This includes dataset versions, imagery timestamps, and processing metadata.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/insurance')}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InsuranceAdmin;
