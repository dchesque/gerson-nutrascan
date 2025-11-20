import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreDisplay from "@/components/ScoreDisplay";
import IngredientCard from "@/components/IngredientCard";
import AlternativeCard from "@/components/AlternativeCard";
import PaywallModal from "@/components/PaywallModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Results() {
  const [, setLocation] = useLocation();
  const [showPaywall, setShowPaywall] = useState(false);

  // TODO: Remove mock data - this will come from API
  const mockResult = {
    productName: "Daily Multivitamin Complex",
    brand: "Generic Brand",
    score: 45,
    totalSavings: 12.50,
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

  const handleSubscribe = () => {
    console.log("Subscribe clicked");
    setShowPaywall(false);
    setLocation("/");
  };

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
            <h1 className="font-bold text-lg truncate">{mockResult.productName}</h1>
            <p className="text-sm text-muted-foreground">{mockResult.brand}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-center">
          <ScoreDisplay score={mockResult.score} />
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Potential Savings</div>
            <div className="text-2xl font-bold font-heading text-primary" data-testid="text-savings">
              ${mockResult.totalSavings.toFixed(2)}
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
            {mockResult.ingredients.map((ingredient, index) => (
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
              {mockResult.onlineAlternatives.map((alt, index) => (
                <AlternativeCard key={index} {...alt} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockResult.localAlternatives.map((alt, index) => (
                <AlternativeCard key={index} {...alt} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowPaywall(true)}
            data-testid="button-analyze-another"
          >
            Analyze Another Supplement
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
