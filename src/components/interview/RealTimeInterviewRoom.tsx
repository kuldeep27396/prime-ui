/**
 * Real-time interview room component integrating all communication features
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { WebSocketService, useWebSocket } from '../../services/websocketService';
import { WebRTCService } from '../../services/webrtcService';
import RealTimeChat, { useRealTimeChat } from '../collaboration/RealTimeChat';
import CollaborativeWhiteboard from '../collaboration/CollaborativeWhiteboard';

interface RealTimeInterviewRoomProps {
  interviewId: string;
  userId: string;
  userName: string;
  userRole: 'interviewer' | 'candidate';
  token?: string;
}

export const RealTimeInterviewRoom: React.FC<RealTimeInterviewRoomProps> = ({
  interviewId,
  userId,
  userName,
  userRole,
  token
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [connectionType, setConnectionType] = useState<'webrtc' | 'daily'>('webrtc');
  const [interviewState, setInterviewState] = useState<'waiting' | 'connecting' | 'active' | 'ended'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);

  // WebSocket connection
  const { wsService, isConnected: wsConnected } = useWebSocket(userId, token);

  // Chat functionality
  const { messages, sendMessage, handleTyping } = useRealTimeChat(
    `interview_${interviewId}`,
    userId,
    wsService
  );

  // Initialize WebRTC
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        const webrtcService = new WebRTCService();
        webrtcServiceRef.current = webrtcService;

        webrtcService.setCallbacks({
          onLocalStream: (stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          },
          onRemoteStream: (stream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
            setIsConnected(true);
            setInterviewState('active');
          },
          onConnectionOpen: (peerId) => {
            console.log('WebRTC connection opened:', peerId);
            setConnectionType('webrtc');
          },
          onConnectionClose: () => {
            setIsConnected(false);
            setInterviewState('ended');
          },
          onError: async (error) => {
            console.error('WebRTC error:', error);
            // Fallback to Daily.co
            await handleWebRTCFallback();
          }
        });

        // Initialize local stream
        await webrtcService.initializeLocalStream();
        
      } catch (error) {
        console.error('Error initializing WebRTC:', error);
        await handleWebRTCFallback();
      }
    };

    initializeWebRTC();

    return () => {
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.disconnect();
      }
    };
  }, []);

  // WebSocket event handlers
  useEffect(() => {
    if (!wsService) return;

    wsService.setCallbacks({
      onInterviewStatus: (data) => {
        console.log('Interview status update:', data);
        
        switch (data.action) {
          case 'interview_started':
            setInterviewState('connecting');
            joinInterviewRoom();
            break;
          case 'participant_joined':
            if (data.user_id !== userId) {
              // Another participant joined, initiate WebRTC connection
              initiateWebRTCConnection(data.user_id);
            }
            break;
          case 'connection_established':
            setInterviewState('active');
            break;
          case 'switch_to_daily':
            handleDailyFallback(data.daily_room_url);
            break;
          case 'ai_question':
            setCurrentQuestion(data.question);
            break;
          case 'interview_ended':
            setInterviewState('ended');
            break;
        }
      },
      onSystemAlert: (data) => {
        if (data.action === 'user_joined' || data.action === 'user_left') {
          console.log('Room update:', data.message);
        }
      }
    });

    // Join interview room
    wsService.joinRoom(`interview_${interviewId}`);

    return () => {
      wsService.leaveRoom(`interview_${interviewId}`);
    };
  }, [wsService, interviewId, userId]);

  const joinInterviewRoom = async () => {
    try {
      // Notify backend that we're joining the interview
      const response = await fetch(`/api/v1/interviews/${interviewId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          connection_type: 'webrtc'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to join interview');
      }

      const data = await response.json();
      console.log('Joined interview:', data);
      
    } catch (error) {
      console.error('Error joining interview:', error);
    }
  };

  const initiateWebRTCConnection = async (remotePeerId: string) => {
    if (!webrtcServiceRef.current) return;

    try {
      await webrtcServiceRef.current.makeCall(remotePeerId);
      setInterviewState('connecting');
    } catch (error) {
      console.error('Error initiating WebRTC connection:', error);
      await handleWebRTCFallback();
    }
  };

  const handleWebRTCFallback = async () => {
    console.log('Switching to Daily.co fallback');
    setConnectionType('daily');
    
    if (webrtcServiceRef.current) {
      try {
        const roomUrl = await webrtcServiceRef.current.createDailyRoom(`interview-${interviewId}`);
        await webrtcServiceRef.current.switchToDaily(roomUrl);
      } catch (error) {
        console.error('Daily.co fallback failed:', error);
      }
    }
  };

  const handleDailyFallback = async (roomUrl: string) => {
    if (webrtcServiceRef.current) {
      await webrtcServiceRef.current.initializeDailyFallback(roomUrl);
      setConnectionType('daily');
    }
  };

  const toggleVideo = () => {
    if (webrtcServiceRef.current) {
      const newState = !videoEnabled;
      webrtcServiceRef.current.toggleVideo(newState);
      setVideoEnabled(newState);
    }
  };

  const toggleAudio = () => {
    if (webrtcServiceRef.current) {
      const newState = !audioEnabled;
      webrtcServiceRef.current.toggleAudio(newState);
      setAudioEnabled(newState);
    }
  };

  const toggleScreenShare = async () => {
    if (!webrtcServiceRef.current) return;

    try {
      if (screenSharing) {
        await webrtcServiceRef.current.stopScreenShare();
      } else {
        await webrtcServiceRef.current.startScreenShare();
      }
      setScreenSharing(!screenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const endInterview = async () => {
    try {
      const response = await fetch(`/api/v1/interviews/${interviewId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ended_by: userId
        })
      });

      if (response.ok) {
        setInterviewState('ended');
        if (webrtcServiceRef.current) {
          webrtcServiceRef.current.disconnect();
        }
      }
    } catch (error) {
      console.error('Error ending interview:', error);
    }
  };

  const handleWhiteboardEvent = (event: any) => {
    // Send whiteboard events via WebSocket
    if (wsService) {
      wsService.sendInterviewSignal(interviewId, 'whiteboard_event', event);
    }
  };

  const renderConnectionStatus = () => {
    const statusConfig = {
      waiting: { color: 'text-yellow-600', text: 'Waiting for participants...' },
      connecting: { color: 'text-blue-600', text: 'Connecting...' },
      active: { color: 'text-green-600', text: 'Connected' },
      ended: { color: 'text-red-600', text: 'Interview ended' }
    };

    const config = statusConfig[interviewState];
    
    return (
      <div className={`text-sm font-medium ${config.color}`}>
        {config.text} {connectionType === 'daily' && '(Using backup connection)'}
      </div>
    );
  };

  if (interviewState === 'ended') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Interview Completed</h2>
          <p className="text-gray-600 mb-4">Thank you for participating in the interview.</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Interview Room</h1>
            {renderConnectionStatus()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              💬 Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWhiteboard(!showWhiteboard)}
            >
              📝 Whiteboard
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={endInterview}
            >
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Local Video */}
            <Card className="relative overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                You ({userName})
              </div>
            </Card>

            {/* Remote Video */}
            <Card className="relative overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {userRole === 'interviewer' ? 'Candidate' : 'Interviewer'}
              </div>
            </Card>
          </div>

          {/* AI Question Display */}
          {currentQuestion && userRole === 'candidate' && (
            <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Current Question:</h3>
              <p className="text-blue-700">{currentQuestion}</p>
            </Card>
          )}

          {/* Video Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant={audioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
            >
              {audioEnabled ? '🎤' : '🔇'} {audioEnabled ? 'Mute' : 'Unmute'}
            </Button>
            <Button
              variant={videoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
            >
              {videoEnabled ? '📹' : '📷'} {videoEnabled ? 'Stop Video' : 'Start Video'}
            </Button>
            <Button
              variant={screenSharing ? "destructive" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
            >
              🖥️ {screenSharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-white flex flex-col">
          {/* Chat */}
          {showChat && (
            <div className="flex-1">
              <RealTimeChat
                roomId={`interview_${interviewId}`}
                userId={userId}
                userName={userName}
                messages={messages}
                onSendMessage={sendMessage}
                onTyping={handleTyping}
                maxHeight="300px"
              />
            </div>
          )}

          {/* Whiteboard */}
          {showWhiteboard && (
            <div className="flex-1 p-4">
              <CollaborativeWhiteboard
                roomId={`interview_${interviewId}`}
                userId={userId}
                onDrawingEvent={handleWhiteboardEvent}
                width={300}
                height={200}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeInterviewRoom;