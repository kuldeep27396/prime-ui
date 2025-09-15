import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
      if (!user?.id) return;

      setApiLoading(true);
      try {
        // Try to create/update user first
        await api.createUser({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: 'candidate'
        }).catch(() => {
          // User might already exist, that's okay
        });

        // Load dashboard data
        const dashboardData = await api.getDashboardData(user.id);
        setApiData(dashboardData);
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

  const aiTips = `## 🤖 AI-Powered Recommendations for ${user?.firstName || 'You'}

Based on your recent performance, here are personalized tips to improve your interview skills:

### 💡 Focus Areas
${userData.skillAssessments.map(skill => 
  `- **${skill.skill}**: Your score is ${skill.score}%. ${skill.score < 70 ? 'Focus on improvement' : skill.score < 85 ? 'Good progress, keep practicing' : 'Excellent! Consider advanced topics'}`
).join('\n')}

### 📚 Recommended Study Plan
\`\`\`python
# Practice this pattern for technical interviews
def solve_interview_problem(problem):
    # 1. Clarify requirements
    requirements = clarify_problem(problem)
    
    # 2. Think about edge cases
    edge_cases = identify_edge_cases(requirements)
    
    # 3. Code the solution
    solution = implement_solution(requirements)
    
    # 4. Test with examples
    test_solution(solution, edge_cases)
    
    return solution
\`\`\`

### 🎯 This Week's Goals
1. Complete 3 system design practice sessions
2. Solve 5 LeetCode medium problems
3. Practice explaining your thought process out loud
${stats.upcomingCount > 0 ? `4. Prepare for your ${stats.upcomingCount} upcoming interview${stats.upcomingCount > 1 ? 's' : ''}` : '4. Schedule your next practice interview'}
`

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user?.imageUrl && (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome back, {user?.firstName || 'there'}! 👋
                </h1>
                <p className="text-slate-600 flex items-center">
                  <span className="badge bg-blue-100 text-blue-800 border-blue-200 mr-3">
                    {userData.profile.role}
                  </span>
                  {userData.profile.experience} • {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleStartVideoInterview}
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Start Video Interview
              </button>
              <Link to="/schedule" className="btn-outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8l-2 9H10l-2-9z" />
                </svg>
                Schedule with Mentor
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Total Interviews</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalInterviews}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">Average Score</p>
                <p className="text-2xl font-bold text-purple-900">{stats.averageScore}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-700">Upcoming</p>
                <p className="text-2xl font-bold text-orange-900">{stats.upcomingCount}</p>
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
              className="card"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Performance Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="#93C5FD" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Interview Types */}
            {stats.totalInterviews > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Interview Types Distribution</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={interviewTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {interviewTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {interviewTypeData.map((type, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3" 
                          style={{ backgroundColor: type.color }}
                        ></div>
                        <span className="text-sm text-slate-700">{type.name}</span>
                        <span className="ml-auto text-sm font-medium">{type.value}%</span>
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
              className="card"
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {aiTips}
                </ReactMarkdown>
              </div>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Upcoming Interviews</h2>
                <Link to="/schedule" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {stats.upcomingCount > 0 ? 'View all' : 'Schedule'}
                </Link>
              </div>
              <div className="space-y-4">
                {stats.upcomingCount > 0 ? (
                  stats.upcomingInterviews.slice(0, 3).map((interview) => (
                    <div key={interview.id} className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🏢</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{interview.company}</p>
                        <p className="text-sm text-slate-500">{interview.title}</p>
                        <p className="text-xs text-slate-400">
                          {interview.scheduledAt && formatDate(interview.scheduledAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        interview.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {interview.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No upcoming interviews scheduled</p>
                    <Link to="/schedule" className="btn-secondary btn-sm">
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