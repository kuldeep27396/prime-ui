import PageTemplate from '../components/PageTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

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
        <Card variant="elevated" className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              📱 iOS & Android
              <Badge variant="gradient" size="lg">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              Get ready for interviews anywhere with our native mobile apps. Practice coding,
              system design, and behavioral questions with the same powerful AI technology.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mb-4">Coming Features:</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                Offline practice mode
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3"></div>
                Push notifications for scheduled interviews
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3"></div>
                Voice-to-text for coding problems
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3"></div>
                Progress sync across all devices
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button variant="outline" className="w-full" disabled>
                Get Notified When Available
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            🚀 Key Benefits
          </h2>
          <div className="space-y-4">
            <Card variant="gradient" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Badge variant="info" size="sm">Mobile</Badge>
                  Practice Anywhere
                </h4>
                <p className="text-blue-800 text-sm">
                  Turn your commute time into interview prep time with mobile-optimized exercises.
                </p>
              </CardContent>
            </Card>

            <Card variant="gradient" className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <Badge variant="success" size="sm">Sync</Badge>
                  Seamless Experience
                </h4>
                <p className="text-emerald-800 text-sm">
                  Start on mobile, continue on desktop. Your progress syncs automatically.
                </p>
              </CardContent>
            </Card>

            <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Badge variant="gradient" size="sm">Fast</Badge>
                  Native Performance
                </h4>
                <p className="text-purple-800 text-sm">
                  Fast, responsive interface optimized for touch interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}