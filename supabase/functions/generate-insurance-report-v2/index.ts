import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsPDF } from "npm:jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  projectType: 'mortgage' | 'home' | 'vehicle';
  location: {
    address: string;
    coordinates: [number, number];
  };
  bufferRadius: number;
  overallRiskScore: number;
  factorBreakdown: Array<{
    name: string;
    score: number;
    weight: number;
    explanation: string;
    metadata: any;
  }>;
  topSites?: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
    address?: string;
  }>;
  dataLayers?: Record<string, any>;
  isBatch?: boolean;
  batchData?: {
    totalAddresses: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    topRiskiest: Array<{ address: string; score: number }>;
  };
  changeDetection?: {
    damageFlag: boolean;
    changeScore: number;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    changeType: string[];
    damagePercentage: number;
  };
  mapImageUrl?: string;
}

// Color scheme for branding
const COLORS = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  dark: '#1f2937',
};

function generateExecutiveSummary(data: ReportRequest): string {
  const riskLevel = data.overallRiskScore >= 70 ? 'High' : 
                    data.overallRiskScore >= 40 ? 'Moderate' : 'Low';
  
  const topFactors = [...data.factorBreakdown]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  const projectTypeLabel = {
    mortgage: 'mortgage insurance underwriting',
    home: 'home insurance coverage',
    vehicle: 'vehicle insurance assessment'
  }[data.projectType];

  let narrative = `This property has been assessed with a ${riskLevel} Risk Score of ${data.overallRiskScore}/100 for ${projectTypeLabel}. `;
  
  if (topFactors.length > 0) {
    const primaryFactor = topFactors[0];
    narrative += `The primary risk driver is ${primaryFactor.name} (${primaryFactor.score}/100), `;
    
    if (primaryFactor.metadata.floodZone) {
      narrative += `with the property located in FEMA Flood Zone ${primaryFactor.metadata.floodZone}. `;
    } else if (primaryFactor.metadata.elevation !== undefined) {
      narrative += `with an elevation of ${primaryFactor.metadata.elevation}m above sea level. `;
    } else if (primaryFactor.metadata.roadCount !== undefined) {
      narrative += `with ${primaryFactor.metadata.roadCount} roads within the analysis buffer indicating ${primaryFactor.metadata.roadCount > 40 ? 'high' : 'moderate'} traffic density. `;
    }
  }
  
  if (topFactors.length > 1) {
    const secondaryFactors = topFactors.slice(1).map(f => `${f.name} (${f.score}/100)`).join(' and ');
    narrative += `Secondary risk factors include ${secondaryFactors}. `;
  }
  
  narrative += `This analysis was conducted using a ${data.bufferRadius} km buffer zone and incorporates data from FEMA flood maps, USGS elevation datasets, ESA WorldCover land classification, and OpenStreetMap infrastructure databases.`;
  
  return narrative;
}

function generateRecommendations(data: ReportRequest): string[] {
  const recommendations: string[] = [];
  const sortedFactors = [...data.factorBreakdown].sort((a, b) => b.score - a.score);
  const highRiskFactors = sortedFactors.filter(f => f.score >= 60);
  
  highRiskFactors.forEach(factor => {
    const lowerName = factor.name.toLowerCase();
    
    if (lowerName.includes('flood')) {
      if (factor.metadata.floodZone === 'AE' || factor.metadata.floodZone === 'A') {
        recommendations.push(`Critical: Property is in FEMA High-Risk Flood Zone ${factor.metadata.floodZone}. Flood insurance is mandatory for federally backed mortgages. Consider premium adjustments of 15-25%.`);
      } else if (factor.score >= 60) {
        recommendations.push(`Elevated flood risk detected (${factor.score}/100). Recommend additional flood coverage rider and structural flood mitigation assessment.`);
      }
    } else if (lowerName.includes('fire') || lowerName.includes('wildfire')) {
      if (factor.metadata.vegetationDensity > 60) {
        recommendations.push(`High wildfire risk due to ${factor.metadata.vegetationDensity}% vegetation density. Recommend defensible space maintenance (100ft clearance) and fire-resistant landscaping. Consider 10-20% premium adjustment.`);
      }
    } else if (lowerName.includes('roof') || lowerName.includes('structure')) {
      recommendations.push(`Structural assessment recommended within 6 months. Current roof condition proxy score: ${factor.score}/100. Consider roof age verification and wind resistance certification.`);
    } else if (lowerName.includes('road') || lowerName.includes('traffic')) {
      if (factor.metadata.roadCount > 40) {
        recommendations.push(`High traffic density area (${factor.metadata.roadCount} roads in buffer zone). Vehicle insurance premiums may increase 15-20%. Recommend collision coverage enhancement.`);
      }
    } else if (lowerName.includes('elevation') || lowerName.includes('slope')) {
      if (factor.metadata.elevation < 10) {
        recommendations.push(`Low elevation (${factor.metadata.elevation}m) increases flood vulnerability. Foundation assessment and flood proofing measures recommended.`);
      } else if (factor.metadata.elevation > 100) {
        recommendations.push(`Elevated terrain (${factor.metadata.elevation}m) may affect accessibility and structural stability. Geotechnical survey recommended.`);
      }
    }
  });

  const lowRiskFactors = sortedFactors.filter(f => f.score < 35);
  if (lowRiskFactors.length > 0) {
    lowRiskFactors.slice(0, 2).forEach(factor => {
      const lowerName = factor.name.toLowerCase();
      if (lowerName.includes('infrastructure') || lowerName.includes('emergency')) {
        if (factor.metadata.nearbyFeatures > 15) {
          recommendations.push(`Favorable: Excellent infrastructure access with ${factor.metadata.nearbyFeatures} emergency service facilities within 5km. May qualify for 5-10% premium reduction.`);
        }
      } else if (lowerName.includes('flood') && factor.score < 30) {
        recommendations.push(`Favorable: Low flood risk profile. Property qualifies for preferred flood insurance rates.`);
      }
    });
  }

  if (data.overallRiskScore < 40) {
    recommendations.push('Overall risk profile is favorable. Standard insurance coverage with competitive rates recommended.');
  } else if (data.overallRiskScore > 70) {
    recommendations.push('High-risk property. Comprehensive coverage with enhanced liability limits strongly recommended. Consider additional risk mitigation investments.');
  }

  return recommendations;
}

function generateTopContributingFactors(data: ReportRequest): { factor: string; explanation: string }[] {
  return data.factorBreakdown
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(factor => ({
      factor: `${factor.name}: ${factor.score}/100 (Weight: ${factor.weight}%)`,
      explanation: factor.explanation
    }));
}

async function generatePDF(data: ReportRequest): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const projectTypeLabels = {
    mortgage: 'Mortgage Insurance Risk Analysis',
    home: 'Home Insurance Risk Analysis',
    vehicle: 'Vehicle Insurance Risk Analysis'
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const riskLevel = data.overallRiskScore >= 70 ? 'HIGH RISK' : 
                    data.overallRiskScore >= 40 ? 'MODERATE RISK' : 'LOW RISK';
  const riskColor = data.overallRiskScore >= 70 ? COLORS.danger : 
                    data.overallRiskScore >= 40 ? COLORS.warning : COLORS.success;

  const contributingFactors = generateTopContributingFactors(data);
  const recommendations = generateRecommendations(data);
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Helper functions
  const addHeader = (title: string) => {
    doc.setFillColor(COLORS.primary);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Harita Hive GeoAI - Insurance Risk Intelligence', margin, 10);
  };

  const addFooter = (pageNum: number) => {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const footerText = 'Generated by Harita Hive GeoAI using geospatial datasets (FEMA, USGS, ESA, Sentinel-2, OSM). Decision-support tool only.';
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center', maxWidth: pageWidth - 40 });
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 25) {
      doc.addPage();
      addHeader('Insurance Risk Report');
      yPos = 25;
      return true;
    }
    return false;
  };

  const drawBarChart = (x: number, y: number, width: number, height: number, factors: any[]) => {
    const barHeight = 12;
    const spacing = 8;
    let currentY = y;

    factors.forEach((factor, idx) => {
      if (idx >= 6) return;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(x, currentY, width, barHeight, 'F');
      
      const barWidth = (factor.score / 100) * (width - 60);
      const barColor = factor.score >= 70 ? COLORS.danger : 
                       factor.score >= 40 ? COLORS.warning : COLORS.success;
      doc.setFillColor(barColor);
      doc.rect(x + 60, currentY, barWidth, barHeight, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.text(factor.name.substring(0, 20), x + 2, currentY + 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${factor.score}`, x + width - 15, currentY + 8);
      
      currentY += barHeight + spacing;
    });
  };

  // === PAGE 1: COVER PAGE ===
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(255, 255, 255);
  doc.rect(margin, 40, pageWidth - 2 * margin, 60, 'F');
  doc.setTextColor(COLORS.primary);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('HARITA HIVE', pageWidth / 2, 60, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('GeoAI Insurance Risk Intelligence', pageWidth / 2, 75, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INSURANCE RISK', pageWidth / 2, 130, { align: 'center' });
  doc.text('INTELLIGENCE REPORT', pageWidth / 2, 145, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(projectTypeLabels[data.projectType], pageWidth / 2, 160, { align: 'center' });

  doc.setFillColor(riskColor);
  doc.roundedRect(pageWidth / 2 - 40, 180, 80, 50, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(riskLevel, pageWidth / 2, 195, { align: 'center' });
  doc.setFontSize(32);
  doc.text(data.overallRiskScore.toString(), pageWidth / 2, 215, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Risk Score (0-100)', pageWidth / 2, 225, { align: 'center' });

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 245, pageWidth - 2 * margin, 30, 3, 3, 'F');
  doc.setTextColor(COLORS.dark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Address:', margin + 5, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location.address, margin + 5, 262, { maxWidth: pageWidth - 2 * margin - 10 });
  doc.setFont('helvetica', 'bold');
  doc.text('Report Generated:', margin + 5, 270);
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, margin + 50, 270);

  // === PAGE 2: EXECUTIVE SUMMARY ===
  doc.addPage();
  addHeader('Executive Summary');
  yPos = 25;

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPos);
  yPos += 12;

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(COLORS.grayLight);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 45, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(COLORS.dark);
  doc.setFont('helvetica', 'bold');
  let infoY = yPos + 8;
  doc.text('Property Address:', margin + 5, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location.address, margin + 50, infoY);
  
  infoY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Coordinates:', margin + 5, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.location.coordinates[1].toFixed(6)}°N, ${data.location.coordinates[0].toFixed(6)}°E`, margin + 50, infoY);
  
  infoY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Type:', margin + 5, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(projectTypeLabels[data.projectType], margin + 50, infoY);
  
  infoY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Buffer Zone:', margin + 5, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.bufferRadius} km analysis radius`, margin + 50, infoY);
  
  infoY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Classification:', margin + 5, infoY);
  doc.setTextColor(riskColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`${riskLevel} (${data.overallRiskScore}/100)`, margin + 50, infoY);

  yPos += 50;

  doc.setTextColor(COLORS.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Summary', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryText = generateExecutiveSummary(data);
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // === PAGE 3: RISK FACTOR BREAKDOWN ===
  doc.addPage();
  addHeader('Risk Factor Analysis');
  yPos = 25;

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Factor Analysis', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.text('Detailed breakdown with real-time geospatial data analysis', margin, yPos);
  yPos += 10;

  drawBarChart(margin, yPos, pageWidth - 2 * margin, 120, data.factorBreakdown.sort((a, b) => b.score - a.score));
  yPos += 130;

  checkPageBreak(80);
  doc.setFontSize(12);
  doc.setTextColor(COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Factor Analysis', margin, yPos);
  yPos += 8;

  data.factorBreakdown.forEach((factor, idx) => {
    checkPageBreak(25);
    
    const boxColor = factor.score >= 70 ? COLORS.dangerLight : 
                     factor.score >= 40 ? COLORS.warningLight : COLORS.successLight;
    doc.setFillColor(boxColor);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${factor.name} - ${factor.score}/100 (Weight: ${factor.weight}%)`, margin + 3, yPos + 7);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const explLines = doc.splitTextToSize(factor.explanation, pageWidth - 2 * margin - 6);
    doc.text(explLines, margin + 3, yPos + 13);
    
    yPos += 25;
  });

  // === PAGE 4: CHANGE DETECTION (if available) ===
  if (data.changeDetection) {
    doc.addPage();
    addHeader('Change Detection Analysis');
    yPos = 25;

    doc.setFontSize(18);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Change Detection Analysis', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setTextColor(COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.text('Automated before/after analysis for claims workflow', margin, yPos);
    yPos += 12;

    doc.setFillColor(data.changeDetection.damageFlag ? COLORS.dangerLight : COLORS.successLight);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text('Damage Status:', margin + 5, yPos + 10);
    doc.setTextColor(data.changeDetection.damageFlag ? COLORS.danger : COLORS.success);
    doc.text(data.changeDetection.damageFlag ? 'DAMAGE DETECTED' : 'NO DAMAGE', margin + 50, yPos + 10);
    
    doc.setTextColor(COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text('Change Score:', margin + 5, yPos + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.changeDetection.changeScore}/100`, margin + 50, yPos + 20);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Damage Percentage:', margin + 5, yPos + 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.changeDetection.damagePercentage.toFixed(1)}%`, margin + 50, yPos + 30);

    yPos += 45;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Detected Changes:', margin, yPos);
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    data.changeDetection.changeType.forEach((change) => {
      doc.text(`• ${change}`, margin + 5, yPos);
      yPos += 5;
    });

    yPos += 10;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.gray);
    doc.text('Note: Change detection uses multi-temporal satellite imagery (Sentinel-2) and SAR analysis.', margin, yPos, {
      maxWidth: pageWidth - 2 * margin
    });
  }

  // === PAGE 5: RECOMMENDATIONS ===
  doc.addPage();
  addHeader('Risk Mitigation Recommendations');
  yPos = 25;

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Mitigation Recommendations', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.text('Actionable recommendations based on geospatial analysis', margin, yPos);
  yPos += 12;

  recommendations.forEach((rec, idx) => {
    checkPageBreak(20);
    
    doc.setFontSize(9);
    doc.setTextColor(COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}.`, margin, yPos);
    
    doc.setFont('helvetica', 'normal');
    const recLines = doc.splitTextToSize(rec, pageWidth - 2 * margin - 10);
    doc.text(recLines, margin + 8, yPos);
    yPos += recLines.length * 5 + 5;
  });

  // === PAGE 6: PORTFOLIO CONTEXT (if batch) ===
  if (data.isBatch && data.batchData) {
    doc.addPage();
    addHeader('Portfolio Analytics');
    yPos = 25;

    doc.setFontSize(18);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Portfolio Risk Distribution', margin, yPos);
    yPos += 12;

    const boxWidth = (pageWidth - 2 * margin - 20) / 3;
    
    doc.setFillColor(COLORS.dangerLight);
    doc.roundedRect(margin, yPos, boxWidth, 30, 3, 3, 'F');
    doc.setFontSize(20);
    doc.setTextColor(COLORS.danger);
    doc.setFont('helvetica', 'bold');
    doc.text(data.batchData.highRisk.toString(), margin + boxWidth / 2, yPos + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(COLORS.dark);
    doc.text('High Risk', margin + boxWidth / 2, yPos + 23, { align: 'center' });

    doc.setFillColor(COLORS.warningLight);
    doc.roundedRect(margin + boxWidth + 10, yPos, boxWidth, 30, 3, 3, 'F');
    doc.setFontSize(20);
    doc.setTextColor(COLORS.warning);
    doc.setFont('helvetica', 'bold');
    doc.text(data.batchData.mediumRisk.toString(), margin + boxWidth + 10 + boxWidth / 2, yPos + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(COLORS.dark);
    doc.text('Medium Risk', margin + boxWidth + 10 + boxWidth / 2, yPos + 23, { align: 'center' });

    doc.setFillColor(COLORS.successLight);
    doc.roundedRect(margin + 2 * boxWidth + 20, yPos, boxWidth, 30, 3, 3, 'F');
    doc.setFontSize(20);
    doc.setTextColor(COLORS.success);
    doc.setFont('helvetica', 'bold');
    doc.text(data.batchData.lowRisk.toString(), margin + 2 * boxWidth + 20 + boxWidth / 2, yPos + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(COLORS.dark);
    doc.text('Low Risk', margin + 2 * boxWidth + 20 + boxWidth / 2, yPos + 23, { align: 'center' });

    yPos += 40;

    doc.setFontSize(12);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 10 Riskiest Properties', margin, yPos);
    yPos += 10;

    data.batchData.topRiskiest.slice(0, 10).forEach((prop, idx) => {
      checkPageBreak(8);
      doc.setFontSize(9);
      doc.setTextColor(COLORS.dark);
      doc.setFont('helvetica', 'normal');
      doc.text(`${idx + 1}. ${prop.address}`, margin + 5, yPos);
      doc.setFont('helvetica', 'bold');
      const scoreColor = prop.score >= 70 ? COLORS.danger : prop.score >= 40 ? COLORS.warning : COLORS.success;
      doc.setTextColor(scoreColor);
      doc.text(prop.score.toString(), pageWidth - margin - 15, yPos);
      yPos += 6;
    });
  }

  // === PAGE 7: DATA PROVENANCE ===
  doc.addPage();
  addHeader('Data Provenance & Compliance');
  yPos = 25;

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Data Provenance & Compliance', margin, yPos);
  yPos += 12;

  const datasets = [
    { name: 'FEMA Flood Maps', version: 'NFHL 2024', source: 'FEMA Flood Map Service API', usage: 'Flood zone classification' },
    { name: 'USGS DEM', version: '1 Arc-Second', source: 'USGS National Map', usage: 'Elevation & slope analysis' },
    { name: 'Sentinel-2 Imagery', version: 'Level-2A (2024)', source: 'ESA Copernicus', usage: 'NDVI & vegetation analysis' },
    { name: 'ESA WorldCover', version: '2021 v200', source: 'ESA', usage: 'Land cover classification' },
    { name: 'OpenStreetMap', version: 'Latest', source: 'OSM Contributors', usage: 'Infrastructure & POI data' },
    { name: 'NOAA Weather Data', version: 'Real-time', source: 'NOAA', usage: 'Climate risk indicators' },
  ];

  doc.setFontSize(10);
  doc.setTextColor(COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Dataset Sources', margin, yPos);
  yPos += 8;

  datasets.forEach((dataset) => {
    checkPageBreak(18);
    doc.setFillColor(COLORS.grayLight);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 16, 2, 2, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(dataset.name, margin + 3, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Version: ${dataset.version} | Source: ${dataset.source}`, margin + 3, yPos + 10);
    doc.text(`Usage: ${dataset.usage}`, margin + 3, yPos + 14);
    
    yPos += 20;
  });

  yPos += 5;

  doc.setFillColor(COLORS.primaryLight);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Harita Hive GeoAI Risk Pipeline', margin + 5, yPos + 8);
  doc.setFontSize(8);
  doc.setTextColor(COLORS.dark);
  doc.setFont('helvetica', 'normal');
  doc.text(`Version: 2.1.0 | Analysis Date: ${currentDate}`, margin + 5, yPos + 14);
  doc.text('Methodology: Multi-factor weighted scoring with geospatial ML models', margin + 5, yPos + 19);

  yPos += 30;

  doc.setFontSize(10);
  doc.setTextColor(COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance & Disclaimer', margin, yPos);
  yPos += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'This report augments underwriting and claims workflows by reducing manual GIS workload by 80-90%. It provides decision-support based on geospatial intelligence and should be used in conjunction with traditional underwriting practices. Risk scores are model-derived estimates and do not replace on-site property inspections, official flood zone determinations, or professional structural assessments. All data sources are publicly available or commercially licensed. Report generated in compliance with insurance industry data usage standards.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  doc.text(disclaimerLines, margin, yPos);

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) addFooter(i);
  }

  const pdfBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfBuffer);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReportRequest = await req.json();
    
    console.log('Generating production insurance risk report:', {
      projectType: data.projectType,
      location: data.location.address,
      riskScore: data.overallRiskScore,
      hasChangeDetection: !!data.changeDetection,
      isBatch: !!data.isBatch
    });

    const pdfBytes = await generatePDF(data);
    
    const filename = `Insurance_Risk_Report_${data.projectType}_${data.overallRiskScore}_${Date.now()}.pdf`;

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      status: 200
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate PDF report' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
