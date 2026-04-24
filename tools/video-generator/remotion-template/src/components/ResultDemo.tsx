import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import type {Segment, Palette, Scene} from '../lib/scene';

// Stylized terminal showing `> fn(...)` followed by a staged result.
export const ResultDemo: React.FC<{
  segment: Segment;
  palette: Palette;
  scene: Scene;
}> = ({segment, palette, scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  const resultReveal = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{padding: 80, justifyContent: 'center'}}>
      <div
        style={{
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
          borderRadius: 28,
          padding: 48,
          background: 'rgba(5, 8, 18, 0.88)',
          border: `2px solid ${palette.amber}66`,
          boxShadow: `0 40px 140px ${palette.amber}22`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        <div
          style={{
            color: palette.amber,
            fontSize: 28,
            letterSpacing: 3,
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          Result
        </div>
        <div style={{fontSize: 48, color: palette.muted, marginBottom: 24}}>
          <span style={{color: palette.cyan}}>{'>'}</span>{' '}
          <span style={{color: palette.fg}}>{scene.candidate.name}</span>
          <span style={{color: palette.muted}}>()</span>
        </div>
        <div
          style={{
            fontSize: 52,
            color: palette.fg,
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
            opacity: resultReveal,
          }}
        >
          {segment.narration}
        </div>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            opacity: resultReveal,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: '#28c840',
              boxShadow: '0 0 20px #28c840',
            }}
          />
          <div style={{color: palette.muted, fontSize: 28, letterSpacing: 2}}>
            READY IN PRODUCTION
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
