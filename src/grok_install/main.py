"""grok-install CLI entry."""

from __future__ import annotations

import pathlib

import click

from grok_install import __version__
from grok_install.validate import run_validate


@click.group(name="grok-install")
@click.version_option(__version__, prog_name="grok-install")
def cli() -> None:
    """Grok-native agent ecosystem command line."""


@cli.command()
@click.argument(
    "path",
    type=click.Path(exists=True, path_type=pathlib.Path),
    default=".",
)
def validate(path: pathlib.Path) -> None:
    """Validate a manifest file or directory of manifests against v2.14."""
    raise SystemExit(run_validate(path))


if __name__ == "__main__":
    cli()
