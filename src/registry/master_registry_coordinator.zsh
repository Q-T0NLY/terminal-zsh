#!/usr/bin/env zsh
# 🎯 MASTER REGISTRY COORDINATOR
# Unified control hub for all visual component sub-registries
# Enhanced downloader integration and component orchestration
# ════════════════════════════════════════════════════════════════════════

# ════════════════════════════════════════════════════════════════════════
# 📦 LOAD ALL SUB-REGISTRIES
# ════════════════════════════════════════════════════════════════════════

source "${0:A:h}/3d_sub_registry.zsh" 2>/dev/null
source "${0:A:h}/animations_sub_registry.zsh" 2>/dev/null
source "${0:A:h}/color_palette_sub_registry.zsh" 2>/dev/null
source "${0:A:h}/emojis_sub_registry.zsh" 2>/dev/null
source "${0:A:h}/ui_elements_sub_registry.zsh" 2>/dev/null

# ════════════════════════════════════════════════════════════════════════
# 🎪 REGISTRY STATISTICS
# ════════════════════════════════════════════════════════════════════════

typeset -gA REGISTRY_STATS

calculate_registry_stats() {
    REGISTRY_STATS[3d_components]=${#3D_COMPONENTS}
    REGISTRY_STATS[animation_components]=${#ANIMATION_COMPONENTS}
    REGISTRY_STATS[color_palettes]=${#COLOR_PALETTES}
    REGISTRY_STATS[color_gradients]=${#GRADIENT_EFFECTS}
    REGISTRY_STATS[emoji_sets]=${#EMOJI_SETS}
    REGISTRY_STATS[emoji_contexts]=${#EMOJI_CONTEXT_MAP}
    REGISTRY_STATS[ui_elements]=${#UI_COMPONENTS}
    REGISTRY_STATS[border_sets]=${#BORDER_SETS}
    
    REGISTRY_STATS[total_components]=$(( 
        REGISTRY_STATS[3d_components] + 
        REGISTRY_STATS[animation_components] + 
        REGISTRY_STATS[color_palettes] + 
        REGISTRY_STATS[emoji_sets] + 
        REGISTRY_STATS[ui_elements]
    ))
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 COMPONENT COMPOSITION ENGINE
# For downloader layout assembly
# ════════════════════════════════════════════════════════════════════════

typeset -gA DOWNLOADER_COMPOSITIONS

# Predefined compositions for common downloader scenarios
compose_downloader_layout() {
    local scenario="$1"  # fast, secure, multi-path, interactive
    
    case "$scenario" in
        "fast")
            # Fast download with minimal overhead
            DOWNLOADER_COMPOSITIONS[$scenario]=$(cat <<-EOF
{
  "scenario": "fast",
  "description": "Optimized for speed, minimal visual overhead",
  "components": {
    "3d": ["3d_holo_cube"],
    "animations": ["anim_progress_fill", "anim_signal_strength"],
    "colors": ["palette_quantum_neon"],
    "emojis": ["emojis_speed", "emojis_success"],
    "ui": ["ui_frame_single", "ui_progress_bar", "ui_header_simple"]
  },
  "settings": {
    "animation_fps": 60,
    "color_depth": "24bit",
    "update_frequency": "real-time"
  }
}
EOF
)
            ;;
        "secure")
            # Secure download with security visualization
            DOWNLOADER_COMPOSITIONS[$scenario]=$(cat <<-EOF
{
  "scenario": "secure",
  "description": "Emphasis on security indicators and verification",
  "components": {
    "3d": ["3d_quantum_sphere"],
    "animations": ["anim_connection_matrix", "anim_pulse_breath"],
    "colors": ["palette_high_contrast"],
    "emojis": ["emojis_security", "emojis_verified"],
    "ui": ["ui_frame_double", "ui_progress_3d", "ui_box_glow"]
  },
  "settings": {
    "animation_fps": 30,
    "color_depth": "24bit",
    "security_indicators": "all"
  }
}
EOF
)
            ;;
        "multi-path")
            # Multi-path download with thread visualization
            DOWNLOADER_COMPOSITIONS[$scenario]=$(cat <<-EOF
{
  "scenario": "multi-path",
  "description": "Multi-threaded download with parallel path visualization",
  "components": {
    "3d": ["3d_matrix_visualization", "3d_neural_network"],
    "animations": ["anim_network_pulse", "anim_particle_burst"],
    "colors": ["palette_quantum_neon", "palette_cyberpunk_dark"],
    "emojis": ["emojis_network", "emojis_connection"],
    "ui": ["ui_frame_3d", "ui_panel_multi_column", "ui_progress_wave"]
  },
  "settings": {
    "animation_fps": 60,
    "color_depth": "24bit",
    "parallel_visualization": true
  }
}
EOF
)
            ;;
        "interactive")
            # Interactive dashboard with full visual effects
            DOWNLOADER_COMPOSITIONS[$scenario]=$(cat <<-EOF
{
  "scenario": "interactive",
  "description": "Full interactive experience with all visual features",
  "components": {
    "3d": ["3d_live_wireframe", "3d_data_vortex"],
    "animations": ["anim_sparkle_burst", "anim_data_stream", "anim_glitch_effect"],
    "colors": ["palette_warm_sunset", "palette_ice_cold"],
    "emojis": ["emojis_all"],
    "ui": ["ui_frame_3d", "ui_button_gradient", "ui_gauge_circular"]
  },
  "settings": {
    "animation_fps": 120,
    "color_depth": "24bit+",
    "effects": "maximum"
  }
}
EOF
)
            ;;
    esac
    
    return 0
}

# ════════════════════════════════════════════════════════════════════════
# 🎨 DOWNLOADER THEME SYSTEM
# ════════════════════════════════════════════════════════════════════════

typeset -gA DOWNLOADER_THEMES

create_downloader_theme() {
    local theme_name="$1"
    local palette_id="$2"
    local animation_set="$3"
    local ui_style="$4"
    
    DOWNLOADER_THEMES[$theme_name]=$(cat <<-EOF
{
  "name": "$theme_name",
  "palette": "$palette_id",
  "animations": "$animation_set",
  "ui_style": "$ui_style",
  "created": "$(date -Iseconds)"
}
EOF
)
}

load_downloader_themes() {
    # Quantum Neon Theme
    create_downloader_theme \
        "quantum_neon" \
        "palette_quantum_neon" \
        "smooth" \
        "rounded"
    
    # Cyberpunk Dark Theme
    create_downloader_theme \
        "cyberpunk_dark" \
        "palette_cyberpunk_dark" \
        "aggressive" \
        "bold"
    
    # Minimal Calm Theme
    create_downloader_theme \
        "minimal_calm" \
        "palette_minimal_calm" \
        "smooth" \
        "single"
    
    # High Contrast Accessible
    create_downloader_theme \
        "high_contrast" \
        "palette_high_contrast" \
        "standard" \
        "double"
    
    # Warm Sunset Theme
    create_downloader_theme \
        "warm_sunset" \
        "palette_warm_sunset" \
        "smooth" \
        "rounded"
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 DOWNLOADER LAYOUT BUILDER
# ════════════════════════════════════════════════════════════════════════

build_downloader_layout() {
    local scenario="${1:-fast}"
    local theme="${2:-quantum_neon}"
    
    # Calculate statistics
    calculate_registry_stats
    
    # Load compositions and themes
    compose_downloader_layout "$scenario"
    load_downloader_themes
    
    # Build layout configuration
    local layout_config=$(cat <<-EOF
{
  "downloader_layout": {
    "scenario": "$scenario",
    "theme": "$theme",
    "created": "$(date -Iseconds)",
    "registry_stats": {
      "3d_components": ${REGISTRY_STATS[3d_components]},
      "animations": ${REGISTRY_STATS[animation_components]},
      "colors": ${REGISTRY_STATS[color_palettes]},
      "emojis": ${REGISTRY_STATS[emoji_sets]},
      "ui_elements": ${REGISTRY_STATS[ui_elements]},
      "total": ${REGISTRY_STATS[total_components]}
    },
    "composition": $(echo "${DOWNLOADER_COMPOSITIONS[$scenario]}" | sed 's/^/      /'),
    "theme": $(echo "${DOWNLOADER_THEMES[$theme]}" | sed 's/^/      /')
  }
}
EOF
)
    
    echo "$layout_config"
}

# ════════════════════════════════════════════════════════════════════════
# 📊 REGISTRY DASHBOARD
# ════════════════════════════════════════════════════════════════════════

show_registry_dashboard() {
    calculate_registry_stats
    
    clear
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║         🎨 MASTER REGISTRY DASHBOARD - COMPONENT INVENTORY      ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝\n"
    
    # 3D Components
    echo -e "  ${QH_INFO}🎨 3D COMPONENTS:${QH_RESET}"
    echo -e "    Total: ${REGISTRY_STATS[3d_components]} components"
    echo -e "    Categories: Wireframes, Solids, Projections, Grids, Matrices\n"
    
    # Animations
    echo -e "  ${QH_INFO}⚡ ANIMATIONS:${QH_RESET}"
    echo -e "    Total: ${REGISTRY_STATS[animation_components]} animations"
    echo -e "    Categories: Spinners, Waves, Particles, Transitions, Pulses, Glitch, Progress, Network, Counters\n"
    
    # Colors
    echo -e "  ${QH_INFO}🎨 COLOR SYSTEM:${QH_RESET}"
    echo -e "    Palettes: ${REGISTRY_STATS[color_palettes]} themes"
    echo -e "    Gradients: ${REGISTRY_STATS[color_gradients]} gradient effects"
    echo -e "    Themes: Quantum Neon, Cyberpunk, Minimal, Contrast, Sunset, Ice, Matrix\n"
    
    # Emojis
    echo -e "  ${QH_INFO}😊 EMOJI SYSTEM:${QH_RESET}"
    echo -e "    Sets: ${REGISTRY_STATS[emoji_sets]} categories"
    echo -e "    Contexts: ${REGISTRY_STATS[emoji_contexts]} intelligent mappings\n"
    
    # UI Elements
    echo -e "  ${QH_INFO}🎛️  UI ELEMENTS:${QH_RESET}"
    echo -e "    Components: ${REGISTRY_STATS[ui_elements]} UI elements"
    echo -e "    Border Sets: ${REGISTRY_STATS[border_sets]} border styles\n"
    
    # Totals
    echo -e "  ${QH_SUCCESS}📊 TOTAL COMPONENTS: ${REGISTRY_STATS[total_components]}${QH_RESET}\n"
    
    # Downloader Scenarios
    echo -e "  ${QH_HIGHLIGHT}📥 DOWNLOADER SCENARIOS:${QH_RESET}"
    echo -e "    • Fast (optimized speed)"
    echo -e "    • Secure (encryption emphasis)"
    echo -e "    • Multi-Path (parallel visualization)"
    echo -e "    • Interactive (full features)\n"
    
    # Available Themes
    echo -e "  ${QH_ACCENT}🎨 AVAILABLE THEMES:${QH_RESET}"
    echo -e "    • Quantum Neon"
    echo -e "    • Cyberpunk Dark"
    echo -e "    • Minimal Calm"
    echo -e "    • High Contrast"
    echo -e "    • Warm Sunset\n"
}

# ════════════════════════════════════════════════════════════════════════
# 🔍 ADVANCED QUERIES
# ════════════════════════════════════════════════════════════════════════

find_components_by_use_case() {
    local use_case="$1"
    
    echo -e "\n${QH_INFO}🔍 Searching for components matching: '$use_case'${QH_RESET}\n"
    
    # Search 3D components
    echo -e "  ${QH_HIGHLIGHT}3D Components:${QH_RESET}"
    local found_3d=0
    for comp_id in ${(k)3D_COMPONENTS}; do
        local comp_data="${3D_COMPONENTS[$comp_id]}"
        local comp_use=$(echo "$comp_data" | grep -o '"use_case": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_use" == *"$use_case"* ]]; then
            local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
            echo -e "    ✓ $name"
            ((found_3d++))
        fi
    done
    [[ $found_3d -eq 0 ]] && echo -e "    (none found)"
    
    # Search animations
    echo -e "\n  ${QH_HIGHLIGHT}Animations:${QH_RESET}"
    local found_anim=0
    for comp_id in ${(k)ANIMATION_COMPONENTS}; do
        local comp_data="${ANIMATION_COMPONENTS[$comp_id]}"
        local comp_use=$(echo "$comp_data" | grep -o '"use_case": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_use" == *"$use_case"* ]]; then
            local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
            echo -e "    ✓ $name"
            ((found_anim++))
        fi
    done
    [[ $found_anim -eq 0 ]] && echo -e "    (none found)"
    
    # Search UI elements
    echo -e "\n  ${QH_HIGHLIGHT}UI Elements:${QH_RESET}"
    local found_ui=0
    for comp_id in ${(k)UI_COMPONENTS}; do
        local comp_data="${UI_COMPONENTS[$comp_id]}"
        local comp_use=$(echo "$comp_data" | grep -o '"use_case": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_use" == *"$use_case"* ]]; then
            local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
            echo -e "    ✓ $name"
            ((found_ui++))
        fi
    done
    [[ $found_ui -eq 0 ]] && echo -e "    (none found)"
    
    echo ""
}

# ════════════════════════════════════════════════════════════════════════
# 📤 EXPORT REGISTRY DATA
# ════════════════════════════════════════════════════════════════════════

export_complete_registry() {
    local output_dir="/workspaces/terminal-zsh/docs/registry"
    mkdir -p "$output_dir"
    
    # Calculate stats first
    calculate_registry_stats
    
    local export_file="$output_dir/complete_registry_$(date +%Y%m%d_%H%M%S).json"
    
    {
        echo "{"
        echo '  "export_metadata": {'
        echo '    "name": "Complete Visual Component Registry",'
        echo '    "version": "1.0",'
        echo "    \"exported\": \"$(date -Iseconds)\","
        echo '    "sub_registries": ['
        echo '      "3d", "animations", "colors", "emojis", "ui_elements"'
        echo '    ]'
        echo '  },'
        echo '  "statistics": {'
        echo "    \"3d_components\": ${REGISTRY_STATS[3d_components]},"
        echo "    \"animation_components\": ${REGISTRY_STATS[animation_components]},"
        echo "    \"color_palettes\": ${REGISTRY_STATS[color_palettes]},"
        echo "    \"emoji_sets\": ${REGISTRY_STATS[emoji_sets]},"
        echo "    \"ui_elements\": ${REGISTRY_STATS[ui_elements]},"
        echo "    \"total_components\": ${REGISTRY_STATS[total_components]}"
        echo '  },'
        echo '  "registry_structure": {'
        echo '    "3d_sub_registry": "src/registry/3d_sub_registry.zsh",'
        echo '    "animations_sub_registry": "src/registry/animations_sub_registry.zsh",'
        echo '    "color_palette_sub_registry": "src/registry/color_palette_sub_registry.zsh",'
        echo '    "emojis_sub_registry": "src/registry/emojis_sub_registry.zsh",'
        echo '    "ui_elements_sub_registry": "src/registry/ui_elements_sub_registry.zsh",'
        echo '    "master_registry_coordinator": "src/registry/master_registry_coordinator.zsh"'
        echo '  },'
        echo '  "downloader_scenarios": ['
        echo '    "fast", "secure", "multi-path", "interactive"'
        echo '  ],'
        echo '  "available_themes": ['
        echo '    "quantum_neon", "cyberpunk_dark", "minimal_calm", "high_contrast", "warm_sunset"'
        echo '  ]'
        echo "}"
    } > "$export_file"
    
    echo -e "${QH_SUCCESS}✅ Registry exported to: $export_file${QH_RESET}"
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 INITIALIZATION
# ════════════════════════════════════════════════════════════════════════

# Auto-compose default scenarios
compose_downloader_layout "fast"
compose_downloader_layout "secure"
compose_downloader_layout "multi-path"
compose_downloader_layout "interactive"

# Load themes
load_downloader_themes

# Calculate initial stats
calculate_registry_stats

echo "✅ Master Registry Coordinator initialized with:" >&2
echo "   • ${#3D_COMPONENTS} 3D components" >&2
echo "   • ${#ANIMATION_COMPONENTS} animations" >&2
echo "   • ${#COLOR_PALETTES} color palettes" >&2
echo "   • ${#EMOJI_SETS} emoji sets" >&2
echo "   • ${#UI_COMPONENTS} UI elements" >&2
echo "   • 4 downloader scenarios" >&2
echo "   • 5 theme profiles" >&2

return 0
