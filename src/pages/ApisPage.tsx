import React, { useState } from 'react';
import { Lock, Play, Shield, Terminal, Zap } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

interface EndpointSpec {
  id: string;
  method: string;
  path: string;
  pop: string;
  bootMs: string;
  response: string;
}

const ENDPOINTS: EndpointSpec[] = [
  {
    id: 'query',
    method: 'POST',
    path: '/v1/dynamic-db/vector-search',
    pop: 'fra-02 (Frankfurt)',
    bootMs: '0.84 ms',
    response: `{
  "status": 200,
  "pop": "fra-02",
  "isolateBoot": "0.84ms",
  "matches": [
    { "id": "doc_9921", "score": 0.9912, "region": "eu-central" },
    { "id": "doc_4402", "score": 0.9648, "region": "eu-west" }
  ]
}`,
  },
  {
    id: 'auth',
    method: 'GET',
    path: '/v1/auth/session-verify',
    pop: 'iad-04 (Virginia)',
    bootMs: '0.62 ms',
    response: `{
  "verified": true,
  "tenant": "falco_enterprise",
  "scopes": ["db:read", "sync:publish", "edge:deploy"],
  "rateLimitRemaining": 9998
}`,
  },
  {
    id: 'stream',
    method: 'WS',
    path: '/v1/live-sync/rooms/cluster-01',
    pop: 'sin-01 (Singapore)',
    bootMs: '0.91 ms',
    response: `{
  "protocol": "falco-crdt-v2",
  "peersConnected": 1248,
  "deltaFanoutP99": "10.8ms",
  "compression": "zstd-frame"
}`,
  },
];

const API_BENTO_ITEMS: MagicBentoItem[] = [
  {
    id: 'wasm',
    icon: <Zap className="h-4 w-4 text-zinc-100" />,
    label: '< 1ms Isolate Boot',
    title: 'Wasm Isolates',
    description: 'Boot REST, GraphQL, and WebSocket handlers in under 1ms without container lag.',
    onClick: () => undefined,
  },
  {
    id: 'jwt',
    icon: <Lock className="h-4 w-4 text-zinc-100" />,
    label: 'Perimeter Auth',
    title: 'Zero-Trust JWT & mTLS',
    description: 'Verify sessions and enforce tenant policies at the edge before origins wake.',
    onClick: () => undefined,
  },
  {
    id: 'ddos',
    icon: <Shield className="h-4 w-4 text-zinc-100" />,
    label: 'Anycast Quotas',
    title: 'DDoS & Rate Shaping',
    description: 'Token-bucket enforcement synchronized across all 38 PoPs in real time.',
    onClick: () => undefined,
  },
];

export const ApisPage: React.FC = () => {
  const page = FALCO_PAGES[3];
  const [selected, setSelected] = useState<EndpointSpec>(ENDPOINTS[0]);
  const [runCount, setRunCount] = useState(1);

  return (
    <div className="space-y-14">
      <PageHero
        page={page}
        primaryCtaLabel="Test Hosting Rollout"
        primaryCtaPath="/hosting"
        secondaryCtaLabel="Explore Live Sync"
        secondaryCtaPath="/live-sync"
      />

      <AnimatedContent distance={55} duration={0.8} threshold={0.08}>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Mono Wasm Gateway
              </span>
              <SmokeTopic
                text="Edge API Gateway & Contract Mesh"
                as="h2"
                className="mt-1 text-2xl text-white sm:text-3xl"
              />
            </div>

            <SpecularButton
              size="sm"
              radius={12}
              tint="#ffffff"
              tintOpacity={0.08}
              lineColor="#ffffff"
              onClick={() => setRunCount((c) => c + 1)}
            >
              <Play className="h-3.5 w-3.5" />
              <span>Execute Edge Call (#{runCount})</span>
            </SpecularButton>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              {ENDPOINTS.map((ep) => {
                const isSelected = ep.id === selected.id;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setSelected(ep)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="rounded bg-white/15 px-2 py-0.5 font-semibold text-white">
                          {ep.method}
                        </span>
                        <span className="text-zinc-200">{ep.path}</span>
                      </div>
                      <div className="mt-1.5 text-xs text-zinc-400">PoP: {ep.pop}</div>
                    </div>
                    <span className="font-mono text-xs text-zinc-300">{ep.bootMs}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/75 p-5 lg:col-span-7">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono text-xs">
                <span className="flex items-center gap-2 text-zinc-200">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>
                    {selected.method} https://api.falcostack.dev{selected.path}
                  </span>
                </span>
                <span className="text-emerald-400">200 OK • {selected.bootMs}</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-200">
                <code>{selected.response}</code>
              </pre>
            </div>
          </div>
        </section>
      </AnimatedContent>

      <MagicBento
        items={API_BENTO_ITEMS}
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
