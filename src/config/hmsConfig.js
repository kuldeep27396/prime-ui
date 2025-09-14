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

// Generate simple UUID for browser compatibility
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Generate mock auth token for demo purposes
// IMPORTANT: In production, this MUST be generated on your backend!
export const generateHMSToken = async (roomCode, userName, role = 'guest') => {
  try {
    console.log('Generating demo token for:', { roomCode, userName, role })

    // For demo purposes, return a mock token
    // In production, you need to call your backend API that will use the 100ms Management API
    const mockToken = `demo_token_${generateUUID()}`

    console.log('Generated demo token (replace with backend call):', mockToken)

    // This is a placeholder - you'll need to implement proper backend token generation
    throw new Error('Demo mode: Please implement backend token generation for production use')

  } catch (error) {
    console.error('Token generation error:', error.message)
    throw new Error('This is demo mode. For production, implement backend token generation using 100ms Management API')
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