import { useState } from "react";
import { useLocation } from "wouter";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HistoryItem from "@/components/HistoryItem";
import { Badge } from "@/components/ui/badge";

export default function History() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "low">("all");

  // TODO: Remove mock data - this will come from API
  const mockHistory = [
    {
      id: "1",
      productName: "Premium Vitamin D3 + K2",
      brand: "Nature Made",
      score: 92,
      date: "2 hours ago",
    },
    {
      id: "2",
      productName: "Daily Multivitamin Complex",
      brand: "Generic Brand",
      score: 45,
      date: "Yesterday",
    },
    {
      id: "3",
      productName: "Omega-3 Fish Oil 1000mg",
      brand: "Nordic Naturals",
      score: 85,
      date: "3 days ago",
    },
    {
      id: "4",
      productName: "Magnesium Glycinate 400mg",
      brand: "Doctor's Best",
      score: 78,
      date: "1 week ago",
    },
    {
      id: "5",
      productName: "Super B-Complex",
      brand: "Now Foods",
      score: 38,
      date: "2 weeks ago",
    },
  ];

  const filteredHistory = mockHistory.filter((item) => {
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
        {filteredHistory.length === 0 ? (
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
                onClick={() => {
                  console.log("View history item:", item.id);
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
