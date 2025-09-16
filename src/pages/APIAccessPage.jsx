import PageTemplate from '../components/PageTemplate'

export default function APIAccessPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )

  return (
    <PageTemplate
      title="API Access"
      subtitle="Integrate Prime Interviews' AI capabilities into your applications"
      icon={icon}
      comingSoon={true}
      ctaText="Request Access"
      ctaLink="/contact"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🛠️ Developer API</h2>
          <p className="text-slate-600 mb-8">
            Build custom interview experiences with our comprehensive REST API.
            Access our AI-powered interview assessment, code evaluation, and candidate scoring systems.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Interview API</h3>
              <p className="text-slate-600 text-sm mb-4">
                Programmatically create and manage interview sessions with AI evaluation.
              </p>
              <div className="bg-slate-800 text-green-400 p-3 rounded-lg text-xs font-mono">
                POST /api/interviews
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Assessment API</h3>
              <p className="text-slate-600 text-sm mb-4">
                Get detailed scoring and feedback for coding challenges and responses.
              </p>
              <div className="bg-slate-800 text-green-400 p-3 rounded-lg text-xs font-mono">
                GET /api/assessments/:id
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Analytics API</h3>
              <p className="text-slate-600 text-sm mb-4">
                Access comprehensive candidate performance data and trends.
              </p>
              <div className="bg-slate-800 text-green-400 p-3 rounded-lg text-xs font-mono">
                GET /api/analytics
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Webhooks</h3>
              <p className="text-slate-600 text-sm mb-4">
                Real-time notifications for interview completions and scoring updates.
              </p>
              <div className="bg-slate-800 text-green-400 p-3 rounded-lg text-xs font-mono">
                POST /webhook/events
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Enterprise Ready</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                OAuth 2.0 & API Key authentication
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Rate limiting and usage analytics
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                99.9% uptime SLA
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">📋 Use Cases</h2>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-2">ATS Integration</h4>
              <p className="text-emerald-800 text-sm">
                Embed interview assessments directly in your recruiting platform.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Custom Portals</h4>
              <p className="text-purple-800 text-sm">
                Build branded interview experiences for your candidates.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Bulk Assessment</h4>
              <p className="text-orange-800 text-sm">
                Process thousands of candidates with automated scoring.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-100 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">📧 Early Access</h4>
            <p className="text-slate-600 text-sm">
              Join our developer beta program to get early access to the API and help shape its development.
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}