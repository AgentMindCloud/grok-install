"""grok-vidgen: autonomous 60s explainer-video generator for GitHub repos."""

__version__ = "0.1.0"

from .analyzer import FunctionCandidate, RepoAnalyzer
from .narration import NarrationScript, NarrationBuilder
from .metadata import MetadataBuilder
from .remotion import RemotionProjectWriter
from .renderer import Renderer

__all__ = [
    "FunctionCandidate",
    "RepoAnalyzer",
    "NarrationScript",
    "NarrationBuilder",
    "MetadataBuilder",
    "RemotionProjectWriter",
    "Renderer",
]
