"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client"

const supabase = createClient();
import { Sparkles, CheckCircle2, Home, Loader2 } from "lucide-react";

export default function ScanFree() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { toast } = useToast();
  const { login, signup, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user logs in, redirect to authenticated scan page
    if (isAuthenticated) {
      router.push("/scan");
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
      router.push("/results");
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      await login(email, password);
      setShowAuthModal(false);
      router.push("/scan");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    setIsAuthLoading(true);
    try {
      await signup(email, password);
      setShowAuthModal(false);
      router.push("/scan");
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/scan`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/scan`
        }
      });
      if (error) throw error;
      toast({
        title: "Magic Link Sent!",
        description: "Check your email for the sign-in link",
      });
      setShowAuthModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
              onClick={() => router.push("/")}
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
            <DialogTitle className="text-center">Unlock Unlimited Analyses</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email-signup"
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
                    data-testid="input-password-signup"
                    disabled={isAuthLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    data-testid="input-confirm-password"
                    disabled={isAuthLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  data-testid="button-signup-submit"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isAuthLoading ? "Creating Account..." : "Create Free Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleGoogleSignIn} disabled={isAuthLoading}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" onClick={handleMagicLink} disabled={isAuthLoading || !email}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Magic Link
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signin" className="space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email-signin"
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
                    data-testid="input-password-signin"
                    disabled={isAuthLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  data-testid="button-signin-submit"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isAuthLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleGoogleSignIn} disabled={isAuthLoading}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" onClick={handleMagicLink} disabled={isAuthLoading || !email}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Magic Link
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
            <p>✓ Unlimited analyses after signup</p>
            <p>✓ Track your health profile</p>
            <p>✓ Save analysis history</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
