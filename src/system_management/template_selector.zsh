#!/usr/bin/env zsh
# 🎭 TEMPLATE SELECTOR & LAYOUT SWITCHER
# 📂 Multi-Template Visual System Manager
# 📅 Deployed: December 12, 2025
# 🔄 Status: DYNAMIC LAYOUT SWITCHING ENABLED

# ==================== TEMPLATE REGISTRY ====================
# Central registry of all available visual templates

export TEMPLATE_ROOT="${TEMPLATE_ROOT:-/workspaces/terminal-zsh/templates}"
export ACTIVE_TEMPLATE="${ACTIVE_TEMPLATE:-quantum-nexus-v4}"

# ==================== AVAILABLE TEMPLATES ====================
declare -A TEMPLATES=(
    # Quantum Nexus v4.0 - Latest paradigm-shifting engine
    ["quantum-nexus-v4"]="quantum_neural_nexus.zsh|Paradigm-shifting neural-quantum interface|quantum_nexus_v4"
    
    # Legacy Quantum Systems (Preserved as Templates)
    ["quantum-holographic-v3"]="quantum_holographic.zsh|Holographic reality interface (v3.0)|quantum_v3"
    ["quantum-suite-v3"]="quantum_download_suite.zsh|Advanced download visualization (v3.0)|quantum_suite"
    ["quantum-dashboard-v3"]="quantum_dashboard.zsh|Classic dashboard system (v3.0)|quantum_dashboard"
    
    # Sub-Registry Templates (Component-based)
    ["registry-3d"]="3d_sub_registry.zsh|3D visualization components|registry_3d"
    ["registry-animations"]="animations_sub_registry.zsh|Animation effects library|registry_animations"
    ["registry-colors"]="color_palette_sub_registry.zsh|Color palette system|registry_colors"
    ["registry-emojis"]="emojis_sub_registry.zsh|Emoji intelligence arrays|registry_emojis"
    ["registry-ui"]="ui_elements_sub_registry.zsh|UI component library|registry_ui"
    
    # Orchestration & Coordination
    ["master-registry"]="master_registry_coordinator.zsh|Master registry orchestrator|master_registry"
    ["downloader-layout"]="quantum_downloader_layout.zsh|Downloader interface layout|downloader"
)

# ==================== GET TEMPLATE INFO ====================
get_template_info() {
    local template_key="$1"
    local info="${TEMPLATES[$template_key]}"
    
    if [[ -z "$info" ]]; then
        echo "ERROR: Template not found: $template_key"
        return 1
    fi
    
    # Parse: file|description|shorthand
    IFS='|' read -r file description shorthand <<< "$info"
    
    case "${2:-file}" in
        file) echo "$file" ;;
        description) echo "$description" ;;
        shorthand) echo "$shorthand" ;;
        *) echo "$info" ;;
    esac
}

# ==================== LIST AVAILABLE TEMPLATES ====================
list_templates() {
    echo ""
    echo "  📚 AVAILABLE VISUAL TEMPLATES"
    echo ""
    
    # Group templates by category
    local categories=(
        "Core Engines:quantum-nexus-v4"
        "Legacy Systems:quantum-holographic-v3,quantum-suite-v3,quantum-dashboard-v3"
        "Component Registries:registry-3d,registry-animations,registry-colors,registry-emojis,registry-ui"
        "Orchestration:master-registry,downloader-layout"
    )
    
    for category_def in "${categories[@]}"; do
        IFS=':' read -r category templates <<< "$category_def"
        
        echo -e "  \033[38;2;0;255;187m━━━ $category ━━━\033[0m"
        echo ""
        
        IFS=',' read -ra template_list <<< "$templates"
        
        for ((i=0; i<${#template_list[@]}; i++)); do
            local template_key="${template_list[$i]}"
            local description=$(get_template_info "$template_key" "description")
            local file=$(get_template_info "$template_key" "file")
            local status=""
            
            if [[ "$template_key" == "$ACTIVE_TEMPLATE" ]]; then
                status=" ✨ ACTIVE"
                echo -e "  \033[38;2;85;221;255m✓\033[0m $template_key$status"
            else
                echo -e "  \033[38;2;170;170;170m○\033[0m $template_key"
            fi
            
            echo -e "    \033[38;2;150;150;150m→ $description\033[0m"
            echo ""
        done
    done
}

# ==================== SWITCH TEMPLATE ====================
switch_template() {
    local template_key="$1"
    
    if [[ -z "$template_key" ]]; then
        echo "Error: No template specified"
        return 1
    fi
    
    # Verify template exists
    if [[ -z "${TEMPLATES[$template_key]}" ]]; then
        echo -e "  \033[38;2;255;68;153m❌ Template not found: $template_key\033[0m"
        echo ""
        list_templates
        return 1
    fi
    
    local file=$(get_template_info "$template_key" "file")
    local description=$(get_template_info "$template_key" "description")
    
    echo ""
    echo -e "  \033[38;2;0;255;187m🔄 Switching Template\033[0m"
    echo ""
    echo -e "    From: \033[38;2;170;170;170m$ACTIVE_TEMPLATE\033[0m"
    echo -e "    To:   \033[38;2;0;255;187m$template_key\033[0m"
    echo -e "    Desc: \033[38;2;85;221;255m$description\033[0m"
    echo ""
    
    # Attempt to source the template
    local template_path="/workspaces/terminal-zsh/src/registry/$file"
    
    # Check multiple locations
    if [[ ! -f "$template_path" ]]; then
        template_path="/workspaces/terminal-zsh/src/visuals/$file"
    fi
    
    if [[ ! -f "$template_path" ]]; then
        template_path="/workspaces/terminal-zsh/src/core/$file"
    fi
    
    if [[ ! -f "$template_path" ]]; then
        template_path="/workspaces/terminal-zsh/$file"
    fi
    
    if [[ ! -f "$template_path" ]]; then
        echo -e "  \033[38;2;255;68;153m❌ Template file not found: $file\033[0m"
        return 1
    fi
    
    # Source the template
    echo -ne "  \033[38;2;85;221;255m⚡ Loading...\033[0m"
    
    if source "$template_path" 2>/dev/null; then
        ACTIVE_TEMPLATE="$template_key"
        export ACTIVE_TEMPLATE
        
        echo -e "\r\033[K  \033[38;2;0;255;187m✅ Template activated: $template_key\033[0m"
        echo ""
        
        return 0
    else
        echo -e "\r\033[K  \033[38;2;255;68;153m❌ Failed to load template\033[0m"
        return 1
    fi
}

# ==================== GET ACTIVE TEMPLATE ====================
get_active_template() {
    echo "$ACTIVE_TEMPLATE"
}

# ==================== SHOW TEMPLATE STATUS ====================
show_template_status() {
    echo ""
    echo -e "  \033[38;2;0;255;187m📊 TEMPLATE STATUS\033[0m"
    echo ""
    
    local active=$(get_template_info "$ACTIVE_TEMPLATE" "description")
    local file=$(get_template_info "$ACTIVE_TEMPLATE" "file")
    
    echo -e "  Current Template: \033[38;2;0;255;187m$ACTIVE_TEMPLATE\033[0m"
    echo -e "  Description:      \033[38;2;85;221;255m$active\033[0m"
    echo -e "  Source File:      \033[38;2;170;170;170m$file\033[0m"
    echo ""
}

# ==================== TEMPLATE COMMAND CENTER ====================
template_command_center() {
    local running=true
    
    while $running; do
        clear
        
        echo ""
        echo "  ╔═══════════════════════════════════════════════════════════════════════════════╗"
        echo "  ║                                                                               ║"
        echo "  ║              🎭 TEMPLATE SELECTOR & LAYOUT SWITCHER 🎭                       ║"
        echo "  ║                                                                               ║"
        echo "  ║              Multi-Template Visual System Management                         ║"
        echo "  ║                                                                               ║"
        echo "  ╚═══════════════════════════════════════════════════════════════════════════════╝"
        echo ""
        
        show_template_status
        
        echo -e "  \033[38;2;0;255;187m┌─── OPTIONS ───────────────────────────────────────────────────────────────┐\033[0m"
        echo -e "  \033[38;2;0;255;187m│                                                                            │\033[0m"
        echo -e "  \033[38;2;85;221;255m│  [1] List All Templates        📚  View all available visual templates   │\033[0m"
        echo -e "  \033[38;2;0;255;187m│  [2] Switch Template           🔄  Change active template/layout         │\033[0m"
        echo -e "  \033[38;2;85;221;255m│  [3] Show Template Details     📋  View detailed template information   │\033[0m"
        echo -e "  \033[38;2;0;255;187m│  [4] Launch Active Template    🚀  Run current template's main command  │\033[0m"
        echo -e "  \033[38;2;85;221;255m│  [5] Template Info             ℹ️  Show current template metadata       │\033[0m"
        echo -e "  \033[38;2;0;255;187m│  [6] Exit Selector             🚪  Return to main interface            │\033[0m"
        echo -e "  \033[38;2;0;255;187m│                                                                            │\033[0m"
        echo -e "  \033[38;2;0;255;187m└────────────────────────────────────────────────────────────────────────────┘\033[0m"
        echo ""
        
        echo -e "  \033[38;2;170;85;255m💫 Select option (1-6):\033[0m "
        read -r choice
        
        case "$choice" in
            1)
                list_templates
                echo ""
                read -p "  Press [Enter] to continue..." -t 3
                ;;
            2)
                echo ""
                echo -e "  \033[38;2;85;221;255m🔄 SWITCH TEMPLATE\033[0m"
                echo ""
                list_templates
                echo ""
                echo -e "  \033[38;2;170;85;255m📝 Enter template key:\033[0m "
                read -r template_choice
                switch_template "$template_choice"
                echo ""
                read -p "  Press [Enter] to continue..." -t 2
                ;;
            3)
                echo ""
                echo -e "  \033[38;2;85;221;255m📋 TEMPLATE DETAILS\033[0m"
                echo ""
                
                local active_desc=$(get_template_info "$ACTIVE_TEMPLATE" "description")
                local active_file=$(get_template_info "$ACTIVE_TEMPLATE" "file")
                
                echo -e "  \033[38;2;0;255;187mTemplate Key:   \033[0m$ACTIVE_TEMPLATE"
                echo -e "  \033[38;2;0;255;187mDescription:    \033[0m$active_desc"
                echo -e "  \033[38;2;0;255;187mSource File:    \033[0m$active_file"
                echo ""
                
                read -p "  Press [Enter] to continue..." -t 3
                ;;
            4)
                echo ""
                echo -e "  \033[38;2;0;255;187m🚀 LAUNCHING ACTIVE TEMPLATE\033[0m"
                echo ""
                
                case "$ACTIVE_TEMPLATE" in
                    quantum-nexus-v4)
                        echo "  Launching Quantum Neural Nexus v4.0..."
                        echo "  Executing: nexus_command_center"
                        # Template would launch its main function
                        ;;
                    *)
                        echo "  Template: $ACTIVE_TEMPLATE"
                        echo "  Ready to launch..."
                        ;;
                esac
                
                echo ""
                read -p "  Press [Enter] to continue..." -t 3
                ;;
            5)
                show_template_status
                read -p "  Press [Enter] to continue..." -t 3
                ;;
            6)
                running=false
                clear
                echo ""
                echo -e "  \033[38;2;0;255;187m✨ Template Selector deactivating...\033[0m"
                echo ""
                ;;
            *)
                echo -e "  \033[38;2;255;68;153m❌ Invalid choice\033[0m"
                sleep 2
                ;;
        esac
    done
}

# ==================== EXPORT FUNCTIONS ====================
export -f get_template_info
export -f list_templates
export -f switch_template
export -f get_active_template
export -f show_template_status
export -f template_command_center

# ==================== LAUNCH COMMAND CENTER ====================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]] || [[ "$1" == "run" ]]; then
    template_command_center
fi

echo -e "\033[38;2;0;255;187m[Template System] Selector initialized with ${#TEMPLATES[@]} templates\033[0m" >&2
return 0
