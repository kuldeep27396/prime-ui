import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

export default function CompanyScreeningPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [candidateData, setCandidateData] = useState({
    jobTitle: '',
    department: '',
    requiredSkills: [],
    experienceLevel: '',
    interviewType: 'technical',
    screeningQuestions: [],
    passingScore: 70,
    timeLimit: 60
  })
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', position: 'Senior Developer', score: 85, status: 'screened', resumeUrl: '', appliedDate: '2024-01-15', screeningDate: '2024-01-18' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', position: 'Frontend Engineer', score: 92, status: 'approved', resumeUrl: '', appliedDate: '2024-01-14', screeningDate: '2024-01-17' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@email.com', position: 'Full Stack Developer', score: 78, status: 'pending', resumeUrl: '', appliedDate: '2024-01-16', screeningDate: null },
    { id: 4, name: 'Emma Davis', email: 'emma.davis@email.com', position: 'Backend Engineer', score: 67, status: 'rejected', resumeUrl: '', appliedDate: '2024-01-13', screeningDate: '2024-01-16' },
    { id: 5, name: 'Alex Rodriguez', email: 'alex.r@email.com', position: 'DevOps Engineer', score: 89, status: 'approved', resumeUrl: '', appliedDate: '2024-01-12', screeningDate: '2024-01-15' }
  ])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const fileInputRef = useRef(null)

  const handleCreateScreening = (e) => {
    e.preventDefault()
    if (!candidateData.jobTitle || !candidateData.department || !candidateData.experienceLevel) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Screening process created successfully!')
    console.log('Created screening:', candidateData)
  }

  const handleBulkUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(', ')
      toast.success(`Uploaded ${files.length} resume(s): ${fileNames}`)

      // Simulate adding new candidates
      const newCandidates = Array.from(files).map((file, index) => ({
        id: candidates.length + index + 1,
        name: `Candidate ${candidates.length + index + 1}`,
        email: `candidate${candidates.length + index + 1}@email.com`,
        position: candidateData.jobTitle || 'Software Engineer',
        score: Math.floor(Math.random() * 40) + 60,
        status: 'pending',
        resumeUrl: URL.createObjectURL(file),
        appliedDate: new Date().toISOString().split('T')[0],
        screeningDate: null
      }))

      setCandidates(prev => [...prev, ...newCandidates])
    }
  }

  const handleCandidateAction = (candidateId, action) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, status: action, screeningDate: action !== 'pending' ? new Date().toISOString().split('T')[0] : null }
          : candidate
      )
    )
    toast.success(`Candidate ${action}!`)
  }

  const filteredCandidates = candidates
    .filter(candidate => filterStatus === 'all' || candidate.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.appliedDate) - new Date(a.appliedDate)
        default:
          return 0
      }
    })

  // Analytics data
  const scoreDistributionData = [
    { range: '90-100', count: candidates.filter(c => c.score >= 90).length },
    { range: '80-89', count: candidates.filter(c => c.score >= 80 && c.score < 90).length },
    { range: '70-79', count: candidates.filter(c => c.score >= 70 && c.score < 80).length },
    { range: '60-69', count: candidates.filter(c => c.score >= 60 && c.score < 70).length },
    { range: 'Below 60', count: candidates.filter(c => c.score < 60).length }
  ]

  const statusData = [
    { name: 'Approved', value: candidates.filter(c => c.status === 'approved').length, color: '#10B981' },
    { name: 'Screened', value: candidates.filter(c => c.status === 'screened').length, color: '#3B82F6' },
    { name: 'Pending', value: candidates.filter(c => c.status === 'pending').length, color: '#F59E0B' },
    { name: 'Rejected', value: candidates.filter(c => c.status === 'rejected').length, color: '#EF4444' }
  ]

  const monthlyData = [
    { month: 'Jan', candidates: 45, approved: 15 },
    { month: 'Feb', candidates: 52, approved: 18 },
    { month: 'Mar', candidates: 48, approved: 16 },
    { month: 'Apr', candidates: 61, approved: 21 },
    { month: 'May', candidates: 55, approved: 19 },
    { month: 'Jun', candidates: 67, approved: 23 }
  ]

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

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Use Template</label>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {[
                      { name: 'Frontend Developer', skills: ['JavaScript', 'React', 'CSS'], experience: 'mid', type: 'technical' },
                      { name: 'Backend Developer', skills: ['Python', 'Node.js', 'Databases'], experience: 'senior', type: 'technical' },
                      { name: 'Full Stack Developer', skills: ['JavaScript', 'React', 'Node.js', 'Databases'], experience: 'senior', type: 'mixed' }
                    ].map((template) => (
                      <button
                        key={template.name}
                        type="button"
                        onClick={() => setCandidateData({
                          ...candidateData,
                          requiredSkills: template.skills,
                          experienceLevel: template.experience,
                          interviewType: template.type
                        })}
                        className="p-4 border border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-left transition-all"
                      >
                        <div className="font-medium text-slate-900 mb-1">{template.name}</div>
                        <div className="text-sm text-slate-600">{template.skills.slice(0, 2).join(', ')}...</div>
                      </button>
                    ))}
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
                          checked={candidateData.requiredSkills.includes(skill)}
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Passing Score (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={candidateData.passingScore}
                      onChange={(e) => setCandidateData({...candidateData, passingScore: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Limit (minutes)</label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={candidateData.timeLimit}
                      onChange={(e) => setCandidateData({...candidateData, timeLimit: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button type="button" className="btn-outline">Save as Draft</button>
                  <button
                    type="submit"
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Candidate Management</h2>
                  <p className="text-slate-600 mt-1">Total: {candidates.length} candidates</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="screened">Screened</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                  </select>
                  <button
                    onClick={handleBulkUpload}
                    className="btn-primary"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Resumes
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Candidates Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Candidate</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Score</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Applied Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-slate-900">{candidate.name}</div>
                            <div className="text-sm text-slate-600">{candidate.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-700">{candidate.position}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              candidate.score >= 85 ? 'text-green-600' :
                              candidate.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {candidate.score}%
                            </span>
                            <div className="w-16 bg-slate-200 rounded-full h-2 ml-2">
                              <div
                                className={`h-2 rounded-full ${
                                  candidate.score >= 85 ? 'bg-green-500' :
                                  candidate.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${candidate.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            candidate.status === 'approved' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'screened' ? 'bg-blue-100 text-blue-800' :
                            candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700">{candidate.appliedDate}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            {candidate.status === 'pending' && (
                              <button
                                onClick={() => handleCandidateAction(candidate.id, 'screened')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Screen
                              </button>
                            )}
                            {(candidate.status === 'screened' || candidate.status === 'pending') && (
                              <>
                                <button
                                  onClick={() => handleCandidateAction(candidate.id, 'approved')}
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleCandidateAction(candidate.id, 'rejected')}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {candidate.resumeUrl && (
                              <a
                                href={candidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                              >
                                View Resume
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCandidates.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-slate-600">No candidates found matching your filters.</p>
                </div>
              )}
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
            <div className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Candidates</p>
                      <p className="text-2xl font-bold text-slate-900">{candidates.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600">{candidates.filter(c => c.status === 'approved').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Average Score</p>
                      <p className="text-2xl font-bold text-slate-900">{Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Pass Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{Math.round((candidates.filter(c => c.status === 'approved').length / candidates.length) * 100)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Score Distribution Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution Pie Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Candidate Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Screening Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="candidates" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                    </AreaChart>
                  </ResponsiveContainer>
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