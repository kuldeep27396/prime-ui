import { Interview, Question, User, InterviewSession } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  createdAt: '2024-01-01T00:00:00Z'
};

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'behavioral',
    question: 'Tell me about a time when you had to work under pressure to meet a tight deadline.',
    timeLimit: 180,
    difficulty: 'Medium'
  },
  {
    id: '2',
    type: 'technical',
    question: 'Explain the difference between REST and GraphQL APIs and when you would use each.',
    timeLimit: 240,
    difficulty: 'Hard'
  },
  {
    id: '3',
    type: 'situational',
    question: 'How would you handle a situation where you disagree with your manager\'s technical decision?',
    timeLimit: 180,
    difficulty: 'Medium'
  },
  {
    id: '4',
    type: 'behavioral',
    question: 'Describe a project you\'re most proud of and what made it successful.',
    timeLimit: 200,
    difficulty: 'Easy'
  },
  {
    id: '5',
    type: 'technical',
    question: 'Walk me through how you would optimize a slow-loading web application.',
    timeLimit: 300,
    difficulty: 'Hard'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer Interview',
    position: 'Senior Frontend Developer',
    company: 'TechCorp',
    difficulty: 'Hard',
    duration: 45,
    questions: mockQuestions.slice(0, 3),
    createdAt: '2024-01-15T10:00:00Z',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Full Stack Engineer Assessment',
    position: 'Full Stack Engineer',
    company: 'InnovateIO',
    difficulty: 'Medium',
    duration: 30,
    questions: mockQuestions.slice(1, 4),
    createdAt: '2024-01-14T14:00:00Z',
    status: 'completed'
  },
  {
    id: '3',
    title: 'React Developer Interview',
    position: 'React Developer',
    company: 'StartupXYZ',
    difficulty: 'Medium',
    duration: 35,
    questions: mockQuestions.slice(0, 4),
    createdAt: '2024-01-13T09:00:00Z',
    status: 'completed'
  }
];

export const mockInterviewSessions: InterviewSession[] = [
  {
    id: '1',
    interviewId: '2',
    userId: '1',
    startedAt: '2024-01-14T14:00:00Z',
    endedAt: '2024-01-14T14:30:00Z',
    currentQuestionIndex: 3,
    answers: [
      {
        questionId: '2',
        answer: 'REST is a stateless architectural style that uses HTTP methods, while GraphQL is a query language that allows clients to request specific data...',
        timeSpent: 240,
        score: 8.5,
        feedback: 'Good technical explanation with clear examples.'
      }
    ],
    score: 8.2,
    feedback: 'Strong technical knowledge demonstrated. Good communication skills.'
  }
];