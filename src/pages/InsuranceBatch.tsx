import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.jpg';

const InsuranceBatch = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a CSV file."
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} ready for processing`
      });
    }
  };

  const handleProcessBatch = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a CSV file first."
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Processing Batch",
      description: "Analyzing portfolio risk for all addresses..."
    });

    try {
      // Read CSV file
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse addresses (skip header row)
      const addresses = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return {
          address: values[0],
          city: values[1] || '',
          state: values[2] || '',
          zip: values[3] || '',
          insuranceType: values[4] || 'home'
        };
      });

      // Process each address (in production, this would be batched)
      let highRisk = 0;
      let mediumRisk = 0;
      let lowRisk = 0;

      // For demo, simulate risk distribution
      addresses.forEach(() => {
        const randomScore = Math.random() * 100;
        if (randomScore >= 70) highRisk++;
        else if (randomScore >= 40) mediumRisk++;
        else lowRisk++;
      });

      setResults({
        totalAddresses: addresses.length,
        processed: addresses.length,
        highRisk,
        mediumRisk,
        lowRisk
      });
      
      toast({
        title: "Batch Complete",
        description: `Successfully analyzed ${addresses.length} properties`
      });
    } catch (error: any) {
      console.error('Batch processing error:', error);
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: error.message || "Failed to process CSV file"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "address,city,state,zip_code,insurance_type\n" +
      "123 Main St,New York,NY,10001,home\n" +
      "456 Oak Ave,Los Angeles,CA,90001,mortgage\n" +
      "789 Pine Rd,Chicago,IL,60601,vehicle";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insurance_batch_template.csv';
    a.click();
    
    toast({
      title: "Template Downloaded",
      description: "CSV template downloaded successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/insurance">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Harita Hive" className="h-10 w-10 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Batch Risk Analysis</h1>
                  <p className="text-xs text-muted-foreground">Portfolio-level insurance risk assessment</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="hidden md:flex items-center gap-2">
              <Upload className="h-3 w-3" />
              Batch Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>How Batch Analysis Works</CardTitle>
              <CardDescription>
                Upload a CSV file with multiple addresses to analyze insurance risks across your entire portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Download Template</p>
                    <p className="text-xs text-muted-foreground">Get our CSV template with required fields</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fill & Upload</p>
                    <p className="text-xs text-muted-foreground">Add your addresses and upload CSV</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Get Results</p>
                    <p className="text-xs text-muted-foreground">Download reports and risk scores</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CSV File</CardTitle>
              <CardDescription>
                Select a CSV file containing addresses for batch risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">Click to upload CSV</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>

              <Button 
                onClick={handleProcessBatch} 
                disabled={!selectedFile || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Processing {selectedFile?.name}...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Process Batch Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Batch Analysis Results</CardTitle>
                <CardDescription>
                  Portfolio-level risk summary for {results.totalAddresses} addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                     <div className="flex items-center gap-2 mb-1">
                       <AlertCircle className="h-4 w-4 text-destructive" />
                       <span className="text-sm font-medium text-destructive">High Risk</span>
                     </div>
                     <p className="text-2xl font-bold text-destructive">{results.highRisk}</p>
                   </div>
                   <div className="p-4 rounded-lg bg-accent/20 border border-accent/40">
                     <div className="flex items-center gap-2 mb-1">
                       <AlertCircle className="h-4 w-4 text-accent-foreground" />
                       <span className="text-sm font-medium">Medium Risk</span>
                     </div>
                     <p className="text-2xl font-bold text-accent-foreground">{results.mediumRisk}</p>
                   </div>
                   <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                     <div className="flex items-center gap-2 mb-1">
                       <CheckCircle2 className="h-4 w-4 text-primary" />
                       <span className="text-sm font-medium text-primary">Low Risk</span>
                     </div>
                     <p className="text-2xl font-bold text-primary">{results.lowRisk}</p>
                   </div>
                 </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default InsuranceBatch;
