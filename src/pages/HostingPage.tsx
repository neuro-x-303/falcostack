import React, { useEffect, useState } from 'react';
import { CheckCircle2, Globe, Rocket, RotateCcw, Server } from 'lucide-react';
import { FALCO_PAGES } from '@/data/pages';
import { PageHero } from '@/components/PageHero';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import MagicBento, { type MagicBentoItem } from '@/components/MagicBento';
import SpecularButton from '@/components/SpecularButton';

const DEPLOY_STEPS = [
  { label: 'Immutable Bundle & Vite Tree-Shake', duration: '0.9s', pop: 'Build Core' },
  { label: 'Edge Middleware + API Route Compilation', duration: '0.7s', pop: 'Wasm Registry' },
  { label: 'Anycast State & TLS Cert Propagation', duration: '1.2s', pop: '38 PoPs' },
  { label: 'Atomic Zero-Downtime Pointer Cutover', duration: '0.4s', pop: 'Global Live' },
];

const HOSTING_BENTO_ITEMS: MagicBentoItem[] = [
  {
    id: 'http3',
    icon: <Globe className="h-4 w-4 text-orange-300" />,
    label: 'TLS 1.3 0-RTT',
    title: 'Anycast HTTP/3',
    description: 'Automatic Brotli, Zstd compression, and instant global edge TLS termination.',
    onClick: () => undefined,
  },
  {
    id: 'containers',
    icon: <Server className="h-4 w-4 text-orange-300" />,
    label: 'Edge Co-Location',
    title: 'Hybrid Containers',
    description: 'Co-locate long-lived GPU workers and background queues beside static assets.',
    onClick: () => undefined,
  },
  {
    id: 'previews',
    icon: <Rocket className="h-4 w-4 text-orange-300" />,
    label: 'Full-Stack Branching',
    title: 'Per-PR Previews',
    description: 'Every Git branch receives an isolated URL paired with its own Database branch.',
    onClick: () => undefined,
  },
];

export const HostingPage: React.FC = () => {
  const page = FALCO_PAGES[4];
  const [activeStep, setActiveStep] = useState(DEPLOY_STEPS.length);
  const [deployId, setDeployId] = useState('dep_84f2c9');
  const [deploying, setDeploying] = useState(false);

  const triggerDeploy = () => {
    setDeploying(true);
    setActiveStep(0);
    setDeployId(`dep_${Math.random().toString(16).slice(2, 8)}`);
  };

  useEffect(() => {
    if (!deploying) return;
    if (activeStep >= DEPLOY_STEPS.length) {
      setDeploying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setActiveStep((s) => s + 1);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [deploying, activeStep]);

  return (
    <div className="space-y-14">
      <PageHero
        page={page}
        primaryCtaLabel="Trigger Atomic Deploy"
        onPrimaryAction={triggerDeploy}
        secondaryCtaLabel="Inspect Live Sync"
        secondaryCtaPath="/live-sync"
      />

      <AnimatedContent distance={55} duration={0.8} threshold={0.08}>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-orange-300">
                Ember Edge Mesh
              </span>
              <SmokeTopic
                text="Immutable Atomic Rollouts Across 38 PoPs"
                as="h2"
                className="mt-1 text-2xl text-white sm:text-3xl"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <SpecularButton
                size="sm"
                radius={12}
                tint="#fb923c"
                tintOpacity={0.14}
                lineColor="#fb923c"
                onClick={triggerDeploy}
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>{deploying ? 'Propagating...' : 'Run Live Rollout'}</span>
              </SpecularButton>

              <SpecularButton
                size="sm"
                radius={12}
                tint="#ffffff"
                tintOpacity={0.04}
                lineColor="#f43f5e"
                onClick={() => {
                  setDeployId('dep_rollback_prev');
                  setActiveStep(DEPLOY_STEPS.length);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Instant Rollback</span>
              </SpecularButton>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-400/20 bg-orange-950/20 px-4 py-3 font-mono text-xs">
            <span className="text-zinc-300">
              Deployment ID: <strong className="text-orange-300">{deployId}</strong>
            </span>
            <span className="text-emerald-400">
              {activeStep >= DEPLOY_STEPS.length
                ? 'LIVE -> https://edge.falcostack.dev (38/38 PoPs synced)'
                : `Propagating stage ${activeStep + 1} of ${DEPLOY_STEPS.length}...`}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DEPLOY_STEPS.map((step, index) => {
              const done = index < activeStep;
              const current = index === activeStep && deploying;
              return (
                <div
                  key={step.label}
                  className={`rounded-2xl border p-4 transition-all ${
                    done
                      ? 'border-emerald-400/40 bg-emerald-500/10'
                      : current
                        ? 'border-orange-400/60 bg-orange-500/10'
                        : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-400">Stage 0{index + 1}</span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="text-orange-300">{step.duration}</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-white">{step.label}</div>
                  <div className="mt-2 font-mono text-[11px] text-zinc-400">{step.pop}</div>
                </div>
              );
            })}
          </div>
        </section>
      </AnimatedContent>

      <MagicBento
        items={HOSTING_BENTO_ITEMS}
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
