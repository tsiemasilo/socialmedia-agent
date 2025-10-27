import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ContentCreator from "@/pages/content-creator";
import Analytics from "@/pages/analytics";
import Accounts from "@/pages/accounts";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useLocation } from "wouter";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPath={location} />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <MobileSidebar currentPath={location} />
      </div>
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/content-creator" component={ContentCreator} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/accounts" component={Accounts} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
