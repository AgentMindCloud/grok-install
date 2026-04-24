"""Repo analysis: scans src/, lib/, components/ and picks wow-factor functions.

Strategy:
* Walk repo, collect source files by language.
* Parse Python with ``ast``; for JS/TS use a deliberately-small regex that
  extracts top-level ``function`` / ``const foo = (...) =>`` / ``export``
  declarations. (A full JS parser is out of scope for a single-binary tool.)
* Score each function on "wow in 10 seconds" signals: short body, docstring,
  an expressive verb in the name, async/await, returns something non-trivial.
* Return the top-N candidates with the source snippet already trimmed to
  <= 15 visible lines (matches the Remotion code-block constraint).
"""

from __future__ import annotations

import ast
import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Iterable


LANG_BY_EXT = {
    ".py": "python",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".mjs": "javascript",
}

PREFERRED_DIRS = ("src", "lib", "components", "app", "packages")
IGNORE_DIRS = {
    ".git", "node_modules", "dist", "build", "__pycache__", ".next",
    ".venv", "venv", "coverage", "out", "target", ".turbo",
}
MAX_FILE_BYTES = 250_000
MAX_VISIBLE_LINES = 15

WOW_VERBS = {
    "stream", "generate", "parse", "render", "transform", "compose",
    "encrypt", "decrypt", "sign", "verify", "auth", "route", "match",
    "search", "index", "embed", "classify", "predict", "train",
    "reply", "post", "install", "deploy", "scan", "validate", "chat",
    "ask", "plan", "act", "observe", "tool", "agent",
}


@dataclass
class FunctionCandidate:
    """A function pulled from the repo with enough context to render it."""

    name: str
    language: str
    file: str            # repo-relative path
    start_line: int
    end_line: int
    source: str          # already trimmed to MAX_VISIBLE_LINES
    docstring: str = ""
    is_async: bool = False
    score: float = 0.0
    signals: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class RepoSummary:
    """Lightweight summary of repo purpose, used to shape narration."""

    name: str
    description: str = ""
    primary_language: str = ""
    readme_first_paragraph: str = ""
    keywords: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


class RepoAnalyzer:
    """Walk a cloned repo and produce `FunctionCandidate` rankings."""

    def __init__(self, repo_path: str | Path, top_n: int = 5):
        self.repo_path = Path(repo_path).resolve()
        self.top_n = top_n

    # --- public API ---------------------------------------------------------

    def summarize(self) -> RepoSummary:
        name = self.repo_path.name
        description = ""
        primary_language = ""
        first_para = ""
        keywords: list[str] = []

        package_json = self.repo_path / "package.json"
        if package_json.exists():
            try:
                pkg = json.loads(package_json.read_text(encoding="utf-8"))
                description = pkg.get("description", "") or description
                name = pkg.get("name", name) or name
                keywords = list(pkg.get("keywords", []) or [])
                primary_language = "typescript" if (
                    pkg.get("types") or "typescript" in pkg.get("devDependencies", {})
                ) else "javascript"
            except json.JSONDecodeError:
                pass

        pyproject = self.repo_path / "pyproject.toml"
        if pyproject.exists() and not description:
            match = re.search(r'description\s*=\s*"([^"]+)"', pyproject.read_text(encoding="utf-8"))
            if match:
                description = match.group(1)
                primary_language = primary_language or "python"

        for readme_name in ("README.md", "readme.md", "README.rst"):
            readme = self.repo_path / readme_name
            if readme.exists():
                first_para = self._first_paragraph(readme.read_text(encoding="utf-8", errors="replace"))
                break

        return RepoSummary(
            name=name,
            description=description,
            primary_language=primary_language,
            readme_first_paragraph=first_para,
            keywords=keywords,
        )

    def pick_functions(self, names: Iterable[str] | None = None) -> list[FunctionCandidate]:
        """Return top-N candidates, or only those whose name matches `names`."""
        wanted = {n.strip() for n in names} if names else None
        candidates: list[FunctionCandidate] = []

        for path in self._iter_source_files():
            language = LANG_BY_EXT.get(path.suffix.lower())
            if not language:
                continue
            try:
                source = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            if len(source.encode("utf-8", errors="replace")) > MAX_FILE_BYTES:
                continue

            rel = path.relative_to(self.repo_path).as_posix()
            if language == "python":
                candidates.extend(self._scan_python(source, rel))
            else:
                candidates.extend(self._scan_js_like(source, rel, language))

        if wanted:
            candidates = [c for c in candidates if c.name in wanted]

        for c in candidates:
            c.score, c.signals = self._score(c)

        candidates.sort(key=lambda c: c.score, reverse=True)
        return candidates[: self.top_n]

    # --- internals ----------------------------------------------------------

    def _iter_source_files(self) -> Iterable[Path]:
        """Yield source files, preferring canonical directories."""
        preferred = [self.repo_path / d for d in PREFERRED_DIRS if (self.repo_path / d).is_dir()]
        seen: set[Path] = set()

        def walk(root: Path) -> Iterable[Path]:
            if not root.exists():
                return
            for p in root.rglob("*"):
                if any(part in IGNORE_DIRS for part in p.parts):
                    continue
                if p.is_file() and p.suffix.lower() in LANG_BY_EXT:
                    yield p

        for root in preferred:
            for p in walk(root):
                if p not in seen:
                    seen.add(p)
                    yield p

        # Fallback: whole repo, skipping what we already yielded and ignored dirs.
        for p in walk(self.repo_path):
            if p not in seen:
                seen.add(p)
                yield p

    def _scan_python(self, source: str, rel: str) -> list[FunctionCandidate]:
        try:
            tree = ast.parse(source)
        except SyntaxError:
            return []
        lines = source.splitlines()
        out: list[FunctionCandidate] = []

        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if node.name.startswith("_"):
                    continue
                start = node.lineno
                end = getattr(node, "end_lineno", start) or start
                snippet = "\n".join(lines[start - 1: min(end, start - 1 + MAX_VISIBLE_LINES)])
                doc = ast.get_docstring(node) or ""
                out.append(FunctionCandidate(
                    name=node.name,
                    language="python",
                    file=rel,
                    start_line=start,
                    end_line=end,
                    source=snippet,
                    docstring=doc,
                    is_async=isinstance(node, ast.AsyncFunctionDef),
                ))
        return out

    # Matches `export function foo(...)`, `function foo(...)`, `const foo = (...) =>`,
    # and async variants, tolerating TypeScript return-type annotations like
    # `const renderCard = async (input: string): Promise<string> => {`.
    _JS_FN = re.compile(
        r"""
        ^(?P<indent>[ \t]*)
        (?:export\s+(?:default\s+)?)?
        (?:
            (?P<async1>async\s+)?function\s*\*?\s*(?P<name1>[A-Za-z_$][\w$]*)\s*\(
          |
            (?:const|let|var)\s+(?P<name2>[A-Za-z_$][\w$]*)
            (?:\s*:\s*[^=\n]+?)?\s*=\s*
            (?P<async2>async\s+)?
            (?:\([^)]*\)(?:\s*:\s*[^=\n{]+)?|[A-Za-z_$][\w$]*)\s*=>
        )
        """,
        re.MULTILINE | re.VERBOSE,
    )

    def _scan_js_like(self, source: str, rel: str, language: str) -> list[FunctionCandidate]:
        out: list[FunctionCandidate] = []
        lines = source.splitlines()

        for match in self._JS_FN.finditer(source):
            name = match.group("name1") or match.group("name2")
            if not name or name.startswith("_"):
                continue
            is_async = bool(match.group("async1") or match.group("async2"))
            start_line = source[: match.start()].count("\n") + 1
            end_line = self._estimate_js_end(lines, start_line)
            snippet_lines = lines[start_line - 1: min(end_line, start_line - 1 + MAX_VISIBLE_LINES)]
            snippet = "\n".join(snippet_lines)
            doc = self._jsdoc_above(lines, start_line)
            out.append(FunctionCandidate(
                name=name,
                language=language,
                file=rel,
                start_line=start_line,
                end_line=end_line,
                source=snippet,
                docstring=doc,
                is_async=is_async,
            ))
        return out

    @staticmethod
    def _estimate_js_end(lines: list[str], start_line: int) -> int:
        """Walk forward tracking brace depth to find the function end."""
        depth = 0
        seen_open = False
        for i in range(start_line - 1, min(len(lines), start_line - 1 + 200)):
            line = lines[i]
            for ch in line:
                if ch == "{":
                    depth += 1
                    seen_open = True
                elif ch == "}":
                    depth -= 1
                    if seen_open and depth == 0:
                        return i + 1
            # Arrow one-liner with no braces -> end on the same line.
            if not seen_open and "=>" in line and line.rstrip().endswith((";", ")", ",")):
                return i + 1
        return min(len(lines), start_line + MAX_VISIBLE_LINES)

    @staticmethod
    def _jsdoc_above(lines: list[str], start_line: int) -> str:
        """If lines right above the function are /** ... */, return the text."""
        i = start_line - 2
        if i < 0 or "*/" not in lines[i]:
            return ""
        collected: list[str] = []
        while i >= 0:
            text = lines[i].strip()
            collected.append(text)
            if text.startswith("/**"):
                break
            i -= 1
        else:
            return ""
        collected.reverse()
        cleaned = [re.sub(r"^/\*\*|\*/$|^\*\s?", "", ln).strip() for ln in collected]
        return " ".join(ln for ln in cleaned if ln).strip()

    @staticmethod
    def _first_paragraph(text: str) -> str:
        """First non-heading paragraph of a README, truncated."""
        for chunk in text.split("\n\n"):
            chunk = chunk.strip()
            if not chunk or chunk.startswith("#") or chunk.startswith("!["):
                continue
            stripped = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", chunk)
            stripped = re.sub(r"[*_`>]+", "", stripped).strip()
            if len(stripped) > 40:
                return stripped[:400]
        return ""

    @staticmethod
    def _score(c: FunctionCandidate) -> tuple[float, list[str]]:
        signals: list[str] = []
        score = 0.0
        body_lines = c.source.count("\n") + 1

        if 3 <= body_lines <= 12:
            score += 3.0
            signals.append("concise-body")
        elif body_lines <= 15:
            score += 1.5

        if c.docstring:
            score += 2.0
            signals.append("has-docstring")

        if c.is_async:
            score += 1.0
            signals.append("async")

        lower = c.name.lower()
        for verb in WOW_VERBS:
            if verb in lower:
                score += 1.5
                signals.append(f"verb:{verb}")
                break

        if any(seg in c.file for seg in ("/src/", "/lib/", "/components/")):
            score += 0.75
            signals.append("canonical-dir")

        # Penalize things that are almost certainly uninteresting.
        if lower in {"main", "run", "init"} and not c.docstring:
            score -= 1.0
            signals.append("generic-name-no-doc")
        if body_lines < 2:
            score -= 2.0
            signals.append("too-short")

        return round(score, 2), signals
