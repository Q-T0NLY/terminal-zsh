#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                          🌌 HYPER REGISTRY - CORE REGISTRY ENGINE 🌌                                                                       ║
║                                  ADVANCED DYNAMIC UNIVERSAL REGISTRY SYSTEM v1.0.0                                                                        ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║  [📊] MODULE: Core Registry Engine with GEFS Scoring                                                                                                      ║
║  [🎯] PURPOSE: Central registry for components, plugins, services, configurations                                                                         ║
║  [⚡] PERFORMANCE: <1ms operations | 1M+ entries supported                                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import json
import time
import hashlib
import threading
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field, asdict
from enum import Enum
from pathlib import Path
import sqlite3
from datetime import datetime


# ═══════════════════════════════════════════════════════════════════════════════
# 📊 GEFS SCORING SYSTEM - GENERATIVE ENSEMBLE FUSION SCORING
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class GEFSScore:
    """Generative Ensemble Fusion Score metrics"""
    quality: float = 0.0          # Code/component quality (0-100)
    reliability: float = 0.0      # Reliability score (0-100)
    performance: float = 0.0      # Performance metrics (0-100)
    security: float = 0.0         # Security rating (0-100)
    compatibility: float = 0.0    # Compatibility score (0-100)
    documentation: float = 0.0    # Documentation completeness (0-100)
    
    @property
    def overall(self) -> float:
        """Calculate overall GEFS score"""
        weights = {
            'quality': 0.25,
            'reliability': 0.20,
            'performance': 0.20,
            'security': 0.15,
            'compatibility': 0.10,
            'documentation': 0.10
        }
        return sum([
            self.quality * weights['quality'],
            self.reliability * weights['reliability'],
            self.performance * weights['performance'],
            self.security * weights['security'],
            self.compatibility * weights['compatibility'],
            self.documentation * weights['documentation']
        ])
    
    @property
    def grade(self) -> str:
        """Convert score to letter grade"""
        score = self.overall
        if score >= 95: return "A+"
        elif score >= 90: return "A"
        elif score >= 85: return "A-"
        elif score >= 80: return "B+"
        elif score >= 75: return "B"
        elif score >= 70: return "B-"
        elif score >= 65: return "C+"
        elif score >= 60: return "C"
        else: return "F"
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════════════════
# 🏛️ REGISTRY ENTRY - CORE DATA MODEL
# ═══════════════════════════════════════════════════════════════════════════════

class EntryType(Enum):
    """Registry entry types"""
    PLUGIN = "plugin"
    SERVICE = "service"
    COMPONENT = "component"
    CONFIGURATION = "configuration"
    THEME = "theme"
    LAYOUT = "layout"
    MODULE = "module"
    RESOURCE = "resource"
    SUBREGISTRY = "subregistry"
    FEATURE_LAYER = "feature_layer"


class EntryStatus(Enum):
    """Entry lifecycle status"""
    REGISTERED = "registered"
    ACTIVE = "active"
    INACTIVE = "inactive"
    DEPRECATED = "deprecated"
    FAILED = "failed"


@dataclass
class RegistryEntry:
    """Core registry entry with comprehensive metadata"""
    
    # Identity
    id: str
    name: str
    type: EntryType
    namespace: str
    version: str
    
    # Metadata
    description: str = ""
    author: str = ""
    tags: List[str] = field(default_factory=list)
    
    # Location & Reference
    path: Optional[str] = None
    url: Optional[str] = None
    checksum: Optional[str] = None
    
    # Dependencies
    dependencies: List[str] = field(default_factory=list)
    conflicts: List[str] = field(default_factory=list)
    
    # Lifecycle
    status: EntryStatus = EntryStatus.REGISTERED
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    # Quality & Scoring
    gefs_score: GEFSScore = field(default_factory=GEFSScore)
    
    # Configuration
    config: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def calculate_checksum(self, data: bytes) -> str:
        """Calculate SHA-256 checksum"""
        return hashlib.sha256(data).hexdigest()
    
    def validate(self) -> List[str]:
        """Validate entry, return list of errors"""
        errors = []
        
        if not self.id:
            errors.append("Entry ID is required")
        if not self.name:
            errors.append("Entry name is required")
        if not self.namespace:
            errors.append("Namespace is required")
        if not self.version:
            errors.append("Version is required")
        
        # Check dependency conflicts
        if set(self.dependencies) & set(self.conflicts):
            errors.append("Entry has conflicting dependencies")
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'type': self.type.value,
            'namespace': self.namespace,
            'version': self.version,
            'description': self.description,
            'author': self.author,
            'tags': self.tags,
            'path': self.path,
            'url': self.url,
            'checksum': self.checksum,
            'dependencies': self.dependencies,
            'conflicts': self.conflicts,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'gefs_score': self.gefs_score.to_dict(),
            'config': self.config,
            'metadata': self.metadata
        }
        return data


# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 FEATURE LAYER - CLASSIFICATIONS & FACETS
# ═══════════════════════════════════════════════════════════════════════════════


@dataclass
class FeatureFlag:
    """Structured feature/classification descriptor."""

    id: str
    name: str
    description: str = ""
    category: str = "classification"
    maturity: str = "ga"  # alpha | beta | ga | deprecated
    enabled: bool = True
    tags: List[str] = field(default_factory=list)
    weight: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)

    def validate(self) -> List[str]:
        errors: List[str] = []

        if not self.id:
            errors.append("Feature id is required")
        if not self.name:
            errors.append("Feature name is required")
        if self.maturity not in {"alpha", "beta", "ga", "deprecated"}:
            errors.append(f"Unsupported maturity: {self.maturity}")
        if self.weight < 0:
            errors.append("Feature weight cannot be negative")
        return errors

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "maturity": self.maturity,
            "enabled": self.enabled,
            "tags": self.tags,
            "weight": self.weight,
            "metadata": self.metadata,
        }


@dataclass
class FeatureLayer:
    """Composable feature layer that can be attached to registry entries."""

    id: str
    name: str
    namespace: str
    version: str = "1.0.0"
    description: str = ""
    features: List[FeatureFlag] = field(default_factory=list)
    facets: Dict[str, List[str]] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def validate(self) -> List[str]:
        errors: List[str] = []

        if not self.id:
            errors.append("Feature layer id is required")
        if not self.name:
            errors.append("Feature layer name is required")
        if not self.namespace:
            errors.append("Feature layer namespace is required")

        for feature in self.features:
            errors.extend(feature.validate())

        return errors

    def build_facets(self) -> Dict[str, List[str]]:
        """Derive facets from features and merge with explicit facets."""
        categories = set(self.facets.get("categories", []))
        tags = set(self.facets.get("tags", []))
        maturities = set(self.facets.get("maturity", []))

        for feature in self.features:
            categories.add(feature.category)
            maturities.add(feature.maturity)
            tags.update(feature.tags)

        return {
            "categories": sorted(categories),
            "tags": sorted(tags),
            "maturity": sorted(maturities),
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "namespace": self.namespace,
            "version": self.version,
            "description": self.description,
            "features": [feature.to_dict() for feature in self.features],
            "facets": self.build_facets(),
            "metadata": self.metadata,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# 🗄️ STORAGE BACKEND - HYBRID JSON + SQLite
# ═══════════════════════════════════════════════════════════════════════════════

class StorageBackend:
    """Hybrid storage: SQLite for queries + JSON for backup"""
    
    def __init__(self, db_path: str = ":memory:", json_path: Optional[str] = None):
        self.db_path = db_path
        self.json_path = json_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.lock = threading.RLock()
        self._init_database()
    
    def _init_database(self):
        """Initialize database schema"""
        with self.lock:
            cursor = self.conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS registry (
                    id TEXT PRIMARY KEY,
                    namespace TEXT NOT NULL,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    version TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    data TEXT NOT NULL,
                    UNIQUE(namespace, name, version)
                )
            """)
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS registry_facets (
                    entry_id TEXT NOT NULL,
                    facet_key TEXT NOT NULL,
                    facet_value TEXT NOT NULL,
                    FOREIGN KEY(entry_id) REFERENCES registry(id)
                )
                """
            )
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_namespace ON registry(namespace)
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_type ON registry(type)
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_status ON registry(status)
            """)
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_facets_key_value
                ON registry_facets(facet_key, facet_value)
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_facets_entry
                ON registry_facets(entry_id)
                """
            )
            self.conn.commit()

    @staticmethod
    def _extract_facets(entry: "RegistryEntry") -> Dict[str, List[str]]:
        """Safely extract facets from an entry config/metadata."""
        facets: Dict[str, List[str]] = {}
        for source in (entry.config.get("facets"), entry.metadata.get("facets")):
            if not isinstance(source, dict):
                continue
            for key, value in source.items():
                if value is None:
                    continue
                if isinstance(value, str):
                    normalized = [value]
                elif isinstance(value, list):
                    normalized = [v for v in value if isinstance(v, str)]
                else:
                    continue
                if not normalized:
                    continue
                if key not in facets:
                    facets[key] = []
                facets[key].extend(normalized)
        return facets

    def _persist_facets(self, entry: "RegistryEntry", cursor: sqlite3.Cursor):
        """Persist flattened facets for accelerated search."""
        facets = self._extract_facets(entry)
        cursor.execute("DELETE FROM registry_facets WHERE entry_id = ?", (entry.id,))
        for key, values in facets.items():
            for value in values:
                cursor.execute(
                    "INSERT INTO registry_facets (entry_id, facet_key, facet_value) VALUES (?, ?, ?)",
                    (entry.id, key, value),
                )
    
    def save(self, entry: RegistryEntry):
        """Save entry to storage"""
        with self.lock:
            cursor = self.conn.cursor()
            data = json.dumps(entry.to_dict())
            cursor.execute("""
                INSERT OR REPLACE INTO registry 
                (id, namespace, name, type, version, status, created_at, updated_at, data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                entry.id,
                entry.namespace,
                entry.name,
                entry.type.value,
                entry.version,
                entry.status.value,
                entry.created_at.isoformat(),
                entry.updated_at.isoformat(),
                data
            ))
            self._persist_facets(entry, cursor)
            self.conn.commit()
    
    def load(self, entry_id: str) -> Optional[Dict[str, Any]]:
        """Load entry by ID"""
        with self.lock:
            cursor = self.conn.cursor()
            cursor.execute("SELECT data FROM registry WHERE id = ?", (entry_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
            return None
    
    def search(self, **filters) -> List[Dict[str, Any]]:
        """Search entries with filters"""
        with self.lock:
            cursor = self.conn.cursor()
            query = "SELECT DISTINCT r.data FROM registry r"
            params: List[Any] = []
            conditions: List[str] = ["1=1"]

            namespace = filters.get("namespace")
            if namespace:
                conditions.append("r.namespace = ?")
                params.append(namespace)

            entry_type = filters.get("type")
            if entry_type:
                conditions.append("r.type = ?")
                params.append(entry_type.value if hasattr(entry_type, "value") else entry_type)

            status = filters.get("status")
            if status:
                conditions.append("r.status = ?")
                params.append(status.value if hasattr(status, "value") else status)

            facet_filters = filters.get("facets")
            if facet_filters:
                if not isinstance(facet_filters, dict):
                    raise ValueError("facets filter must be a dictionary")
                for key, raw_values in facet_filters.items():
                    values = raw_values if isinstance(raw_values, list) else [raw_values]
                    values = [v for v in values if v is not None]
                    if not values:
                        continue
                    placeholders = ",".join(["?"] * len(values))
                    conditions.append(
                        f"EXISTS (SELECT 1 FROM registry_facets f WHERE f.entry_id = r.id AND f.facet_key = ? AND f.facet_value IN ({placeholders}))"
                    )
                    params.append(key)
                    params.extend(values)

            query += " WHERE " + " AND ".join(conditions)
            cursor.execute(query, params)
            return [json.loads(row[0]) for row in cursor.fetchall()]
    
    def delete(self, entry_id: str) -> bool:
        """Delete entry"""
        with self.lock:
            cursor = self.conn.cursor()
            cursor.execute("DELETE FROM registry_facets WHERE entry_id = ?", (entry_id,))
            cursor.execute("DELETE FROM registry WHERE id = ?", (entry_id,))
            self.conn.commit()
            return cursor.rowcount > 0
    
    def count(self, **filters) -> int:
        """Count entries matching filters"""
        with self.lock:
            cursor = self.conn.cursor()
            query = "SELECT COUNT(*) FROM registry WHERE 1=1"
            params = []
            
            if 'namespace' in filters:
                query += " AND namespace = ?"
                params.append(filters['namespace'])
            if 'type' in filters:
                query += " AND type = ?"
                params.append(filters['type'])
            
            cursor.execute(query, params)
            return cursor.fetchone()[0]
    
    def export_json(self, path: str):
        """Export all entries to JSON"""
        with self.lock:
            cursor = self.conn.cursor()
            cursor.execute("SELECT data FROM registry")
            entries = [json.loads(row[0]) for row in cursor.fetchall()]
            with open(path, 'w') as f:
                json.dump(entries, f, indent=2)


# ═══════════════════════════════════════════════════════════════════════════════
# 🏛️ HYPER REGISTRY - MAIN ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class HyperRegistry:
    """
    Advanced Dynamic Universal Hyper Registry
    
    Central registry for all system components with:
    - GEFS scoring
    - Dependency resolution
    - Conflict detection
    - Version management
    - Real-time queries
    """
    
    def __init__(self, storage_path: Optional[str] = None):
        self.storage_path = storage_path or ":memory:"
        self.storage = StorageBackend(self.storage_path)
        self.hooks: Dict[str, List[Callable]] = {
            'before_register': [],
            'after_register': [],
            'before_update': [],
            'after_update': [],
            'before_delete': [],
            'after_delete': []
        }
        self.cache: Dict[str, RegistryEntry] = {}
        self.stats = {
            'total_registered': 0,
            'total_active': 0,
            'total_queries': 0,
            'avg_query_time': 0.0
        }
    
    def register(self, entry: RegistryEntry) -> bool:
        """Register new entry"""
        # Validate
        errors = entry.validate()
        if errors:
            raise ValueError(f"Validation errors: {', '.join(errors)}")
        
        # Check conflicts
        if self._has_conflicts(entry):
            raise ValueError(f"Entry conflicts with existing entries")
        
        # Run hooks
        self._run_hooks('before_register', entry)
        
        # Save
        entry.status = EntryStatus.REGISTERED
        entry.updated_at = datetime.now()
        self.storage.save(entry)
        self.cache[entry.id] = entry
        
        # Update stats
        self.stats['total_registered'] += 1
        
        # Run hooks
        self._run_hooks('after_register', entry)
        
        return True
    
    def get(self, entry_id: str) -> Optional[RegistryEntry]:
        """Get entry by ID"""
        # Check cache
        if entry_id in self.cache:
            return self.cache[entry_id]
        
        # Load from storage
        start = time.time()
        data = self.storage.load(entry_id)
        self.stats['total_queries'] += 1
        self.stats['avg_query_time'] = (
            (self.stats['avg_query_time'] * (self.stats['total_queries'] - 1) + 
             (time.time() - start)) / self.stats['total_queries']
        )
        
        if data:
            entry = self._dict_to_entry(data)
            self.cache[entry_id] = entry
            return entry
        return None
    
    def search(self, **filters) -> List[RegistryEntry]:
        """Search entries"""
        start = time.time()
        results = self.storage.search(**filters)
        self.stats['total_queries'] += 1
        self.stats['avg_query_time'] = (
            (self.stats['avg_query_time'] * (self.stats['total_queries'] - 1) + 
             (time.time() - start)) / self.stats['total_queries']
        )
        
        return [self._dict_to_entry(data) for data in results]
    
    def update(self, entry: RegistryEntry) -> bool:
        """Update existing entry"""
        if not self.get(entry.id):
            raise ValueError(f"Entry {entry.id} not found")
        
        self._run_hooks('before_update', entry)
        
        entry.updated_at = datetime.now()
        self.storage.save(entry)
        self.cache[entry.id] = entry
        
        self._run_hooks('after_update', entry)
        return True
    
    def delete(self, entry_id: str) -> bool:
        """Delete entry"""
        entry = self.get(entry_id)
        if not entry:
            return False
        
        self._run_hooks('before_delete', entry)
        
        result = self.storage.delete(entry_id)
        if result and entry_id in self.cache:
            del self.cache[entry_id]
        
        self._run_hooks('after_delete', entry)
        return result
    
    def resolve_dependencies(self, entry: RegistryEntry) -> List[RegistryEntry]:
        """Resolve all dependencies for entry"""
        resolved = []
        for dep_id in entry.dependencies:
            dep = self.get(dep_id)
            if dep:
                resolved.append(dep)
                # Recursive resolution
                resolved.extend(self.resolve_dependencies(dep))
        return resolved
    
    def _has_conflicts(self, entry: RegistryEntry) -> bool:
        """Check if entry conflicts with existing entries"""
        for conflict_id in entry.conflicts:
            if self.get(conflict_id):
                return True
        return False
    
    def _dict_to_entry(self, data: Dict[str, Any]) -> RegistryEntry:
        """Convert dict to RegistryEntry"""
        gefs_data = data.get('gefs_score', {})
        gefs_score = GEFSScore(**gefs_data) if gefs_data else GEFSScore()
        
        return RegistryEntry(
            id=data['id'],
            name=data['name'],
            type=EntryType(data['type']),
            namespace=data['namespace'],
            version=data['version'],
            description=data.get('description', ''),
            author=data.get('author', ''),
            tags=data.get('tags', []),
            path=data.get('path'),
            url=data.get('url'),
            checksum=data.get('checksum'),
            dependencies=data.get('dependencies', []),
            conflicts=data.get('conflicts', []),
            status=EntryStatus(data.get('status', 'registered')),
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at']),
            gefs_score=gefs_score,
            config=data.get('config', {}),
            metadata=data.get('metadata', {})
        )
    
    def _run_hooks(self, hook_name: str, entry: RegistryEntry):
        """Run registered hooks"""
        for hook in self.hooks.get(hook_name, []):
            hook(entry)
    
    def add_hook(self, hook_name: str, callback: Callable):
        """Add hook callback"""
        if hook_name in self.hooks:
            self.hooks[hook_name].append(callback)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get registry statistics"""
        return {
            **self.stats,
            'total_cached': len(self.cache),
            'storage_count': self.storage.count()
        }

    def register_subregistry(
        self,
        name: str,
        namespace: str,
        version: str = "1.0.0",
        description: str = "",
        owner: str = "NEXUSPRO",
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> RegistryEntry:
        """Convenience helper to register a subregistry entry."""
        entry = RegistryEntry(
            id=f"subregistry-{namespace}:{name}",
            name=name,
            type=EntryType.SUBREGISTRY,
            namespace=namespace,
            version=version,
            description=description or "Subregistry container for grouped artifacts",
            author=owner,
            tags=tags or ["subregistry", "registry"],
            metadata={
                "category": "subregistry",
                "owner": owner,
                **(metadata or {}),
            },
        )

        self.register(entry)
        return entry

    def register_feature_layer(
        self,
        layer: FeatureLayer,
        owner: str = "NEXUSPRO",
        tags: Optional[List[str]] = None,
    ) -> RegistryEntry:
        """Register a feature layer as a first-class registry entry."""

        errors = layer.validate()
        if errors:
            raise ValueError(f"Invalid feature layer: {errors}")

        def _merge_facets(
            base: Dict[str, List[str]], derived: Dict[str, List[str]]
        ) -> Dict[str, List[str]]:
            """Merge explicit layer facets with derived ones, preserving order and deduping."""

            def _normalize(values: Any) -> List[str]:
                if values is None:
                    return []
                if isinstance(values, str):
                    return [values]
                if isinstance(values, list):
                    return [v for v in values if isinstance(v, str)]
                return []

            merged: Dict[str, List[str]] = {}
            for key in set(base.keys()) | set(derived.keys()):
                ordered: List[str] = []
                seen = set()
                for source in (base.get(key), derived.get(key)):
                    for item in _normalize(source):
                        if item in seen:
                            continue
                        seen.add(item)
                        ordered.append(item)
                if ordered:
                    merged[key] = ordered
            return merged

        explicit_facets = layer.facets or {}
        facets = _merge_facets(explicit_facets, layer.build_facets())
        entry = RegistryEntry(
            id=f"feature-layer-{layer.namespace}:{layer.id}",
            name=layer.name,
            type=EntryType.FEATURE_LAYER,
            namespace=layer.namespace,
            version=layer.version,
            description=layer.description or "Feature layer for classification and facet navigation",
            author=owner,
            tags=tags or ["feature-layer", "classification", "facets"],
            metadata={
                "category": "feature_layer",
                "facets": facets,
                **(layer.metadata or {}),
            },
            config={
                "features": [feature.to_dict() for feature in layer.features],
                "facets": facets,
            },
        )

        self.register(entry)
        return entry


# ═══════════════════════════════════════════════════════════════════════════════
# 🧪 DEMO & TESTING
# ═══════════════════════════════════════════════════════════════════════════════

def demo_registry():
    """Demonstrate registry capabilities"""
    print("🌌 HYPER REGISTRY DEMO\n")
    
    # Create registry
    registry = HyperRegistry()
    
    # Create sample entry
    entry = RegistryEntry(
        id="plugin-001",
        name="Visual Theme Plugin",
        type=EntryType.PLUGIN,
        namespace="nexuspro.plugins",
        version="1.0.0",
        description="Advanced visual theme system",
        author="NEXUSPRO",
        tags=["visual", "theme", "ui"],
        gefs_score=GEFSScore(
            quality=95.0,
            reliability=98.0,
            performance=92.0,
            security=96.0,
            compatibility=94.0,
            documentation=97.0
        )
    )
    
    # Register
    registry.register(entry)
    print(f"✅ Registered: {entry.name}")
    print(f"   GEFS Score: {entry.gefs_score.overall:.2f}% ({entry.gefs_score.grade})")
    print()

    # Create CLI Layouts subregistry
    subregistry = registry.register_subregistry(
        name="CLI-Layouts",
        namespace="nexuspro.subregistries.cli",
        version="1.0.0",
        description="Dedicated subregistry for CLI/TUI layout templates and presets",
        tags=["cli", "tui", "layouts", "registry"],
        metadata={
            "artifact_type": "layout",
            "scope": "cli",
            "config_path": "config/subregistries/cli-layouts.json",
        },
    )
    print(f"✅ Registered subregistry: {subregistry.name} ({subregistry.namespace})")
    print()

    # Register a feature layer for classifications/facets
    feature_layer = FeatureLayer(
        id="core-classifications",
        name="Core Feature Layer",
        namespace="nexuspro.features.core",
        version="1.0.0",
        description="Baseline feature classifications for registry navigation",
        features=[
            FeatureFlag(id="perf", name="Performance", category="quality", maturity="ga", tags=["perf", "latency"], weight=1.0),
            FeatureFlag(id="security", name="Security", category="trust", maturity="ga", tags=["security", "zero-trust"], weight=1.0),
            FeatureFlag(id="ux", name="UX", category="experience", maturity="beta", tags=["ui", "ux", "visual"], weight=0.8),
        ],
        facets={"categories": ["quality", "trust"], "maturity": ["ga", "beta"]},
    )
    feature_entry = registry.register_feature_layer(feature_layer)
    print(f"✅ Registered feature layer: {feature_entry.name} ({feature_entry.namespace})")
    print()
    
    # Search
    results = registry.search(namespace="nexuspro.plugins")
    print(f"🔍 Found {len(results)} entries in namespace")
    print()
    
    # Stats
    stats = registry.get_stats()
    print("📊 Registry Statistics:")
    for key, value in stats.items():
        print(f"   {key}: {value}")


if __name__ == "__main__":
    demo_registry()
