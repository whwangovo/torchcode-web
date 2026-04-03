"""FastAPI grading service for torch_judge tasks."""

import sys
from pathlib import Path

# Add project root to sys.path for torch_judge imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import time
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from torch_judge.tasks import get_task

app = FastAPI(title="Grading Service")


class SubmitRequest(BaseModel):
    taskId: str
    code: str


class TestResult(BaseModel):
    name: str
    passed: bool
    execTimeMs: float
    error: str | None = None


class GradeResponse(BaseModel):
    passed: int
    total: int
    allPassed: bool
    results: list[TestResult]
    totalTimeMs: float
    error: str | None = None


@app.post("/grade", response_model=GradeResponse)
def grade(request: SubmitRequest) -> GradeResponse:
    task = get_task(request.taskId)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task '{request.taskId}' not found")

    results: list[TestResult] = []
    passed = 0
    total_time_ms = 0.0
    error: str | None = None

    # Execute user code to get the function
    user_ns: dict[str, Any] = {"torch": __import__("torch")}
    try:
        exec(request.code, user_ns)
    except SyntaxError as e:
        return GradeResponse(
            passed=0,
            total=0,
            allPassed=False,
            results=[],
            totalTimeMs=0.0,
            error=f"Syntax error: {e}",
        )

    fn_name = task.get("function_name")
    if fn_name is None:
        return GradeResponse(
            passed=0,
            total=0,
            allPassed=False,
            results=[],
            totalTimeMs=0.0,
            error="Task has no function_name defined",
        )

    if fn_name not in user_ns:
        return GradeResponse(
            passed=0,
            total=0,
            allPassed=False,
            results=[],
            totalTimeMs=0.0,
            error=f"Function '{fn_name}' not found in submitted code",
        )

    # Run each test
    for test in task.get("tests", []):
        test_ns: dict[str, Any] = {"torch": __import__("torch"), fn_name: user_ns[fn_name]}
        test_code = test["code"].replace("{fn}", fn_name)
        start = time.perf_counter()
        try:
            exec(test_code, test_ns)
            exec_time_ms = (time.perf_counter() - start) * 1000
            results.append(TestResult(name=test["name"], passed=True, execTimeMs=exec_time_ms))
            passed += 1
        except AssertionError as e:
            exec_time_ms = (time.perf_counter() - start) * 1000
            results.append(
                TestResult(
                    name=test["name"],
                    passed=False,
                    execTimeMs=exec_time_ms,
                    error=str(e),
                )
            )
        except Exception as e:
            exec_time_ms = (time.perf_counter() - start) * 1000
            results.append(
                TestResult(
                    name=test["name"],
                    passed=False,
                    execTimeMs=exec_time_ms,
                    error=f"{type(e).__name__}: {e}",
                )
            )
        total_time_ms += exec_time_ms

    return GradeResponse(
        passed=passed,
        total=len(results),
        allPassed=passed == len(results),
        results=results,
        totalTimeMs=total_time_ms,
        error=error,
    )


@app.get("/tasks/{task_id}/solution")
def get_solution(task_id: str) -> dict[str, str]:
    task = get_task(task_id)
    if task is None or not task.get("solution"):
        raise HTTPException(status_code=404, detail=f"Solution for '{task_id}' not found")
    return {"solution": task["solution"]}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
