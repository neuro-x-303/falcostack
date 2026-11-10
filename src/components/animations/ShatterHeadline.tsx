import React, { useState } from 'react';

/**
 * Adapter wrapper for React Bits Pro "Shatter Type"
 * (`@reactbits-starter/shatter-type-tw`).
 *
 * Once `REACTBITS_LICENSE_KEY` is configured in `.env.local` and
 * `npx shadcn@latest add @reactbits-starter/shatter-type-tw`
 * has installed the official component, replace the placeholder markup below
 * with `<ShatterType text={text} ... />`.
 */
interface ShatterHeadlineProps {
  text?: string;
  accentColor?: string;
  className?: string;
}

export const ShatterHeadline: React.FC<ShatterHeadlineProps> = ({
  text = 'FalcoStack',
  accentColor = '#22d3ee',
  className = '',
}) => {
  const [shattered, setShattered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleShatter = () => {
    setShattered(true);
    window.setTimeout(() => setShattered(false), 700);
  };

  return (
    <div
      onClick={handleShatter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleShatter();
      }}
      title="Click to shatter & reassemble (Shatter Type slot)"
      data-rb-component="shatter-type"
      className={`group relative inline-flex cursor-pointer select-none flex-wrap items-center justify-center font-[family-name:var(--font-display)] font-bold tracking-tight ${className}`}
    >
      {text.split('').map((char, i) => {
        const angle = ((i % 2 === 0 ? 1 : -1) * (10 + (i * 5) % 18));
        const dx = (i - text.length / 2) * (shattered ? 18 : 0);
        const dy = shattered ? ((i % 2 === 0 ? -1 : 1) * (18 + (i % 3) * 10)) : 0;
        const isNear = hoveredIdx !== null && Math.abs(hoveredIdx - i) <= 1;

        return (
          <span
            key={`${char}-${i}`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              transform: shattered
                ? `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(1.06)`
                : isNear
                  ? `translateY(-4px) rotate(${i % 2 === 0 ? -2.5 : 2.5}deg)`
                  : 'translate(0, 0) rotate(0deg)',
              textShadow: isNear || shattered
                ? `0 0 28px ${accentColor}, 0 1px 0 rgba(255,255,255,0.45)`
                : '0 8px 32px rgba(0, 0, 0, 0.55)',
            }}
            className="relative inline-block transition-all duration-300 ease-out"
          >
            <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {char}
            </span>
            {/* Subtle fracture gleam line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </span>
        );
      })}
    </div>
  );
};
