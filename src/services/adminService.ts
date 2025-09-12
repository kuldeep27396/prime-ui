import api from './api';

export interface Role {
  id: string;
  company_id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyBranding {
  id?: string;
  company_id: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  custom_domain?: string;
  domain_verified: boolean;
  email_header_logo?: string;
  email_footer_text?: string;
  custom_css?: string;
  features: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id: string;
  company_id?: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  content: Record<string, any>;
  template_metadata: Record<string, any>;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating?: number;
  version: string;
  parent_template_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewComment {
  id: string;
  resource_type: string;
  resource_id: string;
  content: string;
  rating?: number;
  tags: string[];
  parent_comment_id?: string;
  thread_id?: string;
  is_private: boolean;
  is_resolved: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface DataExportRequest {
  id: string;
  company_id: string;
  export_type: string;
  format: string;
  filters: Record<string, any>;
  status: string;
  progress: number;
  file_url?: string;
  file_size?: number;
  expires_at?: string;
  error_message?: string;
  retry_count: number;
  requested_by: string;
  created_at: string;
  completed_at?: string;
}

export interface CompanyAnalytics {
  overview: {
    total_jobs: number;
    total_candidates: number;
    total_interviews: number;
    hire_rate: number;
  };
  funnel: {
    applications: number;
    screening: number;
    interviews: number;
    offers: number;
    hires: number;
  };
  performance: {
    avg_time_to_hire: number;
    interview_completion_rate: number;
    candidate_satisfaction: number;
    cost_per_hire: number;
  };
  trends: {
    applications_trend: number[];
    hire_rate_trend: number[];
  };
}

class AdminService {
  // Role Management
  async getRoles(): Promise<Role[]> {
    const response = await api.get('/api/v1/admin/roles');
    return response.data;
  }

  async createRole(roleData: {
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role> {
    const response = await api.post('/api/v1/admin/roles', roleData);
    return response.data;
  }

  async updateRole(roleId: string, roleData: {
    name?: string;
    description?: string;
    permissions?: string[];
  }): Promise<Role> {
    const response = await api.put(`/api/v1/admin/roles/${roleId}`, roleData);
    return response.data;
  }

  async assignRoleToUser(userId: string, assignment: {
    role_id: string;
    expires_at?: string;
    resource_type?: string;
    resource_id?: string;
  }): Promise<void> {
    await api.post(`/api/v1/admin/users/${userId}/roles`, assignment);
  }

  async revokeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await api.delete(`/api/v1/admin/users/${userId}/roles/${roleId}`);
  }

  async getUserPermissions(userId: string): Promise<{ permissions: string[] }> {
    const response = await api.get(`/api/v1/admin/users/${userId}/permissions`);
    return response.data;
  }

  // Company Branding
  async getCompanyBranding(): Promise<CompanyBranding> {
    const response = await api.get('/api/v1/admin/branding');
    return response.data;
  }

  async updateCompanyBranding(brandingData: Partial<CompanyBranding>): Promise<CompanyBranding> {
    const response = await api.put('/api/v1/admin/branding', brandingData);
    return response.data;
  }

  async verifyCustomDomain(domain: string): Promise<{ verified: boolean }> {
    const response = await api.post('/api/v1/admin/branding/verify-domain', { domain });
    return response.data;
  }

  // Template Library
  async getTemplates(params?: {
    template_type?: string;
    include_public?: boolean;
  }): Promise<Template[]> {
    const response = await api.get('/api/v1/admin/templates', { params });
    return response.data;
  }

  async createTemplate(templateData: {
    name: string;
    description?: string;
    type: string;
    category?: string;
    content: Record<string, any>;
    is_public?: boolean;
  }): Promise<Template> {
    const response = await api.post('/api/v1/admin/templates', templateData);
    return response.data;
  }

  async cloneTemplate(templateId: string, newName?: string): Promise<Template> {
    const response = await api.post(`/api/v1/admin/templates/${templateId}/clone`, {
      new_name: newName
    });
    return response.data;
  }

  // Collaborative Reviews
  async addReviewComment(commentData: {
    resource_type: string;
    resource_id: string;
    content: string;
    parent_comment_id?: string;
    rating?: number;
    tags?: string[];
    is_private?: boolean;
  }): Promise<ReviewComment> {
    const response = await api.post('/api/v1/admin/reviews', commentData);
    return response.data;
  }

  async getReviewComments(resourceType: string, resourceId: string): Promise<ReviewComment[]> {
    const response = await api.get(`/api/v1/admin/reviews/${resourceType}/${resourceId}`);
    return response.data;
  }

  // Data Export
  async createExportRequest(exportData: {
    export_type: string;
    format: string;
    filters?: Record<string, any>;
  }): Promise<DataExportRequest> {
    const response = await api.post('/api/v1/admin/exports', exportData);
    return response.data;
  }

  async getExportRequests(): Promise<DataExportRequest[]> {
    const response = await api.get('/api/v1/admin/exports');
    return response.data;
  }

  // Analytics
  async getCompanyAnalytics(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<CompanyAnalytics> {
    const response = await api.get('/api/v1/admin/analytics', { params });
    return response.data;
  }

  // System Management
  async initializeCompanyDefaults(): Promise<{ message: string; roles_created: number }> {
    const response = await api.post('/api/v1/admin/system/init-company');
    return response.data;
  }
}

export const adminService = new AdminService();
export default adminService;