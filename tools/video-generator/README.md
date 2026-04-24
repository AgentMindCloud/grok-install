# grok-vidgen

Autonomous 60-second explainer videos for GitHub repos. Point it at a repo,
it picks the most "wow in 10 seconds" functions, generates Remotion scripts
+ narration + captions, and renders vertical MP4s (1080×1920 @ 30fps)
optimized for X, TikTok, and YouTube Shorts.

```
repo ─▶ analyzer ─▶ narration ─▶ Remotion project ─▶ TTS ─▶ remotion render ─▶ mp4 + metadata
```

## Install

```bash
pip install -e tools/video-generator
# Optional (for real voiceover): pip install elevenlabs && export ELEVENLABS_API_KEY=...
# For rendering: Node 18+ with npx on PATH
```

## Commands

```bash
# Just list the functions grok-vidgen would turn into videos
grok-vidgen plan  https://github.com/agentmindcloud/grok-install

# Full pipeline: analyze, script, TTS, render, package
grok-vidgen build https://github.com/agentmindcloud/grok-install \
    --audience developers \
    --out ./out

# Same but point at a local checkout
grok-vidgen build ./tools/video-generator --out ./out --no-render

# Batch a folder of repos (one URL per line) into a spreadsheet
grok-vidgen batch repos.txt --out ./out --render
```

Defaults to the brand palette: cyan `#00f0ff`, violet `#8b5cf6`, amber
`#f5a524`. Override with `--cyan`, `--violet`, `--amber`.

## What gets emitted

```
out/
├── videos/<repo>/<function>.mp4           # the renderable artifact
├── metadata/<repo>/<function>.json        # narration, captions, hashtags, x_post
├── projects/<repo>/<function>/            # self-contained Remotion project
│   ├── scene.json                         # the only dynamic input
│   ├── public/narration/...               # TTS audio
│   └── src/ ...                           # copied from remotion-template/
└── <repo>-batch.csv                       # repo | function | video_url | x_post | status
```

## Video structure (60s)

| Segment      | Duration | What it shows                                           |
|--------------|----------|---------------------------------------------------------|
| Hook         | 3s       | Big on-brand one-liner: "why should I care?"            |
| Concept      | 10s      | Function name + 3 bullet callouts pulled from narration |
| Walkthrough  | 20s      | Syntax-highlighted typing animation with cursor & line highlight |
| Result/demo  | 15s      | Stylized terminal showing the return value              |
| CTA          | 12s      | "Star on GitHub" + repo URL with underline sweep        |

All segments share a drifting gradient background (Canvas-free, CSS blobs)
and live captions synced to narration timestamps.

## How it picks functions

The analyzer walks `src/`, `lib/`, `components/` (and falls back to the whole
repo), parses Python with `ast` and JS/TS with a purpose-built regex, then
scores each candidate on:

* **concise-body** - 3–12 line functions tell stories; 1-liners and walls of
  code don't.
* **has-docstring** - we lean on the existing doc for the narration's concept
  beat.
* **verb:<name>** - names that start with `stream`, `generate`, `parse`,
  `render`, `deploy`, `reply`, `sign`, … score higher.
* **canonical-dir** - functions under `src/`, `lib/`, `components/`.
* **async** - small bump; async functions usually have a demo-able side effect.

Penalties: names like `main`/`run`/`init` without a docstring, or bodies
under 2 lines.

## Why these constraints?

* **Vertical 1080×1920 @ 30fps** - meets the minimum for X, TikTok,
  YouTube Shorts without upscaling.
* **≤ 15 visible code lines** - larger snippets don't read on mobile.
* **150–200 narration words** - ~2.6 words/sec is energetic but natural.
* **No external deps in the Remotion scripts** - we ship our own tiny
  tokenizer (`src/lib/highlight.ts`) for Python/JS/TS, so the generated
  project has a fixed, auditable dependency graph: Remotion + React only.
* **Per-tool TTS fallback** - if `ELEVENLABS_API_KEY` is absent or the call
  fails, we write a silent 60s WAV so the render pipeline stays testable.

## Developing

```bash
cd tools/video-generator
pip install -e '.[dev]'
pytest
```

The Remotion template lives in `remotion-template/` and is copied verbatim
into every output project. To iterate on the visuals, run `npm install &&
npm start` from inside any generated `out/projects/.../` directory.

## Layout

```
tools/video-generator/
├── src/video_generator/
│   ├── analyzer.py          # function detection + wow scoring
│   ├── brand.py             # palette + timing constants
│   ├── cli.py               # plan / build / batch commands
│   ├── metadata.py          # hashtags + X post + batch CSV
│   ├── narration.py         # hook/concept/walkthrough/result/cta writer
│   ├── remotion.py          # writes scene.json + copies template
│   ├── renderer.py          # shells out to `npx remotion render`
│   ├── repo_fetcher.py      # git clone or tarball fallback
│   └── tts.py               # ElevenLabs client with silent-WAV fallback
├── remotion-template/
│   ├── src/components/      # Hook, Callout, CodeWalkthrough, ResultDemo, CTA, Captions, Background
│   ├── src/lib/highlight.ts # zero-dep tokenizer (Python/JS/TS)
│   ├── src/lib/scene.ts     # Scene type shared with Python side
│   └── src/{Root,Video}.tsx
└── tests/test_pipeline.py   # analyzer -> narration -> scene.json smoke test
```
