"""Per-request latency metrics, broken down by stage (search, Claude, speech, total).

Uses CloudWatch's Embedded Metric Format: each request prints one JSON log line, and CloudWatch
turns it into metrics in the "Portfolio" namespace (dimension: Endpoint = chat / voice). No extra
API calls, so measuring adds no latency. Outside Lambda the same numbers are printed as a short
readable line instead.

Usage in an endpoint:
    with request_timer("voice") as timer:
        with stage("Speech"):
            ...
Code deeper in the call (rag.py) can call stage(...) too; it attaches to the current request.
"""
import json
import os
import time
from contextlib import contextmanager
from contextvars import ContextVar

NAMESPACE = "Portfolio"
IN_LAMBDA = bool(os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

_current: ContextVar["RequestTimer | None"] = ContextVar("request_timer", default=None)


class RequestTimer:
    def __init__(self, endpoint: str):
        self.endpoint = endpoint
        self.stages: dict[str, float] = {}
        self.start = time.perf_counter()
        self.ok = True

    def add(self, name: str, ms: float) -> None:
        self.stages[name] = self.stages.get(name, 0.0) + ms

    def emit(self) -> None:
        values = {f"{name}Latency": round(ms, 1) for name, ms in self.stages.items()}
        values["TotalLatency"] = round((time.perf_counter() - self.start) * 1000, 1)
        if IN_LAMBDA:
            print(json.dumps({
                "_aws": {
                    "Timestamp": int(time.time() * 1000),
                    "CloudWatchMetrics": [{
                        "Namespace": NAMESPACE,
                        "Dimensions": [["Endpoint"]],
                        "Metrics": [{"Name": name, "Unit": "Milliseconds"} for name in values]
                        + [{"Name": "Requests", "Unit": "Count"}, {"Name": "Failures", "Unit": "Count"}],
                    }],
                },
                "Endpoint": self.endpoint,
                "Requests": 1,
                "Failures": 0 if self.ok else 1,
                **values,
            }))
        else:
            summary = " | ".join(f"{k.removesuffix('Latency')} {v:.0f}ms" for k, v in values.items())
            print(f"[latency] {self.endpoint}{'' if self.ok else ' (failed)'}: {summary}")


@contextmanager
def request_timer(endpoint: str):
    timer = RequestTimer(endpoint)
    token = _current.set(timer)
    try:
        yield timer
    except Exception:
        timer.ok = False
        raise
    finally:
        _current.reset(token)
        try:
            timer.emit()
        except Exception as e:  # metrics must never break a request
            print(f"Metrics emit failed: {e!r}")


@contextmanager
def stage(name: str):
    """Time a block and add it to the current request's metrics (no-op outside a request)."""
    start = time.perf_counter()
    try:
        yield
    finally:
        timer = _current.get()
        if timer is not None:
            timer.add(name, (time.perf_counter() - start) * 1000)
