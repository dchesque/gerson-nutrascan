import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Filter, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HistoryItem from "@/components/HistoryItem";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "low">("all");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { getHistoryAPI } = await import("@/lib/api");
      const data = await getHistoryAPI();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const mockHistory = [
    {
      id: "0",
      productName: "BellySlim",
      brand: "BellySlim",
      score: 28,
      date: "Just now",
      benefits: "Weight loss support, Metabolism boost, Fat burning",
      productImage: "/attached_assets/1-POTE_1763671886862.png",
      url: "https://www.amazon.com/s?k=BellySlim+Weight+Loss+Gummies",
    },
    {
      id: "1",
      productName: "Premium Vitamin D3 + K2",
      brand: "Nature Made",
      score: 92,
      date: "2 hours ago",
      benefits: "Bone health, Immune support, Cardiovascular health",
      url: "https://www.amazon.com/Nature-Made-Vitamin-Softgels-Capsules/s?k=Nature+Made+D3+K2",
    },
    {
      id: "2",
      productName: "Daily Multivitamin Complex",
      brand: "One A Day",
      score: 72,
      date: "Yesterday",
      benefits: "Energy, Immune support, Overall wellness",
      url: "https://www.amazon.com/One-Day-Multivitamin-Complete-Vitamins/s?k=One+A+Day+Multivitamin",
    },
    {
      id: "3",
      productName: "Omega-3 Fish Oil 1000mg",
      brand: "Nordic Naturals",
      score: 85,
      date: "3 days ago",
      benefits: "Heart health, Brain function, Joint support",
      url: "https://www.amazon.com/Nordic-Naturals-Omega-3-1000mg-Supplement/s?k=Nordic+Naturals+Omega+3",
    },
    {
      id: "4",
      productName: "Magnesium Glycinate 400mg",
      brand: "Doctor's Best",
      score: 78,
      date: "1 week ago",
      benefits: "Sleep quality, Muscle relaxation, Stress relief",
      url: "https://www.amazon.com/Doctors-Best-Magnesium-Glycinate-Supplement/s?k=Doctor+Best+Magnesium+Glycinate",
    },
    {
      id: "5",
      productName: "Super B-Complex",
      brand: "Now Foods",
      score: 65,
      date: "2 weeks ago",
      benefits: "Energy production, Metabolism support, Stress management",
      url: "https://www.amazon.com/Now-Foods-Super-B-Complex-Supplement/s?k=Now+Foods+B+Complex",
    },
  ];

  const mockResults: { [key: string]: any } = {
    "0": {
      productName: "BellySlim",
      brand: "BellySlim",
      score: 28,
      totalSavings: 22.50,
      benefits: "Weight loss support, Metabolism boost, Fat burning",
      productImage: "/attached_assets/1-POTE_1763671886862.png",
      ingredients: [
        {
          name: "Apple Cider Vinegar (Proprietary Blend)",
          actualDosage: "175 mg per serving",
          idealDosage: "500-750 mg per serving",
          percentage: 23,
          efficacy: "low" as const,
          explanation: "Critical underdosage. Clinical studies show 500-750mg daily is required for metabolic benefits.",
        },
        {
          name: "BHB (Beta-Hydroxybutyrate)",
          actualDosage: "175 mg per serving",
          idealDosage: "3000-5000 mg per serving",
          percentage: 6,
          efficacy: "low" as const,
          explanation: "Extremely underdosed. Effective ketone supplementation requires 3000-5000mg per serving.",
        },
        {
          name: "Calcium/Magnesium/Sodium (B-hydroxybutyrate salts)",
          actualDosage: "175 mg per serving",
          idealDosage: "1500-2000 mg per serving",
          percentage: 9,
          efficacy: "low" as const,
          explanation: "Far below therapeutic levels. Proper mineral-BHB supplementation needs 1500-2000mg daily.",
        },
      ],
      onlineAlternatives: [
        {
          name: "Ketone BHB Advanced Formula",
          brand: "Transparent Labs",
          score: 85,
          price: 49.99,
          currentPrice: 59.99,
          savings: 10.00,
          url: "https://amazon.com",
        },
        {
          name: "Apple Cider Vinegar Plus",
          brand: "Sports Research",
          score: 79,
          price: 18.99,
          currentPrice: 24.99,
          savings: 6.00,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "BHB Salts Capsules",
          brand: "Keto Science",
          score: 82,
          price: 44.99,
          location: "GNC",
          distance: "0.8 mi",
        },
        {
          name: "Premium Apple Cider Vinegar",
          brand: "Nature's Bounty",
          score: 76,
          price: 15.99,
          location: "CVS Pharmacy",
          distance: "0.5 mi",
        },
      ],
    },
    "1": {
      productName: "Premium Vitamin D3 + K2",
      brand: "Nature Made",
      score: 92,
      totalSavings: 18.50,
      benefits: "Bone health, Immune support, Cardiovascular health",
      ingredients: [
        {
          name: "Vitamin D3 (Cholecalciferol)",
          actualDosage: "1000 IU per serving",
          idealDosage: "1000-2000 IU per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Optimal dosage. Clinical studies support 1000-2000 IU daily for bone and immune health.",
        },
        {
          name: "Vitamin K2 (Menaquinone-7)",
          actualDosage: "45 mcg per serving",
          idealDosage: "45-180 mcg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Excellent dosage. Supports calcium absorption and cardiovascular health at this level.",
        },
      ],
      onlineAlternatives: [
        {
          name: "D3 + K2 Supreme",
          brand: "Thorne",
          score: 95,
          price: 35.00,
          currentPrice: 38.99,
          savings: 3.99,
          url: "https://amazon.com",
        },
        {
          name: "Vitamin D3 + K2 Complete",
          brand: "BodyBio",
          score: 88,
          price: 28.00,
          currentPrice: 32.99,
          savings: 4.99,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "D3 + K2 Supplement",
          brand: "Solgar",
          score: 90,
          price: 32.99,
          location: "Whole Foods",
          distance: "1.2 mi",
        },
        {
          name: "Vitamin D3 + K2",
          brand: "Nature's Way",
          score: 85,
          price: 24.99,
          location: "Walgreens",
          distance: "0.3 mi",
        },
      ],
    },
    "2": {
      productName: "Daily Multivitamin Complex",
      brand: "One A Day",
      score: 72,
      totalSavings: 15.00,
      benefits: "Energy, Immune support, Overall wellness",
      ingredients: [
        {
          name: "Vitamin A",
          actualDosage: "900 mcg per serving",
          idealDosage: "700-900 mcg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Meets recommended daily allowance for vision and immune function.",
        },
        {
          name: "Vitamin C",
          actualDosage: "75 mg per serving",
          idealDosage: "75-100 mg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Adequate dosage for antioxidant and immune support benefits.",
        },
        {
          name: "Vitamin B12",
          actualDosage: "6 mcg per serving",
          idealDosage: "2.4-6 mcg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Optimal level for energy metabolism and nerve function.",
        },
      ],
      onlineAlternatives: [
        {
          name: "Men's Multivitamin Plus",
          brand: "MegaFood",
          score: 88,
          price: 42.00,
          currentPrice: 49.99,
          savings: 7.99,
          url: "https://amazon.com",
        },
        {
          name: "Complete Daily Vitamin",
          brand: "Rainbow Light",
          score: 84,
          price: 35.00,
          currentPrice: 43.99,
          savings: 8.99,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "Premium Multivitamin",
          brand: "New Chapter",
          score: 86,
          price: 38.99,
          location: "Whole Foods",
          distance: "1.2 mi",
        },
        {
          name: "Daily Multi",
          brand: "Vitafusion",
          score: 78,
          price: 18.99,
          location: "Target",
          distance: "0.7 mi",
        },
      ],
    },
    "3": {
      productName: "Omega-3 Fish Oil 1000mg",
      brand: "Nordic Naturals",
      score: 85,
      totalSavings: 24.00,
      benefits: "Heart health, Brain function, Joint support",
      ingredients: [
        {
          name: "EPA (Eicosapentaenoic Acid)",
          actualDosage: "400 mg per serving",
          idealDosage: "300-500 mg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Excellent dosage. Supports cardiovascular and brain health at this level.",
        },
        {
          name: "DHA (Docosahexaenoic Acid)",
          actualDosage: "300 mg per serving",
          idealDosage: "250-400 mg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Optimal for cognitive function and eye health benefits.",
        },
      ],
      onlineAlternatives: [
        {
          name: "Omega-3 Premium Plus",
          brand: "Life Extension",
          score: 92,
          price: 48.00,
          currentPrice: 59.99,
          savings: 11.99,
          url: "https://amazon.com",
        },
        {
          name: "Ultra Omega-3 Fish Oil",
          brand: "Carlson",
          score: 88,
          price: 45.00,
          currentPrice: 54.99,
          savings: 9.99,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "Omega-3 Fish Oil Elite",
          brand: "Barlean's",
          score: 90,
          price: 52.00,
          location: "Whole Foods",
          distance: "1.2 mi",
        },
        {
          name: "Fish Oil Supplement",
          brand: "Nature Made",
          score: 80,
          price: 28.99,
          location: "CVS Pharmacy",
          distance: "0.5 mi",
        },
      ],
    },
    "4": {
      productName: "Magnesium Glycinate 400mg",
      brand: "Doctor's Best",
      score: 78,
      totalSavings: 12.50,
      benefits: "Sleep quality, Muscle relaxation, Stress relief",
      ingredients: [
        {
          name: "Magnesium Glycinate",
          actualDosage: "400 mg per serving",
          idealDosage: "300-500 mg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Excellent bioavailable form. Optimal dosage for sleep and muscle support.",
        },
        {
          name: "Glycine",
          actualDosage: "Contains glycine complex",
          idealDosage: "Included in chelate",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Glycinate form improves absorption and has calming properties.",
        },
      ],
      onlineAlternatives: [
        {
          name: "Magnesium Threonate Plus",
          brand: "Life Extension",
          score: 89,
          price: 38.00,
          currentPrice: 45.99,
          savings: 7.99,
          url: "https://amazon.com",
        },
        {
          name: "Magnesium Bisglycinate",
          brand: "Thorne",
          score: 85,
          price: 35.00,
          currentPrice: 42.99,
          savings: 7.99,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "Magnesium Supplement",
          brand: "Solgar",
          score: 82,
          price: 32.99,
          location: "Whole Foods",
          distance: "1.2 mi",
        },
        {
          name: "Magnesium Glycinate",
          brand: "Nature Made",
          price: 22.99,
          score: 76,
          location: "Walgreens",
          distance: "0.3 mi",
        },
      ],
    },
    "5": {
      productName: "Super B-Complex",
      brand: "Now Foods",
      score: 65,
      totalSavings: 8.75,
      benefits: "Energy production, Metabolism support, Stress management",
      ingredients: [
        {
          name: "Vitamin B1 (Thiamine)",
          actualDosage: "100 mg per serving",
          idealDosage: "1.1-1.2 mg per serving",
          percentage: 8333,
          efficacy: "medium" as const,
          explanation: "Significantly exceeds needs. While water-soluble B vitamins are not toxic at high levels, standard supplementation is lower.",
        },
        {
          name: "Vitamin B12 (Cyanocobalamin)",
          actualDosage: "500 mcg per serving",
          idealDosage: "2.4 mcg per serving",
          percentage: 20833,
          efficacy: "high" as const,
          explanation: "High potency formula. Excess B12 is excreted in urine, but dosage is effective for energy support.",
        },
        {
          name: "Folic Acid (Folate)",
          actualDosage: "400 mcg per serving",
          idealDosage: "400 mcg per serving",
          percentage: 100,
          efficacy: "high" as const,
          explanation: "Meets recommended dosage for cellular energy and metabolism.",
        },
      ],
      onlineAlternatives: [
        {
          name: "B-Complex Supreme",
          brand: "Thorne",
          score: 88,
          price: 32.00,
          currentPrice: 38.99,
          savings: 6.99,
          url: "https://amazon.com",
        },
        {
          name: "Active B Complex",
          brand: "Life Extension",
          score: 84,
          price: 28.00,
          currentPrice: 34.99,
          savings: 6.99,
          url: "https://iherb.com",
        },
      ],
      localAlternatives: [
        {
          name: "B-Complex Supplement",
          brand: "Solgar",
          score: 86,
          price: 30.99,
          location: "Whole Foods",
          distance: "1.2 mi",
        },
        {
          name: "B Complex Vitamins",
          brand: "Nature's Way",
          score: 78,
          price: 18.99,
          location: "Target",
          distance: "0.7 mi",
        },
      ],
    },
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    if (hours < 48) return "Yesterday";
    if (hours < 168) return `${Math.floor(hours / 24)} days ago`;
    return `${Math.floor(hours / 168)} weeks ago`;
  };

  const allHistory = history.length > 0 ? history : mockHistory;
  const filteredHistory = allHistory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "high" && item.score >= 71) ||
      (filter === "low" && item.score < 71);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold font-heading mb-4">Analysis History</h1>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search supplements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-history"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                <Badge
                  variant={filter === "all" ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setFilter("all")}
                  data-testid="filter-all"
                >
                  All
                </Badge>
                <Badge
                  variant={filter === "high" ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setFilter("high")}
                  data-testid="filter-high"
                >
                  High Score
                </Badge>
                <Badge
                  variant={filter === "low" ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setFilter("low")}
                  data-testid="filter-low"
                >
                  Low Score
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No supplements found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try a different search term" : "Start scanning supplements to build your history"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setLocation("/")} data-testid="button-scan-first">
                Scan Your First Supplement
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <HistoryItem
                key={item.id}
                {...item}
                date={typeof item.createdAt === 'string' ? item.createdAt : formatDate(item.createdAt)}
                onClick={() => {
                  console.log("View history item:", item.id);
                  sessionStorage.setItem("currentAnalysis", JSON.stringify(mockResults[item.id]));
                  setLocation("/results");
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
