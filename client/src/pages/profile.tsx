import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Crown, DollarSign, Activity, Settings, LogOut, Loader2, Heart, Zap, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    healthGoals: "",
    allergies: "",
    medications: "",
    activityLevel: "",
    dietType: "",
  });

  useEffect(() => {
    loadUserStatus();
  }, []);

  const loadUserStatus = async () => {
    try {
      const { getUserStatusAPI } = await import("@/lib/api");
      const status = await getUserStatusAPI();
      setUserStatus(status);
      if (status?.profile) {
        setProfileData({
          age: status.profile.age?.toString() || "",
          weight: status.profile.weight?.toString() || "",
          height: status.profile.height?.toString() || "",
          gender: status.profile.gender || "",
          healthGoals: status.profile.healthGoals || "",
          allergies: status.profile.allergies || "",
          medications: status.profile.medications || "",
          activityLevel: status.profile.activityLevel || "",
          dietType: status.profile.dietType || "",
        });
      }
    } catch (error) {
      console.error("Failed to load user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your health profile has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
                <Button size="sm" onClick={() => setLocation("/pricing")} data-testid="button-upgrade">
                  Upgrade Now
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

        {/* Health Profile Section */}
        <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Your Health Profile</h3>
            </div>
            <Button
              size="sm"
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              disabled={isSaving}
              data-testid={isEditing ? "button-save-profile" : "button-edit-profile"}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save Profile
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Help us find supplements tailored specifically to your needs
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Age</label>
              <Input
                type="number"
                placeholder="e.g., 35"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                disabled={!isEditing}
                data-testid="input-age"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <Input
                placeholder="e.g., Male, Female, Other"
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                disabled={!isEditing}
                data-testid="input-gender"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
              <Input
                type="number"
                placeholder="e.g., 75"
                value={profileData.weight}
                onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                disabled={!isEditing}
                data-testid="input-weight"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Height (cm)</label>
              <Input
                type="number"
                placeholder="e.g., 180"
                value={profileData.height}
                onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                disabled={!isEditing}
                data-testid="input-height"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Activity Level</label>
              <Input
                placeholder="Sedentary, Light, Moderate, Active, Very Active"
                value={profileData.activityLevel}
                onChange={(e) => setProfileData({ ...profileData, activityLevel: e.target.value })}
                disabled={!isEditing}
                data-testid="input-activity"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Diet Type</label>
              <Input
                placeholder="Omnivore, Vegetarian, Vegan, Keto, etc"
                value={profileData.dietType}
                onChange={(e) => setProfileData({ ...profileData, dietType: e.target.value })}
                disabled={!isEditing}
                data-testid="input-diet"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Health Goals</label>
              <Textarea
                placeholder="e.g., Weight loss, Muscle gain, Immune support, Better sleep..."
                value={profileData.healthGoals}
                onChange={(e) => setProfileData({ ...profileData, healthGoals: e.target.value })}
                disabled={!isEditing}
                className="min-h-[80px]"
                data-testid="input-health-goals"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Allergies</label>
              <Textarea
                placeholder="Comma-separated, e.g., Soy, Gluten, Shellfish"
                value={profileData.allergies}
                onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                disabled={!isEditing}
                className="min-h-[60px]"
                data-testid="input-allergies"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Current Medications</label>
              <Textarea
                placeholder="Comma-separated, e.g., Aspirin, Vitamin D"
                value={profileData.medications}
                onChange={(e) => setProfileData({ ...profileData, medications: e.target.value })}
                disabled={!isEditing}
                className="min-h-[60px]"
                data-testid="input-medications"
              />
            </div>
          </div>
        </Card>

        <Card className="divide-y divide-border">
          <button
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover-elevate"
            onClick={() => setLocation("/settings")}
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
