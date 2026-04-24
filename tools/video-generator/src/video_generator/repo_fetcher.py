"""Fetch a GitHub repo to a local path for analysis.

We prefer `git clone --depth 1` (fast, complete metadata). If git is missing or
the clone fails we fall back to downloading the tarball from
``codeload.github.com`` with urllib.
"""

from __future__ import annotations

import io
import re
import shutil
import subprocess
import tarfile
import tempfile
import urllib.request
from pathlib import Path
from typing import NamedTuple


class RepoRef(NamedTuple):
    owner: str
    name: str
    url: str
    local_path: Path | None = None  # if set, skip fetching


def parse_github_url(url: str) -> RepoRef:
    """Accept `https://github.com/owner/name`, `git@github.com:owner/name.git`,
    `owner/name`, or an existing local directory path.
    """
    cleaned = url.strip().rstrip("/")
    if cleaned.endswith(".git"):
        cleaned = cleaned[:-4]

    local = Path(cleaned).expanduser()
    if local.is_dir():
        return RepoRef(
            owner="local",
            name=local.name,
            url=local.resolve().as_uri(),
            local_path=local.resolve(),
        )

    https_match = re.match(r"^https?://github\.com/([^/]+)/([^/]+)", cleaned)
    ssh_match = re.match(r"^git@github\.com:([^/]+)/([^/]+)", cleaned)
    short_match = re.match(r"^([^/]+)/([^/]+)$", cleaned)

    match = https_match or ssh_match or short_match
    if not match:
        raise ValueError(f"Not a recognizable GitHub repo: {url}")
    owner, name = match.group(1), match.group(2)
    return RepoRef(owner=owner, name=name, url=f"https://github.com/{owner}/{name}")


def fetch(ref: RepoRef, into: Path) -> Path:
    """Fetch ``ref`` into ``into``. Returns the path that contains the repo root.

    If ``ref.local_path`` is set, we just return it - no clone needed.
    """
    if ref.local_path is not None:
        return ref.local_path
    into = Path(into)
    into.mkdir(parents=True, exist_ok=True)
    target = into / ref.name
    if target.exists():
        shutil.rmtree(target)

    if shutil.which("git"):
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", ref.url, str(target)],
                check=True,
                capture_output=True,
            )
            return target
        except subprocess.CalledProcessError as exc:
            print(f"[fetch] git clone failed ({exc.stderr.decode(errors='ignore').strip()}); trying tarball")

    # Fallback: tarball from codeload.
    for branch in ("main", "master"):
        url = f"https://codeload.github.com/{ref.owner}/{ref.name}/tar.gz/refs/heads/{branch}"
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                data = resp.read()
            break
        except Exception:
            continue
    else:
        raise RuntimeError(f"Could not fetch {ref.url}")

    with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as tar:
        with tempfile.TemporaryDirectory() as tmp:
            _safe_extract(tar, tmp)
            extracted = next(Path(tmp).iterdir())
            shutil.move(str(extracted), target)
    return target


def _safe_extract(tar: tarfile.TarFile, dest: str) -> None:
    """Defensive extract: reject entries with absolute paths or `..` segments."""
    base = Path(dest).resolve()
    for member in tar.getmembers():
        member_path = (base / member.name).resolve()
        if not str(member_path).startswith(str(base)):
            raise RuntimeError(f"Refusing to extract unsafe path: {member.name}")
    tar.extractall(dest)
