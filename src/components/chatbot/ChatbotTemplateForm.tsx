import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface QuestionConfig {
  id: string;
  type: 'open_ended' | 'multiple_choice' | 'rating' | 'yes_no';
  text: string;
  options?: string[];
  required: boolean;
  evaluation_criteria?: Record<string, any>;
}

interface ChatbotSettings {
  personality: 'professional' | 'friendly' | 'casual';
  response_time_limit: number;
  max_retries: number;
  language: string;
  enable_follow_ups: boolean;
}

interface ChatbotTemplateFormProps {
  onSubmit: (template: {
    name: string;
    description: string;
    question_flow: QuestionConfig[];
    settings: ChatbotSettings;
  }) => void;
  initialData?: any;
}

export const ChatbotTemplateForm: React.FC<ChatbotTemplateFormProps> = ({
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [questions, setQuestions] = useState<QuestionConfig[]>(
    initialData?.question_flow || [
      {
        id: 'q1',
        type: 'open_ended',
        text: 'Tell me about your relevant experience for this role.',
        required: true,
        evaluation_criteria: { keywords: ['experience', 'skills', 'background'] }
      }
    ]
  );
  const [settings, setSettings] = useState<ChatbotSettings>(
    initialData?.settings || {
      personality: 'professional',
      response_time_limit: 300,
      max_retries: 3,
      language: 'en',
      enable_follow_ups: true
    }
  );

  const addQuestion = () => {
    const newQuestion: QuestionConfig = {
      id: `q${questions.length + 1}`,
      type: 'open_ended',
      text: '',
      required: true
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof QuestionConfig, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      question_flow: questions,
      settings
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Chatbot Pre-screening Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Software Engineer Pre-screening"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template's purpose"
                />
              </div>
            </div>

            {/* Chatbot Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chatbot Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Personality</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.personality}
                    onChange={(e) => setSettings({
                      ...settings,
                      personality: e.target.value as ChatbotSettings['personality']
                    })}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Response Time Limit (seconds)</label>
                  <Input
                    type="number"
                    value={settings.response_time_limit}
                    onChange={(e) => setSettings({
                      ...settings,
                      response_time_limit: parseInt(e.target.value)
                    })}
                    min={60}
                    max={600}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable_follow_ups"
                  checked={settings.enable_follow_ups}
                  onChange={(e) => setSettings({
                    ...settings,
                    enable_follow_ups: e.target.checked
                  })}
                />
                <label htmlFor="enable_follow_ups" className="text-sm font-medium">
                  Enable AI-generated follow-up questions
                </label>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pre-screening Questions</h3>
                <Button type="button" onClick={addQuestion} variant="outline">
                  Add Question
                </Button>
              </div>

              {questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Question Type</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={question.type}
                          onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                        >
                          <option value="open_ended">Open Ended</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="rating">Rating Scale</option>
                          <option value="yes_no">Yes/No</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`required_${index}`}
                          checked={question.required}
                          onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                        />
                        <label htmlFor={`required_${index}`} className="text-sm font-medium">
                          Required
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                        value={question.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Options (one per line)</label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                          value={question.options?.join('\n') || ''}
                          onChange={(e) => updateQuestion(
                            index,
                            'options',
                            e.target.value.split('\n').filter(opt => opt.trim())
                          )}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Create Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};