import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechnicalAssessment from '../../components/assessment/TechnicalAssessment';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

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

const TechnicalAssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  // Demo questions for testing
  const demoQuestions: Question[] = [
    {
      id: '1',
      question_type: 'coding',
      title: 'Two Sum Problem',
      content: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      time_limit: 1800, // 30 minutes
      difficulty: 'medium',
      points: 50,
      metadata: {
        programming_language: 'python',
        starter_code: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass

# Test the function
nums = list(map(int, input().split()))
target = int(input())
result = two_sum(nums, target)
print(result[0], result[1])`,
        test_cases: [
          {
            input: '2 7 11 15\n9',
            expected_output: '0 1',
            is_hidden: false
          },
          {
            input: '3 2 4\n6',
            expected_output: '1 2',
            is_hidden: false
          },
          {
            input: '3 3\n6',
            expected_output: '0 1',
            is_hidden: true
          }
        ]
      }
    },
    {
      id: '2',
      question_type: 'coding',
      title: 'Fibonacci Sequence',
      content: 'Write a function to calculate the nth Fibonacci number. The Fibonacci sequence is defined as: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1.',
      time_limit: 900, // 15 minutes
      difficulty: 'easy',
      points: 30,
      metadata: {
        programming_language: 'python',
        starter_code: `def fibonacci(n):
    """
    Calculate the nth Fibonacci number
    """
    # Your code here
    pass

n = int(input())
print(fibonacci(n))`,
        test_cases: [
          {
            input: '0',
            expected_output: '0',
            is_hidden: false
          },
          {
            input: '1',
            expected_output: '1',
            is_hidden: false
          },
          {
            input: '10',
            expected_output: '55',
            is_hidden: false
          },
          {
            input: '15',
            expected_output: '610',
            is_hidden: true
          }
        ]
      }
    },
    {
      id: '3',
      question_type: 'whiteboard',
      title: 'System Design: Design a URL Shortener',
      content: 'Design a URL shortening service like bit.ly. Draw the high-level architecture including the main components, database design, and explain how the system would handle URL shortening and redirection.',
      time_limit: 1200, // 20 minutes
      difficulty: 'hard',
      points: 70,
      metadata: {
        canvas_width: 1000,
        canvas_height: 700
      }
    },
    {
      id: '4',
      question_type: 'multiple_choice',
      title: 'Database Normalization',
      content: 'Which normal form eliminates transitive dependencies?',
      time_limit: 300, // 5 minutes
      difficulty: 'medium',
      points: 20,
      metadata: {
        options: [
          'First Normal Form (1NF)',
          'Second Normal Form (2NF)',
          'Third Normal Form (3NF)',
          'Boyce-Codd Normal Form (BCNF)'
        ],
        correct_answer: 2
      }
    },
    {
      id: '5',
      question_type: 'essay',
      title: 'Explain REST API Design Principles',
      content: 'Explain the key principles of REST API design. Include discussion of HTTP methods, status codes, resource naming conventions, and statelessness.',
      time_limit: 900, // 15 minutes
      difficulty: 'medium',
      points: 40,
      metadata: {
        min_words: 200,
        max_words: 500
      }
    }
  ];

  useEffect(() => {
    // In a real app, fetch questions from API
    // For demo, use hardcoded questions
    setQuestions(demoQuestions);
    setLoading(false);
  }, [assessmentId]);

  const handleSubmit = async (responses: any[]) => {
    try {
      // In a real app, submit to API
      console.log('Assessment responses:', responses);
      
      // Show completion message
      alert('Assessment submitted successfully! You will be redirected to the results page.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit assessment. Please try again.');
    }
  };

  const startAssessment = () => {
    setIsStarted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    const totalTime = questions.reduce((sum, q) => sum + (q.time_limit || 0), 0);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technical Assessment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Assessment Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Questions:</span> {questions.length}
                </div>
                <div>
                  <span className="font-medium">Total Points:</span> {totalPoints}
                </div>
                <div>
                  <span className="font-medium">Estimated Time:</span> {Math.ceil(totalTime / 60)} minutes
                </div>
                <div>
                  <span className="font-medium">Question Types:</span> Coding, Whiteboard, Multiple Choice, Essay
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• For coding questions, you can run your code to test it before submitting</li>
                <li>• Your progress is automatically saved as you work</li>
                <li>• The assessment will auto-submit when time runs out</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• Do not refresh the page or navigate away during the assessment</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Question Breakdown</h3>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">Q{index + 1}: {question.title}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {question.points} points • {Math.ceil((question.time_limit || 0) / 60)} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Once you start, the timer cannot be paused</li>
                <li>• Ensure you have sufficient time to complete the assessment</li>
                <li>• Close other applications to avoid distractions</li>
                <li>• Have a pen and paper ready for planning (especially for coding questions)</li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={startAssessment}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TechnicalAssessment
      assessmentId={assessmentId || 'demo'}
      questions={questions}
      onSubmit={handleSubmit}
      timeLimit={30}
    />
  );
};

export default TechnicalAssessmentPage;