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
  riskScore: number;
  factors: Array<{
    name: string;
    score: number;
    weight: number;
  }>;
  topSites: Array<{
    id: string;
    score: number;
    coordinates: [number, number];
    area: number;
    address?: string;
  }>;
  mapImageBase64?: string;
  isBatch?: boolean;
  batchData?: {
    totalAddresses: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
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
  const riskLevel = data.riskScore >= 70 ? 'High' : data.riskScore >= 40 ? 'Moderate' : 'Low';
  const topFactors = [...data.factors]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(f => f.name);
  
  const projectTypeLabel = {
    mortgage: 'mortgage insurance',
    home: 'home insurance',
    vehicle: 'vehicle insurance'
  }[data.projectType];

  return `This property has a ${riskLevel} Risk Score (${data.riskScore}/100) for ${projectTypeLabel}. ` +
    `The primary risk drivers are ${topFactors.join(' and ')}. ` +
    `Analysis conducted within a ${data.bufferRadius} km buffer zone around the target location. ` +
    `Risk assessment is based on multi-source geospatial data including FEMA flood zones, USGS elevation data, ESA WorldCover land classification, and OpenStreetMap infrastructure datasets.`;
}

function generateRecommendations(data: ReportRequest): string[] {
  const recommendations: string[] = [];
  const sortedFactors = [...data.factors].sort((a, b) => b.score - a.score);

  // Add recommendations based on top risk factors
  sortedFactors.slice(0, 3).forEach(factor => {
    if (factor.score >= 70) {
      if (factor.name.toLowerCase().includes('flood')) {
        recommendations.push('Consider additional flood insurance coverage or premium adjustments due to high flood risk exposure.');
      } else if (factor.name.toLowerCase().includes('fire') || factor.name.toLowerCase().includes('wildfire')) {
        recommendations.push('Implement wildfire mitigation measures and maintain defensible space around the property.');
      } else if (factor.name.toLowerCase().includes('roof') || factor.name.toLowerCase().includes('structure')) {
        recommendations.push('Professional structural inspection recommended within 6 months to assess building condition.');
      } else if (factor.name.toLowerCase().includes('road') || factor.name.toLowerCase().includes('traffic')) {
        recommendations.push('Vehicle insurance premiums may be elevated due to high traffic density and accident risk in the area.');
      }
    }
  });

  // Add positive recommendations
  const lowRiskFactors = data.factors.filter(f => f.score < 30);
  if (lowRiskFactors.some(f => f.name.toLowerCase().includes('infrastructure') || f.name.toLowerCase().includes('emergency'))) {
    recommendations.push('Favorable infrastructure access reduces emergency response times, which may positively impact insurance rates.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Overall risk profile is within acceptable ranges. Standard insurance coverage recommended.');
  }

  return recommendations;
}

function generateTopContributingFactors(data: ReportRequest): string {
  const topFactors = [...data.factors]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const explanations = topFactors.map((factor, index) => {
    let explanation = '';
    const name = factor.name.toLowerCase();
    
    if (name.includes('flood')) {
      explanation = `${factor.name}: High risk (${factor.score}/100) due to FEMA flood zone overlay and low elevation relative to nearby water bodies.`;
    } else if (name.includes('fire') || name.includes('wildfire')) {
      explanation = `${factor.name}: Elevated risk (${factor.score}/100) from vegetation density analysis and proximity to wildfire-prone areas.`;
    } else if (name.includes('roof') || name.includes('structure')) {
      explanation = `${factor.name}: Risk score of ${factor.score}/100 based on land cover analysis suggesting older structural condition.`;
    } else if (name.includes('road') || name.includes('traffic')) {
      explanation = `${factor.name}: High traffic density (${factor.score}/100) increases accident probability based on OSM road network analysis.`;
    } else if (name.includes('infrastructure') || name.includes('emergency')) {
      explanation = `${factor.name}: ${factor.score < 50 ? 'Favorable' : 'Limited'} access (${factor.score}/100) to emergency services and critical infrastructure.`;
    } else if (name.includes('slope') || name.includes('elevation') || name.includes('terrain')) {
      explanation = `${factor.name}: Terrain analysis shows ${factor.score >= 50 ? 'challenging' : 'stable'} topography (${factor.score}/100) based on USGS DEM data.`;
    } else {
      explanation = `${factor.name}: Risk score of ${factor.score}/100 based on geospatial data analysis.`;
    }
    
    return explanation;
  }).join('\n\n');

  return explanations;
}

async function generatePDF(data: ReportRequest): Promise<Uint8Array> {
  const printer = new PdfPrinter(fonts);
  
  const projectTypeLabels = {
    mortgage: 'Mortgage Insurance Risk',
    home: 'Home Insurance Risk',
    vehicle: 'Vehicle Insurance Risk'
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate document definition
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    header: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: 'Insurance Risk Report', style: 'headerText', alignment: 'left', margin: [40, 20, 0, 0] },
          { text: `Page ${currentPage} of ${pageCount}`, style: 'headerText', alignment: 'right', margin: [0, 20, 40, 0] }
        ]
      };
    },
    
    footer: (currentPage: number) => {
      return {
        text: 'This report is generated using public geospatial datasets (FEMA, USGS, ESA, OSM, Sentinel-2). Risk scores are model-derived and should be used as decision-support only, not as a substitute for field inspections or official data sources.',
        style: 'disclaimer',
        margin: [40, 10, 40, 0]
      };
    },

    content: [
      // Cover Page
      {
        text: 'INSURANCE RISK REPORT',
        style: 'coverTitle',
        margin: [0, 100, 0, 20]
      },
      {
        text: projectTypeLabels[data.projectType],
        style: 'coverSubtitle',
        margin: [0, 0, 0, 60]
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Location', style: 'coverLabel' },
              { text: data.location.address, style: 'coverValue', margin: [0, 5, 0, 15] },
              { text: 'Coordinates', style: 'coverLabel' },
              { text: `${data.location.coordinates[1].toFixed(6)}, ${data.location.coordinates[0].toFixed(6)}`, style: 'coverValue', margin: [0, 5, 0, 15] },
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Analysis Date', style: 'coverLabel' },
              { text: currentDate, style: 'coverValue', margin: [0, 5, 0, 15] },
              { text: 'Buffer Radius', style: 'coverLabel' },
              { text: `${data.bufferRadius} km`, style: 'coverValue', margin: [0, 5, 0, 15] },
            ]
          }
        ]
      },
      { text: '', pageBreak: 'after' },

      // Executive Summary
      { text: 'Executive Summary', style: 'sectionTitle', margin: [0, 0, 0, 15] },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            [{ text: 'Address', style: 'tableHeader' }, { text: data.location.address, style: 'tableCell' }],
            [{ text: 'Coordinates', style: 'tableHeader' }, { text: `${data.location.coordinates[1].toFixed(6)}, ${data.location.coordinates[0].toFixed(6)}`, style: 'tableCell' }],
            [{ text: 'Project Type', style: 'tableHeader' }, { text: projectTypeLabels[data.projectType], style: 'tableCell' }],
            [{ text: 'Buffer Radius', style: 'tableHeader' }, { text: `${data.bufferRadius} km`, style: 'tableCell' }],
            [{ text: 'Overall Risk Score', style: 'tableHeader' }, { 
              text: `${data.riskScore}/100`, 
              style: 'tableCell',
              fillColor: data.riskScore >= 70 ? '#fee2e2' : data.riskScore >= 40 ? '#fef3c7' : '#d1fae5'
            }],
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? '#f3f4f6' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 15]
      },
      {
        text: generateExecutiveSummary(data),
        style: 'summaryText',
        margin: [0, 0, 0, 20]
      },

      // Map Visualization
      { text: 'Map Visualization', style: 'sectionTitle', margin: [0, 20, 0, 15] },
      data.mapImageBase64 ? {
        image: data.mapImageBase64,
        width: 500,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      } : {
        text: '[Map visualization requires Mapbox token configuration]',
        style: 'placeholderText',
        alignment: 'center',
        margin: [0, 40, 0, 40]
      },
      {
        text: 'Risk Heatmap and Top Site Rankings',
        style: 'caption',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },

      // Risk Factor Breakdown
      { text: 'Risk Factor Breakdown', style: 'sectionTitle', margin: [0, 20, 0, 15] },
      {
        table: {
          widths: ['30%', '15%', '15%', '40%'],
          body: [
            [
              { text: 'Risk Factor', style: 'tableHeader' },
              { text: 'Score', style: 'tableHeader' },
              { text: 'Weight', style: 'tableHeader' },
              { text: 'Visual', style: 'tableHeader' }
            ],
            ...data.factors.map(factor => [
              { text: factor.name, style: 'tableCell' },
              { text: `${factor.score}/100`, style: 'tableCell', fillColor: factor.score >= 70 ? '#fee2e2' : factor.score >= 40 ? '#fef3c7' : '#d1fae5' },
              { text: `${factor.weight}%`, style: 'tableCell' },
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 5,
                    w: (factor.score / 100) * 180,
                    h: 10,
                    color: factor.score >= 70 ? '#ef4444' : factor.score >= 40 ? '#f59e0b' : '#10b981'
                  }
                ]
              }
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? '#f3f4f6' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 20]
      },

      // Top Contributing Factors
      { text: 'Top Contributing Factors', style: 'sectionTitle', margin: [0, 20, 0, 15] },
      {
        text: generateTopContributingFactors(data),
        style: 'bodyText',
        margin: [0, 0, 0, 20]
      },

      // Recommendations
      { text: 'Recommendations', style: 'sectionTitle', margin: [0, 20, 0, 15] },
      {
        ul: generateRecommendations(data),
        style: 'bodyText',
        margin: [0, 0, 0, 20]
      },

      // Top Sites
      { text: 'Top Ranked Sites', style: 'sectionTitle', margin: [0, 20, 0, 15] },
      {
        table: {
          widths: ['10%', '25%', '20%', '20%', '25%'],
          body: [
            [
              { text: 'Rank', style: 'tableHeader' },
              { text: 'Site ID', style: 'tableHeader' },
              { text: 'Score', style: 'tableHeader' },
              { text: 'Area (ha)', style: 'tableHeader' },
              { text: 'Coordinates', style: 'tableHeader' }
            ],
            ...data.topSites.slice(0, 5).map((site, index) => [
              { text: `#${index + 1}`, style: 'tableCell', bold: index < 3 },
              { text: site.id, style: 'tableCell' },
              { 
                text: site.score.toFixed(2), 
                style: 'tableCell',
                fillColor: index === 0 ? '#fef3c7' : index === 1 ? '#e0e7ff' : index === 2 ? '#fecaca' : null
              },
              { text: site.area.toFixed(1), style: 'tableCell' },
              { text: `${site.coordinates[1].toFixed(4)}, ${site.coordinates[0].toFixed(4)}`, style: 'tableCell', fontSize: 8 }
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? '#f3f4f6' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        }
      },
    ],

    styles: {
      coverTitle: {
        fontSize: 32,
        bold: true,
        alignment: 'center',
        color: '#1e3a8a'
      },
      coverSubtitle: {
        fontSize: 20,
        alignment: 'center',
        color: '#64748b'
      },
      coverLabel: {
        fontSize: 10,
        color: '#64748b',
        bold: true
      },
      coverValue: {
        fontSize: 12,
        color: '#1e293b'
      },
      sectionTitle: {
        fontSize: 16,
        bold: true,
        color: '#1e3a8a',
        margin: [0, 15, 0, 10]
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: '#1e293b',
        fillColor: '#f3f4f6'
      },
      tableCell: {
        fontSize: 10,
        color: '#1e293b'
      },
      summaryText: {
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.5,
        alignment: 'justify'
      },
      bodyText: {
        fontSize: 10,
        color: '#475569',
        lineHeight: 1.4
      },
      caption: {
        fontSize: 9,
        color: '#64748b',
        italics: true
      },
      disclaimer: {
        fontSize: 7,
        color: '#94a3b8',
        italics: true,
        alignment: 'center'
      },
      headerText: {
        fontSize: 9,
        color: '#64748b'
      },
      placeholderText: {
        fontSize: 11,
        color: '#94a3b8',
        italics: true
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
      {
        columns: [
          {
            width: '25%',
            stack: [
              { text: `${data.batchData.totalAddresses}`, fontSize: 24, bold: true, color: '#1e3a8a', alignment: 'center' },
              { text: 'Total Properties', fontSize: 10, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: `${data.batchData.highRisk}`, fontSize: 24, bold: true, color: '#dc2626', alignment: 'center' },
              { text: 'High Risk', fontSize: 10, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: `${data.batchData.mediumRisk}`, fontSize: 24, bold: true, color: '#f59e0b', alignment: 'center' },
              { text: 'Medium Risk', fontSize: 10, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            width: '25%',
            stack: [
              { text: `${data.batchData.lowRisk}`, fontSize: 24, bold: true, color: '#10b981', alignment: 'center' },
              { text: 'Low Risk', fontSize: 10, color: '#64748b', alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
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
    
    console.log('Generating insurance risk report:', {
      projectType: data.projectType,
      location: data.location.address
    });

    const pdfBytes = await generatePDF(data);
    
    const filename = `Insurance_Risk_Report_${data.projectType}_${Date.now()}.pdf`;

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
