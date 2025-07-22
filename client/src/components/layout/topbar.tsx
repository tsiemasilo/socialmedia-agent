import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface TopbarProps {
  title: string;
  subtitle: string;
  onCreateContent?: () => void;
}

export default function Topbar({ title, subtitle, onCreateContent }: TopbarProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="ml-12 md:ml-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm md:text-base text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            className="btn-primary hidden md:flex"
            onClick={onCreateContent || (() => setLocation("/content-creator"))}
          >
            <Plus size={18} className="mr-2" />
            Create Content
          </Button>
          <Button 
            className="btn-primary md:hidden"
            size="sm"
            onClick={onCreateContent || (() => setLocation("/content-creator"))}
          >
            <Plus size={16} />
          </Button>
          <div className="relative">
            <Bell className="text-gray-400" size={18} />
            <span className="notification-badge">3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
