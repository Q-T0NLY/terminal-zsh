#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                    🌌 ADVANCED GRAPH ENGINE WITH GLOWING SPARKLINES 🌌                                                                     ║
║                                  REAL-TIME DATA VISUALIZATION & NETWORK TOPOLOGY SYSTEM                                                                   ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║  [📊] MODULE: Graph & Visualization Engine                                                                                                                ║
║  [🎯] PURPOSE: Advanced sparklines, network graphs, dependency visualization                                                                              ║
║  [⚡] FEATURES: Glowing lines, real-time updates, interactive charts                                                                                      ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import math
import random
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass, field
from collections import deque
import time


# ═══════════════════════════════════════════════════════════════════════════════
# ✨ GLOWING SPARKLINES - ADVANCED LINE CHARTS FOR CLI
# ═══════════════════════════════════════════════════════════════════════════════

class GlowingSparkline:
    """Advanced sparkline with glowing effect"""
    
    # Unicode block characters for smooth rendering
    BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
    DOTS = ['⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷', '⣿']
    
    @staticmethod
    def render(data: List[float], width: int = 60, height: int = 10,
               glow: bool = True, style: str = 'blocks',
               gradient_colors: Optional[List[str]] = None) -> str:
        """
        Render glowing sparkline chart
        
        Args:
            data: List of numeric values
            width: Chart width in characters
            height: Chart height in lines
            glow: Enable glowing effect
            style: 'blocks', 'dots', 'lines', 'filled'
            gradient_colors: List of hex colors for gradient
        """
        if not data:
            return "No data to display"
        
        # Normalize data
        min_val = min(data)
        max_val = max(data)
        range_val = max_val - min_val if max_val != min_val else 1
        normalized = [(v - min_val) / range_val for v in data]
        
        # Sample data to fit width
        if len(data) > width:
            step = len(data) / width
            sampled = [data[int(i * step)] for i in range(width)]
            normalized = [(v - min_val) / range_val for v in sampled]
        else:
            sampled = data
        
        # Choose characters
        chars = GlowingSparkline.BLOCKS if style == 'blocks' else GlowingSparkline.DOTS
        
        if style == 'filled':
            return GlowingSparkline._render_filled(normalized, width, height, 
                                                   gradient_colors, glow)
        else:
            return GlowingSparkline._render_line(normalized, chars, 
                                                 gradient_colors, glow)
    
    @staticmethod
    def _render_line(normalized: List[float], chars: List[str],
                     gradient_colors: Optional[List[str]], glow: bool) -> str:
        """Render single-line sparkline"""
        result = []
        for i, value in enumerate(normalized):
            idx = int(value * (len(chars) - 1))
            char = chars[min(idx, len(chars) - 1)]
            
            if gradient_colors:
                # Apply gradient color
                color_idx = int((i / max(1, len(normalized) - 1)) * (len(gradient_colors) - 1))
                from core.visual_engine import GradientEngine
                r, g, b = GradientEngine.hex_to_rgb(gradient_colors[color_idx])
                ansi_color = GradientEngine.rgb_to_ansi(r, g, b)
                
                if glow:
                    # Add glow effect with brightness
                    brightness = int(255 * value)
                    result.append(f"{ansi_color}\033[1m{char}\033[0m")
                else:
                    result.append(f"{ansi_color}{char}\033[0m")
            else:
                result.append(char)
        
        return ''.join(result)
    
    @staticmethod
    def _render_filled(normalized: List[float], width: int, height: int,
                      gradient_colors: Optional[List[str]], glow: bool) -> str:
        """Render filled multi-line sparkline"""
        grid = [[' ' for _ in range(width)] for _ in range(height)]
        
        # Fill grid
        for x, value in enumerate(normalized[:width]):
            fill_height = int(value * height)
            for y in range(height):
                if height - y - 1 < fill_height:
                    grid[y][x] = '█'
        
        # Apply colors and glow
        lines = []
        for row in grid:
            line = ''.join(row)
            if gradient_colors and glow:
                from core.visual_engine import GradientEngine
                line = GradientEngine.create_gradient(line, gradient_colors)
                line = f"\033[1m{line}\033[0m"  # Bold for glow
            lines.append(line)
        
        return '\n'.join(lines)
    
    @staticmethod
    def render_multi(datasets: Dict[str, List[float]], width: int = 60,
                    colors: Optional[Dict[str, List[str]]] = None) -> str:
        """Render multiple sparklines stacked"""
        lines = []
        for name, data in datasets.items():
            label = f"{name:20s} │ "
            gradient = colors.get(name) if colors else None
            sparkline = GlowingSparkline.render(data, width - len(label), 
                                               height=1, gradient_colors=gradient)
            lines.append(label + sparkline)
        return '\n'.join(lines)


# ═══════════════════════════════════════════════════════════════════════════════
# 🕸️ NETWORK GRAPH VISUALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class GraphNode:
    """Node in dependency/network graph"""
    id: str
    label: str
    x: float = 0.0
    y: float = 0.0
    vx: float = 0.0
    vy: float = 0.0
    color: str = '#00D4FF'
    size: int = 3
    metadata: Dict = field(default_factory=dict)


@dataclass
class GraphEdge:
    """Edge connecting two nodes"""
    source: str
    target: str
    weight: float = 1.0
    label: str = ""
    color: str = '#7B61FF'
    bidirectional: bool = False


class NetworkGraph:
    """Force-directed network graph for dependency visualization"""
    
    def __init__(self, width: int = 80, height: int = 40):
        self.width = width
        self.height = height
        self.nodes: Dict[str, GraphNode] = {}
        self.edges: List[GraphEdge] = []
        self.iterations = 0
    
    def add_node(self, node: GraphNode):
        """Add node to graph"""
        # Random initial position
        if node.x == 0.0 and node.y == 0.0:
            node.x = random.uniform(0, self.width)
            node.y = random.uniform(0, self.height)
        self.nodes[node.id] = node
    
    def add_edge(self, edge: GraphEdge):
        """Add edge to graph"""
        if edge.source in self.nodes and edge.target in self.nodes:
            self.edges.append(edge)
    
    def layout(self, iterations: int = 100, k: float = 0.5):
        """Apply force-directed layout algorithm"""
        for _ in range(iterations):
            # Repulsive forces between all nodes
            for node1 in self.nodes.values():
                node1.vx = 0
                node1.vy = 0
                for node2 in self.nodes.values():
                    if node1.id != node2.id:
                        dx = node1.x - node2.x
                        dy = node1.y - node2.y
                        dist = math.sqrt(dx*dx + dy*dy) or 1
                        # Repulsion
                        force = k * k / dist
                        node1.vx += (dx / dist) * force
                        node1.vy += (dy / dist) * force
            
            # Attractive forces for connected nodes
            for edge in self.edges:
                source = self.nodes[edge.source]
                target = self.nodes[edge.target]
                dx = target.x - source.x
                dy = target.y - source.y
                dist = math.sqrt(dx*dx + dy*dy) or 1
                # Attraction
                force = dist * dist / k
                source.vx += (dx / dist) * force * 0.5
                source.vy += (dy / dist) * force * 0.5
                target.vx -= (dx / dist) * force * 0.5
                target.vy -= (dy / dist) * force * 0.5
            
            # Update positions
            for node in self.nodes.values():
                node.x += node.vx * 0.1
                node.y += node.vy * 0.1
                # Keep in bounds
                node.x = max(0, min(self.width, node.x))
                node.y = max(0, min(self.height, node.y))
        
        self.iterations += iterations
    
    def render(self, show_labels: bool = True, glow: bool = True) -> str:
        """Render graph to ASCII"""
        grid = [[' ' for _ in range(self.width)] for _ in range(self.height)]
        
        # Draw edges first
        from core.visual_engine import GradientEngine
        for edge in self.edges:
            source = self.nodes[edge.source]
            target = self.nodes[edge.target]
            self._draw_line(grid, 
                          int(source.x), int(source.y),
                          int(target.x), int(target.y),
                          '─' if edge.bidirectional else '→')
        
        # Draw nodes
        for node in self.nodes.values():
            x, y = int(node.x), int(node.y)
            if 0 <= x < self.width and 0 <= y < self.height:
                grid[y][x] = '●'
                
                # Add label
                if show_labels and len(node.label) > 0:
                    label = node.label[:10]
                    for i, char in enumerate(label):
                        lx = x + i + 1
                        if lx < self.width:
                            grid[y][lx] = char
        
        # Render with colors
        lines = []
        for row in grid:
            line = ''.join(row)
            if glow:
                from core.visual_engine import ColorPalette
                line = GradientEngine.create_gradient(
                    line, ColorPalette.QUANTUM_NEURAL.value
                )
            lines.append(line)
        
        return '\n'.join(lines)
    
    def _draw_line(self, grid: List[List[str]], x0: int, y0: int, 
                   x1: int, y1: int, char: str = '─'):
        """Draw line using Bresenham's algorithm"""
        dx = abs(x1 - x0)
        dy = abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy
        
        while True:
            if 0 <= x0 < len(grid[0]) and 0 <= y0 < len(grid):
                if grid[y0][x0] == ' ':
                    grid[y0][x0] = char
            
            if x0 == x1 and y0 == y1:
                break
            
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x0 += sx
            if e2 < dx:
                err += dx
                y0 += sy
    
    def get_stats(self) -> Dict:
        """Get graph statistics"""
        return {
            'nodes': len(self.nodes),
            'edges': len(self.edges),
            'iterations': self.iterations,
            'avg_degree': len(self.edges) * 2 / max(1, len(self.nodes))
        }


# ═══════════════════════════════════════════════════════════════════════════════
# 📊 REAL-TIME CHART ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class RealTimeChart:
    """Real-time updating charts with history"""
    
    def __init__(self, max_points: int = 100):
        self.data: Dict[str, deque] = {}
        self.max_points = max_points
        self.timestamps: deque = deque(maxlen=max_points)
    
    def add_series(self, name: str):
        """Add a new data series"""
        self.data[name] = deque(maxlen=self.max_points)
    
    def update(self, series: str, value: float):
        """Update series with new value"""
        if series not in self.data:
            self.add_series(series)
        self.data[series].append(value)
        
        # Update timestamp
        if len(self.timestamps) == 0 or len(self.data[series]) > len(self.timestamps):
            self.timestamps.append(time.time())
    
    def render(self, width: int = 60, height: int = 10, glow: bool = True) -> str:
        """Render all series as stacked sparklines"""
        if not self.data:
            return "No data series"
        
        from core.visual_engine import ColorPalette
        colors_map = {
            name: ColorPalette.QUANTUM_NEURAL.value 
            for name in self.data.keys()
        }
        
        datasets = {name: list(series) for name, series in self.data.items()}
        return GlowingSparkline.render_multi(datasets, width, colors_map)
    
    def get_latest(self, series: str) -> Optional[float]:
        """Get latest value for series"""
        if series in self.data and len(self.data[series]) > 0:
            return self.data[series][-1]
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 DEMO
# ═══════════════════════════════════════════════════════════════════════════════

def demo_graph_engine():
    """Demonstrate graph engine capabilities"""
    from core.visual_engine import QuantumVisualEngine, ColorPalette
    
    engine = QuantumVisualEngine()
    print(engine.render_header("🌌 ADVANCED GRAPH ENGINE DEMO"))
    print()
    
    # Demo 1: Glowing Sparklines
    print(engine.render_panel("📊 Glowing Sparklines",
        GlowingSparkline.render(
            [random.random() * 100 for _ in range(60)],
            width=60, height=8, glow=True,
            gradient_colors=ColorPalette.QUANTUM_NEURAL.value
        )
    ))
    print()
    
    # Demo 2: Multi-series sparklines
    print(engine.render_panel("📈 Multi-Series Data",
        GlowingSparkline.render_multi({
            'CPU Usage': [random.uniform(30, 90) for _ in range(40)],
            'Memory': [random.uniform(40, 85) for _ in range(40)],
            'Network': [random.uniform(10, 70) for _ in range(40)]
        }, width=60)
    ))
    print()
    
    # Demo 3: Network Graph
    graph = NetworkGraph(width=60, height=20)
    for i in range(8):
        graph.add_node(GraphNode(
            id=f"node{i}",
            label=f"N{i}",
            x=random.uniform(10, 50),
            y=random.uniform(5, 15)
        ))
    
    # Add edges
    for i in range(7):
        graph.add_edge(GraphEdge(
            source=f"node{i}",
            target=f"node{i+1}"
        ))
    graph.add_edge(GraphEdge(source="node0", target="node7"))
    
    graph.layout(iterations=50)
    
    print(engine.render_panel("🕸️ Network Topology", graph.render(show_labels=True)))
    print()
    
    # Stats
    stats = graph.get_stats()
    print(engine.render_panel("📊 Graph Statistics",
        '\n'.join([f"{k}: {v}" for k, v in stats.items()])
    ))


if __name__ == "__main__":
    demo_graph_engine()
