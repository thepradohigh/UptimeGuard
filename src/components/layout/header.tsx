'use client';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/monitors/new': 'New Monitor',
  '/monitors': 'Monitors',
  '/incidents': 'Incidents',
  '/settings': 'Settings',
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title =
    Object.entries(pageTitles).find(([p]) => pathname === p || pathname.startsWith(p + '/'))?.[1] ||
    'UptimeGuard';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-6 bg-surface/80 backdrop-blur-sm border-b border-border/40">
      <h1 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h1>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <div className="w-px h-5 bg-border mx-1" />
        <Avatar name={user?.name || user?.email || '?'} size="sm" />
      </div>
    </header>
  );
}
