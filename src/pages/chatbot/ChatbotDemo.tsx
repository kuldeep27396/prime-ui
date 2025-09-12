import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatbotTemplateForm } from '@/components/chatbot/ChatbotTemplateForm';

const ChatbotDemo: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  const handleTemplateSubmit = (template: any) => {
    console.log('Template created:', template);
    setTemplates([...templates, { ...template, id: Date.now() }]);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chatbot Pre-screening Demo
        </h1>
        <p className="text-gray-600">
          Test the AI-powered chatbot template creation system
        </p>
      </div>

      {!showForm ? (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={() => setShowForm(true)}>
              Create New Template
            </Button>
            <Button variant="outline">
              Test API Connection
            </Button>
          </div>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle>Created Templates ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No templates created yet. Click "Create New Template" to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {templates.map((template, index) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.question_flow.length} questions • {template.settings.personality} personality
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backend Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>API Server</span>
                    <span className="text-green-600">✓ Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-green-600">✓ Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chatbot Tables</span>
                    <span className="text-green-600">✓ Created</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>✓ Template Creation</div>
                  <div>✓ Question Flow Configuration</div>
                  <div>✓ AI Response Evaluation</div>
                  <div>✓ Pre-screening Reports</div>
                  <div>✓ Session Management</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              ← Back to Dashboard
            </Button>
          </div>
          <ChatbotTemplateForm onSubmit={handleTemplateSubmit} />
        </div>
      )}
    </div>
  );
};

export default ChatbotDemo;