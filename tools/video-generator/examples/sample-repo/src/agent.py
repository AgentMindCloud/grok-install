"""Tiny demo agent - the fixture that vidgen CI renders against."""

from typing import Iterable


def stream_reply(prompt: str) -> str:
    """Stream a Grok reply back to the caller."""
    tokens = prompt.split()
    chunks = [t.upper() for t in tokens]
    return " ".join(chunks)


def generate_thread(topic: str, length: int = 5) -> list[str]:
    """Generate an X thread of `length` posts on `topic`."""
    return [f"{i + 1}/{length}: {topic}" for i in range(length)]


def parse_mentions(events: Iterable[dict]) -> list[dict]:
    """Parse a stream of X webhook events into normalized mentions."""
    return [
        {"id": e["id"], "text": e["text"], "author": e.get("author", "unknown")}
        for e in events
        if e.get("type") == "mention"
    ]
