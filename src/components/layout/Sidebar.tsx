import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Video, 
  FileText, 
  BarChart3,
  Settings 
} from 'lucide-react'
import { cn } from '@/utils/helpers'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Interviews', href: '/interviews', icon: Video },
  { name: 'Assessments', href: '/assessments', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="text-white flex items-center space-x-2 px-4">
        <div className="bg-blue-600 rounded-lg p-2">
          <span className="text-xl font-bold">P</span>
        </div>
        <span className="text-2xl font-extrabold">PRIME</span>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-2 py-2 px-4 rounded transition duration-200',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}