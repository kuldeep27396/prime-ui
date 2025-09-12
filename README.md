# PRIME UI

The frontend application for PRIME - Predictive Recruitment & Interview Machine. This is a modern React-based web application that provides the user interface for the AI-powered recruitment platform.

## 🚀 Features

- **Modern React 18** with TypeScript and Vite
- **Real-time Communication**: WebSocket integration for live interviews
- **Video Interviews**: One-way and AI-conducted live interviews
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Component Library**: Radix UI primitives with custom styling
- **State Management**: Zustand for global state management
- **Form Handling**: React Hook Form with Zod validation
- **PWA Support**: Progressive Web App capabilities

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with React Query
- **Video**: WebRTC with PeerJS
- **Real-time**: Socket.IO client

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone and setup**:
```bash
git clone <repository-url>
cd prime-ui
```

2. **Install dependencies**:
```bash
npm install
```

3. **Setup environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open browser**: http://localhost:3000

## 📝 Environment Variables

Create `.env.local` file:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# WebSocket URL
VITE_WS_URL=ws://localhost:8000

# File Upload
VITE_MAX_FILE_SIZE=10485760

# Video Services
VITE_DAILY_DOMAIN=your-daily-domain

# Feature Flags
VITE_ENABLE_PWA=true
```

## 🏗️ Build and Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Linting and Formatting
```bash
npm run lint
npm run format
```

### Testing
```bash
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables in Vercel dashboard
5. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to your preferred hosting platform
```

## 📦 Project Structure

```
prime-ui/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and external services
│   ├── stores/         # Zustand stores
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── public/             # Static assets
├── dist/              # Build output
├── index.html         # HTML template
└── vite.config.ts     # Vite configuration
```

## 🎨 UI Components

The application uses a component library built on top of Radix UI:

- **Form Components**: Input, Select, Textarea, Checkbox, etc.
- **Navigation**: Header, Sidebar, Breadcrumbs
- **Feedback**: Toast notifications, Loading states, Error boundaries
- **Layout**: Grid, Flex, Container components
- **Interactive**: Modals, Dropdowns, Tooltips

## 📱 PWA Features

- **Offline Support**: Service worker for offline functionality
- **Install Prompt**: Add to home screen capability
- **Push Notifications**: Real-time notifications (optional)
- **Responsive**: Works on desktop, tablet, and mobile

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🎯 Performance

- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: WebP and lazy loading
- **Caching**: Aggressive caching strategies
- **Lighthouse Score**: 90+ on all metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.