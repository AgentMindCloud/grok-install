---
title: Semantic Kernel
description: Bridge grok-install agents into Microsoft Semantic Kernel planners.
---

# Semantic Kernel

[Semantic Kernel](https://github.com/microsoft/semantic-kernel) is
Microsoft's AI orchestration framework. If your org already runs SK,
you can expose `grok-install` agents as native SK
[plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/).

## When to use this bridge

- Your existing stack is Semantic Kernel + .NET / C# / Python.
- You want `grok-install` agents to appear as SK functions inside a
  larger planner.
- You want to keep the agent's spec (YAML) as the source of truth but
  invoke it from SK.

## Installation

```bash
pip install grok-install grok-install-semantic-kernel semantic-kernel
```

## Expose an agent as an SK function

```python
from semantic_kernel import Kernel
from grok_install_sk import GrokInstallPlugin

kernel = Kernel()
# Mount a local grok-install agent directory as an SK plugin.
kernel.add_plugin(
    GrokInstallPlugin.from_directory("./research-swarm"),
    plugin_name="research",
)

result = await kernel.invoke(
    plugin_name="research",
    function_name="run",
    question="What are the latest grok-4 benchmarks?",
)
```

Every workflow or agent defined in your `grok-install.yaml` becomes an
invokable SK function. Input types come from `workflow.input_schema`.

## Invoke from the SK planner

```python
from semantic_kernel.planners import SequentialPlanner

planner = SequentialPlanner(kernel)
plan = await planner.create_plan(
    "Write a research brief on <topic>, then draft an X thread about it."
)
result = await plan.invoke(kernel)
```

The planner sees the `research` plugin and composes it with whatever
other SK functions you've registered.

## Caveats

- Approval gates from `grok-security.yaml` still apply. If you call a
  strict-profile agent from inside SK, the runtime blocks on approval
  — consider routing approvals through the SK kernel's event system.
- Tools defined in your agent's `tools/` directory run in the agent's
  sandbox, not SK's. Your SK plugins stay separate.
