import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Shield, Zap, Users, Eye, EyeOff, Check } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Try real registration first
      const { authService } = await import('@/services/authService')
      await authService.register({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        password: formData.password,
      })
      navigate('/dashboard')
    } catch (error) {
      console.log('Registration failed, using demo mode:', error)
      // For demo purposes, allow any registration
      localStorage.setItem('auth_token', 'demo-token')
      setTimeout(() => {
        setIsLoading(false)
        navigate('/dashboard')
      }, 2000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const benefits = [
    'AI-powered candidate screening',
    'Automated interview scheduling',
    'Real-time analytics dashboard',
    'Advanced proctoring system',
    'Technical assessment tools',
    'Bias detection algorithms'
  ]

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Left side - Registration form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">PRIME</h1>
                  <p className="text-sm text-gray-600">AI Recruitment Platform</p>
                </div>
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Create your account
                </CardTitle>
                <p className="text-center text-gray-600">
                  Start your AI-powered recruitment journey
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <Input
                        name="company"
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={handleChange}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-11 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className={`h-1 flex-1 rounded ${
                          passwordStrength === 'strong' ? 'bg-green-500' :
                          passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`text-xs ${
                          passwordStrength === 'strong' ? 'text-green-600' :
                          passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength === 'strong' ? 'Strong' :
                           passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="h-11 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords don't match</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                      required 
                    />
                    <label className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-purple-600 hover:text-purple-500">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-purple-600 hover:text-purple-500">Privacy Policy</Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isLoading || formData.password !== formData.confirmPassword}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </form>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col justify-center max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">P</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">PRIME</h1>
                <p className="text-purple-100">Predictive Recruitment & Interview Machine</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Join the Future of Recruitment
            </h2>
            
            <p className="text-xl text-purple-100 mb-8">
              Transform your hiring process with cutting-edge AI technology that saves time, reduces bias, and finds the perfect candidates.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-100">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold mb-2">🚀 Free Trial Included</h3>
              <p className="text-sm text-purple-100">
                Start with our 14-day free trial. No credit card required. Experience the full power of AI recruitment.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  )
}