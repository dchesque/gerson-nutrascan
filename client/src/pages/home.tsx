import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import AIConversationPopup from "@/components/AIConversationPopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, DollarSign, Zap, Shield, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAIPopup, setShowAIPopup] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAnalyze = async (data: { type: string; content: string }) => {
    console.log("Analysis triggered:", data);
    
    try {
      const { analyzeSupplementAPI } = await import("@/lib/api");
      const result = await analyzeSupplementAPI(
        data.type as "photo" | "text" | "voice",
        data.content
      );
      
      sessionStorage.setItem("currentAnalysisId", result.analysisId);
      sessionStorage.setItem("currentAnalysis", JSON.stringify(result));
      
      setLocation("/results");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      if (error.message?.includes("Free analysis limit") || error.message?.includes("Upgrade")) {
        setLocation("/results?showPaywall=true");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NutraScan AI
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Powered by AI Intelligence
              </p>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Make Smarter <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Supplement Choices</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Scan any supplement label and get instant AI analysis of quality, effectiveness, dosage, and cost. Discover better alternatives and save money on every purchase.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowAIPopup(true)}
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
                data-testid="button-start-scan"
              >
                Get AI Advice <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold font-heading mb-1">0-100</div>
              <p className="text-muted-foreground">Quality Score</p>
            </Card>

            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold font-heading mb-1">Save $$$</div>
              <p className="text-muted-foreground">Smart Alternatives</p>
            </Card>

            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold font-heading mb-1">Instant</div>
              <p className="text-muted-foreground">AI Analysis</p>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-heading mb-2">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground">
                    Advanced AI evaluates every ingredient, dosage, and brand reputation for scientific accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-heading mb-2">Find Better Deals</h3>
                  <p className="text-muted-foreground">
                    Discover higher-quality alternatives online and at nearby stores with instant price comparisons.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-heading mb-2">Score Everything</h3>
                  <p className="text-muted-foreground">
                    Get a comprehensive 0-100 score based on effectiveness, dosage accuracy, and value for money.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-heading mb-2">Smart Recommendations</h3>
                  <p className="text-muted-foreground">
                    AI chatbot provides personalized supplement recommendations based on your health goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 w-full">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-heading">Why NutraScan?</h3>
                  <ul className="space-y-3">
                    {[
                      "Scan supplements in seconds",
                      "Get scientific analysis instantly",
                      "Compare with verified alternatives",
                      "Track all your scans",
                      "Save hundreds annually",
                      "Share results with friends"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Scan Section */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2">Scan Your Supplement</h2>
            <p className="text-muted-foreground">Get instant analysis in three easy ways</p>
          </div>

          <ScanInterface onAnalyze={handleAnalyze} />

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 mt-8">
            <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What You'll Get:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Quality score (0-100) based on science</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Ingredient-by-ingredient analysis</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Better alternatives (online & local)</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Estimated savings per purchase</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground">Start free, upgrade whenever you're ready</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 relative">
              <h3 className="text-2xl font-bold font-heading mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect to get started</p>
              <div className="text-4xl font-bold font-heading mb-6">
                1 <span className="text-lg text-muted-foreground">scan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  AI-powered analysis
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Quality score
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Alternative recommendations
                </li>
              </ul>
              <Button variant="outline" className="w-full" data-testid="button-free-plan">
                Get Started
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 relative ring-1 ring-primary/20">
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-bl-lg">
                Popular
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2">Premium</h3>
              <p className="text-muted-foreground mb-6">For supplement enthusiasts</p>
              <div className="text-4xl font-bold font-heading mb-2">
                $9.99 <span className="text-lg text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Save $120+ annually</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Unlimited scans
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  AI recommendations
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Local store finder
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Scan history
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/90" onClick={() => setLocation("/subscribe")} data-testid="button-upgrade-premium">
                Upgrade to Premium
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <AIConversationPopup
        open={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        onGoalSelect={(goal) => console.log("User goal:", goal)}
      />
    </div>
  );
}
