import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { interviews, questions } from '../data/mockData'
import { formatTime, getDifficultyColor } from '../utils/helpers'

export default function InterviewPage() {
  const { id } = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(180)
  const [isRecording, setIsRecording] = useState(false)
  const [answer, setAnswer] = useState('')
  const [interviewStarted, setInterviewStarted] = useState(false)

  const interview = interviews.find(i => i.id === id)
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    let interval
    if (interviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted, timeRemaining])

  const startInterview = () => {
    setInterviewStarted(true)
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setAnswer('')
      setIsRecording(false)
      const nextQ = questions[currentQuestionIndex + 1]
      setTimeRemaining(nextQ.timeLimit)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview not found</h1>
          <p className="text-gray-600">The interview you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-2xl w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.title}</h1>
            <p className="text-gray-600 mb-4">{interview.company} • {interview.position}</p>
            <span className={`badge ${getDifficultyColor(interview.difficulty)} text-sm`}>
              {interview.difficulty}
            </span>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{interview.questions || 8}</p>
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
              <button onClick={startInterview} className="btn-primary text-lg px-8 py-4">
                Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{interview.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className={`text-lg font-mono font-bold ${
                timeRemaining < 30 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
          
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`badge ${
                    currentQuestion?.type === 'technical' ? 'badge-blue' : 
                    currentQuestion?.type === 'behavioral' ? 'badge-green' : 'badge-yellow'
                  }`}>
                    {currentQuestion?.type}
                  </span>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentQuestion?.question}
                </h2>
              </div>

              {/* Video Area */}
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative mb-6">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                    </svg>
                  </div>
                  <p className="text-sm opacity-75">Camera will appear here</p>
                </div>
                
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
              </div>

              {/* Answer Input */}
              <div className="mb-6">
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
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleRecording}
                  className={`btn ${isRecording ? 'btn-outline border-red-300 text-red-600' : 'btn-secondary'}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                  </svg>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>

                <button onClick={nextQuestion} className="btn-primary">
                  {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Info */}
            <div className="card">
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
            </div>

            {/* Tips */}
            <div className="card">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}