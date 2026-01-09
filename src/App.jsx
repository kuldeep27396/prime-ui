import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'

// Use mock auth for local development, real Clerk for production
import { useUser, BYPASS_AUTH } from './utils/mockAuth.jsx'
import * as ClerkReact from '@clerk/clerk-react'
const useUserHook = BYPASS_AUTH ? useUser : ClerkReact.useUser
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import InterviewPage from './pages/InterviewPage'
import MockInterviewPage from './pages/MockInterviewPage'
import CompanyScreeningPage from './pages/CompanyScreeningPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DocumentationPage from './pages/DocumentationPage'
import APIAccessPage from './pages/APIAccessPage'
import MobileAppPage from './pages/MobileAppPage'
import HelpCenterPage from './pages/HelpCenterPage'
import BlogPage from './pages/BlogPage'
import AboutUsPage from './pages/AboutUsPage'
import CareersPage from './pages/CareersPage'
import ContactPage from './pages/ContactPage'
import ErrorBoundary from './components/ErrorBoundary'

// B2B Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyOnboarding from './pages/company/CompanyOnboarding'
import JobsListPage from './pages/company/JobsListPage'
import CreateJobPage from './pages/company/CreateJobPage'
import CandidatesPage from './pages/company/CandidatesPage'

// AI Interview Pages
import AIInterviewRoom from './pages/interview/AIInterviewRoom'

// Public Pages
import JobApplicationPage from './pages/public/JobApplicationPage'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
  const { isLoaded, isSignedIn } = useUserHook();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Toaster position="top-right" />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />

              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><HomePage /></>} />
              <Route path="/documentation" element={<><Navbar /><DocumentationPage /></>} />
              <Route path="/api-access" element={<><Navbar /><APIAccessPage /></>} />
              <Route path="/mobile-app" element={<><Navbar /><MobileAppPage /></>} />
              <Route path="/help-center" element={<><Navbar /><HelpCenterPage /></>} />
              <Route path="/blog" element={<><Navbar /><BlogPage /></>} />
              <Route path="/about" element={<><Navbar /><AboutUsPage /></>} />
              <Route path="/careers" element={<><Navbar /><CareersPage /></>} />
              <Route path="/contact" element={<><Navbar /><ContactPage /></>} />

              {/* B2C - Mock Interview Routes */}
              <Route path="/dashboard" element={<><Navbar /><DashboardPage /></>} />
              <Route path="/interviews" element={<><Navbar /><InterviewPage /></>} />
              <Route path="/mock-practice" element={<><Navbar /><MockInterviewPage /></>} />
              <Route path="/mock/:sessionId" element={<><Navbar /><InterviewPage /></>} />

              {/* B2B - Company Routes */}
              <Route path="/screening" element={<><Navbar /><CompanyScreeningPage /></>} />
              <Route path="/company/dashboard" element={<><Navbar /><CompanyDashboard /></>} />
              <Route path="/company/onboarding" element={<CompanyOnboarding />} />
              <Route path="/company/jobs" element={<><Navbar /><JobsListPage /></>} />
              <Route path="/company/jobs/new" element={<><Navbar /><CreateJobPage /></>} />
              <Route path="/company/jobs/:jobId" element={<><Navbar /><JobsListPage /></>} />
              <Route path="/company/jobs/:jobId/candidates" element={<><Navbar /><CandidatesPage /></>} />
              <Route path="/company/candidates" element={<><Navbar /><CandidatesPage /></>} />
              <Route path="/company/analytics" element={<><Navbar /><CompanyDashboard /></>} />
              <Route path="/company/settings" element={<><Navbar /><CompanyDashboard /></>} />
              <Route path="/company/billing" element={<><Navbar /><CompanyDashboard /></>} />

              {/* Public Job Application (no auth) */}
              <Route path="/apply/:jobId" element={<JobApplicationPage />} />

              {/* AI Interview Room (token-based auth) */}
              <Route path="/interview/:token" element={<AIInterviewRoom />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
                    <p className="text-slate-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                    <Link to="/" className="btn-primary">
                      Go to Home
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App