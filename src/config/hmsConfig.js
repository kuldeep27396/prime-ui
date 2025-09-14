// JWT and UUID imports - using dynamic imports for browser compatibility
// import jwt from 'jsonwebtoken' // Not available in browser
// import { v4 as uuidv4 } from 'uuid'

// 100ms Configuration - LIVE CREDENTIALS
export const HMS_CONFIG = {
  // Your 100ms App credentials
  accessKey: '68c6586bbd0dab5f9a013c31',
  // NOTE: In production, app secret should NEVER be in frontend code!
  // This is for development/testing only. Use backend API in production.
  appSecret: 'my5Dp-limb-XI8Cq70YaodGmPJ838Plvyzy2dD861k3n1i0md98n8eUYd70HllZteN7FNRlu0THSvpNsWif1q6sW9n9LfmS19RXVz-ZwKhJvNpMhZxgdXF4MIbfjDjly6mohlJDlXc3ll3TQyYY5aI4zjOGEt3Z0MYXdRAqDgSo=',

  appId: '68c6586bbd0dab5f9a013c31', // Same as accessKey for 100ms
  roomId: '0e1da1f9-75c5-4fd7-a60e-21eecb6efb2a', // The UUID room ID from 100ms
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

// Import browser-compatible JWT utilities
import { create100msToken, generateUUID } from '../utils/browserJWT'

// Generate real 100ms auth token in the browser
// WARNING: This exposes app secret in frontend - only for development!
export const generateHMSToken = async (roomCode, userName, role = 'guest') => {
  try {
    console.log('Generating 100ms token for:', { roomCode, userName, role })

    const userId = `${userName.replace(/\s+/g, '_')}_${generateUUID().substring(0, 8)}`

    const tokenConfig = {
      accessKey: HMS_CONFIG.accessKey,
      appSecret: HMS_CONFIG.appSecret,
      roomId: HMS_CONFIG.roomId,
      userId: userId,
      role: role
    }

    const authToken = create100msToken(tokenConfig)

    console.log('Generated 100ms auth token:', authToken.substring(0, 50) + '...')

    return authToken

  } catch (error) {
    console.error('Token generation error:', error.message)
    throw new Error(`Failed to generate 100ms token: ${error.message}`)
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