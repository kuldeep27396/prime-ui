import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import InterviewPage from './pages/InterviewPage'
import SchedulePage from './pages/SchedulePage'
import CompanyScreeningPage from './pages/CompanyScreeningPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/interviews" element={<InterviewPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/screening" element={<CompanyScreeningPage />} />
          <Route path="/skills" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App