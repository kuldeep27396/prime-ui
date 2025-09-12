import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface Alert {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

interface ProctoringStats {
  integrity_score: number;
  engagement_score: number;
  alerts: Alert[];
  recommendations: string[];
}

interface ProctoringMonitorProps {
  sessionId: string;
  isActive: boolean;
  onAlert?: (alert: Alert) => void;
  onStatsUpdate?: (stats: ProctoringStats) => void;
}

const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
  sessionId,
  isActive,
  onAlert,
  onStatsUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentStats, setCurrentStats] = useState<ProctoringStats>({
    integrity_score: 1.0,
    engagement_score: 1.0,
    alerts: [],
    recommendations: []
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Failed to initialize camera:', error);
    }
  }, []);

  // Capture frame from video
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  }, []);

  // Send frame for analysis
  const analyzeFrame = useCallback(async (frameData: string) => {
    try {
      const response = await fetch('/api/v1/video-analysis/real-time-proctoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          frame_data: frameData,
          session_id: sessionId,
          timestamp: Date.now() / 1000
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const newStats: ProctoringStats = {
          integrity_score: result.integrity_score,
          engagement_score: result.engagement_score,
          alerts: result.alerts || [],
          recommendations: result.recommendations || []
        };

        setCurrentStats(newStats);
        onStatsUpdate?.(newStats);

        // Handle new alerts
        if (result.alerts && result.alerts.length > 0) {
          result.alerts.forEach((alert: Alert) => {
            setAlerts(prev => [...prev.slice(-9), alert]); // Keep last 10 alerts
            onAlert?.(alert);
          });
        }
      }
    } catch (error) {
      console.error('Frame analysis failed:', error);
    }
  }, [sessionId, onAlert, onStatsUpdate]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!isActive || isMonitoring) return;

    setIsMonitoring(true);
    
    // Analyze frames every 5 seconds
    intervalRef.current = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        analyzeFrame(frameData);
      }
    }, 5000);
  }, [isActive, isMonitoring, captureFrame, analyzeFrame]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize camera when component mounts
  useEffect(() => {
    if (isActive) {
      initializeCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopMonitoring();
    };
  }, [isActive, initializeCamera, stream, stopMonitoring]);

  // Start/stop monitoring based on isActive prop
  useEffect(() => {
    if (isActive && stream) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }, [isActive, stream, startMonitoring, stopMonitoring]);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-500 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Proctoring Monitor</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-md mx-auto rounded-lg border"
              style={{ transform: 'scaleX(-1)' }} // Mirror the video
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Camera not available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Current Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(currentStats.integrity_score)}`}>
                {(currentStats.integrity_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Integrity</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(currentStats.engagement_score)}`}>
                {(currentStats.engagement_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.slice(-5).reverse().map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{alert.type.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm">{alert.message}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {currentStats.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {currentStats.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProctoringMonitor;