"""Rasterize every SVG poster to a 1200x630 PNG for X (Twitter) cards.

X does not render SVG og:images — cards need raster (PNG/JPG). This script
walks docs/posters/ and assets/ for SVG sources sized 1200x630 (the
expected summary_large_image aspect) and writes a sibling .png.

Run manually whenever a poster SVG changes:

    pip install cairosvg pillow
    python scripts/rasterize_posters.py
"""

from __future__ import annotations

from io import BytesIO
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TARGET_W, TARGET_H = 1200, 630
BG = (11, 15, 23)  # #0b0f17 — matches the layout background


def rasterize(svg: Path, out: Path) -> None:
    png_bytes = cairosvg.svg2png(
        url=str(svg),
        output_width=TARGET_W,
        output_height=TARGET_H,
    )
    img = Image.open(BytesIO(png_bytes)).convert("RGB")
    if img.size != (TARGET_W, TARGET_H):
        canvas = Image.new("RGB", (TARGET_W, TARGET_H), BG)
        x = (TARGET_W - img.width) // 2
        y = (TARGET_H - img.height) // 2
        canvas.paste(img, (x, y))
        img = canvas
    img.save(out, "PNG", optimize=True)


def main() -> None:
    sources = [
        (ROOT / "assets" / "og-image.svg", ROOT / "docs" / "posters" / "og-default.png"),
    ]
    written = 0
    for svg, png in sources:
        if not svg.exists():
            print(f"skip {svg.relative_to(ROOT)} — not found")
            continue
        png.parent.mkdir(parents=True, exist_ok=True)
        rasterize(svg, png)
        print(f"wrote {png.relative_to(ROOT)}")
        written += 1
    if not written:
        raise SystemExit("no SVG sources rasterized")


if __name__ == "__main__":
    main()
