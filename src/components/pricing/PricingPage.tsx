"use client"
import { useRouter } from "next/navigation"
import { Crown, Check, ArrowRight, Zap, Target, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingPage() {
  const router = useRouter()

  const features = {
    free: [
      "1 free analysis per day",
      "Basic ingredient breakdown",
      "Quality score 0-100",
      "Standard alternatives"
    ],
    premium: [
      "✓ Unlimited analyses",
      "✓ Advanced ingredient analysis",
      "✓ Quality score 0-100",
      "✓ Online & local alternatives",
      "✓ Real-time price alerts",
      "✓ Estimated savings calculator",
      "✓ Benefits tracking",
      "✓ Priority support"
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              title="Back to Home"
              data-testid="button-back-home-pricing"
            >
              <Home className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Pricing Plans</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade anytime. Get unlimited access to AI-powered supplement analysis and personalized recommendations.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 relative border-border hover:border-primary/50 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-heading mb-2">Free Plan</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Perfect for trying NutraScan</p>
              </div>

              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() => router.push("/")}
                data-testid="button-get-free"
              >
                Get Started
              </Button>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground mb-3">What's Included:</p>
                {features.free.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 relative border-2 border-primary shadow-lg">
            <div className="absolute -top-4 left-8">
              <Badge className="bg-primary text-primary-foreground">
                <Zap className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>

            <div className="space-y-6 pt-2">
              <div>
                <h3 className="text-2xl font-bold font-heading mb-2 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Premium
                </h3>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$14.90</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$119</span>
                    <span className="text-muted-foreground">/year</span>
                    <Badge variant="secondary" className="ml-2">Save 31%</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">All the power you need</p>
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={() => router.push("/subscribe")}
                data-testid="button-upgrade-pricing"
              >
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Everything in Free, plus:</p>
                {features.premium.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Features Comparison */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold font-heading text-center">Detailed Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Daily Analyses</td>
                  <td className="text-center py-4 px-4">1 per day</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Quality Score</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Ingredient Analysis</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4"><span className="text-primary font-semibold">Advanced</span></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Dosage Evaluation</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Online Alternatives</td>
                  <td className="text-center py-4 px-4">Limited</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Local Store Finder</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Price Drop Alerts</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">Benefits Tracking</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-4 px-4">Savings Calculator</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Value Props */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Save Hundreds</h4>
              <p className="text-sm text-muted-foreground">Find better supplements and save hundreds annually with our alternative recommendations</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">AI-Powered Analysis</h4>
              <p className="text-sm text-muted-foreground">Get instant, science-backed analysis of any supplement in seconds</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Premium Support</h4>
              <p className="text-sm text-muted-foreground">Get priority support and access to exclusive features for premium members</p>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-12 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold font-heading">Ready to Upgrade?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start your premium journey today and get unlimited supplement analysis with advanced features
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => router.push("/subscribe")}
              data-testid="button-start-premium"
            >
              Start Premium Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
              data-testid="button-try-free"
            >
              Try Free First
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
