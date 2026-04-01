"""Seed problems.json from task definitions."""

from __future__ import annotations

import json
import os
from pathlib import Path

DIFFICULTY_ORDER = {"Easy": 0, "Medium": 1, "Hard": 2}

OUTPUT_DIR = Path(__file__).parent.parent / "web" / "src" / "lib"
OUTPUT_FILE = OUTPUT_DIR / "problems.json"


def seed() -> None:
    from torch_judge.tasks._registry import TASKS

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sorted_tasks = sorted(
        TASKS.items(),
        key=lambda t: (DIFFICULTY_ORDER.get(t[1]["difficulty"], 9), t[0]),
    )

    problems = []
    for task_id, task in sorted_tasks:
        problems.append(
            {
                "id": task_id,
                "title": task["title"],
                "difficulty": task["difficulty"],
                "functionName": task["function_name"],
                "hint": task["hint"],
                "tests": task["tests"],
            }
        )

    output = {"problems": problems}
    OUTPUT_FILE.write_text(json.dumps(output, indent=2))
    print(f"Wrote {len(problems)} problems to {OUTPUT_FILE}")


if __name__ == "__main__":
    seed()
