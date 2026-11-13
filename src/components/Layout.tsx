import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  LayoutGrid,
  Database,
  Braces,
  Zap,
  Globe,
  Radio,
  Layers,
} from 'lucide-react';
import { FALCO_PAGES, getPageByPath } from '@/data/pages';
import { RibbonBackground } from '@/components/animations/RibbonBackground';
import SpecularButton from '@/components/SpecularButton';
import { FalcoLogo } from '@/components/FalcoLogo';

const ADMIN_PORTAL_URL = 'https://falcostack-admin.vercel.app/';

interface LayoutProps {
  children: React.ReactNode;
}

const PAGE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  overview: LayoutGrid,
  database: Database,
  'dynamic-db': Braces,
  apis: Zap,
  hosting: Globe,
  'live-sync': Radio,
  'edge-pricing': Layers,
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activePage = getPageByPath(pathname);

  // Track scroll position to enhance header backdrop blur and elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#030407] text-zinc-100">
      {/* Full-viewport LightTunnel Background mapped per route */}
      <RibbonBackground tunnelProps={activePage.tunnelProps} />

      {/* Top Glass Header - Fixed to viewport so it remains visible while scrolling down */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/15 bg-black/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.85)]'
            : 'border-b border-white/10 bg-black/55 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-500/30 bg-black/40 shadow-inner transition-transform duration-300 group-hover:scale-105"
              style={{ boxShadow: `0 0 18px -4px #eab308` }}
            >
              <FalcoLogo size={24} />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Falco<span className="text-zinc-400">Stack</span>
            </span>
          </Link>

          {/* Desktop Nav with Icons and Options */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {FALCO_PAGES.map((page) => {
              const Icon = PAGE_ICONS[page.id] || LayoutGrid;
              return (
                <NavLink
                  key={page.id}
                  to={page.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className="h-3.5 w-3.5 transition-colors duration-200"
                        style={{
                          color: isActive ? page.accentColor : undefined,
                        }}
                      />
                      <span>{page.navLabel}</span>
                      {isActive && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: page.accentColor }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Top Auth Actions (Direct to https://falcostack-admin.vercel.app/) */}
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href={ADMIN_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                Log In
              </a>
              <SpecularButton
                size="sm"
                radius={12}
                tint={activePage.accentColor}
                tintOpacity={0.12}
                blur={12}
                textColor="#ffffff"
                lineColor={activePage.accentColor}
                baseColor="#3f3f46"
                intensity={1}
                idleIntensity={0.38}
                onClick={() => window.open(ADMIN_PORTAL_URL, '_blank', 'noopener,noreferrer')}
              >
                Sign Up
              </SpecularButton>
            </div>

            {/* Quick Mobile Auth Button */}
            <a
              href={ADMIN_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 sm:hidden"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </a>

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-200 lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-black/95 px-4 py-4 backdrop-blur-2xl lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {FALCO_PAGES.map((page) => {
                const Icon = PAGE_ICONS[page.id] || LayoutGrid;
                return (
                  <NavLink
                    key={page.id}
                    to={page.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        isActive
                          ? 'border-white/25 bg-white/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-zinc-300'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <span className="flex items-center gap-2">
                        <Icon
                          className="h-4 w-4"
                          style={{
                            color: isActive ? page.accentColor : undefined,
                          }}
                        />
                        <span>{page.navLabel}</span>
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
              <a
                href={ADMIN_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-medium text-zinc-200 transition hover:bg-white/10"
              >
                Log In
              </a>
              <a
                href={ADMIN_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-black shadow-lg transition"
                style={{ backgroundColor: activePage.accentColor }}
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with top offset matching fixed header */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 py-10 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-display)] font-semibold text-zinc-200">
              FalcoStack Cloud
            </span>
            <span>•</span>
            <span>Database • Dynamic DB • APIs • Hosting • Live Sync</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              38 Edge PoPs Operational
            </span>
            <span className="text-zinc-500">Autonomous Cloud Fabric</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
