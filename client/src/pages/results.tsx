import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, DollarSign, TrendingUp, Loader2, Bell, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ScoreDisplay from "@/components/ScoreDisplay";
import IngredientCard from "@/components/IngredientCard";
import AlternativeCard from "@/components/AlternativeCard";
import PaywallModal from "@/components/PaywallModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for fallback
const mockResult = {
    productName: "Daily Multivitamin Complex",
    brand: "Generic Brand",
    score: 45,
    totalSavings: 12.50,
    benefits: "Immune support, Energy, Overall health",
    ingredients: [
      {
        name: "Vitamin D3",
        actualDosage: "1000 IU",
        idealDosage: "4000-5000 IU",
        percentage: 22,
        efficacy: "low" as const,
        explanation: "Severely underdosed. Research shows 4000-5000 IU daily is optimal for most adults. This dosage is too low to provide meaningful immune or bone health benefits.",
      },
      {
        name: "Vitamin C",
        actualDosage: "500 mg",
        idealDosage: "1000-2000 mg",
        percentage: 45,
        efficacy: "medium" as const,
        explanation: "Below optimal range. Studies suggest 1000-2000mg daily provides better antioxidant protection. Current dosage may provide minimal benefits.",
      },
      {
        name: "Zinc",
        actualDosage: "15 mg",
        idealDosage: "25-40 mg",
        percentage: 48,
        efficacy: "medium" as const,
        explanation: "Moderately underdosed. Clinical trials demonstrate 25-40mg daily is needed for optimal immune support and cellular function.",
      },
    ],
    onlineAlternatives: [
      {
        name: "Premium Daily Complete",
        brand: "Nature Made",
        score: 92,
        price: 29.99,
        currentPrice: 44.99,
        savings: 15.00,
        url: "https://amazon.com",
      },
      {
        name: "Ultra Multivitamin",
        brand: "Garden of Life",
        score: 88,
        price: 32.50,
        currentPrice: 39.99,
        savings: 7.49,
        url: "https://iherb.com",
      },
    ],
    localAlternatives: [
      {
        name: "Complete Daily Formula",
        brand: "Centrum",
        score: 78,
        price: 24.99,
        location: "Walgreens",
        distance: "0.3 mi",
      },
      {
        name: "Essential Multivitamin",
        brand: "Nature's Bounty",
        score: 82,
        price: 19.99,
        location: "CVS Pharmacy",
        distance: "0.5 mi",
      },
    ],
  };

export default function Results() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [showPaywall, setShowPaywall] = useState(searchString.includes("showPaywall=true"));
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monitorPrice, setMonitorPrice] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const loadAnalysis = async () => {
      // First try session storage
      const storedAnalysis = sessionStorage.getItem("currentAnalysis");
      if (storedAnalysis) {
        setAnalysisData(JSON.parse(storedAnalysis));
        setLoading(false);
        return;
      }

      // Then try to load from backend if we have an ID
      const analysisId = sessionStorage.getItem("currentAnalysisId");
      if (analysisId) {
        try {
          const { getAnalysisAPI } = await import("@/lib/api");
          const data = await getAnalysisAPI(analysisId);
          setAnalysisData(data);
          sessionStorage.setItem("currentAnalysis", JSON.stringify(data));
          setLoading(false);
          return;
        } catch (error) {
          console.error("Failed to load analysis from backend:", error);
        }
      }

      // Fallback to mock data
      setAnalysisData(mockResult);
      setLoading(false);
    };

    loadAnalysis();
  }, []);

  const handleSubscribe = () => {
    console.log("Subscribe clicked");
    setLocation("/subscribe");
  };

  const handleSetPriceAlert = () => {
    if (!targetPrice) {
      alert("Please enter a target price");
      return;
    }
    console.log("Price alert set for:", result.productName, "at $" + targetPrice);
    setShowPriceAlert(false);
    setMonitorPrice(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const result = analysisData || mockResult;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg truncate">{result.productName}</h1>
            <p className="text-sm text-muted-foreground">{result.brand}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-center">
          <ScoreDisplay score={result.score} />
        </div>

        {/* Benefits Section */}
        {result.benefits && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">This supplement helps with:</p>
            <p className="font-semibold text-foreground">{result.benefits}</p>
          </Card>
        )}

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Potential Savings</div>
            <div className="text-2xl font-bold font-heading text-primary" data-testid="text-savings">
              ${result.totalSavings.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              By switching to better alternatives
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-foreground" />
            <h3 className="text-lg font-semibold font-heading">Ingredient Analysis</h3>
          </div>
          <div className="space-y-3">
            {result.ingredients.map((ingredient: any, index: number) => (
              <IngredientCard key={index} {...ingredient} />
            ))}
          </div>
        </div>

        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="online" data-testid="tab-online">
              Online Alternatives
            </TabsTrigger>
            <TabsTrigger value="local" data-testid="tab-local">
              Nearby Stores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.onlineAlternatives.map((alt: any, index: number) => (
                <AlternativeCard key={index} {...alt} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.localAlternatives.map((alt: any, index: number) => (
                <AlternativeCard key={index} {...alt} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Price Monitoring Section */}
        <Card className="p-4 bg-gradient-to-r from-chart-4/10 to-chart-4/5 border-chart-4/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-chart-4" />
              <h4 className="font-semibold">Price Drop Alert</h4>
            </div>
            <Button
              variant={monitorPrice ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPriceAlert(!showPriceAlert)}
              data-testid="button-price-alert"
            >
              {monitorPrice ? "Alert Active" : "Set Alert"}
            </Button>
          </div>

          {showPriceAlert && (
            <div className="space-y-3 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Notify me when price drops below:</label>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    data-testid="input-target-price"
                    className="flex-1"
                  />
                </div>
              </div>
              <Button
                onClick={handleSetPriceAlert}
                size="sm"
                className="w-full"
                data-testid="button-confirm-alert"
              >
                <Target className="w-4 h-4 mr-2" />
                Set Price Alert
              </Button>
            </div>
          )}

          {monitorPrice && !showPriceAlert && (
            <p className="text-sm text-chart-4 font-medium">
              ✓ You'll be notified when this supplement drops to ${targetPrice}
            </p>
          )}
        </Card>

        <div className="pt-4 space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowPaywall(true)}
            data-testid="button-analyze-another"
          >
            Analyze Another Supplement
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </main>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
}
