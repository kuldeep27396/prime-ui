import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import ProctoringMonitor from '../../components/proctoring/ProctoringMonitor';
import VideoAnalysisDashboard from '../../components/proctoring/VideoAnalysisDashboard';

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

const ProctoringDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'analysis'>('monitor');
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [sessionStats, setSessionStats] = useState<ProctoringStats>({
    integrity_score: 1.0,
    engagement_score: 1.0,
    alerts: [],
    recommendations: []
  });
  const [sessionAlerts, setSessionAlerts] = useState<Alert[]>([]);

  const handleAlert = (alert: Alert) => {
    setSessionAlerts(prev => [...prev, alert]);
    
    // Show browser notification for high severity alerts
    if (alert.severity === 'high' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Proctoring Alert', {
          body: alert.message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Proctoring Alert', {
              body: alert.message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  const handleStatsUpdate = (stats: ProctoringStats) => {
    setSessionStats(stats);
  };

  const toggleMonitoring = () => {
    setIsMonitoringActive(!isMonitoringActive);
    if (!isMonitoringActive) {
      // Request notification permission when starting monitoring
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const testVisionAPI = async () => {
    try {
      const response = await fetch('/api/v1/video-analysis/test-vision-api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.api_status === 'operational') {
        alert('✅ Vision API is working correctly!');
      } else {
        alert(`❌ Vision API test failed: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ Vision API test failed: ${error}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI-Powered Proctoring System
        </h1>
        <p className="text-gray-600">
          Advanced video analysis for interview integrity and engagement monitoring
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <Button
          variant={activeTab === 'monitor' ? 'default' : 'outline'}
          onClick={() => setActiveTab('monitor')}
        >
          Real-time Monitoring
        </Button>
        <Button
          variant={activeTab === 'analysis' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analysis')}
        >
          Video Analysis
        </Button>
        <Button
          variant="outline"
          onClick={testVisionAPI}
          className="ml-auto"
        >
          Test Vision API
        </Button>
      </div>

      {/* Real-time Monitoring Tab */}
      {activeTab === 'monitor' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Proctoring Monitor */}
          <div className="lg:col-span-2">
            <ProctoringMonitor
              sessionId="demo-session"
              isActive={isMonitoringActive}
              onAlert={handleAlert}
              onStatsUpdate={handleStatsUpdate}
            />
          </div>

          {/* Session Overview */}
          <div className="space-y-4">
            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Control Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={toggleMonitoring}
                  className={`w-full ${
                    isMonitoringActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isMonitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  {isMonitoringActive 
                    ? 'Monitoring is active. Frames are being analyzed every 5 seconds.'
                    : 'Click to start real-time proctoring monitoring.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Session Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Session Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Alerts:</span>
                    <span className="font-medium">{sessionAlerts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">High Severity:</span>
                    <span className="font-medium text-red-600">
                      {sessionAlerts.filter(a => a.severity === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medium Severity:</span>
                    <span className="font-medium text-yellow-600">
                      {sessionAlerts.filter(a => a.severity === 'medium').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Low Severity:</span>
                    <span className="font-medium text-blue-600">
                      {sessionAlerts.filter(a => a.severity === 'low').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Real-time integrity monitoring
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Engagement level tracking
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Multiple person detection
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unauthorized material detection
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Professional environment assessment
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Instant alert notifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Video Analysis Tab */}
      {activeTab === 'analysis' && (
        <div>
          <VideoAnalysisDashboard />
          
          {/* Analysis Features */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Analysis Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Cost Tiers</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Basic:</strong> Fast analysis with key frames</li>
                    <li><strong>Standard:</strong> Balanced cost and accuracy</li>
                    <li><strong>Premium:</strong> Comprehensive detailed analysis</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Analysis Types</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Integrity:</strong> Cheating and violation detection</li>
                    <li><strong>Engagement:</strong> Attention and focus assessment</li>
                    <li><strong>Professionalism:</strong> Appearance and environment</li>
                    <li><strong>Comprehensive:</strong> All aspects combined</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">AI Models</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Qwen-VL:</strong> Primary vision analysis</li>
                    <li><strong>LangDB:</strong> Advanced reasoning</li>
                    <li><strong>OpenRouter:</strong> Multi-model access</li>
                    <li><strong>Smart Sampling:</strong> Cost optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProctoringDemoPage;