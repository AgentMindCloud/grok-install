import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import type {Palette} from '../lib/scene';

// Layered gradient + drifting blobs, rendered with <div> and CSS filters so we
// stay within "no external deps (no Three.js)". The blobs use sin/cos to drift
// deterministically, which keeps frames reproducible.
export const Background: React.FC<{palette: Palette}> = ({palette}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const blobs = [
    {color: palette.cyan, cx: 30 + Math.sin(t * 0.4) * 10, cy: 20 + Math.cos(t * 0.3) * 8, size: 900},
    {color: palette.violet, cx: 75 + Math.cos(t * 0.25) * 10, cy: 70 + Math.sin(t * 0.35) * 10, size: 1100},
    {color: palette.amber, cx: 20 + Math.sin(t * 0.2) * 15, cy: 85 + Math.cos(t * 0.4) * 6, size: 700},
  ];

  const grain = interpolate(frame % 2, [0, 1], [0.02, 0.05]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 0%, ${palette.bg} 0%, #020410 100%)`,
      }}
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${blob.cx}%`,
            top: `${blob.cy}%`,
            width: blob.size,
            height: blob.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${blob.color}55 0%, ${blob.color}00 60%)`,
            filter: 'blur(80px)',
            mixBlendMode: 'screen',
          }}
        />
      ))}
      <AbsoluteFill style={{background: `rgba(255,255,255,${grain})`, mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};
