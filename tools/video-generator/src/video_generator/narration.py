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
        pretty = _humanize_name(c.name)
        if purpose:
            sentence = _first_sentence(purpose).rstrip(".")
            rephrased = _to_third_person(sentence)
            return f"The {pretty} function {rephrased}."
        return (
            f"{pretty.capitalize()} is the heart of {repo.name}: "
            "one entry point, no orchestration boilerplate."
        )

    def _walkthrough(self, c: FunctionCandidate) -> str:
        lines = [
            ln for ln in c.source.splitlines()
            if ln.strip() and not ln.strip().startswith(("#", "//", '"""', "'''"))
        ]
        # Skip the def/function line itself so we narrate the body, not the signature.
        body = lines[1:] if lines and re.match(r"^\s*(def\s|async\s+def|function\s|export\s|const\s|let\s)", lines[0]) else lines
        positions = ("first", "second", "third")
        parts = []
        for i, pos in enumerate(positions):
            if i < len(body):
                parts.append(_describe_line(body[i], pos))
            else:
                parts.append({"first": "takes your input", "second": "runs the core transform", "third": "hands back a clean result"}[pos])
        prefix = "Under the hood, it" if not c.is_async else "Under the hood, because it's async, it"
        return f"{prefix} {parts[0]}, then {parts[1]}, and finally {parts[2]}."

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


def _describe_line(line: str, position: str = "middle") -> str:
    """Plain-English description of a single code line.

    `position` is one of "first" | "second" | "third" | "middle" and only
    affects the generic fallback so three adjacent lines don't all say
    "runs the core step."
    """
    stripped = line.strip()
    if stripped.startswith(("return ", "return(")) or stripped == "return":
        return "hands back the final value"
    if stripped.startswith("await "):
        return "awaits an async call"
    if stripped.startswith("yield "):
        return "yields the next chunk"
    if stripped.startswith(("raise ", "throw ")):
        return "surfaces a clean error"
    assign_match = re.match(r"^(?:const|let|var)?\s*([A-Za-z_$][\w$]*)\s*(?::[^=]+)?\s*=(?!=)", stripped)
    if assign_match:
        return f"builds {assign_match.group(1)}"
    if stripped.startswith(("for ", "while ")):
        return "loops over the input"
    if stripped.startswith("if "):
        return "branches on the input"
    fallbacks = {
        "first": "sets up the inputs",
        "second": "runs the core transform",
        "third": "polishes the output",
        "middle": "runs the core step",
    }
    return fallbacks.get(position, "runs the core step")


_IRREGULAR_VERBS = {
    "stream": "streams", "run": "runs", "fly": "flies", "try": "tries",
    "build": "builds", "ship": "ships", "return": "returns", "parse": "parses",
    "render": "renders", "generate": "generates", "fetch": "fetches",
    "match": "matches", "push": "pushes", "watch": "watches", "do": "does",
    "go": "goes", "have": "has", "be": "is",
}


def _to_third_person(sentence: str) -> str:
    """Best-effort imperative -> third-person singular.

    "Stream a Grok reply" -> "streams a Grok reply".
    If the first word already looks third-person (ends in 's' or is a common
    irregular that already has an 's' form), we leave it alone.
    """
    words = sentence.strip().split()
    if not words:
        return sentence
    first = words[0]
    lower = first.lower()

    # Already third-person or a non-verb (article, preposition) -> don't touch.
    non_verb_leads = {"a", "an", "the", "this", "that", "these", "those", "it"}
    if lower in non_verb_leads:
        return sentence[0].lower() + sentence[1:]
    # "runs"/"flies"/"parses" are already third-person - leave untouched.
    if lower.endswith("s") and not lower.endswith("ss"):
        third = lower
    elif lower in _IRREGULAR_VERBS:
        third = _IRREGULAR_VERBS[lower]
    elif re.match(r"^[a-z]+y$", lower) and lower[-2] not in "aeiou":
        third = lower[:-1] + "ies"
    elif lower.endswith(("x", "z", "o")) or lower.endswith(("ch", "sh", "ss")):
        third = lower + "es"
    else:
        third = lower + "s"
    return " ".join([third] + words[1:])


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
