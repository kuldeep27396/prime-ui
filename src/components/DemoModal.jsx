import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const demoSteps = [
  {
    id: 1,
    title: "AI Mock Interviews",
    description: "Practice with AI-powered interviews tailored to your target role. Get instant feedback and improve your skills.",
    image: "/images/demo/ai-interview.png",
    features: ["Real-time AI feedback", "Multiple interview types", "Performance analytics", "Practice anytime"],
    tab: "dashboard"
  },
  {
    id: 2,
    title: "Expert Mentor Sessions",
    description: "Book 1-on-1 sessions with experienced professionals from top tech companies like Google, Meta, and Netflix.",
    image: "/images/demo/mentors.png",
    features: ["Industry experts", "Personalized feedback", "Flexible scheduling", "Various specialties"],
    tab: "schedule"
  },
  {
    id: 3,
    title: "B2B Candidate Screening",
    description: "Streamline your hiring process with AI-powered candidate screening and technical assessments.",
    image: "/images/demo/screening.png",
    features: ["Automated screening", "Technical assessments", "Candidate reports", "Team collaboration"],
    tab: "dashboard"
  }
]

export default function DemoModal({ isOpen, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTryNow = () => {
    onNavigate(demoSteps[currentStep].tab)
    onClose()
  }

  const currentDemo = demoSteps[currentStep]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Platform Demo</h2>
                <p className="text-slate-600">Step {currentStep + 1} of {demoSteps.length}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {demoSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? 'bg-emerald-500 text-white'
                          : index < currentStep
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {index < currentStep ? '✓' : index + 1}
                      </div>
                      {index < demoSteps.length - 1 && (
                        <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                          index < currentStep ? 'bg-emerald-200' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Content */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Content */}
                <div>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Use Case {currentStep + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{currentDemo.title}</h3>
                  <p className="text-lg text-slate-600 mb-6">{currentDemo.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    {currentDemo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div className="order-first md:order-last">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 text-center">
                    {/* Placeholder for demo image/animation */}
                    <div className="w-full h-48 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                          currentStep === 0 ? 'bg-blue-100' :
                          currentStep === 1 ? 'bg-emerald-100' : 'bg-purple-100'
                        }`}>
                          {currentStep === 0 && (
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                          {currentStep === 1 && (
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                          {currentStep === 2 && (
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">Demo Preview</div>
                        <div className="text-xs text-slate-400 mt-1">{currentDemo.title}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleTryNow}
                      className="w-full btn-primary"
                    >
                      Try This Feature Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="text-sm text-slate-500">
                {currentStep + 1} of {demoSteps.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep === demoSteps.length - 1}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}