import Link from 'next/link';

/* ─── Modern Brand Logo ─── */
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

/* ─── Tech Stack SVG Logos ─── */
const TECH_STACK = [
  {
    name: 'Next.js',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
        <circle cx="64" cy="64" r="64" />
        <path d="M108 102L52 36V96H42V32H53L102 96V32H112V102H108Z" fill="#0A0A0A" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119c.695 0 1.259.56 1.259 1.255 0 .697-.564 1.256-1.259 1.256h-2.119a1.255 1.255 0 110-2.511zm-2.73 0h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm-2.73 0h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm-2.73 0h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm2.73-2.724h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm0-2.727h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm2.73 2.727h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm0-2.727h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zm2.73 2.727h2.119a1.255 1.255 0 110 2.511h-2.119a1.255 1.255 0 110-2.511zM23.99 12.418c-.525-.341-1.173-.525-1.822-.525h-.411v-2.136c0-.505-.402-.916-.908-.916H5.45c-.505 0-.908.411-.908.916v8.257c0 .505.403.916.908.916h16.299c.506 0 .908-.411.908-.916v-.052c.052-.097.104-.189.156-.285.597-1.254 1.284-2.488 1.284-3.83 0-.525-.104-1.014-.298-1.429z" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.088 11.235c-.183-.346-.436-.66-.755-.921l-.75-.6c-.528-.435-1.157-.74-1.834-.89-.356-.08-.72-.119-1.085-.119h-.44l-.244-.244a3.834 3.834 0 00-2.712-1.123H8.354a3.834 3.834 0 00-3.834 3.834v1.898c0 .356.119.72.316 1.035l1.834 2.822c.396.607 1.035 1.01 1.755 1.123.183.025.356.04.528.04h5.66c.72 0 1.4-.264 1.94-.75l.75-.6c.32-.26.572-.575.755-.92.183-.346.284-.741.284-1.157v-1.898c0-.416-.1-.811-.284-1.157z" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm11.753 10.366h3.635v1.272h-1.393v7.351h-1.429v-7.351h-1.393v-1.272zm5.82 2.62c.594 0 1.083.182 1.468.546.385.364.606.862.663 1.494h-1.383c-.04-.325-.164-.576-.37-.753-.207-.177-.478-.265-.813-.265-.33 0-.6.082-.81.246-.21.164-.315.385-.315.663 0 .227.07.413.21.558.14.145.39.278.75.4l.675.228c.78.263 1.348.583 1.703.96.355.377.533.865.533 1.464 0 .825-.28 1.488-.84 1.989-.56.501-1.32.752-2.28.752-.89 0-1.638-.242-2.245-.726-.607-.484-.935-1.182-.984-2.094h1.416c.045.5.215.88.51 1.14.295.26.713.39 1.254.39.385 0 .707-.095.966-.285.259-.19.389-.452.389-.786 0-.253-.08-.454-.24-.603-.16-.149-.432-.295-.816-.438l-.63-.228c-.76-.273-1.308-.592-1.644-.957-.336-.365-.504-.827-.504-1.386 0-.74.267-1.345.801-1.815.534-.47 1.25-.705 2.148-.705z" />
      </svg>
    ),
  },
  {
    name: 'Socket.io',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.967 19.336L8.13 13.5h3.693L9.75 4.664l5.837 5.836h-3.693l2.073 8.836z" />
      </svg>
    ),
  },
  {
    name: 'Prisma',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.285 17.585L12.56 1.703a.625.625 0 0 0-1.12 0L.375 20.301a.625.625 0 0 0 .56.899h14.881a.625.625 0 0 0 .56-.352l3.909-3.263a.625.625 0 0 0 0-.899zM12 4.148l6.19 12.727H12V4.148zM2.385 19.95L10.75 4.776v15.174H2.385z" />
      </svg>
    ),
  },
];

/* ─── Helpers ─── */
function getEventDotColor(type: string) {
  if (type === 'down') return 'bg-red-500';
  if (type === 'alert') return 'bg-amber-400';
  if (type === 'resolved') return 'bg-zinc-300';
  return 'bg-zinc-600';
}

/* ─── MacBook Wrapper Component ─── */
function MacBook({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-4xl pt-8 md:pt-12">
      <div className="relative rounded-2xl md:rounded-[2rem] bg-[#141414] p-2 md:p-3 shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-2 md:top-3 left-1/2 z-20 flex h-3 md:h-4 w-16 md:w-24 -translate-x-1/2 items-center justify-center rounded-b-lg bg-black">
          <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-white/10" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl md:rounded-[1.2rem] bg-[#0A0A0A] border border-white/5">
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          <div className="h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
        </div>
      </div>

      <div className="relative -left-[5%] mt-1 h-3 md:h-4 w-[110%] rounded-t-sm rounded-b-xl bg-gradient-to-b from-[#222] to-[#0A0A0A] border-t border-white/10 shadow-[0_40px_80px_rgba(0,0,0,1)]">
        <div className="absolute left-1/2 top-0 h-full w-24 md:w-32 -translate-x-1/2 rounded-t-sm bg-[#111]" />
      </div>
    </div>
  );
}

/* ─── Mockups ─── */
const MOCK_MONITORS = [
  { name: 'api.production', status: 'up', uptime: '99.98', ms: '23ms' },
  { name: 'web.frontend', status: 'up', uptime: '100.0', ms: '45ms' },
  { name: 'db.primary', status: 'up', uptime: '99.95', ms: '8ms' },
  { name: 'auth.service', status: 'down', uptime: '97.20', ms: '—' },
  { name: 'cdn.edge-eu', status: 'up', uptime: '100.0', ms: '4ms' },
];

function UptimeBar({ bars }: { bars: number[] }) {
  return (
    <div className="flex items-end gap-[3px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[4px] md:w-[6px] rounded-[1px] ${
            h === 100 ? 'bg-zinc-200' : h > 95 ? 'bg-zinc-600' : 'bg-red-500'
          }`}
          style={{ height: `${Math.max(h * 0.28, 6)}px` }}
        />
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="h-full bg-[#0A0A0A] text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          Monitors
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <span className="font-mono text-[11px] font-medium text-zinc-400">Live Sync</span>
        </div>
      </div>
      <div className="divide-y divide-white/5 px-6">
        {MOCK_MONITORS.map((m) => (
          <div key={m.name} className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div
                className={`h-2.5 w-2.5 rounded-full ${m.status === 'up' ? 'bg-zinc-300' : 'bg-red-500'}`}
              />
              <span className="font-mono text-[13px] font-medium text-zinc-200">{m.name}</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden sm:block">
                <UptimeBar bars={[100, 100, 98, 100, 85, 100, 100, 100, 100, 100]} />
              </div>
              <span
                className={`w-14 text-right font-mono text-[13px] font-medium tabular-nums ${m.status === 'up' ? 'text-zinc-500' : 'text-red-500'}`}
              >
                {m.uptime}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartMockup() {
  return (
    <div className="h-full flex flex-col bg-[#0A0A0A]">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
        <div>
          <span className="text-[15px] font-medium text-zinc-100">Response Time</span>
          <span className="ml-3 text-[13px] text-zinc-500">api.production</span>
        </div>
        <div className="flex gap-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          <span>
            Min: <span className="text-zinc-300">12ms</span>
          </span>
          <span>
            Avg: <span className="text-zinc-300">32ms</span>
          </span>
          <span>
            Max: <span className="text-zinc-300">85ms</span>
          </span>
        </div>
      </div>
      <div className="relative flex-1 px-6 py-8 flex items-end gap-[4px] min-h-[250px]">
        {[40, 30, 60, 45, 90, 65, 30, 40, 50, 35, 70, 50, 40, 20, 80, 50, 40, 30, 60, 45].map(
          (v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-white/5 hover:bg-white transition-colors relative group cursor-pointer"
              style={{ height: `${v}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black font-mono text-[10px] font-medium px-2 py-1 rounded hidden group-hover:block z-20">
                {v}ms
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function IncidentTimelineMockup() {
  const events = [
    { time: '08:15:22', type: 'resolved', text: 'Service recovered automatically.' },
    { time: '08:05:00', type: 'alert', text: 'Telegram alert sent to On-Call team.' },
    { time: '08:00:45', type: 'check', text: 'Check failed from edge-eu. Confirming...' },
    { time: '08:00:15', type: 'down', text: 'Connection timeout on db.primary' },
  ];

  return (
    <div className="h-full bg-[#0A0A0A] p-6 md:p-10">
      <div className="mb-10">
        <h3 className="text-[17px] font-medium text-zinc-100">Incident #402: Database Timeout</h3>
        <p className="font-mono text-[12px] text-zinc-500 mt-2">Duration: 15m 07s</p>
      </div>
      <div className="relative pl-6 space-y-8 border-l border-white/10">
        {events.map((ev, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0A0A] ring-1 ring-white/10 ${getEventDotColor(ev.type)}`}
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <span className="font-mono text-[12px] text-zinc-500 tabular-nums">{ev.time}</span>
              <span className="text-[14px] text-zinc-300">{ev.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans">
      {/* ─── NAV ─── */}
      <nav className="border-b border-white/[0.08] sticky top-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <BrandLogo />
            <span className="text-[14px] font-semibold tracking-tight text-white">UptimeGuard</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#incidents"
              className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Incidents
            </Link>
            <Link
              href="https://github.com/thepradohigh/UptimeGuard#readme"
              target="_blank"
              className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Documentation
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="h-8 inline-flex items-center justify-center px-4 rounded-md bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="mx-auto max-w-[1440px] px-6 pt-24 pb-20 md:pt-36 md:pb-28 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <h1 className="font-serif-display text-[52px] sm:text-[80px] lg:text-[110px] leading-[0.9] tracking-[-0.03em] text-white mb-8">
            Infrastructure,
            <br /> <span className="text-zinc-600">beautifully monitored.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Self-hosted uptime monitoring built for modern engineering teams. No subscriptions, no
            data limits. Just pure performance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="h-11 inline-flex items-center justify-center px-8 rounded-lg bg-white text-black text-[15px] font-medium hover:bg-zinc-200 transition-all w-full sm:w-auto"
            >
              Deploy in 5 minutes
            </Link>
            <Link
              href="https://github.com/thepradohigh/UptimeGuard"
              target="_blank"
              className="h-11 inline-flex items-center justify-center px-8 rounded-lg bg-transparent border border-white/10 text-white text-[15px] font-medium hover:bg-white/5 transition-all w-full sm:w-auto"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        <MacBook>
          <DashboardMockup />
        </MacBook>
      </section>

      {/* ─── TECH PILLS WITH LOGOS ─── */}
      <section className="border-y border-white/5 bg-[#0A0A0A] py-14">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-[13px] font-medium text-zinc-500 text-center mb-8">
            Built on reliable, modern primitives
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 text-[13px] font-medium flex items-center gap-2.5 hover:border-white/20 hover:bg-white/5 transition-all cursor-default"
              >
                <span className="text-zinc-300">{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE: CHART ─── */}
      <section id="features" className="mx-auto max-w-[1440px] px-6 py-28 md:py-40 lg:px-12">
        <div className="grid grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
            <h2 className="font-serif-display text-[40px] sm:text-[56px] leading-[0.95] tracking-[-0.02em] text-white">
              Identify latency <br />
              <span className="text-zinc-600">before the outage.</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              Track response times globally. Identify latency spikes and optimize your
              infrastructure before a full incident occurs.
            </p>
            <ul className="mt-10 space-y-5">
              {[
                'Sub-minute HTTP, TCP, and DNS checks',
                '90-day data retention stored locally',
                'WebSocket real-time dashboard updates',
              ].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-[15px] font-medium text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
            <MacBook>
              <ChartMockup />
            </MacBook>
          </div>
        </div>
      </section>

      {/* ─── FEATURE: INCIDENTS ─── */}
      <section
        id="incidents"
        className="border-t border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] py-28 md:py-40"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="col-span-12 lg:col-span-7">
              <MacBook>
                <IncidentTimelineMockup />
              </MacBook>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <h2 className="font-serif-display text-[40px] sm:text-[56px] leading-[0.95] tracking-[-0.02em] text-white">
                Trace every drop <br />
                down to the <span className="text-zinc-600">second.</span>
              </h2>
              <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
                Automatic incident timelines log exactly when a service went down, when alerts were
                triggered, and when it recovered.
              </p>
              <ul className="mt-10 space-y-5">
                {[
                  'Instant Telegram & Email escalation',
                  'Automated root-cause correlation',
                  'Public status pages for your users',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-[15px] font-medium text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SETUP TERMINAL ─── */}
      <section className="border-t border-white/5 mx-auto max-w-[1440px] px-6 py-28 md:py-40 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif-display text-[40px] sm:text-[56px] leading-[0.95] tracking-[-0.02em] text-white">
            Three commands.
          </h2>
          <p className="mt-5 text-lg text-zinc-400">
            No complex config files, no API keys. Clone, start, done.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#050505] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-white/5 px-5 py-4 bg-white/[0.02]">
            <div className="h-3 w-3 rounded-full bg-white/10" />
            <div className="h-3 w-3 rounded-full bg-white/10" />
            <div className="h-3 w-3 rounded-full bg-white/10" />
            <span className="ml-3 font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Terminal
            </span>
          </div>
          <div className="p-8 md:p-12 space-y-5 font-mono text-[14px] md:text-[15px] text-zinc-300">
            <p className="flex items-start gap-4">
              <span className="text-zinc-600 select-none">$</span>
              <span>git clone https://github.com/thepradohigh/UptimeGuard</span>
            </p>
            <p className="flex items-start gap-4">
              <span className="text-zinc-600 select-none">$</span>
              <span>docker compose up -d</span>
            </p>
            <p className="flex items-start gap-4">
              <span className="text-zinc-600 select-none">$</span>
              <span>open http://localhost:3000</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden border-t border-white/5 bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 py-32 md:py-48 text-center lg:px-12">
          <h2 className="font-serif-display text-[48px] sm:text-[72px] leading-[0.9] tracking-[-0.03em] text-white">
            Stop paying for uptime.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
            Deploy UptimeGuard on your own servers today. Complete data ownership, completely free.
          </p>
          <div className="mt-12 flex justify-center">
            <Link
              href="/register"
              className="h-12 inline-flex items-center justify-center px-10 rounded-lg bg-white text-black text-[15px] font-medium hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MODERN FOOTER ─── */}
      <footer className="bg-[#0A0A0A] pt-24 pb-12 border-t border-white/5">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-20">
            {/* Brand Col */}
            <div className="col-span-1 md:col-span-4 lg:col-span-5 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <BrandLogo className="w-8 h-8 text-white" />
                <span className="text-[18px] font-semibold tracking-tight text-white">
                  UptimeGuard
                </span>
              </div>
              <p className="text-zinc-500 text-[14px] leading-relaxed max-w-sm mb-8">
                Infrastructure monitoring for engineering teams. Build, deploy, and monitor without
                limits.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com/thepradohigh/UptimeGuard"
                  target="_blank"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Links Cols */}
            <div className="col-span-1 md:col-span-2 md:col-start-7 lg:col-start-8">
              <h4 className="font-semibold mb-5 text-white text-[14px]">Product</h4>
              <ul className="space-y-3.5 text-[14px] text-zinc-500">
                <li>
                  <Link href="#features" className="hover:text-zinc-300 transition-colors">
                    Uptime Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="#incidents" className="hover:text-zinc-300 transition-colors">
                    Incident Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-zinc-300 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-zinc-300 transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold mb-5 text-white text-[14px]">Developers</h4>
              <ul className="space-y-3.5 text-[14px] text-zinc-500">
                <li>
                  <Link
                    href="https://github.com/thepradohigh/UptimeGuard#readme"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/thepradohigh/UptimeGuard/tree/main/src/app/api"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/thepradohigh/UptimeGuard"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    GitHub Repository
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold mb-5 text-white text-[14px]">Community</h4>
              <ul className="space-y-3.5 text-[14px] text-zinc-500">
                <li>
                  <Link
                    href="https://github.com/thepradohigh/UptimeGuard/issues"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/thepradohigh/UptimeGuard/pulls"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Pull Requests
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/thepradohigh"
                    target="_blank"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Author Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-zinc-500">
              © {new Date().getFullYear()} UptimeGuard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
