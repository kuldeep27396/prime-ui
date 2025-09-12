import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface Interview {
  id: string;
  application_id: string;
  type: string;
  status: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  candidate_name: string;
  job_title: string;
  responses_count: number;
}

interface BatchProcessingResult {
  interview_id: string;
  status: 'success' | 'error';
  message?: string;
  responses_count?: number;
  processed_at?: string;
}

interface BatchProcessingResponse {
  batch_id: string;
  total_interviews: number;
  successful: number;
  failed: number;
  results: BatchProcessingResult[];
}

interface BatchVideoProcessingProps {
  onClose: () => void;
}

const BatchVideoProcessing: React.FC<BatchVideoProcessingProps> = ({ onClose }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterviews, setSelectedInterviews] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<BatchProcessingResponse | null>(null);
  const [processingOptions, setProcessingOptions] = useState({
    generateTranscripts: true,
    analyzeEngagement: true,
    extractKeywords: true,
    calculateScores: true
  });

  // Load completed interviews
  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const response = await fetch('/api/v1/interviews?status=completed&interview_type=one_way', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load interviews');
        }

        const data = await response.json();
        
        // Transform data to include candidate and job info
        const interviewsWithDetails = await Promise.all(
          data.interviews.map(async (interview: any) => {
            try {
              // Get responses count
              const responsesResponse = await fetch(
                `/api/v1/interviews/${interview.id}/responses`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              
              const responses = responsesResponse.ok ? await responsesResponse.json() : [];
              
              return {
                ...interview,
                candidate_name: 'Candidate Name', // This would come from the application data
                job_title: 'Job Title', // This would come from the job data
                responses_count: responses.length
              };
            } catch (error) {
              console.error('Error loading interview details:', error);
              return {
                ...interview,
                candidate_name: 'Unknown',
                job_title: 'Unknown',
                responses_count: 0
              };
            }
          })
        );

        setInterviews(interviewsWithDetails);
      } catch (error) {
        console.error('Error loading interviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, []);

  // Toggle interview selection
  const toggleInterviewSelection = (interviewId: string) => {
    setSelectedInterviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interviewId)) {
        newSet.delete(interviewId);
      } else {
        newSet.add(interviewId);
      }
      return newSet;
    });
  };

  // Select all interviews
  const selectAllInterviews = () => {
    setSelectedInterviews(new Set(interviews.map(i => i.id)));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedInterviews(new Set());
  };

  // Process selected interviews
  const processSelectedInterviews = async () => {
    if (selectedInterviews.size === 0) return;

    setIsProcessing(true);
    setProcessingResults(null);

    try {
      const response = await fetch('/api/v1/interviews/batch-process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interview_ids: Array.from(selectedInterviews),
          processing_options: processingOptions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process interviews');
      }

      const results = await response.json();
      setProcessingResults(results);
      
      // Clear selections after successful processing
      setSelectedInterviews(new Set());

    } catch (error) {
      console.error('Error processing interviews:', error);
      alert('Failed to process interviews. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interviews...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Batch Video Processing</CardTitle>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕ Close
            </Button>
          </div>
          <p className="text-gray-600">
            Process multiple video interviews to generate transcripts, analyze engagement, and calculate scores.
          </p>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <div className="space-y-6">
            {/* Processing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={processingOptions.generateTranscripts}
                      onChange={(e) => setProcessingOptions(prev => ({
                        ...prev,
                        generateTranscripts: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <span>Generate Transcripts</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={processingOptions.analyzeEngagement}
                      onChange={(e) => setProcessingOptions(prev => ({
                        ...prev,
                        analyzeEngagement: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <span>Analyze Engagement</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={processingOptions.extractKeywords}
                      onChange={(e) => setProcessingOptions(prev => ({
                        ...prev,
                        extractKeywords: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <span>Extract Keywords</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={processingOptions.calculateScores}
                      onChange={(e) => setProcessingOptions(prev => ({
                        ...prev,
                        calculateScores: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <span>Calculate Scores</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Interview Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Select Interviews ({selectedInterviews.size} selected)
                  </CardTitle>
                  <div className="space-x-2">
                    <Button onClick={selectAllInterviews} variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button onClick={clearAllSelections} variant="outline" size="sm">
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {interviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No completed video interviews found
                    </p>
                  ) : (
                    interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedInterviews.has(interview.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleInterviewSelection(interview.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <input
                                type="checkbox"
                                checked={selectedInterviews.has(interview.id)}
                                onChange={() => toggleInterviewSelection(interview.id)}
                                className="rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="font-medium">{interview.candidate_name}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{interview.job_title}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Completed: {formatDate(interview.completed_at!)} • 
                              {interview.responses_count} responses
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {interview.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Processing Results */}
            {processingResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {processingResults.total_interviews}
                        </div>
                        <div className="text-sm text-blue-800">Total</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {processingResults.successful}
                        </div>
                        <div className="text-sm text-green-800">Successful</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {processingResults.failed}
                        </div>
                        <div className="text-sm text-red-800">Failed</div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {processingResults.results.map((result) => (
                        <div
                          key={result.interview_id}
                          className={`p-3 rounded-lg border ${
                            result.status === 'success'
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {result.interview_id.slice(0, 8)}...
                              </span>
                              {result.responses_count && (
                                <span className="text-sm text-gray-600 ml-2">
                                  ({result.responses_count} responses)
                                </span>
                              )}
                            </div>
                            <div className={`text-sm font-medium ${
                              result.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.status === 'success' ? '✓ Success' : '✗ Failed'}
                            </div>
                          </div>
                          {result.message && (
                            <div className="text-sm text-gray-600 mt-1">
                              {result.message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={processSelectedInterviews}
                disabled={selectedInterviews.size === 0 || isProcessing}
                className="min-w-32"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Process ${selectedInterviews.size} Interview${selectedInterviews.size !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchVideoProcessing;