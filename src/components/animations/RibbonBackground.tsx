import React from 'react';
import LightTunnel, { LightTunnelProps } from '@/components/LightTunnel';

interface RibbonBackgroundProps {
  tunnelProps?: LightTunnelProps;
  className?: string;
}

export const RibbonBackground: React.FC<RibbonBackgroundProps> = ({
  tunnelProps,
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030407] ${className}`}
      aria-hidden="true"
    >
      <LightTunnel
        cableColor="#cfe0ff"
        pulseColor="#015cff"
        cableCount={56}
        pulseDensity={0.5}
        flowDirection="inward"
        mouseInteraction
        clickSurge
        tunnelColor="#9ab8ff"
        tunnelOpacity={0.35}
        {...tunnelProps}
      />
      {/* Subtle radial vignette so foreground glass typography remains crisp */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(3,4,7,0.12)_0%,rgba(3,4,7,0.52)_72%,rgba(3,4,7,0.88)_100%)]" />
    </div>
  );
};
