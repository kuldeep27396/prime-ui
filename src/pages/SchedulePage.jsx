import { useState, useMemo, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { mentors, companyLogos, skillCategories, companies } from '../data/mentors'
import { getUserData } from '../data/userSessions'
import { generateRoomCode, createRoomUrl } from '../config/hmsConfig'
import { emailService } from '../services/emailService'
import { useAPIService } from '../services/apiService'

export default function SchedulePage() {
  const { isSignedIn, user } = useUser()
  const api = useAPIService()
  const navigate = useNavigate()
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [apiMentors, setApiMentors] = useState([])
  const [mentorsLoading, setMentorsLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Load mentors from API
  useEffect(() => {
    const loadMentors = async () => {
      setMentorsLoading(true);
      try {
        const response = await api.getMentors({ page: 1, limit: 50 });
        if (response.mentors) {
          setApiMentors(response.mentors);
        }
      } catch (error) {
        console.warn('Failed to load mentors from API:', error.message);
        // Fall back to mock data
      } finally {
        setMentorsLoading(false);
      }
    };

    if (isSignedIn) {
      loadMentors();
    }
  }, [isSignedIn, api]);
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [bookingStep, setBookingStep] = useState(1) // 1: time selection, 2: details, 3: confirmation
  const [bookingDetails, setBookingDetails] = useState({
    sessionType: 'Mock Technical Interview',
    duration: 60,
    specialRequests: '',
    meetingType: 'video', // video, audio, in-person
    recordSession: false
  })
  const [filters, setFilters] = useState({
    skills: [],
    companies: [],
    priceRange: [0, 300],
    rating: 0,
    experience: [0, 20],
    availability: 'any',
    languages: []
  })
  const [sortBy, setSortBy] = useState('rating')
  const [userData, setUserData] = useState(null)
  const [showUserData, setShowUserData] = useState(false)

  // Load user data on mount and auth state changes
  useEffect(() => {
    const data = getUserData(isSignedIn, user?.id)
    setUserData(data)

    // Don't apply default filters - let users start with clean slate
    // User can manually apply filters if they want
  }, [isSignedIn, user?.id])

  // Use API mentors if available, otherwise fall back to mock data
  const activeMentors = apiMentors.length > 0 ? apiMentors : mentors;

  // Extract unique values for multi-select filters
  const availableSkills = [...new Set(activeMentors.flatMap(m => m.skills || []))]
  const availableCompanies = [...new Set(activeMentors.flatMap(m => [m.currentCompany, ...(m.previousCompanies || [])]))]
  const availableLanguages = [...new Set(activeMentors.flatMap(m => m.languages || []))]

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    let filtered = activeMentors.filter(mentor => {
      // Search query filter
      const searchMatch = !searchQuery ||
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentor.title && mentor.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mentor.specialties && mentor.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (mentor.skills && mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (mentor.currentCompany && mentor.currentCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mentor.previousCompanies && mentor.previousCompanies.some(company => company.toLowerCase().includes(searchQuery.toLowerCase())))

      // Skills filter (multi-select)
      const skillMatch = filters.skills.length === 0 ||
        filters.skills.some(skill =>
          mentor.skills.includes(skill) ||
          mentor.specialties.some(spec => spec.toLowerCase().includes(skill.toLowerCase()))
        )

      // Companies filter (multi-select)
      const companyMatch = filters.companies.length === 0 ||
        filters.companies.includes(mentor.currentCompany) ||
        mentor.previousCompanies.some(company => filters.companies.includes(company))

      // Price range filter
      const priceMatch = mentor.hourlyRate >= filters.priceRange[0] && mentor.hourlyRate <= filters.priceRange[1]

      // Rating filter
      const ratingMatch = mentor.rating >= filters.rating

      // Experience filter
      const experienceMatch = mentor.experience >= filters.experience[0] && mentor.experience <= filters.experience[1]

      // Languages filter
      const languageMatch = filters.languages.length === 0 ||
        filters.languages.some(lang => mentor.languages.includes(lang))

      return searchMatch && skillMatch && companyMatch && priceMatch && ratingMatch && experienceMatch && languageMatch
    })

    // Sort mentors
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price_low':
          return a.hourlyRate - b.hourlyRate
        case 'price_high':
          return b.hourlyRate - a.hourlyRate
        case 'experience':
          return b.experience - a.experience
        case 'reviews':
          return b.reviewCount - a.reviewCount
        default:
          return b.rating - a.rating
      }
    })
  }, [searchQuery, filters, sortBy])

  const handleBookMentor = (mentor) => {
    setSelectedMentor(mentor)
    setBookingStep(1)
    setSelectedTimeSlot(null)
    setBookingDetails({
      sessionType: 'Mock Technical Interview',
      duration: 60,
      specialRequests: '',
      meetingType: 'video',
      recordSession: false
    })
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error('Please sign in to confirm your booking')
      return
    }

    try {
      // First, try to book via API
      try {
        await api.bookInterview({
          mentorId: selectedMentor.id,
          sessionType: bookingDetails.sessionType,
          scheduledAt: new Date(selectedTimeSlot).toISOString(),
          duration: bookingDetails.duration,
          meetingType: bookingDetails.meetingType,
          recordSession: bookingDetails.recordSession,
          specialRequests: bookingDetails.specialRequests,
          participantEmail: user.primaryEmailAddress.emailAddress,
          participantName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Candidate'
        });

        toast.success(`✅ Session booked successfully with ${selectedMentor.name}!`);
      } catch (apiError) {
        console.warn('API booking failed, using fallback method:', apiError.message);
      }

      // Generate room link for video calls
      let roomUrl = ''
      if (bookingDetails.meetingType === 'video') {
        const roomCode = generateRoomCode()
        roomUrl = `${window.location.origin}/interview-room/${roomCode}?type=mentor&mentor=${encodeURIComponent(selectedMentor.name)}&duration=${bookingDetails.duration}&role=participant`
      }

      // Format the date and time
      const now = new Date()
      const meetingDate = new Date(selectedTimeSlot).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const meetingTime = new Date(selectedTimeSlot).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })

      // Send confirmation email
      await emailService.sendMeetingInvitation({
        to_email: user.primaryEmailAddress.emailAddress,
        to_name: user.firstName || 'Candidate',
        meeting_title: `${bookingDetails.sessionType} with ${selectedMentor.name}`,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        meeting_duration: `${bookingDetails.duration} minutes`,
        meeting_description: `You have scheduled a ${bookingDetails.sessionType.toLowerCase()} session with ${selectedMentor.name} from ${selectedMentor.currentCompany}. ${bookingDetails.specialRequests ? `Special requests: ${bookingDetails.specialRequests}` : ''}`,
        meeting_link: roomUrl || 'Meeting details will be shared separately'
      })

      if (bookingDetails.meetingType === 'video') {
        toast.success(
          <div>
            <p>✅ Booking confirmed with {selectedMentor.name}!</p>
            <p className="text-sm mt-1">📧 Confirmation email sent to {user.primaryEmailAddress.emailAddress}</p>
            <button
              onClick={() => navigate(`/interview-room/${generateRoomCode()}?type=mentor&mentor=${encodeURIComponent(selectedMentor.name)}&duration=${bookingDetails.duration}&role=participant`)}
              className="mt-2 btn-primary btn-sm"
            >
              Join Video Call
            </button>
          </div>,
          { duration: 10000 }
        )
      } else {
        toast.success(
          <div>
            <p>✅ Booking request sent to {selectedMentor.name}!</p>
            <p className="text-sm mt-1">📧 Confirmation email sent to {user.primaryEmailAddress.emailAddress}</p>
            <p className="text-sm">They'll respond within {selectedMentor.responseTime.toLowerCase()}.</p>
          </div>,
          { duration: 8000 }
        )
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      toast.error('Booking confirmed, but failed to send confirmation email. Please check your email settings.')

      // Still show success for the booking itself
      if (bookingDetails.meetingType === 'video') {
        const roomCode = generateRoomCode()
        const roomUrl = `/interview-room/${roomCode}?type=mentor&mentor=${encodeURIComponent(selectedMentor.name)}&duration=${bookingDetails.duration}&role=participant`

        toast.success(
          <div>
            <p>Booking confirmed with {selectedMentor.name}!</p>
            <button
              onClick={() => navigate(roomUrl)}
              className="mt-2 btn-primary btn-sm"
            >
              Join Video Call
            </button>
          </div>,
          { duration: 8000 }
        )
      }
    }

    setShowBookingModal(false)
    setSelectedMentor(null)
    setBookingStep(1)
    setSelectedTimeSlot(null)
  }

  const handleInstantVideoCall = (mentor) => {
    if (!isSignedIn) {
      toast.error('Please sign in to start a video call')
      return
    }

    const roomCode = generateRoomCode()
    const roomUrl = `/interview-room/${roomCode}?type=mentor&mentor=${encodeURIComponent(mentor.name)}&duration=60&role=participant`

    toast.success(`Starting video call with ${mentor.name}...`)
    navigate(roomUrl)
  }

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
  }

  const handleNextStep = () => {
    if (bookingStep === 1 && selectedTimeSlot) {
      setBookingStep(2)
    } else if (bookingStep === 2) {
      setBookingStep(3)
    }
  }

  const handlePrevStep = () => {
    setBookingStep(Math.max(1, bookingStep - 1))
  }

  const getSkillColor = (skill) => {
    const colors = {
      'System Design': 'bg-blue-100 text-blue-700',
      'Algorithms': 'bg-green-100 text-green-700',
      'Frontend': 'bg-purple-100 text-purple-700',
      'Backend': 'bg-orange-100 text-orange-700',
      'React': 'bg-cyan-100 text-cyan-700',
      'Python': 'bg-yellow-100 text-yellow-700',
      'JavaScript': 'bg-amber-100 text-amber-700',
      'Machine Learning': 'bg-indigo-100 text-indigo-700',
      'DevOps': 'bg-slate-100 text-slate-700',
      'Leadership': 'bg-emerald-100 text-emerald-700'
    }
    return colors[skill] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Find Your Perfect Mentor</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Book personalized mock interviews with experienced professionals from top tech companies.
              Get expert guidance and insider insights to ace your next interview.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Data Notification */}
        {!isSignedIn && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">Browsing as Guest</h3>
                <p className="text-sm text-blue-700">
                  You're viewing demo data. Sign in to see your personalized mentors, booking history, and save preferences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Dashboard Summary for Signed In Users */}
        {isSignedIn && userData && userData.progress.completedSessions > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Welcome back, {user?.firstName || 'User'}! 👋</h3>
              <button
                onClick={() => setShowUserData(!showUserData)}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                {showUserData ? 'Hide' : 'Show'} Progress
              </button>
            </div>

            {showUserData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{userData.progress.completedSessions}</div>
                  <div className="text-sm text-slate-600">Sessions Completed</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userData.progress.totalHoursSpent}h</div>
                  <div className="text-sm text-slate-600">Hours Practiced</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{userData.progress.averageRating}★</div>
                  <div className="text-sm text-slate-600">Avg Rating</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userData.progress.upcomingSessions}</div>
                  <div className="text-sm text-slate-600">Upcoming</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Filter Mentors</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-slate-500 hover:text-slate-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Mentors
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isSignedIn && userData?.preferences.recentSearches.length > 0
                      ? `Try "${userData.preferences.recentSearches[0]}"...`
                      : "Search by name, skills, company..."}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Recent Searches for Signed In Users */}
                {isSignedIn && userData?.preferences.recentSearches.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-slate-500 mb-1">Recent searches:</div>
                    <div className="flex flex-wrap gap-1">
                      {userData.preferences.recentSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Skills Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Skills ({filters.skills.length} selected)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1">
                    {availableSkills.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.skills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, skills: [...filters.skills, skill]})
                            } else {
                              setFilters({...filters, skills: filters.skills.filter(s => s !== skill)})
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Companies Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Companies ({filters.companies.length} selected)
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1">
                    {availableCompanies.map((company) => (
                      <label key={company} className="flex items-center space-x-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.companies.includes(company)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, companies: [...filters.companies, company]})
                            } else {
                              setFilters({...filters, companies: filters.companies.filter(c => c !== company)})
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex items-center space-x-2">
                          <img
                            src={companyLogos[company]}
                            alt={company}
                            className="w-4 h-4 object-contain flex-shrink-0"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <span className="text-sm text-slate-700">{company}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Experience: {filters.experience[0]} - {filters.experience[1]} years
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={filters.experience[0]}
                      onChange={(e) => setFilters({...filters, experience: [parseInt(e.target.value), filters.experience[1]]})}
                      className="w-full accent-emerald-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={filters.experience[1]}
                      onChange={(e) => setFilters({...filters, experience: [filters.experience[0], parseInt(e.target.value)]})}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0 years</span>
                      <span>20+ years</span>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hourly Rate: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$0</span>
                    <span>$300+</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex items-center flex-wrap gap-2">
                    {[0, 4.0, 4.5, 4.7, 4.8].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters({...filters, rating})}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                          filters.rating === rating
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+★`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="experience">Most Experience</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>

                {/* Languages Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Languages ({filters.languages.length} selected)
                  </label>
                  <div className="max-h-24 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1">
                    {availableLanguages.map((language) => (
                      <label key={language} className="flex items-center space-x-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.languages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, languages: [...filters.languages, language]})
                            } else {
                              setFilters({...filters, languages: filters.languages.filter(l => l !== language)})
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({
                      skills: [],
                      companies: [],
                      priceRange: [0, 300],
                      rating: 0,
                      experience: [0, 20],
                      availability: 'any',
                      languages: []
                    })
                    setSearchQuery('')
                  }}
                  className="w-full btn-outline text-slate-600 border-slate-300 hover:bg-slate-50"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Available Mentors ({filteredMentors.length})
              </h2>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="experience">Most Experience</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.skills.length > 0 || filters.companies.length > 0 || filters.languages.length > 0 || searchQuery || filters.rating > 0) && (
              <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-800">Active Filters:</span>
                  <button
                    onClick={() => {
                      setFilters({
                        skills: [],
                        companies: [],
                        priceRange: [0, 300],
                        rating: 0,
                        experience: [0, 20],
                        availability: 'any',
                        languages: []
                      })
                      setSearchQuery('')
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="px-2 py-1 bg-white text-emerald-800 text-xs rounded-full flex items-center">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-emerald-600">
                        ×
                      </button>
                    </span>
                  )}
                  {filters.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white text-emerald-800 text-xs rounded-full flex items-center">
                      {skill}
                      <button
                        onClick={() => setFilters({...filters, skills: filters.skills.filter(s => s !== skill)})}
                        className="ml-1 hover:text-emerald-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.companies.map(company => (
                    <span key={company} className="px-2 py-1 bg-white text-emerald-800 text-xs rounded-full flex items-center">
                      {company}
                      <button
                        onClick={() => setFilters({...filters, companies: filters.companies.filter(c => c !== company)})}
                        className="ml-1 hover:text-emerald-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.languages.map(language => (
                    <span key={language} className="px-2 py-1 bg-white text-emerald-800 text-xs rounded-full flex items-center">
                      {language}
                      <button
                        onClick={() => setFilters({...filters, languages: filters.languages.filter(l => l !== language)})}
                        className="ml-1 hover:text-emerald-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.rating > 0 && (
                    <span className="px-2 py-1 bg-white text-emerald-800 text-xs rounded-full flex items-center">
                      Rating: {filters.rating}+★
                      <button
                        onClick={() => setFilters({...filters, rating: 0})}
                        className="ml-1 hover:text-emerald-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {filteredMentors.map((mentor) => {
                const isFavorite = isSignedIn && userData?.favorites.includes(mentor.id)
                const hasSessionHistory = isSignedIn && userData?.sessionHistory.some(s => s.mentorId === mentor.id)

                return (
                <motion.div
                  key={mentor.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random&size=64`
                        }}
                      />
                      {/* Favorite badge for signed-in users */}
                      {isFavorite && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                      )}
                      {/* Previous session indicator */}
                      {hasSessionHistory && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 flex-1 mr-2">{mentor.name}</h3>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            {mentor.rating} ({mentor.reviewCount})
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-2">{mentor.title}</p>

                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src={companyLogos[mentor.currentCompany]}
                          alt={mentor.currentCompany}
                          className="w-5 h-5 object-contain flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{mentor.currentCompany}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-600">{mentor.experience} years</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {mentor.specialties.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillColor(specialty)}`}
                          >
                            {specialty}
                          </span>
                        ))}
                        {mentor.specialties.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            +{mentor.specialties.length - 2} more
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{mentor.bio}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <div>💰 ${mentor.hourlyRate}/hour</div>
                          <div>⏰ {mentor.responseTime}</div>
                          {hasSessionHistory && (
                            <div className="text-xs text-emerald-600 font-medium mt-1">
                              ✓ Previous session
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {isSignedIn && (
                            <button
                              onClick={() => {
                                // Toggle favorite (in real app, this would update backend)
                                toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
                              }}
                              className={`p-2 rounded-full transition-colors ${
                                isFavorite
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-slate-400 hover:bg-slate-50 hover:text-red-500'
                              }`}
                              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </button>
                          )}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleInstantVideoCall(mentor)}
                              className="btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700"
                              title="Start instant video call"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Call Now
                            </button>
                            <button
                              onClick={() => handleBookMentor(mentor)}
                              className="btn-outline btn-sm"
                            >
                              {hasSessionHistory ? 'Schedule Again' : 'Schedule'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previous Companies */}
                  {mentor.previousCompanies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs text-slate-500 flex-shrink-0">Previously at:</span>
                        {mentor.previousCompanies.slice(0, 3).map((company, index) => (
                          <div key={company} className="flex items-center space-x-1">
                            <img
                              src={companyLogos[company]}
                              alt={company}
                              title={company}
                              className="w-4 h-4 object-contain opacity-60 hover:opacity-100 flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                            <span className="text-xs text-slate-500 opacity-60">{company}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
                )
              })}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No mentors found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search terms to see more results.</p>
                <button
                  onClick={() => {
                    setFilters({
                      skills: [],
                      companies: [],
                      priceRange: [0, 300],
                      rating: 0,
                      experience: [0, 20],
                      availability: 'any',
                      languages: []
                    })
                    setSearchQuery('')
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Book Session with {selectedMentor.name}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mentor Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-slate-900">{selectedMentor.name}</h3>
                <p className="text-slate-600">{selectedMentor.title} at {selectedMentor.currentCompany}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-sm text-slate-600">{selectedMentor.rating} ({selectedMentor.reviewCount})</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-600">${selectedMentor.hourlyRate}/hour</span>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === bookingStep
                        ? 'bg-emerald-500 text-white'
                        : step < bookingStep
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {step < bookingStep ? '✓' : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step < bookingStep ? 'bg-emerald-200' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-sm text-slate-600">
                  {bookingStep === 1 && 'Select Time'}
                  {bookingStep === 2 && 'Session Details'}
                  {bookingStep === 3 && 'Confirmation'}
                </span>
              </div>
            </div>

            {/* Step 1: Time Selection */}
            {bookingStep === 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Select Available Time</h3>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {selectedMentor.availability.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{slot}</div>
                      <div className="text-sm text-slate-600">{selectedMentor.timezone}</div>
                      <div className="text-xs text-emerald-600 mt-1">Available</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Session Details */}
            {bookingStep === 2 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Session Details</h3>

                {/* Selected Time Display */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-emerald-900">{selectedTimeSlot}</div>
                      <div className="text-sm text-emerald-700">{selectedMentor.timezone}</div>
                    </div>
                    <button
                      onClick={() => setBookingStep(1)}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      Change Time
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Session Type
                  </label>
                  <select
                    value={bookingDetails.sessionType}
                    onChange={(e) => setBookingDetails({...bookingDetails, sessionType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Mock Technical Interview</option>
                    <option>System Design Review</option>
                    <option>Behavioral Interview Practice</option>
                    <option>Career Guidance Session</option>
                    <option>Code Review</option>
                    <option>Resume Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Session Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setBookingDetails({...bookingDetails, duration})}
                        className={`p-3 text-center border rounded-lg transition-all ${
                          bookingDetails.duration === duration
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium">{duration} min</div>
                        <div className="text-sm">${selectedMentor.hourlyRate * (duration / 60)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setBookingDetails({...bookingDetails, meetingType: 'video'})}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        bookingDetails.meetingType === 'video'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">Video Call</div>
                      <div className="text-xs opacity-75">HD video + audio</div>
                    </button>
                    <button
                      onClick={() => setBookingDetails({...bookingDetails, meetingType: 'audio'})}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        bookingDetails.meetingType === 'audio'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">Audio Only</div>
                      <div className="text-xs opacity-75">Voice call</div>
                    </button>
                    <button
                      onClick={() => setBookingDetails({...bookingDetails, meetingType: 'in-person'})}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        bookingDetails.meetingType === 'in-person'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">In Person</div>
                      <div className="text-xs opacity-75">Meet locally</div>
                    </button>
                  </div>
                </div>

                {/* Recording Option */}
                {(bookingDetails.meetingType === 'video' || bookingDetails.meetingType === 'audio') && (
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="recordSession"
                      checked={bookingDetails.recordSession}
                      onChange={(e) => setBookingDetails({...bookingDetails, recordSession: e.target.checked})}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="recordSession" className="text-sm text-slate-700 cursor-pointer">
                      <span className="font-medium">Record session</span>
                      <span className="block text-xs text-slate-500 mt-1">
                        Get a recording for review later (with mentor's consent)
                      </span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    rows="3"
                    placeholder="Any specific topics you'd like to focus on, or questions for your mentor..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {bookingStep === 3 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirm Your Booking</h3>

                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Session Type:</span>
                    <span className="font-medium">{bookingDetails.sessionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date & Time:</span>
                    <span className="font-medium">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{bookingDetails.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Meeting Type:</span>
                    <span className="font-medium capitalize flex items-center">
                      {bookingDetails.meetingType === 'video' && (
                        <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {bookingDetails.meetingType === 'audio' && (
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                      {bookingDetails.meetingType === 'in-person' && (
                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {bookingDetails.meetingType.replace('-', ' ')}
                      {bookingDetails.recordSession && bookingDetails.meetingType !== 'in-person' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Recording</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <span className="text-slate-600">Total Cost:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ${selectedMentor.hourlyRate * (bookingDetails.duration / 60)}
                    </span>
                  </div>
                  {bookingDetails.specialRequests && (
                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-slate-600 block mb-1">Special Requests:</span>
                      <p className="text-sm text-slate-800 italic">{bookingDetails.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {bookingStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
              )}

              {bookingStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  disabled={bookingStep === 1 && !selectedTimeSlot}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleBookingSubmit}
                  className="btn-primary flex-1"
                >
                  Confirm Booking
                </button>
              )}

              <button
                onClick={() => setShowBookingModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your mentor will respond within {selectedMentor.responseTime.toLowerCase()}</li>
                    <li>• Payment is processed only after session confirmation</li>
                    <li>• You'll receive calendar invite and meeting link</li>
                    <li>• Free cancellation up to 24 hours before session</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Toaster position="top-right" />
    </div>
  )
}