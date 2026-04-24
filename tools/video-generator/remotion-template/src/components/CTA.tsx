import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import type {Segment, Palette, Scene} from '../lib/scene';

export const CTA: React.FC<{segment: Segment; palette: Palette; scene: Scene}> = ({
  segment,
  palette,
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const starPulse = 1 + Math.sin(frame / fps * 4) * 0.08;
  const underline = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 80}}>
      <div style={{textAlign: 'center', transform: `scale(${0.9 + enter * 0.1})`, opacity: enter}}>
        <div
          style={{
            fontSize: 180,
            transform: `scale(${starPulse})`,
            filter: `drop-shadow(0 0 40px ${palette.amber})`,
            marginBottom: 40,
          }}
        >
          ★
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: palette.fg,
            marginBottom: 32,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Star on GitHub
        </div>
        <div
          style={{
            fontSize: 48,
            color: palette.fg,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            padding: '18px 36px',
            borderRadius: 16,
            background: `${palette.cyan}11`,
            border: `2px solid ${palette.cyan}`,
            display: 'inline-block',
            position: 'relative',
          }}
        >
          {scene.repo.url.replace(/^https?:\/\//, '')}
          <div
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 10,
              height: 4,
              background: palette.cyan,
              transformOrigin: 'left center',
              transform: `scaleX(${underline})`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 36,
            color: palette.muted,
            maxWidth: 800,
            margin: '48px auto 0',
            lineHeight: 1.4,
          }}
        >
          {segment.narration}
        </div>
      </div>
    </AbsoluteFill>
  );
};
