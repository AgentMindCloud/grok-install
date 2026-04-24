"""Brand palette + timing constants shared between Python and Remotion."""

from __future__ import annotations

from dataclasses import dataclass, asdict


DEFAULT_PALETTE = {
    "cyan": "#00f0ff",
    "violet": "#8b5cf6",
    "amber": "#f5a524",
    "bg": "#05070f",
    "fg": "#e8f1ff",
    "muted": "#6b7a93",
}


@dataclass
class BrandPalette:
    cyan: str = DEFAULT_PALETTE["cyan"]
    violet: str = DEFAULT_PALETTE["violet"]
    amber: str = DEFAULT_PALETTE["amber"]
    bg: str = DEFAULT_PALETTE["bg"]
    fg: str = DEFAULT_PALETTE["fg"]
    muted: str = DEFAULT_PALETTE["muted"]

    def to_dict(self) -> dict[str, str]:
        return asdict(self)


# 60-second video broken into segments (seconds).
SEGMENT_DURATIONS = {
    "hook": 3.0,
    "concept": 10.0,
    "walkthrough": 20.0,
    "result": 15.0,
    "cta": 12.0,
}

TOTAL_SECONDS = sum(SEGMENT_DURATIONS.values())
FPS = 30
WIDTH = 1080
HEIGHT = 1920
