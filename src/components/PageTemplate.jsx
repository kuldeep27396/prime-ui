import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PageTemplate({
  title,
  subtitle,
  icon,
  children,
  comingSoon = false,
  ctaText = "Get Started",
  ctaLink = "/sign-up"
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container-responsive py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {icon}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Coming Soon Banner */}
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-2xl mb-8 text-center"
          >
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Coming Soon</span>
            </div>
            <p className="text-amber-100">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
        >
          {children}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ctaLink}
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                {ctaText}
              </span>
            </Link>
            <Link
              to="/"
              className="group bg-white text-slate-700 font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200"
            >
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                Back to Home
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}