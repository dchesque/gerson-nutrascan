import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import Results from "@/pages/results";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import Settings from "@/pages/settings";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
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
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />

        {isAuthenticated && (
          <>
            <Route path="/scan" component={Scan} />
            <Route path="/results" component={Results} />
            <Route path="/history" component={History} />
            <Route path="/profile" component={Profile} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/settings" component={Settings} />
          </>
        )}

        {!isAuthenticated && (
          <>
            <Route path="/scan" component={Auth} />
            <Route path="/results" component={Auth} />
            <Route path="/history" component={Auth} />
            <Route path="/profile" component={Auth} />
            <Route path="/subscribe" component={Auth} />
            <Route path="/pricing" component={Auth} />
            <Route path="/settings" component={Auth} />
          </>
        )}

        <Route component={NotFound} />
      </Switch>
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
