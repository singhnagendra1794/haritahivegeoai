import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const url = new URL(req.url);
    const reportId = url.searchParams.get('report_id');
    const projectId = url.searchParams.get('project_id');
    const format = url.searchParams.get('format') || 'json';

    if (!reportId && !projectId) {
      throw new Error('Missing required parameter: report_id or project_id');
    }

    let query = supabase
      .from('reports')
      .select(`
        id,
        project_id,
        title,
        content,
        file_path,
        created_at,
        generated_by,
        projects!inner(
          id,
          title,
          organization_id,
          organizations!inner(name, subscription_tier)
        )
      `);

    if (reportId) {
      query = query.eq('id', reportId);
    } else if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: reports, error: reportError } = await query;

    if (reportError || !reports || reports.length === 0) {
      throw new Error('Report not found');
    }

    const report = reports[0];

    // Check if user has access to this report's project
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', report.projects.organization_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      throw new Error('User not authorized to access this report');
    }

    // Generate report content based on format
    let responseContent: string;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case 'pdf':
        // TODO: Generate PDF report
        throw new Error('PDF export not yet implemented');
        
      case 'csv':
        // Generate CSV for tabular data
        if (report.content && typeof report.content === 'object') {
          responseContent = generateCSV(report.content);
          contentType = 'text/csv';
          filename = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
        } else {
          throw new Error('Report data not suitable for CSV export');
        }
        break;
        
      case 'geojson':
        // Generate GeoJSON for spatial data
        if (report.content && report.content.features) {
          responseContent = JSON.stringify(report.content, null, 2);
          contentType = 'application/geo+json';
          filename = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.geojson`;
        } else {
          throw new Error('Report data not suitable for GeoJSON export');
        }
        break;
        
      case 'json':
      default:
        // JSON format
        const reportData = {
          id: report.id,
          title: report.title,
          project: {
            id: report.projects.id,
            title: report.projects.title,
            organization: report.projects.organizations.name
          },
          content: report.content,
          generated_at: report.created_at,
          generated_by: report.generated_by
        };
        
        responseContent = JSON.stringify(reportData, null, 2);
        contentType = 'application/json';
        filename = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        break;
    }

    // Track download usage
    await supabase.rpc('track_usage', {
      org_id: report.projects.organization_id,
      resource_type: 'api_calls',
      quantity: 1,
      resource_id: report.id,
      metadata: {
        endpoint: 'download-report',
        format: format,
        report_title: report.title
      }
    });

    console.log(`Downloaded report ${report.id} in ${format} format`);

    return new Response(responseContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error in download-report function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

function generateCSV(data: any): string {
  // Simple CSV generation for nested objects
  const rows: string[] = [];
  
  function flattenObject(obj: any, prefix = ''): any {
    const flattened: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = JSON.stringify(obj[key]);
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  if (Array.isArray(data)) {
    if (data.length > 0) {
      const flattened = data.map(item => flattenObject(item));
      const headers = Object.keys(flattened[0]);
      
      rows.push(headers.join(','));
      
      flattened.forEach(item => {
        const values = headers.map(header => {
          const value = item[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        rows.push(values.join(','));
      });
    }
  } else {
    const flattened = flattenObject(data);
    const headers = Object.keys(flattened);
    const values = Object.values(flattened);
    
    rows.push(headers.join(','));
    rows.push(values.map(v => v || '').join(','));
  }
  
  return rows.join('\n');
}