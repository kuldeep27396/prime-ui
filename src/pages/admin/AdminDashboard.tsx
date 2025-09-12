import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RoleManagement } from '../../components/admin/RoleManagement';
import { CompanyBranding } from '../../components/admin/CompanyBranding';
import { TemplateLibrary } from '../../components/admin/TemplateLibrary';
import { DataExport } from '../../components/admin/DataExport';
import { CompanyAnalytics } from '../../components/admin/CompanyAnalytics';

type AdminTab = 'overview' | 'roles' | 'branding' | 'templates' | 'analytics' | 'exports';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: '📊' },
    { id: 'roles' as AdminTab, label: 'Roles & Permissions', icon: '👥' },
    { id: 'branding' as AdminTab, label: 'Company Branding', icon: '🎨' },
    { id: 'templates' as AdminTab, label: 'Template Library', icon: '📝' },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: '📈' },
    { id: 'exports' as AdminTab, label: 'Data Export', icon: '📤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'roles':
        return <RoleManagement />;
      case 'branding':
        return <CompanyBranding />;
      case 'templates':
        return <TemplateLibrary />;
      case 'analytics':
        return <CompanyAnalytics />;
      case 'exports':
        return <DataExport />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Administration</h1>
          <p className="text-gray-600 mt-2">
            Manage your company's recruitment platform settings and configurations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Administration Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Status</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>AI Services</span>
                <span className="text-green-600">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <span className="text-green-600">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Roles</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span>Templates</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span>Export Requests</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Role "Senior Recruiter" created</div>
                <div className="text-gray-500">2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Company branding updated</div>
                <div className="text-gray-500">1 day ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Data export completed</div>
                <div className="text-gray-500">2 days ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New template added</div>
                <div className="text-gray-500">3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-yellow-600">Password policy reminder</div>
                <div className="text-gray-500">3 users need to update passwords</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-green-600">All systems secure</div>
                <div className="text-gray-500">No critical issues detected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage</span>
                  <span>245 MB / 1 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>API Calls</span>
                  <span>1,234 / 10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '12.34%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Video Minutes</span>
                  <span>456 / 10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '4.56%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Create New Role
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Update Branding
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                View Audit Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Platform Version</h4>
              <p className="text-sm text-gray-600">PRIME v1.0.0</p>
              <p className="text-sm text-gray-600">Last updated: January 15, 2024</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Deployment</h4>
              <p className="text-sm text-gray-600">Environment: Production</p>
              <p className="text-sm text-gray-600">Region: US-East-1</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Support</h4>
              <p className="text-sm text-gray-600">Documentation: Available</p>
              <p className="text-sm text-gray-600">Support: 24/7</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};