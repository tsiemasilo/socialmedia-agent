import { Link } from "wouter";
import { 
  ChartLine, 
  Wand2, 
  Calendar, 
  BarChart3, 
  Link as LinkIcon, 
  Settings,
  Bot,
  ChevronUp
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const navigationItems = [
    { path: "/", icon: ChartLine, label: "Dashboard" },
    { path: "/content-creator", icon: Wand2, label: "Content Creator" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/accounts", icon: LinkIcon, label: "Connected Accounts" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white sidebar-shadow border-r border-gray-200 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SocialAI</h1>
            <p className="text-xs text-gray-500">Marketing Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
            alt="User profile"
            className="profile-picture"
          />
          <div className="user-info">
            <p className="user-name">John Smith</p>
            <p className="user-plan">Pro Plan</p>
          </div>
          <ChevronUp className="text-gray-400" size={16} />
        </div>
      </div>
    </div>
  );
}
