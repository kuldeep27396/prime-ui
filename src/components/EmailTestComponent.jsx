import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { emailService } from '../services/emailService';

export default function EmailTestComponent() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sendTestEmail = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setError('No email address found for signed-in user');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('Sending test email to:', user.emailAddresses[0].emailAddress);

      const success = await emailService.sendMeetingInvitation({
        to_email: user.emailAddresses[0].emailAddress,
        to_name: user.fullName || user.firstName || 'Prime User',
        meeting_title: 'Test Interview - Email System Verification',
        meeting_date: new Date().toLocaleDateString(),
        meeting_time: new Date().toLocaleTimeString(),
        meeting_duration: '60 minutes',
        meeting_description: 'This is a test email to verify that our email system is working correctly with React Email and SMTP.',
        meeting_link: `${window.location.origin}/test-room/123`
      });

      if (success) {
        setResult({
          success: true,
          message: `✅ Test email sent successfully to ${user.emailAddresses[0].emailAddress}!`
        });
      } else {
        throw new Error('Email sending failed');
      }

    } catch (err) {
      console.error('Email test error:', err);
      setError(`❌ Failed to send test email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ Please sign in to test email functionality</p>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">📧 Email System Test</h3>
        <p className="text-gray-600">
          Test the email functionality by sending a sample interview invitation to your email address.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Test Configuration:</h4>
        <div className="space-y-1 text-sm">
          <p><strong>Recipient:</strong> {user.emailAddresses[0]?.emailAddress}</p>
          <p><strong>Name:</strong> {user.fullName || user.firstName || 'Prime User'}</p>
          <p><strong>Email Type:</strong> Interview Invitation (React Email Template)</p>
          <p><strong>SMTP Provider:</strong> useSend</p>
          <p><strong>From Domain:</strong> primeinterviews.info</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={sendTestEmail}
          disabled={loading}
          className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
              Sending Test Email...
            </>
          ) : (
            <>
              📧 Send Test Email
            </>
          )}
        </button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">{result.message}</p>
            <p className="text-green-600 text-sm mt-1">
              Check your inbox (and spam folder) for the test email with React Email styling.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>

            {error.includes('Domain') && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-sm font-medium">🔍 Domain Verification Issue</p>
                <p className="text-yellow-700 text-sm mt-1">
                  The domain <code>primeinterviews.info</code> is still being verified by useSend.
                  This can take 15 minutes to 24 hours. Please check your useSend dashboard.
                </p>
              </div>
            )}

            <details className="mt-2">
              <summary className="text-red-600 text-sm cursor-pointer">Show debugging info</summary>
              <div className="text-red-600 text-xs mt-2 font-mono bg-red-100 p-2 rounded">
                <p>• Backend API: /api/send-email</p>
                <p>• SMTP Host: smtp.usesend.com</p>
                <p>• From Email: noreply@primeinterviews.info</p>
                <p>• Domain Status: Pending verification</p>
                <p>• Check browser console for more details</p>
              </div>
            </details>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-900 font-semibold mb-2">📝 How to Test:</h4>
          <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
            <li>Make sure you're signed in with a valid email address</li>
            <li>Click "Send Test Email" button above</li>
            <li>Check your email inbox (and spam folder)</li>
            <li>Look for a professional email with Prime Interviews branding</li>
            <li>Verify the React Email template renders correctly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}