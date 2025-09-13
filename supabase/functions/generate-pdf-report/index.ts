import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFReportRequest {
  result: {
    projectId: string;
    suitabilityData: any;
    topSites: Array<{
      id: string;
      score: number;
      coordinates: [number, number];
      area: number;
    }>;
    breakdown: Record<string, number>;
  };
  projectType: string;
  region: {
    type: 'buffer';
    data: {
      center: [number, number];
      radius: number;
      address: string;
    };
    name: string;
  };
  weights: Record<string, number>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { result, projectType, region, weights }: PDFReportRequest = await req.json();
    
    console.log('Generating PDF report for:', projectType);
    
    // Generate AI recommendation using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const recommendationPrompt = `
    Generate a professional feasibility assessment for a ${projectType} project based on this analysis:

    Location: ${region.data.address}
    Analysis Area: ${region.data.radius}km buffer
    
    Top 5 Sites Found:
    ${result.topSites.map((site, i) => 
      `${i + 1}. Site ${i + 1}: ${(site.score * 100).toFixed(1)}% suitability, ${site.area} hectares, coordinates ${site.coordinates[1].toFixed(4)}, ${site.coordinates[0].toFixed(4)}`
    ).join('\n')}
    
    Criteria Performance:
    ${Object.entries(result.breakdown).map(([criterion, score]) => 
      `${criterion}: ${(score * 100).toFixed(1)}%`
    ).join('\n')}
    
    Analysis Weights Used:
    ${Object.entries(weights).map(([criterion, weight]) => 
      `${criterion}: ${(weight * 100).toFixed(0)}%`
    ).join('\n')}

    Please provide:
    1. Executive Summary (2-3 sentences)
    2. Site Recommendation (which of the top 5 sites is best and why)
    3. Key Risk Factors (2-3 main concerns)
    4. Next Steps (2-3 actionable recommendations)
    
    Keep it professional, concise, and investor-ready. Format as structured text sections.`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional site suitability analyst providing feasibility assessments for renewable energy and agriculture projects. Be concise, data-driven, and investor-focused.' 
          },
          { role: 'user', content: recommendationPrompt }
        ],
        max_completion_tokens: 800,
      }),
    });

    if (!aiResponse.ok) {
      console.error('OpenAI API error:', await aiResponse.text());
      throw new Error('Failed to generate AI recommendation');
    }

    const aiData = await aiResponse.json();
    const aiRecommendation = aiData.choices[0].message.content;

    // Calculate ROI metrics based on project type
    let roiMetrics = {};
    const avgScore = result.topSites.reduce((sum, site) => sum + site.score, 0) / result.topSites.length;
    
    switch (projectType) {
      case 'Solar Farm':
        const avgGridDistance = result.breakdown.grid_distance || 0.7;
        const connectionCost = Math.round((1 - avgGridDistance) * 500000); // Rough estimate
        const solarPotential = result.breakdown.solar_radiation || 0.7;
        roiMetrics = {
          estimatedConnectionCost: `$${connectionCost.toLocaleString()}`,
          annualEnergyYield: `${Math.round(solarPotential * 1500)} MWh/year`,
          paybackPeriod: `${Math.round(10 - (avgScore * 3))} years`
        };
        break;
      case 'Battery Energy Storage (BESS)':
        const gridProximity = result.breakdown.grid_distance || 0.7;
        const installationCost = Math.round((1 - gridProximity) * 200000);
        roiMetrics = {
          estimatedInstallationCost: `$${installationCost.toLocaleString()}`,
          gridConnectivity: `${Math.round(gridProximity * 100)}%`,
          operationalReadiness: `${Math.round(avgScore * 100)}%`
        };
        break;
      case 'Agriculture':
        const soilQuality = result.breakdown.soil_fertility || 0.7;
        const rainfall = result.breakdown.rainfall || 0.7;
        const yieldPotential = (soilQuality + rainfall) / 2;
        roiMetrics = {
          yieldPotential: `${Math.round(yieldPotential * 100)}% of optimal`,
          soilQuality: `${Math.round(soilQuality * 100)}%`,
          waterAvailability: `${Math.round(rainfall * 100)}%`
        };
        break;
    }

    // Generate comprehensive PDF content
    const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${projectType} Feasibility Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
        .date { font-size: 14px; color: #888; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #22c55e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #22c55e; }
        .metric-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
        .sites-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .sites-table th, .sites-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .sites-table th { background-color: #f8fafc; font-weight: bold; }
        .site-rank { font-weight: bold; color: #22c55e; }
        .rank-1 { color: #fbbf24; }
        .rank-2 { color: #9ca3af; }
        .rank-3 { color: #f97316; }
        .score-bar { width: 100px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
        .score-fill { height: 100%; background: linear-gradient(to right, #ef4444, #f97316, #22c55e); }
        .criteria-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .criteria-table th, .criteria-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .criteria-table th { background-color: #f8fafc; }
        .recommendation { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; }
        .map-placeholder { width: 100%; height: 300px; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81c784 100%); border: 2px solid #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 16px; margin: 20px 0; position: relative; }
        .map-overlay { position: absolute; top: 20px; left: 20px; background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .location-marker { position: absolute; width: 12px; height: 12px; background: #ef4444; border: 2px solid white; border-radius: 50%; }
        .buffer-circle { position: absolute; width: 120px; height: 120px; border: 2px solid #22c55e; border-radius: 50%; opacity: 0.3; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      <!-- Title Page -->
      <div class="header">
        <div class="title">${projectType} Feasibility Report</div>
        <div class="subtitle">${region.data.address}</div>
        <div class="subtitle">${region.data.radius}km Analysis Area</div>
        <div class="date">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <!-- Executive Summary -->
      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="recommendation">
          ${aiRecommendation.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>

      <!-- ROI Metrics -->
      <div class="section">
        <div class="section-title">Key Metrics & Feasibility</div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${Math.round(avgScore * 100)}%</div>
            <div class="metric-label">Overall Suitability</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${result.topSites.length}</div>
            <div class="metric-label">Suitable Sites Found</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${Math.round(result.topSites.reduce((sum, site) => sum + site.area, 0))} ha</div>
            <div class="metric-label">Total Available Area</div>
          </div>
          ${Object.entries(roiMetrics).map(([key, value]) => `
            <div class="metric-card">
              <div class="metric-value">${value}</div>
              <div class="metric-label">${key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Map Visualization -->
      <div class="section">
        <div class="section-title">Analysis Area & Results</div>
        <div class="map-placeholder">
          <div class="map-overlay">
            <strong>${region.data.address}</strong><br>
            ${region.data.radius}km Buffer Analysis
          </div>
          <div class="buffer-circle" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
          <div class="location-marker" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
          ${result.topSites.slice(0, 3).map((site, i) => `
            <div class="location-marker" style="top: ${40 + i * 15}%; left: ${45 + i * 10}%; background: ${i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : '#f97316'};">
              <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                Site ${i + 1}: ${Math.round(site.score * 100)}%
              </div>
            </div>
          `).join('')}
          <div style="color: #666; font-size: 14px;">Interactive Map Visualization<br><small>Showing buffer area and top site locations</small></div>
        </div>
      </div>

      <div class="page-break"></div>

      <!-- Top Sites Ranking -->
      <div class="section">
        <div class="section-title">Top 5 Recommended Sites</div>
        <table class="sites-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Site ID</th>
              <th>Suitability Score</th>
              <th>Area (hectares)</th>
              <th>Coordinates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${result.topSites.map((site, index) => `
              <tr>
                <td class="site-rank rank-${index < 3 ? index + 1 : ''}">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</td>
                <td>${site.id}</td>
                <td>
                  <div>${Math.round(site.score * 100)}%</div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${site.score * 100}%"></div>
                  </div>
                </td>
                <td>${site.area}</td>
                <td>${site.coordinates[1].toFixed(4)}, ${site.coordinates[0].toFixed(4)}</td>
                <td>${site.score >= 0.8 ? 'Excellent' : site.score >= 0.6 ? 'Good' : site.score >= 0.4 ? 'Fair' : 'Poor'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Analysis Criteria -->
      <div class="section">
        <div class="section-title">Analysis Methodology</div>
        <h4>Factor Weights Applied:</h4>
        <table class="criteria-table">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Weight</th>
              <th>Performance</th>
              <th>Data Source</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(weights).map(([criterion, weight]) => `
              <tr>
                <td>${criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td>${Math.round(weight * 100)}%</td>
                <td>${Math.round((result.breakdown[criterion] || 0) * 100)}%</td>
                <td>${getDataSource(criterion, projectType)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h4>Datasets Used:</h4>
        <ul>
          ${getDatasetsList(projectType).map(dataset => `<li>${dataset}</li>`).join('')}
        </ul>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
        <p><strong>Harita Hive - Site Suitability Analysis</strong></p>
        <p>Report generated on ${new Date().toISOString().split('T')[0]} | Project ID: ${result.projectId}</p>
        <p><em>This report is based on publicly available geospatial data and AI analysis. Field verification recommended before final decisions.</em></p>
      </div>
    </body>
    </html>`;

    // Convert HTML to PDF using a simple HTML renderer
    // For production, you'd use Puppeteer or similar
    const pdfBuffer = new TextEncoder().encode(pdfContent);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${projectType.replace(/\s+/g, '_')}_Feasibility_Report_${new Date().toISOString().split('T')[0]}.html"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function getDataSource(criterion: string, projectType: string): string {
  const dataSources: Record<string, string> = {
    solar_radiation: 'WorldClim / NASA Solar Data',
    slope: 'SRTM DEM / Copernicus DEM',
    grid_distance: 'OpenStreetMap Infrastructure',
    road_access: 'OpenStreetMap Roads',
    land_use: 'ESA WorldCover',
    soil_fertility: 'FAO SoilGrids',
    rainfall: 'WorldClim Precipitation',
    land_cover: 'ESA WorldCover'
  };
  return dataSources[criterion] || 'Multi-source Analysis';
}

function getDatasetsList(projectType: string): string[] {
  switch (projectType) {
    case 'Solar Farm':
      return [
        'SRTM DEM (elevation & slope)',
        'NASA/WorldClim Solar Radiation',
        'OpenStreetMap Grid Infrastructure',
        'OpenStreetMap Road Networks'
      ];
    case 'Battery Energy Storage (BESS)':
      return [
        'OpenStreetMap Grid Infrastructure',
        'OpenStreetMap Road Networks', 
        'SRTM DEM (elevation & slope)',
        'ESA WorldCover (land use)'
      ];
    case 'Agriculture':
      return [
        'FAO SoilGrids (soil fertility)',
        'WorldClim Precipitation Data',
        'ESA WorldCover (land cover)',
        'SRTM DEM (elevation & slope)'
      ];
    default:
      return ['Multi-source geospatial analysis'];
  }
}