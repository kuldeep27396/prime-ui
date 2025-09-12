import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MobileInput } from '@/components/ui/mobile-input'
import { TouchButton } from '@/components/ui/touch-button'
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from '@/components/ui/mobile-card'
import { MobileContainer } from '@/components/ui/responsive-grid'
import { usePWA } from '@/utils/pwa'
import { Zap, Shield, Brain, Users, Wifi, WifiOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isOnline } = usePWA()
  const navigate = useNavigate()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Try real authentication first
      const { authService } = await import('@/services/authService')
      await authService.login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      console.log('Auth failed, using demo mode:', error)
      // For demo purposes, allow any login
      localStorage.setItem('auth_token', 'demo-token')
      setTimeout(() => {
        setIsLoading(false)
        navigate('/dashboard')
      }, 1500)
    }
  }

  const features = [
    { icon: Brain, text: 'AI-Powered Screening' },
    { icon: Shield, text: 'Enterprise Security' },
    { icon: Zap, text: 'Real-time Analytics' },
    { icon: Users, text: 'Smart Matching' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="flex min-h-screen">
        {/* Left side - Branding (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white relative overflow-hidden flex-col justify-center">
          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-2xl font-bold">
                P
              </div>
              <div>
                <h1 className="text-5xl font-bold">PRIME</h1>
                <p className="text-lg opacity-90">
                  Predictive Recruitment & Interview Machine
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Transform Your Hiring with AI Intelligence
            </h2>

            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Experience the future of recruitment with our comprehensive AI-powered platform that screens, interviews, and evaluates candidates automatically.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-base font-medium opacity-90">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-2">
                🚀 Ready to Experience AI Recruitment?
              </h3>
              <p className="text-sm opacity-90">
                Join thousands of companies already using PRIME to revolutionize their hiring process.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white/95 backdrop-blur-sm">
          <MobileContainer maxWidth="sm" padding={false}>
            <div className="w-full">
              {/* Mobile logo and connection status */}
              <div className="lg:hidden mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                      P
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">PRIME</h1>
                      <p className="text-sm text-gray-600">AI Recruitment Platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <MobileCard variant={isMobile ? 'compact' : 'default'}>
                <MobileCardHeader variant={isMobile ? 'compact' : 'default'}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                      P
                    </div>
                    <MobileCardTitle size="lg" className="text-center">
                      Welcome back
                    </MobileCardTitle>
                    <p className="text-gray-600 mt-2">
                      Sign in to your PRIME account
                    </p>
                  </div>
                </MobileCardHeader>

                <MobileCardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <MobileInput
                      type="email"
                      label="Email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      touchOptimized={isMobile}
                      required
                    />

                    <MobileInput
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      touchOptimized={isMobile}
                      required
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="accent-blue-600" />
                        Remember me
                      </label>
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </Link>
                    </div>

                    <TouchButton
                      type="submit"
                      loading={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
                      size={isMobile ? 'xl' : 'lg'}
                      hapticFeedback={isMobile}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </TouchButton>
                  </form>

                  <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <TouchButton
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      size={isMobile ? 'default' : 'default'}
                    >
                      <span>🔍</span>
                      Google
                    </TouchButton>
                    <TouchButton
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      size={isMobile ? 'default' : 'default'}
                    >
                      <span>📘</span>
                      Facebook
                    </TouchButton>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </MobileCardContent>
              </MobileCard>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">
                  🎯 Demo Credentials
                </h4>
                <div className="text-xs text-blue-600 space-y-1">
                  <p><strong>Email:</strong> demo@prime.ai</p>
                  <p><strong>Password:</strong> demo123</p>
                </div>
              </div>
            </div>
          </MobileContainer>
        </div>
      </div>
    </div>
  )
}