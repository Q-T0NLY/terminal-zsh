"""
Nexus AI REST API Server (minimal FastAPI wiring)
Enhanced with health checks, logging, and error handling
"""
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
import logging
import sys

from nexus_config import ConfigManager
from nexus_widgets import Widget

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Simple thin registry model to avoid circular imports
class RegistryEntryModel(BaseModel):
    """Registry entry model with validation"""
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., description="Entry name")
    type: str = Field(..., description="Entry type")
    category: str = Field(..., description="Category")
    version: str = Field(..., description="Version string")
    description: str = Field(..., description="Description")
    tags: List[str] = Field(default_factory=list, description="Tags")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata")
    dependencies: List[str] = Field(default_factory=list, description="Dependencies")
    enabled: bool = Field(default=True, description="Enabled status")

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="API version")
    uptime_seconds: float = Field(..., description="Uptime in seconds")

app = FastAPI(
    title="Nexus AI Hyper-Registry API",
    version="0.1",
    description="Enterprise-grade terminal orchestration API"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory registry for minimal API
REGISTRY: Dict[str, Dict[str, Any]] = {}
config_mgr = ConfigManager()
start_time = datetime.now()

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "type": type(exc).__name__}
    )

@app.get("/")
async def root():
    """Root endpoint"""
    logger.info("Root endpoint accessed")
    return {"service": "nexus-api", "version": "0.1", "status": "ok"}

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for container orchestration"""
    uptime = (datetime.now() - start_time).total_seconds()
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="0.1",
        uptime_seconds=uptime
    )

@app.get("/registry", response_model=List[RegistryEntryModel])
async def get_registry():
    """Get all registry entries"""
    logger.info(f"Retrieving {len(REGISTRY)} registry entries")
    return list(REGISTRY.values())

@app.post("/registry", status_code=status.HTTP_201_CREATED)
async def register(entry: RegistryEntryModel):
    """Register a new entry"""
    if entry.id in REGISTRY:
        logger.warning(f"Attempted to register duplicate entry: {entry.id}")
        raise HTTPException(status_code=400, detail="Entry already exists")
    REGISTRY[entry.id] = entry.dict()
    logger.info(f"Registered new entry: {entry.id}")
    return {"status": "ok", "id": entry.id}

@app.get("/config")
async def get_config():
    """Get current configuration"""
    logger.info("Configuration requested")
    try:
        return config_mgr.config.to_dict()
    except Exception as e:
        logger.error(f"Error retrieving config: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve configuration")

if __name__ == "__main__":
    logger.info("Starting Nexus API server on 0.0.0.0:8080")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        log_level="info",
        access_log=True
    )
