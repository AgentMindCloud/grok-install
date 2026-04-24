"""End-to-end smoke test for the analyzer -> narration -> scene.json pipeline.

Uses a tiny synthetic repo under `tmp_path` so the test has no network
dependency. Verifies that:

* the analyzer finds and ranks candidate functions
* narration fits the 60s word budget
* the Remotion project writer emits a valid `scene.json`
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from video_generator.analyzer import RepoAnalyzer
from video_generator.brand import BrandPalette, FPS, TOTAL_SECONDS
from video_generator.metadata import MetadataBuilder
from video_generator.narration import NarrationBuilder
from video_generator.remotion import RemotionProjectWriter


SAMPLE_PY = '''\
"""A tiny agent helper."""

def stream_reply(prompt: str) -> str:
    """Stream a Grok reply back to the caller."""
    chunks = []
    for tok in prompt.split():
        chunks.append(tok.upper())
    return " ".join(chunks)


def _private_util(x):
    return x
'''

SAMPLE_TS = '''\
export const renderCard = async (input: string): Promise<string> => {
  const header = `card:${input}`;
  return header;
};

function unusedHelper() { return 1; }
'''


@pytest.fixture
def sample_repo(tmp_path: Path) -> Path:
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "agent.py").write_text(SAMPLE_PY)
    (tmp_path / "src" / "card.ts").write_text(SAMPLE_TS)
    (tmp_path / "README.md").write_text(
        "# sample\n\nA tiny repo that streams Grok replies and renders cards.\n"
    )
    (tmp_path / "package.json").write_text(json.dumps({
        "name": "sample",
        "description": "streams grok replies",
        "keywords": ["agent", "grok"],
    }))
    return tmp_path


def test_analyzer_picks_wow_functions(sample_repo: Path) -> None:
    analyzer = RepoAnalyzer(sample_repo, top_n=5)
    summary = analyzer.summarize()
    candidates = analyzer.pick_functions()

    assert summary.name == "sample"
    assert "streams grok replies" in summary.description.lower()
    names = [c.name for c in candidates]
    assert "stream_reply" in names
    assert "renderCard" in names
    assert "_private_util" not in names
    # Wow verbs ('stream', 'render') should rank above the plain helper.
    for c in candidates[:2]:
        assert any(s.startswith("verb:") for s in c.signals)


def test_narration_fits_budget(sample_repo: Path) -> None:
    analyzer = RepoAnalyzer(sample_repo, top_n=5)
    summary = analyzer.summarize()
    candidate = next(c for c in analyzer.pick_functions() if c.name == "stream_reply")

    narration = NarrationBuilder(audience="developers").build(candidate, summary)
    words = narration.word_count()
    assert 80 <= words <= 220, f"narration out of 60s budget: {words} words"
    assert len(narration.segments) == 5
    assert abs(sum(s.duration for s in narration.segments) - TOTAL_SECONDS) < 0.01
    assert all(s.captions for s in narration.segments)


def test_writes_scene_json(sample_repo: Path, tmp_path: Path) -> None:
    analyzer = RepoAnalyzer(sample_repo, top_n=5)
    summary = analyzer.summarize()
    candidate = next(c for c in analyzer.pick_functions() if c.name == "stream_reply")
    narration = NarrationBuilder().build(candidate, summary)

    writer = RemotionProjectWriter(palette=BrandPalette())
    project_dir = tmp_path / "project"
    writer.write(project_dir, summary, candidate, narration, repo_url="https://github.com/x/sample")

    scene = json.loads((project_dir / "scene.json").read_text())
    assert scene["fps"] == FPS
    assert scene["candidate"]["name"] == "stream_reply"
    assert len(scene["segments"]) == 5
    # source honors the MAX_VISIBLE_LINES constraint.
    assert scene["candidate"]["source"].count("\n") < 15


def test_metadata_post_fits_x(sample_repo: Path, tmp_path: Path) -> None:
    analyzer = RepoAnalyzer(sample_repo, top_n=5)
    summary = analyzer.summarize()
    candidate = next(c for c in analyzer.pick_functions() if c.name == "stream_reply")
    narration = NarrationBuilder().build(candidate, summary)

    builder = MetadataBuilder(repo_url="https://github.com/agentmindcloud/sample", audience="developers")
    meta = builder.build(
        summary, candidate, narration,
        video_path=tmp_path / "sample.mp4",
        metadata_path=tmp_path / "sample.json",
    )
    assert len(meta.x_post) <= 280
    assert meta.hashtags
    assert any(tag.lower().startswith("#grok") for tag in meta.hashtags)
