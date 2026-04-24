import React from 'react';
import {AbsoluteFill, Audio, Sequence, useVideoConfig} from 'remotion';
import type {Scene, Segment} from './lib/scene';
import {Background} from './components/Background';
import {Hook} from './components/Hook';
import {Callout} from './components/Callout';
import {CodeWalkthrough} from './components/CodeWalkthrough';
import {ResultDemo} from './components/ResultDemo';
import {CTA} from './components/CTA';
import {Captions} from './components/Captions';

type Props = {
  scene: Scene;
  audioSrc: string | null;
  musicSrc: string | null;
};

const renderSegment = (segment: Segment, scene: Scene): React.ReactElement => {
  switch (segment.key) {
    case 'hook':
      return <Hook segment={segment} palette={scene.palette} repoName={scene.repo.name} />;
    case 'concept':
      return <Callout segment={segment} palette={scene.palette} scene={scene} />;
    case 'walkthrough':
      return <CodeWalkthrough segment={segment} palette={scene.palette} scene={scene} />;
    case 'result':
      return <ResultDemo segment={segment} palette={scene.palette} scene={scene} />;
    case 'cta':
      return <CTA segment={segment} palette={scene.palette} scene={scene} />;
  }
};

export const Explainer: React.FC<Props> = ({scene, audioSrc, musicSrc}) => {
  const {fps} = useVideoConfig();
  let frameOffset = 0;

  return (
    <AbsoluteFill>
      <Background palette={scene.palette} />
      {scene.segments.map((segment) => {
        const from = frameOffset;
        const durationInFrames = Math.round(segment.duration * fps);
        frameOffset += durationInFrames;
        return (
          <Sequence key={segment.key} from={from} durationInFrames={durationInFrames}>
            {renderSegment(segment, scene)}
          </Sequence>
        );
      })}
      <Captions scene={scene} palette={scene.palette} />
      {audioSrc && <Audio src={audioSrc} volume={1} />}
      {musicSrc && <Audio src={musicSrc} volume={0.18} />}
    </AbsoluteFill>
  );
};
