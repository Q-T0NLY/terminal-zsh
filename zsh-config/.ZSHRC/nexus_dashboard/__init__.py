#!/usr/bin/env python3
"""
NEXUS Dashboard Package
Initialize and export main components
"""

from .dashboard import (
    QuantumVisuals,
    UniversalRegistry,
    RegistryEntry,
    GridCell,
    DynamicGrid,
    NexusDashboard,
    print_banner,
    registry_cli,
)

__version__ = "4.0"
__author__ = "Nexus AI Studio"
__all__ = [
    "QuantumVisuals",
    "UniversalRegistry",
    "RegistryEntry",
    "GridCell",
    "DynamicGrid",
    "NexusDashboard",
    "print_banner",
    "registry_cli",
]
