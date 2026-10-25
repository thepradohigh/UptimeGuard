"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/monitors": "Monitors",
  "/monitors/new": "New Monitor",
  "/incidents": "Incidents",
  "/settings": "Settings",
};

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const title = Object.entries(pageTitles).find(([p]) => pathname === p || pathname.startsWith(p + "/"))?.[1] || "UptimeGuard";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 lg:px-8 border-b glass">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-accent"><Menu className="w-5 h-5" /></button>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}