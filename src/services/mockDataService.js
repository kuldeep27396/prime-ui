/**
 * Mock Data Service for Guest Users
 * Provides realistic demo data when users are not authenticated
 */

// Mock mentors data
export const mockMentors = [
  {
    id: 'mentor-1',
    name: 'Sarah Chen',
    expertise: ['React', 'Node.js', 'System Design'],
    experience: '8 years at Google, Meta',
    rating: 4.9,
    price: '$120/hour',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL', 'AWS'],
    bio: 'Senior Software Engineer with expertise in full-stack development and system design. Previously at Google and Meta.',
    availableSlots: ['2024-01-15T10:00:00Z', '2024-01-15T14:00:00Z', '2024-01-16T09:00:00Z']
  },
  {
    id: 'mentor-2',
    name: 'Alex Rodriguez',
    expertise: ['Python', 'Machine Learning', 'Data Science'],
    experience: '6 years at Microsoft, Amazon',
    rating: 4.8,
    price: '$100/hour',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Docker', 'Kubernetes'],
    bio: 'ML Engineer specializing in computer vision and NLP. Experience building production ML systems.',
    availableSlots: ['2024-01-15T13:00:00Z', '2024-01-16T10:00:00Z', '2024-01-16T15:00:00Z']
  },
  {
    id: 'mentor-3',
    name: 'Priya Patel',
    expertise: ['Java', 'Spring Boot', 'Microservices'],
    experience: '7 years at Netflix, Uber',
    rating: 4.9,
    price: '$110/hour',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    skills: ['Java', 'Spring', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL'],
    bio: 'Backend engineer with expertise in distributed systems and high-scale applications.',
    availableSlots: ['2024-01-15T11:00:00Z', '2024-01-15T16:00:00Z', '2024-01-17T09:00:00Z']
  },
  {
    id: 'mentor-4',
    name: 'David Kim',
    expertise: ['iOS', 'Swift', 'Mobile Architecture'],
    experience: '5 years at Apple, Spotify',
    rating: 4.7,
    price: '$95/hour',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    skills: ['Swift', 'iOS', 'SwiftUI', 'Core Data', 'Combine', 'UIKit'],
    bio: 'iOS developer with experience building consumer apps used by millions of users.',
    availableSlots: ['2024-01-15T12:00:00Z', '2024-01-16T11:00:00Z', '2024-01-16T14:00:00Z']
  }
];

// Mock user analytics
export const mockAnalytics = {
  totalSessions: 24,
  averageRating: 4.6,
  totalHours: 48,
  skillsImproved: 8,
  recentSessions: [
    { date: '2024-01-10', mentor: 'Sarah Chen', topic: 'React Hooks', rating: 5 },
    { date: '2024-01-08', mentor: 'Alex Rodriguez', topic: 'Machine Learning', rating: 4 },
    { date: '2024-01-05', mentor: 'Priya Patel', topic: 'System Design', rating: 5 }
  ]
};

// Mock upcoming sessions
export const mockUpcomingSessions = [
  {
    id: 'session-1',
    mentorName: 'Sarah Chen',
    topic: 'React Performance Optimization',
    scheduledAt: '2024-01-15T10:00:00Z',
    duration: 60,
    status: 'confirmed',
    meetingType: 'video'
  },
  {
    id: 'session-2',
    mentorName: 'Alex Rodriguez',
    topic: 'Deep Learning Fundamentals',
    scheduledAt: '2024-01-16T14:00:00Z',
    duration: 90,
    status: 'pending',
    meetingType: 'video'
  }
];

// Mock user profile
export const mockUserProfile = {
  id: 'guest-user',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'guest',
  skillLevel: 'intermediate',
  interests: ['Frontend Development', 'System Design', 'Machine Learning'],
  joinedAt: '2024-01-01T00:00:00Z'
};

// Mock Data Service Class
class MockDataService {
  // Simulate network delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health endpoints
  async getHealth() {
    await this.delay(200);
    return { status: 'healthy', service: 'mock', timestamp: new Date().toISOString() };
  }

  async getRoot() {
    await this.delay(200);
    return { message: 'Prime Interviews API - Mock Mode', version: '1.0.0' };
  }

  // Email (mock - doesn't actually send)
  async sendEmail(emailData) {
    await this.delay(800);
    console.log('Mock email sent:', emailData);
    return { success: true, message: 'Email sent successfully (mock)', messageId: 'mock-' + Date.now() };
  }

  // Users
  async createUser(userData) {
    await this.delay(600);
    return {
      success: true,
      user: { ...mockUserProfile, ...userData, id: 'mock-user-' + Date.now() },
      message: 'User created successfully (mock)'
    };
  }

  async getUser(userId) {
    await this.delay(400);
    return {
      success: true,
      profile: mockUserProfile
    };
  }

  async getUserAnalytics(userId) {
    await this.delay(500);
    return {
      success: true,
      analytics: mockAnalytics
    };
  }

  // Mentors
  async getMentors(params = {}) {
    await this.delay(600);
    const { page = 1, limit = 10, skill, experience } = params;

    let filteredMentors = [...mockMentors];

    if (skill) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    return {
      success: true,
      mentors: filteredMentors.slice(0, limit),
      total: filteredMentors.length,
      page,
      totalPages: Math.ceil(filteredMentors.length / limit)
    };
  }

  async getMentor(mentorId) {
    await this.delay(400);
    const mentor = mockMentors.find(m => m.id === mentorId);
    return {
      success: true,
      mentor: mentor || mockMentors[0]
    };
  }

  async searchMentors(searchParams) {
    await this.delay(700);
    const { query = '', skills = [], page = 1, limit = 10 } = searchParams;

    let results = mockMentors.filter(mentor => {
      const matchesQuery = !query ||
        mentor.name.toLowerCase().includes(query.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()));

      const matchesSkills = skills.length === 0 ||
        skills.some(skill => mentor.skills.includes(skill));

      return matchesQuery && matchesSkills;
    });

    return {
      success: true,
      results: results.slice(0, limit),
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit)
    };
  }

  // Sessions
  async createSession(sessionData) {
    await this.delay(800);
    const newSession = {
      id: 'mock-session-' + Date.now(),
      ...sessionData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      session: newSession,
      message: 'Session created successfully (mock)'
    };
  }

  async getSessions(params = {}) {
    await this.delay(500);
    return {
      success: true,
      sessions: mockUpcomingSessions,
      total: mockUpcomingSessions.length
    };
  }

  async updateSession(sessionId, updateData) {
    await this.delay(600);
    return {
      success: true,
      session: { id: sessionId, ...updateData },
      message: 'Session updated successfully (mock)'
    };
  }

  async cancelSession(sessionId, reason) {
    await this.delay(600);
    return {
      success: true,
      message: 'Session cancelled successfully (mock)',
      sessionId,
      reason
    };
  }

  async completeSession(sessionId, rating, feedback) {
    await this.delay(600);
    return {
      success: true,
      message: 'Session completed successfully (mock)',
      sessionId,
      rating,
      feedback
    };
  }

  // Video Rooms
  async createVideoRoom(roomData) {
    await this.delay(700);
    return {
      success: true,
      room: {
        id: 'mock-room-' + Date.now(),
        roomCode: 'DEMO' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        ...roomData,
        status: 'active'
      }
    };
  }

  async getRoomStatus(roomId) {
    await this.delay(300);
    return {
      success: true,
      room: {
        id: roomId,
        status: 'active',
        participants: ['Demo User', 'Demo Mentor'],
        duration: 45
      }
    };
  }

  // Convenience methods
  async bookInterview(interviewData) {
    await this.delay(1000);

    // Simulate creating session and video room
    const session = await this.createSession(interviewData);

    if (interviewData.meetingType === 'video') {
      const room = await this.createVideoRoom({
        sessionId: session.session.id,
        duration: interviewData.duration,
        participantName: interviewData.participantName || 'Demo User',
        mentorName: 'Demo Mentor'
      });
      session.videoRoom = room;
    }

    return session;
  }

  async getDashboardData(userId) {
    await this.delay(800);

    return {
      profile: mockUserProfile,
      analytics: mockAnalytics,
      upcomingSessions: mockUpcomingSessions
    };
  }

  // Search with filters
  async findMentors(filters = {}) {
    return this.searchMentors({ ...filters, page: 1, limit: 20 });
  }
}

// Create singleton instance
export const mockDataService = new MockDataService();

export default mockDataService;