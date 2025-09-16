import PageTemplate from '../components/PageTemplate'
import { Link } from 'react-router-dom'

export default function BlogPage() {
  const icon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )

  const blogPosts = [
    {
      title: "Mastering System Design Interviews in 2024",
      excerpt: "A comprehensive guide to approaching system design questions with confidence and structured thinking.",
      author: "Diana Prince",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "System Design",
      featured: true
    },
    {
      title: "The STAR Method: Your Secret Weapon for Behavioral Interviews",
      excerpt: "Learn how to structure your answers using Situation, Task, Action, Result framework for maximum impact.",
      author: "Steve Rogers",
      date: "Dec 12, 2024",
      readTime: "5 min read",
      category: "Behavioral"
    },
    {
      title: "Top 10 Coding Patterns Every Software Engineer Should Know",
      excerpt: "Master these fundamental algorithms and data structure patterns to ace any technical interview.",
      author: "Peter Parker",
      date: "Dec 10, 2024",
      readTime: "12 min read",
      category: "Technical"
    },
    {
      title: "Breaking into FAANG: A Complete Roadmap",
      excerpt: "Step-by-step strategy for landing your dream job at Facebook, Apple, Amazon, Netflix, or Google.",
      author: "Natasha Romanoff",
      date: "Dec 8, 2024",
      readTime: "15 min read",
      category: "Career"
    },
    {
      title: "How AI is Revolutionizing Interview Preparation",
      excerpt: "Discover how artificial intelligence is changing the way candidates prepare for technical interviews.",
      author: "Tony Stark",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Technology"
    },
    {
      title: "Common Mistakes in Technical Interviews and How to Avoid Them",
      excerpt: "Learn from the most frequent pitfalls that cost candidates their dream job offers.",
      author: "Clark Kent",
      date: "Dec 3, 2024",
      readTime: "10 min read",
      category: "Technical"
    }
  ]

  const categories = ["All", "Technical", "System Design", "Behavioral", "Career", "Technology"]

  return (
    <PageTemplate
      title="Blog"
      subtitle="Expert insights, interview tips, and industry trends to accelerate your career"
      icon={icon}
      ctaText="Subscribe to Newsletter"
      ctaLink="/contact"
    >
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-8">
            {/* Featured Post */}
            {blogPosts
              .filter(post => post.featured)
              .map((post, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mr-3">
                      FEATURED
                    </span>
                    <span className="text-blue-600 font-medium text-sm">{post.category}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h2>
                  <p className="text-slate-600 text-lg mb-6">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="font-medium text-slate-700">{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      to="#"
                      className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              ))}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 py-4 border-b border-slate-200">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    index === 0
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter(post => !post.featured)
                .map((post, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        post.category === 'Technical' ? 'bg-green-100 text-green-800' :
                        post.category === 'System Design' ? 'bg-purple-100 text-purple-800' :
                        post.category === 'Behavioral' ? 'bg-orange-100 text-orange-800' :
                        post.category === 'Career' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div>
                        <span className="font-medium text-slate-700">{post.author}</span>
                        <span className="mx-1">•</span>
                        <span>{post.date}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      to="#"
                      className="block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button className="bg-slate-100 text-slate-700 font-semibold px-8 py-3 rounded-lg hover:bg-slate-200 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">📧 Newsletter</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">Get Weekly Updates</h4>
            <p className="text-blue-800 text-sm mb-4">
              Join 10,000+ professionals getting expert interview tips and career insights.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">🏷️ Popular Tags</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {['Coding', 'Algorithms', 'System Design', 'FAANG', 'Career Tips', 'AI', 'Behavioral'].map((tag, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full hover:bg-slate-200 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">🔗 Quick Links</h3>
          <div className="space-y-3">
            <Link to="/documentation" className="block p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <h4 className="font-semibold text-emerald-900">Documentation</h4>
              <p className="text-emerald-700 text-sm">Complete guides & tutorials</p>
            </Link>
            <Link to="/help-center" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-semibold text-purple-900">Help Center</h4>
              <p className="text-purple-700 text-sm">FAQs and support</p>
            </Link>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}