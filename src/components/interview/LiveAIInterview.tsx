import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { webrtcService, WebRTCCallbacks } from '../../services/webrtcService';

interface LiveAIInterviewProps {
  interviewId: string;
  onComplete: (summary: any) => void;
  onError: (error: string) => void;
}

interface InterviewSession {
  interview_id: string;
  session_id: string;
  opening_question: string;
  candidate_name: string;
  job_title: string;
  interview_config: Record<string, any>;
  started_at: string;
}

interface ConversationMessage {
  role: 'ai' | 'candidate';
  content: string;
  timestamp: string;
  analysis?: {
    sentiment: string;
    confidence: number;
    engagement: string;
    clarity: string;
  };
}

const LiveAIInterview: React.FC<LiveAIInterviewProps> = ({
  interviewId,
  onComplete,
  onError
}) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [interviewPhase, setInterviewPhase] = useState('opening');
  const [shouldContinue, setShouldContinue] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize interview session
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        const response = await fetch(`/api/v1/interviews/${interviewId}/start-live-ai`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to start live AI interview');
        }

        const sessionData = await response.json();
        setSession(sessionData);
        
        // Add opening question to conversation
        setConversation([{
          role: 'ai',
          content: sessionData.opening_question,
          timestamp: new Date().toISOString()
        }]);

        setIsLoading(false);
        
        // Initialize WebRTC and speech services
        await initializeServices();
        
        // Speak the opening question
        speakText(sessionData.opening_question);

      } catch (error) {
        console.error('Error initializing interview:', error);
        onError('Failed to start interview. Please try again.');
      }
    };

    initializeInterview();
  }, [interviewId, onError]);

  // Initialize WebRTC and speech services
  const initializeServices = async () => {
    try {
      setIsConnecting(true);

      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = handleSpeechResult;
        recognitionRef.current.onerror = handleSpeechError;
        recognitionRef.current.onend = handleSpeechEnd;
      }

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;

      // Set up WebRTC callbacks
      const callbacks: WebRTCCallbacks = {
        onLocalStream: (stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        },
        onRemoteStream: (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        },
        onConnectionOpen: (peerId) => {
          console.log('WebRTC connection opened:', peerId);
          setIsConnected(true);
          setIsConnecting(false);
        },
        onConnectionClose: () => {
          setIsConnected(false);
        },
        onError: (error) => {
          console.error('WebRTC error:', error);
          onError('Video connection failed. Please check your camera and microphone.');
        }
      };

      webrtcService.setCallbacks(callbacks);

      // Initialize local stream
      await webrtcService.initializeLocalStream();
      setIsConnected(true);
      setIsConnecting(false);

    } catch (error) {
      console.error('Error initializing services:', error);
      setIsConnecting(false);
      onError('Failed to initialize video/audio. Please check permissions.');
    }
  };

  // Handle speech recognition results
  const handleSpeechResult = useCallback((event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      setCurrentResponse(prev => prev + finalTranscript);
    }
  }, []);

  const handleSpeechError = useCallback((event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  }, []);

  const handleSpeechEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  // Start listening for speech
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setCurrentResponse('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop listening for speech
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Speak text using speech synthesis
  const speakText = (text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Use a professional voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Microsoft')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      synthRef.current.speak(utterance);
    }
  };

  // Submit candidate response
  const submitResponse = async () => {
    if (!currentResponse.trim() || !session || isProcessing) return;

    setIsProcessing(true);
    stopListening();

    try {
      // Add candidate response to conversation
      const candidateMessage: ConversationMessage = {
        role: 'candidate',
        content: currentResponse,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, candidateMessage]);

      // Send response to AI
      const response = await fetch(`/api/v1/interviews/${interviewId}/live-ai-response`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidate_response: currentResponse,
          response_metadata: {
            timestamp: new Date().toISOString(),
            speech_to_text: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process response');
      }

      const result = await response.json();

      // Add AI response to conversation
      const aiMessage: ConversationMessage = {
        role: 'ai',
        content: result.ai_response,
        timestamp: new Date().toISOString(),
        analysis: result.analysis
      };

      setConversation(prev => [...prev, aiMessage]);
      setInterviewPhase(result.interview_phase);
      setShouldContinue(result.should_continue);

      // Speak AI response
      speakText(result.ai_response);

      // Clear current response
      setCurrentResponse('');

      // Check if interview should end
      if (!result.should_continue) {
        setTimeout(() => {
          completeInterview();
        }, 3000); // Give time for final AI response to be spoken
      }

    } catch (error) {
      console.error('Error submitting response:', error);
      onError('Failed to process your response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete the interview
  const completeInterview = async () => {
    try {
      const response = await fetch(`/api/v1/interviews/${interviewId}/complete-live-ai`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete interview');
      }

      const result = await response.json();
      onComplete(result.summary);

    } catch (error) {
      console.error('Error completing interview:', error);
      onError('Failed to complete interview. Please try again.');
    }
  };

  // Toggle video
  const toggleVideo = () => {
    webrtcService.toggleVideo(!videoEnabled);
    setVideoEnabled(!videoEnabled);
  };

  // Toggle audio
  const toggleAudio = () => {
    webrtcService.toggleAudio(!audioEnabled);
    setAudioEnabled(!audioEnabled);
  };

  // Format time display
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      webrtcService.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing AI interview...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load interview session.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Live AI Interview - {session.job_title}
            </CardTitle>
            <div className="text-center text-gray-600">
              <p>Candidate: {session.candidate_name}</p>
              <p>Phase: {interviewPhase}</p>
              {isConnecting && <p className="text-blue-600">Connecting...</p>}
              {isConnected && <p className="text-green-600">Connected</p>}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Video Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Video Streams */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Local Video */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        You
                      </div>
                      {!videoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <span className="text-white">Video Off</span>
                        </div>
                      )}
                    </div>

                    {/* AI Avatar/Placeholder */}
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <p className="text-sm">AI Interviewer</p>
                      </div>
                      
                      {/* Speaking indicator */}
                      {synthRef.current?.speaking && (
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={toggleVideo}
                      variant={videoEnabled ? "outline" : "destructive"}
                      size="sm"
                    >
                      {videoEnabled ? "📹" : "📹❌"} Video
                    </Button>
                    
                    <Button
                      onClick={toggleAudio}
                      variant={audioEnabled ? "outline" : "destructive"}
                      size="sm"
                    >
                      {audioEnabled ? "🎤" : "🎤❌"} Audio
                    </Button>

                    <Button
                      onClick={isListening ? stopListening : startListening}
                      variant={isListening ? "destructive" : "default"}
                      size="sm"
                      disabled={isProcessing}
                    >
                      {isListening ? "🛑 Stop" : "🎤 Speak"}
                    </Button>

                    <Button
                      onClick={submitResponse}
                      disabled={!currentResponse.trim() || isProcessing}
                      size="sm"
                    >
                      {isProcessing ? "Processing..." : "Submit"}
                    </Button>
                  </div>

                  {/* Current Response */}
                  {currentResponse && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                      <p className="text-blue-700">{currentResponse}</p>
                    </div>
                  )}

                  {/* Listening Indicator */}
                  {isListening && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 font-medium">Listening...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Panel */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === 'ai'
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-gray-50 border-l-4 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {message.role === 'ai' ? '🤖 AI Interviewer' : '👤 You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{message.content}</p>
                      
                      {/* Analysis for candidate responses */}
                      {message.analysis && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="flex space-x-4">
                            <span>Sentiment: {message.analysis.sentiment}</span>
                            <span>Confidence: {Math.round(message.analysis.confidence * 100)}%</span>
                            <span>Engagement: {message.analysis.engagement}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Interview Status */}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p><strong>Phase:</strong> {interviewPhase}</p>
                    <p><strong>Questions:</strong> {conversation.filter(m => m.role === 'ai').length}</p>
                    {!shouldContinue && (
                      <p className="text-orange-600 font-medium">Interview wrapping up...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Manual Complete Button */}
        {shouldContinue && (
          <Card className="mt-6">
            <CardContent className="p-4 text-center">
              <Button
                onClick={completeInterview}
                variant="outline"
                disabled={isProcessing}
              >
                End Interview Early
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveAIInterview;