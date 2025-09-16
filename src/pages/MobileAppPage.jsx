import PageTemplate from '../components/PageTemplate'

export default function MobileAppPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )

  return (
    <PageTemplate
      title="Mobile App"
      subtitle="Practice interviews on the go with our upcoming mobile application"
      icon={icon}
      comingSoon={true}
      ctaText="Download Soon"
      ctaLink="/sign-up"
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📱 iOS & Android</h2>
          <p className="text-slate-600 mb-6">
            Get ready for interviews anywhere with our native mobile apps. Practice coding,
            system design, and behavioral questions with the same powerful AI technology.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">Coming Features:</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Offline practice mode
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Push notifications for scheduled interviews
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Voice-to-text for coding problems
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Progress sync across all devices
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🚀 Key Benefits</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Practice Anywhere</h4>
              <p className="text-blue-800 text-sm">
                Turn your commute time into interview prep time with mobile-optimized exercises.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Seamless Experience</h4>
              <p className="text-green-800 text-sm">
                Start on mobile, continue on desktop. Your progress syncs automatically.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Native Performance</h4>
              <p className="text-purple-800 text-sm">
                Fast, responsive interface optimized for touch interactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}