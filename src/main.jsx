import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// For local development, bypass Clerk authentication
// Set VITE_BYPASS_AUTH=true in .env to skip Clerk

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true' || !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (BYPASS_AUTH) {
  console.log('🔓 Auth bypassed for local development')

  // Mock user context provider
  const MockAuthProvider = ({ children }) => children

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <MockAuthProvider>
        <App />
      </MockAuthProvider>
    </React.StrictMode>,
  )
} else {
  // Production mode with Clerk
  import('@clerk/clerk-react').then(({ ClerkProvider }) => {
    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

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
  })
}