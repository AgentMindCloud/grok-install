import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import type {Segment, Palette, Scene} from '../lib/scene';
import {tokenize, colorFor, Token} from '../lib/highlight';

const MAX_VISIBLE_LINES = 15;

// Group tokens back into lines so we can animate line-by-line, then
// character-by-character inside the current line.
const tokensByLine = (tokens: Token[]): Token[][] => {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split('\n');
    parts.forEach((part, idx) => {
      if (part) lines[lines.length - 1].push({text: part, kind: token.kind});
      if (idx < parts.length - 1) lines.push([]);
    });
  }
  return lines.slice(0, MAX_VISIBLE_LINES);
};

export const CodeWalkthrough: React.FC<{
  segment: Segment;
  palette: Palette;
  scene: Scene;
}> = ({segment, palette, scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lines = useMemo(
    () => tokensByLine(tokenize(scene.candidate.source, scene.candidate.language)),
    [scene.candidate.source, scene.candidate.language],
  );

  const totalChars = lines.reduce((sum, line) => sum + line.reduce((s, t) => s + t.text.length, 0), 0);
  const duration = segment.duration * fps;
  const typed = Math.round(interpolate(frame, [0, duration * 0.85], [0, totalChars], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  // Find which line the cursor is on and highlight it.
  let seen = 0;
  let activeLine = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const lineLen = lines[i].reduce((s, t) => s + t.text.length, 0) + 1;
    if (typed <= seen + lineLen) {
      activeLine = i;
      break;
    }
    seen += lineLen;
    activeLine = i;
  }

  return (
    <AbsoluteFill style={{padding: 80, justifyContent: 'center'}}>
      <div
        style={{
          borderRadius: 28,
          background: 'rgba(7, 11, 26, 0.82)',
          border: `1px solid ${palette.cyan}44`,
          boxShadow: `0 40px 120px ${palette.violet}33, inset 0 0 60px rgba(0,0,0,0.6)`,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 28px',
            borderBottom: `1px solid ${palette.cyan}22`,
          }}
        >
          <div style={{width: 14, height: 14, borderRadius: 7, background: '#ff5f57'}} />
          <div style={{width: 14, height: 14, borderRadius: 7, background: '#febc2e'}} />
          <div style={{width: 14, height: 14, borderRadius: 7, background: '#28c840'}} />
          <div
            style={{
              marginLeft: 20,
              color: palette.muted,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 26,
            }}
          >
            {scene.candidate.file}
          </div>
        </div>
        <div
          style={{
            padding: '36px 44px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 40,
            lineHeight: 1.45,
            color: palette.fg,
          }}
        >
          {lines.map((line, lineIdx) => {
            const prefixChars = lines.slice(0, lineIdx).reduce(
              (sum, prev) => sum + prev.reduce((s, t) => s + t.text.length, 0) + 1,
              0,
            );
            const lineChars = line.reduce((s, t) => s + t.text.length, 0);
            const availableForLine = Math.max(0, Math.min(lineChars, typed - prefixChars));
            const isActive = lineIdx === activeLine;
            return (
              <div
                key={lineIdx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 56,
                  padding: '4px 10px',
                  borderRadius: 10,
                  background: isActive ? `${palette.cyan}18` : 'transparent',
                  boxShadow: isActive ? `inset 3px 0 0 ${palette.cyan}` : 'none',
                  transition: 'background 0.12s ease',
                }}
              >
                <span
                  style={{
                    color: palette.muted,
                    marginRight: 24,
                    width: 48,
                    textAlign: 'right',
                    opacity: 0.7,
                  }}
                >
                  {scene.candidate.startLine + lineIdx}
                </span>
                <span style={{whiteSpace: 'pre'}}>
                  {renderLine(line, availableForLine, palette)}
                  {isActive && typed < totalChars && <Cursor color={palette.cyan} frame={frame} />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const renderLine = (
  tokens: Token[],
  availableChars: number,
  palette: Palette,
): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let remaining = availableChars;
  tokens.forEach((token, i) => {
    if (remaining <= 0) return;
    const slice = token.text.slice(0, remaining);
    remaining -= slice.length;
    nodes.push(
      <span key={i} style={{color: colorFor(token.kind, palette)}}>
        {slice}
      </span>,
    );
  });
  return nodes;
};

const Cursor: React.FC<{color: string; frame: number}> = ({color, frame}) => {
  const blink = Math.floor(frame / 10) % 2 === 0 ? 1 : 0.2;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 16,
        height: 36,
        marginLeft: 4,
        background: color,
        transform: 'translateY(4px)',
        opacity: blink,
      }}
    />
  );
};
