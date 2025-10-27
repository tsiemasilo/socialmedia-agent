import { Link } from "wouter";
import { 
  LayoutDashboard, 
  Sparkles, 
  BarChart3, 
  Link2, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const navigationItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/content-creator", icon: Sparkles, label: "Content Creator" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/accounts", icon: Link2, label: "Accounts" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 z-50 flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Sparkles className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              SocialAI
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
              Marketing Hub
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
              >
                <div
                  className={`
                    group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? '' : 'group-hover:scale-110 transition-transform'}
                  />
                  <span className="text-[15px]">{item.label}</span>
                  {isActive && (
                    <ChevronRight 
                      size={16} 
                      className="ml-auto opacity-70" 
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Settings Link */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <Link href="/settings">
            <div
              className={`
                group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${currentPath === '/settings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <Settings 
                size={20} 
                strokeWidth={currentPath === '/settings' ? 2.5 : 2}
                className={currentPath === '/settings' ? '' : 'group-hover:rotate-90 transition-transform duration-300'}
              />
              <span className="text-[15px]">Settings</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-br from-slate-50/50 to-transparent">
        <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition-all cursor-pointer group">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
              alt="User profile"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 group-hover:ring-blue-500 transition-all"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">John Smith</p>
            <p className="text-xs text-slate-500 font-medium">Pro Plan</p>
          </div>
          <LogOut 
            size={16} 
            className="text-slate-400 group-hover:text-red-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
