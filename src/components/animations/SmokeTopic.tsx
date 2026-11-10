import React, { useEffect, useState } from 'react';

/**
 * Optimized Smoke Type heading component (`SmokeTopic`).
 * Uses compositor-only opacity + transform transitions (no per-character GPU filter thrashing).
 */
interface SmokeTopicProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  replayOnHover?: boolean;
  className?: string;
}

export const SmokeTopic: React.FC<SmokeTopicProps> = ({
  text,
  as: Tag = 'h2',
  replayOnHover = true,
  className = '',
}) => {
  const [seed, setSeed] = useState(0);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    setCondensed(false);
    const timer = window.setTimeout(() => setCondensed(true), 30);
    return () => window.clearTimeout(timer);
  }, [text, seed]);

  const handleHover = () => {
    if (!replayOnHover) return;
    setSeed((s) => s + 1);
  };

  return (
    <Tag
      onMouseEnter={handleHover}
      data-rb-component="smoke-type"
      className={`font-[family-name:var(--font-display)] font-semibold tracking-tight ${className}`}
    >
      {text.split('').map((char, idx) => (
        <span
          key={`${seed}-${idx}`}
          style={{
            transitionDelay: `${Math.min(idx * 18, 420)}ms`,
            opacity: condensed ? 1 : 0,
            transform: condensed
              ? 'translate3d(0, 0, 0) scale(1)'
              : `translate3d(0, ${10 + (idx % 3) * 3}px, 0) scale(1.06)`,
          }}
          className="inline-block whitespace-pre transition-[opacity,transform] duration-500 ease-out"
        >
          {char}
        </span>
      ))}
    </Tag>
  );
};
