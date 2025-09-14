import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { HMSRoomProvider } from '@100mslive/react-sdk'
import VideoInterviewRoom from '../components/VideoInterviewRoom'
import { generateRoomCode } from '../config/hmsConfig'

export default function InterviewRoomPage() {
  const { roomCode } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(true)

  const role = searchParams.get('role') || 'participant'
  const interviewType = searchParams.get('type') || 'mock'
  const duration = parseInt(searchParams.get('duration') || '60')
  const mentorName = searchParams.get('mentor')

  useEffect(() => {
    // In production, fetch room data from backend
    // For demo, creating mock room data
    const mockRoomData = {
      id: roomCode,
      name: `${interviewType} Interview`,
      type: interviewType,
      duration: duration,
      mentor: mentorName,
      status: 'active'
    }

    setRoomData(mockRoomData)
    setLoading(false)
  }, [roomCode, interviewType, duration, mentorName])

  const handleLeaveRoom = () => {
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading interview room...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please sign in to join the interview room.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <HMSRoomProvider>
      <VideoInterviewRoom
        roomCode={roomCode}
        userName={user.fullName || user.firstName || 'Anonymous'}
        role={role}
        onLeave={handleLeaveRoom}
        interviewType={interviewType}
        duration={duration}
      />
    </HMSRoomProvider>
  )
}