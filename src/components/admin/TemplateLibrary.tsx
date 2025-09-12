import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Template {
  id: string;
  company_id?: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  content: Record<string, any>;
  metadata: Record<string, any>;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating?: number;
  version: string;
  parent_template_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

const TEMPLATE_TYPES = [
  { value: 'interview', label: 'Interview Template' },
  { value: 'assessment', label: 'Assessment Template' },
  { value: 'email', label: 'Email Template' },
  { value: 'sms', label: 'SMS Template' }
];

const TEMPLATE_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'cultural', label: 'Cultural Fit' },
  { value: 'general', label: 'General' }
];

export const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [includePublic, setIncludePublic] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'interview',
    category: '',
    content: {},
    is_public: false
  });

  useEffect(() => {
    fetchTemplates();
  }, [selectedType, includePublic]);

  const fetchTemplates = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType) params.append('template_type', selectedType);
      params.append('include_public', includePublic.toString());

      const response = await fetch(`/api/v1/admin/templates?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/v1/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          content: formData.content || getDefaultContent(formData.type)
        })
      });

      if (response.ok) {
        await fetchTemplates();
        setShowCreateForm(false);
        setFormData({
          name: '',
          description: '',
          type: 'interview',
          category: '',
          content: {},
          is_public: false
        });
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleCloneTemplate = async (templateId: string, newName?: string) => {
    try {
      const response = await fetch(`/api/v1/admin/templates/${templateId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ new_name: newName })
      });

      if (response.ok) {
        await fetchTemplates();
      }
    } catch (error) {
      console.error('Error cloning template:', error);
    }
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'interview':
        return {
          questions: [
            {
              id: '1',
              text: 'Tell me about yourself',
              type: 'open_ended',
              time_limit: 120
            }
          ],
          instructions: 'Please answer each question thoughtfully.',
          time_limit: 1800
        };
      case 'assessment':
        return {
          questions: [
            {
              id: '1',
              text: 'Write a function to reverse a string',
              type: 'coding',
              language: 'javascript',
              test_cases: []
            }
          ],
          time_limit: 3600
        };
      case 'email':
        return {
          subject: 'Interview Invitation',
          body: 'Dear {{candidate_name}}, you have been invited to interview for {{job_title}}.',
          variables: ['candidate_name', 'job_title']
        };
      case 'sms':
        return {
          message: 'Hi {{candidate_name}}, your interview is scheduled for {{interview_time}}.',
          variables: ['candidate_name', 'interview_time']
        };
      default:
        return {};
    }
  };

  const renderTemplateContent = (template: Template) => {
    switch (template.type) {
      case 'interview':
        return (
          <div className="text-sm text-gray-600">
            {template.content.questions?.length || 0} questions • 
            {Math.floor((template.content.time_limit || 0) / 60)} minutes
          </div>
        );
      case 'assessment':
        return (
          <div className="text-sm text-gray-600">
            {template.content.questions?.length || 0} questions • 
            {Math.floor((template.content.time_limit || 0) / 60)} minutes
          </div>
        );
      case 'email':
        return (
          <div className="text-sm text-gray-600">
            Subject: {template.content.subject}
          </div>
        );
      case 'sms':
        return (
          <div className="text-sm text-gray-600">
            {template.content.message?.substring(0, 50)}...
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template Library</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 items-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Types</option>
          {TEMPLATE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includePublic}
            onChange={(e) => setIncludePublic(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Include public templates</span>
        </label>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {template.name}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {TEMPLATE_TYPES.find(t => t.value === template.type)?.label}
                    </span>
                    {template.is_public && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                    {template.is_featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  {template.category && (
                    <p className="text-xs text-gray-500">
                      Category: {TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.label}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloneTemplate(template.id)}
                  >
                    Clone
                  </Button>
                  {!template.company_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newName = prompt('Enter name for cloned template:');
                        if (newName) {
                          handleCloneTemplate(template.id, newName);
                        }
                      }}
                    >
                      Use Template
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderTemplateContent(template)}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <span>Used {template.usage_count} times</span>
                <span>v{template.version}</span>
                {template.rating && (
                  <span>★ {template.rating}/5</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Template Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Template description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {TEMPLATE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select category</option>
                    {TEMPLATE_CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Make this template public</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    name: '',
                    description: '',
                    type: 'interview',
                    category: '',
                    content: {},
                    is_public: false
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                disabled={!formData.name}
              >
                Create Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};