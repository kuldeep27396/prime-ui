import { SignIn } from '@clerk/clerk-react'
import AuthWrapper from '../components/auth/AuthWrapper'

export default function SignInPage() {
  return (
    <AuthWrapper
      title="Welcome Back"
      subtitle="Sign in to continue your AI-powered interview journey"
      type="signin"
    >
      <SignIn
        routing="hash"
        afterSignInUrl="/dashboard"
      />
    </AuthWrapper>
  )
}