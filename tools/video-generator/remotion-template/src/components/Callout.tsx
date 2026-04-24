import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import type {Segment, Palette, Scene} from '../lib/scene';

// Concept segment: shows the function name as a big title card with a
// "callout" list of what it does, pulled from the narration.
export const Callout: React.FC<{
  segment: Segment;
  palette: Palette;
  scene: Scene;
}> = ({segment, palette, scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const points = segment.narration.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 3);

  return (
    <AbsoluteFill style={{padding: 100, justifyContent: 'center'}}>
      <div
        style={{
          opacity: enter,
          transform: `translateX(${(1 - enter) * -80}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 12,
            background: `${palette.violet}22`,
            border: `2px solid ${palette.violet}`,
            color: palette.violet,
            fontSize: 28,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            marginBottom: 40,
            letterSpacing: 2,
          }}
        >
          CONCEPT
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: palette.fg,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            marginBottom: 60,
          }}
        >
          <span style={{color: palette.cyan}}>{scene.candidate.name}</span>
          <span style={{color: palette.muted}}>()</span>
        </div>
        {points.map((point, i) => {
          const delay = i * fps * 0.8;
          const pointIn = interpolate(frame - delay, [0, fps * 0.4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                marginBottom: 32,
                opacity: pointIn,
                transform: `translateY(${(1 - pointIn) * 20}px)`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  marginTop: 24,
                  borderRadius: 8,
                  background: palette.cyan,
                  boxShadow: `0 0 20px ${palette.cyan}`,
                }}
              />
              <div style={{fontSize: 48, color: palette.fg, lineHeight: 1.3, fontFamily: 'system-ui, sans-serif'}}>
                {point}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
