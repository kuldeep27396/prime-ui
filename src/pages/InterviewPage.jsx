import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import Webcam from 'react-webcam'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { interviews, questions } from '../data/mockData'

export default function InterviewPage() {
  const { id } = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300)
  const [isRecording, setIsRecording] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [code, setCode] = useState('// Write your solution here\n\n')
  const [showWebcam, setShowWebcam] = useState(false)

  const interview = interviews.find(i => i.id === id) || interviews[0]
  const currentQuestion = questions[currentQuestionIndex] || questions[0]

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', defaultCode: '// Write your solution here\n\nfunction solution() {\n  // Your code here\n}\n\n// Test your solution\nconsole.log(solution());' },
    { value: 'python', label: 'Python', defaultCode: '# Write your solution here\n\ndef solution():\n    # Your code here\n    pass\n\n# Test your solution\nprint(solution())' },
    { value: 'java', label: 'Java', defaultCode: '// Write your solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
    { value: 'cpp', label: 'C++', defaultCode: '// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' }
  ]

  useEffect(() => {
    let interval
    if (interviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            toast.error('Time\'s up!')
            return 0
          }
          if (time === 60) {
            toast.warning('1 minute remaining!')
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted, timeRemaining])

  const startInterview = () => {
    setInterviewStarted(true)
    setShowWebcam(true)
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit)
    }
    toast.success('Interview started! Good luck!')
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowHints(false)
      const nextQ = questions[currentQuestionIndex + 1]
      setTimeRemaining(nextQ.timeLimit)
      toast.success('Moving to next question')
    } else {
      toast.success('Interview completed!')
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast.success('Recording started')
    } else {
      toast.success('Recording stopped')
    }
  }

  const handleLanguageChange = (language) => {
    const langOption = languageOptions.find(opt => opt.value === language)
    setSelectedLanguage(language)
    setCode(langOption.defaultCode)
    toast.success(`Switched to ${langOption.label}`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeRemaining <= 60) return 'text-red-500'
    if (timeRemaining <= 180) return 'text-yellow-500'
    return 'text-green-500'
  }

  const runCode = () => {
    toast.success('Code executed! (Mock execution)')
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card text-center p-8">
            <div className="w-20 h-20 gradient-data rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{interview.title}</h1>
            <div className="text-slate-600 mb-6">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {interview.duration} minutes
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {questions.length} questions
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${interview.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {interview.difficulty}
                </span>
              </div>
            </div>
            <p className="text-slate-600 mb-8">{interview.description}</p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Interview Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Think out loud as you solve problems</li>
                  <li>• Ask clarifying questions if needed</li>
                  <li>• Test your code with different inputs</li>
                  <li>• Consider time and space complexity</li>
                </ul>
              </div>
              <button onClick={startInterview} className="btn-primary btn-lg w-full">
                Start Interview
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 000-9H9v9zm4 0h1.5a4.5 4.5 0 000-9H13v9z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-slate-900">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentQuestion.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-lg font-mono ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={toggleRecording}
                className={`btn-sm ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-outline'}`}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {isRecording ? 'Stop' : 'Record'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Question Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card h-fit"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {currentQuestion.category}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {showHints && currentQuestion.followUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 p-4 rounded-lg mb-4"
              >
                <h3 className="font-medium text-blue-900 mb-2">Follow-up:</h3>
                <p className="text-blue-700 text-sm">{currentQuestion.followUp}</p>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowHints(!showHints)}
                className="btn-ghost btn-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              
              <button onClick={nextQuestion} className="btn-primary btn-sm">
                Next Question
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Code Editor Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-sm border border-slate-300 rounded px-2 py-1"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={runCode} className="btn-secondary btn-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 000-9H9v9zm4 0h1.5a4.5 4.5 0 000-9H13v9z" />
                </svg>
                Run Code
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Editor
                height="500px"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Video Recording Section */}
        <AnimatePresence>
          {showWebcam && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <div className="card p-4 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">Video Recording</span>
                  <button
                    onClick={() => setShowWebcam(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="w-48 h-36 bg-slate-900 rounded-lg overflow-hidden">
                  <Webcam
                    audio={true}
                    height={144}
                    width={192}
                    videoConstraints={{
                      width: 192,
                      height: 144,
                      facingMode: "user"
                    }}
                  />
                </div>
                <div className="flex justify-center mt-2">
                  {isRecording && (
                    <div className="flex items-center text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs">Recording</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Toaster position="top-right" />
    </div>
  )
}