import React, { useState } from 'react';
import { Braces, Cpu, Layers, Sparkles } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

const PAYLOAD_SAMPLES = {
  agent: {
    label: 'AI Agent Memory',
    doc: `{
  "tenantId": "org_falco_91",
  "session": "sess_7f21",
  "embedding": [0.041, -0.182, 0.774, "...1536d"],
  "metadata": {
    "model": "gemini-flash",
    "confidence": 0.984,
    "tags": ["edge", "crdt"]
  }
}`,
    inferred: `interface AgentMemoryRecord {
  tenantId: string;        // Partitioned Edge Key
  session: string;         // B-Tree Indexed
  embedding: Vector<1536>; // HNSW Cosine Index
  metadata: {
    model: string;
    confidence: number;
    tags: string[];
  };
}`,
  },
  telemetry: {
    label: 'IoT Telemetry',
    doc: `{
  "node": "pop-sin-04",
  "cpuLoad": 0.42,
  "activeSockets": 18420,
  "regionLatencyMs": { "us": 68, "eu": 91, "ap": 4.2 }
}`,
    inferred: `interface TelemetryFrame {
  node: string;            // Geo-Partition Key
  cpuLoad: number;         // Time-Series Columnar
  activeSockets: number;
  regionLatencyMs: Record<"us" | "eu" | "ap", number>;
}`,
  },
  commerce: {
    label: 'Adaptive Cart',
    doc: `{
  "cartId": "crt_8831a",
  "currency": "INR",
  "items": [
    { "sku": "NVME-PRO", "qty": 2, "tier": "edge" }
  ],
  "liveSyncVersion": 42
}`,
    inferred: `interface AdaptiveCart {
  cartId: string;          // Primary Anycast Key
  currency: "INR" | string;
  items: Array<{ sku: string; qty: number; tier: string }>;
  liveSyncVersion: number; // Auto-CRDT Monotonic Clock
}`,
  },
};

const DYNAMIC_BENTO_ITEMS: MagicBentoItem[] = [
  {
    id: 'hnsw',
    icon: <Cpu className="h-4 w-4 text-cyan-300" />,
    label: '2.9ms Hybrid Recall',
    title: 'HNSW Vector Native',
    description: 'Run filtered cosine & inner-product vector search alongside relational predicates.',
    onClick: () => undefined,
  },
  {
    id: 'cache',
    icon: <Layers className="h-4 w-4 text-cyan-300" />,
    label: '38 PoPs L1 Memory',
    title: 'Auto-Sharded Edge Cache',
    description: 'Hot document keys promote automatically into regional L1 memory across all PoPs.',
    onClick: () => undefined,
  },
  {
    id: 'sdk',
    icon: <Braces className="h-4 w-4 text-cyan-300" />,
    label: '0.4ms Schema Compile',
    title: 'Strict SDK Emission',
    description: 'Schema evolutions stream straight into typed FalcoStack API contracts.',
    onClick: () => undefined,
  },
];

export const DynamicDbPage: React.FC = () => {
  const page = FALCO_PAGES[2];
  const [sampleKey, setSampleKey] = useState<keyof typeof PAYLOAD_SAMPLES>('agent');

  return (
    <div className="space-y-14">
      <PageHero
        page={page}
        primaryCtaLabel="Test Edge APIs"
        primaryCtaPath="/apis"
        secondaryCtaLabel="Inspect Live Sync"
        secondaryCtaPath="/live-sync"
      />

      <AnimatedContent distance={55} duration={0.8} threshold={0.08}>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                Zero-Migration Storage
              </span>
              <SmokeTopic
                text="Schema-on-Write Elasticity & Hybrid Vector Indexing"
                as="h2"
                className="mt-1 text-2xl text-white sm:text-3xl"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(PAYLOAD_SAMPLES) as Array<keyof typeof PAYLOAD_SAMPLES>).map((key) => (
                <SpecularButton
                  key={key}
                  size="sm"
                  radius={12}
                  tint={sampleKey === key ? '#22d3ee' : '#ffffff'}
                  tintOpacity={sampleKey === key ? 0.14 : 0.04}
                  lineColor={sampleKey === key ? '#22d3ee' : '#a1a1aa'}
                  idleIntensity={sampleKey === key ? 0.7 : 0.22}
                  onClick={() => setSampleKey(key)}
                >
                  {PAYLOAD_SAMPLES[key].label}
                </SpecularButton>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/65 p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-xs text-cyan-300">
                <span className="flex items-center gap-2">
                  <Braces className="h-3.5 w-3.5" />
                  Ingested JSON Document
                </span>
                <span className="text-zinc-500">Zero ALTER TABLE</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-200">
                <code>{PAYLOAD_SAMPLES[sampleKey].doc}</code>
              </pre>
            </div>

            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-950/20 p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-xs text-cyan-300">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Auto-Compiled Schema &amp; Index Plan
                </span>
                <span className="text-emerald-400">Compiled in 0.4ms</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-cyan-100">
                <code>{PAYLOAD_SAMPLES[sampleKey].inferred}</code>
              </pre>
            </div>
          </div>
        </section>
      </AnimatedContent>

      <MagicBento
        items={DYNAMIC_BENTO_ITEMS}
        columns={3}
        rowHeight={160}
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
