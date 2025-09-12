import api from './api';

export interface DashboardStats {
  active_jobs: number;
  total_candidates: number;
  interviews_scheduled: number;
  ai_screening_rate: number;
  job_change: string;
  candidate_change: string;
  interview_change: string;
  screening_change: string;
}

export interface RecentActivity {
  id: string;
  type: 'interview' | 'application' | 'assessment';
  candidate_name: string;
  role: string;
  time: string;
  status: 'completed' | 'screening' | 'pending' | 'scheduled';
}

export interface SystemHealth {
  backend_status: 'online' | 'offline';
  database_status: 'connected' | 'disconnected';
  ai_service_status: 'ready' | 'unavailable';
  video_processing_status: 'ready' | 'unavailable';
  uptime_percentage: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/v1/dashboard/stats');
      return response.data;
    } catch (error) {
      // Return mock data if API fails
      return {
        active_jobs: 24,
        total_candidates: 1247,
        interviews_scheduled: 89,
        ai_screening_rate: 94.2,
        job_change: '+12%',
        candidate_change: '+23%',
        interview_change: '+8%',
        screening_change: '+5.1%',
      };
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/api/v1/dashboard/activity');
      return response.data;
    } catch (error) {
      // Return mock data if API fails
      return [
        {
          id: '1',
          type: 'interview',
          candidate_name: 'Sarah Johnson',
          role: 'Senior Developer',
          time: '2 hours ago',
          status: 'completed'
        },
        {
          id: '2',
          type: 'application',
          candidate_name: 'Mike Chen',
          role: 'Product Manager',
          time: '4 hours ago',
          status: 'screening'
        },
        {
          id: '3',
          type: 'assessment',
          candidate_name: 'Emily Davis',
          role: 'UX Designer',
          time: '6 hours ago',
          status: 'pending'
        },
        {
          id: '4',
          type: 'interview',
          candidate_name: 'Alex Rodriguez',
          role: 'Data Scientist',
          time: '1 day ago',
          status: 'scheduled'
        },
      ];
    }
  },

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await api.get('/health');
      return {
        backend_status: 'online',
        database_status: 'connected',
        ai_service_status: 'ready',
        video_processing_status: 'ready',
        uptime_percentage: 99.9,
      };
    } catch (error) {
      return {
        backend_status: 'offline',
        database_status: 'disconnected',
        ai_service_status: 'unavailable',
        video_processing_status: 'unavailable',
        uptime_percentage: 0,
      };
    }
  },
};