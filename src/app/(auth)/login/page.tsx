'use client';

import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';
import { useState } from 'react';

function BrandLogo({ className = 'w-6 h-6' }: { className?: string }) {
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

export default function LoginPage() {
  const [email, setEmail] = useState('admin@uptimeguard.dev');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Имитация API запроса
    setTimeout(() => {
      login('dummy_token_123', { email, name: 'Admin' });
      window.location.href = '/dashboard';
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-6 selection:bg-white/20">
      <div className="w-full max-w-[360px]">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
            <BrandLogo className="w-10 h-10 text-white" />
          </Link>
          <h1 className="font-serif-display text-4xl text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-500 text-[14px]">
            Enter your credentials to access your workspace.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 bg-black border border-white/10 rounded-lg px-4 text-[14px] text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 bg-black border border-white/10 rounded-lg px-4 text-[14px] text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 bg-white text-black font-medium text-[14px] rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-zinc-500 mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Create workspace
          </Link>
        </p>
      </div>
    </div>
  );
}
