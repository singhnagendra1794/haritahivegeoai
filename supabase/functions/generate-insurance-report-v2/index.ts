import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import PdfPrinter from "npm:pdfmake@0.2.7";

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
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
    address?: string;
  }>;
  dataLayers: Record<string, any>;
  isBatch?: boolean;
  batchData?: {
    totalAddresses: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    topRiskiest: Array<{ address: string; score: number }>;
  };
}

const fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
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

  // Build narrative from actual analysis results
  let narrative = `This property has been assessed with a ${riskLevel} Risk Score of ${data.overallRiskScore}/100 for ${projectTypeLabel}. `;
  
  // Add primary risk drivers
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
  
  // Add secondary factors
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
  
  // Generate specific recommendations based on actual risk factors
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

  // Add positive factors
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

  // Add general recommendation
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
  const printer = new PdfPrinter(fonts);
  
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
  const riskColor = data.overallRiskScore >= 70 ? '#dc2626' : 
                    data.overallRiskScore >= 40 ? '#f59e0b' : '#10b981';

  const contributingFactors = generateTopContributingFactors(data);
  const recommendations = generateRecommendations(data);

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    header: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: 'Insurance Risk Intelligence Report', style: 'headerText', alignment: 'left', margin: [40, 20, 0, 0] },
          { text: `Page ${currentPage} of ${pageCount}`, style: 'headerText', alignment: 'right', margin: [0, 20, 40, 0] }
        ]
      };
    },
    
    footer: (currentPage: number) => {
      return {
        text: 'Generated by Harita Hive using geospatial datasets (FEMA, USGS, ESA WorldCover, Sentinel-2, OpenStreetMap). Risk scores are model-derived decision-support tools and not a substitute for on-site inspections or official assessments.',
        style: 'disclaimer',
        margin: [40, 10, 40, 0]
      };
    },

    content: [
      // === PAGE 1: COVER ===
      {
        text: 'INSURANCE RISK INTELLIGENCE REPORT',
        style: 'coverTitle',
        margin: [0, 80, 0, 10]
      },
      {
        text: projectTypeLabels[data.projectType],
        style: 'coverSubtitle',
        margin: [0, 0, 0, 40]
      },
      
      // Risk Score Display
      {
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                { text: riskLevel, style: 'riskLabel', alignment: 'center', color: riskColor },
                { text: data.overallRiskScore.toString(), style: 'riskScore', alignment: 'center', color: riskColor },
                { text: 'Risk Score (0-100)', style: 'riskSubtext', alignment: 'center' }
              ],
              border: [false, false, false, false],
              fillColor: riskColor + '15',
              margin: [20, 20, 20, 20]
            }
          ]]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 30]
      },

      // Location Details
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Property Address', style: 'coverLabel' },
              { text: data.location.address, style: 'coverValue', margin: [0, 5, 0, 15] },
              { text: 'Coordinates', style: 'coverLabel' },
              { text: `${data.location.coordinates[1].toFixed(6)}°N, ${data.location.coordinates[0].toFixed(6)}°E`, style: 'coverValue', margin: [0, 5, 0, 0] },
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Analysis Date', style: 'coverLabel' },
              { text: currentDate, style: 'coverValue', margin: [0, 5, 0, 15] },
              { text: 'Buffer Radius', style: 'coverLabel' },
              { text: `${data.bufferRadius} km analysis zone`, style: 'coverValue', margin: [0, 5, 0, 0] },
            ]
          }
        ]
      },
      
      { text: '', pageBreak: 'after' },

      // === PAGE 2: EXECUTIVE SUMMARY ===
      { text: 'Executive Summary', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            [{ text: 'Property Address', style: 'tableHeader' }, { text: data.location.address, style: 'tableCell' }],
            [{ text: 'Coordinates', style: 'tableHeader' }, { text: `${data.location.coordinates[1].toFixed(6)}, ${data.location.coordinates[0].toFixed(6)}`, style: 'tableCell' }],
            [{ text: 'Analysis Type', style: 'tableHeader' }, { text: projectTypeLabels[data.projectType], style: 'tableCell' }],
            [{ text: 'Buffer Zone', style: 'tableHeader' }, { text: `${data.bufferRadius} km radius`, style: 'tableCell' }],
            [{ text: 'Risk Classification', style: 'tableHeader' }, { 
              text: riskLevel, 
              style: 'tableCell',
              bold: true,
              color: riskColor,
              fillColor: riskColor + '20'
            }],
            [{ text: 'Overall Risk Score', style: 'tableHeader' }, { 
              text: `${data.overallRiskScore}/100`, 
              style: 'tableCell',
              fontSize: 14,
              bold: true,
              fillColor: data.overallRiskScore >= 70 ? '#fee2e2' : data.overallRiskScore >= 40 ? '#fef3c7' : '#d1fae5'
            }],
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Assessment Summary', style: 'subsectionTitle', margin: [0, 10, 0, 10] },
      {
        text: generateExecutiveSummary(data),
        style: 'summaryText',
        alignment: 'justify',
        margin: [0, 0, 0, 15]
      },

      { text: '', pageBreak: 'after' },

      // === PAGE 3: RISK FACTOR BREAKDOWN ===
      { text: 'Risk Factor Analysis', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      { text: 'Detailed breakdown of all risk factors with real-time geospatial data analysis', style: 'sectionDescription', margin: [0, 0, 0, 20] },
      
      {
        table: {
          widths: ['28%', '12%', '12%', '48%'],
          body: [
            [
              { text: 'Risk Factor', style: 'tableHeader' },
              { text: 'Score', style: 'tableHeader' },
              { text: 'Weight', style: 'tableHeader' },
              { text: 'Analysis Result', style: 'tableHeader' }
            ],
            ...data.factorBreakdown.map(factor => [
              { text: factor.name, style: 'tableCell', bold: true },
              { 
                stack: [
                  { text: `${factor.score}/100`, style: 'tableCell', bold: true, fontSize: 11 },
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0,
                        y: 2,
                        w: (factor.score / 100) * 40,
                        h: 6,
                        r: 2,
                        color: factor.score >= 70 ? '#ef4444' : factor.score >= 40 ? '#f59e0b' : '#10b981'
                      }
                    ]
                  }
                ],
                fillColor: factor.score >= 70 ? '#fee2e2' : factor.score >= 40 ? '#fef3c7' : '#d1fae5'
              },
              { text: `${factor.weight}%`, style: 'tableCell', alignment: 'center' },
              { text: factor.explanation, style: 'tableCell', fontSize: 8 }
            ])
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 20]
      },

      { text: '', pageBreak: 'after' },

      // === PAGE 4: CONTRIBUTING FACTORS ===
      { text: 'Top Contributing Factors', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      { text: 'Primary risk drivers identified through geospatial analysis', style: 'sectionDescription', margin: [0, 0, 0, 20] },
      
      ...contributingFactors.map((item, index) => [
        {
          table: {
            widths: ['*'],
            body: [[
              {
                stack: [
                  { text: `${index + 1}. ${item.factor}`, style: 'factorTitle', margin: [0, 0, 0, 5] },
                  { text: item.explanation, style: 'factorExplanation' }
                ],
                border: [false, false, false, false],
                fillColor: index === 0 ? '#fef3c7' : index === 1 ? '#e0e7ff' : '#fecaca',
                margin: [15, 10, 15, 10]
              }
            ]]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 15]
        }
      ]),

      { text: '', pageBreak: 'after' },

      // === PAGE 5: RECOMMENDATIONS ===
      { text: 'Risk Mitigation Recommendations', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      { text: 'Actionable recommendations based on analysis results', style: 'sectionDescription', margin: [0, 0, 0, 20] },
      
      {
        ul: recommendations.map(rec => ({
          text: rec,
          style: 'recommendationText',
          margin: [0, 0, 0, 10]
        })),
        margin: [0, 0, 0, 20]
      },

      { text: '', pageBreak: 'after' },

      // === PAGE 6: TOP SITES ===
      { text: 'Analyzed Site Rankings', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      { text: 'Top-ranked locations within the analysis buffer zone', style: 'sectionDescription', margin: [0, 0, 0, 20] },
      
      {
        table: {
          widths: ['8%', '22%', '15%', '15%', '40%'],
          body: [
            [
              { text: 'Rank', style: 'tableHeader' },
              { text: 'Site ID', style: 'tableHeader' },
              { text: 'Suitability', style: 'tableHeader' },
              { text: 'Area (ha)', style: 'tableHeader' },
              { text: 'Coordinates', style: 'tableHeader' }
            ],
            ...data.topSites.slice(0, 5).map((site, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
              return [
                { text: `${medal} #${index + 1}`, style: 'tableCell', bold: index < 3, fontSize: index < 3 ? 10 : 9 },
                { text: site.id, style: 'tableCell' },
                { 
                  text: (site.score * 100).toFixed(1) + '%', 
                  style: 'tableCell',
                  bold: index < 3,
                  fillColor: index === 0 ? '#fef3c7' : index === 1 ? '#e0e7ff' : index === 2 ? '#fecaca' : null
                },
                { text: site.area.toFixed(1), style: 'tableCell' },
                { text: `${site.coordinates[1].toFixed(5)}°N, ${site.coordinates[0].toFixed(5)}°E`, style: 'tableCell', fontSize: 8 }
              ];
            })
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        }
      },
    ],

    styles: {
      coverTitle: {
        fontSize: 28,
        bold: true,
        alignment: 'center',
        color: '#1e3a8a'
      },
      coverSubtitle: {
        fontSize: 18,
        alignment: 'center',
        color: '#475569'
      },
      riskLabel: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      riskScore: {
        fontSize: 48,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      riskSubtext: {
        fontSize: 11,
        color: '#64748b'
      },
      coverLabel: {
        fontSize: 9,
        color: '#64748b',
        bold: true,
        uppercase: true
      },
      coverValue: {
        fontSize: 11,
        color: '#1e293b'
      },
      sectionTitle: {
        fontSize: 18,
        bold: true,
        color: '#1e3a8a'
      },
      subsectionTitle: {
        fontSize: 14,
        bold: true,
        color: '#334155'
      },
      sectionDescription: {
        fontSize: 10,
        color: '#64748b',
        italics: true
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        color: '#1e293b',
        fillColor: '#f3f4f6'
      },
      tableCell: {
        fontSize: 9,
        color: '#1e293b'
      },
      summaryText: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.6
      },
      factorTitle: {
        fontSize: 11,
        bold: true,
        color: '#1e293b'
      },
      factorExplanation: {
        fontSize: 9,
        color: '#475569',
        lineHeight: 1.5
      },
      recommendationText: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.5
      },
      disclaimer: {
        fontSize: 7,
        color: '#94a3b8',
        italics: true,
        alignment: 'center',
        lineHeight: 1.3
      },
      headerText: {
        fontSize: 8,
        color: '#64748b'
      }
    },

    defaultStyle: {
      font: 'Roboto'
    }
  };

  // Add batch portfolio section if applicable
  if (data.isBatch && data.batchData) {
    docDefinition.content.push(
      { text: '', pageBreak: 'before' },
      { text: 'Portfolio Analysis Summary', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      { text: `Aggregated risk assessment across ${data.batchData.totalAddresses} properties`, style: 'sectionDescription', margin: [0, 0, 0, 20] },
      
      {
        columns: [
          {
            width: '25%',
            stack: [
              { text: data.batchData.totalAddresses.toString(), fontSize: 32, bold: true, color: '#1e3a8a', alignment: 'center' },
              { text: 'Total Properties', fontSize: 9, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: data.batchData.highRisk.toString(), fontSize: 32, bold: true, color: '#dc2626', alignment: 'center' },
              { text: 'High Risk', fontSize: 9, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] },
              { text: `${((data.batchData.highRisk / data.batchData.totalAddresses) * 100).toFixed(1)}%`, fontSize: 8, color: '#dc2626', alignment: 'center', margin: [0, 2, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: data.batchData.mediumRisk.toString(), fontSize: 32, bold: true, color: '#f59e0b', alignment: 'center' },
              { text: 'Medium Risk', fontSize: 9, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] },
              { text: `${((data.batchData.mediumRisk / data.batchData.totalAddresses) * 100).toFixed(1)}%`, fontSize: 8, color: '#f59e0b', alignment: 'center', margin: [0, 2, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: data.batchData.lowRisk.toString(), fontSize: 32, bold: true, color: '#10b981', alignment: 'center' },
              { text: 'Low Risk', fontSize: 9, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] },
              { text: `${((data.batchData.lowRisk / data.batchData.totalAddresses) * 100).toFixed(1)}%`, fontSize: 8, color: '#10b981', alignment: 'center', margin: [0, 2, 0, 0] }
            ]
          }
        ],
        margin: [0, 0, 0, 30]
      },

      { text: 'Top 10 Highest Risk Properties', style: 'subsectionTitle', margin: [0, 20, 0, 15] },
      {
        table: {
          widths: ['10%', '60%', '30%'],
          body: [
            [
              { text: 'Rank', style: 'tableHeader' },
              { text: 'Address', style: 'tableHeader' },
              { text: 'Risk Score', style: 'tableHeader' }
            ],
            ...data.batchData.topRiskiest.slice(0, 10).map((prop, index) => [
              { text: `#${index + 1}`, style: 'tableCell', bold: index < 3 },
              { text: prop.address, style: 'tableCell' },
              { 
                text: `${prop.score}/100`, 
                style: 'tableCell',
                fillColor: prop.score >= 70 ? '#fee2e2' : prop.score >= 40 ? '#fef3c7' : '#d1fae5',
                bold: true
              }
            ])
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        }
      }
    );
  }

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Uint8Array[] = [];
      
      pdfDoc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
      pdfDoc.on('error', reject);
      
      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
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
      riskScore: data.overallRiskScore
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
