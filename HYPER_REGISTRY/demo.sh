#!/usr/bin/env bash
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║         NEXUSPRO HYPER REGISTRY - INTERACTIVE DEMONSTRATION                  ║
# ║    Complete System Demo with Registry, GEFS Scoring & Graph Engine           ║
# ╠═══════════════════════════════════════════════════════════════════════════════╣
# ║ Purpose: Interactive showcase of all system capabilities                     ║
# ║ Features: Visual effects, GEFS scoring, real-time graphs                     ║
# ║ Version: v1.0.0 | Created: 2025-12-16                                        ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

set -euo pipefail

# Locate script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${SCRIPT_DIR}/../src"

# Source all engines
source "${SRC_DIR}/visual_engine.sh"
source "${SRC_DIR}/registry_core.sh"
source "${SRC_DIR}/graph_engine.sh"

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

DEMO_PAUSE=3  # Seconds to pause between demos

# ═══════════════════════════════════════════════════════════════════════════════
# INTERACTIVE MENU
# ═══════════════════════════════════════════════════════════════════════════════

show_main_menu() {
    while true; do
        clear_screen
        
        draw_quantum_header "NEXUSPRO HYPER REGISTRY" "Interactive System Demonstration" 80
        
        echo
        draw_box "MAIN MENU" 70 \
            "Select a demonstration to view:" \
            "" \
            "  ${COLORS[ACCENT_GOLD]}1${COLORS[RESET]} - Visual Engine Demo (3D, Animations, Colors)" \
            "  ${COLORS[ACCENT_GOLD]}2${COLORS[RESET]} - Registry System Demo (CRUD, GEFS Scoring)" \
            "  ${COLORS[ACCENT_GOLD]}3${COLORS[RESET]} - Graph Engine Demo (Charts, Sparklines)" \
            "  ${COLORS[ACCENT_GOLD]}4${COLORS[RESET]} - Complete Integration Demo" \
            "  ${COLORS[ACCENT_GOLD]}5${COLORS[RESET]} - Registry Dashboard (Live View)" \
            "  ${COLORS[ACCENT_GOLD]}6${COLORS[RESET]} - Initialize Sample Data" \
            "  ${COLORS[ACCENT_GOLD]}Q${COLORS[RESET]} - Quit" \
            ""
        
        echo
        echo -ne "${COLORS[QUANTUM_CYAN]}Enter your choice: ${COLORS[RESET]}"
        read -r choice
        
        case $choice in
            1) demo_visual_engine ;;
            2) demo_registry_system ;;
            3) demo_graph_engine ;;
            4) demo_complete_integration ;;
            5) show_dashboard ;;
            6) initialize_sample_data ;;
            q|Q) 
                echo
                echo -e "${COLORS[NEURAL_GREEN]}Thank you for using NEXUSPRO Hyper Registry!${COLORS[RESET]}"
                echo
                exit 0
                ;;
            *)
                echo -e "${COLORS[ACCENT_RED]}Invalid choice. Please try again.${COLORS[RESET]}"
                sleep 2
                ;;
        esac
        
        echo
        echo -ne "${COLORS[DIM]}Press Enter to return to menu...${COLORS[RESET]}"
        read
    done
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO 1: VISUAL ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

demo_visual_engine() {
    clear_screen
    
    draw_quantum_header "VISUAL ENGINE DEMONSTRATION" "Ultra-Modern 3D/Animation/Visual Framework" 80
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Testing Visual Capabilities...${COLORS[RESET]}"
    echo
    
    # Gradients
    echo "1. Gradient Text Effects:"
    echo
    gradient_text "   QUANTUM WAVE GRADIENT" "QUANTUM_WAVE"
    echo
    gradient_text "   NEURAL PULSE GRADIENT" "NEURAL_PULSE"
    echo
    gradient_text "   HOLOGRAPHIC GRADIENT" "HOLOGRAPHIC"
    echo
    
    sleep $DEMO_PAUSE
    
    # Progress bars
    echo
    echo "2. Progress Indicators:"
    echo
    for percent in 25 50 75 100; do
        show_progress_bar $percent 50 "Loading System ($percent%)"
        sleep 0.5
    done
    
    sleep $DEMO_PAUSE
    
    # Status badges
    echo
    echo "3. Status Badges:"
    echo
    echo -n "  Active: "; status_badge "active"; echo
    echo -n "  Pending: "; status_badge "pending"; echo
    echo -n "  Success: "; status_badge "success"; echo
    echo -n "  Error: "; status_badge "error"; echo
    
    sleep $DEMO_PAUSE
    
    # 3D wireframe
    echo
    echo "4. 3D Wireframe Cube:"
    echo
    render_3d_cube 10 30 20
    
    sleep $DEMO_PAUSE
    
    # Particle burst
    echo
    echo "5. Particle Burst Animation:"
    echo
    particle_burst 15 40 20
    
    sleep $DEMO_PAUSE
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Visual Engine Demo Complete${COLORS[RESET]}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO 2: REGISTRY SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

demo_registry_system() {
    clear_screen
    
    draw_quantum_header "REGISTRY SYSTEM DEMONSTRATION" "CRUD Operations & GEFS Scoring" 80
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Initializing Registry...${COLORS[RESET]}"
    echo
    
    # Initialize if needed
    if [[ ! -f "$REGISTRY_DB" ]]; then
        init_registry
    fi
    
    sleep 1
    
    # Register sample entities
    echo
    echo "Registering Sample Entities:"
    echo
    
    # High-quality plugin
    local plugin_data=$(cat <<EOF
{
  "description": "Advanced authentication plugin",
  "author": "NEXUSPRO Team",
  "metrics": {
    "quality": 95,
    "performance": 92,
    "security": 98,
    "reliability": 94,
    "maintainability": 88,
    "documentation": 90
  }
}
EOF
)
    
    local plugin_id=$(register_entity "plugin" "auth-provider" "$plugin_data")
    
    sleep 1
    
    # Medium-quality service
    local service_data=$(cat <<EOF
{
  "description": "Data processing service",
  "author": "NEXUSPRO Team",
  "metrics": {
    "quality": 78,
    "performance": 85,
    "security": 82,
    "reliability": 80,
    "maintainability": 75,
    "documentation": 70
  }
}
EOF
)
    
    local service_id=$(register_entity "service" "data-processor" "$service_data")
    
    sleep 1
    
    # Show GEFS breakdown
    echo
    echo "GEFS Score Analysis:"
    show_gefs_breakdown "$plugin_id"
    
    sleep $DEMO_PAUSE
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Registry System Demo Complete${COLORS[RESET]}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO 3: GRAPH ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

demo_graph_engine() {
    clear_screen
    
    draw_quantum_header "GRAPH ENGINE DEMONSTRATION" "Charts, Sparklines & Visualizations" 80
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Generating Visual Data...${COLORS[RESET]}"
    echo
    
    # Sparklines
    echo "1. Sparklines with Glowing Effects:"
    echo
    
    local cpu_data=(45 52 48 55 63 58 51 49 54 61 67 72 68 64 59 62 58 54 57 61)
    local mem_data=(62 65 63 68 71 69 66 64 67 70 73 75 72 68 65 63 61 64 67 70)
    local disk_data=(23 25 22 28 31 29 26 24 27 30 33 35 32 28 25 23 21 24 27 30)
    
    render_sparkline_advanced "CPU Usage %" "${cpu_data[@]}"
    render_sparkline_advanced "Memory %" "${mem_data[@]}"
    render_sparkline_advanced "Disk I/O MB/s" "${disk_data[@]}"
    
    sleep $DEMO_PAUSE
    
    # Bar chart
    echo
    echo "2. Bar Chart Visualization:"
    
    render_bar_chart "Component Distribution" \
        "Plugins:45.5" \
        "Services:78.3" \
        "Components:92.1" \
        "Themes:56.7" \
        "Extensions:33.2"
    
    sleep $DEMO_PAUSE
    
    # Gauges
    echo
    echo "3. Gauge Meters:"
    echo
    
    render_gauge "System Health" 87 100 "%"
    render_gauge "Storage Used" 342 500 "GB"
    render_gauge "Network Load" 156 200 "Mbps"
    
    sleep $DEMO_PAUSE
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Graph Engine Demo Complete${COLORS[RESET]}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO 4: COMPLETE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

demo_complete_integration() {
    clear_screen
    
    draw_quantum_header "COMPLETE SYSTEM INTEGRATION" "All Components Working Together" 80
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Running Integrated Demonstration...${COLORS[RESET]}"
    echo
    
    # Initialize registry
    show_spinner "Initializing registry system..." 2
    
    if [[ ! -f "$REGISTRY_DB" ]]; then
        init_registry > /dev/null 2>&1
    fi
    
    # Register entities with visual feedback
    echo
    draw_box "ENTITY REGISTRATION" 70 \
        "Registering components with GEFS scoring..." \
        ""
    
    echo
    
    for i in {1..3}; do
        local entity_data=$(cat <<EOF
{
  "description": "Demo entity $i",
  "metrics": {
    "quality": $((75 + RANDOM % 20)),
    "performance": $((80 + RANDOM % 15)),
    "security": $((85 + RANDOM % 15)),
    "reliability": $((80 + RANDOM % 15)),
    "maintainability": $((70 + RANDOM % 20)),
    "documentation": $((65 + RANDOM % 25))
  }
}
EOF
)
        
        register_entity "component" "demo-component-$i" "$entity_data" > /dev/null
        sleep 0.5
    done
    
    echo -e "${COLORS[NEURAL_GREEN]}✓ Entities registered successfully${COLORS[RESET]}"
    
    sleep 1
    
    # Show dashboard
    echo
    show_dashboard
    
    sleep $DEMO_PAUSE
    
    # Real-time visualization
    echo
    draw_box "REAL-TIME METRICS" 70 \
        "Simulating live system monitoring..." \
        ""
    
    echo
    
    local metrics=()
    for i in {1..30}; do
        local value=$((50 + RANDOM % 40))
        metrics+=("$value")
    done
    
    render_sparkline_advanced "Live Performance" "${metrics[@]}"
    
    echo
    
    # Show GEFS distribution
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}GEFS Score Distribution:${COLORS[RESET]}"
    echo
    
    for type in "plugin" "service" "component"; do
        local entity_dir="${REGISTRY_ROOT}/entities/${type}s"
        if [[ -d "$entity_dir" ]] && [[ -n "$(ls -A "$entity_dir" 2>/dev/null)" ]]; then
            local scores=()
            for file in "$entity_dir"/*.json; do
                [[ -f "$file" ]] || continue
                local score=$(jq -r '.gefs_score' "$file" 2>/dev/null || echo "0")
                scores+=("$score")
            done
            
            if [[ ${#scores[@]} -gt 0 ]]; then
                render_sparkline_advanced "$type entities" "${scores[@]}"
            fi
        fi
    done
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Integration Demo Complete${COLORS[RESET]}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# SAMPLE DATA INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

initialize_sample_data() {
    clear_screen
    
    draw_quantum_header "SAMPLE DATA INITIALIZATION" "Populating Registry with Demo Data" 80
    
    echo
    show_spinner "Initializing registry..." 2
    
    # Initialize registry
    init_registry > /dev/null 2>&1
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Creating Sample Entities...${COLORS[RESET]}"
    echo
    
    # Sample plugins
    local plugins=(
        "auth-provider:Authentication Provider:95:92:98:94:88:90"
        "cache-manager:Cache Management System:88:95:85:90:82:78"
        "logger:Advanced Logging Framework:82:88:80:92:90:95"
        "validator:Input Validation Suite:90:85:95:88:85:88"
    )
    
    for plugin in "${plugins[@]}"; do
        IFS=':' read -r name desc q p s r m d <<< "$plugin"
        
        local data=$(cat <<EOF
{
  "description": "$desc",
  "metrics": {
    "quality": $q,
    "performance": $p,
    "security": $s,
    "reliability": $r,
    "maintainability": $m,
    "documentation": $d
  }
}
EOF
)
        
        register_entity "plugin" "$name" "$data" > /dev/null
        echo -e "  ${COLORS[NEURAL_GREEN]}✓${COLORS[RESET]} Created plugin: ${COLORS[ACCENT_GOLD]}$name${COLORS[RESET]}"
    done
    
    echo
    
    # Sample services
    local services=(
        "api-gateway:API Gateway Service:85:90:88:92:80:75"
        "data-processor:Data Processing Pipeline:78:95:75:85:82:70"
        "notification:Notification Service:82:88:90:88:78:85"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name desc q p s r m d <<< "$service"
        
        local data=$(cat <<EOF
{
  "description": "$desc",
  "metrics": {
    "quality": $q,
    "performance": $p,
    "security": $s,
    "reliability": $r,
    "maintainability": $m,
    "documentation": $d
  }
}
EOF
)
        
        register_entity "service" "$name" "$data" > /dev/null
        echo -e "  ${COLORS[NEURAL_GREEN]}✓${COLORS[RESET]} Created service: ${COLORS[ACCENT_GOLD]}$name${COLORS[RESET]}"
    done
    
    echo
    particle_burst 20 40 15
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Sample data initialized successfully!${COLORS[RESET]}"
    echo
    echo "You can now:"
    echo "  • View the dashboard (Option 5)"
    echo "  • Run integration demo (Option 4)"
    echo "  • Search the registry"
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    # Check dependencies
    for cmd in jq bc; do
        if ! command -v $cmd &> /dev/null; then
            echo -e "${COLORS[ACCENT_RED]}Error: Required command '$cmd' not found${COLORS[RESET]}"
            echo "Please install: sudo apt-get install $cmd"
            exit 1
        fi
    done
    
    # Show main menu
    show_main_menu
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
