#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ NEXUS AI DASHBOARD - YAML CONFIGURATION LOADER                               ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝
#
# Loads dashboard configuration from YAML and renders it
# Usage: ./load_yaml_dashboard.zsh [config.yaml]

set -eo pipefail

# Load the layout engine
SCRIPT_DIR="${0:a:h}"
source "${SCRIPT_DIR}/../src/ui/hyper_dashboard_layout_engine.zsh"

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 📋 YAML PARSER (Pure ZSH Implementation)                                     ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

typeset -gA CONFIG
typeset -ga PANELS_DATA

parse_yaml() {
  local yaml_file="$1"
  local current_section=""
  local current_panel=-1
  local indent_level=0
  local in_panel=false
  local in_multiline=false
  local multiline_key=""
  local multiline_content=""
  
  while IFS= read -r line; do
    # Skip comments and empty lines
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// }" ]] && continue
    
    # Detect multiline content (|)
    if [[ "$line" =~ ^[[:space:]]*([a-z_]+):[[:space:]]*\| ]]; then
      in_multiline=true
      multiline_key="${match[1]}"
      multiline_content=""
      continue
    fi
    
    # Collect multiline content
    if $in_multiline; then
      if [[ "$line" =~ ^[[:space:]]{6,}(.+)$ ]]; then
        multiline_content+="${match[1]}\n"
        continue
      else
        # End of multiline
        in_multiline=false
        if $in_panel && [[ -n "$multiline_key" ]]; then
          PANELS_DATA[$current_panel]+="content_data='${multiline_content}' "
        fi
        multiline_key=""
        multiline_content=""
      fi
    fi
    
    # Parse key-value pairs
    if [[ "$line" =~ ^([[:space:]]*)([a-z_]+):[[:space:]]*\"?([^\"]*)\"? ]]; then
      local indent="${match[1]}"
      local key="${match[2]}"
      local value="${match[3]}"
      
      # Remove trailing quotes
      value="${value%\"}"
      
      # Determine section
      case "$key" in
        branding|theme|layout|panels|keybindings|ui|advanced|colors)
          current_section="$key"
          ;;
        
        # Branding
        title|subtitle|author|version)
          [[ "$current_section" == "branding" ]] && CONFIG[branding_$key]="$value"
          ;;
        
        # Theme
        gradient|border)
          [[ "$current_section" == "theme" ]] && CONFIG[theme_$key]="$value"
          ;;
        
        # Layout
        preset)
          CONFIG[layout_preset]="$value"
          ;;
        
        margin_x|margin_y|gap_x|gap_y)
          CONFIG[spacing_$key]="$value"
          ;;
        
        # Panel detection
        id)
          if [[ "$current_section" == "panels" ]]; then
            in_panel=true
            ((current_panel++))
            PANELS_DATA[$current_panel]="id='$value' "
          fi
          ;;
        
        # Panel properties
        title)
          $in_panel && PANELS_DATA[$current_panel]+="title='$value' "
          ;;
        
        x|y|width|height)
          $in_panel && PANELS_DATA[$current_panel]+="${key}='$value' "
          ;;
        
        enabled)
          $in_panel && PANELS_DATA[$current_panel]+="enabled='$value' "
          ;;
        
        type)
          $in_panel && PANELS_DATA[$current_panel]+="content_type='$value' "
          ;;
        
        data)
          if $in_panel && [[ -n "$value" ]]; then
            PANELS_DATA[$current_panel]+="content_data='$value' "
          fi
          ;;
      esac
    fi
  done < "$yaml_file"
}

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 🎨 DASHBOARD RENDERER                                                        ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

render_yaml_dashboard() {
  clear
  
  # Render header
  local title_text=$(layout_apply_gradient "${CONFIG[branding_title]}" "${CONFIG[theme_gradient]}")
  
  echo ""
  echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
  echo "║                                                                               ║"
  printf "║  %b  ║\n" "$title_text"
  echo "║  ${CONFIG[branding_subtitle]}  ║"
  echo "║                                                                               ║"
  echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Clear existing panels
  PANEL_REGISTRY=()
  PANEL_ORDER=()
  
  # Create panels from YAML config
  for panel_data in "${PANELS_DATA[@]}"; do
    # Parse panel attributes
    local id title x y width height enabled content_type content_data
    eval "$panel_data"
    
    # Skip disabled panels
    [[ "$enabled" == "false" ]] && continue
    
    # Create panel
    layout_create_panel "$id" "$title" "$width" "$height" "$x" "$y"
    
    # Render panel with content
    local border_style="${CONFIG[theme_border]:-double}"
    layout_render_panel "$id" "$content_data" "$border_style"
  done
  
  # Render footer
  echo ""
  echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
  echo "║ CONTROLS: [Q]uit [R]efresh [H]elp [S]tats                                    ║"
  echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
}

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ ⌨️  INTERACTIVE MODE                                                          ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

interactive_mode() {
  local yaml_file="$1"
  
  while true; do
    render_yaml_dashboard
    
    # Read keypress
    read -k 1 -s key
    
    case "$key" in
      q|Q)
        clear
        echo "Thank you for using ${CONFIG[branding_title]}!"
        echo ""
        exit 0
        ;;
      
      r|R)
        # Reload YAML and refresh
        parse_yaml "$yaml_file"
        ;;
      
      h|H)
        show_help
        ;;
      
      s|S)
        clear
        layout_show_stats
        echo ""
        read -k 1 -s -p "Press any key to continue..."
        ;;
      
      e|E)
        # Edit YAML file
        ${EDITOR:-nano} "$yaml_file"
        parse_yaml "$yaml_file"
        ;;
      
      *)
        # Unknown key
        ;;
    esac
  done
}

show_help() {
  clear
  cat <<'EOF'
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         YAML DASHBOARD HELP                                   ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  KEYBOARD SHORTCUTS:                                                          ║
║  ═══════════════════                                                          ║
║                                                                               ║
║  Q ............ Quit dashboard                                                ║
║  R ............ Reload YAML config & refresh                                  ║
║  H ............ Show this help                                                ║
║  S ............ Show statistics                                               ║
║  E ............ Edit YAML config file                                         ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  CONFIGURATION:                                                               ║
║  ══════════════                                                               ║
║                                                                               ║
║  The dashboard is configured via YAML file:                                   ║
║                                                                               ║
║  • Branding: Title, subtitle, colors                                          ║
║  • Theme: Gradients, borders, effects                                         ║
║  • Layout: Presets or custom panel positions                                  ║
║  • Panels: Define position, size, content                                     ║
║  • Keybindings: Custom keyboard shortcuts                                     ║
║                                                                               ║
║  Edit the YAML file to customize your dashboard!                              ║
║  Changes take effect after pressing R (reload).                               ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Press any key to return to dashboard...
EOF
  
  read -k 1 -s
}

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ 🚀 MAIN ENTRY POINT                                                          ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

main() {
  local yaml_file="${1:-${SCRIPT_DIR}/../config/dashboard.yaml}"
  
  # Check if YAML file exists
  if [[ ! -f "$yaml_file" ]]; then
    echo "Error: YAML config file not found: $yaml_file"
    echo ""
    echo "Usage: $0 [config.yaml]"
    echo ""
    echo "Example:"
    echo "  $0 config/dashboard.yaml"
    exit 1
  fi
  
  # Parse YAML configuration
  echo "Loading configuration from: $yaml_file"
  parse_yaml "$yaml_file"
  
  echo "Configuration loaded!"
  echo "  Title: ${CONFIG[branding_title]}"
  echo "  Panels: ${#PANELS_DATA[@]}"
  echo "  Theme: ${CONFIG[theme_gradient]} / ${CONFIG[theme_border]}"
  echo ""
  echo "Starting dashboard..."
  sleep 2
  
  # Enter interactive mode
  interactive_mode "$yaml_file"
}

# Run main
main "$@"
