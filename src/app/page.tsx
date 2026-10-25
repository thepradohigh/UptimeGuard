"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Bell, BarChart3, Zap, Globe } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: Activity, title: "Real-time Monitoring", description: "Check your endpoints every minute with instant status updates via WebSocket." },
    { icon: Bell, title: "Instant Alerts", description: "Get notified via Telegram or email the moment something goes down." },
    { icon: BarChart3, title: "Beautiful Dashboards", description: "Uptime charts, response time graphs, and incident history at a glance." },
    { icon: Zap, title: "Keyword Checks", description: "Verify response content, not just status codes. Catch hidden failures." },
    { icon: Globe, title: "Any HTTP Endpoint", description: "Monitor websites, APIs, health checks. GET, POST, custom headers - all supported." },
    { icon: Shield, title: "Self-hosted & Private", description: "Your data stays on your server. No third-party access, no subscriptions." },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">UptimeGuard</span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login">Sign In</Link></Button>
                  <Button asChild><Link href="/register">Get Started</Link></Button>
                </>
              )}
            </div>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />All systems operational
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Know when your<span className="gradient-text block">services go down</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Self-hosted uptime monitoring with beautiful dashboards, real-time alerts, and zero monthly fees. Deploy on your own server in minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>Start Monitoring</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <a href="https://github.com" target="_blank" rel="noopener">View on GitHub</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete monitoring solution without the complexity of enterprise tools or the limitations of free SaaS tiers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>UptimeGuard - Self-hosted uptime monitoring. Built with Next.js, PostgreSQL, and love.</p>
      </footer>
    </div>
  );
}