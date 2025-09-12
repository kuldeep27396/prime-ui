import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LiveAIInterview from '../../components/interview/LiveAIInterview';

interface InterviewSummary {
  overall_score: number;
  technical_assessment: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  communication_skills: {
    score: number;
    clarity: string;
    engagement: string;
  };
  cultural_fit: {
    score: number;
    reasoning: string;
  };
  behavioral_traits: {
    teamwork: string;
    problem_solving: string;
    adaptability: string;
  };
  key_strengths: string[];
  areas_of_concern: string[];
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire';
  reasoning: string;
  next_steps: string;
  interview_metadata: {
    duration_minutes: number;
    question_count: number;
    interview_phase: string;
    model_used: string;
    completed_at: string;
  };
}

const LiveAIInterviewPage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'interview' | 'summary' | 'error'>('interview');
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId) {
      setError('Interview ID not provided');
      setCurrentView('error');
    }
  }, [interviewId]);

  const handleInterviewComplete = (interviewSummary: InterviewSummary) => {
    setSummary(interviewSummary);
    setCurrentView('summary');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentView('error');
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire':
        return 'text-green-700 bg-green-100';
      case 'hire':
        return 'text-green-600 bg-green-50';
      case 'maybe':
        return 'text-yellow-600 bg-yellow-50';
      case 'no_hire':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (currentView === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Interview Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex space-x-2">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'summary' && summary) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Interview Complete</CardTitle>
              <div className="text-center text-gray-600">
                <p>AI Interview Analysis & Summary</p>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(summary.overall_score)}`}>
                      {summary.overall_score.toFixed(1)}
                    </div>
                    <p className="text-gray-600">Overall Score</p>
                  </div>

                  {/* Recommendation */}
                  <div className="text-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRecommendationColor(summary.recommendation)}`}>
                      {summary.recommendation.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Reasoning</h4>
                    <p className="text-gray-700 text-sm">{summary.reasoning}</p>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                    <p className="text-blue-700 text-sm">{summary.next_steps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Technical Assessment */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Technical Skills</span>
                      <span className={`font-bold ${getScoreColor(summary.technical_assessment.score)}`}>
                        {summary.technical_assessment.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${summary.technical_assessment.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Communication Skills */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Communication</span>
                      <span className={`font-bold ${getScoreColor(summary.communication_skills.score)}`}>
                        {summary.communication_skills.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${summary.communication_skills.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Clarity: {summary.communication_skills.clarity}</span>
                      <span>Engagement: {summary.communication_skills.engagement}</span>
                    </div>
                  </div>

                  {/* Cultural Fit */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Cultural Fit</span>
                      <span className={`font-bold ${getScoreColor(summary.cultural_fit.score)}`}>
                        {summary.cultural_fit.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${summary.cultural_fit.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Behavioral Traits */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Behavioral Traits</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Teamwork:</span>
                        <span className="font-medium">{summary.behavioral_traits.teamwork}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Problem Solving:</span>
                        <span className="font-medium">{summary.behavioral_traits.problem_solving}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adaptability:</span>
                        <span className="font-medium">{summary.behavioral_traits.adaptability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>Key Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.key_strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>

                {/* Technical Strengths */}
                {summary.technical_assessment.strengths.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Technical Strengths</h4>
                    <ul className="space-y-1">
                      {summary.technical_assessment.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-600 text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Areas of Concern */}
            <Card>
              <CardHeader>
                <CardTitle>Areas of Concern</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.areas_of_concern.map((concern, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">⚠</span>
                      <span className="text-gray-700">{concern}</span>
                    </li>
                  ))}
                </ul>

                {/* Technical Weaknesses */}
                {summary.technical_assessment.weaknesses.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Technical Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {summary.technical_assessment.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span className="text-gray-600 text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Interview Metadata */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">{summary.interview_metadata.duration_minutes} minutes</p>
                </div>
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <p className="font-medium">{summary.interview_metadata.question_count}</p>
                </div>
                <div>
                  <span className="text-gray-600">AI Model:</span>
                  <p className="font-medium">{summary.interview_metadata.model_used}</p>
                </div>
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <p className="font-medium">
                    {new Date(summary.interview_metadata.completed_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.print()}>
                  Print Summary
                </Button>
                <Button onClick={() => navigate(`/interviews/${interviewId}/review`)}>
                  Review Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <LiveAIInterview
      interviewId={interviewId!}
      onComplete={handleInterviewComplete}
      onError={handleError}
    />
  );
};

export default LiveAIInterviewPage;