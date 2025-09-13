import { Link } from 'react-router-dom'
import { technicalTopics, companies } from '../data/mockData'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative pt-20 pb-32 lg:pb-40">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                    </svg>
                    AI-Powered Technical Interviews
                  </span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  Master Your{' '}
                  <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                    Technical
                  </span>{' '}
                  Interviews
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Practice with AI-powered mock interviews for all technical roles. 
                  Get expert feedback on algorithms, system design, frontend, backend, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard" className="btn-primary btn-lg">
                    Start Practicing Now
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <button className="btn-outline btn-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 000-9H9v9zm4 0h1.5a4.5 4.5 0 000-9H13v9z" />
                    </svg>
                    View Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      </div>

      {/* Companies Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Practice for interviews at top companies
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-center">
            {companies.map((company, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {company.logo}
                </div>
                <div className="text-sm font-medium text-slate-700">{company.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Master Every Technical Interview Topic
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI understands the nuances of technical roles and provides targeted practice 
              across all essential topics and technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {technicalTopics.map((topic, index) => (
              <div key={index} className="card hover:scale-105 transition-all duration-200 text-center">
                <div className="text-2xl mb-3">
                  {topic.includes('System') ? '🏗️' : 
                   topic.includes('Algorithms') ? '🧠' : 
                   topic.includes('JavaScript') ? '🟨' : 
                   topic.includes('Python') ? '🐍' : 
                   topic.includes('React') ? '⚛️' : 
                   topic.includes('Java') ? '☕' : 
                   topic.includes('Node') ? '🟢' : 
                   topic.includes('Database') ? '🗃️' : 
                   topic.includes('Cloud') ? '☁️' : 
                   topic.includes('DevOps') ? '🔧' : 
                   topic.includes('API') ? '🔌' : 
                   topic.includes('Security') ? '🔒' : 
                   topic.includes('Machine') ? '🤖' : 
                   topic.includes('Mobile') ? '📱' : 
                   topic.includes('Microservices') ? '🔄' : 
                   topic.includes('Performance') ? '⚡' : 
                   topic.includes('Testing') ? '🧪' : 
                   topic.includes('Networking') ? '🌐' : 
                   topic.includes('Docker') ? '🐳' : '⚙️'}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{topic}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Engineers Choose Prime
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built for all technical interviews with AI that understands 
              the technical depth and practical challenges of software engineering roles.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 gradient-tech rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Technical Deep Dives</h3>
              <p className="text-slate-600 leading-relaxed">
                Practice complex system design, algorithm optimization, and distributed computing scenarios 
                that mirror real software engineering challenges.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 gradient-data rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Code Review</h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant feedback on your code across multiple languages and frameworks 
                with suggestions for optimization and best practices.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Skill Progression</h3>
              <p className="text-slate-600 leading-relaxed">
                Track your improvement across different technical domains with 
                detailed analytics and personalized learning recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Land Your Dream Tech Role?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join thousands of engineers who've improved their interview skills and landed roles 
            at top tech companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary btn-lg bg-white text-blue-600 hover:bg-gray-50">
              Start Free Practice
            </Link>
            <button className="btn-outline btn-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
              View Success Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}