export type SegmentKey = 'hook' | 'concept' | 'walkthrough' | 'result' | 'cta';

export type Caption = {
  start: number;
  end: number;
  text: string;
};

export type Segment = {
  key: SegmentKey;
  duration: number;
  narration: string;
  captions: Caption[];
};

export type Palette = {
  cyan: string;
  violet: string;
  amber: string;
  bg: string;
  fg: string;
  muted: string;
};

export type Scene = {
  fps: number;
  width: number;
  height: number;
  totalSeconds: number;
  palette: Palette;
  repo: {
    name: string;
    url: string;
    description: string;
  };
  candidate: {
    name: string;
    language: 'python' | 'typescript' | 'javascript';
    file: string;
    startLine: number;
    source: string;
  };
  segments: Segment[];
  audioSrc?: string | null;
  musicSrc?: string | null;
};

export const cumulativeOffsets = (scene: Scene): Record<SegmentKey, number> => {
  const offsets: Partial<Record<SegmentKey, number>> = {};
  let running = 0;
  for (const segment of scene.segments) {
    offsets[segment.key] = running;
    running += segment.duration;
  }
  return offsets as Record<SegmentKey, number>;
};
