import { Link } from 'react-router-dom'
import { user, interviews, skillAssessments, learningResources } from '../data/mockData'
import { formatDuration, getDifficultyColor, getLevelColor, getStatusColor, getScoreColor, formatDate, getTopicIcon } from '../utils/helpers'

export default function DashboardPage() {
  const upcomingInterviews = interviews.filter(i => i.status === 'upcoming')
  const completedInterviews = interviews.filter(i => i.status === 'completed')
  const avgScore = completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) / completedInterviews.length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-slate-600 flex items-center">
                <span className="badge bg-blue-100 text-blue-800 border-blue-200 mr-3">
                  {user.role}
                </span>
                {user.experience} experience • Ready to level up your data engineering skills?
              </p>
            </div>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Interview
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Total Interviews</p>
                <p className="text-2xl font-bold text-blue-900">{interviews.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-700">Completed</p>
                <p className="text-2xl font-bold text-emerald-900">{completedInterviews.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Practice Hours</p>
                <p className="text-2xl font-bold text-amber-900">42.5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/interviews/new" className="card hover:shadow-lg transition-all duration-200 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-blue-900 mb-2">System Design</h3>
              <p className="text-sm text-blue-700">Practice large-scale data architecture</p>
            </Link>
            <Link to="/interviews/new" className="card hover:shadow-lg transition-all duration-200 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-green-900 mb-2">Spark & Scala</h3>
              <p className="text-sm text-green-700">Distributed computing challenges</p>
            </Link>
            <Link to="/interviews/new" className="card hover:shadow-lg transition-all duration-200 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="text-3xl mb-3">🗃️</div>
              <h3 className="font-semibold text-purple-900 mb-2">Advanced SQL</h3>
              <p className="text-sm text-purple-700">Complex queries & optimization</p>
            </Link>
            <Link to="/interviews/new" className="card hover:shadow-lg transition-all duration-200 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-orange-900 mb-2">ETL Pipelines</h3>
              <p className="text-sm text-orange-700">Data processing workflows</p>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Interviews */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upcoming Interviews
                </h2>
                <Link to="/interviews" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{interview.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{interview.company} • {interview.position}</p>
                          <div className="flex flex-wrap gap-2">
                            {interview.topics.slice(0, 2).map((topic, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                {getTopicIcon(topic)} {topic}
                              </span>
                            ))}
                            {interview.topics.length > 2 && (
                              <span className="text-xs text-slate-500">+{interview.topics.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`badge ${getDifficultyColor(interview.difficulty)}`}>
                            {interview.difficulty}
                          </span>
                          <span className={`badge ${getLevelColor(interview.level)}`}>
                            {interview.level}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <span className="mr-4">⏱️ {formatDuration(interview.duration)}</span>
                          <span>📝 {interview.questions} questions</span>
                        </div>
                        <Link to={`/interviews/${interview.id}`} className="btn-primary btn-sm">
                          Start Interview
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming interviews</h3>
                  <p className="text-slate-600 mb-6">Ready to practice? Start a new mock interview session.</p>
                  <Link to="/interviews/new" className="btn-primary">
                    Schedule New Interview
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Skills Assessment */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Skill Levels
            </h2>
            <div className="space-y-4">
              {skillAssessments.map((skill) => (
                <div key={skill.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{skill.badge}</span>
                      <span className="font-medium text-slate-900">{skill.skill}</span>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>
                      {skill.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        skill.score >= 90 ? 'bg-emerald-500' :
                        skill.score >= 80 ? 'bg-blue-500' :
                        skill.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{skill.level}</span>
                    <span>Last: {formatDate(skill.lastTested)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/skills" className="btn-outline w-full mt-4">
              View All Skills
            </Link>
          </div>
        </div>

        {/* Recent Activity & Learning Resources */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {completedInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      Completed {interview.title}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-sm text-slate-500">{interview.company}</p>
                      <span className={`text-sm font-semibold ${getScoreColor(interview.score)}`}>
                        {interview.score}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDate(interview.completedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Recommended Learning
            </h2>
            <div className="space-y-4">
              {learningResources.map((resource) => (
                <div key={resource.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900 text-sm leading-tight">{resource.title}</h3>
                    <span className={`badge ${getDifficultyColor(resource.difficulty)} text-xs`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                    <span>{resource.type}</span>
                    <span>⏱️ {resource.duration}</span>
                    <span>📚 {resource.provider}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resource.topics.slice(0, 2).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-outline w-full mt-4">
              View More Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}