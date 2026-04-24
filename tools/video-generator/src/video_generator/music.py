"""Procedural background music.

When no real music asset is provided, we synthesize a gentle, looping
four-chord pad at ~-20 dBFS (≈ 60-70 dB speech-relative) so the rendered
video isn't dead-silent. Pure Python + wave - no external deps.

Output is a 60-second mono 44.1 kHz WAV.
"""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path


SAMPLE_RATE = 44_100
# Emin9 / Amaj9 / Cmaj9 / Gmaj9 (simplified) - fits the brand: moody + hopeful.
CHORDS_HZ = [
    (82.41, 123.47, 164.81, 246.94),   # E2 B2 E3 B3
    (110.00, 164.81, 220.00, 329.63),  # A2 E3 A3 E4
    (130.81, 196.00, 261.63, 392.00),  # C3 G3 C4 G4
    (98.00, 146.83, 196.00, 293.66),   # G2 D3 G3 D4
]


def generate_music(
    out_path: Path,
    duration_seconds: float = 60.0,
    peak: float = 0.10,  # ~-20 dBFS
    chord_seconds: float = 4.0,
) -> Path:
    """Write a procedural ambient pad to `out_path` as mono 16-bit WAV."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    total_frames = int(duration_seconds * SAMPLE_RATE)
    chord_frames = int(chord_seconds * SAMPLE_RATE)
    samples: list[int] = []

    for n in range(total_frames):
        t = n / SAMPLE_RATE
        chord_idx = int(t / chord_seconds) % len(CHORDS_HZ)
        next_idx = (chord_idx + 1) % len(CHORDS_HZ)
        crossfade = (n % chord_frames) / chord_frames  # 0..1 within the chord

        value = 0.0
        for freq in CHORDS_HZ[chord_idx]:
            value += math.sin(2 * math.pi * freq * t) * (1 - crossfade)
        for freq in CHORDS_HZ[next_idx]:
            value += math.sin(2 * math.pi * freq * t) * crossfade
        # Soft saturator + gentle LFO for movement.
        lfo = 0.85 + 0.15 * math.sin(2 * math.pi * 0.15 * t)
        shaped = math.tanh(value * 0.18) * peak * lfo
        # Fade the first/last second so loops don't click.
        if t < 1.0:
            shaped *= t
        if duration_seconds - t < 1.0:
            shaped *= max(0.0, duration_seconds - t)
        samples.append(int(max(-1.0, min(1.0, shaped)) * 32767))

    with wave.open(str(out_path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(struct.pack(f"<{len(samples)}h", *samples))
    return out_path
