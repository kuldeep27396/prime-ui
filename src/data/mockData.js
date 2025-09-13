export const user = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  role: 'Software Engineer',
  experience: '3 years',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
}

export const companies = [
  { name: 'Google', logo: '🌐', industry: 'Technology' },
  { name: 'Apple', logo: '🍎', industry: 'Technology' },
  { name: 'Microsoft', logo: '🪟', industry: 'Technology' },
  { name: 'Netflix', logo: '🎬', industry: 'Streaming' },
  { name: 'Meta', logo: '📘', industry: 'Social Media' },
  { name: 'Amazon', logo: '📦', industry: 'E-commerce' },
  { name: 'Tesla', logo: '⚡', industry: 'Automotive' },
  { name: 'Stripe', logo: '💳', industry: 'Fintech' }
]

export const technicalTopics = [
  'System Design',
  'Data Structures & Algorithms',
  'JavaScript & Frontend',
  'Python & Backend',
  'Java & Spring Boot',
  'React & Modern Frontend',
  'Node.js & Express',
  'Database Design & SQL',
  'Cloud Architecture (AWS/GCP/Azure)',
  'DevOps & CI/CD',
  'API Design & REST',
  'Security & Authentication',
  'Machine Learning',
  'Mobile Development',
  'Microservices Architecture',
  'Performance Optimization',
  'Testing Strategies',
  'Networking Fundamentals',
  'Docker & Kubernetes',
  'Version Control & Git'
]

export const interviews = [
  {
    id: '1',
    title: 'Senior Software Engineer - Full Stack',
    company: 'Google',
    position: 'Senior Software Engineer',
    level: 'Senior',
    difficulty: 'Hard',
    duration: 90,
    status: 'upcoming',
    topics: ['System Design', 'JavaScript', 'Python', 'Cloud Architecture'],
    questions: 12,
    scheduledAt: '2024-01-20T14:00:00Z',
    description: 'Focus on scalable web applications and distributed systems'
  },
  {
    id: '2',
    title: 'Frontend Engineer - React Specialist',
    company: 'Meta',
    position: 'Frontend Engineer',
    level: 'Mid',
    difficulty: 'Medium',
    duration: 75,
    status: 'completed',
    topics: ['React', 'JavaScript', 'CSS', 'Performance'],
    questions: 10,
    score: 88,
    completedAt: '2024-01-15T16:30:00Z',
    feedback: 'Strong React skills and good understanding of modern frontend practices.'
  },
  {
    id: '3',
    title: 'Backend Engineer - API Development',
    company: 'Stripe',
    position: 'Backend Engineer',
    level: 'Mid',
    difficulty: 'Medium',
    duration: 60,
    status: 'completed',
    topics: ['Python', 'API Design', 'Databases', 'Security'],
    questions: 8,
    score: 92,
    completedAt: '2024-01-12T10:00:00Z',
    feedback: 'Excellent API design skills and strong security knowledge.'
  },
  {
    id: '4',
    title: 'Mobile Engineer - iOS/Android',
    company: 'Apple',
    position: 'Mobile Engineer',
    level: 'Senior',
    difficulty: 'Hard',
    duration: 90,
    status: 'upcoming',
    topics: ['Swift', 'Kotlin', 'Mobile Architecture', 'Performance'],
    questions: 15,
    scheduledAt: '2024-01-25T10:00:00Z',
    description: 'Cross-platform mobile development and native performance optimization'
  }
]

export const questions = [
  {
    id: '1',
    category: 'System Design',
    type: 'design',
    difficulty: 'Hard',
    question: 'Design a URL shortener like bit.ly that can handle 100 million URLs per day.',
    timeLimit: 900,
    followUp: 'How would you handle analytics and rate limiting?'
  },
  {
    id: '2',
    category: 'Data Structures & Algorithms',
    type: 'coding',
    difficulty: 'Medium',
    question: 'Given two sorted arrays, merge them into a single sorted array.',
    timeLimit: 450,
    followUp: 'What is the time and space complexity of your solution?'
  },
  {
    id: '3',
    category: 'JavaScript',
    type: 'coding',
    difficulty: 'Easy',
    question: 'Explain the difference between var, let, and const in JavaScript.',
    timeLimit: 300,
    followUp: 'Can you show examples of hoisting behavior?'
  },
  {
    id: '4',
    category: 'React',
    type: 'technical',
    difficulty: 'Medium',
    question: 'Explain the React component lifecycle and hooks. When would you use useEffect?',
    timeLimit: 420,
    followUp: 'How would you optimize a React app for performance?'
  },
  {
    id: '5',
    category: 'Backend Development',
    type: 'technical',
    difficulty: 'Medium',
    question: 'Design a REST API for a social media platform. Include authentication.',
    timeLimit: 600,
    followUp: 'How would you implement rate limiting and caching?'
  },
  {
    id: '6',
    category: 'Database Design',
    type: 'technical',
    difficulty: 'Medium',
    question: 'Design a database schema for an e-commerce platform with products, users, and orders.',
    timeLimit: 540,
    followUp: 'How would you handle inventory management and concurrent orders?'
  },
  {
    id: '7',
    category: 'Problem Solving',
    type: 'behavioral',
    difficulty: 'Medium',
    question: 'Describe a challenging technical problem you solved and your approach.',
    timeLimit: 300,
    followUp: 'What would you do differently if you faced a similar problem again?'
  }
]

export const skillAssessments = [
  {
    id: '1',
    skill: 'JavaScript & TypeScript',
    score: 85,
    level: 'Advanced',
    lastTested: '2024-01-10',
    badge: '🟨'
  },
  {
    id: '2',
    skill: 'React & Frontend',
    score: 78,
    level: 'Intermediate',
    lastTested: '2024-01-08',
    badge: '⚛️'
  },
  {
    id: '3',
    skill: 'Python & Backend',
    score: 92,
    level: 'Expert',
    lastTested: '2024-01-12',
    badge: '🐍'
  },
  {
    id: '4',
    skill: 'System Design',
    score: 73,
    level: 'Intermediate',
    lastTested: '2024-01-05',
    badge: '🏗️'
  },
  {
    id: '5',
    skill: 'Data Structures & Algorithms',
    score: 88,
    level: 'Advanced',
    lastTested: '2024-01-14',
    badge: '🧠'
  },
  {
    id: '6',
    skill: 'Cloud & DevOps',
    score: 67,
    level: 'Intermediate',
    lastTested: '2024-01-07',
    badge: '☁️'
  }
]

export const learningResources = [
  {
    id: '1',
    title: 'System Design Interview Masterclass',
    type: 'Course',
    duration: '8 hours',
    difficulty: 'Advanced',
    provider: 'Tech Interview Pro',
    topics: ['Scalability', 'Load Balancing', 'Database Design']
  },
  {
    id: '2',
    title: 'JavaScript ES6+ Deep Dive',
    type: 'Tutorial',
    duration: '4 hours',
    difficulty: 'Intermediate',
    provider: 'FreeCodeCamp',
    topics: ['Modern Syntax', 'Async/Await', 'Modules']
  },
  {
    id: '3',
    title: 'React Best Practices & Patterns',
    type: 'Course',
    duration: '6 hours',
    difficulty: 'Intermediate',
    provider: 'React Training',
    topics: ['Hooks', 'State Management', 'Performance']
  },
  {
    id: '4',
    title: 'Algorithm & Data Structure Fundamentals',
    type: 'Article',
    duration: '2 hours',
    difficulty: 'Beginner',
    provider: 'LeetCode',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs']
  },
  {
    id: '5',
    title: 'Backend API Development with Node.js',
    type: 'Tutorial',
    duration: '5 hours',
    difficulty: 'Intermediate',
    provider: 'YouTube',
    topics: ['REST APIs', 'Authentication', 'Database Integration']
  }
]