import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useUser } from '@clerk/clerk-react'
import { useUserData } from '../hooks/useUserData'
import { useAPIService } from '../services/apiService'
import { learningResources } from '../data/mockData'
import { generateRoomCode } from '../config/hmsConfig'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useUser()
  const { userData, loading, getUserStats } = useUserData()
  const api = useAPIService()
  const navigate = useNavigate()
  const [apiData, setApiData] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setApiLoading(true);
      try {
        if (user?.id && api.isAuthenticated) {
          // Try to create/update user first for authenticated users
          await api.createUser({
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            role: 'candidate'
          }).catch(() => {
            // User might already exist, that's okay
          });

          // Load dashboard data for authenticated users
          const dashboardData = await api.getDashboardData(user.id);
          setApiData(dashboardData);
        } else {
          // Load mock data for guest users
          const dashboardData = await api.getDashboardData('guest-user');
          setApiData(dashboardData);
        }
      } catch (error) {
        console.warn('Dashboard API data not available:', error.message);
        // Fall back to mock data - don't show error to user
      } finally {
        setApiLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = getUserStats()

  // Analytics data - generate based on user's actual interviews
  const progressData = [
    { month: 'Jan', score: 65, interviews: 2 },
    { month: 'Feb', score: 72, interviews: 3 },
    { month: 'Mar', score: 78, interviews: 4 },
    { month: 'Apr', score: 85, interviews: 2 },
    { month: 'May', score: 88, interviews: Math.max(1, Math.floor(stats.completedCount / 2)) },
    { month: 'Jun', score: stats.averageScore || 92, interviews: stats.completedCount }
  ]

  const skillRadarData = userData.skillAssessments.map(skill => ({
    skill: skill.skill.split(' ')[0],
    score: skill.score
  }))

  const interviewTypeData = [
    { name: 'Technical', value: 45, color: '#3B82F6' },
    { name: 'System Design', value: 25, color: '#10B981' },
    { name: 'Behavioral', value: 20, color: '#F59E0B' },
    { name: 'Coding', value: 10, color: '#EF4444' }
  ]


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStartVideoInterview = () => {
    if (!user) {
      toast.error('Please sign in to start a video interview')
      return
    }

    const roomCode = generateRoomCode()
    const roomUrl = `/interview-room/${roomCode}?type=ai&duration=45&role=participant`

    toast.success('Starting AI video interview...')
    navigate(roomUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container-responsive py-6 sm:py-8 lg:py-10">
        {/* Guest Mode Banner */}
        {api.isGuestMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-8 shadow-xl border border-white/20"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">🚀 Welcome to Prime Interviews!</h3>
                  <p className="text-indigo-100 text-base leading-relaxed max-w-2xl">Experience our AI-powered interview platform with realistic demo data. Sign in to unlock personalized features, save your progress, and access premium mentors.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/sign-in" className="btn bg-white/90 backdrop-blur-sm text-indigo-600 hover:bg-white border-0 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/sign-up" className="btn bg-indigo-700/80 backdrop-blur-sm text-white hover:bg-indigo-800 border border-white/20 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Welcome{api.isGuestMode ? '' : ' back'}, {user?.firstName || (api.isGuestMode ? 'Demo User' : 'there')}! 👋
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleStartVideoInterview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
            >
              Start Interview
            </button>
            <Link
              to="/schedule"
              className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-lg"
            >
              Book Mentor
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Total Interviews</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalInterviews}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>+12% from last month</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats.completedCount}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Great progress!</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Average Score</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.averageScore}%</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Above average</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Upcoming</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.upcomingCount}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Next: Tomorrow</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Empty State for New Users */}
        {stats.totalInterviews === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card text-center py-12 mb-8"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Prime Interviews!</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Get started by scheduling your first mock interview. Our AI-powered platform will help you practice 
              technical interviews and improve your skills with personalized feedback.
            </p>
            <Link to="/schedule" className="btn-primary btn-lg">
              Schedule Your First Interview
            </Link>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Performance Trends</h2>
                  <p className="text-slate-600">Track your interview scores over time</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">Score Progression</span>
                </div>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Interview Types */}
            {stats.totalInterviews > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Interview Types</h2>
                  <p className="text-slate-600">Breakdown of your interview practice sessions</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={interviewTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {interviewTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {interviewTypeData.map((type, index) => (
                      <div key={index} className="group hover:bg-slate-50/80 rounded-xl p-3 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-5 h-5 rounded-full mr-4 shadow-sm"
                              style={{ backgroundColor: type.color }}
                            ></div>
                            <span className="font-medium text-slate-700 group-hover:text-slate-900">{type.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-slate-800">{type.value}%</span>
                          </div>
                        </div>
                        <div className="ml-9 mt-2">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                backgroundColor: type.color,
                                width: `${type.value}%`,
                                opacity: 0.8
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skills Radar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Skills Assessment</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={skillRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* AI Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Coach</h2>
                  <p className="text-slate-600 text-xs">Personalized recommendations</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Focus Areas */}
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <span className="mr-2">💡</span>
                    Focus Areas
                  </h3>
                  <div className="space-y-2">
                    {userData.skillAssessments.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{skill.skill}</span>
                        <span className={`text-xs font-medium ${
                          skill.score < 70 ? 'text-red-600' :
                          skill.score < 85 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {skill.score}% {skill.score < 70 ? '(improve)' : skill.score < 85 ? '(good)' : '(excellent)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <span className="mr-2">🚀</span>
                    Quick Tips
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Think out loud during coding",
                      "Ask clarifying questions first",
                      "Use STAR method for behavioral"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-slate-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    This Week's Goals
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Complete 3 practice sessions",
                      `Review ${userData.skillAssessments[0]?.skill || 'Data Structures'}`,
                      stats.upcomingCount > 0 ? `Prepare for ${stats.upcomingCount} interview${stats.upcomingCount > 1 ? 's' : ''}` : 'Schedule practice interview'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-slate-600">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7h8" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Upcoming Sessions</h2>
                    <p className="text-slate-600 text-sm">Your scheduled interviews</p>
                  </div>
                </div>
                <Link
                  to="/schedule"
                  className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                    {stats.upcomingCount > 0 ? 'View All' : 'Schedule New'}
                  </span>
                </Link>
              </div>
              <div className="space-y-4">
                {stats.upcomingCount > 0 ? (
                  stats.upcomingInterviews.slice(0, 3).map((interview) => (
                    <div key={interview.id} className="group bg-gradient-to-r from-slate-50/80 to-slate-100/50 hover:from-emerald-50/80 hover:to-teal-50/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg border border-slate-200/50 hover:border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate group-hover:text-emerald-900 transition-colors duration-200">{interview.company}</p>
                            <p className="text-sm text-slate-600 group-hover:text-emerald-700 transition-colors duration-200">{interview.title}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {interview.scheduledAt && formatDate(interview.scheduledAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                            interview.difficulty === 'Hard' ? 'bg-red-100 text-red-800 group-hover:bg-red-200' :
                            interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
                            'bg-green-100 text-green-800 group-hover:bg-green-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-1.5 ${
                              interview.difficulty === 'Hard' ? 'bg-red-500' :
                              interview.difficulty === 'Medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-slate-50/80 to-slate-100/50 rounded-2xl border border-slate-200/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium mb-2">No upcoming interviews</p>
                    <p className="text-slate-500 text-sm mb-6">Schedule your first session with an expert mentor</p>
                    <Link
                      to="/schedule"
                      className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Schedule Interview
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Learning Resources */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Recommended Learning</h2>
              <div className="space-y-4">
                {learningResources.slice(0, 3).map((resource) => (
                  <div key={resource.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{resource.title}</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{resource.duration}</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.topics.slice(0, 2).map((topic, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}