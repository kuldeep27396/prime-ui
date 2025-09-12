import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface VideoAnnotation {
  id: string;
  timestamp: number;
  content: string;
  type: 'note' | 'highlight' | 'concern' | 'positive';
  author: string;
  created_at: string;
}

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

interface VideoPlaybackProps {
  interviewId: string;
  responses: InterviewResponse[];
  questions: Question[];
  onAddAnnotation?: (annotation: Omit<VideoAnnotation, 'id' | 'created_at'>) => void;
  annotations?: VideoAnnotation[];
  readonly?: boolean;
}

const VideoPlayback: React.FC<VideoPlaybackProps> = ({
  interviewId,
  responses,
  questions,
  onAddAnnotation,
  annotations = [],
  readonly = false
}) => {
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    type: 'note' as VideoAnnotation['type']
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentResponse = responses[currentResponseIndex];
  const currentQuestion = questions.find(q => q.id === currentResponse?.question_id);
  const currentAnnotations = annotations.filter(a => 
    a.timestamp >= currentTime - 5 && a.timestamp <= currentTime + 5
  );

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentResponse]);

  // Play/pause video
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  // Seek to specific time
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    seekTo(newTime);
  };

  // Add annotation
  const addAnnotation = () => {
    if (!onAddAnnotation || !newAnnotation.content.trim()) return;

    onAddAnnotation({
      timestamp: currentTime,
      content: newAnnotation.content,
      type: newAnnotation.type,
      author: 'Current User' // This would come from auth context
    });

    setNewAnnotation({ content: '', type: 'note' });
    setShowAnnotationForm(false);
  };

  // Jump to annotation
  const jumpToAnnotation = (timestamp: number) => {
    seekTo(timestamp);
  };

  if (!currentResponse) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No video responses available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Video Response {currentResponseIndex + 1} of {responses.length}</span>
            <div className="flex items-center space-x-2">
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video Element */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                src={currentResponse.media_url}
                className="w-full h-full object-contain"
                controls={false}
              />

              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* Progress Bar */}
                <div
                  ref={progressRef}
                  className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-blue-500 rounded-full relative"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    {/* Annotation Markers */}
                    {annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className={`absolute top-0 w-1 h-2 cursor-pointer ${
                          annotation.type === 'positive' ? 'bg-green-400' :
                          annotation.type === 'concern' ? 'bg-red-400' :
                          annotation.type === 'highlight' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`}
                        style={{ left: `${(annotation.timestamp / duration) * 100}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToAnnotation(annotation.timestamp);
                        }}
                        title={annotation.content}
                      />
                    ))}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={togglePlayback}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </Button>
                    
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {!readonly && (
                    <Button
                      onClick={() => setShowAnnotationForm(true)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      📝 Add Note
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Context */}
            {currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {currentQuestion.type}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {currentQuestion.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-800">{currentQuestion.content}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Response Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentResponseIndex(prev => Math.max(0, prev - 1))}
                disabled={currentResponseIndex === 0}
                variant="outline"
              >
                Previous Response
              </Button>

              <Button
                onClick={() => setCurrentResponseIndex(prev => Math.min(responses.length - 1, prev + 1))}
                disabled={currentResponseIndex === responses.length - 1}
                variant="outline"
              >
                Next Response
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annotations Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Annotations & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Annotations */}
            {currentAnnotations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Current Annotations</h4>
                {currentAnnotations.map((annotation) => (
                  <div key={annotation.id} className="text-sm text-blue-700">
                    <span className="font-medium">{formatTime(annotation.timestamp)}:</span> {annotation.content}
                  </div>
                ))}
              </div>
            )}

            {/* All Annotations */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    annotation.type === 'positive' ? 'border-green-200 bg-green-50' :
                    annotation.type === 'concern' ? 'border-red-200 bg-red-50' :
                    annotation.type === 'highlight' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => jumpToAnnotation(annotation.timestamp)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {formatTime(annotation.timestamp)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      annotation.type === 'positive' ? 'bg-green-100 text-green-800' :
                      annotation.type === 'concern' ? 'bg-red-100 text-red-800' :
                      annotation.type === 'highlight' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {annotation.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{annotation.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {annotation.author} • {new Date(annotation.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {annotations.length === 0 && (
              <p className="text-gray-500 text-center py-4">No annotations yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Annotation Form */}
      {showAnnotationForm && !readonly && (
        <Card>
          <CardHeader>
            <CardTitle>Add Annotation at {formatTime(currentTime)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newAnnotation.type}
                  onChange={(e) => setNewAnnotation(prev => ({ 
                    ...prev, 
                    type: e.target.value as VideoAnnotation['type'] 
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="note">Note</option>
                  <option value="highlight">Highlight</option>
                  <option value="positive">Positive</option>
                  <option value="concern">Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newAnnotation.content}
                  onChange={(e) => setNewAnnotation(prev => ({ 
                    ...prev, 
                    content: e.target.value 
                  }))}
                  placeholder="Enter your annotation..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setShowAnnotationForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addAnnotation}
                  disabled={!newAnnotation.content.trim()}
                >
                  Add Annotation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoPlayback;