export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  title: string;
  position: string;
  company: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questions: Question[];
  createdAt: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Question {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  expectedAnswer?: string;
  timeLimit: number; // in seconds
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewSession {
  id: string;
  interviewId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  currentQuestionIndex: number;
  answers: Answer[];
  score?: number;
  feedback?: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  timeSpent: number; // in seconds
  score?: number;
  feedback?: string;
}