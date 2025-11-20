import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import AIConversationPopup from "@/components/AIConversationPopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, TrendingUp, DollarSign, Zap, Shield, CheckCircle2, ArrowRight, Star, Users, Lightbulb, Lock } from "lucide-react";

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
              variant="outline" 
              onClick={() => { setIsLogin(true); setShowAuthDialog(true); }}
              data-testid="button-login"
            >
              Login
            </Button>
            <Button 
              onClick={() => { setIsLogin(false); setShowAuthDialog(true); }}
              data-testid="button-signup"
            >
              Sign Up
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
                    <Sparkles className="w-4 h-4" />
                    #1 Supplement Intelligence Platform
                  </p>
                </div>
                
                <h1 className="text-6xl md:text-7xl font-bold font-heading leading-tight">
                  Stop Wasting Money on <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Fake Supplements</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Americans waste $8+ billion yearly on ineffective supplements. NutraScan AI reveals the truth about every bottle with AI-powered ingredient analysis and science-backed scoring.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => { setIsLogin(false); setShowAuthDialog(true); }}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all text-lg"
                  data-testid="button-get-started"
                >
                  Start Free Scan <ArrowRight className="w-5 h-5 ml-2" />
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

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">No credit card needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">1 free analysis included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">Results in 10 seconds</span>
                </div>
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
              <p className="text-muted-foreground">Supplements Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-heading mb-2">$12M+</p>
              <p className="text-muted-foreground">Saved by Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-heading mb-2">4.9/5</p>
              <p className="text-muted-foreground">Average Rating (10K+ reviews)</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get comprehensive analysis that would normally cost $500+ from a nutritionist</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "AI-Powered Analysis",
                description: "Our advanced AI evaluates every ingredient, dosage level, and brand reputation against peer-reviewed scientific studies."
              },
              {
                icon: DollarSign,
                title: "Smart Alternatives",
                description: "Discover higher-quality supplements online and at nearby stores. Compare prices and save hundreds annually."
              },
              {
                icon: TrendingUp,
                title: "0-100 Quality Score",
                description: "Transparent scoring based on effectiveness, dosage accuracy, bioavailability, and cost-benefit ratio."
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Complete analysis in 10 seconds. No waiting for appointments or shipping samples to labs."
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Your supplement history is encrypted and never sold. We respect your health data completely."
              },
              {
                icon: Lightbulb,
                title: "AI Recommendations",
                description: "Personalized supplement suggestions based on your goals, not marketing hype."
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
        <section className="max-w-7xl mx-auto px-4 py-24 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">3 steps to supplement enlightenment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Scan or Type",
                description: "Take a photo of any supplement label, type ingredients, or use voice input. Choose what works for you."
              },
              {
                step: 2,
                title: "AI Analysis",
                description: "Our AI instantly evaluates ingredients, dosages, brand reputation, and scientific evidence."
              },
              {
                step: 3,
                title: "Get Insights",
                description: "Receive quality score, ingredient breakdown, better alternatives, and potential annual savings."
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
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Loved by Health Enthusiasts</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Fitness Enthusiast",
                text: "I was spending $200/month on supplements thinking they were premium. NutraScan showed me I was wasting $120 on ineffective brands. Now I save and get better results!",
                rating: 5
              },
              {
                name: "James T.",
                role: "Healthcare Professional",
                text: "Finally, a tool that gives patients objective supplement information. I recommend NutraScan to everyone who asks about supplements. The AI analysis is remarkably accurate.",
                rating: 5
              },
              {
                name: "Maria L.",
                role: "Wellness Coach",
                text: "This is a game-changer for my coaching practice. Clients love having evidence-based supplement recommendations instead of my intuition. NutraScan is worth every penny.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover-elevate">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold font-heading">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold font-heading mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect to try it out</p>
              <div className="text-4xl font-bold font-heading mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>1 supplement scan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>AI quality score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Ingredient analysis</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => { setIsLogin(false); setShowAuthDialog(true); }}>
                Get Started Free
              </Button>
            </Card>

            <Card className="p-8 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 ring-1 ring-primary/20 relative">
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-bl-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2">Premium</h3>
              <p className="text-muted-foreground mb-6">For serious supplement users</p>
              <div className="text-4xl font-bold font-heading mb-2">$9.99<span className="text-lg text-muted-foreground">/mo</span></div>
              <p className="text-sm text-muted-foreground mb-6">Billed monthly • Cancel anytime</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Unlimited scans</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>AI recommendations</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Local store finder</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Scan history & tracking</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/90" onClick={() => { setIsLogin(false); setShowAuthDialog(true); }}>
                Start Free Trial
              </Button>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-4xl font-bold font-heading mb-4">Ready to Stop Wasting Money?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of health-conscious people who've already saved thousands on supplements. Your first scan is completely free.
            </p>
            <Button 
              size="lg" 
              onClick={() => { setIsLogin(false); setShowAuthDialog(true); }}
              className="bg-gradient-to-r from-primary to-primary/90 text-lg"
            >
              Scan Your First Supplement Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2025 NutraScan AI. All rights reserved. Made with 💚 for your health.</p>
          </div>
        </footer>
      </main>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Welcome Back" : "Start Your Free Trial"}</DialogTitle>
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

            <Button type="submit" className="w-full" data-testid="button-auth-submit">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              data-testid="button-toggle-auth"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
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
