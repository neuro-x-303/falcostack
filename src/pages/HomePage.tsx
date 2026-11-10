import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  Braces,
  Check,
  Copy,
  Database,
  Globe,
  Layers,
  Radio,
  Server,
  Terminal,
  Zap,
} from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import {
  FalcoApiHubVisual,
  FalcoDatabaseBars,
  FalcoDynamicChart,
  FalcoHostingFlowVisual,
  FalcoLiveSyncVisual,
  FalcoSecurityShieldVisual,
} from '@/components/FalcoBentoVisuals';
import SpecularButton from '@/components/SpecularButton';

interface FalcoBentoEntry extends MagicBentoItem {
  path: string;
  preset: string;
}

const HOME_BENTO_ITEMS: FalcoBentoEntry[] = [
  {
    id: 'database',
    path: '/database',
    preset: 'Nebula',
    icon: <Database className="h-4 w-4 text-purple-300" />,
    label: 'Nebula • /database',
    title: 'Database',
    description: 'Serverless Postgres with 140ms copy-on-write branching and auto-scaling NVMe.',
    visual: <FalcoDatabaseBars />,
  },
  {
    id: 'dynamic-db',
    path: '/dynamic-db',
    preset: 'Electric',
    icon: <Braces className="h-4 w-4 text-cyan-300" />,
    label: 'Electric • /dynamic-db',
    title: 'Dynamic DB',
    description: 'Zero-migration JSON documents & native HNSW vector indexes at the edge.',
    visual: <FalcoDynamicChart />,
  },
  {
    id: 'live-sync',
    path: '/live-sync',
    preset: 'Silk',
    icon: <Radio className="h-4 w-4 text-teal-200" />,
    label: 'Silk • 11.2ms CRDT • /live-sync',
    title: 'Live Sync',
    description: 'Conflict-free multiplayer state streams, live cursors & offline mutations across regions.',
    visual: <FalcoLiveSyncVisual />,
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: 'hosting',
    path: '/hosting',
    preset: 'Ember',
    icon: <Globe className="h-4 w-4 text-orange-300" />,
    label: 'Ember • 3.6s rollout • /hosting',
    title: 'Hosting',
    description: 'Push from Git to 38 edge PoPs with atomic zero-downtime swaps & PR previews.',
    visual: <FalcoHostingFlowVisual />,
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: 'apis',
    path: '/apis',
    preset: 'Mono',
    icon: <Zap className="h-4 w-4 text-zinc-100" />,
    label: 'Mono • 0.9ms • /apis',
    title: 'Edge APIs',
    description: 'Zero-cold-start Wasm REST, GraphQL & WebSocket gateways.',
    visual: <FalcoApiHubVisual />,
  },
  {
    id: 'edge-pricing',
    path: '/edge-pricing',
    preset: 'Dense',
    icon: <Layers className="h-4 w-4 text-sky-300" />,
    label: 'Dense • 38 PoPs • /edge-pricing',
    title: 'Edge & Pricing',
    description: 'mTLS perimeter, continuous PITR guardrails & compute estimator.',
    visual: <FalcoSecurityShieldVisual />,
  },
];

const CLI_SNIPPETS = {
  init: {
    label: 'Initialize Stack',
    cmd: 'npx falcostack@latest init cloud-core --region=global',
    output: [
      '✓ Provisioned Aurora edge mesh across 38 PoPs',
      '✓ Linked Postgres Branch (main) + Dynamic DB collection',
      '✓ Live Sync WebSocket gateway ready at wss://sync.falcostack.dev',
    ],
  },
  branch: {
    label: 'Branch Database',
    cmd: 'falco db branch create feat-vector-auth --from prod',
    output: [
      '✓ Copy-on-write snapshot forked in 138ms (0 MB overhead)',
      '✓ Connection URI injected into preview deployment',
      '✓ Hybrid HNSW vector index warmed across eu-central & us-east',
    ],
  },
  deploy: {
    label: 'Atomic Deploy',
    cmd: 'falco deploy --all --sync-edge',
    output: [
      '✓ Compiled 14 edge API isolates (0.88ms cold boot)',
      '✓ Verified schema contracts + Live Sync CRDT channels',
      '✓ Global cutover complete in 3.4s -> https://app.falcostack.dev',
    ],
  },
};

export const HomePage: React.FC = () => {
  const page = FALCO_PAGES[0];
  const navigate = useNavigate();
  const [activeCli, setActiveCli] = useState<keyof typeof CLI_SNIPPETS>('init');
  const [copied, setCopied] = useState(false);
  const navTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current !== null) {
        window.clearTimeout(navTimerRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(CLI_SNIPPETS[activeCli].cmd);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleBentoItemClick = (item: MagicBentoItem) => {
    const entry = HOME_BENTO_ITEMS.find((candidate) => candidate.id === item.id);
    if (!entry) return;
    if (navTimerRef.current !== null) {
      window.clearTimeout(navTimerRef.current);
    }
    navTimerRef.current = window.setTimeout(() => {
      navigate(entry.path);
    }, 220);
  };

  return (
    <div className="space-y-20">
      <PageHero
        page={page}
        primaryCtaLabel="Deploy on FalcoStack"
        primaryCtaPath="/edge-pricing"
        secondaryCtaLabel="Inspect Database Mesh"
        secondaryCtaPath="/database"
      >
        {/* Telemetry Strip */}
        <AnimatedContent
          trigger="mount"
          distance={36}
          duration={0.75}
          delay={0.2}
          stagger={0.07}
          ease="power3.out"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: 'Edge PoPs', value: '38 Regions', icon: Globe },
            { label: 'Live Sync Delta', value: '< 12 ms', icon: Activity },
            { label: 'Isolate Cold Boot', value: '0.9 ms', icon: Zap },
            { label: 'Core Availability', value: '99.999%', icon: Server },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 text-left">
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                <span>{stat.label}</span>
                <stat.icon className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="font-[family-name:var(--font-display)] text-xl font-bold text-white sm:text-2xl">
                {stat.value}
              </div>
            </div>
          ))}
        </AnimatedContent>
      </PageHero>

      {/* Main Topics Section: MagicBento Grid */}
      <section className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-sky-400">
              Platform Capabilities
            </span>
            <SmokeTopic
              text="Five Unified Cloud Primitives"
              as="h2"
              className="mt-2 text-3xl text-white sm:text-4xl"
            />
          </div>
          <p className="max-w-md text-sm text-zinc-400">
            Click any MagicBento primitive to trigger its live wave and open its dedicated console and LightTunnel theme.
          </p>
        </div>

        <MagicBento
          items={HOME_BENTO_ITEMS}
          columns={4}
          rowHeight={200}
          gap={12}
          radius={20}
          theme="dark"
          glowColor="#60a5fa"
          enableBorderGlow={true}
          enableSpotlight={true}
          spotlightRadius={300}
          clickEffect={true}
          textAutoHide={true}
          onItemClick={handleBentoItemClick}
        />

        {/* Quick Route Bar */}
        <AnimatedContent
          distance={28}
          duration={0.65}
          ease="power3.out"
          threshold={0.08}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
        >
          <span className="font-mono text-xs text-zinc-400">
            Direct Module Consoles
          </span>
          <div className="flex flex-wrap gap-2">
            {HOME_BENTO_ITEMS.map((entry) => (
              <SpecularButton
                key={entry.id}
                size="sm"
                radius={10}
                tint="#60a5fa"
                tintOpacity={0.08}
                lineColor="#60a5fa"
                baseColor="#3f3f46"
                idleIntensity={0.25}
                onClick={() => navigate(entry.path)}
              >
                <span>{entry.title}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </SpecularButton>
            ))}
          </div>
        </AnimatedContent>
      </section>

      {/* Interactive CLI Quickstart */}
      <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>FalcoStack CLI</span>
              </div>
              <SmokeTopic text="Provision in One Command" as="h2" className="text-2xl text-white sm:text-3xl" />
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(CLI_SNIPPETS) as Array<keyof typeof CLI_SNIPPETS>).map((key) => (
                <SpecularButton
                  key={key}
                  size="sm"
                  radius={12}
                  tint={activeCli === key ? '#22d3ee' : '#ffffff'}
                  tintOpacity={activeCli === key ? 0.14 : 0.03}
                  lineColor={activeCli === key ? '#22d3ee' : '#a1a1aa'}
                  idleIntensity={activeCli === key ? 0.65 : 0.2}
                  onClick={() => setActiveCli(key)}
                >
                  {CLI_SNIPPETS[key].label}
                </SpecularButton>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/70 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-zinc-400">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-emerald-400">$</span>
                <code className="whitespace-nowrap text-zinc-100">
                  {CLI_SNIPPETS[activeCli].cmd}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-4 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 hover:bg-white/10"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="space-y-1.5 p-4 text-zinc-300">
              {CLI_SNIPPETS[activeCli].output.map((line) => (
                <div key={line} className="text-emerald-300/90">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
};
