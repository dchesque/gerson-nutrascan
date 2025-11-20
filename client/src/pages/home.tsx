import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import AIConversationPopup from "@/components/AIConversationPopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, TrendingUp, DollarSign, Zap, Shield, CheckCircle2, ArrowRight, Star, Lightbulb, Lock, Rocket, Brain, Smartphone } from "lucide-react";
import cameraScreen from "@assets/generated_images/camera_scan_interface.png";
import resultsScreen from "@assets/generated_images/supplement_analysis_results_screen.png";
import historyScreen from "@assets/generated_images/scan_history_page.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in" : "Signing up", { email, password });
    setShowAuthDialog(false);
    setLocation("/scan");
  };

  const handleSignup = () => {
    // Go directly to scan page for free analysis
    setLocation("/scan");
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
            <Button 
              onClick={handleSignup}
              className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
              data-testid="button-header-signup"
            >
              Start Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary flex items-center gap-1">
                    <Rocket className="w-4 h-4" />
                    100% Free - No Credit Card Needed
                  </p>
                </div>
                
                <h1 className="text-6xl md:text-7xl font-bold font-heading leading-tight">
                  Discover the Truth About Your <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Supplements</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Get AI-powered analysis of any supplement in seconds. See quality scores, ingredient breakdown, and better alternatives. Completely free to try.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleSignup}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all text-lg font-semibold"
                  data-testid="button-get-started"
                >
                  Start Testing Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowAIPopup(true)}
                  className="text-lg"
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
        <section className="max-w-7xl mx-auto px-4 py-16 border-y border-border">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold font-heading mb-2">50K+</p>
              <p className="text-muted-foreground">Supplements Analyzed for Free</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-heading mb-2">$12M+</p>
              <p className="text-muted-foreground">Saved by Free Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-heading mb-2">4.9/5</p>
              <p className="text-muted-foreground">Rating from 10K+ Users</p>
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
              onClick={handleSignup}
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

        {/* App Interface Preview */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">See What's Inside</h2>
            <p className="text-lg text-muted-foreground">Our intuitive interface makes analyzing supplements incredibly simple</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover-elevate border-primary/20">
              <div className="bg-gradient-to-b from-primary/10 to-primary/5 p-4">
                <p className="text-sm font-semibold text-primary mb-3">1. Scan a Supplement</p>
                <img 
                  src={cameraScreen} 
                  alt="Scan any supplement with camera" 
                  className="w-full rounded-lg border border-primary/20"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Take a photo of any supplement bottle and let our AI analyze it instantly</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover-elevate border-primary/20">
              <div className="bg-gradient-to-b from-primary/10 to-primary/5 p-4">
                <p className="text-sm font-semibold text-primary mb-3">2. Get Instant Results</p>
                <img 
                  src={resultsScreen} 
                  alt="Get instant supplement analysis results" 
                  className="w-full rounded-lg border border-primary/20"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">See quality scores, ingredient breakdown, and better alternatives in seconds</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover-elevate border-primary/20">
              <div className="bg-gradient-to-b from-primary/10 to-primary/5 p-4">
                <p className="text-sm font-semibold text-primary mb-3">3. Track Your History</p>
                <img 
                  src={historyScreen} 
                  alt="Keep track of all your supplement analysis history" 
                  className="w-full rounded-lg border border-primary/20"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Keep a complete record of all your analyses and track improvements over time</p>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 py-24 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Get Started in 3 Steps</h2>
            <p className="text-lg text-muted-foreground">Try it free, right now</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="absolute -top-6 left-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <Card className="p-6 pt-10 bg-background border-primary/20">
                  <h3 className="font-bold font-heading mb-2 text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={handleSignup}
              className="bg-gradient-to-r from-primary to-primary/90 text-lg font-semibold"
              data-testid="button-how-it-works-signup"
            >
              Start Free Now <ArrowRight className="w-5 h-5 ml-2" />
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
              onClick={handleSignup}
              className="bg-gradient-to-r from-primary to-primary/90 text-lg font-semibold px-8"
              data-testid="button-final-cta"
            >
              Analyze Your First Supplement Free <ArrowRight className="w-5 h-5 ml-2" />
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
            <DialogTitle>{isLogin ? "Welcome Back" : "Get Started Free"}</DialogTitle>
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
              />
            </div>

            <Button type="submit" className="w-full font-semibold" data-testid="button-auth-submit">
              {isLogin ? "Sign In" : "Start Free"}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              data-testid="button-toggle-auth"
            >
              {isLogin ? "New user? Create account" : "Already have an account? Sign in"}
            </button>
          </div>
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
