import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Suspense } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import InterviewPage from './pages/InterviewPage'
import SchedulePage from './pages/SchedulePage'
import CompanyScreeningPage from './pages/CompanyScreeningPage'
import InterviewRoomPage from './pages/InterviewRoomPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ErrorBoundary from './components/ErrorBoundary'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log('App rendering...', { isLoaded, isSignedIn });

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              {isSignedIn ? (
                <>
                  <Route path="/" element={<><Navbar /><HomePage /></>} />
                  <Route path="/dashboard" element={<><Navbar /><DashboardPage /></>} />
                  <Route path="/interviews" element={<><Navbar /><InterviewPage /></>} />
                  <Route path="/schedule" element={<><Navbar /><SchedulePage /></>} />
                  <Route path="/screening" element={<><Navbar /><CompanyScreeningPage /></>} />
                  <Route path="/skills" element={<><Navbar /><DashboardPage /></>} />
                  <Route path="/interview-room/:roomCode" element={<><Navbar /><InterviewRoomPage /></>} />
                </>
              ) : (
                <Route path="*" element={<SignInPage />} />
              )}
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