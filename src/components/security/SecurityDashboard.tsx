import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: Record<string, any>;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  resolved: boolean;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  resource_type?: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
}

interface SecurityDashboardData {
  security_events: {
    total: number;
    by_severity: Record<string, number>;
    by_type: Record<string, number>;
  };
  audit_logs: {
    total: number;
    by_action: Record<string, number>;
  };
  period_days: number;
}

const SecurityDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<SecurityDashboardData | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard data
      const dashboardResponse = await fetch('/api/v1/security/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!dashboardResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const dashboard = await dashboardResponse.json();
      setDashboardData(dashboard);

      // Fetch security alerts
      const alertsResponse = await fetch('/api/v1/security/security-alerts?resolved=false&limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (alertsResponse.ok) {
        const alerts = await alertsResponse.json();
        setSecurityAlerts(alerts);
      }

      // Fetch recent audit logs
      const auditResponse = await fetch('/api/v1/security/audit-logs?limit=20', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (auditResponse.ok) {
        const auditLogs = await auditResponse.json();
        setRecentAuditLogs(auditLogs);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Eye className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const applyRetentionPolicy = async () => {
    try {
      const response = await fetch('/api/v1/security/apply-retention-policy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('Data retention policy application scheduled successfully');
      } else {
        throw new Error('Failed to apply retention policy');
      }
    } catch (err) {
      alert('Error applying retention policy: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading security dashboard: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600">Monitor security events, compliance, and audit logs</p>
        </div>
        <Button onClick={applyRetentionPolicy} variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Apply Retention Policy
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.security_events.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last {dashboardData?.period_days || 30} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardData?.security_events.by_severity.critical || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.audit_logs.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              User actions tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {securityAlerts.filter(alert => !alert.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unresolved security alerts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Events by Severity */}
      {dashboardData && (
        <Card>
          <CardHeader>
            <CardTitle>Security Events by Severity</CardTitle>
            <CardDescription>
              Distribution of security events over the last {dashboardData.period_days} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboardData.security_events.by_severity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(severity)}
                    <span className="capitalize font-medium">{severity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-20 h-2 rounded-full ${getSeverityColor(severity)}`} 
                         style={{ width: `${Math.max(20, (count / dashboardData.security_events.total) * 100)}px` }} />
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Security Alerts</CardTitle>
          <CardDescription>
            Unresolved security alerts requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active security alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {securityAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Logs</CardTitle>
          <CardDescription>
            Latest user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAuditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    {log.resource_type && (
                      <p className="text-xs text-gray-600">
                        Resource: {log.resource_type}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.ip_address && (
                    <p className="text-xs text-gray-400">
                      IP: {log.ip_address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;