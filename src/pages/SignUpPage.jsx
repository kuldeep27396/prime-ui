import { SignUp } from '@clerk/clerk-react'
import AuthWrapper from '../components/auth/AuthWrapper'

export default function SignUpPage() {
  return (
    <AuthWrapper
      title="Join Prime Interviews"
      subtitle="Create your account and master your next interview"
      type="signup"
    >
      <SignUp
        routing="hash"
        afterSignUpUrl="/dashboard"
      />
    </AuthWrapper>
  )
}