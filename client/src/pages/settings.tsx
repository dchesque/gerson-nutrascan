import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Bell, Moon, Globe, Lock, Info, HelpCircle, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "en",
    priceAlerts: true,
    dataCollection: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = localStorage.getItem("nutrascan-settings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem("nutrascan-settings", JSON.stringify(newSettings));
  };

  const toggleNotifications = () => {
    const updated = { ...settings, notifications: !settings.notifications };
    saveSettings(updated);
  };

  const toggleDarkMode = () => {
    const updated = { ...settings, darkMode: !settings.darkMode };
    saveSettings(updated);
    if (updated.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const togglePriceAlerts = () => {
    const updated = { ...settings, priceAlerts: !settings.priceAlerts };
    saveSettings(updated);
  };

  const toggleDataCollection = () => {
    const updated = { ...settings, dataCollection: !settings.dataCollection };
    saveSettings(updated);
  };

  const handleLanguageChange = (lang: string) => {
    const updated = { ...settings, language: lang };
    saveSettings(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-b from-primary/10 to-background border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/profile")}
              className="text-primary hover:opacity-75 transition-opacity"
              data-testid="button-back"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold font-heading">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold font-heading">Notifications & Alerts</h2>
          
          <Card className="divide-y divide-border">
            <div className="px-4 py-4 flex items-center justify-between hover-elevate cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive app alerts and updates</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={toggleNotifications}
                data-testid="toggle-notifications"
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between hover-elevate cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Price Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when supplement prices drop</p>
                </div>
              </div>
              <Switch
                checked={settings.priceAlerts}
                onCheckedChange={togglePriceAlerts}
                data-testid="toggle-price-alerts"
              />
            </div>
          </Card>
        </section>

        {/* Display Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold font-heading">Display</h2>
          
          <Card className="divide-y divide-border">
            <div className="px-4 py-4 flex items-center justify-between hover-elevate cursor-pointer">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme</p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={toggleDarkMode}
                data-testid="toggle-dark-mode"
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Choose your language</p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm font-medium"
                data-testid="select-language"
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </Card>
        </section>

        {/* Privacy Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold font-heading">Privacy & Data</h2>
          
          <Card className="divide-y divide-border">
            <div className="px-4 py-4 flex items-center justify-between hover-elevate cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve our app with usage data</p>
                </div>
              </div>
              <Switch
                checked={settings.dataCollection}
                onCheckedChange={toggleDataCollection}
                data-testid="toggle-analytics"
              />
            </div>

            <button
              className="w-full px-4 py-4 flex items-center justify-between hover-elevate text-left"
              data-testid="button-privacy-policy"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Privacy Policy</p>
                  <p className="text-sm text-muted-foreground">Read our privacy terms</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              className="w-full px-4 py-4 flex items-center justify-between hover-elevate text-left"
              data-testid="button-terms"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Terms of Service</p>
                  <p className="text-sm text-muted-foreground">View our terms and conditions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* About Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold font-heading">About</h2>
          
          <Card className="divide-y divide-border">
            <button
              className="w-full px-4 py-4 flex items-center justify-between hover-elevate text-left"
              data-testid="button-about-app"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">About NutraScan AI</p>
                  <p className="text-sm text-muted-foreground">v1.0.0 - Build 2025.11</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              className="w-full px-4 py-4 flex items-center justify-between hover-elevate text-left"
              data-testid="button-contact-support"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get help or report issues</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold font-heading text-destructive">Danger Zone</h2>
          
          <Card className="border-destructive/20 bg-destructive/5">
            <button
              className="w-full px-4 py-4 flex items-center justify-between hover-elevate text-left"
              onClick={() => {
                if (confirm("Are you sure you want to sign out?")) {
                  console.log("Sign out clicked");
                  // Add sign out logic here
                }
              }}
              data-testid="button-signout-settings"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Sign Out</p>
                  <p className="text-sm text-muted-foreground">End your current session</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive" />
            </button>
          </Card>
        </section>

        <div className="text-center text-xs text-muted-foreground py-6">
          <p>All your preferences are saved locally on this device</p>
        </div>
      </main>
    </div>
  );
}
