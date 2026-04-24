"""Write a ready-to-render Remotion project for one (repo, function) pair.

The `remotion-template/` next to this module is the canonical source. We copy
it into an output directory, then drop in `scene.json` + any narration/music
audio files under `public/`. That keeps the Remotion dependency graph clean:
scene.json is the only dynamic input.
"""

from __future__ import annotations

import json
import shutil
from dataclasses import asdict
from pathlib import Path
from typing import Optional

from .analyzer import FunctionCandidate, RepoSummary
from .brand import BrandPalette, FPS, WIDTH, HEIGHT, TOTAL_SECONDS
from .narration import NarrationScript


TEMPLATE_DIR = Path(__file__).resolve().parent.parent.parent / "remotion-template"


class RemotionProjectWriter:
    """Materialize a Remotion project directory ready for `remotion render`."""

    def __init__(self, palette: BrandPalette):
        self.palette = palette

    def write(
        self,
        out_dir: Path,
        repo: RepoSummary,
        candidate: FunctionCandidate,
        narration: NarrationScript,
        repo_url: str,
        audio_rel: Optional[str] = None,
        music_rel: Optional[str] = None,
    ) -> Path:
        out_dir = out_dir.resolve()
        if not TEMPLATE_DIR.exists():
            raise FileNotFoundError(f"Remotion template missing at {TEMPLATE_DIR}")

        if out_dir.exists():
            shutil.rmtree(out_dir)
        shutil.copytree(TEMPLATE_DIR, out_dir)

        scene = {
            "fps": FPS,
            "width": WIDTH,
            "height": HEIGHT,
            "totalSeconds": TOTAL_SECONDS,
            "palette": self.palette.to_dict(),
            "repo": {
                "name": repo.name,
                "url": repo_url,
                "description": repo.description,
            },
            "candidate": {
                "name": candidate.name,
                "language": candidate.language,
                "file": candidate.file,
                "startLine": candidate.start_line,
                "source": candidate.source,
            },
            "segments": [
                {
                    "key": s.key,
                    "duration": s.duration,
                    "narration": s.narration,
                    "captions": [asdict(c) for c in s.captions],
                }
                for s in narration.segments
            ],
            "audioSrc": audio_rel,
            "musicSrc": music_rel,
        }

        (out_dir / "scene.json").write_text(json.dumps(scene, indent=2), encoding="utf-8")
        (out_dir / "public").mkdir(exist_ok=True)
        return out_dir
