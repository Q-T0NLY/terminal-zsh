#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ NEXUS AI DASHBOARD - COMPLETE LAYOUT DEMO                                    ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝
# Demonstrates all features of the Hyper-Dashboard Layout Engine
# Auto-scaling • Auto-centering • Symmetry • Responsive • Interactive

set -eo pipefail

# Load the layout engine
SCRIPT_DIR="${0:a:h}"
source "${SCRIPT_DIR}/../src/ui/hyper_dashboard_layout_engine.zsh"

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 📊 DEMO CONTENT GENERATORS                                                   ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

generate_system_status() {
  cat <<'EOF'
CPU Usage: ████████████░░░░░░░░ 65%
Memory:    ██████████████░░░░░░ 72%
Disk:      ████████░░░░░░░░░░░░ 45%
Network:   ███████████████████░ 95%

Active Processes: 247
Uptime: 15d 8h 42m
Load Average: 2.4, 2.1, 1.8
EOF
}

generate_ai_processes() {
  cat <<'EOF'
🧠 GPT-5.1       [████████░░] 82% | 4.2GB
🤖 Claude-3.7    [██████░░░░] 61% | 2.8GB
🔮 Gemini-3      [███████░░░] 73% | 3.5GB
⚡ Grok-3        [█████░░░░░] 54% | 2.1GB

Total GPU: 12.6GB / 16GB
Inference: 1,247 req/s
Latency: 8.4ms avg
EOF
}

generate_registry_stats() {
  cat <<'EOF'
Total Components: 1,247
  • Panels: 156
  • Widgets: 423
  • Themes: 89
  • Plugins: 234
  • Helpers: 345

Recent Activity: 47 updates
Popular: System Monitor (2.4k uses)
Latest: Neural Visualizer v2.1
EOF
}

generate_live_metrics() {
  cat <<'EOF'
⚡ Performance Metrics

Render Time:  0.4ms ✨
Layout Calc:  1.2ms ⚡
Frame Rate:   60 FPS 🎯
Memory:       847KB 💾

Quality Score: A+ (98.5%)
EOF
}

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 🎨 ADVANCED DEMO SCENARIOS                                                   ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

demo_basic_layout() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 1: Basic Dashboard Layout                               ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Create 4-panel layout
  layout_create_panel "status" "System Status" 55 14 5 3
  layout_create_panel "ai" "AI Processes" 55 14 65 3
  layout_create_panel "registry" "Registry Stats" 55 12 5 19
  layout_create_panel "metrics" "Live Metrics" 55 12 65 19
  
  # Render
  layout_render_dashboard "NEXUS AI - BASIC LAYOUT"
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_centered_layout() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 2: Auto-Centered Single Panel                           ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Clear previous panels
  PANEL_REGISTRY=()
  PANEL_ORDER=()
  
  # Create single centered panel
  layout_create_panel "main" "Main Dashboard" 80 25 "auto" "auto"
  
  # Render with custom content
  clear
  layout_render_panel "main" "$(cat <<'EOF'
╔══════════════════════════════════════════════════════════╗
║          PERFECTLY CENTERED DASHBOARD                    ║
╠══════════════════════════════════════════════════════════╣

This panel is automatically centered both horizontally
and vertically using mathematical precision.

Features demonstrated:
  ✨ Auto-horizontal centering
  ✨ Auto-vertical centering
  ✨ Perfect symmetry
  ✨ Responsive to terminal size

The layout engine calculates the exact position
based on terminal dimensions and panel size.

Resize your terminal to see it adapt!
╚══════════════════════════════════════════════════════════╝
EOF
)" "double"
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_golden_ratio() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 3: Golden Ratio Layout                                  ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Clear previous
  PANEL_REGISTRY=()
  PANEL_ORDER=()
  
  # Calculate golden ratio dimensions
  read larger smaller <<< $(layout_golden_ratio $TERM_WIDTH)
  
  echo "Terminal Width: $TERM_WIDTH"
  echo "Golden Ratio Division:"
  echo "  Larger part: $larger columns"
  echo "  Smaller part: $smaller columns"
  echo ""
  
  # Create panels using golden ratio
  layout_create_panel "main_content" "Main Content (φ)" $((larger - 10)) 25 5 3
  layout_create_panel "sidebar" "Sidebar (1-φ)" $((smaller - 10)) 25 $((larger + 5)) 3
  
  layout_render_dashboard "GOLDEN RATIO LAYOUT (φ = 1.618...)"
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_responsive_grid() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 4: Responsive Grid System                               ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Detect current breakpoint
  local breakpoint=$(layout_detect_breakpoint)
  
  echo "Current Terminal Width: $TERM_WIDTH"
  echo "Detected Breakpoint: $breakpoint"
  echo ""
  
  # Show column calculations
  echo "Grid Column Widths:"
  for cols in 1 2 3 4 6 12; do
    local width=$(layout_grid_column_width $cols)
    printf "  %2d columns = %3d chars wide\n" $cols $width
  done
  
  echo ""
  echo "Breakpoint Ranges:"
  for bp in xs sm md lg xl xxl; do
    printf "  %-4s: %3d+ columns\n" $bp ${BREAKPOINTS[$bp]}
  done
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_visual_effects() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 5: Visual Effects & Gradients                           ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  local sample_text="NEXUS AI HYPER-DASHBOARD"
  
  echo "Rainbow Gradient:"
  echo "  $(layout_apply_gradient "$sample_text" "rainbow")"
  echo ""
  
  echo "Ocean Gradient:"
  echo "  $(layout_apply_gradient "$sample_text" "ocean")"
  echo ""
  
  echo "Sunset Gradient:"
  echo "  $(layout_apply_gradient "$sample_text" "sunset")"
  echo ""
  
  echo "Aurora Gradient:"
  echo "  $(layout_apply_gradient "$sample_text" "aurora")"
  echo ""
  
  echo "Fire Gradient:"
  echo "  $(layout_apply_gradient "$sample_text" "fire")"
  echo ""
  
  echo ""
  echo "Particle Burst Effect:"
  layout_particle_burst 40 15 30
  sleep 2
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_border_styles() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 6: Border Style Variations                              ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  
  PANEL_REGISTRY=()
  PANEL_ORDER=()
  
  # Create panels with different border styles
  layout_create_panel "double_panel" "Double Border" 35 8 5 3
  layout_create_panel "single_panel" "Single Border" 35 8 45 3
  layout_create_panel "rounded_panel" "Rounded Border" 35 8 85 3
  layout_create_panel "thick_panel" "Thick Border" 35 8 5 13
  layout_create_panel "ascii_panel" "ASCII Border" 35 8 45 13
  
  clear
  layout_render_panel "double_panel" "This uses\ndouble borders\n(╔═╗)" "double"
  layout_render_panel "single_panel" "This uses\nsingle borders\n(┌─┐)" "single"
  layout_render_panel "rounded_panel" "This uses\nrounded borders\n(╭─╮)" "rounded"
  layout_render_panel "thick_panel" "This uses\nthick borders\n(┏━┓)" "thick"
  layout_render_panel "ascii_panel" "This uses\nASCII borders\n(+-+)" "ascii"
  
  echo ""
  read -k 1 -s -p "Press any key to continue..."
  echo ""
}

demo_interactive() {
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║ DEMO 7: Interactive Dashboard                                ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Starting interactive mode..."
  echo "Use keyboard controls to interact with the dashboard."
  echo ""
  sleep 2
  
  # Run full interactive demo
  layout_demo_dashboard
}

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 🎬 MAIN DEMO MENU                                                            ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

show_demo_menu() {
  clear
  
  cat <<'EOF'
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗                                ║
║  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝                                ║
║  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗                                ║
║  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║                                ║
║  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║                                ║
║  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                                ║
║                                                                               ║
║              HYPER-DASHBOARD LAYOUT ENGINE DEMO                               ║
║                      Version 4.0.0-ULTRA                                      ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  Select a demo to run:                                                        ║
║                                                                               ║
║  1. Basic Dashboard Layout (4-panel grid)                                     ║
║  2. Auto-Centered Single Panel                                                ║
║  3. Golden Ratio Layout (φ = 1.618...)                                        ║
║  4. Responsive Grid System                                                    ║
║  5. Visual Effects & Gradients                                                ║
║  6. Border Style Variations                                                   ║
║  7. Interactive Dashboard (Full Demo)                                         ║
║  8. Show Layout Statistics                                                    ║
║  9. Run All Demos (Sequential)                                                ║
║  0. Exit                                                                      ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
  
  echo ""
  echo -n "Enter your choice [0-9]: "
}

run_all_demos() {
  echo "Running all demos sequentially..."
  echo ""
  
  demo_basic_layout
  demo_centered_layout
  demo_golden_ratio
  demo_responsive_grid
  demo_visual_effects
  demo_border_styles
  
  echo ""
  echo "All demos complete!"
  echo ""
  read -k 1 -s -p "Press any key to return to menu..."
}

# Main loop
main() {
  while true; do
    show_demo_menu
    read -k 1 choice
    echo ""
    echo ""
    
    case "$choice" in
      1) demo_basic_layout ;;
      2) demo_centered_layout ;;
      3) demo_golden_ratio ;;
      4) demo_responsive_grid ;;
      5) demo_visual_effects ;;
      6) demo_border_styles ;;
      7) demo_interactive ;;
      8) layout_show_stats; read -k 1 -s -p "Press any key to continue..." ;;
      9) run_all_demos ;;
      0) echo "Exiting..."; break ;;
      *) echo "Invalid choice. Press any key to continue..."; read -k 1 -s ;;
    esac
  done
  
  clear
  echo "Thank you for exploring the Nexus AI Hyper-Dashboard Layout Engine!"
  echo ""
}

# Run main menu
main
