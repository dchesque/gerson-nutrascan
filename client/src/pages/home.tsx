import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import AIConversationPopup from "@/components/AIConversationPopup";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAIPopup, setShowAIPopup] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }, 1000);
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
      
      // Store analysis ID in session storage for results page
      sessionStorage.setItem("currentAnalysisId", result.analysisId);
      sessionStorage.setItem("currentAnalysis", JSON.stringify(result));
      
      setLocation("/results");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      
      // If error indicates upgrade needed, show paywall
      if (error.message?.includes("Free analysis limit") || error.message?.includes("Upgrade")) {
        setLocation("/results?showPaywall=true");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-heading">NutraScan AI</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-2">
            Scan Your Supplements
          </h2>
          <p className="text-muted-foreground">
            Get instant AI-powered analysis and discover if you're wasting money
          </p>
        </div>

        <ScanInterface onAnalyze={handleAnalyze} />

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            What you'll get:
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Quality score (0-100) based on science</li>
            <li>• Ingredient-by-ingredient dosage analysis</li>
            <li>• Better alternatives online and nearby</li>
            <li>• Estimated savings on every purchase</li>
          </ul>
        </div>
      </main>

      <AIConversationPopup
        open={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        onGoalSelect={(goal) => console.log("User goal:", goal)}
      />
    </div>
  );
}
