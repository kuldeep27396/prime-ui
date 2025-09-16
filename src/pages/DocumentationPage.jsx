import PageTemplate from '../components/PageTemplate'
import { Link } from 'react-router-dom'

export default function DocumentationPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )

  return (
    <PageTemplate
      title="Documentation"
      subtitle="Everything you need to know about using Prime Interviews effectively"
      icon={icon}
      ctaText="Get Started"
      ctaLink="/sign-up"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Quick Start */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm font-bold">1</span>
                Quick Start Guide
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Get up and running with Prime Interviews in less than 5 minutes.
                </p>
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-slate-900 mb-3">Getting Started</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600">
                    <li>Create your free account</li>
                    <li>Complete your profile setup</li>
                    <li>Choose your interview focus areas</li>
                    <li>Start your first AI practice session</li>
                    <li>Book a session with an expert mentor</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Features Guide */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm font-bold">2</span>
                Core Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🤖 AI Practice</h4>
                  <p className="text-blue-800 text-sm">
                    Interactive coding challenges with real-time feedback and explanations.
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-2">👨‍💼 Expert Mentors</h4>
                  <p className="text-emerald-800 text-sm">
                    1-on-1 sessions with engineers from top tech companies.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">📊 Progress Tracking</h4>
                  <p className="text-purple-800 text-sm">
                    Detailed analytics and personalized improvement recommendations.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">🏢 Company Prep</h4>
                  <p className="text-orange-800 text-sm">
                    Company-specific interview questions and preparation guides.
                  </p>
                </div>
              </div>
            </section>

            {/* Advanced Topics */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm font-bold">3</span>
                Advanced Topics
              </h2>
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h4 className="font-semibold text-slate-900 mb-2">System Design Interviews</h4>
                  <p className="text-slate-600 text-sm mb-3">
                    Learn how to approach large-scale system design problems with structured thinking.
                  </p>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Advanced</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h4 className="font-semibold text-slate-900 mb-2">Behavioral Interviews</h4>
                  <p className="text-slate-600 text-sm mb-3">
                    Master the STAR method and showcase your experiences effectively.
                  </p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Beginner</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <h4 className="font-semibold text-slate-900 mb-2">Coding Best Practices</h4>
                  <p className="text-slate-600 text-sm mb-3">
                    Write clean, efficient code that impresses interviewers.
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Intermediate</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">📚 Quick Links</h3>
          <div className="space-y-3">
            <Link to="/dashboard" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <h4 className="font-semibold text-blue-900">Dashboard</h4>
              <p className="text-blue-700 text-sm">Your progress overview</p>
            </Link>
            <Link to="/schedule" className="block p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <h4 className="font-semibold text-emerald-900">Book Mentor</h4>
              <p className="text-emerald-700 text-sm">Schedule expert sessions</p>
            </Link>
            <Link to="/screening" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-semibold text-purple-900">For Companies</h4>
              <p className="text-purple-700 text-sm">Hiring solutions</p>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">💡 Need Help?</h4>
            <p className="text-slate-600 text-sm mb-3">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link to="/help-center" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Visit Help Center →
            </Link>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}