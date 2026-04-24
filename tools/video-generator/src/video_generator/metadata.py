"""Metadata + social copy generator.

For each rendered video we emit:

* `metadata/{repo}/{fn}.json` - narration, captions, hashtags, post copy
* `metadata/{repo}/batch.csv` - spreadsheet row for batch mode

The X post copy follows the format: hook line, empty line, one-sentence pitch,
empty line, repo link + hashtags. That shape fits the 280-char cap after the
function name is interpolated, even for long repo slugs.
"""

from __future__ import annotations

import csv
import io
import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path

from .analyzer import FunctionCandidate, RepoSummary
from .narration import NarrationScript


DOMAIN_HASHTAGS = {
    "agent": ["#AIAgents", "#BuildInPublic"],
    "llm": ["#LLM", "#AI"],
    "grok": ["#GrokAgents", "#xAI"],
    "tts": ["#VoiceAI"],
    "vision": ["#ComputerVision"],
    "rag": ["#RAG", "#AI"],
    "deploy": ["#DevOps"],
    "install": ["#OpenSource"],
    "reply": ["#Automation"],
    "parse": ["#DeveloperTools"],
    "render": ["#WebDev"],
    "react": ["#React"],
    "python": ["#Python"],
    "typescript": ["#TypeScript"],
}

BASE_HASHTAGS = ["#OpenSource", "#GitHub"]
MAX_HASHTAGS = 5
X_CHAR_LIMIT = 280


@dataclass
class VideoMetadata:
    repo_name: str
    repo_url: str
    function_name: str
    function_file: str
    language: str
    audience: str
    narration: dict
    hashtags: list[str]
    x_post: str
    video_path: str
    metadata_path: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class BatchRow:
    repo_name: str
    function: str
    video_url: str
    x_post: str
    status: str = "pending"


class MetadataBuilder:
    """Build social copy + metadata JSON for one (repo, function) pair."""

    def __init__(self, repo_url: str, audience: str):
        self.repo_url = repo_url.rstrip("/")
        self.audience = audience

    def build(
        self,
        repo: RepoSummary,
        candidate: FunctionCandidate,
        narration: NarrationScript,
        video_path: Path,
        metadata_path: Path,
    ) -> VideoMetadata:
        hashtags = self._hashtags(repo, candidate)
        hook_line = narration.segments[0].narration if narration.segments else repo.description
        x_post = self._x_post(hook_line, candidate, hashtags)
        return VideoMetadata(
            repo_name=repo.name,
            repo_url=self.repo_url,
            function_name=candidate.name,
            function_file=candidate.file,
            language=candidate.language,
            audience=self.audience,
            narration=narration.to_dict(),
            hashtags=hashtags,
            x_post=x_post,
            video_path=str(video_path),
            metadata_path=str(metadata_path),
        )

    def write(self, metadata: VideoMetadata) -> Path:
        path = Path(metadata.metadata_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(metadata.to_dict(), indent=2), encoding="utf-8")
        return path

    # --- internals ----------------------------------------------------------

    def _hashtags(self, repo: RepoSummary, candidate: FunctionCandidate) -> list[str]:
        haystack = " ".join([
            repo.name, repo.description or "", candidate.name,
            " ".join(repo.keywords), candidate.language,
        ]).lower()
        picked: list[str] = []
        for keyword, tags in DOMAIN_HASHTAGS.items():
            if keyword in haystack:
                for tag in tags:
                    if tag not in picked:
                        picked.append(tag)
            if len(picked) >= MAX_HASHTAGS - len(BASE_HASHTAGS):
                break
        for tag in BASE_HASHTAGS:
            if tag not in picked:
                picked.append(tag)
        return picked[:MAX_HASHTAGS]

    def _x_post(self, hook_line: str, candidate: FunctionCandidate, hashtags: list[str]) -> str:
        hook = _single_sentence(hook_line).rstrip(".")
        body = f"{candidate.name}() in {candidate.language} - starred devs loved this one."
        tags = " ".join(hashtags)
        post = f"{hook}.\n\n{body}\n\n{self.repo_url}\n{tags}"
        if len(post) <= X_CHAR_LIMIT:
            return post
        # Compress: drop the body line first, then trim the hook.
        post = f"{hook}.\n\n{self.repo_url}\n{tags}"
        if len(post) <= X_CHAR_LIMIT:
            return post
        trim_budget = X_CHAR_LIMIT - len(f".\n\n{self.repo_url}\n{tags}")
        return f"{hook[:max(0, trim_budget)].rstrip()}.\n\n{self.repo_url}\n{tags}"


def write_batch_csv(rows: list[BatchRow], out_path: Path) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["repo_name", "function", "video_url", "x_post", "status"])
    for r in rows:
        writer.writerow([r.repo_name, r.function, r.video_url, r.x_post.replace("\n", " / "), r.status])
    out_path.write_text(buf.getvalue(), encoding="utf-8")
    return out_path


def _single_sentence(text: str) -> str:
    text = text.strip()
    match = re.split(r"(?<=[.!?])\s", text, maxsplit=1)
    return (match[0] if match else text).strip()
