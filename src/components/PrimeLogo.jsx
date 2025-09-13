export default function PrimeLogo({ className = "w-9 h-9", textClassName = "" }) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${className} bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main Logo */}
        <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none">
          {/* Shield/Crown shape */}
          <path
            d="M12 2L3 6v6c0 5.55 3.84 9.74 9 10 5.16-.26 9-4.45 9-10V6l-9-4z"
            fill="currentColor"
            className="drop-shadow-sm"
          />

          {/* Inner "P" letter */}
          <path
            d="M8 8h3.5c1.38 0 2.5 1.12 2.5 2.5S12.88 13 11.5 13H8v3h-1V8h1zm0 1v3h3.5c.83 0 1.5-.67 1.5-1.5S12.33 9 11.5 9H8z"
            fill="white"
            className="font-bold"
          />

          {/* Accent dots */}
          <circle cx="16" cy="8" r="1" fill="rgba(255,255,255,0.7)" />
          <circle cx="18" cy="10" r="0.5" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      <div className={textClassName}>
        <div className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Prime Interviews
        </div>
        <div className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Interview Platform
        </div>
      </div>
    </div>
  )
}