import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Bell, Moon, Globe, Lock, Info, HelpCircle, LogOut, ChevronRight, Loader2, User, Mail, Phone, Eye, EyeOff, Camera, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { updateUserAccountAPI } from "@/lib/api";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "en",
    priceAlerts: true,
    dataCollection: true,
  });

  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    loadSettings();
    loadAccountInfo();
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

  const loadAccountInfo = async () => {
    try {
      const { getUserStatusAPI } = await import("@/lib/api");
      const status = await getUserStatusAPI();
      if (status?.account) {
        setAccountData({
          name: status.account.name || "",
          email: status.account.email || "",
          phone: status.account.phone || "",
          profileImage: status.account.profileImage || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPhotoPreview(status.account.profileImage || "");
      }
    } catch (error) {
      console.error("Failed to load account info:", error);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      setAccountData({ ...accountData, profileImage: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setAccountData({ ...accountData, profileImage: "" });
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem("nutrascan-settings", JSON.stringify(newSettings));
  };

  const handleSaveAccount = async () => {
    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsSavingAccount(true);
    try {
      await updateUserAccountAPI({
        name: accountData.name,
        phone: accountData.phone,
        profileImage: accountData.profileImage || null,
      });
      setIsEditingAccount(false);
      setIsEditingPhoto(false);
      toast({
        title: "Account Updated",
        description: "Your account information has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save account information",
        variant: "destructive",
      });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
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
        {/* Account Info Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-heading">Account Information</h2>
            <Button
              size="sm"
              variant={isEditingAccount || isEditingPhoto ? "default" : "outline"}
              onClick={() => {
                if (isEditingAccount || isEditingPhoto) {
                  handleSaveAccount();
                } else {
                  setIsEditingAccount(true);
                }
              }}
              disabled={isSavingAccount}
              data-testid="button-edit-account"
            >
              {isSavingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : isEditingAccount || isEditingPhoto ? (
                "Save Account"
              ) : (
                "Edit Account"
              )}
            </Button>
          </div>

          <Card className="p-6 space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={photoPreview} alt="Profile" />
                <AvatarFallback className="text-2xl font-bold bg-primary/20">
                  {accountData.name
                    ? accountData.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : "NS"}
                </AvatarFallback>
              </Avatar>

              {isEditingAccount && (
                <div className="w-full space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="photo-input"
                    data-testid="input-photo"
                  />
                  <div className="flex gap-2 justify-center">
                    <label htmlFor="photo-input">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="cursor-pointer"
                        data-testid="button-edit-photo"
                      >
                        <span>
                          <Camera className="w-4 h-4 mr-1" />
                          Edit Photo
                        </span>
                      </Button>
                    </label>
                    {photoPreview && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRemovePhoto}
                        className="text-destructive hover:text-destructive"
                        data-testid="button-remove-photo"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {photoPreview ? "Photo selected" : "No photo selected"}
                  </p>
                </div>
              )}
            </div>

            {/* Account Info Fields */}
            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Your name"
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    disabled={!isEditingAccount}
                    data-testid="input-name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    disabled={!isEditingAccount}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                    disabled={!isEditingAccount}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              {isEditingAccount && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm font-medium mb-4 text-muted-foreground">Change Password (Optional)</p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Current Password</label>
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1 relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              value={accountData.currentPassword}
                              onChange={(e) =>
                                setAccountData({ ...accountData, currentPassword: e.target.value })
                              }
                              data-testid="input-current-password"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">New Password</label>
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={accountData.newPassword}
                            onChange={(e) =>
                              setAccountData({ ...accountData, newPassword: e.target.value })
                            }
                            data-testid="input-new-password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1 relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={accountData.confirmPassword}
                              onChange={(e) =>
                                setAccountData({
                                  ...accountData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              data-testid="input-confirm-password"
                            />
                            <button
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </section>

        {/* Notifications & Alerts Section */}
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
                  handleLogout();
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
