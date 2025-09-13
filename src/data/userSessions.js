// Mock user-specific data - in a real app this would come from your backend/database

// Example user sessions and bookings
export const userBookings = [
  {
    id: 1,
    mentorId: 1,
    mentorName: "Sarah Chen",
    sessionType: "Mock Technical Interview",
    scheduledTime: "Dec 20, 2024 7:00 PM PST",
    duration: 60,
    status: "confirmed",
    cost: 150,
    meetingLink: "https://meet.example.com/user-session-1",
    notes: "Focus on system design questions for senior engineer role"
  },
  {
    id: 2,
    mentorId: 3,
    mentorName: "Priya Patel",
    sessionType: "Frontend System Design",
    scheduledTime: "Dec 18, 2024 8:00 PM EST",
    duration: 90,
    status: "completed",
    cost: 210,
    feedback: "Great session! Priya provided excellent insights on React architecture patterns.",
    rating: 5
  }
];

// User's favorite mentors
export const userFavorites = [1, 3, 5];

// User's previous search queries and filters (for better UX)
export const userPreferences = {
  recentSearches: ["React", "System Design", "Google interviews"],
  preferredFilters: {
    skills: [],
    priceRange: [0, 300],
    companies: []
  },
  timezone: "PST"
};

// User's completed sessions history
export const userSessionHistory = [
  {
    id: 1,
    mentorId: 2,
    mentorName: "Marcus Rodriguez",
    sessionType: "System Architecture Review",
    completedDate: "Dec 10, 2024",
    duration: 60,
    rating: 5,
    feedback: "Excellent insights on microservices architecture",
    notes: "Discussed scaling strategies for e-commerce platform"
  },
  {
    id: 2,
    mentorId: 4,
    mentorName: "David Kim",
    sessionType: "ML Engineering Interview",
    completedDate: "Nov 28, 2024",
    duration: 90,
    rating: 4,
    feedback: "Good technical depth, helpful for understanding ML system design",
    notes: "Covered recommendation systems and model deployment"
  }
];

// User's interview preparation progress
export const userProgress = {
  completedSessions: 4,
  totalHoursSpent: 6.5,
  skillsWorkedOn: ["System Design", "Algorithms", "React", "Machine Learning"],
  upcomingSessions: 1,
  averageRating: 4.7,
  targetCompanies: ["Google", "Meta", "Netflix"]
};

// Function to get user-specific data based on authentication status
export const getUserData = (isSignedIn, userId = null) => {
  if (!isSignedIn) {
    // Return empty arrays for non-authenticated users
    return {
      bookings: [],
      favorites: [],
      preferences: {
        recentSearches: [],
        preferredFilters: {
          skills: [],
          priceRange: [0, 300],
          companies: []
        },
        timezone: "PST"
      },
      sessionHistory: [],
      progress: {
        completedSessions: 0,
        totalHoursSpent: 0,
        skillsWorkedOn: [],
        upcomingSessions: 0,
        averageRating: 0,
        targetCompanies: []
      }
    };
  }

  // In a real app, you would fetch this data based on userId
  return {
    bookings: userBookings,
    favorites: userFavorites,
    preferences: userPreferences,
    sessionHistory: userSessionHistory,
    progress: userProgress
  };
};