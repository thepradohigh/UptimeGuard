"use client";
import React from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rounded-full" />
            <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/20 rounded-full" />
          </div>
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">UptimeGuard</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white mb-4">Monitor everything.<br />Miss nothing.</h2>
          <p className="text-lg text-white/70">Self-hosted uptime monitoring with real-time alerts and beautiful dashboards.</p>
        </div>
        <div className="relative text-sm text-white/50">(c) 2024 UptimeGuard</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}