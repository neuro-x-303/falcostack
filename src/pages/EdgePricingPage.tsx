import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Layers, Server } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

const TIERS = [
  {
    name: 'Developer Edge',
    price: '₹0',
    period: '/ month',
    accent: '#34d399',
    summary: 'Everything needed to prototype Database, Dynamic DB, APIs, Hosting, and Live Sync.',
    features: [
      '3 Postgres branches + 5 GB NVMe',
      '1M Edge API requests / month',
      '100K Live Sync messages / day',
      '38 Global PoPs with free TLS',
    ],
  },
  {
    name: 'Production Scale',
    price: '₹4,099',
    period: '/ month + usage',
    accent: '#60a5fa',
    summary: 'Multi-region high-availability clusters with automatic read replicas and vector search.',
    features: [
      'Unlimited Copy-on-Write DB branches',
      '25M Edge API isolates included',
      'Sub-12ms CRDT Live Sync rooms',
      '30-day continuous PITR snapshots',
    ],
  },
  {
    name: 'Dedicated Fabric',
    price: 'Custom',
    period: '99.999% SLA',
    accent: '#c084fc',
    summary: 'Single-tenant bare-metal NVMe mesh, BYOC peering, and dedicated solutions engineering.',
    features: [
      'Private VPC & WireGuard peering',
      'Custom compliance (SOC2 / HIPAA)',
      'Dedicated multi-region failover',
      '24/7 sub-15-minute response SLA',
    ],
  },
];

const MODULE_BENTO_ITEMS: Array<MagicBentoItem & { path: string }> = FALCO_PAGES.map((item, idx) => ({
  id: item.id,
  path: item.path,
  colSpan: idx === 0 ? 2 : 1,
  icon: (
    <span
      className="h-2.5 w-2.5 rounded-full"
      style={{
        backgroundColor: item.accentColor,
        boxShadow: `0 0 10px ${item.accentColor}`,
      }}
    />
  ),
  label: `${item.presetLabel} • ${item.latency}`,
  title: `${item.navLabel} Module`,
  description: item.badge,
}));

export const EdgePricingPage: React.FC = () => {
  const page = FALCO_PAGES[6];
  const navigate = useNavigate();
  const [monthlyMillions, setMonthlyMillions] = useState(15);
  const [storageGb, setStorageGb] = useState(50);
  const navTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current !== null) {
        window.clearTimeout(navTimerRef.current);
      }
    };
  }, []);

  const estimatedCostUsd = Math.max(29, Math.round(monthlyMillions * 1.4 + storageGb * 0.25));
  const estimatedCostInr = estimatedCostUsd * 83;

  const handleModuleClick = (clicked: MagicBentoItem) => {
    const match = MODULE_BENTO_ITEMS.find((m) => m.id === clicked.id);
    if (!match) return;
    if (navTimerRef.current !== null) {
      window.clearTimeout(navTimerRef.current);
    }
    navTimerRef.current = window.setTimeout(() => {
      navigate(match.path);
    }, 220);
  };

  return (
    <div className="space-y-16">
      <PageHero
        page={page}
        primaryCtaLabel="Start Free Cluster"
        primaryCtaPath="/"
        secondaryCtaLabel="Inspect Live Sync"
        secondaryCtaPath="/live-sync"
      />

      {/* Interactive Compute Estimator + Tiers */}
      <section className="space-y-8">
        <AnimatedContent distance={50} duration={0.75} threshold={0.08}>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-sky-300">
                  Workload Calculator
                </span>
                <SmokeTopic
                  text="Transparent Compute & Storage Estimator"
                  as="h2"
                  className="mt-1 text-2xl text-white sm:text-3xl"
                />
              </div>

              <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 px-5 py-3 text-right">
                <div className="font-mono text-xs text-sky-200">Estimated Monthly Total</div>
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                  ₹{estimatedCostInr.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-zinc-400"> / mo</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-300">Edge API &amp; Sync Operations</span>
                  <span className="font-mono text-sky-300">{monthlyMillions}M req/mo</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={monthlyMillions}
                  onChange={(e) => setMonthlyMillions(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-300">Database &amp; Dynamic DB NVMe</span>
                  <span className="font-mono text-emerald-300">{storageGb} GB</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={1000}
                  step={5}
                  value={storageGb}
                  onChange={(e) => setStorageGb(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={55}
          duration={0.8}
          stagger={0.09}
          threshold={0.08}
          className="grid gap-6 lg:grid-cols-3"
        >
          {TIERS.map((tier) => (
            <div key={tier.name} className="glass-panel glass-panel-hover flex flex-col justify-between rounded-3xl p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider" style={{ color: tier.accent }}>
                    {tier.name}
                  </span>
                  <Server className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs text-zinc-400">{tier.period}</span>
                </div>
                <p className="mb-6 text-sm text-zinc-300/90">{tier.summary}</p>
                <ul className="mb-8 space-y-2.5 text-sm text-zinc-300">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0" style={{ color: tier.accent }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <SpecularButton
                size="md"
                radius={14}
                tint={tier.accent}
                tintOpacity={0.12}
                lineColor={tier.accent}
                className="w-full"
                onClick={() => navigate('/')}
              >
                Select {tier.name}
              </SpecularButton>
            </div>
          ))}
        </AnimatedContent>
      </section>

      {/* All 7 Modules Directory in MagicBento */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
          <div>
            <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-300">
              <Layers className="h-3.5 w-3.5" />
              <span>FalcoStack LightTunnel Modules</span>
            </div>
            <SmokeTopic
              text="All 7 Cloud Modules & Tunnel Themes"
              as="h2"
              className="text-2xl text-white sm:text-3xl"
            />
          </div>
          <p className="text-xs text-zinc-400">
            Click any module card to ripple and switch to its dedicated LightTunnel route.
          </p>
        </div>

        <MagicBento
          items={MODULE_BENTO_ITEMS}
          columns={4}
          rowHeight={155}
          gap={12}
          radius={18}
          glowColor={page.accentColor}
          enableBorderGlow={true}
          enableSpotlight={true}
          spotlightRadius={280}
          clickEffect={true}
          textAutoHide={false}
          onItemClick={handleModuleClick}
        />
      </section>
    </div>
  );
};
