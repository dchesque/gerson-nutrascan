"use client"

import { Home, Camera, Clock, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function BottomNav() {
  const location = usePathname()

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/scan", icon: Camera, label: "Scan" },
    { path: "/history", icon: Clock, label: "History" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50" data-testid="nav-bottom">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg min-w-[72px] hover-elevate ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
