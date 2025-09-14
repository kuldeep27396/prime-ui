// Demo Authentication Utilities for Browser Compatibility

/**
 * Generate demo auth token for 100ms
 * In production, this should be done on your backend using the 100ms Management API
 */
export const generateDemoToken = (roomCode, userName, role = 'guest') => {
  const timestamp = Date.now()
  const userId = `${userName}_${Math.random().toString(36).substring(2, 8)}`

  // Create a demo token structure (not for production!)
  const demoPayload = {
    room_code: roomCode,
    user_id: userId,
    user_name: userName,
    role: role,
    timestamp: timestamp,
    demo: true
  }

  // Base64 encode for demo purposes (NOT SECURE!)
  const demoToken = btoa(JSON.stringify(demoPayload))

  console.log('Generated demo token (NOT FOR PRODUCTION):', {
    token: demoToken,
    payload: demoPayload
  })

  return demoToken
}

/**
 * Backend Integration Instructions
 *
 * For production, replace the demo token generation with a call to your backend:
 *
 * ```javascript
 * export const getProductionToken = async (roomCode, userName, role) => {
 *   const response = await fetch('/api/generate-hms-token', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ roomCode, userName, role })
 *   })
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to generate auth token')
 *   }
 *
 *   const { authToken } = await response.json()
 *   return authToken
 * }
 * ```
 *
 * Your backend should use the 100ms Management API:
 * https://docs.100ms.live/server-side/v2/api-reference/auth-token-api
 */

export const DEMO_CONFIG = {
  isDemo: true,
  message: 'This is demo mode. Implement backend token generation for production.',
  backendRequired: 'For live video calls, implement /api/generate-hms-token endpoint'
}