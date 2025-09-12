import React, { useState, useEffect } from 'react';
import { MobileCard, MobileCardContent, MobileCardDescription, MobileCardHeader, MobileCardTitle } from '@/components/ui/mobile-card';
import { TouchButton } from '@/components/ui/touch-button';
import { ResponsiveGrid, MobileStack, MobileContainer } from '@/components/ui/responsive-grid';
import { usePWA } from '@/utils/pwa';
import { 
  Users, 
  Briefcase, 
  Video, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  MessageSquare,
  Search,
  Wifi,
  WifiOff,
  Download,
  Brain,
  Eye,
  Play,
  Code,
  Shield,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [, setIsTablet] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isOnline, isInstallable, installApp } = usePWA();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { name: 'Active Jobs', value: '24', icon: Briefcase, change: '+12%', changeType: 'positive' },
    { name: 'Total Candidates', value: '1,247', icon: Users, change: '+23%', changeType: 'positive' },
    { name: 'Interviews Scheduled', value: '89', icon: Video, change: '+8%', changeType: 'positive' },
    { name: 'AI Screening Rate', value: '94.2%', icon: Brain, change: '+5.1%', changeType: 'positive' },
  ];

  const features = [
    {
      title: 'AI-Powered Chatbot Screening',
      description: 'Intelligent pre-screening with natural language processing',
      icon: MessageSquare,
      status: 'LIVE',
      color: 'bg-blue-500',
      link: '/chatbot'
    },
    {
      title: 'Live AI Interviews',
      description: 'Real-time conversational AI conducting structured interviews',
      icon: Video,
      status: 'LIVE',
      color: 'bg-purple-500',
      link: '/interviews/live-ai'
    },
    {
      title: 'Technical Assessments',
      description: 'Code challenges with real-time execution and AI evaluation',
      icon: Code,
      status: 'LIVE',
      color: 'bg-green-500',
      link: '/assessments/technical'
    },
    {
      title: 'Video Analysis & Proctoring',
      description: 'Computer vision-based integrity monitoring and analysis',
      icon: Eye,
      status: 'LIVE',
      color: 'bg-indigo-500',
      link: '/proctoring'
    },
    {
      title: 'One-Way Video Interviews',
      description: 'Asynchronous video interviews with AI-powered analysis',
      icon: Play,
      status: 'LIVE',
      color: 'bg-pink-500',
      link: '/interviews/one-way'
    },
    {
      title: 'Advanced Analytics',
      description: 'Comprehensive scoring and bias detection algorithms',
      icon: BarChart3,
      status: 'LIVE',
      color: 'bg-gray-500',
      link: '/analytics'
    }
  ];

  const recentActivity = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', time: '2h ago', status: 'completed' },
    { id: 2, name: 'Mike Chen', role: 'Product Manager', time: '4h ago', status: 'screening' },
    { id: 3, name: 'Emily Davis', role: 'UX Designer', time: '6h ago', status: 'pending' },
    { id: 4, name: 'Alex Rodriguez', role: 'Data Scientist', time: '1d ago', status: 'scheduled' },
  ];

  const systemHealth = [
    { name: 'Backend API', status: 'online', value: '99.9% uptime', icon: Shield },
    { name: 'AI Services (Groq)', status: 'ready', value: 'Optimal', icon: Brain },
    { name: 'Database', status: 'connected', value: 'Connected', icon: FileText },
    { name: 'Video Processing', status: 'ready', value: 'Ready', icon: Video }
  ];

  const quickActions = [
    { name: 'AI Chatbot', icon: MessageSquare, href: '/chatbot', color: 'bg-blue-500' },
    { name: 'Live Interview', icon: Video, href: '/interviews/live-ai', color: 'bg-purple-500' },
    { name: 'Assessment', icon: Code, href: '/assessments/technical', color: 'bg-green-500' },
    { name: 'Proctoring', icon: Eye, href: '/proctoring', color: 'bg-indigo-500' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics', color: 'bg-gray-500' },
    { name: 'Settings', icon: Clock, href: '/settings', color: 'bg-orange-500' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'screening': return <Search className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <MobileContainer maxWidth="full" padding={false}>
      <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Hero Header */}
        <div className={`bg-gradient-to-br from-blue-600 to-purple-700 text-white ${isMobile ? 'px-4 py-6' : 'px-6 py-12'}`}>
          <div className="flex flex-col space-y-4">
            {/* Connection Status & PWA Install */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${isOnline ? 'text-green-300' : 'text-red-300'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <span className="text-xs text-white/70">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              
              {isInstallable && (
                <TouchButton
                  size="sm"
                  variant="outline"
                  onClick={installApp}
                  className="flex items-center space-x-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Download className="w-3 h-3" />
                  <span className="text-xs">Install App</span>
                </TouchButton>
              )}
            </div>

            {/* Title and Welcome */}
            <div className="flex items-center space-x-4">
              <div className={`bg-white/20 rounded-2xl flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <Zap className={`text-white ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
              <div>
                <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                  Welcome to PRIME
                </h1>
                <p className={`text-white/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  AI-Powered Recruitment Intelligence
                </p>
              </div>
            </div>

            {/* Quick description */}
            {!isMobile && (
              <p className="text-white/80 text-lg max-w-2xl">
                Your recruitment pipeline is performing exceptionally well. Here's your real-time overview.
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`${isMobile ? 'px-4' : 'px-6'}`}>
          <ResponsiveGrid 
            cols={{ 
              default: isMobile ? 2 : 1, 
              sm: 2, 
              lg: 4 
            }} 
            gap={isMobile ? 3 : 6}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <MobileCard 
                  key={stat.name} 
                  variant={isMobile ? 'compact' : 'default'}
                  touchOptimized
                  className="hover:shadow-lg transition-shadow"
                >
                  <MobileCardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {isMobile ? stat.name.split(' ')[0] : stat.name}
                        </p>
                        <p className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`bg-blue-50 rounded-full ${isMobile ? 'p-2' : 'p-3'}`}>
                        <Icon className={`text-blue-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                      </div>
                    </div>
                    <div className={`flex items-center ${isMobile ? 'mt-2' : 'mt-4'}`}>
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className={`font-medium text-green-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {stat.change}
                      </span>
                      <span className={`text-gray-500 ml-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {isMobile ? 'vs last month' : 'from last month'}
                      </span>
                    </div>
                  </MobileCardContent>
                </MobileCard>
              );
            })}
          </ResponsiveGrid>
        </div>

        {/* Quick Actions - Mobile Only */}
        {isMobile && (
          <div className="px-4">
            <MobileCard variant="compact">
              <MobileCardHeader variant="compact">
                <MobileCardTitle size="sm">Quick Actions</MobileCardTitle>
              </MobileCardHeader>
              <MobileCardContent>
                <ResponsiveGrid cols={{ default: 3 }} gap={3}>
                  {quickActions.slice(0, 6).map((action) => {
                    const Icon = action.icon;
                    return (
                      <TouchButton
                        key={action.name}
                        variant="outline"
                        size="xl"
                        className="h-16 flex flex-col items-center space-y-1"
                        hapticFeedback
                        onClick={() => window.location.href = action.href}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{action.name.split(' ')[0]}</span>
                      </TouchButton>
                    );
                  })}
                </ResponsiveGrid>
              </MobileCardContent>
            </MobileCard>
          </div>
        )}

        {/* Main Content Grid */}
        <div className={`${isMobile ? 'px-4' : 'px-6'}`}>
          <ResponsiveGrid 
            cols={{ 
              default: 1, 
              lg: 2 
            }} 
            gap={isMobile ? 4 : 6}
          >
            {/* AI Features */}
            <MobileCard variant={isMobile ? 'compact' : 'default'}>
              <MobileCardHeader variant={isMobile ? 'compact' : 'default'}>
                <MobileCardTitle size={isMobile ? 'sm' : 'md'} className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI-Powered Features</span>
                </MobileCardTitle>
                {!isMobile && (
                  <MobileCardDescription>All systems live and ready for use</MobileCardDescription>
                )}
              </MobileCardHeader>
              <MobileCardContent>
                <ResponsiveGrid 
                  cols={{ default: 1, md: isMobile ? 1 : 2 }} 
                  gap={isMobile ? 3 : 4}
                >
                  {features.slice(0, isMobile ? 4 : 6).map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={feature.title}
                        className={`border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer ${
                          isMobile ? 'p-3' : 'p-4'
                        }`}
                        onClick={() => window.location.href = feature.link}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`${feature.color} rounded-lg flex items-center justify-center ${
                            isMobile ? 'w-8 h-8' : 'w-10 h-10'
                          }`}>
                            <Icon className={`text-white ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                                {isMobile ? feature.title.split(' ').slice(0, 2).join(' ') : feature.title}
                              </h4>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                {feature.status}
                              </span>
                            </div>
                            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {isMobile ? feature.description.split('.')[0] : feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ResponsiveGrid>
              </MobileCardContent>
            </MobileCard>

            {/* Recent Activity */}
            <MobileCard variant={isMobile ? 'compact' : 'default'}>
              <MobileCardHeader variant={isMobile ? 'compact' : 'default'}>
                <MobileCardTitle size={isMobile ? 'sm' : 'md'} className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Live Activity</span>
                </MobileCardTitle>
                {!isMobile && (
                  <MobileCardDescription>Real-time updates from your pipeline</MobileCardDescription>
                )}
              </MobileCardHeader>
              <MobileCardContent>
                <MobileStack spacing={isMobile ? 3 : 4}>
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className={`flex items-center space-x-4 rounded-lg hover:bg-gray-50 transition-colors ${
                        isMobile ? 'p-2' : 'p-3'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-sm'}`}>
                          {activity.name}
                        </p>
                        <p className={`text-gray-500 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {isMobile ? activity.role.split(' ')[0] : activity.role}
                        </p>
                      </div>
                      <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </MobileStack>
                <div className={`pt-4 border-t ${isMobile ? 'mt-3' : 'mt-4'}`}>
                  <TouchButton variant="ghost" className="w-full" size={isMobile ? 'default' : 'default'}>
                    View All Activity
                  </TouchButton>
                </div>
              </MobileCardContent>
            </MobileCard>
          </ResponsiveGrid>
        </div>

        {/* System Health & Desktop Quick Actions */}
        <div className={`${isMobile ? 'px-4' : 'px-6'}`}>
          <ResponsiveGrid 
            cols={{ 
              default: 1, 
              lg: 2 
            }} 
            gap={isMobile ? 4 : 6}
          >
            {/* System Health */}
            <MobileCard variant={isMobile ? 'compact' : 'default'}>
              <MobileCardHeader variant={isMobile ? 'compact' : 'default'}>
                <MobileCardTitle size={isMobile ? 'sm' : 'md'} className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>System Health</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Excellent
                  </span>
                </MobileCardTitle>
                {!isMobile && (
                  <MobileCardDescription>All services running optimally</MobileCardDescription>
                )}
              </MobileCardHeader>
              <MobileCardContent>
                <MobileStack spacing={isMobile ? 2 : 3}>
                  {systemHealth.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div 
                        key={index}
                        className={`flex items-center justify-between rounded-lg bg-gray-50 ${
                          isMobile ? 'p-3' : 'p-4'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {isMobile ? service.name.split(' ')[0] : service.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium text-green-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {service.value}
                          </span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    );
                  })}
                </MobileStack>
              </MobileCardContent>
            </MobileCard>

            {/* Desktop Quick Actions */}
            {!isMobile && (
              <MobileCard>
                <MobileCardHeader>
                  <MobileCardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </MobileCardTitle>
                  <MobileCardDescription>Launch AI features instantly</MobileCardDescription>
                </MobileCardHeader>
                <MobileCardContent>
                  <ResponsiveGrid cols={{ default: 2 }} gap={4}>
                    {quickActions.slice(0, 4).map((action) => {
                      const Icon = action.icon;
                      return (
                        <TouchButton 
                          key={action.name}
                          variant="outline" 
                          className={`h-20 flex flex-col items-center space-y-2 ${action.color} text-white border-none hover:opacity-90`}
                          onClick={() => window.location.href = action.href}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{action.name}</span>
                        </TouchButton>
                      );
                    })}
                  </ResponsiveGrid>
                  <div className="mt-4 pt-4 border-t">
                    <TouchButton 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                    >
                      📚 View API Documentation →
                    </TouchButton>
                  </div>
                </MobileCardContent>
              </MobileCard>
            )}
          </ResponsiveGrid>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Dashboard;