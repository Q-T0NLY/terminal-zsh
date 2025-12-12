"""
Configuration for UNIVERSAL REGISTRY - Integrated ZSH + Python System
"""

import os
from pathlib import Path

# Base paths
UNIVERSAL_REGISTRY_ROOT = Path(__file__).parent.absolute()
ZSH_REGISTRY_PATH = UNIVERSAL_REGISTRY_ROOT.parent / "hyper_registry.zsh"
PYTHON_REGISTRY_PATH = UNIVERSAL_REGISTRY_ROOT / "hyper_registry"

# Database configuration
DATABASE_CONFIG = {
    "sqlite": {
        "path": str(UNIVERSAL_REGISTRY_ROOT / ".universal_registry.db"),
        "echo": False,
        "pool_size": 20,
        "max_overflow": 40
    },
    "postgresql": {
        "host": os.getenv("REGISTRY_DB_HOST", "localhost"),
        "port": int(os.getenv("REGISTRY_DB_PORT", 5432)),
        "database": os.getenv("REGISTRY_DB_NAME", "universal_registry"),
        "user": os.getenv("REGISTRY_DB_USER", "registry"),
        "password": os.getenv("REGISTRY_DB_PASSWORD", "registry"),
        "pool_size": 100,
        "max_overflow": 200
    }
}

# Default to SQLite for local development
ACTIVE_DATABASE = "sqlite"

# Logging configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s | %(name)s | %(levelname)s | %(message)s"
        },
        "detailed": {
            "format": "%(asctime)s | %(name)s | %(levelname)s | %(filename)s:%(lineno)d | %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "standard",
            "stream": "ext://sys.stdout"
        },
        "file": {
            "class": "logging.FileHandler",
            "level": "DEBUG",
            "formatter": "detailed",
            "filename": str(UNIVERSAL_REGISTRY_ROOT / "universal_registry.log")
        }
    },
    "root": {
        "level": "DEBUG",
        "handlers": ["console", "file"]
    }
}

# Sync configuration (ZSH ↔ Python)
SYNC_CONFIG = {
    "enabled": True,
    "interval_seconds": 30,
    "bidirectional": True,
    "conflict_resolution": "manual",
    "backup_before_sync": True,
    "backup_retention_days": 7
}

# Feature flags
FEATURES = {
    "hotswap_enabled": True,
    "streaming_enabled": True,
    "propagation_enabled": True,
    "swarm_intelligence_enabled": True,
    "health_monitoring_enabled": True,
    "lifecycle_tracking_enabled": True,
    "dependency_mapping_enabled": True,
    "real_time_sync_enabled": True
}

# Classification mapping (ZSH to Python)
CLASSIFICATION_MAPPING = {
    # ZSH classifications
    "zsh_config": "ZSH_CONFIG",
    "zsh_scripts": "ZSH_SCRIPTS",
    "zsh_functions": "ZSH_FUNCTIONS",
    "zsh_aliases": "ZSH_ALIASES",
    "zsh_prompts": "ZSH_PROMPTS",
    "zsh_themes": "ZSH_THEMES",
    "zsh_plugins": "ZSH_PLUGINS",
    
    # Visual components
    "palettes": "PALETTES",
    "glyphs": "GLYPHS",
    "animations": "ANIMATIONS",
    "particle_fx": "PARTICLE_FX",
    "ui_primitives": "UI_PRIMITIVES",
    
    # Documentation
    "documentations": "DOCUMENTATIONS",
    "capabilities": "CAPABILITIES"
}

# Python modules to load
PYTHON_MODULES = [
    "universal_registry",
    "hyper_registry.core.swarm_singularity_registry",
    "hyper_registry.core.enhanced_database"
]
