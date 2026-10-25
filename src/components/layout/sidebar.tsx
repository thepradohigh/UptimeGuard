'use client';
import { Avatar } from '@/components/Avatar';
import { LogoMark } from '@/components/Logo';
import { useAuth } from '@/components/providers/auth-provider';
import { useWebSocket } from '@/components/providers/websocket-provider';
import { cn } from '@/lib/utils';
import { AlertTriangle, LayoutDashboard, LogOut, Monitor, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/monitors', label: 'Monitors', icon: Monitor },
  { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isConnected } = useWebSocket();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-[240px] bg-card border-r border-border/60 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border/40 shrink-0">
        <LogoMark size={26} className="text-primary" />
        <span className="font-semibold text-[15px] tracking-tight text-foreground">
          UptimeGuard
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-blue-light text-blue'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px]', isActive && 'text-blue')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-border/40">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar name={user?.name || user?.email || '?'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-1.5 mt-1 rounded-lg text-[13px] text-muted-foreground hover:bg-red-light hover:text-red transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* Status */}
      <div className="px-5 py-2.5 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isConnected ? 'bg-green' : 'bg-muted-foreground/40',
            )}
          />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
}
