#!/usr/bin/env bash
# QUANTUM HEADER MATRIX - NEXUSPRO VISUALS DEMO
# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║  🎨 NEXUSPRO QUANTUM VISUALS DEMO - Complete Feature Showcase             ║
# ║  Award-Winning 3D/Visuals/Animations Demonstration                        ║
# ╚═════════════════════════════════════════════════════════════════════════════╝
# [🎯] TYPE: Interactive Demo               [⚡] FEATURES: All Systems
# [🎨] VISUALS: 3D + Particles + Gradients   [🔮] PURPOSE: Feature Showcase

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for demo
C_CYAN='\033[38;5;51m'
C_GREEN='\033[38;5;46m'
C_YELLOW='\033[38;5;226m'
C_MAGENTA='\033[38;5;201m'
C_RESET='\033[0m'
C_BOLD='\033[1m'

print_header() {
  clear
  cat <<'HEADER'
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║  ██████╗ ██████╗ ███╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗           ║
║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║           ║
║  ██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║  ██║█████╗  ███████║██║           ║
║  ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══╝  ██╔══██╗██║           ║
║  ██████╔╝╚██████╔╝██║ ╚████║███████╗██████╔╝███████╗██║  ██║███████╗      ║
║  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝      ║
║                                                                           ║
║               🌟 QUANTUM VISUALS ENGINE v9.0 - DEMO MODE 🌟               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
HEADER
  echo ""
}

demo_menu() {
  echo -e "${C_BOLD}${C_CYAN}SELECT DEMO:${C_RESET}"
  echo -e "${C_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
  echo ""
  echo -e "  ${C_GREEN}1.${C_RESET} 🎨 Color Gradients & Palettes"
  echo -e "  ${C_GREEN}2.${C_RESET} 🎯 Progress Bars & Animations"
  echo -e "  ${C_GREEN}3.${C_RESET} 🧊 3D Wireframe Cube (Rotating)"
  echo -e "  ${C_GREEN}4.${C_RESET} 🎬 Full Interactive Demo (Python)"
  echo -e "  ${C_GREEN}5.${C_RESET} 🤖 AI Generator Integration Preview"
  echo -e "  ${C_GREEN}6.${C_RESET} 📊 System Dashboard Template"
  echo -e "  ${C_GREEN}7.${C_RESET} 🌈 All Features Showcase"
  echo -e "  ${C_GREEN}0.${C_RESET} ❌ Exit"
  echo ""
  echo -e "${C_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
  echo -ne "${C_CYAN}Enter choice (0-7): ${C_RESET}"
}

demo_gradients() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}🎨 COLOR GRADIENTS DEMO${C_RESET}"
  echo ""
  
  python3 -c '
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()

gradients = ["rainbow", "fire", "ice", "quantum", "neural"]
text = "█" * 60

for grad in gradients:
    print(f"  {grad.upper():<10} {engine.gradient_text(text, grad)}")
    print()
'
  
  echo ""
  echo -e "${C_GREEN}✅ Gradient rendering complete${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_progress_bars() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}🎯 PROGRESS BARS DEMO${C_RESET}"
  echo ""
  
  python3 -c '
from nexus_visuals import QuantumColorEngine
import time

engine = QuantumColorEngine()

styles = ["3d", "blocks", "dots", "waves", "quantum"]

for style in styles:
    print(f"  {style.upper():<10}")
    for i in range(0, 101, 20):
        bar = engine.create_progress_bar(i, 100, 40, style)
        print(f"    {bar}")
        engine.animate()
    print()
'
  
  echo ""
  echo -e "${C_GREEN}✅ Progress bars demo complete${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_3d_cube() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}🧊 3D WIREFRAME CUBE DEMO${C_RESET}"
  echo ""
  echo "  Rendering rotating 3D cube..."
  echo ""
  
  python3 -c '
from nexus_visuals import NexusVisualsEngine
import time

engine = NexusVisualsEngine(70, 20)
cube = engine.add_3d_object("cube", position=(0, 0, 3), scale=1.0)

print("\033[2J\033[H")  # Clear screen
for frame in range(30):
    lines = engine.render_frame()
    print("\033[H", end="")  # Move cursor home
    for line in lines:
        print(line)
    time.sleep(0.05)
'
  
  echo ""
  echo -e "${C_GREEN}✅ 3D rendering complete${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_python_interactive() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}🎬 LAUNCHING FULL INTERACTIVE DEMO${C_RESET}"
  echo ""
  echo "  Starting Python interactive demo..."
  echo "  Press Ctrl+C to stop"
  echo ""
  sleep 2
  
  python3 "$PROJECT_ROOT/nexus_visuals.py" --demo --width 80 --height 24
  
  clear
  echo -e "${C_GREEN}✅ Interactive demo ended${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_ai_integration() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}🤖 AI GENERATOR INTEGRATION PREVIEW${C_RESET}"
  echo ""
  
  cat <<'AI_PREVIEW'
  ╔═══════════════════════════════════════════════════════════════════╗
  ║  🤖 AI CODE GENERATION IN PROGRESS                                ║
  ╚═══════════════════════════════════════════════════════════════════╝

  📝 Template: Python FastAPI
  🤖 Model: Claude 3 Sonnet (Anthropic)
  📋 Task: Create production-ready REST API

AI_PREVIEW
  
  echo ""
  
  # Simulate progress stages
  stages=(
    "Initializing AI model connection"
    "Analyzing requirements and context"
    "Generating base project structure"
    "Creating core application logic"
    "Adding error handling"
    "Optimizing code for production"
    "Running quality checks"
    "Finalizing output"
  )
  
  for i in "${!stages[@]}"; do
    progress=$((i * 100 / ${#stages[@]}))
    echo "  ▶ ${stages[$i]}..."
    
    python3 -c "
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()
bar = engine.create_progress_bar($progress, 100, 50, 'quantum')
print(f'    {bar}')
" 2>/dev/null || echo "    [$progress%]"
    
    sleep 0.5
  done
  
  echo ""
  echo -e "${C_GREEN}✅ AI generation complete!${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_dashboard() {
  clear
  print_header
  
  echo -e "${C_BOLD}${C_CYAN}📊 SYSTEM DASHBOARD TEMPLATE${C_RESET}"
  echo ""
  
  cat <<'DASHBOARD'
╔═══════════════════════════════════════════════════════════════════════════╗
║  📊 SYSTEM METRICS DASHBOARD                                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
DASHBOARD
  
  # CPU metric
  echo -ne "║  CPU Usage:     "
  python3 -c "
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()
print(engine.create_progress_bar(75, 100, 40, '3d'))
" 2>/dev/null || echo "[75%]"
  echo "     ║"
  
  # RAM metric
  echo -ne "║  RAM Usage:     "
  python3 -c "
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()
print(engine.create_progress_bar(62, 100, 40, 'quantum'))
" 2>/dev/null || echo "[62%]"
  echo "     ║"
  
  # DISK metric
  echo -ne "║  DISK Usage:    "
  python3 -c "
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()
print(engine.create_progress_bar(88, 100, 40, 'blocks'))
" 2>/dev/null || echo "[88%]"
  echo "     ║"
  
  # NETWORK metric
  echo -ne "║  Network Load:  "
  python3 -c "
from nexus_visuals import QuantumColorEngine
engine = QuantumColorEngine()
print(engine.create_progress_bar(45, 100, 40, 'dots'))
" 2>/dev/null || echo "[45%]"
  echo "     ║"
  
  cat <<'DASHBOARD_END'
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Status: 🟢 Operational | Uptime: 99.97% | Latency: <1ms                 ║
╚═══════════════════════════════════════════════════════════════════════════╝
DASHBOARD_END
  
  echo ""
  echo -e "${C_GREEN}✅ Dashboard rendered${C_RESET}"
  echo ""
  read -p "Press Enter to continue..."
}

demo_all_features() {
  demo_gradients
  demo_progress_bars
  demo_3d_cube
  demo_dashboard
}

# 3D WIREFRAME FOOTER
show_3d_footer() {
  cat <<'WIREFRAME'

╔═══════════════════════════════════════════════════════════════════════════╗
║               3D SYSTEM ARCHITECTURE                                      ║
╚═══════════════════════════════════════════════════════════════════════════╝

  ▶ QUANTUM ENGINE STACK
           ╱────────────╲
          ╱   PYTHON     ╲
         │   BACKEND     │
          ╲   ◉ ◉ ◉ ◉   ╱
           ╲────────────╱
                │
       ┌────────┼────────┐
       │        │        │
   ╱───────╲ ╱──────╲ ╱───────╲
  │  ZSH   │ │ ANSI │ │Terminal│
  │ Bridge │ │Colors│ │  3D    │
   ╲───────╱ ╲──────╱ ╲───────╱

╔═══════════════════════════════════════════════════════════════════════════╗
║  🎨 NEXUSPRO QUANTUM VISUALS - Production-Grade Terminal Graphics         ║
╚═══════════════════════════════════════════════════════════════════════════╝

WIREFRAME
}

# Main loop
main() {
  while true; do
    print_header
    demo_menu
    read -r choice
    
    case "$choice" in
      1) demo_gradients ;;
      2) demo_progress_bars ;;
      3) demo_3d_cube ;;
      4) demo_python_interactive ;;
      5) demo_ai_integration ;;
      6) demo_dashboard ;;
      7) demo_all_features ;;
      0)
        clear
        echo ""
        echo -e "${C_GREEN}${C_BOLD}Thank you for exploring NexusPro Quantum Visuals!${C_RESET}"
        echo ""
        show_3d_footer
        exit 0
        ;;
      *)
        echo -e "${C_YELLOW}Invalid choice. Please try again.${C_RESET}"
        sleep 1
        ;;
    esac
  done
}

# Check dependencies
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 is required but not found"
  exit 1
fi

if [[ ! -f "$PROJECT_ROOT/nexus_visuals.py" ]]; then
  echo "❌ nexus_visuals.py not found at: $PROJECT_ROOT"
  exit 1
fi

# Run demo
main
