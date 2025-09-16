import PageTemplate from '../components/PageTemplate'
import { Link } from 'react-router-dom'

export default function HelpCenterPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Simply click 'Sign Up' and follow the guided setup process. You'll be ready to practice in under 2 minutes."
        },
        {
          q: "Is Prime Interviews free to use?",
          a: "We offer a free tier with basic features. Premium plans unlock advanced AI feedback, expert mentors, and unlimited practice sessions."
        },
        {
          q: "What types of interviews can I practice?",
          a: "Technical coding, system design, behavioral questions, and company-specific interview formats from FAANG and other top tech companies."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          q: "The interview simulator isn't loading",
          a: "Try refreshing the page or clearing your browser cache. Contact support if the issue persists."
        },
        {
          q: "Can I use Prime Interviews on mobile?",
          a: "Yes! Our web app is fully responsive and works great on mobile. A native mobile app is coming soon."
        },
        {
          q: "How do I reset my progress?",
          a: "Go to Settings > Account > Reset Progress. Note: this action cannot be undone."
        }
      ]
    },
    {
      category: "Billing & Plans",
      questions: [
        {
          q: "How do I upgrade my plan?",
          a: "Go to Settings > Billing or click 'Upgrade' in your dashboard. Changes take effect immediately."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, cancel anytime from Settings > Billing. Your access continues until the end of your billing period."
        },
        {
          q: "Do you offer student discounts?",
          a: "Yes! We offer 50% off for verified students. Contact support with your student ID for verification."
        }
      ]
    }
  ]

  return (
    <PageTemplate
      title="Help Center"
      subtitle="Get answers to common questions and find the support you need"
      icon={icon}
      ctaText="Contact Support"
      ctaLink="/contact"
    >
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">🔍 Search Help Articles</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* FAQ Sections */}
            {faqs.map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className={`w-8 h-8 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-emerald-500' : 'bg-purple-500'} text-white rounded-lg flex items-center justify-center mr-3 text-sm font-bold`}>
                    {index + 1}
                  </span>
                  {section.category}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-slate-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Still need help?</h3>
              <p className="text-slate-600 mb-4">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  Contact Support
                </Link>
                <button className="bg-white text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">📋 Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/contact" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <h4 className="font-semibold text-blue-900">Report Bug</h4>
              <p className="text-blue-700 text-sm">Found an issue? Let us know</p>
            </Link>
            <Link to="/contact" className="block p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <h4 className="font-semibold text-emerald-900">Feature Request</h4>
              <p className="text-emerald-700 text-sm">Suggest new features</p>
            </Link>
            <Link to="/documentation" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-semibold text-purple-900">Documentation</h4>
              <p className="text-purple-700 text-sm">Detailed guides & tutorials</p>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">⚡ Pro Tip</h4>
            <p className="text-amber-800 text-sm">
              Use the search bar above to quickly find specific help articles and tutorials.
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}