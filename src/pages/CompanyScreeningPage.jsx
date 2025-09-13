import { useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

export default function CompanyScreeningPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [candidateData, setCandidateData] = useState({
    jobTitle: '',
    department: '',
    requiredSkills: [],
    experienceLevel: '',
    interviewType: 'technical'
  })

  const handleCreateScreening = () => {
    toast.success('Screening process created successfully!')
  }

  const handleBulkUpload = () => {
    toast.success('Candidates uploaded successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Company Screening Platform</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Streamline your hiring process with AI-powered candidate screening.
              Efficiently evaluate and shortlist qualified candidates before human interviews.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'create', name: 'Create Screening', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
              { id: 'candidates', name: 'Manage Candidates', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Features Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Automated Screening</h3>
                <p className="text-slate-600">
                  AI-powered initial screening saves hours of manual review.
                  Get detailed candidate evaluations in minutes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Custom Criteria</h3>
                <p className="text-slate-600">
                  Set specific evaluation criteria for different roles.
                  Tailor the screening process to your exact requirements.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Detailed Analytics</h3>
                <p className="text-slate-600">
                  Comprehensive reports and analytics help you make data-driven
                  hiring decisions with confidence.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Statistics</h2>
                <p className="text-slate-600">See how companies are transforming their hiring process</p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                  <div className="text-sm text-slate-600">Candidates Screened</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-sm text-slate-600">Time Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-sm text-slate-600">Companies Using</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-sm text-slate-600">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create Screening Tab */}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Screening Process</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                      value={candidateData.jobTitle}
                      onChange={(e) => setCandidateData({...candidateData, jobTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                    <select
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={candidateData.department}
                      onChange={(e) => setCandidateData({...candidateData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      <option value="engineering">Engineering</option>
                      <option value="product">Product</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'System Design', 'Algorithms', 'Databases', 'Cloud'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCandidateData({...candidateData, requiredSkills: [...candidateData.requiredSkills, skill]})
                            } else {
                              setCandidateData({...candidateData, requiredSkills: candidateData.requiredSkills.filter(s => s !== skill)})
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                    <select
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={candidateData.experienceLevel}
                      onChange={(e) => setCandidateData({...candidateData, experienceLevel: e.target.value})}
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (6-10 years)</option>
                      <option value="lead">Lead Level (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
                    <select
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={candidateData.interviewType}
                      onChange={(e) => setCandidateData({...candidateData, interviewType: e.target.value})}
                    >
                      <option value="technical">Technical Interview</option>
                      <option value="behavioral">Behavioral Interview</option>
                      <option value="mixed">Mixed Interview</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button type="button" className="btn-outline">Save as Draft</button>
                  <button
                    type="button"
                    onClick={handleCreateScreening}
                    className="btn-primary"
                  >
                    Create Screening Process
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Candidate Management</h2>
                <button
                  onClick={handleBulkUpload}
                  className="btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Bulk Upload Candidates
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Resume Files</h3>
                  <p className="text-slate-600 mb-4">Drag and drop PDF or DOC files, or click to browse</p>
                  <button className="btn-outline btn-sm">Choose Files</button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Candidates</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'John Smith', position: 'Senior Developer', score: 85, status: 'Screened' },
                      { name: 'Sarah Johnson', position: 'Frontend Engineer', score: 92, status: 'Approved' },
                      { name: 'Mike Chen', position: 'Full Stack Developer', score: 78, status: 'Pending' },
                    ].map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-900">{candidate.name}</div>
                          <div className="text-sm text-slate-600">{candidate.position}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium">Score: </span>
                            <span className={candidate.score >= 85 ? 'text-green-600' : candidate.score >= 70 ? 'text-yellow-600' : 'text-red-600'}>
                              {candidate.score}%
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'Screened' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {candidate.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Screening Analytics</h2>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Total Candidates Screened</span>
                        <span className="font-semibold text-slate-900">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Average Screening Time</span>
                        <span className="font-semibold text-slate-900">8 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Pass Rate</span>
                        <span className="font-semibold text-green-600">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Average Score</span>
                        <span className="font-semibold text-slate-900">72.5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Skills Assessed</h3>
                    <div className="space-y-3">
                      {[
                        { skill: 'JavaScript', count: 892 },
                        { skill: 'React', count: 674 },
                        { skill: 'Python', count: 523 },
                        { skill: 'System Design', count: 445 },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-700">{item.skill}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(item.count / 892) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { range: '90-100', count: 89, color: 'bg-green-500' },
                      { range: '80-89', count: 156, color: 'bg-blue-500' },
                      { range: '70-79', count: 234, color: 'bg-yellow-500' },
                      { range: '60-69', count: 187, color: 'bg-orange-500' },
                      { range: 'Below 60', count: 145, color: 'bg-red-500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-16 text-sm text-slate-600">{item.range}</div>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className={`${item.color} h-3 rounded-full`}
                              style={{ width: `${(item.count / 234) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-slate-600 text-right">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  )
}