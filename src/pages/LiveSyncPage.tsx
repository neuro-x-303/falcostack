import React, { useState } from 'react';
import { ArrowLeftRight, Radio, RefreshCw, Users } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

const SYNC_BENTO_ITEMS: MagicBentoItem[] = [
  {
    id: 'offline',
    icon: <RefreshCw className="h-4 w-4 text-teal-200" />,
    label: 'Deterministic CRDT',
    title: 'Offline Optimistic Writes',
    description: 'Queue mutations locally during network drops and auto-merge cleanly on reconnect.',
    onClick: () => undefined,
  },
  {
    id: 'presence',
    icon: <Users className="h-4 w-4 text-teal-200" />,
    label: 'Multiplexed Rooms',
    title: 'Live Cursor & Presence',
    description: 'Synchronize thousands of concurrent cursors and selection state without polling.',
    onClick: () => undefined,
  },
  {
    id: 'streams',
    icon: <Radio className="h-4 w-4 text-teal-200" />,
    label: 'Reactive Queries',
    title: 'DB-to-Browser Streams',
    description: 'Subscribe directly to live Postgres or Dynamic DB query predicates over WebSockets.',
    onClick: () => undefined,
  },
];

export const LiveSyncPage: React.FC = () => {
  const page = FALCO_PAGES[5];
  const [replicaCount, setReplicaCount] = useState(3);
  const [syncFlag, setSyncFlag] = useState(true);
  const [roomNote, setRoomNote] = useState('CRDT mesh converged across Tokyo & Frankfurt');
  const [clock, setClock] = useState(14);

  const bumpClock = () => setClock((c) => c + 1);

  return (
    <div className="space-y-14">
      <PageHero
        page={page}
        primaryCtaLabel="Explore Edge & Pricing"
        primaryCtaPath="/edge-pricing"
        secondaryCtaLabel="Back to Cloud Overview"
        secondaryCtaPath="/"
      />

      <AnimatedContent distance={55} duration={0.8} threshold={0.08}>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-teal-200">
                Silk CRDT State Fabric
              </span>
              <SmokeTopic
                text="Conflict-Free CRDT Replication Demo"
                as="h2"
                className="mt-1 text-2xl text-white sm:text-3xl"
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-4 py-1.5 font-mono text-xs text-teal-200">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Lamport Clock v{clock} • 11.2ms delta</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-11">
            {/* Node A */}
            <div className="rounded-2xl border border-white/15 bg-black/55 p-5 lg:col-span-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-teal-200">
                  Client Node A • Tokyo (hnd-01)
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                  MUTATE HERE
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Shared State Note
                  </label>
                  <input
                    type="text"
                    value={roomNote}
                    onChange={(e) => {
                      setRoomNote(e.target.value);
                      bumpClock();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-teal-300/60"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <SpecularButton
                    size="sm"
                    radius={12}
                    tint="#a7f3d0"
                    tintOpacity={0.14}
                    lineColor="#a7f3d0"
                    onClick={() => {
                      setReplicaCount((n) => (n >= 12 ? 1 : n + 1));
                      bumpClock();
                    }}
                  >
                    <span>Scale Replicas ({replicaCount})</span>
                  </SpecularButton>

                  <SpecularButton
                    size="sm"
                    radius={12}
                    tint="#67e8f9"
                    tintOpacity={0.12}
                    lineColor="#67e8f9"
                    onClick={() => {
                      setSyncFlag((f) => !f);
                      bumpClock();
                    }}
                  >
                    <span>Edge Cache: {syncFlag ? 'ON' : 'OFF'}</span>
                  </SpecularButton>
                </div>
              </div>
            </div>

            {/* Sync Bridge */}
            <div className="flex flex-col items-center justify-center gap-2 py-2 lg:col-span-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200/30 bg-teal-300/10">
                <ArrowLeftRight className="h-5 w-5 text-teal-200" />
              </div>
              <span className="font-mono text-[11px] text-zinc-400">11.2ms</span>
            </div>

            {/* Node B */}
            <div className="rounded-2xl border border-teal-200/25 bg-teal-950/20 p-5 lg:col-span-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-cyan-200">
                  Client Node B • Frankfurt (fra-02)
                </span>
                <span className="rounded bg-teal-400/20 px-2 py-0.5 font-mono text-[10px] text-teal-200">
                  SYNCED STATE
                </span>
              </div>

              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs leading-relaxed text-teal-100">
                <code>
                  {JSON.stringify(
                    {
                      lamportClock: clock,
                      note: roomNote,
                      activeReplicas: replicaCount,
                      edgeCacheEnabled: syncFlag,
                      mergeStatus: 'CONVERGED_ZERO_CONFLICT',
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </AnimatedContent>

      <MagicBento
        items={SYNC_BENTO_ITEMS}
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
