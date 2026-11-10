import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FalcoPageMeta } from '@/data/pages';
import { ShatterHeadline } from '@/components/animations/ShatterHeadline';
import { SmokeTopic } from '@/components/animations/SmokeTopic';
import AnimatedContent from '@/components/AnimatedContent';
import SpecularButton from '@/components/SpecularButton';

interface PageHeroProps {
  page: FalcoPageMeta;
  primaryCtaLabel?: string;
  primaryCtaPath?: string;
  onPrimaryAction?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaPath?: string;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  page,
  primaryCtaLabel = 'Launch Console',
  primaryCtaPath = '/edge-pricing',
  onPrimaryAction,
  secondaryCtaLabel = 'Explore Preset Mesh',
  secondaryCtaPath = '/edge-pricing',
  children,
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Preset & System Telemetry Pill */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{
              backgroundColor: page.accentColor,
              boxShadow: `0 0 12px ${page.accentColor}`,
            }}
          />
          <span className="font-mono uppercase tracking-wider text-zinc-400">
            Preset: <strong className="text-white">{page.presetLabel}</strong>
          </span>
          <span className="text-zinc-600">•</span>
          <span>{page.badge}</span>
          <span className="hidden text-zinc-600 sm:inline">•</span>
          <span className="hidden font-mono text-zinc-300 sm:inline">{page.latency}</span>
        </div>

        {/* Top Headline: FalcoStack in Shatter Type */}
        <h1 className="mb-3 text-5xl sm:text-7xl md:text-8xl leading-none">
          <ShatterHeadline text="FalcoStack" accentColor={page.accentColor} />
        </h1>

        {/* Main Topic Headline in Smoke Type */}
        <div className="mb-5">
          <SmokeTopic
            text={page.headlineTopic}
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl text-zinc-100"
          />
        </div>

        <AnimatedContent
          key={page.id}
          trigger="mount"
          distance={32}
          duration={0.75}
          delay={0.08}
          stagger={0.08}
          ease="power3.out"
          className="flex flex-col items-center"
        >
          <p className="mb-9 max-w-2xl text-base leading-relaxed text-zinc-300/90 sm:text-lg">
            {page.summary}
          </p>

          {/* Action Buttons in SpecularButton */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            <SpecularButton
              size="lg"
              radius={18}
              tint={page.accentColor}
              tintOpacity={0.14}
              blur={10}
              textColor="#ffffff"
              lineColor={page.accentColor}
              baseColor="#52525b"
              intensity={1.15}
              idleIntensity={0.45}
              autoAnimate
              speed={0.42}
              onClick={() => {
                if (onPrimaryAction) onPrimaryAction();
                else navigate(primaryCtaPath);
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </SpecularButton>

            <SpecularButton
              size="lg"
              radius={18}
              tint="#ffffff"
              tintOpacity={0.05}
              blur={10}
              textColor="#f4f4f5"
              lineColor="#ffffff"
              baseColor="#3f3f46"
              intensity={0.95}
              idleIntensity={0.3}
              onClick={() => navigate(secondaryCtaPath)}
            >
              <span>{secondaryCtaLabel}</span>
            </SpecularButton>
          </div>
        </AnimatedContent>

        {children && <div className="mt-12 w-full">{children}</div>}
      </div>
    </section>
  );
};
