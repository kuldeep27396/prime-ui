import PageTemplate from '../components/PageTemplate'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })

  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Add your form submission logic here
  }

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get help with your account or technical issues",
      contact: "support@primeinterviews.ai",
      response: "Within 24 hours"
    },
    {
      icon: "💼",
      title: "Business Inquiries",
      description: "Partnerships, enterprise sales, and collaborations",
      contact: "business@primeinterviews.ai",
      response: "Within 48 hours"
    },
    {
      icon: "📰",
      title: "Media & Press",
      description: "Press releases, interviews, and media kits",
      contact: "press@primeinterviews.ai",
      response: "Within 72 hours"
    },
    {
      icon: "🛠️",
      title: "Technical Support",
      description: "API issues, integration help, and developer questions",
      contact: "developers@primeinterviews.ai",
      response: "Within 12 hours"
    }
  ]

  const offices = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 300",
      zipcode: "San Francisco, CA 94103",
      phone: "+1 (555) 123-4567",
      isHeadquarters: true
    },
    {
      city: "New York",
      address: "456 Broadway, Floor 12",
      zipcode: "New York, NY 10013",
      phone: "+1 (555) 987-6543",
      isHeadquarters: false
    },
    {
      city: "Austin",
      address: "789 South Congress Ave",
      zipcode: "Austin, TX 78704",
      phone: "+1 (555) 456-7890",
      isHeadquarters: false
    }
  ]

  return (
    <PageTemplate
      title="Contact Us"
      subtitle="Get in touch with our team. We're here to help with any questions or support you need."
      icon={icon}
      ctaText="Back to Dashboard"
      ctaLink="/dashboard"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What can we help you with?
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="press">Media & Press</option>
                  <option value="careers">Careers</option>
                  <option value="feedback">Product Feedback</option>
                </select>
              </div>

              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief subject of your message"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Information Sidebar */}
        <div className="space-y-6">
          {/* Quick Contact Methods */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">📞 Direct Contact</h3>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{method.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{method.title}</h4>
                      <p className="text-slate-600 text-xs mb-2">{method.description}</p>
                      <a href={`mailto:${method.contact}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        {method.contact}
                      </a>
                      <p className="text-slate-500 text-xs mt-1">Response: {method.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Locations */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">🏢 Our Offices</h3>
            <div className="space-y-4">
              {offices.map((office, index) => (
                <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-slate-900">{office.city}</h4>
                    {office.isHeadquarters && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        HQ
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-1">{office.address}</p>
                  <p className="text-slate-600 text-sm mb-2">{office.zipcode}</p>
                  <p className="text-blue-600 text-sm font-medium">{office.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Link */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
            <h4 className="font-semibold text-emerald-900 mb-2">💡 Quick Help</h4>
            <p className="text-emerald-800 text-sm mb-4">
              Looking for answers to common questions? Check our Help Center first.
            </p>
            <a
              href="/help-center"
              className="text-emerald-700 hover:text-emerald-900 font-medium text-sm"
            >
              Visit Help Center →
            </a>
          </div>

          {/* Social Media */}
          <div className="p-6 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-4">🌐 Follow Us</h4>
            <div className="grid grid-cols-2 gap-3">
              <a href="#" className="flex items-center justify-center py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </a>
              <a href="#" className="flex items-center justify-center py-2 px-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}