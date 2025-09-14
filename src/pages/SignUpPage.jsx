import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join Prime Interviews
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start practicing
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'btn-primary',
              card: 'shadow-lg border border-slate-200',
            }
          }}
        />
      </div>
    </div>
  )
}