import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

// Local storage key prefix for user data
const USER_DATA_PREFIX = 'prime_interviews_'

// Default user data structure
const defaultUserData = {
  interviews: [],
  skillAssessments: [
    {
      id: '1',
      skill: 'JavaScript & TypeScript',
      score: 75,
      level: 'Intermediate',
      lastTested: new Date().toISOString().split('T')[0],
      badge: '🟨'
    },
    {
      id: '2',
      skill: 'React & Frontend',
      score: 65,
      level: 'Intermediate',
      lastTested: new Date().toISOString().split('T')[0],
      badge: '⚛️'
    },
    {
      id: '3',
      skill: 'System Design',
      score: 50,
      level: 'Beginner',
      lastTested: new Date().toISOString().split('T')[0],
      badge: '🏗️'
    }
  ],
  preferences: {
    emailNotifications: true,
    theme: 'light',
    timezone: 'UTC'
  },
  profile: {
    role: 'Software Engineer',
    experience: 'Entry Level',
    targetCompanies: [],
    focusAreas: []
  }
}

export const useUserData = () => {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState(defaultUserData)
  const [loading, setLoading] = useState(true)

  // Get user-specific storage key
  const getUserStorageKey = (dataType) => {
    if (!user?.id) return null
    return `${USER_DATA_PREFIX}${user.id}_${dataType}`
  }

  // Load user data from localStorage
  const loadUserData = () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const interviewsKey = getUserStorageKey('interviews')
      const skillsKey = getUserStorageKey('skills')
      const preferencesKey = getUserStorageKey('preferences')
      const profileKey = getUserStorageKey('profile')

      const storedInterviews = localStorage.getItem(interviewsKey)
      const storedSkills = localStorage.getItem(skillsKey)
      const storedPreferences = localStorage.getItem(preferencesKey)
      const storedProfile = localStorage.getItem(profileKey)

      setUserData({
        interviews: storedInterviews ? JSON.parse(storedInterviews) : [],
        skillAssessments: storedSkills ? JSON.parse(storedSkills) : defaultUserData.skillAssessments,
        preferences: storedPreferences ? JSON.parse(storedPreferences) : defaultUserData.preferences,
        profile: storedProfile ? JSON.parse(storedProfile) : {
          ...defaultUserData.profile,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.imageUrl
        }
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setUserData(defaultUserData)
    } finally {
      setLoading(false)
    }
  }

  // Save user data to localStorage
  const saveUserData = (dataType, data) => {
    if (!user?.id) return

    try {
      const storageKey = getUserStorageKey(dataType)
      localStorage.setItem(storageKey, JSON.stringify(data))
      
      setUserData(prev => ({
        ...prev,
        [dataType]: data
      }))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  // Add new interview
  const addInterview = (interview) => {
    const newInterview = {
      ...interview,
      id: Date.now().toString(),
      userId: user?.id,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: new Date().toISOString(),
      status: 'upcoming'
    }
    
    const updatedInterviews = [...userData.interviews, newInterview]
    saveUserData('interviews', updatedInterviews)
    
    // Send email notification if enabled
    if (userData.preferences.emailNotifications) {
      sendEmailNotification(newInterview)
    }
    
    return newInterview
  }

  // Update interview
  const updateInterview = (interviewId, updates) => {
    const updatedInterviews = userData.interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, ...updates, updatedAt: new Date().toISOString() }
        : interview
    )
    saveUserData('interviews', updatedInterviews)
  }

  // Delete interview
  const deleteInterview = (interviewId) => {
    const updatedInterviews = userData.interviews.filter(interview => interview.id !== interviewId)
    saveUserData('interviews', updatedInterviews)
  }

  // Update skill assessment
  const updateSkillAssessment = (skillId, updates) => {
    const updatedSkills = userData.skillAssessments.map(skill =>
      skill.id === skillId 
        ? { ...skill, ...updates, lastTested: new Date().toISOString().split('T')[0] }
        : skill
    )
    saveUserData('skillAssessments', updatedSkills)
  }

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    const updatedPreferences = { ...userData.preferences, ...newPreferences }
    saveUserData('preferences', updatedPreferences)
  }

  // Update user profile
  const updateProfile = (newProfile) => {
    const updatedProfile = { ...userData.profile, ...newProfile }
    saveUserData('profile', updatedProfile)
  }

  // Send email notification (mock implementation)
  const sendEmailNotification = async (interview) => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    try {
      // Mock email service - replace with actual email service like EmailJS, SendGrid, etc.
      const emailData = {
        to: user.primaryEmailAddress.emailAddress,
        subject: `Interview Scheduled: ${interview.title}`,
        message: `
Hello ${user.firstName || 'there'},

Your interview has been scheduled successfully!

📅 Interview Details:
• Title: ${interview.title}
• Company: ${interview.company}
• Type: ${interview.type}
• Duration: ${interview.duration} minutes
• Date: ${new Date(interview.scheduledAt).toLocaleDateString()}
• Time: ${new Date(interview.scheduledAt).toLocaleTimeString()}

💡 Preparation Tips:
• Review the company's recent projects and tech stack
• Practice coding problems related to ${interview.type}
• Prepare questions about the role and team
• Test your video setup 15 minutes before the interview

Good luck with your interview!

Best regards,
Prime Interviews Team
        `
      }

      // Log email data (replace with actual email service call)
      console.log('📧 Email notification sent:', emailData)
      
      // You can integrate with services like:
      // - EmailJS: https://www.emailjs.com/
      // - SendGrid: https://sendgrid.com/
      // - Resend: https://resend.com/
      // - Supabase Edge Functions
      
      return { success: true, message: 'Email notification sent successfully' }
    } catch (error) {
      console.error('Error sending email notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Get user statistics
  const getUserStats = () => {
    const totalInterviews = userData.interviews.length
    const completedInterviews = userData.interviews.filter(i => i.status === 'completed')
    const upcomingInterviews = userData.interviews.filter(i => i.status === 'upcoming')
    const avgScore = completedInterviews.length > 0 
      ? completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) / completedInterviews.length 
      : 0

    return {
      totalInterviews,
      completedCount: completedInterviews.length,
      upcomingCount: upcomingInterviews.length,
      averageScore: Math.round(avgScore),
      completedInterviews,
      upcomingInterviews
    }
  }

  // Clear all user data (for testing/logout)
  const clearUserData = () => {
    if (!user?.id) return

    const dataTypes = ['interviews', 'skills', 'preferences', 'profile']
    dataTypes.forEach(type => {
      const key = getUserStorageKey(type)
      if (key) localStorage.removeItem(key)
    })
    
    setUserData(defaultUserData)
  }

  // Load data when user changes
  useEffect(() => {
    if (isLoaded) {
      loadUserData()
    }
  }, [user?.id, isLoaded])

  return {
    userData,
    loading,
    user,
    isLoaded,
    
    // Interview management
    addInterview,
    updateInterview,
    deleteInterview,
    
    // Skill management
    updateSkillAssessment,
    
    // User management
    updatePreferences,
    updateProfile,
    
    // Utilities
    getUserStats,
    sendEmailNotification,
    clearUserData
  }
}