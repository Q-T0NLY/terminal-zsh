"""
Nexus AI Widget Library (minimal portable implementation)
"""
from dataclasses import dataclass
from typing import List, Dict, Any
import random

@dataclass
class Widget:
    id: str
    name: str
    width: int
    height: int
    refresh_rate: float = 1.0
    config: Dict[str, Any] = None

    def render(self) -> str:
        raise NotImplementedError

    def update(self) -> None:
        pass

class TelemetryWidget(Widget):
    def render(self) -> str:
        metrics = self._get_metrics()
        lines = [f"📊 {self.name}", "┌" + "─" * (self.width - 2) + "┐"]
        for name, value, max_val in metrics:
            bar_width = max(10, self.width - 20)
            filled = int(bar_width * value / max_val)
            bar = "█" * filled + "░" * (bar_width - filled)
            lines.append(f"│ {name:<8} {bar} {value:3.0f}% │")
        lines.append("└" + "─" * (self.width - 2) + "┘")
        return "\n".join(lines)

    def _get_metrics(self) -> List[tuple]:
        return [
            ("CPU", random.uniform(30, 95), 100),
            ("RAM", random.uniform(60, 92), 100),
            ("DISK", random.uniform(40, 85), 100),
            ("NET", random.uniform(70, 99), 100),
        ]

class AIProcessWidget(Widget):
    def render(self) -> str:
        processes = [
            ("Inference", "🧠", 42, "RUNNING"),
            ("Training", "⚡", 65, "ACTIVE"),
            ("Vision", "👁️", 28, "OPTIMAL"),
            ("Data", "📥", 18, "STABLE"),
        ]
        lines = [f"🤖 {self.name}", "┌" + "─" * (self.width - 2) + "┐"]
        for name, icon, cpu, status in processes:
            bar_width = max(10, self.width - 25)
            filled = int(bar_width * cpu / 100)
            bar = "█" * filled + "░" * (bar_width - filled)
            lines.append(f"│ {icon} {name:<10} {bar} {cpu:3.0f}% │")
            lines.append(f"│   └─ Status: {status:<15} │")
        lines.append("└" + "─" * (self.width - 2) + "┘")
        return "\n".join(lines)

class NetworkVisualizerWidget(Widget):
    def render(self) -> str:
        nodes = 8
        lines = [f"🌐 {self.name}", "┌" + "─" * (self.width - 2) + "┐"]
        lines.append("│ " + "  ".join([f"N{i+1}" for i in range(nodes)]) + " │")
        lines.append("│ " + "  ".join(["●" for _ in range(nodes)]) + " │")
        connections = ["│"]
        for i in range(nodes):
            connections.append("──" if i < nodes - 1 else "  ")
        connections.append("│")
        lines.append(''.join(connections))
        lines.append(f"│ Connected: {nodes} nodes | Latency: <12ms │")
        lines.append("└" + "─" * (self.width - 2) + "┘")
        return "\n".join(lines)
