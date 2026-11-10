import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CloudLightning, Menu, X } from 'lucide-react';
import { FALCO_PAGES, getPageByPath } from '@/data/pages';
import { RibbonBackground } from '@/components/animations/RibbonBackground';
import SpecularButton from '@/components/SpecularButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePage = getPageByPath(pathname);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030407] text-zinc-100">
      {/* Full-viewport LightTunnel Background mapped per route */}
      <RibbonBackground tunnelProps={activePage.tunnelProps} />

      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 shadow-inner"
              style={{ boxShadow: `0 0 18px -4px ${activePage.accentColor}` }}
            >
              <CloudLightning
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: activePage.accentColor }}
              />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Falco<span className="text-zinc-400">Stack</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {FALCO_PAGES.map((page) => (
              <NavLink
                key={page.id}
                to={page.path}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5">
                    {isActive && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: page.accentColor }}
                      />
                    )}
                    <span>{page.navLabel}</span>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Top CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
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
                onClick={() => navigate('/edge-pricing')}
              >
                Deploy Stack
              </SpecularButton>
            </div>

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
          <div className="border-t border-white/10 bg-black/85 px-4 py-4 backdrop-blur-2xl lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {FALCO_PAGES.map((page) => (
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
                  <span>{page.navLabel}</span>
                  <span className="font-mono text-[10px] uppercase text-zinc-400">
                    {page.presetLabel}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
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
            <span className="text-zinc-500">Preset: {activePage.presetLabel}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
