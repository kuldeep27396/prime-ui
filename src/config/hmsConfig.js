import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

// 100ms Configuration - LIVE CREDENTIALS
export const HMS_CONFIG = {
  // Your 100ms App credentials
  accessKey: '68c6586bbd0dab5f9a013c31',
  // NOTE: In production, app secret should NEVER be in frontend code!
  // This is for development/testing only. Use backend API in production.
  appSecret: 'my5Dp-limb-XI8Cq70YaodGmPJ838Plvyzy2dD861k3n1i0md98n8eUYd70HllZteN7FNRlu0THSvpNsWif1q6sW9n9LfmS19RXVz-ZwKhJvNpMhZxgdXF4MIbfjDjly6mohlJDlXc3ll3TQyYY5aI4zjOGEt3Z0MYXdRAqDgSo=',

  roomId: '68c65881a5ba8326e6eb84fe',
  templateId: '68c65881033903926e620516',

  // Template IDs for different room types (using the same template for now)
  templates: {
    interview: '68c65881033903926e620516',
    mentoring: '68c65881033903926e620516',
    screening: '68c65881033903926e620516'
  },

  // Default room settings
  defaultSettings: {
    audio: true,
    video: true,
    screen: false,
    quality: 'medium'
  },

  // API endpoint
  apiEndpoint: 'https://prod-in2.100ms.live/hmsapi'
}

// Helper function to generate room codes
export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Helper function to create room URL
export const createRoomUrl = (roomCode, role = 'participant') => {
  return `${window.location.origin}/interview-room/${roomCode}?role=${role}`
}

// Generate 100ms auth token
// SECURITY NOTE: This should be done on your backend in production!
export const generateHMSToken = async (roomCode, userName, role = 'guest') => {
  try {
    const now = Math.floor(Date.now() / 1000)

    const payload = {
      access_key: HMS_CONFIG.accessKey,
      room_id: HMS_CONFIG.roomId,
      user_id: `${userName}_${uuidv4().substring(0, 8)}`,
      role: role,
      type: 'app',
      version: 2,
      iat: now,
      exp: now + 24 * 3600, // 24 hours
      jti: uuidv4(),

      // Optional: Add more user metadata
      metadata: {
        name: userName,
        room_code: roomCode
      }
    }

    console.log('Generating token with payload:', payload)

    const token = jwt.sign(payload, HMS_CONFIG.appSecret, {
      algorithm: 'HS256'
    })

    return token
  } catch (error) {
    console.error('Error generating HMS token:', error)
    throw new Error('Failed to generate authentication token')
  }
}

// Create room with 100ms API (simplified version)
export const createHMSRoom = async (roomCode, templateId = HMS_CONFIG.templateId) => {
  try {
    // In a real implementation, you'd call the 100ms API to create a room
    // For now, we'll use the existing room ID
    console.log(`Creating HMS room with code: ${roomCode}, template: ${templateId}`)

    return {
      roomId: HMS_CONFIG.roomId,
      roomCode: roomCode,
      templateId: templateId
    }
  } catch (error) {
    console.error('Error creating HMS room:', error)
    throw new Error('Failed to create room')
  }
}