"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import {
  Clock,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Package,
  Camera,
  FileText,
  Mic,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getHistoryAPI } from "@/lib/api";
import type { HistoryItem } from "@/lib/api";
import ScoreDisplay from "@/components/ScoreDisplay";

export function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState<"all" | "high" | "medium" | "low">("all");
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery, filterScore]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryAPI();
      setHistory(data);
      setFilteredHistory(data);
    } catch (error: any) {
      console.error("Failed to load history:", error);
      // Don't show error toast for unauthenticated users - just show empty state
      if (error.message !== "Not authenticated") {
        toast({
          title: "Error",
          description: "Failed to load analysis history",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query)
      );
    }

    // Apply score filter
    if (filterScore !== "all") {
      filtered = filtered.filter((item) => {
        if (filterScore === "high") return item.score >= 70;
        if (filterScore === "medium") return item.score >= 40 && item.score < 70;
        if (filterScore === "low") return item.score < 40;
        return true;
      });
    }

    setFilteredHistory(filtered);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getInputTypeIcon = (inputType: string) => {
    switch (inputType.toLowerCase()) {
      case "photo":
        return <Camera className="w-3 h-3" />;
      case "voice":
        return <Mic className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const handleViewAnalysis = (item: HistoryItem) => {
    // Store the analysis ID to fetch full data on results page
    sessionStorage.setItem("currentAnalysisId", item.id);
    // Clear any existing cached analysis to force fresh fetch
    sessionStorage.removeItem("currentAnalysis");
    router.push("/results");
  };

  // Calculate statistics
  const totalSavings = history.reduce((sum, item) => sum + (item.totalSavings || 0), 0);
  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Statistics */}
      <header className="bg-gradient-to-b from-primary/10 to-background border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold font-heading mb-4">Analysis History</h1>

          {!loading && history.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Analyses</p>
                    <p className="text-lg font-bold">{history.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="text-lg font-bold text-green-600">
                      ${totalSavings.toFixed(0)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                    <p className="text-lg font-bold text-blue-600">{averageScore}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filter */}
        {!loading && history.length > 0 && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-history"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Button
                size="sm"
                variant={filterScore === "all" ? "default" : "outline"}
                onClick={() => setFilterScore("all")}
                data-testid="filter-all"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterScore === "high" ? "default" : "outline"}
                onClick={() => setFilterScore("high")}
                className="whitespace-nowrap"
                data-testid="filter-high"
              >
                High (70+)
              </Button>
              <Button
                size="sm"
                variant={filterScore === "medium" ? "default" : "outline"}
                onClick={() => setFilterScore("medium")}
                className="whitespace-nowrap"
                data-testid="filter-medium"
              >
                Medium (40-69)
              </Button>
              <Button
                size="sm"
                variant={filterScore === "low" ? "default" : "outline"}
                onClick={() => setFilterScore("low")}
                className="whitespace-nowrap"
                data-testid="filter-low"
              >
                Low (&lt;40)
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - No History */}
        {!loading && history.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Analysis History Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start analyzing supplements to see your history here. We'll track all your analyses so you can easily review them later.
            </p>
            <Button onClick={() => router.push("/scan")} data-testid="button-scan-first">
              Start First Analysis
            </Button>
          </Card>
        )}

        {/* History List */}
        {!loading && filteredHistory.length > 0 && (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
                onClick={() => handleViewAnalysis(item)}
                data-testid={`history-item-${item.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Score Display */}
                  <div className="flex-shrink-0">
                    <ScoreDisplay score={item.score} size="sm" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{item.productName}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {item.brand}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>

                      {item.totalSavings > 0 && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="w-3 h-3" />
                          ${item.totalSavings.toFixed(0)} saved
                        </span>
                      )}

                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {getInputTypeIcon(item.inputType)}
                        {item.inputType}
                      </Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results State - Search/Filter */}
        {!loading && history.length > 0 && filteredHistory.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No Results Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search term or filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterScore("all");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
