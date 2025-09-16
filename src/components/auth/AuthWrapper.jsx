import { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function AuthWrapper({
  children,
  title,
  subtitle,
  type = 'signin' // 'signin' or 'signup'
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const features = [
    { icon: '🤖', text: 'AI-Powered Practice', color: 'bg-blue-500' },
    { icon: '👥', text: 'Expert Mentors', color: 'bg-emerald-500' },
    { icon: '📊', text: 'Progress Tracking', color: 'bg-purple-500' },
    { icon: '🎯', text: 'Custom Interviews', color: 'bg-amber-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-purple-50/90 backdrop-blur-sm"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-bounce-gentle"></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-16">
          <div className="max-w-md">
            {/* Logo and title */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Prime Interviews</h1>
                  <p className="text-slate-600 text-sm">AI-Powered Interview Practice</p>
                </div>
              </div>

              <Badge variant="gradient" size="lg" className="mb-4">
                {type === 'signup' ? '🚀 Join 10k+ Users' : '👋 Welcome Back'}
              </Badge>

              <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {type === 'signup'
                  ? 'Master Your Next Interview'
                  : 'Continue Your Journey'}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {type === 'signup'
                  ? 'Practice with AI, learn from experts, and land your dream job at top tech companies.'
                  : 'Welcome back! Continue practicing and improving your interview skills.'}
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  variant="glass"
                  className="p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <Badge variant="success" size="sm">Trusted</Badge>
              </div>
              <p className="text-sm text-slate-600">
                "Prime Interviews helped me land my dream job at Google!" - 10k+ success stories
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Authentication form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
              <p className="text-slate-600">{subtitle}</p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-600">{subtitle}</p>
            </div>

            {/* Clerk component wrapper */}
            <Card variant="glass" className="p-8 shadow-2xl border-white/20 backdrop-blur-md">
              {children}
            </Card>

            {/* Footer links */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}