import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useVideoRecorder } from '../../hooks/useVideoRecorder';

interface Question {
  id: string;
  type: string;
  category: string;
  content: string;
  expected_duration?: number;
  difficulty: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface InterviewSession {
  interview_id: string;
  questions: Question[];
  settings: Record<string, any>;
  started_at: string;
  candidate_name: string;
  job_title: string;
}

interface OneWayVideoInterviewProps {
  interviewId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

const OneWayVideoInterview: React.FC<OneWayVideoInterviewProps> = ({
  interviewId,
  onComplete,
  onError
}) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state: recorderState, controls: recorderControls } = useVideoRecorder();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize interview session
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        const response = await fetch(`/api/v1/interviews/${interviewId}/start-one-way`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to start interview');
        }

        const sessionData = await response.json();
        setSession(sessionData);
        setIsLoading(false);

        // Set up camera preview
        setupCameraPreview();
      } catch (error) {
        console.error('Error initializing interview:', error);
        onError('Failed to start interview. Please try again.');
      }
    };

    initializeInterview();
  }, [interviewId, onError]);

  // Setup camera preview
  const setupCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error setting up camera:', error);
      onError('Failed to access camera. Please check permissions.');
    }
  };

  // Start question timer
  const startQuestionTimer = (duration: number) => {
    setTimeRemaining(duration);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Auto-stop recording when time is up
          if (recorderState.isRecording) {
            recorderControls.stopRecording();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop question timer
  const stopQuestionTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeRemaining(null);
  };

  // Start recording for current question
  const startRecording = async () => {
    if (!session) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    const expectedDuration = currentQuestion.expected_duration || 300; // 5 minutes default

    try {
      await recorderControls.startRecording();
      startQuestionTimer(expectedDuration);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Failed to start recording. Please try again.');
    }
  };

  // Stop recording and upload video
  const stopRecording = async () => {
    if (!session) return;

    stopQuestionTimer();
    recorderControls.stopRecording();

    // Wait for recording to complete
    setTimeout(async () => {
      if (recorderState.recordedBlob) {
        await uploadVideo(recorderState.recordedBlob);
      }
    }, 1000);
  };

  // Upload video to storage
  const uploadVideo = async (videoBlob: Blob) => {
    if (!session) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    setIsUploading(true);

    try {
      // Get upload URL
      const uploadUrlResponse = await fetch(
        `/api/v1/interviews/${interviewId}/upload-url?question_id=${currentQuestion.id}&file_extension=webm`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!uploadUrlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { upload_url, media_url } = await uploadUrlResponse.json();

      // Upload video to storage
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        body: videoBlob,
        headers: {
          'Content-Type': 'video/webm'
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video');
      }

      // Create interview response record
      const responseData = {
        question_id: currentQuestion.id,
        response_type: 'video',
        media_url: media_url,
        duration: recorderState.duration,
        response_metadata: {
          file_size: videoBlob.size,
          mime_type: videoBlob.type,
          recorded_at: new Date().toISOString()
        }
      };

      const createResponseResponse = await fetch(
        `/api/v1/interviews/${interviewId}/responses`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responseData)
        }
      );

      if (!createResponseResponse.ok) {
        throw new Error('Failed to save response');
      }

      // Update responses state
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: media_url
      }));

      // Reset recorder for next question
      recorderControls.resetRecording();

    } catch (error) {
      console.error('Error uploading video:', error);
      onError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (!session) return;

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      recorderControls.resetRecording();
    } else {
      completeInterview();
    }
  };

  // Complete the interview
  const completeInterview = async () => {
    try {
      const response = await fetch(`/api/v1/interviews/${interviewId}/complete-one-way`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete interview');
      }

      onComplete();
    } catch (error) {
      console.error('Error completing interview:', error);
      onError('Failed to complete interview. Please try again.');
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
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

  const currentQuestion = session.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;
  const hasRecordedCurrentQuestion = responses[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {session.job_title} - Video Interview
            </CardTitle>
            <div className="text-center text-gray-600">
              <p>Candidate: {session.candidate_name}</p>
              <p>Question {currentQuestionIndex + 1} of {session.questions.length}</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Recording Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Video Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Preview */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Recording Indicator */}
                  {recorderState.isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">
                        Recording {formatTime(recorderState.duration)}
                      </span>
                    </div>
                  )}

                  {/* Timer */}
                  {timeRemaining !== null && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                      Time: {formatTime(timeRemaining)}
                    </div>
                  )}

                  {/* Paused Indicator */}
                  {recorderState.isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-white text-xl font-bold">PAUSED</div>
                    </div>
                  )}
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center space-x-4">
                  {!recorderState.isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={Boolean(hasRecordedCurrentQuestion) || Boolean(isUploading)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={stopRecording}
                        disabled={isUploading}
                        variant="outline"
                      >
                        Stop Recording
                      </Button>
                      
                      {!recorderState.isPaused ? (
                        <Button
                          onClick={recorderControls.pauseRecording}
                          variant="outline"
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={recorderControls.resumeRecording}
                          variant="outline"
                        >
                          Resume
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Upload Status */}
                {isUploading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Uploading video...</p>
                  </div>
                )}

                {/* Error Display */}
                {recorderState.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{recorderState.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Question</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {currentQuestion.type}
                </span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {currentQuestion.category}
                </span>
                <span className={`px-2 py-1 rounded ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Question Content */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {currentQuestion.content}
                  </p>
                </div>

                {/* Expected Duration */}
                {currentQuestion.expected_duration && (
                  <div className="text-sm text-gray-600">
                    <strong>Expected Duration:</strong> {formatTime(currentQuestion.expected_duration)}
                  </div>
                )}

                {/* Tags */}
                {currentQuestion.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Related Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Status */}
                {hasRecordedCurrentQuestion && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-600 text-sm font-medium">
                      ✓ Response recorded successfully
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    disabled={!hasRecordedCurrentQuestion || isUploading}
                  >
                    {isLastQuestion ? 'Complete Interview' : 'Next Question'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {Object.keys(responses).length} of {session.questions.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(responses).length / session.questions.length) * 100}%`
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OneWayVideoInterview;