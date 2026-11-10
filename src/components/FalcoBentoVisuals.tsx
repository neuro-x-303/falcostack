import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Braces, Check, Database, GitBranch, Globe, KeyRound, Radio, ShieldCheck, Zap } from 'lucide-react';
import { mbVars } from '@/components/MagicBento';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const DB_BARS = [38, 54, 46, 72, 61, 92, 78];

export const FalcoDatabaseBars: React.FC = () => (
  <div className="magic-bento__bars">
    <div className="magic-bento__figure">
      <span className="magic-bento__figure-value">1.8 ms</span>
      <span className="magic-bento__figure-note">p95 CoW Read</span>
    </div>
    <div className="magic-bento__bars-plot">
      {DB_BARS.map((height, index) => (
        <span
          key={index}
          className="magic-bento__bar"
          data-peak={height === Math.max(...DB_BARS) ? '' : undefined}
          style={mbVars({ '--h': height / 100, '--i': index })}
        />
      ))}
    </div>
  </div>
);

const VECTOR_QPS = [3.1, 3.8, 3.5, 4.9, 4.4, 5.8, 5.3, 6.9, 6.5, 8.2, 9.4, 12.4];
type Pt = [number, number];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildCurve = (values: number[], width: number, height: number) => {
  const top = 6;
  const bottom = 2;
  const low = Math.min(...values) * 0.7;
  const high = Math.max(...values);
  const points: Pt[] = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    top + (1 - (value - low) / (high - low)) * (height - top - bottom),
  ]);
  const count = points.length;
  const slopes: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  }
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === count - 1) return slopes[count - 2];
    return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
  });
  for (let i = 0; i < count - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i] / slopes[i];
    const b = tangents[i + 1] / slopes[i];
    const len = a * a + b * b;
    if (len > 9) {
      const scale = 3 / Math.sqrt(len);
      tangents[i] = scale * a * slopes[i];
      tangents[i + 1] = scale * b * slopes[i];
    }
  }
  let line = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  const samples: Pt[] = [];
  for (let i = 0; i < count - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const third = (x1 - x0) / 3;
    const c1: Pt = [x0 + third, y0 + tangents[i] * third];
    const c2: Pt = [x1 - third, y1 - tangents[i + 1] * third];
    line += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
    for (let step = 0; step < 12; step++) {
      const t = step / 12;
      const u = 1 - t;
      samples.push([
        u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1,
        u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1,
      ]);
    }
  }
  samples.push(points[count - 1]);
  const area = `${line} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
  return { line, area, samples };
};

const sampleY = (samples: Pt[], x: number) => {
  let index = 1;
  while (index < samples.length - 1 && samples[index][0] < x) index++;
  const [x0, y0] = samples[index - 1];
  const [x1, y1] = samples[index];
  const t = x1 === x0 ? 0 : clamp((x - x0) / (x1 - x0), 0, 1);
  return y0 + (y1 - y0) * t;
};

export const FalcoDynamicChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const update = () => {
      const next = { width: plot.clientWidth, height: plot.clientHeight };
      setSize(prev => (prev && prev.width === next.width && prev.height === next.height ? prev : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const shape = useMemo(
    () => (size && size.width > 4 && size.height > 4 ? buildCurve(VECTOR_QPS, size.width, size.height) : null),
    [size]
  );

  const scrub = (event: React.PointerEvent<HTMLDivElement>) => {
    const plot = plotRef.current;
    const chart = chartRef.current;
    const line = scrubRef.current;
    const dot = dotRef.current;
    const label = valueRef.current;
    const note = noteRef.current;
    if (!shape || !plot || !chart || !line || !dot || !label || !note) return;
    const rect = plot.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = sampleY(shape.samples, x);
    const pos = (x / Math.max(1, rect.width)) * (VECTOR_QPS.length - 1);
    const index = Math.floor(pos);
    const next = Math.min(VECTOR_QPS.length - 1, index + 1);
    const value = VECTOR_QPS[index] + (VECTOR_QPS[next] - VECTOR_QPS[index]) * (pos - index);
    chart.dataset.scrub = '';
    line.style.transform = `translateX(${x.toFixed(1)}px)`;
    dot.style.transform = `translateY(${y.toFixed(1)}px)`;
    label.textContent = `${value.toFixed(1)}k/s`;
    note.textContent = `PoP ${Math.round(pos) + 1} • HNSW`;
  };

  const rest = () => {
    if (chartRef.current) delete chartRef.current.dataset.scrub;
    if (valueRef.current) valueRef.current.textContent = '12.4k/s';
    if (noteRef.current) noteRef.current.textContent = '2.9ms recall';
  };

  return (
    <div
      ref={chartRef}
      className="magic-bento__chart"
      onPointerMove={scrub}
      onPointerDown={scrub}
      onPointerLeave={rest}
    >
      <div className="magic-bento__figure">
        <span ref={valueRef} className="magic-bento__figure-value">
          12.4k/s
        </span>
        <span ref={noteRef} className="magic-bento__figure-note">
          2.9ms recall
        </span>
      </div>
      <div ref={plotRef} className="magic-bento__plot">
        {shape && size && (
          <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
            <path className="magic-bento__chart-area" d={shape.area} />
            <path className="magic-bento__chart-line" d={shape.line} pathLength={1} />
          </svg>
        )}
        <span ref={scrubRef} className="magic-bento__scrub">
          <span ref={dotRef} className="magic-bento__scrub-dot" />
        </span>
      </div>
    </div>
  );
};

const CURSOR_ARROW = (
  <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
    <path
      d="M2.2 1.6 13.4 9.9c.5.4.3 1.2-.4 1.3l-4.6.6-2.2 4.2c-.3.6-1.2.5-1.4-.1L1.2 2.4c-.2-.6.5-1.1 1-.8Z"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const FalcoLiveSyncVisual: React.FC = () => (
  <div className="magic-bento__collab magic-bento__well">
    <span className="magic-bento__doc-title">CRDT Table Sync • prod_main</span>
    <div className="magic-bento__lines">
      <span className="magic-bento__line" style={mbVars({ '--w': '90%' })} />
      <span className="magic-bento__line" style={mbVars({ '--w': '74%' })} />
      <span className="magic-bento__line" style={mbVars({ '--w': '84%' })} />
      <span className="magic-bento__line" style={mbVars({ '--w': '46%' })} />
      <span className="magic-bento__line magic-bento__line--gap" style={mbVars({ '--w': '88%' })} />
      <span className="magic-bento__line" style={mbVars({ '--w': '72%' })}>
        <span className="magic-bento__selection" style={mbVars({ '--from': '18%', '--span': '58%' })}>
          <span className="magic-bento__caret" />
        </span>
      </span>
      <span className="magic-bento__line" style={mbVars({ '--w': '80%' })} />
    </div>
    <span
      className="magic-bento__cursor magic-bento__cursor--primary"
      style={mbVars({ '--x': '56%', '--y': '52%', '--i': 0, '--path': 'magic-bento-path-a' })}
    >
      {CURSOR_ARROW}
      <span className="magic-bento__cursor-name">public.orders</span>
    </span>
    <span
      className="magic-bento__cursor magic-bento__cursor--secondary"
      style={mbVars({ '--x': '28%', '--y': '24%', '--i': 1, '--path': 'magic-bento-path-b' })}
    >
      {CURSOR_ARROW}
      <span className="magic-bento__cursor-name">public.users</span>
    </span>
  </div>
);

const HOSTING_STEPS = [
  { label: 'Bundle', time: '0.9s' },
  { label: 'Wasm Edge', time: '0.7s' },
  { label: '38 PoPs', time: '1.2s' },
  { label: 'Cutover', time: '0.4s' },
];

export const FalcoHostingFlowVisual: React.FC = () => (
  <div className="magic-bento__flow" style={mbVars({ '--n': HOSTING_STEPS.length })}>
    <div className="magic-bento__flow-trigger magic-bento__tile">
      <span className="magic-bento__flow-glyph">
        <GitBranch className="h-4 w-4" />
      </span>
      <span className="magic-bento__flow-copy">
        <span className="magic-bento__flow-name">falco deploy --all</span>
        <span className="magic-bento__flow-meta magic-bento__flow-hash">7d4e9a1</span>
      </span>
    </div>
    <ol className="magic-bento__steps magic-bento__well">
      <span className="magic-bento__rail" aria-hidden="true">
        <span className="magic-bento__rail-fill" />
      </span>
      {HOSTING_STEPS.map((step, index) => (
        <li key={step.label} className="magic-bento__step" style={mbVars({ '--i': index })}>
          <span className="magic-bento__status">
            <span className="magic-bento__pending" />
            <span className="magic-bento__spinner" />
            <span className="magic-bento__done">
              <Check className="h-3 w-3" strokeWidth={2.8} />
            </span>
          </span>
          {step.label}
          <span className="magic-bento__step-time">{step.time}</span>
        </li>
      ))}
    </ol>
  </div>
);

const HUB_NODES = [
  { key: 'db', Icon: Database, x: '17%', y: '24%' },
  { key: 'dyn', Icon: Braces, x: '83%', y: '24%' },
  { key: 'host', Icon: Globe, x: '17%', y: '78%' },
  { key: 'sync', Icon: Radio, x: '83%', y: '78%' },
];

export const FalcoApiHubVisual: React.FC = () => (
  <div className="magic-bento__hub">
    <svg className="magic-bento__hub-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {HUB_NODES.map(node => (
        <line key={node.key} x1={parseFloat(node.x)} y1={parseFloat(node.y)} x2="50" y2="51" pathLength={1} />
      ))}
    </svg>
    {HUB_NODES.map((node, index) => (
      <span
        key={`pkt-${node.key}`}
        className="magic-bento__packet"
        style={mbVars({ '--x': node.x, '--y': node.y, '--i': index })}
      />
    ))}
    {HUB_NODES.map((node, index) => (
      <span
        key={node.key}
        className="magic-bento__hub-node magic-bento__tile"
        style={mbVars({ '--x': node.x, '--y': node.y, '--s': '26px', '--i': index + 1 })}
      >
        <node.Icon className="h-3.5 w-3.5" />
      </span>
    ))}
    <span
      className="magic-bento__hub-node magic-bento__tile"
      style={mbVars({ '--x': '50%', '--y': '51%', '--s': '34px', '--i': 0 })}
    >
      <Zap className="h-4 w-4" />
    </span>
  </div>
);

export const FalcoSecurityShieldVisual: React.FC = () => (
  <div className="magic-bento__shield">
    <div className="magic-bento__setting magic-bento__tile">
      <KeyRound className="h-3.5 w-3.5 shrink-0" />
      <span className="magic-bento__setting-label">mTLS Edge</span>
      <span className="magic-bento__switch" style={mbVars({ '--i': 0 })} />
    </div>
    <div className="magic-bento__setting magic-bento__tile">
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
      <span className="magic-bento__setting-label">PITR Vault</span>
      <span className="magic-bento__switch" style={mbVars({ '--i': 1 })} />
    </div>
  </div>
);
