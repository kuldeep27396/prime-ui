import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import OneWayVideoInterview from '../../components/interview/OneWayVideoInterview';
import VideoPlayback from '../../components/interview/VideoPlayback';
import BatchVideoProcessing from '../../components/interview/BatchVideoProcessing';

interface InterviewResponse {
  id: string;
  question_id: string;
  response_type: string;
  content?: string;
  media_url?: string;
  duration?: number;
  response_metadata: Record<string, any>;
  created_at: string;
}

interface Question {
  id: string;
  type: string;
  category: string;
  content: string;
  expected_duration?: number;
  difficulty: string;
  tags: string[];
}

const OneWayInterviewPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'demo' | 'interview' | 'playback' | 'batch'>('demo');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('');
  const [showBatchProcessing, setShowBatchProcessing] = useState(false);

  // Mock data for demonstration
  const mockInterviewId = 'interview-123';
  const mockResponses: InterviewResponse[] = [
    {
      id: 'response-1',
      question_id: 'q1',
      response_type: 'video',
      media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 180,
      response_metadata: {
        file_size: 1024000,
        mime_type: 'video/mp4',
        recorded_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    },
    {
      id: 'response-2',
      question_id: 'q2',
      response_type: 'video',
      media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 240,
      response_metadata: {
        file_size: 2048000,
        mime_type: 'video/mp4',
        recorded_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    }
  ];

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      type: 'technical',
      category: 'coding',
      content: 'Explain your approach to solving a complex algorithm problem. Walk us through your thought process.',
      expected_duration: 300,
      difficulty: 'medium',
      tags: ['algorithms', 'problem-solving']
    },
    {
      id: 'q2',
      type: 'behavioral',
      category: 'leadership',
      content: 'Tell me about a time you led a challenging project. What obstacles did you face and how did you overcome them?',
      expected_duration: 240,
      difficulty: 'medium',
      tags: ['leadership', 'project-management']
    }
  ];

  const handleInterviewComplete = () => {
    alert('Interview completed successfully!');
    setCurrentView('demo');
  };

  const handleInterviewError = (error: string) => {
    alert(`Interview error: ${error}`);
  };

  const handleAddAnnotation = (annotation: any) => {
    console.log('Adding annotation:', annotation);
    // In a real app, this would save to the backend
  };

  if (currentView === 'interview') {
    return (
      <OneWayVideoInterview
        interviewId={selectedInterviewId || mockInterviewId}
        onComplete={handleInterviewComplete}
        onError={handleInterviewError}
      />
    );
  }

  if (currentView === 'playback') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentView('demo')}
              variant="outline"
            >
              ← Back to Demo
            </Button>
          </div>
          
          <VideoPlayback
            interviewId={mockInterviewId}
            responses={mockResponses}
            questions={mockQuestions}
            onAddAnnotation={handleAddAnnotation}
            annotations={[]}
            readonly={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              One-Way Video Interview System Demo
            </CardTitle>
            <p className="text-center text-gray-600">
              Experience the complete video interview workflow from recording to review
            </p>
          </CardHeader>
        </Card>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎥</div>
              <h3 className="font-semibold mb-2">Video Recording</h3>
              <p className="text-sm text-gray-600">
                MediaRecorder API with quality controls and real-time preview
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold mb-2">Question Timing</h3>
              <p className="text-sm text-gray-600">
                Configurable time limits with auto-submission and progress tracking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">☁️</div>
              <h3 className="font-semibold mb-2">Cloud Storage</h3>
              <p className="text-sm text-gray-600">
                Secure upload to Vercel Blob with compression and optimization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold mb-2">Video Review</h3>
              <p className="text-sm text-gray-600">
                Playback with timestamp annotations and collaborative review tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🎬 Take Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Experience the candidate interface with video recording, question presentation, and upload process.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Interview ID (optional)"
                  value={selectedInterviewId}
                  onChange={(e) => setSelectedInterviewId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <Button
                  onClick={() => setCurrentView('interview')}
                  className="w-full"
                >
                  Start Interview Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👀 Review Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review recorded interviews with video playback, annotations, and evaluation tools.
              </p>
              <Button
                onClick={() => setCurrentView('playback')}
                className="w-full"
              >
                Open Video Review
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Batch Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Process multiple interviews simultaneously for transcription, analysis, and scoring.
              </p>
              <Button
                onClick={() => setShowBatchProcessing(true)}
                className="w-full"
              >
                Open Batch Processor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technical Implementation Details */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Frontend Components</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <code>useVideoRecorder</code> - Custom React hook for MediaRecorder API</li>
                  <li>• <code>OneWayVideoInterview</code> - Complete interview interface</li>
                  <li>• <code>VideoPlayback</code> - Review interface with annotations</li>
                  <li>• <code>BatchVideoProcessing</code> - Bulk processing interface</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Backend Services</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <code>InterviewService</code> - Interview management and video handling</li>
                  <li>• <code>FileHandler</code> - Vercel Blob storage integration</li>
                  <li>• Video upload endpoints with pre-signed URLs</li>
                  <li>• Batch processing with async job handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Fulfilled */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>✅ Requirements Fulfilled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Requirement 2.1 - One-way video interviews</h4>
                <p className="text-sm text-gray-600 mb-3">
                  ✓ Recruiters can record custom questions per role
                </p>
                
                <h4 className="font-semibold mb-2">Requirement 2.2 - Branded interview experience</h4>
                <p className="text-sm text-gray-600 mb-3">
                  ✓ Candidates have access through branded portal interface
                </p>
                
                <h4 className="font-semibold mb-2">Requirement 2.3 - Video/audio capture</h4>
                <p className="text-sm text-gray-600">
                  ✓ System captures video/audio with quality validation
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Requirement 2.4 - Playback controls</h4>
                <p className="text-sm text-gray-600 mb-3">
                  ✓ Recruiters have playback controls with timestamp annotations
                </p>
                
                <h4 className="font-semibold mb-2">Requirement 2.5 - Batch processing</h4>
                <p className="text-sm text-gray-600">
                  ✓ System supports batch processing capabilities for multiple candidates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Processing Modal */}
        {showBatchProcessing && (
          <BatchVideoProcessing
            onClose={() => setShowBatchProcessing(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OneWayInterviewPage;