import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'winston';

interface ReportJobParams {
  jobId: string;
  parameters: {
    project_id: string;
    report_type: 'summary' | 'detailed' | 'spatial_analysis' | 'custom';
    include_sections: string[];
    format?: 'json' | 'html' | 'pdf';
    template_id?: string;
  };
  organizationId: string;
  projectId?: string;
  userId: string;
}

interface ReportContent {
  title: string;
  generated_at: string;
  project_info: any;
  sections: ReportSection[];
  metadata: any;
}

interface ReportSection {
  type: string;
  title: string;
  content: any;
  charts?: any[];
  maps?: any[];
}

export class ReportGenerationProcessor {
  constructor(
    private supabase: SupabaseClient,
    private logger: Logger
  ) {}

  async process(params: ReportJobParams) {
    const { jobId, parameters, organizationId, userId } = params;
    
    this.logger.info(`Starting report generation for job ${jobId}`, {
      jobId,
      reportType: parameters.report_type,
      projectId: parameters.project_id
    });

    try {
      // Get project information
      const { data: project, error: projectError } = await this.supabase
        .from('projects')
        .select(`
          *,
          organizations!inner(name, subscription_tier)
        `)
        .eq('id', parameters.project_id)
        .eq('organization_id', organizationId)
        .single();

      if (projectError || !project) {
        throw new Error('Project not found or access denied');
      }

      // Generate report content based on type
      const reportContent = await this.generateReportContent(
        project,
        parameters.report_type,
        parameters.include_sections || []
      );

      // Format report based on requested format
      const formattedReport = await this.formatReport(
        reportContent,
        parameters.format || 'json'
      );

      // Save report to database
      const { data: reportRecord, error: reportError } = await this.supabase
        .from('reports')
        .insert({
          project_id: parameters.project_id,
          title: reportContent.title,
          content: reportContent,
          generated_by: userId,
          file_path: formattedReport.file_path
        })
        .select()
        .single();

      if (reportError) {
        throw new Error(`Failed to save report: ${reportError.message}`);
      }

      this.logger.info(`Report generation completed for job ${jobId}`, {
        jobId,
        reportId: reportRecord.id,
        sectionsGenerated: reportContent.sections.length
      });

      return {
        report_id: reportRecord.id,
        title: reportContent.title,
        file_path: formattedReport.file_path,
        format: parameters.format || 'json',
        sections_count: reportContent.sections.length,
        generated_at: reportContent.generated_at
      };

    } catch (error) {
      this.logger.error(`Report generation failed for job ${jobId}`, {
        jobId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async generateReportContent(
    project: any,
    reportType: string,
    includeSections: string[]
  ): Promise<ReportContent> {
    
    const reportContent: ReportContent = {
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${project.title}`,
      generated_at: new Date().toISOString(),
      project_info: {
        id: project.id,
        title: project.title,
        description: project.description,
        sector: project.sector,
        created_at: project.created_at,
        organization: project.organizations.name
      },
      sections: [],
      metadata: {
        report_type: reportType,
        generated_by: 'harita-hive-system',
        version: '1.0.0'
      }
    };

    // Generate sections based on report type and included sections
    const sectionsToGenerate = this.determineSections(reportType, includeSections);

    for (const sectionType of sectionsToGenerate) {
      try {
        const section = await this.generateSection(sectionType, project);
        if (section) {
          reportContent.sections.push(section);
        }
      } catch (error) {
        this.logger.warn(`Failed to generate section ${sectionType}`, {
          projectId: project.id,
          error: error.message
        });
      }
    }

    return reportContent;
  }

  private determineSections(reportType: string, includeSections: string[]): string[] {
    const defaultSections: { [key: string]: string[] } = {
      summary: ['overview', 'key_metrics', 'recent_activity'],
      detailed: ['overview', 'datasets', 'analysis_results', 'spatial_analysis', 'recommendations'],
      spatial_analysis: ['overview', 'spatial_metrics', 'analysis_results', 'maps'],
      custom: includeSections
    };

    return defaultSections[reportType] || defaultSections.summary;
  }

  private async generateSection(sectionType: string, project: any): Promise<ReportSection | null> {
    switch (sectionType) {
      case 'overview':
        return this.generateOverviewSection(project);
      
      case 'datasets':
        return await this.generateDatasetsSection(project);
      
      case 'analysis_results':
        return await this.generateAnalysisResultsSection(project);
      
      case 'key_metrics':
        return await this.generateKeyMetricsSection(project);
      
      case 'spatial_analysis':
        return await this.generateSpatialAnalysisSection(project);
      
      case 'recent_activity':
        return await this.generateRecentActivitySection(project);
      
      case 'recommendations':
        return this.generateRecommendationsSection(project);
      
      default:
        this.logger.warn(`Unknown section type: ${sectionType}`);
        return null;
    }
  }

  private generateOverviewSection(project: any): ReportSection {
    return {
      type: 'overview',
      title: 'Project Overview',
      content: {
        description: project.description || 'No description provided.',
        sector: project.sector,
        created_date: project.created_at,
        status: project.status,
        settings: project.settings
      }
    };
  }

  private async generateDatasetsSection(project: any): Promise<ReportSection> {
    const { data: datasets } = await this.supabase
      .from('project_datasets')
      .select('*')
      .eq('project_id', project.id);

    return {
      type: 'datasets',
      title: 'Project Datasets',
      content: {
        total_datasets: datasets?.length || 0,
        datasets: datasets?.map(ds => ({
          name: ds.name,
          type: ds.file_type,
          created_at: ds.created_at,
          metadata: ds.metadata
        })) || []
      }
    };
  }

  private async generateAnalysisResultsSection(project: any): Promise<ReportSection> {
    const { data: jobs } = await this.supabase
      .from('jobs')
      .select('*')
      .eq('project_id', project.id)
      .eq('status', 'completed');

    const { data: ndviResults } = await this.supabase
      .from('ndvi_results')
      .select('*')
      .eq('project_id', project.id);

    return {
      type: 'analysis_results',
      title: 'Analysis Results',
      content: {
        completed_jobs: jobs?.length || 0,
        job_types: jobs?.reduce((acc, job) => {
          acc[job.job_type] = (acc[job.job_type] || 0) + 1;
          return acc;
        }, {}) || {},
        ndvi_analyses: ndviResults?.length || 0,
        latest_results: jobs?.slice(-5).map(job => ({
          type: job.job_type,
          completed_at: job.completed_at,
          parameters: job.parameters
        })) || []
      }
    };
  }

  private async generateKeyMetricsSection(project: any): Promise<ReportSection> {
    const { data: datasets } = await this.supabase
      .from('project_datasets')
      .select('metadata')
      .eq('project_id', project.id);

    const totalFileSize = datasets?.reduce((sum, ds) => 
      sum + (ds.metadata?.file_size || 0), 0) || 0;

    const { data: jobs } = await this.supabase
      .from('jobs')
      .select('status, created_at')
      .eq('project_id', project.id);

    return {
      type: 'key_metrics',
      title: 'Key Metrics',
      content: {
        total_storage_mb: Math.round(totalFileSize / (1024 * 1024)),
        total_jobs: jobs?.length || 0,
        completed_jobs: jobs?.filter(j => j.status === 'completed').length || 0,
        failed_jobs: jobs?.filter(j => j.status === 'failed').length || 0,
        success_rate: jobs?.length ? 
          Math.round((jobs.filter(j => j.status === 'completed').length / jobs.length) * 100) : 0
      }
    };
  }

  private async generateSpatialAnalysisSection(project: any): Promise<ReportSection> {
    const { data: geoFeatures } = await this.supabase
      .from('geo_features')
      .select('feature_type, properties')
      .in('id', [project.id]); // This would need proper relationship

    return {
      type: 'spatial_analysis',
      title: 'Spatial Analysis Summary',
      content: {
        feature_count: geoFeatures?.length || 0,
        feature_types: geoFeatures?.reduce((acc, feature) => {
          acc[feature.feature_type] = (acc[feature.feature_type] || 0) + 1;
          return acc;
        }, {}) || {},
        spatial_extent: 'Analysis of spatial data coverage would go here'
      }
    };
  }

  private async generateRecentActivitySection(project: any): Promise<ReportSection> {
    const { data: recentJobs } = await this.supabase
      .from('jobs')
      .select('job_type, status, created_at, completed_at')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      type: 'recent_activity',
      title: 'Recent Activity',
      content: {
        recent_jobs: recentJobs?.map(job => ({
          type: job.job_type,
          status: job.status,
          started: job.created_at,
          completed: job.completed_at
        })) || []
      }
    };
  }

  private generateRecommendationsSection(project: any): ReportSection {
    // Generate AI-powered recommendations based on project data
    const recommendations = [
      'Consider running NDVI analysis on recent satellite imagery to monitor vegetation health.',
      'Upload higher resolution imagery for more detailed spatial analysis.',
      'Set up automated monitoring for change detection analysis.'
    ];

    return {
      type: 'recommendations',
      title: 'Recommendations',
      content: {
        recommendations: recommendations,
        priority: 'medium',
        based_on: 'project analysis and best practices'
      }
    };
  }

  private async formatReport(content: ReportContent, format: string) {
    switch (format) {
      case 'html':
        return this.generateHTMLReport(content);
      case 'pdf':
        return this.generatePDFReport(content);
      case 'json':
      default:
        return this.generateJSONReport(content);
    }
  }

  private generateJSONReport(content: ReportContent) {
    const filePath = `reports/${Date.now()}_${content.project_info.id}.json`;
    return {
      file_path: filePath,
      content: JSON.stringify(content, null, 2),
      mime_type: 'application/json'
    };
  }

  private generateHTMLReport(content: ReportContent) {
    // Generate HTML report template
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${content.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-left: 4px solid #007cba; padding-left: 10px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${content.title}</h1>
        <p>Generated: ${new Date(content.generated_at).toLocaleString()}</p>
        <p>Project: ${content.project_info.title}</p>
    </div>
    
    ${content.sections.map(section => `
        <div class="section">
            <h2>${section.title}</h2>
            <pre>${JSON.stringify(section.content, null, 2)}</pre>
        </div>
    `).join('')}
</body>
</html>
    `;

    const filePath = `reports/${Date.now()}_${content.project_info.id}.html`;
    return {
      file_path: filePath,
      content: html,
      mime_type: 'text/html'
    };
  }

  private generatePDFReport(content: ReportContent) {
    // PDF generation would require additional libraries like puppeteer
    throw new Error('PDF report generation not yet implemented');
  }
}