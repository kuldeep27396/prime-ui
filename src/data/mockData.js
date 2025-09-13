export const user = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
}

export const interviews = [
  {
    id: '1',
    title: 'Frontend Developer Interview',
    company: 'TechCorp',
    position: 'Senior Frontend Developer',
    difficulty: 'Medium',
    duration: 45,
    status: 'upcoming',
    questions: 8,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Full Stack Engineer Assessment',
    company: 'StartupXYZ',
    position: 'Full Stack Engineer',
    difficulty: 'Hard',
    duration: 60,
    status: 'completed',
    questions: 12,
    score: 85,
    createdAt: '2024-01-14T14:00:00Z'
  },
  {
    id: '3',
    title: 'React Developer Interview',
    company: 'InnovateLab',
    position: 'React Developer',
    difficulty: 'Easy',
    duration: 30,
    status: 'completed',
    questions: 6,
    score: 92,
    createdAt: '2024-01-13T09:00:00Z'
  }
]

export const questions = [
  {
    id: '1',
    type: 'behavioral',
    question: 'Tell me about a time when you had to work under pressure.',
    timeLimit: 180
  },
  {
    id: '2',
    type: 'technical',
    question: 'Explain the difference between REST and GraphQL.',
    timeLimit: 240
  },
  {
    id: '3',
    type: 'situational',
    question: 'How would you handle a disagreement with a team member?',
    timeLimit: 180
  }
]