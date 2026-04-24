import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene, Palette} from '../lib/scene';

// Captions: pick the chunk whose [start, end) contains the current time.
// Rendered in the bottom 18% of the frame so it never overlaps the code block.
export const Captions: React.FC<{scene: Scene; palette: Palette}> = ({scene, palette}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const active = scene.segments
    .flatMap((s) => s.captions)
    .find((c) => t >= c.start && t < c.end);

  if (!active) return null;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 260}}>
      <div
        style={{
          maxWidth: '82%',
          padding: '20px 36px',
          borderRadius: 16,
          background: 'rgba(0, 0, 0, 0.72)',
          border: `1px solid ${palette.cyan}55`,
          color: palette.fg,
          fontSize: 46,
          lineHeight: 1.25,
          fontWeight: 700,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: `0 2px 10px ${palette.bg}`,
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
