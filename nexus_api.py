"""
Nexus AI Hyper-Registry API with Prometheus metrics (including Gauge)

- Root status endpoint
- Health and readiness probes
- In-memory hyper-registry CRUD
- Config surface via ConfigManager
- Prometheus metrics:
  - Counter: nexus_request_count
  - Histogram: nexus_request_latency_seconds
  - Gauge: nexus_up

Intended to be run via:
    uvicorn nexus_api:app --host 0.0.0.0 --port 8080 --reload

or orchestrated by fullstack.sh:
    ./fullstack.sh backend
"""

from __future__ import annotations

import logging
import time
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, BaseSettings, Field

# Prometheus client for metrics
from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

# Local imports from your Nexus stack
from nexus_config import ConfigManager
from nexus_widgets import Widget  # noqa: F401  # Ensure Widget is imported/registered


# ---------------------------------------------------------------------------
# Settings / configuration
# ---------------------------------------------------------------------------


class NexusAPISettings(BaseSettings):
    """Runtime configuration for the Nexus API service."""

    service_name: str = Field(default="nexus-api", description="Logical service name")
    service_version: str = Field(default="0.1.0", description="Semantic service version")

    # CORS
    cors_allow_origins: List[str] = Field(
        default_factory=lambda: ["*"],
        description="List of allowed CORS origins",
    )
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = Field(
        default_factory=lambda: ["*"],
        description="List of allowed HTTP methods",
    )
    cors_allow_headers: List[str] = Field(
        default_factory=lambda: ["*"],
        description="List of allowed HTTP headers",
    )

    # Toggle debug / verbose logging
    debug: bool = False

    class Config:
        env_prefix = "NEXUS_API_"
        case_sensitive = False


settings = NexusAPISettings()


# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

logger = logging.getLogger(settings.service_name)
handler = logging.StreamHandler()
formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)


# ---------------------------------------------------------------------------
# Prometheus metrics
# ---------------------------------------------------------------------------

REQUEST_COUNT = Counter(
    "nexus_request_count",
    "Total number of HTTP requests",
    ["method", "path", "status_code"],
)

REQUEST_LATENCY = Histogram(
    "nexus_request_latency_seconds",
    "Latency of HTTP requests in seconds",
    ["method", "path", "status_code"],
)

UP_GAUGE = Gauge(
    "nexus_up",
    "Nexus API up indicator (1 for up, 0 for down)",
)

# Mark service as up on import
UP_GAUGE.set(1.0)


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------


class RegistryEntryModel(BaseModel):
    id: str
    name: str
    type: str
    category: str
    version: str
    description: str
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
    dependencies: List[str] = []
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class RegistryUpdateModel(BaseModel):
    """Partial update model for a registry entry."""

    name: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    version: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    dependencies: Optional[List[str]] = None
    enabled: Optional[bool] = None


class ServiceInfo(BaseModel):
    service: str
    version: str
    status: str
    timestamp: datetime
    request_id: str
    uptime_seconds: float


class HealthStatus(BaseModel):
    status: str
    time: datetime
    checks: Dict[str, str]


# ---------------------------------------------------------------------------
# In-memory state
# ---------------------------------------------------------------------------

REGISTRY: Dict[str, Dict[str, Any]] = {}
config_mgr = ConfigManager()
SERVICE_START_TIME = time.time()


# ---------------------------------------------------------------------------
# FastAPI initialization
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Nexus AI Hyper-Registry API",
    version=settings.service_version,
    debug=settings.debug,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


# ---------------------------------------------------------------------------
# Middleware: request ID, logging, and Prometheus metrics
# ---------------------------------------------------------------------------


@app.middleware("http")
async def add_request_id_logging_and_metrics(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    path = request.url.path
    method = request.method

    start = time.time()
    try:
        response: Response = await call_next(request)
        status_code = response.status_code
    except Exception as exc:  # noqa: BLE001
        status_code = 500
        logger.exception(
            "Unhandled exception [%s] for %s %s", request_id, request.method, request.url
        )
        duration = time.time() - start
        REQUEST_COUNT.labels(method=method, path=path, status_code=str(status_code)).inc()
        REQUEST_LATENCY.labels(
            method=method, path=path, status_code=str(status_code)
        ).observe(duration)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred.",
                "request_id": request_id,
            },
        )

    duration = time.time() - start

    REQUEST_COUNT.labels(method=method, path=path, status_code=str(status_code)).inc()
    REQUEST_LATENCY.labels(
        method=method, path=path, status_code=str(status_code)
    ).observe(duration)

    logger.info(
        "req_id=%s method=%s path=%s status=%s duration_ms=%.2f",
        request_id,
        method,
        path,
        status_code,
        duration * 1000.0,
    )

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-ms"] = f"{duration * 1000.0:.2f}"
    return response


# ---------------------------------------------------------------------------
# Root, health, readiness, and metrics endpoints
# ---------------------------------------------------------------------------


@app.get("/", response_model=ServiceInfo, tags=["system"])
async def root(request: Request):
    """Service info + basic health combined."""
    now = datetime.utcnow()
    uptime = time.time() - SERVICE_START_TIME
    return ServiceInfo(
        service=settings.service_name,
        version=settings.service_version,
        status="ok",
        timestamp=now,
        request_id=request.state.request_id,
        uptime_seconds=uptime,
    )


@app.get("/healthz", response_model=HealthStatus, tags=["system"])
async def health():
    """Kubernetes-style liveness probe."""
    now = datetime.utcnow()
    checks = {
        "api": "ok",
        "registry": "ok",
        "config": "ok",
    }
    return HealthStatus(status="ok", time=now, checks=checks)


@app.get("/readyz", response_model=HealthStatus, tags=["system"])
async def readiness():
    """Kubernetes-style readiness probe."""
    now = datetime.utcnow()
    checks = {
        "api": "ok",
        "registry": "ok",
        "config": "ok",
    }
    return HealthStatus(status="ok", time=now, checks=checks)


@app.get("/metrics", tags=["metrics"])
async def metrics():
    """
    Expose Prometheus metrics.

    Scrape endpoint:
        GET /metrics
    """
    data = generate_latest()
    return PlainTextResponse(content=data, media_type=CONTENT_TYPE_LATEST)


# ---------------------------------------------------------------------------
# Registry endpoints
# ---------------------------------------------------------------------------


@app.get("/registry", response_model=List[RegistryEntryModel], tags=["registry"])
async def get_registry():
    """Return all known registry entries."""
    return [RegistryEntryModel(**entry) for entry in REGISTRY.values()]


@app.get("/registry/{entry_id}", response_model=RegistryEntryModel, tags=["registry"])
async def get_registry_entry(entry_id: str):
    """Get a single registry entry by ID."""
    if entry_id not in REGISTRY:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not_found")
    return RegistryEntryModel(**REGISTRY[entry_id])


@app.post(
    "/registry",
    status_code=status.HTTP_201_CREATED,
    response_model=RegistryEntryModel,
    tags=["registry"],
)
async def register(entry: RegistryEntryModel):
    """Register a new entry in the hyper-registry."""
    if entry.id in REGISTRY:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="exists")

    now = datetime.utcnow()
    entry.created_at = now
    entry.updated_at = now

    REGISTRY[entry.id] = entry.dict()
    logger.info("registry_add id=%s name=%s type=%s", entry.id, entry.name, entry.type)
    return entry


@app.put("/registry/{entry_id}", response_model=RegistryEntryModel, tags=["registry"])
async def replace_registry_entry(entry_id: str, entry: RegistryEntryModel):
    """Completely replace a registry entry."""
    now = datetime.utcnow()
    entry.id = entry_id
    entry.updated_at = now
    if entry_id not in REGISTRY:
        entry.created_at = now
    else:
        prev = REGISTRY[entry_id]
        entry.created_at = prev.get("created_at", now)

    REGISTRY[entry_id] = entry.dict()
    logger.info("registry_replace id=%s name=%s type=%s", entry.id, entry.name, entry.type)
    return entry


@app.patch("/registry/{entry_id}", response_model=RegistryEntryModel, tags=["registry"])
async def update_registry_entry(entry_id: str, patch: RegistryUpdateModel):
    """Partially update a registry entry."""
    if entry_id not in REGISTRY:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not_found")

    stored = REGISTRY[entry_id]
    updated = {**stored}
    for field, value in patch.dict(exclude_unset=True).items():
        updated[field] = value

    updated["updated_at"] = datetime.utcnow()
    REGISTRY[entry_id] = updated
    logger.info(
        "registry_update id=%s fields=%s",
        entry_id,
        list(patch.dict(exclude_unset=True).keys()),
    )
    return RegistryEntryModel(**updated)


@app.delete(
    "/registry/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["registry"],
)
async def delete_registry_entry(entry_id: str):
    """Delete a registry entry."""
    if entry_id not in REGISTRY:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not_found")

    del REGISTRY[entry_id]
    logger.info("registry_delete id=%s", entry_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# Config endpoint
# ---------------------------------------------------------------------------


@app.get("/config", tags=["config"])
async def get_config():
    """
    Return the current Nexus config surface.

    Assumes `config_mgr.config` exposes a `to_dict()` method.
    """
    try:
        cfg = config_mgr.config.to_dict()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to fetch config via ConfigManager: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="config_error",
        ) from exc

    return {
        "config": cfg,
        "service": settings.service_name,
        "version": settings.service_version,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


# ---------------------------------------------------------------------------
# Entrypoint for running directly
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    logger.info(
        "Starting %s on 0.0.0.0:8080 (development mode). Use a process manager in production.",
        settings.service_name,
    )
    uvicorn.run("nexus_api:app", host="0.0.0.0", port=8080, reload=True)