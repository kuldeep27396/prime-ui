import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Question {
  id: string;
  type: string;
  category: string;
  content: string;
  expected_duration?: number;
  difficulty: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface InterviewTemplate {
  name: string;
  description?: string;
  type: string;
  questions: Question[];
  settings: Record<string, any>;
}

const InterviewTemplateForm: React.FC = () => {
  const [template, setTemplate] = useState<InterviewTemplate>({
    name: '',
    description: '',
    type: 'technical',
    questions: [],
    settings: {}
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    type: 'technical',
    category: 'coding',
    content: '',
    expected_duration: 300,
    difficulty: 'medium',
    tags: [],
    metadata: {}
  });

  const addQuestion = () => {
    if (currentQuestion.content.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: `q${template.questions.length + 1}`,
        tags: currentQuestion.tags.filter(tag => tag.trim() !== '')
      };
      
      setTemplate(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));

      // Reset current question
      setCurrentQuestion({
        id: '',
        type: 'technical',
        category: 'coding',
        content: '',
        expected_duration: 300,
        difficulty: 'medium',
        tags: [],
        metadata: {}
      });
    }
  };

  const removeQuestion = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim());
    setCurrentQuestion(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // This would normally make an API call to create the template
      console.log('Creating interview template:', template);
      
      // Mock API call
      const response = await fetch('/api/v1/interviews/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, you'd include the auth token here
        },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        alert('Interview template created successfully!');
        // Reset form
        setTemplate({
          name: '',
          description: '',
          type: 'technical',
          questions: [],
          settings: {}
        });
      } else {
        alert('Failed to create interview template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Error creating interview template');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Interview Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Template Name *
                </label>
                <Input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer Interview"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Interview Type
                </label>
                <select
                  value={template.type}
                  onChange={(e) => setTemplate(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="technical">Technical</option>
                  <option value="one_way">One-way Video</option>
                  <option value="live_ai">Live AI Interview</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and focus of this interview template"
                className="w-full p-2 border border-gray-300 rounded-md h-20"
              />
            </div>

            {/* Question Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Question Type
                    </label>
                    <select
                      value={currentQuestion.type}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="cultural">Cultural Fit</option>
                      <option value="situational">Situational</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={currentQuestion.category}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="coding">Coding</option>
                      <option value="system_design">System Design</option>
                      <option value="algorithms">Algorithms</option>
                      <option value="leadership">Leadership</option>
                      <option value="communication">Communication</option>
                      <option value="problem_solving">Problem Solving</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={currentQuestion.difficulty}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Question Content *
                  </label>
                  <textarea
                    value={currentQuestion.content}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter the interview question..."
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Duration (seconds)
                    </label>
                    <Input
                      type="number"
                      value={currentQuestion.expected_duration}
                      onChange={(e) => setCurrentQuestion(prev => ({ 
                        ...prev, 
                        expected_duration: parseInt(e.target.value) || 300 
                      }))}
                      min="60"
                      max="3600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags (comma-separated)
                    </label>
                    <Input
                      type="text"
                      value={currentQuestion.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="e.g., python, algorithms, data structures"
                    />
                  </div>
                </div>

                <Button type="button" onClick={addQuestion} className="w-full">
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            {template.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions ({template.questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {template.questions.map((question, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-blue-600">
                                {question.type}
                              </span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-600">
                                {question.category}
                              </span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className={`text-sm font-medium ${
                                question.difficulty === 'easy' ? 'text-green-600' :
                                question.difficulty === 'medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {question.difficulty}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-2">{question.content}</p>
                            {question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {question.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="px-8"
                disabled={!template.name.trim() || template.questions.length === 0}
              >
                Create Interview Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewTemplateForm;