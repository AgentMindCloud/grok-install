"""grok-install CLI entry."""

from __future__ import annotations

import pathlib

import click

from cli import __version__
from cli._utils import phase_stub
from cli.validate import run_validate


@click.group(name="grok-install")
@click.version_option(__version__, prog_name="grok-install")
def cli() -> None:
    """Grok-native agent ecosystem command line."""


@cli.command()
@click.argument(
    "path",
    type=click.Path(path_type=pathlib.Path),
    default=".",
)
def init(path: pathlib.Path) -> None:
    """Scaffold a new agent project at PATH."""
    # Scaffolding pairs naturally with the CLI's template surface; lands with
    # the agent catalog migration rather than the IDE extension port.
    del path
    phase_stub(
        "init",
        "a later release",
        extra=(
            "Project scaffolding ships alongside the agent catalog so the "
            "templates and the scaffold logic stay co-located."
        ),
    )


@cli.command()
@click.argument(
    "path",
    type=click.Path(exists=True, path_type=pathlib.Path),
    default=".",
)
def validate(path: pathlib.Path) -> None:
    """Validate a manifest file or directory of manifests against v2.14."""
    raise SystemExit(run_validate(path))


@cli.command()
@click.argument("agent_name")
def run(agent_name: str) -> None:
    """Run an installed agent by name."""
    del agent_name
    phase_stub(
        "run",
        "a later release",
        extra=(
            "Streamlit-shape detection and passthrough for X Money / "
            "finance-app manifests is per DECISIONS.md Q4 and ships with the "
            "finance agent catalog."
        ),
    )


@cli.command()
@click.argument(
    "path",
    type=click.Path(path_type=pathlib.Path),
    default=".",
)
@click.option(
    "--lucas-via",
    type=click.Choice(["xlos"]),
    default=None,
    help=(
        "Route the constitution scan through the xlOS Lucas-veto pipeline. "
        "Wires into the xlOS sibling at a later milestone."
    ),
)
def scan(path: pathlib.Path, lucas_via: str | None) -> None:
    """Run the constitution / safety scanner against PATH."""
    del path
    extra = "The constitution scanner lands with the safety/ implementation."
    if lucas_via:
        extra += (
            f"\nThe --lucas-via {lucas_via} pipeline ships once the xlOS "
            "sibling exposes its Lucas-veto API."
        )
    phase_stub("scan", "a later release", extra=extra)


@cli.command(name="list-agents")
@click.argument(
    "path",
    type=click.Path(path_type=pathlib.Path),
    default=".",
)
def list_agents(path: pathlib.Path) -> None:
    """List installed agents under PATH."""
    del path
    phase_stub(
        "list-agents",
        "a later release",
        extra="Agent listing wires up alongside the catalog migration.",
    )


if __name__ == "__main__":
    cli()
