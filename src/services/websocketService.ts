/**
 * WebSocket service for real-time communication
 */

export interface WebSocketMessage {
  type: string;
  data: any;
  recipient_id?: string;
  sender_id?: string;
  timestamp: string;
}

export interface WebSocketCallbacks {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onInterviewStatus?: (data: any) => void;
  onCandidateUpdate?: (data: any) => void;
  onNotification?: (data: any) => void;
  onChatMessage?: (data: any) => void;
  onSystemAlert?: (data: any) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private shouldReconnect = true;

  constructor(
    private userId: string,
    private token?: string,
    private baseUrl: string = process.env.REACT_APP_WS_URL || 'ws://localhost:8000'
  ) {}

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.shouldReconnect = true;

      try {
        const wsUrl = `${this.baseUrl}/api/v1/ws/${this.userId}${
          this.token ? `?token=${this.token}` : ''
        }`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.callbacks.onConnect?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.callbacks.onDisconnect?.();

          if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.callbacks.onError?.(error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect() {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('WebSocket message received:', message.type);

    // Call general message callback
    this.callbacks.onMessage?.(message);

    // Call specific callbacks based on message type
    switch (message.type) {
      case 'interview_status':
        this.callbacks.onInterviewStatus?.(message.data);
        break;
      case 'candidate_update':
        this.callbacks.onCandidateUpdate?.(message.data);
        break;
      case 'notification':
        this.callbacks.onNotification?.(message.data);
        break;
      case 'chat_message':
        this.callbacks.onChatMessage?.(message.data);
        break;
      case 'system_alert':
        this.callbacks.onSystemAlert?.(message.data);
        break;
      case 'heartbeat':
        this.sendHeartbeatResponse();
        break;
      case 'error':
        console.error('WebSocket error message:', message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'heartbeat_response',
          data: { timestamp: new Date().toISOString() }
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendHeartbeatResponse() {
    this.sendMessage({
      type: 'heartbeat_response',
      data: { timestamp: new Date().toISOString() }
    });
  }

  sendMessage(message: { type: string; data: any }) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  joinRoom(roomId: string) {
    this.sendMessage({
      type: 'join_room',
      data: { room_id: roomId }
    });
  }

  leaveRoom(roomId: string) {
    this.sendMessage({
      type: 'leave_room',
      data: { room_id: roomId }
    });
  }

  sendChatMessage(roomId: string, message: string) {
    this.sendMessage({
      type: 'chat_message',
      data: {
        room_id: roomId,
        message: message
      }
    });
  }

  sendInterviewSignal(interviewId: string, signalType: string, signalData: any) {
    this.sendMessage({
      type: 'interview_signal',
      data: {
        interview_id: interviewId,
        signal_type: signalType,
        signal_data: signalData
      }
    });
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Notification service for handling real-time notifications
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
  }> = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  addNotification(data: any) {
    const notification = {
      id: Date.now().toString(),
      title: data.title || 'Notification',
      message: data.message,
      type: data.type || 'info',
      timestamp: new Date(data.timestamp || Date.now()),
      read: false,
      actionUrl: data.action_url
    };

    this.notifications.unshift(notification);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
  }

  getNotifications() {
    return this.notifications;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  clearNotifications() {
    this.notifications = [];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}

// Add React import
import React from 'react';

// React hook for WebSocket connection
export function useWebSocket(userId: string, token?: string) {
  const [wsService, setWsService] = React.useState<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionState, setConnectionState] = React.useState('CLOSED');

  React.useEffect(() => {
    if (!userId) return;

    const service = new WebSocketService(userId, token);
    
    service.setCallbacks({
      onConnect: () => {
        setIsConnected(true);
        setConnectionState('OPEN');
      },
      onDisconnect: () => {
        setIsConnected(false);
        setConnectionState('CLOSED');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      },
      onNotification: (data) => {
        NotificationService.getInstance().addNotification(data);
      }
    });

    service.connect().catch(console.error);
    setWsService(service);

    return () => {
      service.disconnect();
    };
  }, [userId, token]);

  React.useEffect(() => {
    if (wsService) {
      const interval = setInterval(() => {
        setConnectionState(wsService.getConnectionState());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [wsService]);

  return {
    wsService,
    isConnected,
    connectionState
  };
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}