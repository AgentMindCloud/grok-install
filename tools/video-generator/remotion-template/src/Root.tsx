import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Explainer} from './Video';
import type {Scene} from './lib/scene';
import sceneJson from '../scene.json';

const scene = sceneJson as Scene;

export const Root: React.FC = () => {
  return (
    <Composition
      id="Explainer"
      component={Explainer}
      durationInFrames={Math.round(scene.totalSeconds * scene.fps)}
      fps={scene.fps}
      width={scene.width}
      height={scene.height}
      defaultProps={{
        scene,
        audioSrc: scene.audioSrc ? staticFile(scene.audioSrc) : null,
        musicSrc: scene.musicSrc ? staticFile(scene.musicSrc) : null,
      }}
    />
  );
};
