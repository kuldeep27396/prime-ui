/**
 * Prime Interviews API Service
 * Comprehensive service for all backend API interactions
 * Integrates with the tested backend endpoints
 */
import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  async getAuthHeaders(getToken) {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Generic request method
  async request(endpoint, options = {}, requireAuth = true) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error);
      throw error;
    }
  }

  // ==============
  // HEALTH & STATUS
  // ==============

  async getHealth() {
    return this.request('/health', {}, false);
  }

  async getRoot() {
    return this.request('/', {}, false);
  }

  // ==============
  // EMAIL SERVICE
  // ==============

  async sendEmail({ to, toName, subject, html }) {
    return this.request('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({ to, toName, subject, html })
    }, false);
  }

  // ==============
  // USER MANAGEMENT
  // ==============

  async createUser(userData, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });
  }

  async getUser(userId, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request(`/api/users/${userId}`, { headers });
  }

  async getUserAnalytics(userId, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request(`/api/users/${userId}/analytics`, { headers });
  }

  // ==============
  // MENTOR MANAGEMENT
  // ==============

  async getMentors(params = {}, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/mentors${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, { headers });
  }

  async getMentor(mentorId, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request(`/api/mentors/${mentorId}`, { headers });
  }

  async searchMentors(searchParams, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    const params = {
      page: searchParams.page || 1,
      limit: searchParams.limit || 20,
      ...(searchParams.skills && { skills: Array.isArray(searchParams.skills) ? searchParams.skills.join(',') : searchParams.skills }),
      ...(searchParams.companies && { companies: Array.isArray(searchParams.companies) ? searchParams.companies.join(',') : searchParams.companies }),
      ...(searchParams.rating_min && { rating_min: searchParams.rating_min }),
      ...(searchParams.price_min && { price_min: searchParams.price_min }),
      ...(searchParams.price_max && { price_max: searchParams.price_max }),
      ...(searchParams.experience_min && { experience_min: searchParams.experience_min }),
      ...(searchParams.languages && { languages: Array.isArray(searchParams.languages) ? searchParams.languages.join(',') : searchParams.languages }),
      ...(searchParams.search && { search: searchParams.search })
    };

    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/mentors?${queryString}`, { headers });
  }

  // ==============
  // SESSION MANAGEMENT
  // ==============

  async createSession(sessionData, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request('/api/sessions', {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData)
    });
  }

  async getSessions(params = {}, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/sessions${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, { headers });
  }

  async updateSession(sessionId, updateData, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });
  }

  async cancelSession(sessionId, reason, getToken) {
    return this.updateSession(sessionId, {
      status: 'cancelled',
      cancellationReason: reason
    }, getToken);
  }

  async completeSession(sessionId, rating, feedback, getToken) {
    return this.updateSession(sessionId, {
      status: 'completed',
      rating,
      feedback
    }, getToken);
  }

  // ==============
  // VIDEO ROOM MANAGEMENT
  // ==============

  async createVideoRoom(roomData, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request('/api/rooms', {
      method: 'POST',
      headers,
      body: JSON.stringify(roomData)
    });
  }

  async getRoomStatus(roomId, getToken) {
    const headers = await this.getAuthHeaders(getToken);
    return this.request(`/api/rooms/${roomId}/status`, { headers });
  }

  // ==============
  // CONVENIENCE METHODS
  // ==============

  // Book an interview session with mentor
  async bookInterview({ mentorId, sessionType, scheduledAt, duration, meetingType, recordSession, specialRequests, participantEmail, participantName }, getToken) {
    const sessionData = {
      mentorId,
      sessionType,
      scheduledAt,
      duration,
      meetingType: meetingType || 'video',
      recordSession: recordSession || false,
      specialRequests: specialRequests || '',
      participantEmail,
      participantName
    };

    // Create session
    const session = await this.createSession(sessionData, getToken);

    // Create video room if it's a video session
    if (meetingType === 'video' && session.success) {
      const roomData = {
        sessionId: session.session.id,
        duration,
        participantName,
        mentorName: 'Mentor', // This should come from mentor data
        recordSession
      };

      try {
        const room = await this.createVideoRoom(roomData, getToken);
        session.videoRoom = room;
      } catch (error) {
        console.warn('Video room creation failed:', error);
      }
    }

    return session;
  }

  // Get user dashboard data
  async getDashboardData(userId, getToken) {
    try {
      const [userProfile, analytics, sessions] = await Promise.all([
        this.getUser(userId, getToken),
        this.getUserAnalytics(userId, getToken),
        this.getSessions({ status: 'upcoming', limit: 5 }, getToken)
      ]);

      return {
        profile: userProfile.profile,
        analytics,
        upcomingSessions: sessions.sessions || []
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      throw error;
    }
  }

  // Search mentors with advanced filtering
  async findMentors(filters = {}) {
    const searchParams = {
      page: 1,
      limit: 20,
      ...filters
    };

    return this.searchMentors(searchParams);
  }
}

// Create singleton instance
export const apiService = new APIService();

// Hook for using API service with Clerk authentication
export const useAPIService = () => {
  const { getToken } = useAuth();

  return {
    // Health endpoints
    getHealth: () => apiService.getHealth(),
    getRoot: () => apiService.getRoot(),

    // Email
    sendEmail: (emailData) => apiService.sendEmail(emailData),

    // Users
    createUser: (userData) => apiService.createUser(userData, getToken),
    getUser: (userId) => apiService.getUser(userId, getToken),
    getUserAnalytics: (userId) => apiService.getUserAnalytics(userId, getToken),

    // Mentors
    getMentors: (params) => apiService.getMentors(params, getToken),
    getMentor: (mentorId) => apiService.getMentor(mentorId, getToken),
    searchMentors: (searchParams) => apiService.searchMentors(searchParams, getToken),
    findMentors: (filters) => apiService.findMentors(filters, getToken),

    // Sessions
    createSession: (sessionData) => apiService.createSession(sessionData, getToken),
    getSessions: (params) => apiService.getSessions(params, getToken),
    updateSession: (sessionId, updateData) => apiService.updateSession(sessionId, updateData, getToken),
    cancelSession: (sessionId, reason) => apiService.cancelSession(sessionId, reason, getToken),
    completeSession: (sessionId, rating, feedback) => apiService.completeSession(sessionId, rating, feedback, getToken),

    // Video Rooms
    createVideoRoom: (roomData) => apiService.createVideoRoom(roomData, getToken),
    getRoomStatus: (roomId) => apiService.getRoomStatus(roomId, getToken),

    // Convenience methods
    bookInterview: (interviewData) => apiService.bookInterview(interviewData, getToken),
    getDashboardData: (userId) => apiService.getDashboardData(userId, getToken),

    // Direct API service access for custom calls
    apiService
  };
};

export default apiService;