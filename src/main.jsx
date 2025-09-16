import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { emailService } from './services/emailService'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_demo_key'

// Log warning if using demo key
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn("⚠️  Using demo Clerk key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file for full functionality.")
}

// Initialize email service
try {
  emailService.init()
} catch (error) {
  console.error('Email service initialization failed:', error)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)