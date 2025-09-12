import HeroSection from "@/components/HeroSection";
import ArchitectureOverview from "@/components/ArchitectureOverview";
import TechnologyStack from "@/components/TechnologyStack";
import ScalabilityPatterns from "@/components/ScalabilityPatterns";
import DataIngestionWorkflow from "@/components/DataIngestionWorkflow";
import GeospatialMLFramework from "@/components/GeospatialMLFramework";
import InfrastructureRequirements from "@/components/InfrastructureRequirements";
import ImplementationRoadmap from "@/components/ImplementationRoadmap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ArchitectureOverview />
      <TechnologyStack />
      <ScalabilityPatterns />
      <DataIngestionWorkflow />
      <GeospatialMLFramework />
      <InfrastructureRequirements />
      <ImplementationRoadmap />
      
      <footer className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Harita Hive GeoAI Platform Architecture © 2024 - Scalable, Open-Source, Enterprise-Ready
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
