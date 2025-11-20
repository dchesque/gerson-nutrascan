import { useState } from "react";
import { useLocation } from "wouter";
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, CheckCircle2, Home, Loader2, AlertCircle } from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (data: { type: string; content: string }) => {
    console.log("Analysis triggered:", data);
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

      if (error.message?.includes("Free analysis limit")) {
        toast({
          title: "Free Limit Reached",
          description: "Upgrade to Premium for unlimited analyses",
          variant: "destructive"
        });
        setLocation("/results?showPaywall=true");
      } else if (error.message?.includes("Upgrade")) {
        toast({
          title: "Upgrade Required",
          description: "Get Premium for unlimited supplement scans",
          variant: "destructive"
        });
        setLocation("/results?showPaywall=true");
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Could not analyze supplement. Please try again.",
          variant: "destructive"
        });
      }
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
          <p className="text-lg text-muted-foreground">Get instant AI analysis in seconds</p>
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
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm"><strong>Smart Alternatives</strong> - Better supplements online & nearby</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm"><strong>Estimated Savings</strong> - See how much you can save yearly</span>
            </div>
          </div>
        </Card>

        {/* Tips Section */}
        <Card className="p-6 border-border/50 bg-muted/30">
          <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Tips for Best Results:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Include all ingredients with their dosages</li>
            <li>✓ Mention the serving size if available</li>
            <li>✓ List active ingredients on the label</li>
            <li>✓ The more details, the better the analysis</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
