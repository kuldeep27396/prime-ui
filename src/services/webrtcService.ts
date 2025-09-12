/**
 * WebRTC service for live video calls with PeerJS
 */

import Peer, { DataConnection, MediaConnection } from 'peerjs';

export interface WebRTCConfig {
  host?: string;
  port?: number;
  path?: string;
  secure?: boolean;
  debug?: number;
}

export interface WebRTCCallbacks {
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionOpen?: (peerId: string) => void;
  onConnectionClose?: () => void;
  onError?: (error: Error) => void;
  onDataReceived?: (data: any) => void;
}

export class WebRTCService {
  private peer: Peer | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private mediaConnection: MediaConnection | null = null;
  private dataConnection: DataConnection | null = null;
  private callbacks: WebRTCCallbacks = {};

  constructor(config: WebRTCConfig = {}) {
    this.initializePeer(config);
  }

  private initializePeer(config: WebRTCConfig) {
    const defaultConfig = {
      host: 'peerjs-server.railway.app', // Free PeerJS server
      port: 443,
      path: '/peerjs',
      secure: true,
      debug: 2
    };

    const peerConfig = { ...defaultConfig, ...config };

    this.peer = new Peer(peerConfig);

    this.peer.on('open', (id) => {
      console.log('Peer connection opened with ID:', id);
      this.callbacks.onConnectionOpen?.(id);
    });

    this.peer.on('call', (call) => {
      console.log('Incoming call received');
      this.handleIncomingCall(call);
    });

    this.peer.on('connection', (conn) => {
      console.log('Data connection established');
      this.setupDataConnection(conn);
    });

    this.peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.callbacks.onError?.(error);
    });

    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.callbacks.onConnectionClose?.();
    });
  }

  setCallbacks(callbacks: WebRTCCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  async initializeLocalStream(constraints: MediaStreamConstraints = {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.callbacks.onLocalStream?.(this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Failed to access camera/microphone');
    }
  }

  async makeCall(remotePeerId: string): Promise<void> {
    if (!this.peer || !this.localStream) {
      throw new Error('Peer or local stream not initialized');
    }

    try {
      // Make video call
      this.mediaConnection = this.peer.call(remotePeerId, this.localStream);
      this.setupMediaConnection(this.mediaConnection);

      // Establish data connection
      this.dataConnection = this.peer.connect(remotePeerId);
      this.setupDataConnection(this.dataConnection);

    } catch (error) {
      console.error('Error making call:', error);
      throw new Error('Failed to establish connection');
    }
  }

  private async handleIncomingCall(call: MediaConnection) {
    if (!this.localStream) {
      await this.initializeLocalStream();
    }

    // Answer the call with local stream
    call.answer(this.localStream!);
    this.mediaConnection = call;
    this.setupMediaConnection(call);
  }

  private setupMediaConnection(call: MediaConnection) {
    call.on('stream', (remoteStream) => {
      console.log('Remote stream received');
      this.remoteStream = remoteStream;
      this.callbacks.onRemoteStream?.(remoteStream);
    });

    call.on('close', () => {
      console.log('Media connection closed');
      this.remoteStream = null;
    });

    call.on('error', (error) => {
      console.error('Media connection error:', error);
      this.callbacks.onError?.(error);
    });
  }

  private setupDataConnection(conn: DataConnection) {
    this.dataConnection = conn;

    conn.on('open', () => {
      console.log('Data connection opened');
    });

    conn.on('data', (data) => {
      console.log('Data received:', data);
      this.callbacks.onDataReceived?.(data);
    });

    conn.on('close', () => {
      console.log('Data connection closed');
      this.dataConnection = null;
    });

    conn.on('error', (error) => {
      console.error('Data connection error:', error);
      this.callbacks.onError?.(error);
    });
  }

  sendData(data: any): void {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send(data);
    } else {
      console.warn('Data connection not available');
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  isConnected(): boolean {
    return this.peer?.open || false;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  async switchCamera(): Promise<void> {
    if (!this.localStream) return;

    try {
      const videoTrack = this.localStream.getVideoTracks()[0];
      const constraints = videoTrack.getConstraints();
      
      // Toggle between front and back camera
      const newConstraints = {
        ...constraints,
        facingMode: constraints.facingMode === 'user' ? 'environment' : 'user'
      };

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: newConstraints,
        audio: true
      });

      // Replace video track
      const newVideoTrack = newStream.getVideoTracks()[0];
      const sender = this.mediaConnection?.peerConnection
        ?.getSenders()
        .find(s => s.track?.kind === 'video');

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      // Update local stream
      videoTrack.stop();
      this.localStream.removeTrack(videoTrack);
      this.localStream.addTrack(newVideoTrack);

      this.callbacks.onLocalStream?.(this.localStream);

    } catch (error) {
      console.error('Error switching camera:', error);
      throw new Error('Failed to switch camera');
    }
  }

  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      if (this.mediaConnection && this.localStream) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = this.mediaConnection.peerConnection
          ?.getSenders()
          .find(s => s.track?.kind === 'video');

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
      }

    } catch (error) {
      console.error('Error starting screen share:', error);
      throw new Error('Failed to start screen sharing');
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.localStream || !this.mediaConnection) return;

    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = this.mediaConnection.peerConnection
        ?.getSenders()
        .find(s => s.track?.kind === 'video');

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      this.callbacks.onLocalStream?.(this.localStream);

    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  disconnect(): void {
    // Close Daily.co connection if active
    if (this.dailyFrame) {
      this.dailyFrame.leave();
      this.dailyFrame.destroy();
      this.dailyFrame = null;
    }

    // Close media connection
    if (this.mediaConnection) {
      this.mediaConnection.close();
      this.mediaConnection = null;
    }

    // Close data connection
    if (this.dataConnection) {
      this.dataConnection.close();
      this.dataConnection = null;
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close peer connection
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.remoteStream = null;
  }

  // Daily.co specific methods
  async createDailyRoom(roomName?: string): Promise<string> {
    try {
      // In a real implementation, you would call Daily.co API to create a room
      // For now, we'll generate a room URL
      const roomId = roomName || `interview-${Date.now()}`;
      return `https://prime.daily.co/${roomId}`;
    } catch (error) {
      console.error('Error creating Daily.co room:', error);
      throw error;
    }
  }

  isDailyActive(): boolean {
    return this.dailyFrame !== null;
  }

  async switchToDaily(roomUrl: string): Promise<void> {
    console.log('Switching to Daily.co fallback due to WebRTC issues');
    
    // Disconnect current WebRTC connection
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // Initialize Daily.co
    await this.initializeDailyFallback(roomUrl);
  }

  // Fallback to Daily.co for reliability
  async initializeDailyFallback(roomUrl: string): Promise<void> {
    try {
      console.log('Initializing Daily.co fallback for room:', roomUrl);
      
      // Load Daily.co SDK dynamically
      if (!window.DailyIframe) {
        await this.loadDailyScript();
      }

      // Create Daily.co iframe
      const dailyFrame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: '9999'
        },
        showLeaveButton: true,
        showFullscreenButton: true,
        showLocalVideo: true,
        showParticipantsBar: true
      });

      // Join the room
      await dailyFrame.join({ url: roomUrl });

      // Set up event handlers
      dailyFrame
        .on('joined-meeting', (event) => {
          console.log('Daily.co: Joined meeting', event);
          this.callbacks.onConnectionOpen?.(event.participants.local.session_id);
        })
        .on('participant-joined', (event) => {
          console.log('Daily.co: Participant joined', event);
        })
        .on('participant-left', (event) => {
          console.log('Daily.co: Participant left', event);
        })
        .on('track-started', (event) => {
          console.log('Daily.co: Track started', event);
          if (event.track.kind === 'video') {
            const videoElement = document.createElement('video');
            videoElement.srcObject = new MediaStream([event.track]);
            videoElement.autoplay = true;
            
            if (event.participant.local) {
              this.callbacks.onLocalStream?.(new MediaStream([event.track]));
            } else {
              this.callbacks.onRemoteStream?.(new MediaStream([event.track]));
            }
          }
        })
        .on('error', (event) => {
          console.error('Daily.co error:', event);
          this.callbacks.onError?.(new Error(event.errorMsg));
        })
        .on('left-meeting', () => {
          console.log('Daily.co: Left meeting');
          this.callbacks.onConnectionClose?.();
        });

      // Store reference for cleanup
      this.dailyFrame = dailyFrame;

    } catch (error) {
      console.error('Daily.co fallback failed:', error);
      throw error;
    }
  }

  private async loadDailyScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.DailyIframe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@daily-co/daily-js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Daily.co SDK'));
      document.head.appendChild(script);
    });
  }

  private dailyFrame: any = null;
}

// Singleton instance
export const webrtcService = new WebRTCService();