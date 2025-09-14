import CryptoJS from 'crypto-js';
import { HMS_CONFIG } from '../config/hmsConfig';

// Browser-compatible JWT implementation for 100ms
// WARNING: This exposes your app secret in the frontend code!
// Only use this for development/testing. Use backend API in production.

const base64UrlEncode = (str) => {
  const base64 = btoa(str);
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateHMACSignature = (data, secret) => {
  const hmac = CryptoJS.HmacSHA256(data, secret);
  const base64 = CryptoJS.enc.Base64.stringify(hmac);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Generate UUID v4
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Create 100ms auth token
export const create100msToken = ({
  roomId,
  userId,
  role,
  appId = HMS_CONFIG.appId,
  templateId
}) => {
  const now = Math.floor(Date.now() / 1000);

  // Create JWT payload
  const payload = {
    access_key: appId,
    room_id: roomId,
    user_id: userId || generateUUID(),
    role: role || 'guest',
    type: 'app',
    version: 2,
    template_id: templateId,
    iat: now,
    nbf: now - 5,  // Valid from 5 seconds ago to avoid time sync issues
    exp: now + 24 * 3600,  // 24 hours
    jti: generateUUID()
  };

  // Create JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = generateHMACSignature(signatureInput, HMS_CONFIG.appSecret);

  console.log('Creating 100ms token with payload:', payload);

  // Return complete JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};