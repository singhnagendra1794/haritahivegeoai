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
import InsuranceLanding from './pages/InsuranceLanding';
import InsuranceMortgage from './pages/InsuranceMortgage';
import InsuranceHome from './pages/InsuranceHome';
import InsuranceVehicle from './pages/InsuranceVehicle';
import InsuranceBatch from './pages/InsuranceBatch';
import InsuranceEmptyPlot from "./pages/InsuranceEmptyPlot";
import InsuranceHomeReady from "./pages/InsuranceHomeReady";
import InsurancePostDisaster from "./pages/InsurancePostDisaster";
import InsuranceTriage from "./pages/InsuranceTriage";
import InsurancePortfolio from "./pages/InsurancePortfolio";
import InsuranceAdmin from "./pages/InsuranceAdmin";
import InsuranceClaimsDashboard from "./pages/InsuranceClaimsDashboard";

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
          
          {/* New Insurance Routes */}
          <Route path="/insurance" element={<InsuranceLanding />} />
          <Route path="/insurance/claims-dashboard" element={<InsuranceClaimsDashboard />} />
          <Route path="/insurance/mortgage" element={<InsuranceMortgage />} />
          <Route path="/insurance/home" element={<InsuranceHome />} />
          <Route path="/insurance/vehicle" element={<InsuranceVehicle />} />
          <Route path="/insurance/batch" element={<InsuranceBatch />} />
          <Route path="/insurance/triage" element={<InsuranceTriage />} />
          <Route path="/insurance/portfolio" element={<InsurancePortfolio />} />
          <Route path="/insurance/admin" element={<InsuranceAdmin />} />
          
          {/* Legacy Insurance Routes (kept for backwards compatibility) */}
          <Route path="/insurance/empty-plot" element={<InsuranceEmptyPlot />} />
          <Route path="/insurance/home-ready" element={<InsuranceHomeReady />} />
          <Route path="/insurance/post-disaster" element={<InsurancePostDisaster />} />
          
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
