import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Home from "@/pages/home";
import ScanFree from "@/pages/scan-free";
import Scan from "@/pages/scan";
import Results from "@/pages/results";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import Settings from "@/pages/settings";
import BottomNav from "@/components/BottomNav";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        {/* Public scan - allows 1 free analysis without login */}
        <Route path="/scan" component={isAuthenticated ? Scan : ScanFree} />
        <Route path="/results" component={Results} />
        
        {/* Require auth for these */}
        {isAuthenticated && (
          <>
            <Route path="/history" component={History} />
            <Route path="/profile" component={Profile} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/settings" component={Settings} />
          </>
        )}
        
        <Route component={NotFound} />
      </Switch>
      {/* Only show nav if authenticated */}
      {isAuthenticated && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
