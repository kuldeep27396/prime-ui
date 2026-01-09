// Mock auth hooks for local development without Clerk

// Check if we're bypassing auth
export const BYPASS_AUTH = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    import.meta.env.VITE_BYPASS_AUTH === 'true'

// Mock user for development
const mockUser = {
    id: 'dev_user_123',
    firstName: 'Dev',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'dev@example.com' }],
    primaryEmailAddress: { emailAddress: 'dev@example.com' },
    imageUrl: null,
}

// Mock useUser hook
export const useUser = () => {
    if (BYPASS_AUTH) {
        return {
            isLoaded: true,
            isSignedIn: true,
            user: mockUser,
        }
    }
    // Will be overridden by actual Clerk if not bypassing
    return { isLoaded: true, isSignedIn: false, user: null }
}

// Mock useAuth hook
export const useAuth = () => {
    if (BYPASS_AUTH) {
        return {
            isLoaded: true,
            isSignedIn: true,
            userId: 'dev_user_123',
            getToken: async () => 'dev_token_for_testing',
            signOut: () => console.log('Mock sign out'),
        }
    }
    return { isLoaded: true, isSignedIn: false, userId: null, getToken: async () => null }
}

// Mock SignIn component
export const SignIn = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Development Mode</h2>
            <p className="text-slate-600 mb-4">Auth is bypassed for local development</p>
            <a href="/dashboard" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                Go to Dashboard
            </a>
        </div>
    </div>
)

// Mock SignUp component
export const SignUp = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Development Mode</h2>
            <p className="text-slate-600 mb-4">Auth is bypassed for local development</p>
            <a href="/dashboard" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                Go to Dashboard
            </a>
        </div>
    </div>
)

// Mock UserButton component
export const UserButton = () => {
    if (BYPASS_AUTH) {
        return (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                D
            </div>
        )
    }
    return null
}
