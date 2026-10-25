'use client';

import { AuthProvider } from '@/lib/context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function BrandLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
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
  { name: 'Overview', href: '/dashboard' },
  { name: 'Monitors', href: '/monitors' },
  { name: 'Incidents', href: '/incidents' },
  { name: 'Settings', href: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="flex h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 flex flex-col hidden md:flex">
          <div className="h-14 flex items-center px-6 border-b border-white/5">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <BrandLogo className="w-5 h-5 text-white" />
              <span className="text-[14px] font-semibold tracking-tight text-white">
                UptimeGuard
              </span>
            </Link>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-white truncate">Admin</div>
                <div className="text-[10px] text-zinc-500 font-mono">Self-Hosted</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0A]">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-zinc-500">Workspace</span>
              <span className="text-zinc-700">/</span>
              <span className="text-white font-medium capitalize">
                {pathname.split('/').filter(Boolean)[0] || 'Dashboard'}
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
