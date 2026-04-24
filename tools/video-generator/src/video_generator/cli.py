"""grok-vidgen CLI.

Commands:

    grok-vidgen plan   <repo>           # analyze + print top-N candidates
    grok-vidgen build  <repo>           # plan + render everything to ./out/
    grok-vidgen batch  <repos.txt>      # run `build` for each repo, write CSV
"""

from __future__ import annotations

import json
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Optional, Sequence

import click

from .analyzer import FunctionCandidate, RepoAnalyzer, RepoSummary
from .brand import BrandPalette
from .metadata import BatchRow, MetadataBuilder, write_batch_csv
from .narration import NarrationBuilder
from .remotion import RemotionProjectWriter
from .renderer import Renderer
from .repo_fetcher import fetch, parse_github_url
from .tts import TTSClient


def _palette(cyan: str, violet: str, amber: str) -> BrandPalette:
    return BrandPalette(cyan=cyan, violet=violet, amber=amber)


def _analyze(repo_path: Path, top_n: int, functions: Optional[Sequence[str]]) -> tuple[RepoSummary, list[FunctionCandidate]]:
    analyzer = RepoAnalyzer(repo_path, top_n=top_n)
    summary = analyzer.summarize()
    candidates = analyzer.pick_functions(functions)
    return summary, candidates


@click.group()
@click.version_option(prog_name="grok-vidgen")
def main() -> None:
    """Autonomous 60s explainer-video generator for GitHub repos."""


@main.command()
@click.argument("repo", type=str)
@click.option("--work-dir", type=click.Path(path_type=Path), default=Path(".vidgen-cache"))
@click.option("--top", "top_n", type=int, default=5)
@click.option("--functions", "-f", multiple=True, help="Pin specific function names instead of auto-detect.")
def plan(repo: str, work_dir: Path, top_n: int, functions: tuple[str, ...]) -> None:
    """Clone a repo and list the functions grok-vidgen would pick."""
    ref = parse_github_url(repo)
    repo_path = fetch(ref, work_dir)
    summary, candidates = _analyze(repo_path, top_n, functions or None)

    click.echo(f"\n{summary.name}: {summary.description or '(no description)'}\n")
    if summary.readme_first_paragraph:
        click.echo(f"  {summary.readme_first_paragraph[:220]}...\n")
    for i, c in enumerate(candidates, start=1):
        click.echo(f"  {i}. {c.name}() in {c.file}:{c.start_line}  score={c.score}  [{', '.join(c.signals)}]")
    if not candidates:
        click.echo("  (no candidates found - try --top 10 or a different repo)")


@main.command()
@click.argument("repo", type=str)
@click.option("--work-dir", type=click.Path(path_type=Path), default=Path(".vidgen-cache"))
@click.option("--out", "out_dir", type=click.Path(path_type=Path), default=Path("out"))
@click.option("--top", "top_n", type=int, default=5)
@click.option("--functions", "-f", multiple=True, help="Pin specific function names.")
@click.option("--audience", default="developers", help="Who is this for?")
@click.option("--cyan", default="#00f0ff")
@click.option("--violet", default="#8b5cf6")
@click.option("--amber", default="#f5a524")
@click.option("--tts-backend", default="auto", type=click.Choice(["auto", "elevenlabs", "stub"]))
@click.option("--render/--no-render", default=True, help="Invoke remotion render at the end.")
def build(
    repo: str,
    work_dir: Path,
    out_dir: Path,
    top_n: int,
    functions: tuple[str, ...],
    audience: str,
    cyan: str,
    violet: str,
    amber: str,
    tts_backend: str,
    render: bool,
) -> None:
    """Analyze, script, render, and package a video per candidate function."""
    ref = parse_github_url(repo)
    click.echo(f"[1/5] Fetching {ref.url}...")
    repo_path = fetch(ref, work_dir)

    click.echo(f"[2/5] Analyzing {repo_path}...")
    summary, candidates = _analyze(repo_path, top_n, functions or None)
    if not candidates:
        click.echo("  No wow-factor functions found. Exiting.")
        sys.exit(1)

    palette = _palette(cyan, violet, amber)
    narration_builder = NarrationBuilder(audience=audience)
    metadata_builder = MetadataBuilder(repo_url=ref.url, audience=audience)
    project_writer = RemotionProjectWriter(palette=palette)
    renderer = Renderer() if render else None
    tts = TTSClient(backend=tts_backend)

    videos_root = out_dir / "videos" / summary.name
    metadata_root = out_dir / "metadata" / summary.name
    videos_root.mkdir(parents=True, exist_ok=True)
    metadata_root.mkdir(parents=True, exist_ok=True)

    batch_rows: list[BatchRow] = []

    for i, candidate in enumerate(candidates, start=1):
        click.echo(f"[3/5] ({i}/{len(candidates)}) {candidate.name}()")
        narration = narration_builder.build(candidate, summary)
        click.echo(f"      narration: {narration.word_count()} words")

        project_dir = out_dir / "projects" / summary.name / candidate.name
        audio_path = project_dir / "public" / "narration"
        audio_path.parent.mkdir(parents=True, exist_ok=True)
        tts_result = tts.synthesize(narration.full_text(), audio_path, duration_seconds=narration.total_seconds)
        click.echo(f"      tts: {tts_result.backend} -> {tts_result.audio_path.name}")
        audio_rel = f"narration/{tts_result.audio_path.name}"

        project_writer.write(
            project_dir, summary, candidate, narration, ref.url,
            audio_rel=audio_rel,
        )

        video_path = videos_root / f"{candidate.name}.mp4"
        metadata_path = metadata_root / f"{candidate.name}.json"

        metadata = metadata_builder.build(summary, candidate, narration, video_path, metadata_path)
        metadata_builder.write(metadata)

        rendered: Optional[Path] = None
        if renderer:
            click.echo("[4/5]       rendering with Remotion...")
            rendered = renderer.render(project_dir, video_path)

        batch_rows.append(BatchRow(
            repo_name=summary.name,
            function=candidate.name,
            video_url=str(video_path if rendered else project_dir / "scene.json"),
            x_post=metadata.x_post,
            status="rendered" if rendered else "scripted",
        ))

    click.echo("[5/5] Writing batch summary...")
    csv_path = out_dir / f"{summary.name}-batch.csv"
    write_batch_csv(batch_rows, csv_path)
    click.echo(f"\nDone. Videos: {videos_root} | Metadata: {metadata_root} | Batch CSV: {csv_path}")


@main.command()
@click.argument("repos_file", type=click.Path(exists=True, path_type=Path))
@click.option("--out", "out_dir", type=click.Path(path_type=Path), default=Path("out"))
@click.option("--work-dir", type=click.Path(path_type=Path), default=Path(".vidgen-cache"))
@click.option("--top", "top_n", type=int, default=3)
@click.option("--audience", default="developers")
@click.option("--render/--no-render", default=False)
@click.pass_context
def batch(
    ctx: click.Context,
    repos_file: Path,
    out_dir: Path,
    work_dir: Path,
    top_n: int,
    audience: str,
    render: bool,
) -> None:
    """Run `build` for each repo listed (one URL per line) and aggregate the CSV."""
    urls = [ln.strip() for ln in repos_file.read_text().splitlines() if ln.strip() and not ln.startswith("#")]
    click.echo(f"Batch mode: {len(urls)} repos")
    for url in urls:
        click.echo(f"\n=== {url} ===")
        try:
            ctx.invoke(
                build,
                repo=url,
                work_dir=work_dir,
                out_dir=out_dir,
                top_n=top_n,
                functions=(),
                audience=audience,
                cyan="#00f0ff", violet="#8b5cf6", amber="#f5a524",
                tts_backend="auto", render=render,
            )
        except Exception as exc:  # noqa: BLE001
            click.echo(f"  FAILED: {exc}")


if __name__ == "__main__":
    main()
