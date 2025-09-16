import PageTemplate from '../components/PageTemplate'
import { Link } from 'react-router-dom'

export default function CareersPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
    </svg>
  )

  const openPositions = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "Build scalable web applications and AI-powered interview tools that help millions of engineers succeed.",
      requirements: ["5+ years React/Node.js", "Experience with AI/ML systems", "Startup experience preferred"],
      featured: true
    },
    {
      title: "Machine Learning Engineer",
      department: "AI/ML",
      location: "Remote",
      type: "Full-time",
      description: "Develop and improve our AI models for interview assessment and personalized coaching recommendations.",
      requirements: ["PhD/MS in ML/AI", "Python, TensorFlow/PyTorch", "NLP experience preferred"]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Design intuitive user experiences for our interview platform and mobile applications.",
      requirements: ["4+ years UX/UI design", "Figma expertise", "B2B SaaS experience"]
    },
    {
      title: "Developer Relations Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build developer tools, APIs, and integrations while engaging with our developer community.",
      requirements: ["Strong technical writing", "API design experience", "Community building skills"]
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth by connecting with potential enterprise customers and qualifying leads.",
      requirements: ["1-2 years SDR experience", "SaaS/B2B background", "Excellent communication skills"]
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create compelling content about technical interviews, career development, and industry trends.",
      requirements: ["3+ years content marketing", "Technical background preferred", "SEO knowledge"]
    }
  ]

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Salary & Equity",
      description: "Top-tier compensation with meaningful equity upside"
    },
    {
      icon: "🏥",
      title: "Comprehensive Healthcare",
      description: "Medical, dental, vision, and mental health coverage"
    },
    {
      icon: "🏖️",
      title: "Flexible PTO",
      description: "Unlimited vacation policy with mandatory minimums"
    },
    {
      icon: "💻",
      title: "Remote-First Culture",
      description: "Work from anywhere with flexible hours"
    },
    {
      icon: "📚",
      title: "Learning & Development",
      description: "$3,000 annual budget for courses, conferences, and books"
    },
    {
      icon: "🍼",
      title: "Parental Leave",
      description: "16 weeks paid parental leave for all parents"
    }
  ]

  const departments = ["All", "Engineering", "AI/ML", "Design", "Sales", "Marketing"]

  return (
    <PageTemplate
      title="Careers at Prime"
      subtitle="Join our mission to democratize technical interview success for engineers worldwide"
      icon={icon}
      ctaText="View All Positions"
      ctaLink="#positions"
    >
      <div className="space-y-12">
        {/* Culture Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Work at Prime?</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-600 mb-4">
                We're building the future of technical interview preparation. Our team of passionate
                engineers, designers, and educators is creating AI-powered tools that help software
                engineers land their dream jobs at top tech companies.
              </p>
              <p className="text-slate-600 mb-4">
                At Prime, you'll work with cutting-edge technology, solve challenging problems, and
                have a direct impact on the careers of thousands of engineers worldwide.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 Fast-Growing Startup</h3>
                <p className="text-blue-800 text-sm">
                  Series A funded with 300% YoY growth and backing from top-tier VCs.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Our Values in Action</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Move Fast & Break Things</h4>
                    <p className="text-slate-600 text-sm">Rapid iteration with intelligent risk-taking</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm">
                    🤝
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Customer Obsession</h4>
                    <p className="text-slate-600 text-sm">Every decision starts with our users</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm">
                    📈
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Ownership Mindset</h4>
                    <p className="text-slate-600 text-sm">Take initiative and drive results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Open Positions</h2>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {departments.map((dept, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow ${
                position.featured ? 'border-blue-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30' : 'border-slate-200'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-slate-900 mr-3">{position.title}</h3>
                      {position.featured && (
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">{position.description}</p>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Key Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="bg-slate-50 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Hiring Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Application</h3>
              <p className="text-slate-600 text-sm">Submit your resume and cover letter</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Phone Screen</h3>
              <p className="text-slate-600 text-sm">30-minute call with our recruiting team</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Technical Interview</h3>
              <p className="text-slate-600 text-sm">Role-specific technical assessment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Final Interview</h3>
              <p className="text-slate-600 text-sm">Meet the team and discuss culture fit</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-slate-600 mb-8">
            We're always looking for exceptional talent. Send us your resume and tell us what role you'd love to create at Prime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get in Touch
            </Link>
            <a
              href="mailto:careers@primeinterviews.ai"
              className="bg-white text-slate-700 font-semibold px-8 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </section>
      </div>
    </PageTemplate>
  )
}