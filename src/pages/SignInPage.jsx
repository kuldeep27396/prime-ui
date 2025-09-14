import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Prime Interviews
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your AI-powered interview practice
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/dashboard"
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