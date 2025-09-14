import { useState, useEffect, useRef } from 'react'
import {
  useHMSStore,
  useHMSActions,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectLocalPeer,
  selectRemotePeers,
  selectCameraStreamByPeerID
} from '@100mslive/react-sdk'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HMS_CONFIG } from '../config/hmsConfig'

export default function VideoInterviewRoom({
  roomCode,
  userName,
  role = 'participant',
  onLeave,
  interviewType = 'mock',
  duration = 60
}) {
  console.log('VideoInterviewRoom mounted with props:', {
    roomCode,
    userName,
    role,
    interviewType,
    duration
  })

  // Initialize HMS
  useEffect(() => {
    console.log('Initializing HMS SDK with config:', {
      roomId: HMS_CONFIG.roomId,
      appId: HMS_CONFIG.appId,
      accessKey: HMS_CONFIG.accessKey,
    });

    // Initialize HMS SDK
    hmsActions.initialize()
      .then(() => {
        console.log('HMS SDK initialized successfully');
        // Try auto-joining if we have the required info
        if (roomCode && userName && !isConnected) {
          joinRoom().catch(console.error);
        }
      })
      .catch(err => {
        console.error('HMS SDK initialization failed:', err);
        toast.error('Failed to initialize video call system');
      });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up HMS connection...');
      hmsActions.leave().catch(console.error);
    };
  }, [hmsActions]);

  // Real HMS hooks for actual video connection
  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const localPeer = useHMSStore(selectLocalPeer)
  const remotePeers = useHMSStore(selectRemotePeers)
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled)
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled)

  const [isJoining, setIsJoining] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(duration * 60)
  const [isRecording, setIsRecording] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (isConnected && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleLeaveRoom()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isConnected, timeRemaining])

  const joinRoom = async () => {
    setIsJoining(true)
    try {
      if (!roomCode) {
        throw new Error('Room code is required')
      }

      // Generate auth token with HMS_CONFIG values
      console.log('Attempting to connect to 100ms room:', {
        roomId: HMS_CONFIG.roomId,
        userName,
        role,
        templateId: HMS_CONFIG.templateId
      })

      const authToken = create100msToken({
        roomId: HMS_CONFIG.roomId,
        userId: userName,
        role: role,
        appId: HMS_CONFIG.appId,
        templateId: HMS_CONFIG.templateId
      });

      console.log('Generated auth token:', authToken)

      // Join the actual 100ms room
      await hmsActions.join({
        authToken,
        userName,
        settings: {
          isAudioMuted: false,
          isVideoMuted: false
        }
      })

      toast.success('🎥 Connected to live video call!')
      console.log('Successfully joined 100ms room')

    } catch (error) {
      console.error('Failed to join 100ms room:', error)

      // More user-friendly error messages
      let errorMessage = 'Connection failed: '
      if (error.message.includes('invalid room id')) {
        errorMessage += 'Invalid room code. Please ensure the room exists in your 100ms dashboard.'
        console.error('Room ID being used:', HMS_CONFIG.roomId)
      } else if (error.message.includes('permission denied')) {
        errorMessage += 'Permission denied. Please check your role and room access settings.'
        console.error('Role being used:', role)
      } else if (error.message.includes('token')) {
        errorMessage += 'Authentication failed. Please check your 100ms credentials.'
        console.error('Token generation config:', {
          roomId: HMS_CONFIG.roomId,
          appId: HMS_CONFIG.appId,
          templateId: HMS_CONFIG.templateId
        })
      } else {
        errorMessage += error.message
      }

      toast.error(errorMessage)

      // Log the full configuration for debugging
      console.log('100ms Configuration:', {
        roomId: HMS_CONFIG.roomId,
        appId: HMS_CONFIG.appId,
        templateId: HMS_CONFIG.templateId,
        role,
        userName
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveRoom = async () => {
    try {
      await hmsActions.leave()
      onLeave?.()
      toast.success('Left interview room')
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  }

  const toggleAudio = () => {
    hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
  }

  const toggleVideo = () => {
    hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Debug logs
  console.log('Room state:', {
    isConnected,
    localPeer,
    remotePeers,
    isLocalAudioEnabled,
    isLocalVideoEnabled
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Join Interview Room</h2>
          <p className="text-slate-600 mb-6">Room Code: <span className="font-mono font-bold">{roomCode}</span></p>

          <div className="space-y-4 mb-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <div className="px-3 py-2 bg-slate-100 rounded-lg text-slate-900">{userName}</div>
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <div className="px-3 py-2 bg-slate-100 rounded-lg text-slate-900 capitalize">{role}</div>
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-1">Interview Type</label>
              <div className="px-3 py-2 bg-slate-100 rounded-lg text-slate-900 capitalize">{interviewType}</div>
            </div>
          </div>

          <button
            onClick={joinRoom}
            disabled={isJoining}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? 'Joining...' : 'Join Interview'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-white font-semibold">Room: {roomCode}</div>
            <div className="text-slate-300">|</div>
            <div className="text-slate-300">{interviewType} Interview</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-white font-mono text-lg">
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={`grid gap-4 h-[calc(100vh-200px)] ${remotePeers.length === 0 ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
          {/* Local Peer Video */}
          {localPeer && (
            <VideoTile
              peer={localPeer}
              isLocal={true}
              isAudioEnabled={isLocalAudioEnabled}
              isVideoEnabled={isLocalVideoEnabled}
            />
          )}

          {/* Remote Peers */}
          {remotePeers.map(peer => (
            <VideoTile
              key={peer.id}
              peer={peer}
              isLocal={false}
              isAudioEnabled={true}
              isVideoEnabled={true}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${isLocalAudioEnabled
              ? 'bg-slate-600 hover:bg-slate-500 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
          >
            {isLocalAudioEnabled ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${isLocalVideoEnabled
              ? 'bg-slate-600 hover:bg-slate-500 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
          >
            {isLocalVideoEnabled ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 18M5.636 5.636L6 6" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-slate-600 hover:bg-slate-500 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function VideoTile({ peer, isLocal, isAudioEnabled = true, isVideoEnabled = true }) {
  const videoRef = useRef(null);
  const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      if (videoTrack.enabled) {
        videoTrack.attach(videoRef.current);
      } else {
        videoTrack.detach();
      }
    }
  }, [videoTrack]);

  return (
    <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${!isVideoEnabled || !videoTrack?.enabled ? 'hidden' : ''}`}
      />

      {(!videoTrack?.enabled || !isVideoEnabled) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-slate-400 text-sm">Camera Off</div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-1">
        <span className="text-white text-sm font-medium">
          {isLocal ? 'You' : peer.name}
        </span>
      </div>

      <div className="absolute top-4 right-4 flex space-x-2">
        {!isAudioEnabled && (
          <div className="bg-red-600 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

