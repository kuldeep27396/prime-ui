import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { interviews, questions } from '../data/mockData'
import { formatTime, getDifficultyColor, getLevelColor, getTopicIcon } from '../utils/helpers'

export default function InterviewPage() {
  const { id } = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300)
  const [isRecording, setIsRecording] = useState(false)
  const [answer, setAnswer] = useState('')
  const [codeAnswer, setCodeAnswer] = useState('')
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [showHints, setShowHints] = useState(false)

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
      setCodeAnswer('')
      setIsRecording(false)
      setShowHints(false)
      const nextQ = questions[currentQuestionIndex + 1]
      setTimeRemaining(nextQ.timeLimit)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Interview not found</h1>
            <p className="text-slate-600">The interview session you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card max-w-4xl w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{interview.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <span className="badge bg-slate-100 text-slate-800 border-slate-200">
                {interview.company}
              </span>
              <span className={`badge ${getLevelColor(interview.level)}`}>
                {interview.level} Level
              </span>
              <span className={`badge ${getDifficultyColor(interview.difficulty)}`}>
                {interview.difficulty}
              </span>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {interview.description}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">{interview.questions}</div>
                <div className="text-sm text-blue-700">Questions</div>
              </div>
              <div className="card text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">{interview.duration}</div>
                <div className="text-sm text-green-700">Minutes</div>
              </div>
              <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">AI</div>
                <div className="text-sm text-purple-700">Powered</div>
              </div>
              <div className="card text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <div className="text-2xl font-bold text-amber-600 mb-1">Real-time</div>
                <div className="text-sm text-amber-700">Feedback</div>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-3">
                {interview.topics.map((topic, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    <span className="text-lg mr-2">{getTopicIcon(topic)}</span>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Pre-interview Checklist */}
            <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <h3 className="font-semibold text-amber-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pre-Interview Checklist
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Quiet environment secured</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Camera and microphone tested</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Whiteboard/notepad ready</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Code editor accessible</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Think out loud approach ready</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-amber-700">Questions prepared for interviewer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button onClick={startInterview} className="btn-primary btn-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 000-9H9v9zm4 0h1.5a4.5 4.5 0 000-9H13v9z" />
                </svg>
                Begin Interview Session
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{interview.title}</h1>
                <p className="text-sm text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length} • {currentQuestion?.category}
                </p>
              </div>
              <span className={`badge ${getDifficultyColor(currentQuestion?.difficulty)}`}>
                {currentQuestion?.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-slate-600">Time Remaining</p>
                <p className={`text-xl font-mono font-bold ${
                  timeRemaining < 60 ? 'text-red-600' : 
                  timeRemaining < 120 ? 'text-amber-600' : 'text-slate-900'
                }`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
              <button 
                onClick={() => setShowHints(!showHints)}
                className="btn-ghost btn-sm"
              >
                💡 Hints
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="card mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{getTopicIcon(currentQuestion?.category)}</span>
                    <span className={`badge ${
                      currentQuestion?.type === 'technical' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                      currentQuestion?.type === 'design' ? 'bg-purple-100 text-purple-800 border-purple-200' : 
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {currentQuestion?.type}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {currentQuestion?.question}
                  </h2>

                  {currentQuestion?.followUp && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                      <p className="text-sm font-medium text-blue-800 mb-1">Follow-up Question:</p>
                      <p className="text-blue-700">{currentQuestion.followUp}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Editor Area */}
              {(currentQuestion?.category?.includes('SQL') || currentQuestion?.type === 'technical') && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Code Editor {currentQuestion?.category?.includes('SQL') ? '(SQL)' : '(Python/Scala)'}
                    </label>
                    <div className="flex space-x-2">
                      <button className="btn-ghost btn-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 000-9H9v9zm4 0h1.5a4.5 4.5 0 000-9H13v9z" />
                        </svg>
                        Run
                      </button>
                      <button className="btn-ghost btn-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Format
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={codeAnswer}
                      onChange={(e) => setCodeAnswer(e.target.value)}
                      className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder={
                        currentQuestion?.category?.includes('SQL') 
                          ? "-- Write your SQL query here\nSELECT * FROM employees\nWHERE ..."
                          : "# Write your Python/Scala code here\ndef solution():\n    pass"
                      }
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {currentQuestion?.category?.includes('SQL') ? 'SQL' : 'Python'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Explanation & Approach
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="textarea w-full h-32"
                  placeholder="Explain your thought process, approach, and reasoning here..."
                />
              </div>

              {/* Video Recording Area */}
              <div className="mb-6">
                <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                      </svg>
                    </div>
                    <p className="text-sm opacity-75">Camera feed will appear here</p>
                  </div>
                  
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={toggleRecording}
                    className={`btn ${isRecording ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' : 'btn-secondary'}`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
                    </svg>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  <button className="btn-ghost">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Whiteboard
                  </button>
                </div>

                <button onClick={nextQuestion} className="btn-primary">
                  {isLastQuestion ? 'Complete Interview' : 'Next Question'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Progress */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Progress
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Position:</span>
                  <span className="font-medium">{interview.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Company:</span>
                  <span className="font-medium">{interview.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium">{currentQuestionIndex + 1}/{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{interview.duration}m</span>
                </div>
              </div>
            </div>

            {/* Hints Panel */}
            {showHints && (
              <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Helpful Tips
                </h3>
                <div className="space-y-3 text-sm text-amber-700">
                  {currentQuestion?.type === 'technical' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Break down the problem into smaller steps</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Consider edge cases and data validation</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Explain your approach before coding</p>
                      </div>
                    </>
                  )}
                  {currentQuestion?.type === 'design' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Start with requirements gathering</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Consider scalability and reliability</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Discuss trade-offs openly</p>
                      </div>
                    </>
                  )}
                  {currentQuestion?.category?.includes('SQL') && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Start with the FROM clause</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Think about JOIN conditions carefully</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <p>Consider using window functions</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Best Practices
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Think out loud throughout the process</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Ask clarifying questions when needed</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Validate your solution with examples</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>Discuss time and space complexity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}