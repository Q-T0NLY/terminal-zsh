#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║ NEXUS AI DASHBOARD - YAML DEMO (Standalone)                                  ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

# Quick demo showing the YAML config in action
# Run: ./yaml_dashboard_demo.zsh

clear

cat <<'DEMO'
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗                                ║
║  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝                                ║
║  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗                                ║
║  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║                                ║
║  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║                                ║
║  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                                ║
║                                                                               ║
║              YAML DASHBOARD CONFIGURATION - DEMO                              ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

DEMO

echo ""
echo "🎯 YAML Dashboard System Demonstration"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Show the YAML file location
YAML_FILE="/workspaces/terminal-zsh/config/dashboard.yaml"

if [[ -f "$YAML_FILE" ]]; then
    echo "✅ Configuration file found: $YAML_FILE"
    echo ""
    
    # Show file stats
    local lines=$(wc -l < "$YAML_FILE")
    local size=$(du -h "$YAML_FILE" | cut -f1)
    
    echo "📊 File Statistics:"
    echo "   Lines: $lines"
    echo "   Size:  $size"
    echo ""
    
    # Parse and show key sections
    echo "📋 Configuration Summary:"
    echo "─────────────────────────────────────────────────────────────────────────"
    
    # Extract title
    local title=$(grep "^  title:" "$YAML_FILE" | head -1 | sed 's/.*"\(.*\)"/\1/')
    echo "   Dashboard Title: $title"
    
    # Extract gradient
    local gradient=$(grep "^  gradient:" "$YAML_FILE" | sed 's/.*"\(.*\)"/\1/')
    echo "   Theme Gradient:  $gradient"
    
    # Extract border
    local border=$(grep "^  border:" "$YAML_FILE" | sed 's/.*"\(.*\)"/\1/')
    echo "   Border Style:    $border"
    
    # Extract preset
    local preset=$(grep "^  preset:" "$YAML_FILE" | sed 's/.*"\(.*\)"/\1/')
    echo "   Layout Preset:   $preset"
    
    # Count panels
    local panel_count=$(grep "^  - id:" "$YAML_FILE" | wc -l)
    echo "   Total Panels:    $panel_count"
    
    echo ""
    echo "📦 Panel Configuration:"
    echo "─────────────────────────────────────────────────────────────────────────"
    
    # Show panel details
    grep "^  - id:" "$YAML_FILE" -A 2 | grep -E "id:|title:" | while read line; do
        if [[ "$line" =~ id:.*\"(.*)\" ]]; then
            printf "   • %-20s" "${match[1]}"
        elif [[ "$line" =~ title:.*\"(.*)\" ]]; then
            echo "→ ${match[1]}"
        fi
    done
    
    echo ""
    echo "⌨️  Keyboard Shortcuts Configured:"
    echo "─────────────────────────────────────────────────────────────────────────"
    echo "   q - Quit dashboard"
    echo "   r - Refresh display"
    echo "   h - Show help"
    echo "   s - Show statistics"
    echo "   1 - Switch to Grid 4 layout"
    echo "   2 - Switch to Grid 6 layout"
    echo "   3 - Switch to Golden Ratio layout"
    echo "   c - Switch to Centered layout"
    echo "   t - Cycle theme/gradient"
    echo "   b - Cycle border style"
    echo ""
    
    echo "🎨 Visual Features:"
    echo "─────────────────────────────────────────────────────────────────────────"
    
    # Show available gradients
    echo "   Gradients Available:"
    echo "     🌈 rainbow  - Full spectrum (vibrant)"
    echo "     🌊 ocean    - Blue to cyan (professional)"
    echo "     🌅 sunset   - Orange to yellow (warm)"
    echo "     🌌 aurora   - Blue to purple (futuristic)"
    echo "     🔥 fire     - Red to orange (intense)"
    echo ""
    
    echo "   Border Styles Available:"
    echo "     ╔═══╗ double   - Professional, formal"
    echo "     ┌───┐ single   - Clean, minimal"
    echo "     ╭───╮ rounded  - Modern, friendly"
    echo "     ┏━━━┓ thick    - Bold, prominent"
    echo "     +---+ ascii    - Compatible, safe"
    echo ""
    
    echo "📝 Sample YAML Content:"
    echo "─────────────────────────────────────────────────────────────────────────"
    
    # Show a snippet of the YAML
    echo ""
    sed -n '/^branding:/,/^$/p' "$YAML_FILE" | head -10
    echo "   ..."
    echo ""
    
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "🚀 How to Use:"
    echo ""
    echo "   1. View the config:    less $YAML_FILE"
    echo "   2. Edit the config:    nano $YAML_FILE"
    echo "   3. Load & run:         ./examples/load_yaml_dashboard.zsh"
    echo ""
    echo "   OR customize manually:"
    echo "   1. Copy template:      cp examples/dashboard_layout_template.zsh my_dash.zsh"
    echo "   2. Edit sections:      nano my_dash.zsh"
    echo "   3. Run your dash:      ./my_dash.zsh"
    echo ""
    
    echo "📚 Documentation:"
    echo "   • Full Guide:     docs/HYPER_DASHBOARD_LAYOUT_GUIDE.md"
    echo "   • Template Guide: docs/TEMPLATE_USAGE_GUIDE.md"
    echo "   • YAML Config:    config/dashboard.yaml"
    echo ""
    
    echo "✨ Features Implemented:"
    echo "   ✅ Visually enhanced YAML configuration"
    echo "   ✅ Auto-scaling & auto-centering layouts"
    echo "   ✅ 5 gradient themes (rainbow, ocean, sunset, aurora, fire)"
    echo "   ✅ 5 border styles (double, single, rounded, thick, ascii)"
    echo "   ✅ 5 layout presets (grid_4, grid_6, sidebar, centered, golden)"
    echo "   ✅ Custom keyboard shortcuts"
    echo "   ✅ Panel content templates"
    echo "   ✅ Header & footer customization"
    echo "   ✅ Responsive breakpoints"
    echo "   ✅ Performance optimization settings"
    echo ""
    
else
    echo "❌ Configuration file not found: $YAML_FILE"
    echo ""
    echo "The YAML configuration should be at: config/dashboard.yaml"
fi

echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Press any key to view the full YAML configuration..."
read -k 1 -s

# Display the full YAML with syntax highlighting (if available)
if command -v bat &>/dev/null; then
    bat --style=full --language=yaml "$YAML_FILE"
elif command -v pygmentize &>/dev/null; then
    pygmentize -l yaml "$YAML_FILE"
else
    # Fallback to less with color
    less -R "$YAML_FILE"
fi

echo ""
echo "✨ Demo complete! The YAML configuration is ready for use."
echo ""
