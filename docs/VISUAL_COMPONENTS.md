╭══════════════════════════════════════════════════════════════════════╮
║  ██████╗  ██████╗ ███╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗      ║
║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║      ║
║  ██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║  ██║█████╗  ███████║██║      ║
║  ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══╝  ██╔══██║██║      ║
║  ██████╔╝╚██████╔╝██║ ╚████║███████╗██████╔╝███████╗██║  ██║███████╗ ║
║  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ║
╰══════════════════════════════════════════════════════════════════════╯

# Visual Components Manifest

Purpose: centralize every visual element, component name, palette, glyph, animation frame,
and UI primitive referenced across the merged Nexus/Cosmos/Nova/Quantum scripts so the
dashboard designer can import or implement them later.

Sections:
- Color Palettes
- Glyph Sets & Icons
- Depth / Layer Characters
- Particle / FX Elements
- Animation Frames & Spinners
- UI Primitives (borders, buttons, sliders, panels)
- Menu Layouts & Sections
- Status Bar / Telemetry Elements
- Named Render/Engine Functions (for wiring)

---

## Color Palettes

- QTI_COLORS (Nord Modern Pro):
  - quantum_blue, quantum_purple, quantum_teal, quantum_orange
  - bg_dark, bg_medium, bg_light, fg_primary, fg_secondary
  - accent_success, accent_warning, accent_danger, accent_info
  - gradient1/2/3

- NEXUS_PALETTE (Holographic True HDR):
  - holo_cyan, holo_magenta, holo_yellow, holo_white, holo_black
  - quantum_1 .. quantum_7
  - neural_synapse/neural_axon/neural_dendrite/neural_signal
  - state_success/state_warning/state_error/state_info/state_neutral
  - bg_depth0 .. bg_depth4

- NOVA_COLORS (Industrial):
  - chrome, steel, graphite, obsidian
  - success, warning, error, info, neutral
  - primary/secondary/tertiary, accent
  - bg_dark/bg_medium/bg_light/bg_panel
  - data_1 .. data_5

- QNTI_COLORS (Unified Cosmos): includes quantum_1..7, neural colors, success/warning/error/info/neutral, bg layers

Notes: color values are in ANSI truecolor sequences (e.g., "38;2;R;G;B" / "48;2;R;G;B").

## Glyph Sets & Icons

- QTI_FX glyphs:
  - top_left/top_right/mid_left/mid_right/bot_left/bot_right
  - spinner, pulse, ripple
  - active/warning/critical/info icons (🟢, 🟡, 🔴, 🔵)
  - depth1..depth4
  - particle1/2/3

- HOLO_FX (Holographic):
  - depth0..depth15 (many depth unicode chars), quantum_flow, energy_wave, data_stream, neural_pulse
  - holo_corner_tl/tr/bl/br, holo_divider
  - btn_active/btn_inactive, btn_toggle_on/off, slider
  - bio_heart/brain/eye/shield

- NOVA_GLYPHS (Industrial): corner_tl/tr/bl/br, line_h/line_v/line_cross/line_t, check/x/bullet/arrow_right/triangle, progress blocks

- QNTI_ICONS / QNTI_ICONS[...]: system, cpu, ram, disk, network, quantum, particle, profile, migration, etc.

## Depth / Layer Characters

- Simple depth chars: '░', '▒', '▓', '█' (depth1..depth4)
- Extended 4D depth set: HOLO_FX depth0..depth15 (unicode geometric glyphs)
- Layered border elements: 3D corners, mid/bot border glyphs used for stacked borders

## Particle / FX Elements

- Particle emoji sets: 🟣 🔵 🟢 🟡 🟠 🔴 (quantum_flow, particle1..3)
- Energy/data emojis: 🌊 🌌 🌀 ✨ ⚡ 🔥 (energy_wave)
- Ripple/wave/pulse FX names: 'ripple', 'wave', 'neural', 'data', 'particle', 'particle explosion'
- Particle system properties referenced: velocity, gravity, drag, wall collision, color fade

## Animation Frames & Spinners

- Spinners: "◐ ◓ ◑ ◒", "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏", block progress frames
- Phases arrays: phases=("░▒▓█" ... ) and spinner arrays
- Loader frames and progress bar implementations: `quantum_loader`, `render_quantum_loader`, `nova_loading_bar`, `render_quantum_loader` patterns

## UI Primitives

- 3D Borders: top/bottom/left/right corner glyphs and repeated depth characters to create a 3D bezel
- Buttons: `btn_active`, `btn_inactive`, toggles `[●]` / `[○]` and 3D-styled button look
- Sliders: `slider` (long characters), value bar + filled/empty blocks
- Panels: bg_depth layers, panel background color sequences, boxed headers/footers
- Status bar primitives: small icons + bracketed metric blocks (e.g., [CPU:..] [RAM:..])
- Menu grids: 2/4-column grids, cell width calculations, padding rules

## Menu Layouts & Sections (All menus consolidated)

- QTI `quantum_menu` items (example list): Initialize System & Profiles; Organize Files; Verify System Integrity; Security Audits; Maintenance; Analytics; Monitor Real-time; Enhanced System Scan; Security Posture; Clean Slate; Resource Governor

- NEXUS `nexus_menu` sections: QUANTUM CORE; NEURAL INTERFACE; SECURITY NEXUS; PERFORMANCE MATRIX; SYSTEM FABRICATOR; ANALYTICS ENGINE; HOLO WORKSPACE; NEXUS SETTINGS
  - Items per section: e.g., Quantum Core -> Initialize Quantum Core, Boost Neural Processor, Quantum Path Reconstruction, Atomic Symlink Fabric

- NOVA `nova_menu` sections: SYSTEM CORE, SECURITY, PERFORMANCE, MAINTENANCE, MONITORING, TOOLS, CONFIGURATION, ADVANCED

- COSMOS `cosmos_menu` (full): 8 categories with 6 items each (48 features). See `execute_cosmos_command` mapping for canonical numbering.

## Status Bar / Telemetry Elements

- Telemetry metrics referenced across scripts:
  - CPU usage, CPU temp, GPU temp
  - Memory pressure/free, RAM MB
  - Disk usage & I/O
  - Network bytes in/out, active connections, listening ports
  - Uptime, load average, timestamp
- Visual primitives used for telemetry: sparkline, bar graph (█/░ blocks), process heat map, process tables

## Named Render & Engine Functions (for wiring into dashboard)

- Render and engine entrypoints to call or wire into UI:
  - `render_quantum_header`, `render_status_bar` (QTI)
  - `quantum_loader`, `particle_effect` (animations)
  - `render_holo_status_matrix`, `render_holo_menu` (NEXUS)
  - `render_nexus_header`, `nexus_menu`, `execute_nexus_command`
  - `render_nova_header`, `nova_menu`, `execute_nova_command` (NOVA)
  - `render_cosmos_header`, `cosmos_menu`, `execute_cosmos_command` (COSMOS)
  - `telemetry_dashboard`, `realtime_dashboard`, `render_cpu_graph`, `render_memory_graph`, `render_disk_graph`
  - `visual_effect_laboratory`, `preview_effect`, `render_sparkline`, `render_bar_graph`

## Themes & Theme Controls

- Theme names encountered: quantum, cyberpunk, matrix, hologram, neon, chrome_industrial, professional_minimalist, chrome, cosmos default
- Controls: theme cycle (`T`), theme selector functions (`nexus_theme_selector`, `cycle_theme`), theme studio/Color Matrix Generator

## Animation & Performance Controls

- Animation toggles and global options: QTI_3D_ENABLED, QTI_ANIMATIONS, QTI_COLOR_DEPTH, QTI_GLYPH_SET, QTI_RESPONSIVE
- NOVA_ANIMATIONS / QNTI_ANIMATIONS parameters: fps, transition_speed, easing, particles

## Special Visual Tools / Labs

- Visual Effect Laboratory / Visual Effect Lab: options for Quantum Ripple, Neural Pulse, Data Stream, Particle Explosion, preview_effect
- Holographic Theme Studio and Color Matrix Generator

## Files & Assets to Extract Later

- Any static assets referenced (GraphViz outputs `/tmp/services.png`, saved Graph PNGs in logs), and icon lists used for galleries (terminal gallery), should be collected into `/workspaces/terminal-zsh/assets/` for later.

---

## How to use this manifest

1. Import `VISUAL_COMPONENTS.md` into your dashboard design tool as a reference.
2. Implement color variables as design tokens in your UI system (use the RGB values from the source scripts).
3. Map glyph names to icon components (e.g., `QNTI_ICONS[cpu]` → CpuIcon component).
4. Reuse animation frame arrays for loaders/spinners and particle systems.

---

Generated from the merged scripts in this repository on: $(date -u)
