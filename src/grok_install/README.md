## src/grok_install/

Lightweight Python package that ships one console command, `grok-install validate`, which checks an agent manifest (or a directory of manifests) against [`spec/v2.14/schema.json`](../../spec/v2.14/schema.json).

```bash
grok-install validate path/to/manifest.yaml
grok-install validate templates/
```

Exit codes: `0` on success, `1` on validation failure, `2` on read error.
