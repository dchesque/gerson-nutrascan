"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import ThemeToggle from "@/components/ThemeToggle";
import AIConversationPopup from "@/components/AIConversationPopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, DollarSign, Zap, Shield, CheckCircle2, ArrowRight, Star, Lightbulb, Lock, Rocket, Brain, Smartphone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";




export function HomeClient() {
  const router = useRouter()
  const supabase = createClient()
  const { signup, login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      await login(email, password);
      setShowAuthDialog(false);
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
      setShowAuthDialog(false);
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
      setShowAuthDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenAuth = () => {
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NutraScan AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2"
                data-testid="button-header-profile"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            ) : (
              <Button
                onClick={handleOpenAuth}
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
                data-testid="button-header-signup"
              >
                Start Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <p className="text-xs md:text-sm font-medium text-primary flex items-center gap-1">
                    <Rocket className="w-3 h-3 md:w-4 md:h-4" />
                    100% Free - No Credit Card Needed
                  </p>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight">
                  Discover the Truth About Your <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Supplements</span>
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Get AI-powered analysis of any supplement in seconds. See quality scores, ingredient breakdown, and better alternatives. Completely free to try.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  onClick={handleOpenAuth}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all font-semibold w-full sm:w-auto"
                  data-testid="button-get-started"
                >
                  Start Testing Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowAIPopup(true)}
                  className="w-full sm:w-auto"
                  data-testid="button-ai-help"
                >
                  Get AI Advice
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-sm font-medium text-primary">✓ Free signup</p>
                <p className="text-sm font-medium text-primary">✓ Full access immediately</p>
                <p className="text-sm font-medium text-primary">✓ See results in 10 seconds</p>
              </div>
            </div>

            {/* Hero Image/Feature */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl"></div>
              <Card className="p-8 relative backdrop-blur border-primary/20 bg-primary/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Quality Score</p>
                      <p className="text-2xl font-bold font-heading">87/100</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Ingredient Analysis</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Vitamin D3</span>
                        <span className="text-primary font-semibold">95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{width: "95%"}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Zinc</span>
                        <span className="text-orange-500 font-semibold">60%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{width: "60%"}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Potential Savings</span>
                    </div>
                    <p className="text-3xl font-bold font-heading text-primary">$180/year</p>
                    <p className="text-sm text-muted-foreground">By switching to better alternatives</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 border-y border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold font-heading mb-2">50K+</p>
              <p className="text-sm md:text-base text-muted-foreground">Supplements Analyzed for Free</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold font-heading mb-2">$12M+</p>
              <p className="text-sm md:text-base text-muted-foreground">Saved by Free Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold font-heading mb-2">4.9/5</p>
              <p className="text-sm md:text-base text-muted-foreground">Rating from 10K+ Users</p>
            </div>
          </div>
        </section>

        {/* CTA Section 1 */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold font-heading mb-4">No Signup Pressure. Just Results.</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create an account in 30 seconds and start analyzing supplements immediately. No credit card. No commitment. Just pure supplement intelligence.
            </p>
            <Button 
              size="lg" 
              onClick={handleOpenAuth}
              className="bg-gradient-to-r from-primary to-primary/90 text-lg font-semibold"
              data-testid="button-cta1-signup"
            >
              Create Free Account Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">What You Get (Completely Free)</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to make smarter supplement decisions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Our advanced AI evaluates every ingredient and dosage against scientific evidence."
              },
              {
                icon: DollarSign,
                title: "Find Better Alternatives",
                description: "Discover higher-quality supplements online and at nearby stores with instant price comparisons."
              },
              {
                icon: TrendingUp,
                title: "0-100 Quality Score",
                description: "See exactly how good (or bad) your supplement is based on science."
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Complete analysis in 10 seconds. Way faster than researching on your own."
              },
              {
                icon: Lock,
                title: "Your Privacy Protected",
                description: "Your health data is encrypted and never shared. We respect your privacy completely."
              },
              {
                icon: Lightbulb,
                title: "Smart Recommendations",
                description: "Get personalized suggestions based on your health goals, not marketing hype."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-8 hover-elevate border-primary/10">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl md:rounded-2xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-2 md:mb-4">Get Started in 3 Steps</h2>
            <p className="text-base md:text-lg text-muted-foreground">Try it free, right now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                step: 1,
                title: "Sign Up Free",
                description: "Create an account with just your email. Takes 30 seconds. No credit card needed."
              },
              {
                step: 2,
                title: "Scan a Supplement",
                description: "Take a photo, type ingredients, or use voice. Pick whatever is easiest for you."
              },
              {
                step: 3,
                title: "Get Instant Results",
                description: "See your quality score, ingredient breakdown, and better alternatives immediately."
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="absolute -top-4 md:-top-6 left-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base md:text-lg">
                  {item.step}
                </div>
                <Card className="p-4 md:p-6 pt-8 md:pt-10 bg-background border-primary/20">
                  <h3 className="font-bold font-heading mb-2 text-base md:text-lg">{item.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button 
              size="lg"
              onClick={handleOpenAuth}
              className="bg-gradient-to-r from-primary to-primary/90 font-semibold w-full sm:w-auto"
              data-testid="button-how-it-works-signup"
            >
              Start Free Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-muted-foreground">Real people getting real results for free</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Fitness Enthusiast",
                text: "I couldn't believe how much I was wasting on supplements until I tried this. Now I save hundreds and actually get better results. Best decision ever.",
                rating: 5
              },
              {
                name: "James T.",
                role: "Healthcare Professional",
                text: "The analysis is shockingly accurate. I started recommending this to all my patients. It's empowering people to take control of their supplement choices.",
                rating: 5
              },
              {
                name: "Maria L.",
                role: "Wellness Coach",
                text: "My clients are amazed by the instant results. This tool has become essential for my practice. And it's free! Can't ask for more.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover-elevate">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold font-heading">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-gradient-to-r from-primary/15 to-primary/5 rounded-2xl p-16 border-2 border-primary/30">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-5xl font-bold font-heading mb-4">Ready to Know the Truth?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of people who've already discovered which supplements are worth it. It's completely free to try and takes less than a minute to get started.
            </p>
            <Button 
              size="lg"
              onClick={handleOpenAuth}
              className="bg-gradient-to-r from-primary to-primary/90 text-lg font-semibold px-8"
              data-testid="button-final-cta"
            >
              Analyze Free Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-6">No credit card required • Instant results • 10 seconds to analyze</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2025 NutraScan AI. Made with 💚 for your health.</p>
          </div>
        </footer>
      </main>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Welcome to NutraScan AI</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
              Analyze supplements with AI-powered insights
            </p>
          </DialogHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* SIGN IN TAB */}
            <TabsContent value="signin" className="space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isAuthLoading}
                    data-testid="input-signin-email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isAuthLoading}
                    data-testid="input-signin-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isAuthLoading}>
                  {isAuthLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={isAuthLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleMagicLink}
                  disabled={isAuthLoading}
                >
                  Send Magic Link to Email
                </Button>
              </div>
            </TabsContent>

            {/* SIGN UP TAB */}
            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isAuthLoading}
                    data-testid="input-signup-email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isAuthLoading}
                    data-testid="input-signup-password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isAuthLoading}
                    data-testid="input-signup-confirm"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isAuthLoading}>
                  {isAuthLoading ? "Creating Account..." : "Create Free Account"}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  Or sign up with
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AIConversationPopup
        open={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        onGoalSelect={(goal) => console.log("User goal:", goal)}
      />
    </div>
  );
}
