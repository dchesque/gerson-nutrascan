import { useLocation } from "wouter";
import ScanInterface from "@/components/ScanInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();

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
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-heading">NutraScan AI</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Section Title */}
        <section className="text-center">
          <h2 className="text-3xl font-bold font-heading mb-2">Scan Your Supplement</h2>
          <p className="text-muted-foreground">Get instant analysis in three easy ways</p>
        </section>

        {/* Scanner Interface */}
        <ScanInterface onAnalyze={handleAnalyze} />

        {/* Benefits Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
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
      </main>
    </div>
  );
}
