import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/dashboard/Dashboard'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ChatbotDemo from '@/pages/chatbot/ChatbotDemo'
import LiveAIInterviewPage from '@/pages/interview/LiveAIInterviewPage'
import OneWayInterviewPage from '@/pages/interview/OneWayInterviewPage'
import TechnicalAssessmentPage from '@/pages/assessment/TechnicalAssessmentPage'
import ProctoringDemoPage from '@/pages/proctoring/ProctoringDemoPage'
import { MobileContainer } from '@/components/ui/responsive-grid'

// Initialize PWA functionality
import '@/utils/pwa'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatbot" element={<ChatbotDemo />} />
          <Route path="interviews/live-ai" element={<LiveAIInterviewPage />} />
          <Route path="interviews/one-way" element={<OneWayInterviewPage />} />
          <Route path="assessments/technical" element={<TechnicalAssessmentPage />} />
          <Route path="proctoring" element={<ProctoringDemoPage />} />
          
          {/* Placeholder pages for navigation - Mobile optimized */}
          <Route path="jobs" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Jobs Management</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - Job posting and management interface</p>
              </div>
            </MobileContainer>
          } />
          <Route path="candidates" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Candidates</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - Candidate management and search</p>
              </div>
            </MobileContainer>
          } />
          <Route path="interviews" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Interviews</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - Interview scheduling and management</p>
              </div>
            </MobileContainer>
          } />
          <Route path="assessments" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Assessments</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - Assessment management</p>
              </div>
            </MobileContainer>
          } />
          <Route path="analytics" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - Advanced analytics dashboard</p>
              </div>
            </MobileContainer>
          } />
          <Route path="settings" element={
            <MobileContainer>
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">Coming soon - System configuration</p>
              </div>
            </MobileContainer>
          } />
        </Route>
      </Routes>
      
      <Toaster />
    </div>
  )
}

export default App