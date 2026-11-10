import { LightTunnelProps } from '@/components/LightTunnel';

export type RibbonPreset =
  | 'aurora'
  | 'nebula'
  | 'electric'
  | 'mono'
  | 'ember'
  | 'silk'
  | 'dense';

export interface FalcoPageMeta {
  id: string;
  path: string;
  navLabel: string;
  preset: RibbonPreset;
  presetLabel: string;
  tunnelProps: LightTunnelProps;
  accentColor: string;
  secondaryColor: string;
  badge: string;
  headlineTopic: string;
  summary: string;
  latency: string;
}

export const FALCO_PAGES: FalcoPageMeta[] = [
  {
    id: 'overview',
    path: '/',
    navLabel: 'Overview',
    preset: 'aurora',
    presetLabel: 'Aurora',
    tunnelProps: {
      cableColor: '#cfe0ff',
      pulseColor: '#015cff',
      cableCount: 56,
      pulseDensity: 0.5,
      flowDirection: 'inward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#9ab8ff',
      tunnelOpacity: 0.35,
    },
    accentColor: '#60a5fa',
    secondaryColor: '#38bdf8',
    badge: 'Unified Cloud Fabric',
    headlineTopic: 'Autonomous Cloud Infrastructure',
    summary:
      'Deploy distributed SQL, adaptive Dynamic DBs, zero-cold-start APIs, edge hosting, and sub-12ms Live Sync on one programmable stack.',
    latency: '7.4 ms p99 global',
  },
  {
    id: 'database',
    path: '/database',
    navLabel: 'Database',
    preset: 'nebula',
    presetLabel: 'Nebula',
    tunnelProps: {
      cableColor: '#e0d4ff',
      pulseColor: '#8b5cf6',
      cableCount: 64,
      pulseDensity: 0.55,
      flowDirection: 'inward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#a855f7',
      tunnelOpacity: 0.32,
    },
    accentColor: '#c084fc',
    secondaryColor: '#8b5cf6',
    badge: 'Distributed Postgres Mesh',
    headlineTopic: 'Database & Instant Branching',
    summary:
      'Serverless multi-region Postgres with copy-on-write branching, automatic read-replica routing, and continuous point-in-time recovery.',
    latency: '1.8 ms local read',
  },
  {
    id: 'dynamic-db',
    path: '/dynamic-db',
    navLabel: 'Dynamic DB',
    preset: 'electric',
    presetLabel: 'Electric',
    tunnelProps: {
      cableColor: '#cffafe',
      pulseColor: '#06b6d4',
      cableCount: 56,
      pulseDensity: 0.6,
      flowDirection: 'outward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#38bdf8',
      tunnelOpacity: 0.35,
    },
    accentColor: '#22d3ee',
    secondaryColor: '#06b6d4',
    badge: 'Elastic Document + Vector',
    headlineTopic: 'Dynamic DB Schema Engine',
    summary:
      'Ingest arbitrary JSON and embeddings with zero migrations—auto-typed schemas, hybrid vector indexes, and edge caching compile on write.',
    latency: '2.9 ms vector recall',
  },
  {
    id: 'apis',
    path: '/apis',
    navLabel: 'APIs',
    preset: 'mono',
    presetLabel: 'Mono',
    tunnelProps: {
      cableColor: '#e4e4e7',
      pulseColor: '#ffffff',
      cableCount: 48,
      pulseDensity: 0.45,
      flowDirection: 'inward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#71717a',
      tunnelOpacity: 0.24,
    },
    accentColor: '#f4f4f5',
    secondaryColor: '#94a3b8',
    badge: 'Edge Runtime Gateway',
    headlineTopic: 'Zero-Cold-Start APIs',
    summary:
      'Typed REST, GraphQL, and WebSocket endpoints compiled to Wasm isolates with built-in JWT auth, rate-limiting, and contract validation.',
    latency: '0.9 ms isolate boot',
  },
  {
    id: 'hosting',
    path: '/hosting',
    navLabel: 'Hosting',
    preset: 'ember',
    presetLabel: 'Ember',
    tunnelProps: {
      cableColor: '#fed7aa',
      pulseColor: '#f97316',
      cableCount: 60,
      pulseDensity: 0.55,
      flowDirection: 'outward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#fb7185',
      tunnelOpacity: 0.32,
    },
    accentColor: '#fb923c',
    secondaryColor: '#f43f5e',
    badge: 'Immutable Edge Mesh',
    headlineTopic: 'Global Edge Hosting',
    summary:
      'Push from Git to 38 edge PoPs in under four seconds with atomic rollbacks, preview environments per commit, and hybrid container scaling.',
    latency: '3.6 s global rollout',
  },
  {
    id: 'live-sync',
    path: '/live-sync',
    navLabel: 'Live Sync',
    preset: 'silk',
    presetLabel: 'Silk',
    tunnelProps: {
      cableColor: '#ccfbf1',
      pulseColor: '#2dd4bf',
      cableCount: 52,
      pulseDensity: 0.5,
      flowDirection: 'inward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#67e8f9',
      tunnelOpacity: 0.3,
    },
    accentColor: '#5eead4',
    secondaryColor: '#67e8f9',
    badge: 'CRDT Delta Streaming',
    headlineTopic: 'Live Sync & State Streams',
    summary:
      'Keep browsers, mobile clients, and edge workers synchronized in real time via conflict-free CRDT streams and multiplexed presence channels.',
    latency: '11.2 ms delta sync',
  },
  {
    id: 'edge-pricing',
    path: '/edge-pricing',
    navLabel: 'Edge & Pricing',
    preset: 'dense',
    presetLabel: 'Dense',
    tunnelProps: {
      cableColor: '#bfdbfe',
      pulseColor: '#3b82f6',
      cableCount: 84,
      pulseDensity: 0.65,
      flowDirection: 'inward',
      mouseInteraction: true,
      clickSurge: true,
      tunnelColor: '#34d399',
      tunnelOpacity: 0.38,
    },
    accentColor: '#60a5fa',
    secondaryColor: '#34d399',
    badge: '38 PoPs • Transparent Compute',
    headlineTopic: 'Cluster Fabric & Pricing',
    summary:
      'Scale from zero-cost developer sandboxes to dedicated multi-cloud clusters with predictable per-execution billing and zero egress surprises.',
    latency: '99.999% uptime SLA',
  },
];

export const getPageByPath = (pathname: string): FalcoPageMeta => {
  return FALCO_PAGES.find((page) => page.path === pathname) ?? FALCO_PAGES[0];
};
