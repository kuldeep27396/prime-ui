import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DataExportRequest {
  id: string;
  company_id: string;
  export_type: string;
  format: string;
  filters: Record<string, any>;
  status: string;
  progress: number;
  file_url?: string;
  file_size?: number;
  expires_at?: string;
  error_message?: string;
  retry_count: number;
  requested_by: string;
  created_at: string;
  completed_at?: string;
}

const EXPORT_TYPES = [
  { value: 'candidates', label: 'Candidates Data' },
  { value: 'interviews', label: 'Interviews Data' },
  { value: 'analytics', label: 'Analytics Data' },
  { value: 'full_backup', label: 'Full Backup' }
];

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'pdf', label: 'PDF' }
];

export const DataExport: React.FC = () => {
  const [exports, setExports] = useState<DataExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    export_type: 'candidates',
    format: 'csv',
    filters: {}
  });

  useEffect(() => {
    fetchExports();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchExports, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchExports = async () => {
    try {
      const response = await fetch('/api/v1/admin/exports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExports(data);
      }
    } catch (error) {
      console.error('Error fetching exports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExport = async () => {
    try {
      const response = await fetch('/api/v1/admin/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchExports();
        setShowCreateForm(false);
        setFormData({
          export_type: 'candidates',
          format: 'csv',
          filters: {}
        });
      }
    } catch (error) {
      console.error('Error creating export:', error);
    }
  };

  const handleDownload = (exportRequest: DataExportRequest) => {
    if (exportRequest.file_url) {
      // In a real implementation, this would be a signed URL
      window.open(exportRequest.file_url, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading exports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Export & Reporting</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Export
        </Button>
      </div>

      {/* Export Requests List */}
      <div className="space-y-4">
        {exports.map((exportRequest) => (
          <Card key={exportRequest.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {EXPORT_TYPES.find(t => t.value === exportRequest.export_type)?.label}
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(exportRequest.status)}`}>
                      {exportRequest.status.toUpperCase()}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Format: {exportRequest.format.toUpperCase()} • 
                    Created: {new Date(exportRequest.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {exportRequest.status === 'completed' && exportRequest.file_url && !isExpired(exportRequest.expires_at) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(exportRequest)}
                    >
                      Download
                    </Button>
                  )}
                  {exportRequest.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real implementation, this would retry the export
                        console.log('Retry export:', exportRequest.id);
                      }}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {exportRequest.status === 'processing' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{exportRequest.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportRequest.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {exportRequest.status === 'completed' && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <span className="ml-2">{formatFileSize(exportRequest.file_size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Completed:</span>
                    <span className="ml-2">
                      {exportRequest.completed_at && new Date(exportRequest.completed_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expires:</span>
                    <span className={`ml-2 ${isExpired(exportRequest.expires_at) ? 'text-red-600' : ''}`}>
                      {exportRequest.expires_at && new Date(exportRequest.expires_at).toLocaleDateString()}
                      {isExpired(exportRequest.expires_at) && ' (Expired)'}
                    </span>
                  </div>
                </div>
              )}

              {exportRequest.status === 'failed' && exportRequest.error_message && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  <strong>Error:</strong> {exportRequest.error_message}
                  {exportRequest.retry_count > 0 && (
                    <div className="mt-1">
                      Retry attempts: {exportRequest.retry_count}
                    </div>
                  )}
                </div>
              )}

              {Object.keys(exportRequest.filters).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Filters Applied:</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <pre>{JSON.stringify(exportRequest.filters, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {exports.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              No export requests yet. Create your first export to get started.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Export Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create Data Export</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Export Type</label>
                <select
                  value={formData.export_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, export_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {EXPORT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {EXPORT_FORMATS.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional filters based on export type */}
              {formData.export_type === 'candidates' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Candidate Filters (Optional)</label>
                  <Input
                    placeholder="Job ID (optional)"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, job_id: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Status (e.g., active, hired)"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, status: e.target.value }
                    }))}
                  />
                </div>
              )}

              {formData.export_type === 'interviews' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Interview Filters (Optional)</label>
                  <Input
                    type="date"
                    placeholder="From Date"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, date_from: e.target.value }
                    }))}
                  />
                  <Input
                    type="date"
                    placeholder="To Date"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, date_to: e.target.value }
                    }))}
                  />
                </div>
              )}

              {formData.export_type === 'analytics' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Analytics Filters (Optional)</label>
                  <select
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, period: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Period</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_90_days">Last 90 Days</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    export_type: 'candidates',
                    format: 'csv',
                    filters: {}
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateExport}>
                Create Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};