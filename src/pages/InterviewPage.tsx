import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockInterviews, mockQuestions } from '../data/mockData';
import { formatTime } from '../utils';

export const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes default
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);

  const interview = mockInterviews.find(i => i.id === id);
  const currentQuestion = interview?.questions[currentQuestionIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, timeRemaining]);

  const startInterview = () => {
    setInterviewStarted(true);
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit);
    }
  };

  const nextQuestion = () => {
    if (interview && currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setIsRecording(false);
      const nextQ = interview.questions[currentQuestionIndex + 1];
      setTimeRemaining(nextQ.timeLimit);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview not found</h1>
          <p className="text-gray-600">The interview you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.title}</h1>
            <p className="text-gray-600 mb-4">{interview.company} • {interview.position}</p>
            <Badge className={`inline-flex mx-auto`}>
              {interview.difficulty}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{interview.questions.length}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{interview.duration}</p>
                  <p className="text-sm text-gray-600">Minutes</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">AI</p>
                  <p className="text-sm text-gray-600">Powered</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Before you start:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ensure you're in a quiet environment</li>
                  <li>• Check your camera and microphone</li>
                  <li>• Have a pen and paper ready for notes</li>
                  <li>• Speak clearly and maintain eye contact</li>
                </ul>
              </div>

              <div className="text-center">
                <Button size="lg" onClick={startInterview}>
                  Start Interview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{interview.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`text-lg font-mono font-bold ${
                  timeRemaining < 30 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={currentQuestion?.type === 'technical' ? 'default' : 
                           currentQuestion?.type === 'behavioral' ? 'success' : 'warning'}>
                    {currentQuestion?.type}
                  </Badge>
                  <Badge className={currentQuestion?.difficulty === 'Easy' ? 'text-green-600 bg-green-50' :
                                   currentQuestion?.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                                   'text-red-600 bg-red-50'}>
                    {currentQuestion?.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      {currentQuestion?.question}
                    </h2>
                  </div>

                  {/* Video/Recording Area */}
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                        </svg>
                      </div>
                      <p className="text-sm opacity-75">Camera will appear here</p>
                    </div>
                    
                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Recording</span>
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer (Optional - you can also respond verbally)
                    </label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Type your answer here or use voice recording..."
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant={isRecording ? "outline" : "secondary"}
                      onClick={toggleRecording}
                      className={isRecording ? "border-red-300 text-red-600" : ""}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                      </svg>
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>

                    <Button onClick={nextQuestion}>
                      {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interview Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">{interview.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{interview.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{interview.duration}m</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interview Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Take your time to think before answering</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Use the STAR method for behavioral questions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Speak clearly and maintain good posture</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Ask clarifying questions if needed</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};