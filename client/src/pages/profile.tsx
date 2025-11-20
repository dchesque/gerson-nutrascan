import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Crown, DollarSign, Activity, Settings, LogOut, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStatus();
  }, []);

  const loadUserStatus = async () => {
    try {
      const { getUserStatusAPI } = await import("@/lib/api");
      const status = await getUserStatusAPI();
      setUserStatus(status);
    } catch (error) {
      console.error("Failed to load user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const mockUser = {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    isPremium: false,
    analysesUsed: 1,
    totalSavings: 0,
    totalAnalyses: 1,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const user = userStatus || mockUser;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-b from-primary/10 to-background border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarFallback className="text-2xl font-bold bg-primary/20">
                NS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading">NutraScan User</h1>
              <p className="text-muted-foreground">Anonymous Session</p>
              <Badge variant={user.isPremium ? "default" : "secondary"} className="mt-2">
                {user.isPremium ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : (
                  "Free Plan"
                )}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!user.isPremium && (
          <Card className="p-6 border-primary/50 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Unlimited analyses and save hundreds on supplements
                </p>
                <Button size="sm" onClick={() => setLocation("/subscribe")} data-testid="button-upgrade">
                  Upgrade Now - $9.99/mo
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-heading" data-testid="text-total-analyses">
              {user.totalAnalyses}
            </div>
            <div className="text-xs text-muted-foreground">Analyses</div>
          </Card>

          <Card className="p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-heading" data-testid="text-total-savings">
              ${user.totalSavings.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Saved</div>
          </Card>

          <Card className="p-4 text-center">
            <Crown className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold font-heading">
              {user.isPremium ? "∞" : user.freeAnalysesUsed}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.isPremium ? "Unlimited" : "Used"}
            </div>
          </Card>
        </div>

        <Card className="divide-y divide-border">
          <button
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover-elevate"
            onClick={() => console.log("Settings clicked")}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 font-medium">Settings</span>
          </button>

          <button
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover-elevate"
            onClick={() => setLocation("/subscribe")}
            data-testid="button-subscription"
          >
            <Crown className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 font-medium">
              {user.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
            </span>
          </button>

          <button
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover-elevate text-destructive"
            onClick={() => console.log("Sign out clicked")}
            data-testid="button-signout"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 font-medium">Sign Out</span>
          </button>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>NutraScan AI v1.0.0</p>
          <p className="mt-1">Making supplements transparent, one scan at a time</p>
        </div>
      </main>
    </div>
  );
}
