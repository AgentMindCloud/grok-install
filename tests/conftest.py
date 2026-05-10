"""Shared pytest fixtures for grok-install tests."""

import pathlib

import pytest


@pytest.fixture
def fixtures_dir() -> pathlib.Path:
    return pathlib.Path(__file__).parent / "fixtures"
