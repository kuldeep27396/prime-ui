import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 gradient-data rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Prime Interviews</span>
                <div className="text-xs text-blue-600 font-medium">PRIME - Predictive Recruitment & Interview Machine</div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link 
              to="/interviews" 
              className={location.pathname === '/interviews' ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Practice
            </Link>
            <Link 
              to="/schedule" 
              className={location.pathname === '/schedule' ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </Link>
            <Link 
              to="/skills" 
              className={location.pathname === '/skills' ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Skills
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton>
                  <button className="btn-ghost">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="btn-primary">Get Started</button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}