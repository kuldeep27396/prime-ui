import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { interviews, companies } from '../data/mockData'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function SchedulePage() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [newInterview, setNewInterview] = useState({
    title: '',
    company: '',
    type: 'technical',
    duration: 60,
    notes: ''
  })

  // Convert interviews to calendar events
  const events = useMemo(() => {
    return interviews.map(interview => {
      const startDate = interview.scheduledAt ? new Date(interview.scheduledAt) : new Date()
      const endDate = new Date(startDate.getTime() + interview.duration * 60000)
      
      return {
        id: interview.id,
        title: interview.title,
        start: startDate,
        end: endDate,
        resource: interview,
        color: interview.difficulty === 'Hard' ? '#dc2626' : 
               interview.difficulty === 'Medium' ? '#d97706' : '#059669'
      }
    })
  }, [])

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(start)
    setShowBookingModal(true)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
  }

  const handleBookInterview = () => {
    if (!newInterview.title || !newInterview.company) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Interview scheduled successfully!')
    setShowBookingModal(false)
    setNewInterview({
      title: '',
      company: '',
      type: 'technical',
      duration: 60,
      notes: ''
    })
  }

  const interviewTypes = [
    { value: 'technical', label: 'Technical Interview', icon: '💻' },
    { value: 'behavioral', label: 'Behavioral Interview', icon: '🗣️' },
    { value: 'system-design', label: 'System Design', icon: '🏗️' },
    { value: 'coding', label: 'Coding Challenge', icon: '⌨️' },
    { value: 'mock', label: 'Mock Interview', icon: '🎭' }
  ]

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Scheduler</h1>
          <p className="text-slate-600">Schedule and manage your technical interviews</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Calendar</h2>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Schedule Interview
                </button>
              </div>
              
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  views={['month', 'week', 'day']}
                  defaultView="week"
                  step={30}
                  showMultiDayTimes
                  className="rbc-calendar"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Interviews</h3>
              <div className="space-y-3">
                {interviews.filter(i => i.status === 'upcoming').slice(0, 3).map((interview) => (
                  <motion.div
                    key={interview.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{interview.company}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        interview.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {interview.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{interview.position}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {interview.duration} min
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interview Types */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Interview Types</h3>
              <div className="space-y-2">
                {interviewTypes.map((type) => (
                  <div key={type.value} className="flex items-center p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-lg mr-3">{type.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Scheduled</span>
                  <span className="font-semibold text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completed</span>
                  <span className="font-semibold text-green-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Upcoming</span>
                  <span className="font-semibold text-orange-600">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-slate-700">{selectedEvent.resource.company}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">
                    {moment(selectedEvent.start).format('MMMM Do, YYYY [at] h:mm A')}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">{selectedEvent.resource.duration} minutes</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="btn-primary flex-1">Join Interview</button>
                <button className="btn-outline">Reschedule</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Schedule New Interview</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interview Title *
                  </label>
                  <input
                    type="text"
                    value={newInterview.title}
                    onChange={(e) => setNewInterview({...newInterview, title: e.target.value})}
                    className="input w-full"
                    placeholder="e.g., Senior Software Engineer - Technical Round"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company *
                  </label>
                  <select
                    value={newInterview.company}
                    onChange={(e) => setNewInterview({...newInterview, company: e.target.value})}
                    className="input w-full"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.name} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({...newInterview, type: e.target.value})}
                    className="input w-full"
                  >
                    {interviewTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newInterview.duration}
                    onChange={(e) => setNewInterview({...newInterview, duration: parseInt(e.target.value)})}
                    className="input w-full"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newInterview.notes}
                    onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                    className="textarea w-full"
                    rows={3}
                    placeholder="Additional notes or preparation details..."
                  />
                </div>
                
                {selectedDate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Scheduled for:</strong> {moment(selectedDate).format('MMMM Do, YYYY [at] h:mm A')}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button onClick={handleBookInterview} className="btn-primary flex-1">
                  Schedule Interview
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <Toaster position="top-right" />
    </div>
  )
}