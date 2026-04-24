"""Orchestrate a Remotion render. Returns the output MP4 path.

We invoke ``npx remotion render`` rather than binding Remotion directly, which
keeps the Python side free of Node. If Remotion is not installed we return
``None`` and the caller reports "render-skipped" in its batch output instead of
crashing the whole run.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from typing import Optional


class Renderer:
    def __init__(self, concurrency: Optional[int] = None):
        self.concurrency = concurrency

    def render(self, project_dir: Path, out_path: Path) -> Optional[Path]:
        node = shutil.which("npx")
        if not node:
            print("[render] npx not found; skipping render (scripts + scene.json written).")
            return None

        out_path.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            "npx",
            "--yes",
            "remotion",
            "render",
            "src/index.ts",
            "Explainer",
            str(out_path.resolve()),
        ]
        if self.concurrency:
            cmd.extend(["--concurrency", str(self.concurrency)])

        try:
            subprocess.run(cmd, cwd=project_dir, check=True)
        except subprocess.CalledProcessError as exc:
            print(f"[render] remotion render failed: {exc}")
            return None
        except FileNotFoundError:
            print("[render] Remotion not installed. Run `npm install` in the project dir first.")
            return None
        return out_path
