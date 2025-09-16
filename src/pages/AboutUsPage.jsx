import PageTemplate from '../components/PageTemplate'
import { Link } from 'react-router-dom'

export default function AboutUsPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )

  const team = [
    {
      name: "Diana Prince",
      role: "Co-Founder & CEO",
      bio: "Former Senior Engineer at Google with 8+ years building scalable systems. Passionate about democratizing interview success.",
      image: "👩‍💼",
      education: "Stanford Computer Science"
    },
    {
      name: "Tony Stark",
      role: "Co-Founder & CTO",
      bio: "Ex-Meta Principal Engineer and AI researcher. Expert in machine learning systems and technical interview assessment.",
      image: "👨‍💻",
      education: "MIT EECS"
    },
    {
      name: "Natasha Romanoff",
      role: "Head of Product",
      bio: "Former Product Manager at Netflix and Airbnb. Specializes in user experience and product strategy.",
      image: "👩‍🚀",
      education: "Berkeley Haas MBA"
    },
    {
      name: "Bruce Wayne",
      role: "Head of Engineering",
      bio: "Senior Staff Engineer with experience at Uber and Stripe. Leads our platform development and infrastructure.",
      image: "👨‍🔧",
      education: "CMU Computer Science"
    }
  ]

  const values = [
    {
      icon: "🎯",
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from our AI technology to customer support."
    },
    {
      icon: "🤝",
      title: "Accessibility",
      description: "Great interview preparation should be available to everyone, regardless of background or resources."
    },
    {
      icon: "📈",
      title: "Growth",
      description: "We believe in continuous learning and helping our users achieve their career aspirations."
    },
    {
      icon: "🔬",
      title: "Innovation",
      description: "We use cutting-edge AI and data science to create the most effective interview preparation tools."
    }
  ]

  return (
    <PageTemplate
      title="About Prime Interviews"
      subtitle="Empowering the next generation of software engineers to land their dream jobs"
      icon={icon}
      ctaText="Join Our Team"
      ctaLink="/careers"
    >
      <div className="space-y-12">
        {/* Mission Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
            <p className="text-xl text-slate-700 leading-relaxed text-center">
              We're on a mission to level the playing field for technical interviews. By combining
              artificial intelligence with expert human insights, we help software engineers master
              the skills needed to succeed at top technology companies.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Story</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-600 mb-4">
                Prime Interviews was founded in 2023 by two engineers who experienced firsthand
                the challenges of technical interviewing. After conducting hundreds of interviews
                at companies like Google, Meta, and Netflix, we realized that success often came
                down to preparation strategy rather than raw talent.
              </p>
              <p className="text-slate-600 mb-4">
                We saw brilliant engineers fail interviews due to lack of structured practice,
                while others succeeded by following proven frameworks. This inspired us to build
                a platform that could provide personalized, AI-powered coaching to anyone.
              </p>
              <p className="text-slate-600">
                Today, we've helped over 50,000 engineers improve their interview skills, with
                an 85% success rate for landing offers at their target companies.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-4">📊 By the Numbers</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-slate-600 text-sm">Engineers Helped</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">85%</div>
                  <div className="text-slate-600 text-sm">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">1M+</div>
                  <div className="text-slate-600 text-sm">Practice Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">500+</div>
                  <div className="text-slate-600 text-sm">Expert Mentors</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm mb-3">{member.bio}</p>
                <p className="text-xs text-slate-500">{member.education}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Investors Section */}
        <section className="bg-slate-50 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Backed by Industry Leaders</h2>
          <div className="text-center">
            <p className="text-slate-600 mb-6">
              We're proud to be supported by top-tier investors and advisors who share our vision
              for transforming technical interview preparation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-slate-400">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold">Andreessen Horowitz</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold">Sequoia Capital</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold">First Round</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold">Y Combinator</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-600 mb-8">
            Have questions about our platform or interested in partnerships? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              className="bg-white text-slate-700 font-semibold px-8 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Join Our Team
            </Link>
          </div>
        </section>
      </div>
    </PageTemplate>
  )
}