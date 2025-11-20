import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import Results from "@/pages/results";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import Subscribe from "@/pages/subscribe";
import BottomNav from "@/components/BottomNav";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/scan" component={Scan} />
        <Route path="/results" component={Results} />
        <Route path="/history" component={History} />
        <Route path="/profile" component={Profile} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
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
