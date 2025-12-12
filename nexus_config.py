"""
Nexus AI Configuration System (minimal)
"""
import json
import os
from dataclasses import dataclass, asdict, field
from typing import Dict, Any, List
from enum import Enum

class Theme(Enum):
    QUANTUM = "quantum"
    DARK = "dark"
    LIGHT = "light"
    MATRIX = "matrix"
    HOLO = "holo"

class LayoutMode(Enum):
    ADAPTIVE = "adaptive"
    FIXED = "fixed"
    FLOW = "flow"
    MASONRY = "masonry"

@dataclass
class DashboardConfig:
    width: int = 120
    height: int = 40
    theme: Theme = Theme.QUANTUM
    layout_mode: LayoutMode = LayoutMode.ADAPTIVE
    refresh_rate: float = 2.0
    animations: bool = True
    quantum_effects: bool = True
    sparkle_density: float = 0.1
    gradient_speed: float = 1.0
    default_widgets: List[str] = field(default_factory=lambda: [
        "telemetry_panel", "ai_process_monitor", "network_viz", "system_status"
    ])

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data['theme'] = self.theme.value
        data['layout_mode'] = self.layout_mode.value
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'DashboardConfig':
        data = data.copy()
        data['theme'] = Theme(data.get('theme', 'quantum'))
        data['layout_mode'] = LayoutMode(data.get('layout_mode', 'adaptive'))
        return cls(**data)

class ConfigManager:
    def __init__(self, config_path: str = "~/.nexus/config.json"):
        self.config_path = os.path.expanduser(config_path)
        self.config = self.load_config()

    def load_config(self) -> DashboardConfig:
        default_config = DashboardConfig()
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    data = json.load(f)
                    return DashboardConfig.from_dict(data)
        except Exception:
            pass
        return default_config

    def save_config(self) -> None:
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, 'w') as f:
            json.dump(self.config.to_dict(), f, indent=2)

    def update_config(self, **kwargs) -> None:
        for key, value in kwargs.items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)
        self.save_config()

    def get_widget_config(self, widget_id: str) -> Dict[str, Any]:
        widget_config_path = os.path.join(os.path.dirname(self.config_path), 'widgets', f"{widget_id}.json")
        try:
            if os.path.exists(widget_config_path):
                with open(widget_config_path, 'r') as f:
                    return json.load(f)
        except Exception:
            pass
        return {}

    def save_widget_config(self, widget_id: str, config: Dict[str, Any]) -> None:
        widget_dir = os.path.join(os.path.dirname(self.config_path), 'widgets')
        os.makedirs(widget_dir, exist_ok=True)
        widget_config_path = os.path.join(widget_dir, f"{widget_id}.json")
        with open(widget_config_path, 'w') as f:
            json.dump(config, f, indent=2)
