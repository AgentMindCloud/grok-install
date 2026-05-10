"""grok-install CLI entry."""

from __future__ import annotations

import pathlib

import click

from cli import __version__
from cli._utils import phase_stub
from cli.listing import run_list_agents
from cli.runner import run_agent
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
@click.option(
    "--path",
    "search_path",
    type=click.Path(path_type=pathlib.Path),
    default="agents",
    help="Directory to search for installed agents (default: agents/).",
)
def run(agent_name: str, search_path: pathlib.Path) -> None:
    """Run an installed agent by name.

    Streamlit-targeted agents (per DECISIONS.md Q4) dispatch to ``streamlit
    run <entrypoint>``. Other deploy targets emit a 'ships in a later release'
    notice for now.
    """
    raise SystemExit(run_agent(search_path, agent_name))


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
    default="agents",
)
@click.option(
    "--json",
    "output_json",
    is_flag=True,
    help="Emit a JSON array of full manifest objects instead of the table.",
)
@click.option(
    "--target",
    "target_filter",
    default=None,
    help="Filter agents by deploy.targets membership (e.g. cli, streamlit).",
)
def list_agents(
    path: pathlib.Path,
    output_json: bool,
    target_filter: str | None,
) -> None:
    """List installed agents under PATH (default: agents/).

    Default table columns (in order): slug, name, version, targets, updated_at.
    Exit 0 on empty result; exit 2 if any schema-invalid manifest is found.
    """
    raise SystemExit(
        run_list_agents(
            path,
            output_json=output_json,
            target_filter=target_filter,
        )
    )


if __name__ == "__main__":
    cli()
