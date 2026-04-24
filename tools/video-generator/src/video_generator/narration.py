"""Narration script generation for a 60s explainer.

Produces a per-segment script with target word counts so the voiceover clocks
in at ~150-200 words total. Each segment carries captions with start/end
timestamps that the Remotion template consumes verbatim.
"""

from __future__ import annotations

import re
import textwrap
from dataclasses import dataclass, field, asdict
from typing import Literal

from .analyzer import FunctionCandidate, RepoSummary
from .brand import SEGMENT_DURATIONS, TOTAL_SECONDS


SegmentKey = Literal["hook", "concept", "walkthrough", "result", "cta"]

# Roughly 2.6 words per second is a natural, energetic read.
WORDS_PER_SECOND = 2.6


@dataclass
class Caption:
    start: float
    end: float
    text: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Segment:
    key: SegmentKey
    duration: float
    narration: str
    captions: list[Caption] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "key": self.key,
            "duration": self.duration,
            "narration": self.narration,
            "captions": [c.to_dict() for c in self.captions],
        }


@dataclass
class NarrationScript:
    function_name: str
    audience: str
    total_seconds: float
    segments: list[Segment]

    def full_text(self) -> str:
        return " ".join(s.narration for s in self.segments).strip()

    def word_count(self) -> int:
        return len(self.full_text().split())

    def to_dict(self) -> dict:
        return {
            "function_name": self.function_name,
            "audience": self.audience,
            "total_seconds": self.total_seconds,
            "word_count": self.word_count(),
            "segments": [s.to_dict() for s in self.segments],
        }


class NarrationBuilder:
    """Assemble per-segment narration lines from a function + repo summary."""

    def __init__(self, audience: str = "developers"):
        self.audience = audience

    def build(self, candidate: FunctionCandidate, repo: RepoSummary) -> NarrationScript:
        hook = self._hook(candidate, repo)
        concept = self._concept(candidate, repo)
        walkthrough = self._walkthrough(candidate)
        result = self._result(candidate, repo)
        cta = self._cta(repo)

        segments = [
            self._segment("hook", hook),
            self._segment("concept", concept),
            self._segment("walkthrough", walkthrough),
            self._segment("result", result),
            self._segment("cta", cta),
        ]
        return NarrationScript(
            function_name=candidate.name,
            audience=self.audience,
            total_seconds=TOTAL_SECONDS,
            segments=segments,
        )

    # --- segment writers ----------------------------------------------------

    def _hook(self, c: FunctionCandidate, repo: RepoSummary) -> str:
        verb = _humanize_name(c.name).lower()
        if "agent" in repo.keywords or "agent" in (repo.description or "").lower():
            return f"Want to {verb} with one function? {repo.name} does it in {self._line_count(c)} lines."
        return f"Here is how {repo.name} lets you {verb} without the boilerplate."

    def _concept(self, c: FunctionCandidate, repo: RepoSummary) -> str:
        purpose = _clean_docstring(c.docstring) or repo.readme_first_paragraph
        lede = f"The {_humanize_name(c.name)} function"
        if purpose:
            summary = _first_sentence(purpose)
            return f"{lede} {summary.lower() if summary[:1].isupper() else summary}"
        return f"{lede} is the core of {repo.name}: a single entry point you can call from your app."

    def _walkthrough(self, c: FunctionCandidate) -> str:
        lines = [ln for ln in c.source.splitlines() if ln.strip() and not ln.strip().startswith(("#", "//"))]
        highlights = lines[:3]
        first = _describe_line(highlights[0]) if highlights else "It takes your input"
        second = _describe_line(highlights[1]) if len(highlights) > 1 else "runs the core logic"
        third = _describe_line(highlights[2]) if len(highlights) > 2 else "and hands back a clean result"
        prefix = "Under the hood,"
        if c.is_async:
            prefix = "Under the hood, because it is async,"
        return f"{prefix} {first}, then {second}, and finally {third}."

    def _result(self, c: FunctionCandidate, repo: RepoSummary) -> str:
        artifact = _infer_artifact(c, repo)
        return (
            f"Call it once and you get {artifact}. "
            f"No extra plumbing, no glue code, no surprises for the {self.audience.split()[0]} using it."
        )

    def _cta(self, repo: RepoSummary) -> str:
        return (
            f"If this is the kind of tool you wish existed, star {repo.name} on GitHub, "
            "share the video, and tell the team what you would build on top of it."
        )

    # --- helpers ------------------------------------------------------------

    def _segment(self, key: SegmentKey, text: str) -> Segment:
        duration = SEGMENT_DURATIONS[key]
        narration = _fit_to_duration(text, duration)
        captions = _chunk_into_captions(narration, duration, offset=self._offset_for(key))
        return Segment(key=key, duration=duration, narration=narration, captions=captions)

    @staticmethod
    def _offset_for(key: SegmentKey) -> float:
        running = 0.0
        for k, d in SEGMENT_DURATIONS.items():
            if k == key:
                return running
            running += d
        return 0.0

    @staticmethod
    def _line_count(c: FunctionCandidate) -> int:
        return max(1, c.end_line - c.start_line + 1)


# --- text utilities ---------------------------------------------------------

def _humanize_name(name: str) -> str:
    # snake_case or camelCase -> "snake case" / "camel case"
    with_spaces = re.sub(r"(?<!^)(?=[A-Z])", " ", name).replace("_", " ")
    return with_spaces.strip().lower()


def _clean_docstring(doc: str) -> str:
    if not doc:
        return ""
    text = textwrap.dedent(doc).strip()
    # Drop reST/Google param blocks and the like.
    text = re.split(r"\n\s*(Args|Returns|Raises|Parameters|Example)s?:", text)[0]
    return " ".join(text.split())


def _first_sentence(text: str) -> str:
    match = re.split(r"(?<=[.!?])\s", text.strip(), maxsplit=1)
    sentence = match[0].strip() if match else text.strip()
    if not sentence.endswith((".", "!", "?")):
        sentence += "."
    return sentence


def _describe_line(line: str) -> str:
    """Best-effort plain-English description of a single code line."""
    stripped = line.strip()
    if stripped.startswith(("return ", "return(")):
        return "returns the result"
    if stripped.startswith(("await ", "yield ")):
        return "waits on an async call"
    if "=" in stripped and "==" not in stripped.split("=")[0]:
        target = stripped.split("=")[0].strip().split()[-1]
        return f"builds `{target}`"
    if stripped.startswith(("if ", "for ", "while ", "switch", "match ")):
        return "branches on the input"
    return "runs the core step"


def _infer_artifact(c: FunctionCandidate, repo: RepoSummary) -> str:
    name = c.name.lower()
    if "reply" in name or "post" in name:
        return "a posted reply, logged and rate-limited"
    if "render" in name or "generate" in name:
        return "a ready-to-ship artifact"
    if "parse" in name or "validate" in name:
        return "a typed, validated object"
    if "install" in name or "deploy" in name:
        return "a live deployment URL"
    if repo.description:
        return f"exactly what {repo.name} promises: {_first_sentence(repo.description).rstrip('.').lower()}"
    return "a clean, typed return value you can drop straight into your app"


def _fit_to_duration(text: str, duration: float) -> str:
    """Trim or pad narration so it comfortably fits `duration` seconds."""
    budget = int(duration * WORDS_PER_SECOND)
    words = text.split()
    if len(words) <= budget:
        return " ".join(words)
    trimmed = words[:budget]
    # Snap to the last sentence boundary inside the budget.
    joined = " ".join(trimmed)
    match = re.search(r"^(.*[.!?])\s", joined + " ")
    if match:
        return match.group(1).strip()
    return joined.rstrip(",;:") + "."


def _chunk_into_captions(text: str, duration: float, offset: float) -> list[Caption]:
    """Break narration into ~5-word caption chunks linearly distributed in time."""
    words = text.split()
    if not words:
        return []
    chunk_size = 5
    chunks = [" ".join(words[i: i + chunk_size]) for i in range(0, len(words), chunk_size)]
    per = duration / len(chunks)
    return [
        Caption(start=round(offset + i * per, 3), end=round(offset + (i + 1) * per, 3), text=chunk)
        for i, chunk in enumerate(chunks)
    ]
