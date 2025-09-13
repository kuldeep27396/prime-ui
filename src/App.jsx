import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import InterviewPage from './pages/InterviewPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interviews/:id" element={<InterviewPage />} />
        <Route path="/interviews" element={<DashboardPage />} />
        <Route path="/practice" element={<DashboardPage />} />
        <Route path="/analytics" element={<DashboardPage />} />
        <Route path="/interviews/new" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App