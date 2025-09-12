import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

interface Permission {
  name: string;
  description: string;
  category: string;
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  { name: 'job:create', description: 'Create jobs', category: 'Job Management' },
  { name: 'job:read', description: 'View jobs', category: 'Job Management' },
  { name: 'job:update', description: 'Update jobs', category: 'Job Management' },
  { name: 'job:delete', description: 'Delete jobs', category: 'Job Management' },
  { name: 'candidate:create', description: 'Create candidates', category: 'Candidate Management' },
  { name: 'candidate:read', description: 'View candidates', category: 'Candidate Management' },
  { name: 'candidate:update', description: 'Update candidates', category: 'Candidate Management' },
  { name: 'candidate:delete', description: 'Delete candidates', category: 'Candidate Management' },
  { name: 'candidate:export', description: 'Export candidate data', category: 'Candidate Management' },
  { name: 'interview:create', description: 'Create interviews', category: 'Interview Management' },
  { name: 'interview:read', description: 'View interviews', category: 'Interview Management' },
  { name: 'interview:update', description: 'Update interviews', category: 'Interview Management' },
  { name: 'interview:delete', description: 'Delete interviews', category: 'Interview Management' },
  { name: 'interview:conduct', description: 'Conduct interviews', category: 'Interview Management' },
  { name: 'assessment:create', description: 'Create assessments', category: 'Assessment Management' },
  { name: 'assessment:read', description: 'View assessments', category: 'Assessment Management' },
  { name: 'assessment:update', description: 'Update assessments', category: 'Assessment Management' },
  { name: 'assessment:delete', description: 'Delete assessments', category: 'Assessment Management' },
  { name: 'assessment:grade', description: 'Grade assessments', category: 'Assessment Management' },
  { name: 'analytics:view', description: 'View analytics', category: 'Analytics' },
  { name: 'analytics:export', description: 'Export analytics', category: 'Analytics' },
  { name: 'reports:generate', description: 'Generate reports', category: 'Analytics' },
  { name: 'admin:users', description: 'Manage users', category: 'Administration' },
  { name: 'admin:settings', description: 'Manage settings', category: 'Administration' },
  { name: 'admin:integrations', description: 'Manage integrations', category: 'Administration' },
  { name: 'admin:templates', description: 'Manage templates', category: 'Administration' },
  { name: 'admin:branding', description: 'Manage branding', category: 'Administration' },
  { name: 'system:audit', description: 'View audit logs', category: 'System' },
  { name: 'system:backup', description: 'Manage backups', category: 'System' }
];

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/v1/admin/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const response = await fetch('/api/v1/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchRoles();
        setShowCreateForm(false);
        setFormData({ name: '', description: '', permissions: [] });
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      const response = await fetch(`/api/v1/admin/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchRoles();
        setEditingRole(null);
        setFormData({ name: '', description: '', permissions: [] });
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const startEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
  };

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return <div className="flex justify-center p-8">Loading roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Role
        </Button>
      </div>

      {/* Roles List */}
      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {role.name}
                    {role.is_system_role && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        System Role
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                {!role.is_system_role && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(role)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Role description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <label key={permission.name} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.name)}
                              onChange={() => handlePermissionToggle(permission.name)}
                              className="rounded"
                            />
                            <span className="text-sm">
                              {permission.description}
                              <span className="text-xs text-gray-500 block">
                                {permission.name}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingRole(null);
                  setFormData({ name: '', description: '', permissions: [] });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                disabled={!formData.name || formData.permissions.length === 0}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};