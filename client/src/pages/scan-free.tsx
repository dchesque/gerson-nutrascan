import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Sparkles, CheckCircle2, Home, Loader2, ArrowRight } from "lucide-react";

export default function ScanFree() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { toast } = useToast();
  const { login, signup, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user logs in, redirect to authenticated scan page
    if (isAuthenticated) {
      setLocation("/scan");
    }
  }, [isAuthenticated]);

  const handleAnalyze = async (data: { type: string; content: string }) => {
    setIsLoading(true);

    try {
      const { analyzeSupplementAPI } = await import("@/lib/api");
      const result = await analyzeSupplementAPI(
        data.type as "photo" | "text" | "voice",
        data.content
      );
      
      sessionStorage.setItem("currentAnalysisId", result.analysisId);
      sessionStorage.setItem("currentAnalysis", JSON.stringify(result));
      
      toast({
        title: "Analysis Complete!",
        description: "Check out your supplement score and recommendations.",
      });

      setIsLoading(false);
      setLocation("/results");
    } catch (error: any) {
      setIsLoading(false);
      console.error("Analysis failed:", error);

      if (error.message?.includes("Free analysis limit") || error.message?.includes("Upgrade")) {
        // Show login/signup modal for second analysis
        setShowAuthModal(true);
        toast({
          title: "Sign Up for More",
          description: "Create a free account to unlock unlimited analyses",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Could not analyze supplement. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      setShowAuthModal(false);
      setLocation("/scan");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-heading">NutraScan AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back-home"
              title="Back to Home"
            >
              <Home className="w-5 h-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Section Title */}
        <section className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-heading">Scan Your Supplement</h2>
          <p className="text-lg text-muted-foreground">Get instant AI analysis for FREE</p>
          <p className="text-sm text-primary font-medium">✓ One free analysis (no login needed)</p>
        </section>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="font-semibold mb-2">Analyzing your supplement...</p>
            <p className="text-sm text-muted-foreground">Our AI is evaluating ingredients, dosages, and effectiveness</p>
          </Card>
        )}

        {/* Scanner Interface */}
        {!isLoading && (
          <ScanInterface onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* Benefits Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            You'll Receive:
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm"><strong>Quality Score</strong> - 0-100 rating based on science</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm"><strong>Ingredient Analysis</strong> - See if dosages are effective</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Auth Modal - Sign up for more analyses */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isLogin ? "Sign In" : "Unlock Unlimited Analyses"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
                disabled={isAuthLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
                disabled={isAuthLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full font-semibold" 
              data-testid="button-auth-submit"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? "Loading..." : isLogin ? "Sign In" : "Create Free Account"}
              {!isAuthLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              data-testid="button-toggle-auth"
              disabled={isAuthLoading}
            >
              {isLogin ? "New? Create account" : "Have account? Sign in"}
            </button>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>✓ Unlimited analyses after signup</p>
            <p>✓ Track your health profile</p>
            <p>✓ Save analysis history</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
