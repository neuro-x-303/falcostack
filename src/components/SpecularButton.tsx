'use client';

import React, { useEffect, useRef } from 'react';
import './SpecularButton.css';

const PAD = 24;
const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (value: number) => value - Math.floor(value);

// Single shared pointer tracker across all SpecularButton instances
const sharedPointer = { x: 0, y: 0, known: false };
const subscribers = new Set<() => void>();
let pointerBound = false;

const notifyAll = () => {
  subscribers.forEach((fn) => fn());
};

const ensurePointerListeners = () => {
  if (pointerBound || typeof window === 'undefined') return;
  pointerBound = true;

  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      sharedPointer.x = e.clientX;
      sharedPointer.y = e.clientY;
      sharedPointer.known = true;
      notifyAll();
    },
    { passive: true }
  );

  const onEnd = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    sharedPointer.known = false;
    notifyAll();
  };

  window.addEventListener('pointerup', onEnd, { passive: true });
  window.addEventListener('pointercancel', onEnd, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    sharedPointer.known = false;
    notifyAll();
  });
};

const rgbCache = new Map<string, [number, number, number]>();
let probeCtx: CanvasRenderingContext2D | null = null;

const toRgb = (value: string): [number, number, number] => {
  const hit = rgbCache.get(value);
  if (hit) return hit;
  let rgb: [number, number, number] = [255, 255, 255];
  if (typeof document !== 'undefined') {
    if (!probeCtx) {
      probeCtx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    }
    if (probeCtx) {
      probeCtx.clearRect(0, 0, 1, 1);
      probeCtx.fillStyle = '#000000';
      probeCtx.fillStyle = value;
      probeCtx.fillRect(0, 0, 1, 1);
      const [r, g, b] = probeCtx.getImageData(0, 0, 1, 1).data;
      rgb = [r, g, b];
    }
  }
  rgbCache.set(value, rgb);
  return rgb;
};

const rgba = (rgb: [number, number, number], a: number) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(a, 0, 1).toFixed(3)})`;

const loopPosition = (x: number, y: number, halfX: number, halfY: number, r: number) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const qx = ax - innerX;
  const qy = ay - innerY;
  let s: number;
  if (qx > 0 && qy > 0) s = innerY + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, innerY);
  else s = innerY + arc + innerX - Math.min(ax, innerX);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrap(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position: number, halfX: number, halfY: number, r: number): [number, number] => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  let s = wrap(position) * 4 * quarter;
  let signX = 1;
  let signY = 1;
  if (s > 3 * quarter) {
    s = 4 * quarter - s;
    signY = -1;
  } else if (s > 2 * quarter) {
    s -= 2 * quarter;
    signX = -1;
    signY = -1;
  } else if (s > quarter) {
    s = 2 * quarter - s;
    signX = -1;
  }
  let x = innerX - (s - innerY - arc);
  let y = halfY;
  if (s <= innerY) {
    x = halfX;
    y = s;
  } else if (s <= innerY + arc) {
    const angle = (s - innerY) / Math.max(r, 0.0001);
    x = innerX + Math.cos(angle) * r;
    y = innerY + Math.sin(angle) * r;
  }
  return [x * signX, y * signY];
};

const drawRoundedRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
};

export interface SpecularButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'style'> {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

const SpecularButton: React.FC<SpecularButtonProps> = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const settings = {
    radius: Math.max(0, radius),
    lineColor: String(lineColor),
    baseColor: String(baseColor),
    intensity: Math.max(0, intensity),
    idleIntensity: clamp(idleIntensity, 0, 1),
    shineSize: Math.max(0, shineSize),
    shineFade: Math.max(0, shineFade),
    thickness: Math.max(0, thickness),
    glow: Math.max(0, glow),
    speed,
    followMouse,
    proximity: Math.max(1, proximity),
    autoAnimate,
    disabled,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!button || !canvas || !ctx) return undefined;

    ensurePointerListeners();

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const cornerRadius = (s: typeof settings) => Math.min(s.radius, view.width / 2, view.height / 2);

    const restSpot = (s: typeof settings) => {
      const r = cornerRadius(s);
      const inset = r * (1 - Math.SQRT1_2);
      return loopPosition(inset - view.width / 2, view.height / 2 - inset, view.width / 2, view.height / 2, r);
    };

    const aim = (s: typeof settings) => {
      if (!s.followMouse || s.disabled || !sharedPointer.known) return null;
      const rect = button.getBoundingClientRect();
      const scale = rect.width / view.width || 1;
      const halfX = view.width / 2;
      const halfY = view.height / 2;
      const x = (sharedPointer.x - rect.left - rect.width / 2) / scale;
      const y = (rect.top + rect.height / 2 - sharedPointer.y) / scale;
      const distance = Math.hypot(Math.max(Math.abs(x) - halfX, 0), Math.max(Math.abs(y) - halfY, 0));
      const t = clamp(1 - distance / s.proximity, 0, 1);
      const near = t * t * (3 - 2 * t);
      const nearest = loopPosition(x, y, halfX, halfY, cornerRadius(s));
      if (distance > 0) return { spot: nearest, near };
      const depth = clamp(Math.min(halfX - Math.abs(x), halfY - Math.abs(y)) / (halfY * 0.8), 0, 1);
      const sway = restSpot(s) - (x / halfX) * 0.06 - (y / halfY) * 0.02;
      const offset = sway - nearest - Math.round(sway - nearest);
      return { spot: wrap(nearest + offset * depth * depth * (3 - 2 * depth)), near };
    };

    const draw = (s: typeof settings) => {
      const { width, height, ratio } = view;
      const totalW = width + PAD * 2;
      const totalH = height + PAD * 2;
      const r = cornerRadius(s);
      const cx = PAD + width / 2;
      const cy = PAD + height / 2;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, totalW, totalH);

      const lineRgb = toRgb(s.lineColor);
      const baseRgb = toRgb(s.baseColor);
      const effectiveIntensity = clamp(s.intensity * (state.level + state.press * 0.8), 0, 1.5);

      const [rimX, rimY] = rimPoint(state.spot, width / 2, height / 2, r);
      const rimMag = Math.max(Math.hypot(rimX, rimY), 0.0001);
      const pull = 1 - Math.min(0.35 * (height / 2), rimMag) / rimMag;
      const entryX = cx + rimX * pull;
      const entryY = cy - rimY * pull;

      // Subtle interior specular light pool near entry point
      if (s.glow > 0 && effectiveIntensity > 0.01) {
        ctx.save();
        drawRoundedRectPath(ctx, PAD, PAD, width, height, r);
        ctx.clip();
        const poolRadius = Math.max(width * 0.45, height * 1.1);
        const poolGrad = ctx.createRadialGradient(entryX, entryY, 0, entryX, entryY, poolRadius);
        const poolAlpha = clamp(0.11 * s.glow * effectiveIntensity, 0, 0.35);
        poolGrad.addColorStop(0, rgba(lineRgb, poolAlpha));
        poolGrad.addColorStop(1, rgba(lineRgb, 0));
        ctx.fillStyle = poolGrad;
        ctx.fillRect(PAD, PAD, width, height);
        ctx.restore();
      }

      // Crisp base hairline border
      ctx.save();
      drawRoundedRectPath(ctx, PAD + 0.5, PAD + 0.5, Math.max(1, width - 1), Math.max(1, height - 1), r);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(baseRgb, 0.6);
      ctx.stroke();
      ctx.restore();

      // Conic specular highlight lobes around rounded rectangle
      if (effectiveIntensity > 0.01) {
        const spotAngle = Math.atan2(-rimY, rimX);
        const halfWin = clamp(s.shineSize / 360 + state.press * 0.06, 0.01, 0.24);
        const fadeWin = clamp(s.shineFade / 360 + 0.005, 0.02, 0.25);
        const span = halfWin + fadeWin;
        const primaryAlpha = clamp(effectiveIntensity, 0, 1);
        const backAlpha = clamp(effectiveIntensity * 0.45, 0, 0.75);

        const grad = ctx.createConicGradient(spotAngle, cx, cy);
        grad.addColorStop(0, rgba(lineRgb, primaryAlpha));
        grad.addColorStop(clamp(halfWin, 0.001, 0.25), rgba(lineRgb, primaryAlpha));
        grad.addColorStop(clamp(span, 0.002, 0.48), rgba(lineRgb, 0));
        grad.addColorStop(clamp(0.5 - span, 0.003, 0.49), rgba(lineRgb, 0));
        grad.addColorStop(clamp(0.5 - halfWin * 0.7, 0.004, 0.499), rgba(lineRgb, backAlpha));
        grad.addColorStop(0.5, rgba(lineRgb, backAlpha));
        grad.addColorStop(clamp(0.5 + halfWin * 0.7, 0.501, 0.996), rgba(lineRgb, backAlpha));
        grad.addColorStop(clamp(0.5 + span, 0.502, 0.997), rgba(lineRgb, 0));
        grad.addColorStop(clamp(1 - span, 0.52, 0.998), rgba(lineRgb, 0));
        grad.addColorStop(clamp(1 - halfWin, 0.75, 0.999), rgba(lineRgb, primaryAlpha));
        grad.addColorStop(1, rgba(lineRgb, primaryAlpha));

        // Soft edge bloom
        if (s.glow > 0) {
          ctx.save();
          drawRoundedRectPath(ctx, PAD + 0.5, PAD + 0.5, Math.max(1, width - 1), Math.max(1, height - 1), r);
          ctx.lineWidth = Math.max(1, s.thickness * 1.4);
          ctx.shadowColor = rgba(lineRgb, clamp(0.65 * s.glow * effectiveIntensity, 0, 0.9));
          ctx.shadowBlur = 10 * s.glow;
          ctx.strokeStyle = grad;
          ctx.stroke();
          ctx.restore();
        }

        // Sharp lit edge
        ctx.save();
        drawRoundedRectPath(ctx, PAD + 0.5, PAD + 0.5, Math.max(1, width - 1), Math.max(1, height - 1), r);
        ctx.lineWidth = Math.max(0.75, s.thickness);
        ctx.strokeStyle = grad;
        ctx.stroke();
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = aim(s);
      const spinning = s.autoAnimate && !reduce;
      const steering = !!target && target.near > 0;
      if (!state.ready) {
        state.spot = restSpot(s);
        state.level = s.autoAnimate ? 1 : s.idleIntensity;
        state.ready = true;
      }
      let diff = 0;
      if (spinning && !steering) state.spot = wrap(state.spot + (s.speed / TAU) * dt);
      else {
        diff = (steering ? target.spot : restSpot(s)) - state.spot;
        diff -= Math.round(diff);
        state.spot = wrap(state.spot + diff * (1 - Math.exp(-dt * 8)));
      }
      const level = s.autoAnimate ? 1 : s.idleIntensity + (1 - s.idleIntensity) * (target ? target.near : 0);
      state.level += (level - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);
      draw(s);
      const settling = Math.abs(diff) > 0.0002 || Math.abs(level - state.level) > 0.001 || state.press > 0.002;
      if (settling || (spinning && !steering)) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const measure = (entry?: ResizeObserverEntry) => {
      const box = entry?.borderBoxSize?.[0];
      view.width = Math.max(1, box ? box.inlineSize : button.offsetWidth);
      view.height = Math.max(1, box ? box.blockSize : button.offsetHeight);
      view.ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round((view.width + PAD * 2) * view.ratio));
      canvas.height = Math.max(1, Math.round((view.height + PAD * 2) * view.ratio));
      if (state.ready) draw(settingsRef.current);
      wake();
    };

    const onPointerDown = () => {
      if (!settingsRef.current.disabled) state.press = 1;
      wake();
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') {
        last = 0;
        wake();
      }
    };

    subscribers.add(wake);
    const resizeObserver = new ResizeObserver((entries) => measure(entries[entries.length - 1]));
    resizeObserver.observe(button);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(button);
    button.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('visibilitychange', onVisibility);
    measure();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      subscribers.delete(wake);
      resizeObserver.disconnect();
      intersection.disconnect();
      button.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={
        {
          '--sb-radius': `${radius}px`,
          '--sb-tint': tint,
          '--sb-tint-opacity': tintOpacity,
          '--sb-blur': `${blur}px`,
          '--sb-text-color': textColor,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
