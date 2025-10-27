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
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="ml-12 md:ml-0">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all rounded-xl hidden md:flex font-semibold"
            onClick={onCreateContent || (() => setLocation("/content-creator"))}
          >
            <Plus size={18} className="mr-2" strokeWidth={2.5} />
            Create Content
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/30 md:hidden rounded-xl"
            size="sm"
            onClick={onCreateContent || (() => setLocation("/content-creator"))}
          >
            <Plus size={18} strokeWidth={2.5} />
          </Button>
          <div className="relative cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <Bell className="text-slate-600" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
