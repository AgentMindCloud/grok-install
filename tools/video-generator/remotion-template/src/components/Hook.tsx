import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Segment, Palette} from '../lib/scene';

export const Hook: React.FC<{segment: Segment; palette: Palette; repoName: string}> = ({
  segment,
  palette,
  repoName,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 14, stiffness: 140}});
  const pulse = 1 + Math.sin(frame / fps * 3) * 0.02;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 80}}>
      <div
        style={{
          transform: `translateY(${(1 - enter) * 40}px) scale(${pulse})`,
          opacity: enter,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: palette.cyan,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          {repoName}
        </div>
        <div
          style={{
            fontSize: 90,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            lineHeight: 1.1,
            color: palette.fg,
            textShadow: `0 0 40px ${palette.cyan}44`,
          }}
        >
          {segment.narration}
        </div>
      </div>
    </AbsoluteFill>
  );
};
