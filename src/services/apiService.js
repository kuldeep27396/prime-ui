/**
 * Prime Interviews API Service
 * Comprehensive service for all backend API interactions
 * Integrates with the tested backend endpoints
 */
import { useAuth } from '@clerk/clerk-react';
import { mockDataService } from './mockDataService';

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
  const { getToken, isSignedIn } = useAuth();

  // Function to safely get authentication token
  const safeGetToken = async () => {
    if (!isSignedIn) return null;
    try {
      return await getToken();
    } catch (error) {
      console.warn('Failed to get auth token, falling back to guest mode:', error);
      return null;
    }
  };

  // Create service methods that fall back to mock data for guest users
  const createServiceMethod = (realMethod, mockMethod) => {
    return async (...args) => {
      if (!isSignedIn) {
        console.log('Guest mode: using mock data');
        return mockMethod(...args);
      }

      try {
        const token = await safeGetToken();
        if (!token) {
          console.log('No auth token available, using mock data');
          return mockMethod(...args);
        }
        return realMethod(...args, () => Promise.resolve(token));
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return mockMethod(...args);
      }
    };
  };

  return {
    // Health endpoints (always use real API for these)
    getHealth: () => apiService.getHealth(),
    getRoot: () => apiService.getRoot(),

    // Email
    sendEmail: createServiceMethod(
      (emailData, getToken) => apiService.sendEmail(emailData),
      (emailData) => mockDataService.sendEmail(emailData)
    ),

    // Users
    createUser: createServiceMethod(
      (userData, getToken) => apiService.createUser(userData, getToken),
      (userData) => mockDataService.createUser(userData)
    ),
    getUser: createServiceMethod(
      (userId, getToken) => apiService.getUser(userId, getToken),
      (userId) => mockDataService.getUser(userId)
    ),
    getUserAnalytics: createServiceMethod(
      (userId, getToken) => apiService.getUserAnalytics(userId, getToken),
      (userId) => mockDataService.getUserAnalytics(userId)
    ),

    // Mentors
    getMentors: createServiceMethod(
      (params, getToken) => apiService.getMentors(params, getToken),
      (params) => mockDataService.getMentors(params)
    ),
    getMentor: createServiceMethod(
      (mentorId, getToken) => apiService.getMentor(mentorId, getToken),
      (mentorId) => mockDataService.getMentor(mentorId)
    ),
    searchMentors: createServiceMethod(
      (searchParams, getToken) => apiService.searchMentors(searchParams, getToken),
      (searchParams) => mockDataService.searchMentors(searchParams)
    ),
    findMentors: createServiceMethod(
      (filters, getToken) => apiService.findMentors(filters, getToken),
      (filters) => mockDataService.findMentors(filters)
    ),

    // Sessions
    createSession: createServiceMethod(
      (sessionData, getToken) => apiService.createSession(sessionData, getToken),
      (sessionData) => mockDataService.createSession(sessionData)
    ),
    getSessions: createServiceMethod(
      (params, getToken) => apiService.getSessions(params, getToken),
      (params) => mockDataService.getSessions(params)
    ),
    updateSession: createServiceMethod(
      (sessionId, updateData, getToken) => apiService.updateSession(sessionId, updateData, getToken),
      (sessionId, updateData) => mockDataService.updateSession(sessionId, updateData)
    ),
    cancelSession: createServiceMethod(
      (sessionId, reason, getToken) => apiService.cancelSession(sessionId, reason, getToken),
      (sessionId, reason) => mockDataService.cancelSession(sessionId, reason)
    ),
    completeSession: createServiceMethod(
      (sessionId, rating, feedback, getToken) => apiService.completeSession(sessionId, rating, feedback, getToken),
      (sessionId, rating, feedback) => mockDataService.completeSession(sessionId, rating, feedback)
    ),

    // Video Rooms
    createVideoRoom: createServiceMethod(
      (roomData, getToken) => apiService.createVideoRoom(roomData, getToken),
      (roomData) => mockDataService.createVideoRoom(roomData)
    ),
    getRoomStatus: createServiceMethod(
      (roomId, getToken) => apiService.getRoomStatus(roomId, getToken),
      (roomId) => mockDataService.getRoomStatus(roomId)
    ),

    // Convenience methods
    bookInterview: createServiceMethod(
      (interviewData, getToken) => apiService.bookInterview(interviewData, getToken),
      (interviewData) => mockDataService.bookInterview(interviewData)
    ),
    getDashboardData: createServiceMethod(
      (userId, getToken) => apiService.getDashboardData(userId, getToken),
      (userId) => mockDataService.getDashboardData(userId)
    ),

    // Meta information
    isGuestMode: !isSignedIn,
    isAuthenticated: isSignedIn,

    // Direct API service access for custom calls
    apiService: isSignedIn ? apiService : mockDataService
  };
};

export default apiService;