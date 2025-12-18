#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                    🧩 ADVANCED DYNAMIC PLUGIN ECOSYSTEM 🧩                                                                                 ║
║                                  VISUAL PLUGIN DISCOVERY, LOADING & HOT-RELOAD SYSTEM                                                                     ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║  [🔌] MODULE: Plugin Ecosystem                                                                                                                            ║
║  [🎯] PURPOSE: Dynamic plugin loading, hot-reload, visual feedback                                                                                        ║
║  [⚡] FEATURES: Auto-discovery, dependency injection, sandboxing                                                                                          ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import importlib
import importlib.util
import inspect
from pathlib import Path
from typing import Dict, List, Optional, Callable, Any, Type
from dataclasses import dataclass, field
from enum import Enum
import threading
import time
import hashlib


# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 PLUGIN METADATA & LIFECYCLE
# ═══════════════════════════════════════════════════════════════════════════════

class PluginStatus(Enum):
    """Plugin lifecycle status"""
    DISCOVERED = "discovered"
    LOADING = "loading"
    LOADED = "loaded"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    UNLOADED = "unloaded"


@dataclass
class PluginMetadata:
    """Plugin metadata and manifest"""
    id: str
    name: str
    version: str
    author: str = ""
    description: str = ""
    tags: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    provides: List[str] = field(default_factory=list)
    entry_point: str = "plugin_main"
    config_schema: Dict = field(default_factory=dict)
    visual_icon: str = "🔌"
    color: str = "#00D4FF"


@dataclass
class PluginContext:
    """Runtime plugin context"""
    id: str
    metadata: PluginMetadata
    status: PluginStatus
    module: Any = None
    instance: Any = None
    path: Path = None
    checksum: str = ""
    load_time: float = 0.0
    last_reload: float = 0.0
    error_message: str = ""
    hooks: Dict[str, List[Callable]] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════════
# 🔌 PLUGIN BASE CLASS
# ═══════════════════════════════════════════════════════════════════════════════

class PluginBase:
    """Base class for all plugins"""
    
    def __init__(self, registry: Any = None):
        self.registry = registry
        self.config: Dict = {}
        self.enabled: bool = True
    
    def get_metadata(self) -> PluginMetadata:
        """Return plugin metadata (override in subclass)"""
        return PluginMetadata(
            id="base_plugin",
            name="Base Plugin",
            version="1.0.0"
        )
    
    def on_load(self):
        """Called when plugin is loaded"""
        pass
    
    def on_unload(self):
        """Called before plugin is unloaded"""
        pass
    
    def on_enable(self):
        """Called when plugin is enabled"""
        pass
    
    def on_disable(self):
        """Called when plugin is disabled"""
        pass
    
    def execute(self, *args, **kwargs) -> Any:
        """Main plugin execution (override in subclass)"""
        pass


# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 PLUGIN LOADER
# ═══════════════════════════════════════════════════════════════════════════════

class PluginLoader:
    """Load and manage plugins"""
    
    def __init__(self, plugin_dirs: List[Path]):
        self.plugin_dirs = [Path(d) for d in plugin_dirs]
        self.plugins: Dict[str, PluginContext] = {}
        self.lock = threading.RLock()
    
    def discover(self) -> List[PluginMetadata]:
        """Discover available plugins"""
        discovered = []
        
        for plugin_dir in self.plugin_dirs:
            if not plugin_dir.exists():
                continue
            
            for item in plugin_dir.iterdir():
                if item.is_file() and item.suffix == '.py' and not item.name.startswith('_'):
                    metadata = self._extract_metadata(item)
                    if metadata:
                        discovered.append(metadata)
                elif item.is_dir() and (item / '__init__.py').exists():
                    metadata = self._extract_metadata(item / '__init__.py')
                    if metadata:
                        discovered.append(metadata)
        
        return discovered
    
    def _extract_metadata(self, path: Path) -> Optional[PluginMetadata]:
        """Extract plugin metadata from file"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for PLUGIN_METADATA constant
            namespace = {}
            exec(content, namespace)
            
            if 'PLUGIN_METADATA' in namespace:
                meta_dict = namespace['PLUGIN_METADATA']
                return PluginMetadata(**meta_dict)
            
            # Fallback: use filename as ID
            return PluginMetadata(
                id=path.stem,
                name=path.stem.replace('_', ' ').title(),
                version="0.0.1"
            )
        except Exception as e:
            return None
    
    def load(self, plugin_id: str, path: Path) -> bool:
        """Load a plugin"""
        with self.lock:
            try:
                # Calculate checksum
                checksum = self._calculate_checksum(path)
                
                # Import module
                spec = importlib.util.spec_from_file_location(plugin_id, path)
                if not spec or not spec.loader:
                    return False
                
                module = importlib.util.module_from_spec(spec)
                sys.modules[plugin_id] = module
                
                start_time = time.time()
                spec.loader.exec_module(module)
                load_time = time.time() - start_time
                
                # Extract metadata
                metadata = getattr(module, 'PLUGIN_METADATA', None)
                if isinstance(metadata, dict):
                    metadata = PluginMetadata(**metadata)
                elif not isinstance(metadata, PluginMetadata):
                    metadata = PluginMetadata(id=plugin_id, name=plugin_id, version="1.0.0")
                
                # Create instance
                plugin_class = None
                for name, obj in inspect.getmembers(module):
                    if inspect.isclass(obj) and issubclass(obj, PluginBase) and obj is not PluginBase:
                        plugin_class = obj
                        break
                
                instance = plugin_class() if plugin_class else None
                
                # Create context
                context = PluginContext(
                    id=plugin_id,
                    metadata=metadata,
                    status=PluginStatus.LOADED,
                    module=module,
                    instance=instance,
                    path=path,
                    checksum=checksum,
                    load_time=load_time
                )
                
                self.plugins[plugin_id] = context
                
                # Call on_load hook
                if instance and hasattr(instance, 'on_load'):
                    instance.on_load()
                
                return True
                
            except Exception as e:
                if plugin_id in self.plugins:
                    self.plugins[plugin_id].status = PluginStatus.ERROR
                    self.plugins[plugin_id].error_message = str(e)
                return False
    
    def unload(self, plugin_id: str) -> bool:
        """Unload a plugin"""
        with self.lock:
            if plugin_id not in self.plugins:
                return False
            
            context = self.plugins[plugin_id]
            
            # Call on_unload hook
            if context.instance and hasattr(context.instance, 'on_unload'):
                try:
                    context.instance.on_unload()
                except Exception:
                    pass
            
            # Remove from sys.modules
            if plugin_id in sys.modules:
                del sys.modules[plugin_id]
            
            context.status = PluginStatus.UNLOADED
            del self.plugins[plugin_id]
            
            return True
    
    def reload(self, plugin_id: str) -> bool:
        """Hot-reload a plugin"""
        with self.lock:
            if plugin_id not in self.plugins:
                return False
            
            context = self.plugins[plugin_id]
            path = context.path
            
            # Unload and reload
            self.unload(plugin_id)
            success = self.load(plugin_id, path)
            
            if success:
                self.plugins[plugin_id].last_reload = time.time()
            
            return success
    
    def _calculate_checksum(self, path: Path) -> str:
        """Calculate SHA-256 checksum"""
        sha256 = hashlib.sha256()
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b''):
                sha256.update(chunk)
        return sha256.hexdigest()
    
    def get_plugin(self, plugin_id: str) -> Optional[PluginContext]:
        """Get plugin context"""
        return self.plugins.get(plugin_id)
    
    def list_plugins(self) -> List[PluginContext]:
        """List all loaded plugins"""
        return list(self.plugins.values())


# ═══════════════════════════════════════════════════════════════════════════════
# 🎨 VISUAL PLUGIN MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class VisualPluginManager:
    """Plugin manager with visual feedback"""
    
    def __init__(self, loader: PluginLoader):
        self.loader = loader
        from core.visual_engine import QuantumVisualEngine
        self.visual = QuantumVisualEngine()
    
    def render_plugin_list(self) -> str:
        """Render visual plugin list"""
        plugins = self.loader.list_plugins()
        
        if not plugins:
            return self.visual.render_panel("🔌 Plugins", "No plugins loaded")
        
        lines = []
        for plugin in plugins:
            status_icon = {
                PluginStatus.LOADED: "✅",
                PluginStatus.ACTIVE: "🟢",
                PluginStatus.INACTIVE: "⚪",
                PluginStatus.ERROR: "❌",
                PluginStatus.LOADING: "⏳"
            }.get(plugin.status, "❓")
            
            meta = plugin.metadata
            line = f"{status_icon} {meta.visual_icon} {meta.name:20s} v{meta.version:10s} {plugin.status.value}"
            lines.append(line)
        
        return self.visual.render_panel("🔌 Loaded Plugins", '\n'.join(lines))
    
    def render_plugin_details(self, plugin_id: str) -> str:
        """Render detailed plugin view"""
        plugin = self.loader.get_plugin(plugin_id)
        if not plugin:
            return self.visual.render_panel("Error", f"Plugin {plugin_id} not found")
        
        meta = plugin.metadata
        details = [
            f"ID: {meta.id}",
            f"Name: {meta.name}",
            f"Version: {meta.version}",
            f"Author: {meta.author}",
            f"Description: {meta.description}",
            f"Status: {plugin.status.value}",
            f"Load Time: {plugin.load_time:.3f}s",
            f"Dependencies: {', '.join(meta.dependencies) if meta.dependencies else 'None'}",
            f"Provides: {', '.join(meta.provides) if meta.provides else 'None'}",
        ]
        
        if plugin.error_message:
            details.append(f"\n❌ Error: {plugin.error_message}")
        
        return self.visual.render_panel(f"{meta.visual_icon} {meta.name}", '\n'.join(details))


# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 DEMO
# ═══════════════════════════════════════════════════════════════════════════════

def demo_plugin_ecosystem():
    """Demonstrate plugin ecosystem"""
    from core.visual_engine import QuantumVisualEngine
    
    engine = QuantumVisualEngine()
    print(engine.render_header("🧩 PLUGIN ECOSYSTEM DEMO"))
    print()
    
    # Create plugin directory
    plugin_dir = Path("/tmp/demo_plugins")
    plugin_dir.mkdir(exist_ok=True)
    
    # Create sample plugin
    sample_plugin = '''
PLUGIN_METADATA = {
    "id": "sample_plugin",
    "name": "Sample Plugin",
    "version": "1.0.0",
    "author": "Demo",
    "description": "A sample plugin for demonstration",
    "visual_icon": "⭐",
    "color": "#FFD700"
}

from core.plugin_ecosystem import PluginBase

class SamplePlugin(PluginBase):
    def on_load(self):
        print("Sample plugin loaded!")
    
    def execute(self):
        return "Hello from sample plugin!"
'''
    
    with open(plugin_dir / "sample_plugin.py", "w") as f:
        f.write(sample_plugin)
    
    # Initialize loader
    loader = PluginLoader([plugin_dir])
    
    # Discover plugins
    discovered = loader.discover()
    print(engine.render_panel("🔍 Discovery",
        f"Found {len(discovered)} plugin(s):\n" +
        '\n'.join([f"  • {p.name} v{p.version}" for p in discovered])
    ))
    print()
    
    # Load plugin
    if discovered:
        plugin = discovered[0]
        loader.load(plugin.id, plugin_dir / f"{plugin.id}.py")
    
    # Visual manager
    manager = VisualPluginManager(loader)
    print(manager.render_plugin_list())
    print()
    
    # Show details
    if loader.list_plugins():
        first_plugin = loader.list_plugins()[0]
        print(manager.render_plugin_details(first_plugin.id))


if __name__ == "__main__":
    demo_plugin_ecosystem()
