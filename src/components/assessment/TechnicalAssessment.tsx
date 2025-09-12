import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import CodeEditor from './CodeEditor';
import WhiteboardCanvas from './WhiteboardCanvas';

interface Question {
  id: string;
  question_type: 'coding' | 'multiple_choice' | 'whiteboard' | 'essay';
  title: string;
  content: string;
  time_limit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  metadata: any;
}

interface TestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  execution_time: number;
  test_results: any[];
}

interface TechnicalAssessmentProps {
  assessmentId: string;
  questions: Question[];
  onSubmit: (responses: any[]) => void;
  timeLimit?: number;
}

const TechnicalAssessment: React.FC<TechnicalAssessmentProps> = ({
  assessmentId,
  questions,
  onSubmit,
  timeLimit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 3600); // Default 1 hour
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult>>({});

  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResponseChange = (questionId: string, response: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const executeCode = async (code: string, language: string) => {
    try {
      const response = await fetch('/api/v1/assessments/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          code,
          programming_language: language
        })
      });

      if (!response.ok) {
        throw new Error('Code execution failed');
      }

      const result = await response.json();
      setExecutionResults(prev => ({
        ...prev,
        [currentQuestion.id]: result
      }));

      return result;
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        success: false,
        error: 'Failed to execute code',
        execution_time: 0,
        test_results: []
      };
    }
  };

  const submitCode = async (code: string, language: string) => {
    try {
      const response = await fetch(`/api/v1/assessments/${assessmentId}/submit-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          code,
          programming_language: language
        })
      });

      if (!response.ok) {
        throw new Error('Code submission failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Code submission error:', error);
      throw error;
    }
  };

  const submitWhiteboard = async (canvasData: string) => {
    try {
      const response = await fetch(`/api/v1/assessments/${assessmentId}/submit-whiteboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          canvas_data: canvasData
        })
      });

      if (!response.ok) {
        throw new Error('Whiteboard submission failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Whiteboard submission error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit all responses
      const submissionPromises = Object.entries(responses).map(async ([questionId, response]) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return null;

        if (question.question_type === 'coding') {
          return await submitCode(response.code, response.language);
        } else if (question.question_type === 'whiteboard') {
          return await submitWhiteboard(response.canvasData);
        }
        // Handle other question types as needed
        return null;
      });

      await Promise.all(submissionPromises);
      onSubmit(Object.values(responses));
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.question_type) {
      case 'coding':
        return (
          <CodingQuestion
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onResponseChange={(response) => handleResponseChange(currentQuestion.id, response)}
            onExecuteCode={executeCode}
            executionResult={executionResults[currentQuestion.id]}
          />
        );
      
      case 'whiteboard':
        return (
          <WhiteboardQuestion
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onResponseChange={(response) => handleResponseChange(currentQuestion.id, response)}
          />
        );
      
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onResponseChange={(response) => handleResponseChange(currentQuestion.id, response)}
          />
        );
      
      case 'essay':
        return (
          <EssayQuestion
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onResponseChange={(response) => handleResponseChange(currentQuestion.id, response)}
          />
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Technical Assessment</h1>
        <div className="flex items-center space-x-4">
          <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentQuestion?.title}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion?.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {currentQuestion?.points} points
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-4">
            <p>{currentQuestion?.content}</p>
          </div>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual question components
const CodingQuestion: React.FC<{
  question: Question;
  response: any;
  onResponseChange: (response: any) => void;
  onExecuteCode: (code: string, language: string) => Promise<ExecutionResult>;
  executionResult?: ExecutionResult;
}> = ({ question, response, onResponseChange, onExecuteCode, executionResult }) => {
  const [code, setCode] = useState(response?.code || question.metadata.starter_code || '');
  const [language, setLanguage] = useState(response?.language || question.metadata.programming_language || 'python');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    onResponseChange({ code, language });
  }, [code, language]);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecuteCode(code, language);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
        </select>
        
        <Button
          onClick={handleExecute}
          disabled={isExecuting}
          variant="outline"
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </Button>
      </div>

      <CodeEditor
        language={language}
        value={code}
        onChange={setCode}
        height="400px"
      />

      {/* Test cases */}
      {question.metadata.test_cases && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Sample Test Cases:</h4>
          <div className="space-y-2">
            {question.metadata.test_cases
              .filter((tc: TestCase) => !tc.is_hidden)
              .map((testCase: TestCase, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm">
                    <strong>Input:</strong> <code>{testCase.input}</code>
                  </div>
                  <div className="text-sm">
                    <strong>Expected Output:</strong> <code>{testCase.expected_output}</code>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Execution results */}
      {executionResult && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Execution Results:</h4>
          <div className={`p-3 rounded ${executionResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm">
              <strong>Status:</strong> {executionResult.success ? 'Success' : 'Failed'}
            </div>
            {executionResult.output && (
              <div className="text-sm">
                <strong>Output:</strong> <code>{executionResult.output}</code>
              </div>
            )}
            {executionResult.error && (
              <div className="text-sm text-red-600">
                <strong>Error:</strong> {executionResult.error}
              </div>
            )}
            <div className="text-sm">
              <strong>Execution Time:</strong> {executionResult.execution_time.toFixed(3)}s
            </div>
            
            {/* Test results */}
            {executionResult.test_results && executionResult.test_results.length > 0 && (
              <div className="mt-2">
                <strong className="text-sm">Test Results:</strong>
                <div className="space-y-1 mt-1">
                  {executionResult.test_results.map((result: any, index: number) => (
                    <div key={index} className={`text-xs p-2 rounded ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                      <div>Test {index + 1}: {result.passed ? '✅ Passed' : '❌ Failed'}</div>
                      {!result.is_hidden && (
                        <>
                          <div>Input: <code>{result.input}</code></div>
                          <div>Expected: <code>{result.expected_output}</code></div>
                          <div>Got: <code>{result.actual_output}</code></div>
                        </>
                      )}
                      {result.error && <div className="text-red-600">Error: {result.error}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const WhiteboardQuestion: React.FC<{
  question: Question;
  response: any;
  onResponseChange: (response: any) => void;
}> = ({ question, response, onResponseChange }) => {
  const handleCanvasChange = (canvasData: string) => {
    onResponseChange({ canvasData });
  };

  return (
    <div>
      <WhiteboardCanvas
        width={question.metadata.canvas_width || 800}
        height={question.metadata.canvas_height || 600}
        onCanvasChange={handleCanvasChange}
        initialData={response?.canvasData}
      />
    </div>
  );
};

const MultipleChoiceQuestion: React.FC<{
  question: Question;
  response: any;
  onResponseChange: (response: any) => void;
}> = ({ question, response, onResponseChange }) => {
  const [selectedOption, setSelectedOption] = useState(response?.selectedOption || -1);

  const handleOptionChange = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    onResponseChange({ selectedOption: optionIndex });
  };

  return (
    <div className="space-y-3">
      {question.metadata.options?.map((option: string, index: number) => (
        <label key={index} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={index}
            checked={selectedOption === index}
            onChange={() => handleOptionChange(index)}
            className="w-4 h-4 text-blue-600"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

const EssayQuestion: React.FC<{
  question: Question;
  response: any;
  onResponseChange: (response: any) => void;
}> = ({ question, response, onResponseChange }) => {
  const [text, setText] = useState(response?.text || '');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onResponseChange({ text: e.target.value });
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Write your answer here..."
        className="w-full h-40 p-3 border border-gray-300 rounded-md resize-vertical"
      />
      <div className="text-sm text-gray-500 mt-2">
        {question.metadata.min_words && `Minimum ${question.metadata.min_words} words. `}
        {question.metadata.max_words && `Maximum ${question.metadata.max_words} words. `}
        Current: {text.split(/\s+/).filter(word => word.length > 0).length} words
      </div>
    </div>
  );
};

export default TechnicalAssessment;