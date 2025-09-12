import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Video, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  Plus,
  Filter
} from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const location = useLocation();

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortName: 'Home' },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, shortName: 'Jobs' },
    { name: 'Candidates', href: '/candidates', icon: Users, shortName: 'People' },
    { name: 'Interviews', href: '/interviews', icon: Video, shortName: 'Video' },
    { name: 'Assessments', href: '/assessments', icon: FileText, shortName: 'Tests' },
    { name: 'Chatbot', href: '/chatbot', icon: MessageSquare, shortName: 'Chat' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, shortName: 'Stats' },
    { name: 'Settings', href: '/settings', icon: Settings, shortName: 'Config' },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && isMobile) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity" />
      )}

      {/* Desktop/Tablet Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMobile 
          ? `w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : isTablet 
            ? 'w-20 hover:w-64 group'
            : 'w-64'
      }`} id="mobile-sidebar">
        
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between border-b border-gray-200 ${
          isMobile ? 'h-16 px-6' : isTablet ? 'h-16 px-4 group-hover:px-6' : 'h-16 px-6'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className={`${isTablet ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''} ${isMobile ? '' : isTablet ? 'hidden group-hover:block' : ''}`}>
              <h1 className="text-xl font-bold text-gray-900">PRIME</h1>
              <p className="text-xs text-gray-500">AI Recruitment</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 touch:p-3"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`mt-6 ${isMobile ? 'px-3' : isTablet ? 'px-2 group-hover:px-3' : 'px-3'}`}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group/item flex items-center rounded-lg transition-all duration-200 touch:py-4 ${
                    isMobile 
                      ? 'px-3 py-2 text-sm font-medium'
                      : isTablet 
                        ? 'px-3 py-2 text-sm font-medium justify-center group-hover:justify-start'
                        : 'px-3 py-2 text-sm font-medium'
                  } ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  title={isTablet ? item.name : undefined}
                >
                  <Icon className={`flex-shrink-0 ${
                    isMobile 
                      ? 'mr-3 h-5 w-5'
                      : isTablet 
                        ? 'h-5 w-5 group-hover:mr-3'
                        : 'mr-3 h-5 w-5'
                  } ${
                    active ? 'text-blue-700' : 'text-gray-400 group-hover/item:text-gray-500'
                  }`} />
                  <span className={`${
                    isTablet ? 'opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block' : ''
                  }`}>
                    {isMobile ? item.shortName : item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Status indicator - Hidden on mobile, compact on tablet */}
        {!isMobile && (
          <div className={`absolute bottom-6 ${isTablet ? 'left-2 right-2 group-hover:left-3 group-hover:right-3' : 'left-3 right-3'}`}>
            <div className={`bg-green-50 border border-green-200 rounded-lg transition-all ${
              isTablet ? 'p-2 group-hover:p-3' : 'p-3'
            }`}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                <span className={`text-xs text-green-700 font-medium ${
                  isTablet ? 'opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block' : ''
                }`}>
                  All Systems Online
                </span>
              </div>
              {!isTablet && (
                <p className="text-xs text-green-600 mt-1">Backend & AI Services Ready</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`${isMobile ? '' : isTablet ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className={`flex items-center justify-between ${isMobile ? 'h-14 px-4' : 'h-16 px-6'}`}>
            <div className="flex items-center flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`${isMobile ? 'lg:hidden' : 'lg:hidden'} p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch:p-3`}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Mobile search button */}
              {isMobile && (
                <button className="ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch:p-3">
                  <Search className="w-5 h-5" />
                </button>
              )}
              
              {/* Desktop/Tablet search bar */}
              {!isMobile && (
                <div className="ml-4 flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={isTablet ? "Search..." : "Search candidates, jobs, interviews..."}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Quick actions for mobile */}
              {isMobile && (
                <>
                  <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg touch:p-3">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg touch:p-3">
                    <Filter className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Notifications */}
              <button className={`p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative ${isMobile ? 'touch:p-3' : ''}`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${isMobile ? 'touch:p-3' : ''}`}>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  {!isMobile && (
                    <>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Demo User</p>
                        <p className="text-xs text-gray-500">Recruiter</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'}`}>
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex justify-around py-2">
              {navigation.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                      active
                        ? 'text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{item.shortName}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {/* Add bottom padding on mobile to account for bottom navigation */}
      {isMobile && <div className="h-20" />}
    </div>
  );
};

export default Layout;