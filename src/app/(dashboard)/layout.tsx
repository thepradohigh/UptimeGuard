'use client';

import { AuthProvider, useAuth } from '@/lib/context/auth-context';
import {
  Activity,
  AlertTriangle,
  ExternalLink,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function BrandLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12H6.5L9 3L15 21L17.5 12H22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navItems = [
  { name: 'Обзор', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Мониторы', href: '/monitors', icon: Activity },
  { name: 'Инциденты', href: '/incidents', icon: AlertTriangle },
  { name: 'Настройки', href: '/settings', icon: Settings },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-[#D4FF4F] selection:text-black">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 text-white">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#D4FF4F]">
            <BrandLogo className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-wider">UptimeGuard</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-lg border border-white/10 bg-zinc-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-zinc-950/50 p-4 shrink-0 min-h-screen justify-between sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#D4FF4F] group-hover:scale-105 transition-transform">
                <BrandLogo className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-wider block">
                  UptimeGuard
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Console v1.0
                </span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-3 py-2">
              Навигация
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4FF4F]' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-3 py-2">
              Публичный доступ
            </div>
            <a
              href="/status"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-zinc-500" />
                <span>Status Page</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
          </div>
        </div>

        {/* Profile & Logout Section */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-white truncate">
                {user?.email || 'admin@uptimeguard.dev'}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Авторизован
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/30 text-xs font-mono font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Выйти из системы</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/10 px-4 py-4 space-y-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4FF4F]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono truncate max-w-[200px]">
              {user?.email || 'admin@uptimeguard.dev'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Выйти
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-zinc-950/30">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>UptimeGuard</span>
            <span>/</span>
            <span className="text-white capitalize">
              {pathname === '/dashboard' ? 'Обзор системы' : pathname.replace('/', '')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/status"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4FF4F]" />
              <span>Публичная страница</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-xs font-mono text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
