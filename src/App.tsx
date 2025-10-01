import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuitabilityAnalysis from "./pages/SuitabilityAnalysis";
import Landing from "./pages/Landing";
import PublicLanding from "./pages/PublicLanding";
import Dashboard from "./pages/Dashboard";
import Environment from "./pages/Environment";
import Agriculture from "./pages/Agriculture";
import UrbanPlanning from "./pages/UrbanPlanning";
import DisasterManagement from "./pages/DisasterManagement";
import DataUpload from "./pages/DataUpload";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import InsuranceEmptyPlot from "./pages/InsuranceEmptyPlot";
import InsuranceHomeReady from "./pages/InsuranceHomeReady";
import InsurancePostDisaster from "./pages/InsurancePostDisaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/site-suitability" element={<SuitabilityAnalysis />} />
          <Route path="/about" element={<PublicLanding />} />
          <Route path="/suitability" element={<Navigate to="/site-suitability" replace />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/pricing" element={<Pricing />} />
          <Route path="/app/billing" element={<Billing />} />
          <Route path="/app/environment" element={<Environment />} />
          <Route path="/app/agriculture" element={<Agriculture />} />
          <Route path="/app/urban-planning" element={<UrbanPlanning />} />
          <Route path="/app/disaster-management" element={<DisasterManagement />} />
          <Route path="/app/data" element={<DataUpload />} />
          <Route path="/insurance/empty-plot" element={<InsuranceEmptyPlot />} />
          <Route path="/insurance/home-ready" element={<InsuranceHomeReady />} />
          <Route path="/insurance/post-disaster" element={<InsurancePostDisaster />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
