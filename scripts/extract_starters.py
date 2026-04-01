#!/usr/bin/env python3
"""
Extract starter code from template notebooks.

Reads all .ipynb files from templates/, finds the implementation cell
for each problem, and extracts the function/class definition as starter code.
Outputs to web/src/lib/starters.json as {task_id: starter_code}.
"""

import ast
import json
import os
import re
import sys
from pathlib import Path


def extract_task_id_from_check(cell_source: str) -> str | None:
    """Extract task_id from check() call in cell source."""
    match = re.search(r'check\(["\'](\w+)["\']\)', cell_source)
    if match:
        return match.group(1)
    return None


def extract_implementation_cell(cells: list) -> tuple[str, str] | None:
    """Find the cell with implementation marker and return (cell_source, task_id)."""
    for cell in cells:
        if cell.get("cell_type") != "code":
            continue
        source = cell.get("source", [])
        if isinstance(source, list):
            source = "".join(source)
        if "# ✏️ YOUR IMPLEMENTATION HERE" in source:
            task_id = extract_task_id_from_check(source)
            return source, task_id
    return None


def extract_function_or_class(source: str) -> str:
    """Extract the first function or class definition from source code using ast.unparse."""
    try:
        tree = ast.parse(source)
    except SyntaxError:
        # Fallback: try to extract by regex for simple cases
        return extract_by_regex(source)

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
            # Use ast.unparse to get the code with type annotations preserved
            result = ast.unparse(node)

            # If the body is just 'pass', generate a skeleton instead
            body = node.body
            if len(body) == 1 and isinstance(body[0], ast.Pass):
                return generate_skeleton(node)

            return result

    # No function/class found, try regex extraction
    return extract_by_regex(source)


def extract_by_regex(source: str) -> str:
    """Fallback extraction using regex patterns."""
    # Match function or class definition
    patterns = [
        r'(class \w+.*?:.*?(?=\n(?:class |\ndef |import |from |[^\n]+\n(?:class |\ndef ))|\Z))',
        r'(def \w+.*?:.*?(?=\n(?:class |\ndef |import |from |[^\n]+\n(?:class |\ndef ))|\Z))',
        r'(def \w+\([\s\S]*?\n(?=\n(?:class |\ndef |import |from |\Z)))',
    ]

    for pattern in patterns:
        match = re.search(pattern, source, re.MULTILINE)
        if match:
            result = match.group(1).strip()
            # Clean up trailing 'pass' comments
            if "pass  #" in result or "pass #" in result:
                lines = result.split("\n")
                cleaned_lines = []
                for line in lines:
                    if line.strip() == "pass  # Replace this" or line.strip() == "pass # Replace this":
                        cleaned_lines.append("    pass")
                    elif "pass  #" in line or "pass #" in line:
                        cleaned_lines.append(line.replace("pass  #", "    #").replace("pass #", "    #"))
                    else:
                        cleaned_lines.append(line)
                result = "\n".join(cleaned_lines)
            return result

    return ""


def generate_skeleton(node: ast.FunctionDef | ast.ClassDef) -> str:
    """Generate a basic skeleton for a function or class, preserving type annotations."""
    if isinstance(node, ast.ClassDef):
        # Generate class skeleton with __init__ and forward if present
        # Use ast.unparse to preserve type annotations
        parts = [f"class {node.name}:"]
        init_found = False
        forward_found = False

        for item in node.body:
            if isinstance(item, ast.FunctionDef):
                if item.name == "__init__":
                    init_found = True
                    # ast.unparse includes trailing colon, but we want a body
                    parts.append("    " + ast.unparse(item).split("\n")[0] + "\n        pass")
                elif item.name == "forward":
                    forward_found = True
                    parts.append("    " + ast.unparse(item).split("\n")[0] + "\n        pass")

        if not init_found:
            parts.append("    def __init__(self):\n        pass")
        if not forward_found:
            parts.append("    def forward(self, ...):\n        pass")

        return "\n".join(parts)
    else:
        # Use ast.unparse to preserve type annotations
        # ast.unparse returns "def foo(...):" so we add newline and pass
        return ast.unparse(node).split("\n")[0] + "\n    pass"


def notebook_filename_to_task_id(filename: str) -> str:
    """Convert notebook filename to task_id (e.g., '01_relu.ipynb' -> 'relu')."""
    basename = os.path.basename(filename)
    # Remove leading numbers and underscore: "01_relu.ipynb" -> "relu.ipynb" -> "relu"
    task_id = re.sub(r'^\d+_', '', basename)  # Remove leading "01_"
    task_id = os.path.splitext(task_id)[0]    # Remove extension
    return task_id


def process_notebook(notebook_path: Path) -> tuple[str, str] | None:
    """Process a single notebook and return (task_id, starter_code)."""
    with open(notebook_path, "r", encoding="utf-8") as f:
        notebook = json.load(f)

    cells = notebook.get("cells", [])
    result = extract_implementation_cell(cells)

    if result is None:
        task_id = notebook_filename_to_task_id(str(notebook_path))
        return task_id, None

    cell_source, task_id_from_check = result
    starter = extract_function_or_class(cell_source)

    # Use task_id from check() if available, otherwise derive from filename
    task_id = task_id_from_check if task_id_from_check else notebook_filename_to_task_id(str(notebook_path))

    return task_id, starter


def main():
    templates_dir = Path(__file__).parent.parent / "templates"
    output_path = Path(__file__).parent.parent / "web" / "src" / "lib" / "starters.json"

    # Create output directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)

    starters = {}

    # Find all .ipynb files
    notebook_files = sorted(templates_dir.glob("*.ipynb"))

    for notebook_path in notebook_files:
        task_id, starter = process_notebook(notebook_path)
        if task_id:
            starters[task_id] = starter if starter else f"def {task_id}(...):\n    pass"

    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(starters, f, indent=2)

    print(f"Extracted starters for {len(starters)} problems to {output_path}")


if __name__ == "__main__":
    main()
