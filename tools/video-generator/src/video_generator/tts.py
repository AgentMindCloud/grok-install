"""Text-to-speech adapter.

Supports two backends:

* ``elevenlabs`` - uses the official SDK if ``ELEVENLABS_API_KEY`` is set.
* ``stub`` - writes a 60s silent WAV so the render pipeline stays end-to-end
  testable without network access.

A missing ElevenLabs key falls back to the stub with a clear warning rather
than crashing the run.
"""

from __future__ import annotations

import os
import struct
import wave
from dataclasses import dataclass
from pathlib import Path


@dataclass
class TTSResult:
    audio_path: Path
    backend: str


class TTSClient:
    def __init__(self, backend: str = "auto", voice: str = "warm-energetic"):
        self.backend = backend
        self.voice = voice

    def synthesize(self, text: str, out_path: Path, duration_seconds: float = 60.0) -> TTSResult:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        backend = self._resolve_backend()
        if backend == "elevenlabs":
            try:
                return self._elevenlabs(text, out_path)
            except Exception as exc:  # noqa: BLE001
                print(f"[tts] ElevenLabs failed ({exc}); falling back to silent stub")
                backend = "stub"
        return self._stub(out_path, duration_seconds)

    # --- backends -----------------------------------------------------------

    def _resolve_backend(self) -> str:
        if self.backend == "stub":
            return "stub"
        if self.backend == "elevenlabs":
            return "elevenlabs"
        # auto: pick elevenlabs iff the SDK + key are available.
        if os.environ.get("ELEVENLABS_API_KEY"):
            try:
                import elevenlabs  # noqa: F401
                return "elevenlabs"
            except ImportError:
                return "stub"
        return "stub"

    def _elevenlabs(self, text: str, out_path: Path) -> TTSResult:
        from elevenlabs.client import ElevenLabs

        client = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
        voice_id = os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
        model_id = os.environ.get("ELEVENLABS_MODEL", "eleven_turbo_v2_5")

        stream = client.text_to_speech.convert(
            voice_id=voice_id,
            model_id=model_id,
            text=text,
            output_format="mp3_44100_128",
        )
        # The SDK returns an iterator of bytes chunks.
        mp3_path = out_path.with_suffix(".mp3")
        with mp3_path.open("wb") as f:
            for chunk in stream:
                if chunk:
                    f.write(chunk)
        return TTSResult(audio_path=mp3_path, backend="elevenlabs")

    @staticmethod
    def _stub(out_path: Path, duration_seconds: float) -> TTSResult:
        """Write a silent WAV at 44.1kHz mono so Remotion has something to play."""
        wav_path = out_path.with_suffix(".wav")
        framerate = 44100
        total_frames = int(framerate * duration_seconds)
        with wave.open(str(wav_path), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(framerate)
            w.writeframes(struct.pack("<" + "h" * total_frames, *([0] * total_frames)))
        return TTSResult(audio_path=wav_path, backend="stub")
