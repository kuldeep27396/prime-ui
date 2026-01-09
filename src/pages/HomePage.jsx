import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Building2,
  Users,
  Brain,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Target,
  Award
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('companies')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative pt-16 sm:pt-20 pb-24 sm:pb-32 lg:pb-40 z-10">
              <div className="text-center relative z-20">
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-Powered Interview Platform
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
                  Hire Smarter.{' '}
                  <span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                    Interview Better.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                  AI-powered screening for companies. Smart mock practice for candidates.
                  One platform, endless possibilities.
                </p>

                {/* Dual CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0 max-w-2xl mx-auto">
                  <Link
                    to="/company/onboarding"
                    className="flex-1 bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Building2 className="w-5 h-5" />
                    For Companies
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Brain className="w-5 h-5" />
                    Practice Interviews
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white">10K+</div>
                    <div className="text-white/70 text-sm">AI Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white">500+</div>
                    <div className="text-white/70 text-sm">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white">80%</div>
                    <div className="text-white/70 text-sm">Time Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 91.7C120 83 240 67 360 58.3C480 50 600 50 720 55C840 60 960 70 1080 71.7C1200 73 1320 67 1380 63.3L1440 60V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* Two Products Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Two Ways to Succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Whether you're hiring or interviewing, PRIME has you covered.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-200 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'companies'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Building2 className="w-5 h-5 inline mr-2" />
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('candidates')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'candidates'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                For Candidates
              </button>
            </div>
          </div>

          {/* Companies Content */}
          {activeTab === 'companies' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-6">
                  B2B AI Screening
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">
                  Screen 100s of candidates in hours, not weeks
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Let AI conduct first-round interviews 24/7. Get scored candidates with detailed
                  reasoning, so you only talk to the best fits.
                </p>

                <div className="space-y-4 mb-8">
                  <Feature icon={Zap} text="Candidates receive AI interview links automatically" />
                  <Feature icon={Brain} text="AI asks recruiter-style questions, adapts in real-time" />
                  <Feature icon={Target} text="Get ranked shortlist with AI reasoning for each" />
                  <Feature icon={Clock} text="Reduce time-to-hire by 80%" />
                </div>

                <Link
                  to="/company/onboarding"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-slate-500 mt-2">2 free AI interviews • No credit card required</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">How It Works</h4>
                    <p className="text-slate-500 text-sm">Simple 4-step process</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Step number={1} title="Create Job Posting" description="Set up your job with requirements and custom AI questions" />
                  <Step number={2} title="Receive Applications" description="Candidates apply via your public job link" />
                  <Step number={3} title="AI Interviews" description="AI conducts video interviews, evaluates answers in real-time" />
                  <Step number={4} title="Review Shortlist" description="Get ranked candidates with scores and AI reasoning" />
                </div>
              </div>
            </div>
          )}

          {/* Candidates Content */}
          {activeTab === 'candidates' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 mb-6">
                  AI Mock Practice
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">
                  Ace every interview with unlimited AI practice
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Practice technical interviews for software, data, and IT roles.
                  Get instant feedback and improve your skills.
                </p>

                <div className="space-y-4 mb-8">
                  <Feature icon={Brain} text="DSA, System Design, Behavioral & more" color="emerald" />
                  <Feature icon={Zap} text="Real-time AI feedback on every answer" color="emerald" />
                  <Feature icon={TrendingUp} text="Track progress and identify weak areas" color="emerald" />
                  <Feature icon={Clock} text="Practice anytime, unlimited sessions" color="emerald" />
                </div>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Start Practicing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-slate-500 mt-2">Free practice sessions • No account needed to try</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Practice Categories</h4>
                    <p className="text-slate-500 text-sm">For IT & Software roles</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CategoryCard name="DSA" icon="🧮" color="blue" />
                  <CategoryCard name="System Design" icon="🏗️" color="purple" />
                  <CategoryCard name="Behavioral" icon="🎯" color="green" />
                  <CategoryCard name="Frontend" icon="🎨" color="orange" />
                  <CategoryCard name="Backend" icon="⚙️" color="red" />
                  <CategoryCard name="DevOps" icon="🚀" color="cyan" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Free"
              price="$0"
              description="Try it out"
              features={[
                "2 AI screening interviews",
                "Basic candidate reports",
                "Email support"
              ]}
              cta="Get Started"
              ctaLink="/company/onboarding"
            />
            <PricingCard
              name="Growth"
              price="$199"
              period="/month"
              description="For growing teams"
              features={[
                "Up to 100 interviews/month",
                "Detailed AI reports",
                "Custom questions",
                "Priority support",
                "Export to CSV"
              ]}
              highlighted
              cta="Start Free Trial"
              ctaLink="/company/onboarding"
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large organizations"
              features={[
                "Unlimited interviews",
                "White-label option",
                "API access",
                "Dedicated support",
                "Custom integrations"
              ]}
              cta="Contact Sales"
              ctaLink="/contact"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Hiring Teams & Candidates
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              quote="We reduced our screening time by 75%. The AI reports are incredibly detailed."
              author="Sarah Chen"
              role="Head of Talent, TechCorp"
            />
            <Testimonial
              quote="The mock interviews helped me land my dream job at a FAANG company."
              author="Raj Patel"
              role="Software Engineer"
            />
            <Testimonial
              quote="Finally, a tool that makes high-volume hiring manageable without sacrificing quality."
              author="Marcus Johnson"
              role="HR Director, ScaleUp Inc"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 500+ companies using PRIME to hire smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/company/onboarding"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
            >
              Start Screening Candidates
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Practice Interviews Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PRIME Interviews</h3>
              <p className="text-slate-400 text-sm">
                AI-powered platform for smarter hiring and interview practice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/company/onboarding" className="hover:text-white">Get Started</Link></li>
                <li><Link to="/screening" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Sales</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/dashboard" className="hover:text-white">Mock Interviews</Link></li>
                <li><Link to="/interviews" className="hover:text-white">Practice</Link></li>
                <li><Link to="/help-center" className="hover:text-white">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            © 2026 PRIME Interviews. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon: Icon, text, color = 'indigo' }) {
  const colors = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600'
  }
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${colors[color]}`} />
      <span className="text-slate-700">{text}</span>
    </div>
  )
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <div>
        <h5 className="font-semibold text-slate-900">{title}</h5>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
    </div>
  )
}

function CategoryCard({ name, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200',
    cyan: 'bg-cyan-50 border-cyan-200'
  }
  return (
    <div className={`${colors[color]} border rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
      <span className="text-2xl mb-2 block">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  )
}

function PricingCard({ name, price, period, description, features, highlighted, cta, ctaLink }) {
  return (
    <div className={`rounded-2xl p-8 ${highlighted ? 'bg-indigo-600 text-white ring-4 ring-indigo-300' : 'bg-white border border-slate-200'}`}>
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
      <p className={`text-sm mb-4 ${highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>{description}</p>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-slate-900'}`}>{price}</span>
        {period && <span className={highlighted ? 'text-indigo-200' : 'text-slate-500'}>{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 ${highlighted ? 'text-indigo-200' : 'text-green-500'}`} />
            <span className={`text-sm ${highlighted ? 'text-indigo-100' : 'text-slate-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to={ctaLink}
        className={`block text-center py-3 rounded-lg font-semibold transition-colors ${highlighted
            ? 'bg-white text-indigo-600 hover:bg-indigo-50'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function Testimonial({ quote, author, role }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-slate-700 mb-4">"{quote}"</p>
      <div>
        <p className="font-semibold text-slate-900">{author}</p>
        <p className="text-slate-500 text-sm">{role}</p>
      </div>
    </div>
  )
}