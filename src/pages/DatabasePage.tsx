import React, { useState } from 'react';
import { Database, GitBranch, Globe, Plus, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

interface DbBranch {
  name: string;
  parent: string;
  deltaMb: number;
  region: string;
  latencyMs: string;
  status: string;
}

const INITIAL_BRANCHES: DbBranch[] = [
  {
    name: 'prod-main',
    parent: 'root',
    deltaMb: 48200,
    region: 'us-east-1 + eu-central-1',
    latencyMs: '1.8 ms',
    status: 'Primary Active',
  },
  {
    name: 'staging-pr-418',
    parent: 'prod-main',
    deltaMb: 12,
    region: 'us-east-1',
    latencyMs: '2.1 ms',
    status: 'Isolated Preview',
  },
  {
    name: 'analytics-replica',
    parent: 'prod-main',
    deltaMb: 0,
    region: 'ap-southeast-1',
    latencyMs: '2.4 ms',
    status: 'Read-Only Pool',
  },
];

const DB_BENTO_ITEMS: MagicBentoItem[] = [
  {
    id: 'pitr',
    icon: <ShieldCheck className="h-4 w-4 text-purple-300" />,
    label: 'WAL Time Travel',
    title: 'Continuous PITR',
    description: 'Rewind any branch to exact microsecond checkpoints across a 30-day WAL ledger.',
    onClick: () => undefined,
  },
  {
    id: 'scale-zero',
    icon: <Zap className="h-4 w-4 text-purple-300" />,
    label: '90ms Cold Resume',
    title: 'Scale-to-Zero Compute',
    description: 'Preview and staging branches hibernate automatically when idle with zero cost.',
    onClick: () => undefined,
  },
  {
    id: 'read-pools',
    icon: <Globe className="h-4 w-4 text-purple-300" />,
    label: 'Geo-Routed Replicas',
    title: 'Anycast Read Pools',
    description: 'Route regional read queries to the nearest NVMe replica with sub-2ms latency.',
    onClick: () => undefined,
  },
  {
    id: 'pgvector',
    icon: <Sparkles className="h-4 w-4 text-purple-300" />,
    label: 'Postgres 17 Core',
    title: 'pgvector & PostGIS',
    description: 'Full ACID relational integrity paired with built-in embeddings and spatial types.',
    onClick: () => undefined,
  },
];

export const DatabasePage: React.FC = () => {
  const page = FALCO_PAGES[1];
  const [branches, setBranches] = useState<DbBranch[]>(INITIAL_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<string>('prod-main');

  const active = branches.find((b) => b.name === selectedBranch) ?? branches[0];

  const handleFork = () => {
    const idx = branches.length + 1;
    const nextName = `preview-fork-${idx}`;
    const newBranch: DbBranch = {
      name: nextName,
      parent: active.name,
      deltaMb: 0,
      region: 'global-anycast',
      latencyMs: '1.9 ms',
      status: 'Forked in 132ms',
    };
    setBranches((prev) => [...prev, newBranch]);
    setSelectedBranch(nextName);
  };

  return (
    <div className="space-y-14">
      <PageHero
        page={page}
        primaryCtaLabel="Fork Instant Branch"
        onPrimaryAction={handleFork}
        secondaryCtaLabel="Explore Dynamic DB"
        secondaryCtaPath="/dynamic-db"
      />

      <AnimatedContent
        distance={55}
        duration={0.8}
        stagger={0.1}
        threshold={0.08}
        className="grid gap-8 lg:grid-cols-12"
      >
        <div className="glass-panel rounded-3xl p-6 lg:col-span-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-purple-300">
                Copy-on-Write Storage
              </span>
              <SmokeTopic text="Zero-Copy Postgres Branches" as="h2" className="mt-1 text-2xl text-white sm:text-3xl" />
            </div>

            <SpecularButton
              size="sm"
              radius={12}
              tint="#c084fc"
              tintOpacity={0.14}
              lineColor="#c084fc"
              onClick={handleFork}
            >
              <Plus className="h-4 w-4" />
              <span>Fork Active Branch</span>
            </SpecularButton>
          </div>

          <div className="space-y-3">
            {branches.map((branch) => {
              const isSelected = branch.name === active.name;
              return (
                <button
                  key={branch.name}
                  type="button"
                  onClick={() => setSelectedBranch(branch.name)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-purple-400/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-4 w-4 text-purple-300" />
                    <div>
                      <div className="font-mono text-sm font-semibold text-white">{branch.name}</div>
                      <div className="text-xs text-zinc-400">
                        Parent: <span className="font-mono">{branch.parent}</span> • {branch.region}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-purple-300">{branch.deltaMb} MB delta</div>
                    <div className="text-zinc-400">{branch.latencyMs}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 lg:col-span-5">
          <div>
            <SmokeTopic text="Active Topology Telemetry" as="h3" className="mb-4 text-2xl text-white" />
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Target Branch</span>
                <span className="text-purple-300">{active.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>State</span>
                <span className="text-emerald-400">{active.status}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Read Latency (p95)</span>
                <span className="text-white">{active.latencyMs}</span>
              </div>
              <div className="border-t border-white/10 pt-3 break-all text-zinc-300">
                postgres://falco_{active.name.replace(/-/g, '_')}@db.falcostack.dev:5432/core?sslmode=require
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-purple-400/20 bg-purple-500/5 px-4 py-3 text-xs text-zinc-300">
            <Database className="h-4 w-4 shrink-0 text-purple-300" />
            <span>PostgreSQL 17 wire-compatible • Instant CoW branching enabled</span>
          </div>
        </div>
      </AnimatedContent>

      <MagicBento
        items={DB_BENTO_ITEMS}
        columns={4}
        rowHeight={155}
        gap={12}
        radius={18}
        glowColor={page.accentColor}
        enableBorderGlow={true}
        enableSpotlight={true}
        spotlightRadius={260}
        clickEffect={true}
        textAutoHide={false}
      />
    </div>
  );
};
