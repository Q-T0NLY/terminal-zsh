#!/usr/bin/env zsh
# 🎛️ UI ELEMENTS SUB-REGISTRY
# Borders, Panels, Buttons, Frames, and structural UI components
# ════════════════════════════════════════════════════════════════════════

typeset -gA UI_COMPONENTS
typeset -gA UI_STYLES
typeset -gA UI_SCORES
typeset -gA BORDER_SETS

# ════════════════════════════════════════════════════════════════════════
# 🎨 UI COMPONENT REGISTRATION
# ════════════════════════════════════════════════════════════════════════

register_ui_element() {
    local id="$1"
    local name="$2"
    local element_type="$3"        # border, panel, button, frame, divider, box
    local style="$4"               # single, double, rounded, bold, ascii
    local dimensions="$5"          # "width,height" or "flexible"
    local complexity="$6"          # simple, moderate, complex
    local use_case="$7"
    local function_ref="$8"
    
    UI_COMPONENTS[$id]=$(cat <<-EOF
{
  "name": "$name",
  "type": "$element_type",
  "style": "$style",
  "dimensions": "$dimensions",
  "complexity": "$complexity",
  "use_case": "$use_case",
  "function": "$function_ref",
  "registered": "$(date -Iseconds)"
}
EOF
)
}

register_border_set() {
    local id="$1"
    local name="$2"
    local ascii_set="$3"           # JSON-formatted border characters
    
    BORDER_SETS[$id]="$(cat <<-EOF
{
  "name": "$name",
  "characters": $ascii_set,
  "registered": "$(date -Iseconds)"
}
EOF
)"
}

# ════════════════════════════════════════════════════════════════════════
# 🖼️ BORDER CHARACTER SETS
# ════════════════════════════════════════════════════════════════════════

load_border_sets() {
    
    # Single line borders
    register_border_set \
        "borders_single" \
        "Single Line Borders" \
        '{
            "tl": "┌", "tr": "┐", "bl": "└", "br": "┘",
            "h": "─", "v": "│",
            "cross": "┼", "t_join": "┬", "b_join": "┴", "l_join": "├", "r_join": "┤"
        }'
    
    # Double line borders
    register_border_set \
        "borders_double" \
        "Double Line Borders" \
        '{
            "tl": "╔", "tr": "╗", "bl": "╚", "br": "╝",
            "h": "═", "v": "║",
            "cross": "╬", "t_join": "╦", "b_join": "╩", "l_join": "╠", "r_join": "╣"
        }'
    
    # Rounded borders
    register_border_set \
        "borders_rounded" \
        "Rounded Borders" \
        '{
            "tl": "╭", "tr": "╮", "bl": "╰", "br": "╯",
            "h": "─", "v": "│",
            "cross": "┼", "t_join": "┬", "b_join": "┴", "l_join": "├", "r_join": "┤"
        }'
    
    # Bold borders
    register_border_set \
        "borders_bold" \
        "Bold Borders" \
        '{
            "tl": "┏", "tr": "┓", "bl": "┗", "br": "┛",
            "h": "━", "v": "┃",
            "cross": "╋", "t_join": "┳", "b_join": "┻", "l_join": "┣", "r_join": "┫"
        }'
    
    # ASCII borders
    register_border_set \
        "borders_ascii" \
        "ASCII Borders" \
        '{
            "tl": "+", "tr": "+", "bl": "+", "br": "+",
            "h": "-", "v": "|",
            "cross": "+", "t_join": "+", "b_join": "+", "l_join": "+", "r_join": "+"
        }'
    
    # Heavy borders
    register_border_set \
        "borders_heavy" \
        "Heavy Borders" \
        '{
            "tl": "█", "tr": "█", "bl": "█", "br": "█",
            "h": "█", "v": "█",
            "cross": "█", "t_join": "█", "b_join": "█", "l_join": "█", "r_join": "█"
        }'
    
    # Dotted borders
    register_border_set \
        "borders_dotted" \
        "Dotted Borders" \
        '{
            "tl": "·", "tr": "·", "bl": "·", "br": "·",
            "h": "·", "v": "·",
            "cross": "·", "t_join": "·", "b_join": "·", "l_join": "·", "r_join": "·"
        }'
    
    # Dashed borders
    register_border_set \
        "borders_dashed" \
        "Dashed Borders" \
        '{
            "tl": "╭", "tr": "╮", "bl": "╰", "br": "╯",
            "h": "┈", "v": "┆",
            "cross": "┼", "t_join": "┬", "b_join": "┴", "l_join": "├", "r_join": "┤"
        }'
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 UI COMPONENT DATABASE
# ════════════════════════════════════════════════════════════════════════

load_ui_database() {
    
    # ────────────────────────────────────────────────────────────────────
    # FRAMES & CONTAINERS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_frame_single" \
        "Single Line Frame" \
        "frame" \
        "single" \
        "flexible" \
        "simple" \
        "Standard content containers, basic panels" \
        "draw_frame_single"
    
    register_ui_element \
        "ui_frame_double" \
        "Double Line Frame" \
        "frame" \
        "double" \
        "flexible" \
        "simple" \
        "Important content, highlighted sections" \
        "draw_frame_double"
    
    register_ui_element \
        "ui_frame_rounded" \
        "Rounded Frame" \
        "frame" \
        "rounded" \
        "flexible" \
        "moderate" \
        "Modern panels, dialog boxes, modern UI" \
        "holographic_frame"
    
    register_ui_element \
        "ui_frame_bold" \
        "Bold Frame" \
        "frame" \
        "bold" \
        "flexible" \
        "simple" \
        "Emphasis, critical sections, attention" \
        "draw_frame_bold"
    
    register_ui_element \
        "ui_frame_3d" \
        "3D Perspective Frame" \
        "frame" \
        "double" \
        "flexible" \
        "complex" \
        "Premium displays, showcase panels, depth effects" \
        "quantum_header_3d"
    
    # ────────────────────────────────────────────────────────────────────
    # PANELS & CONTAINERS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_panel_simple" \
        "Simple Panel" \
        "panel" \
        "single" \
        "flexible" \
        "simple" \
        "Basic information display, content boxes" \
        "draw_simple_panel"
    
    register_ui_element \
        "ui_panel_bordered" \
        "Bordered Panel" \
        "panel" \
        "rounded" \
        "flexible" \
        "moderate" \
        "Formatted panels with titles, section headers" \
        "draw_bordered_panel"
    
    register_ui_element \
        "ui_panel_shaded" \
        "Shaded Background Panel" \
        "panel" \
        "single" \
        "flexible" \
        "moderate" \
        "Highlighted sections, background containers" \
        "draw_shaded_panel"
    
    register_ui_element \
        "ui_panel_multi_column" \
        "Multi-Column Panel" \
        "panel" \
        "double" \
        "flexible" \
        "complex" \
        "Tabular data, side-by-side information" \
        "draw_multi_column_panel"
    
    register_ui_element \
        "ui_panel_accordion" \
        "Accordion Panel" \
        "panel" \
        "single" \
        "flexible" \
        "complex" \
        "Expandable/collapsible sections, navigation" \
        "draw_accordion_panel"
    
    # ────────────────────────────────────────────────────────────────────
    # BUTTONS & INTERACTIVE ELEMENTS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_button_simple" \
        "Simple Button" \
        "button" \
        "single" \
        "variable" \
        "simple" \
        "Text action triggers, minimal style" \
        "draw_simple_button"
    
    register_ui_element \
        "ui_button_bordered" \
        "Bordered Button" \
        "button" \
        "rounded" \
        "variable" \
        "moderate" \
        "Highlighted action buttons, interactive elements" \
        "draw_bordered_button"
    
    register_ui_element \
        "ui_button_filled" \
        "Filled Button" \
        "button" \
        "single" \
        "variable" \
        "moderate" \
        "Primary actions, emphasized buttons" \
        "draw_filled_button"
    
    register_ui_element \
        "ui_button_glow" \
        "Glowing Button" \
        "button" \
        "rounded" \
        "variable" \
        "complex" \
        "Premium feel, attention-grabbing, hover effects" \
        "draw_glow_button"
    
    register_ui_element \
        "ui_button_gradient" \
        "Gradient Button" \
        "button" \
        "rounded" \
        "variable" \
        "complex" \
        "Decorative buttons, visual hierarchy" \
        "draw_gradient_button"
    
    # ────────────────────────────────────────────────────────────────────
    # DIVIDERS & SEPARATORS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_divider_simple" \
        "Simple Divider" \
        "divider" \
        "single" \
        "flexible" \
        "simple" \
        "Content separation, section breaks" \
        "draw_simple_divider"
    
    register_ui_element \
        "ui_divider_double" \
        "Double Divider" \
        "divider" \
        "double" \
        "flexible" \
        "simple" \
        "Strong section separation, emphasis" \
        "draw_double_divider"
    
    register_ui_element \
        "ui_divider_wave" \
        "Wave Divider" \
        "divider" \
        "rounded" \
        "flexible" \
        "complex" \
        "Decorative separation, elegant transitions" \
        "draw_wave_divider"
    
    register_ui_element \
        "ui_divider_animated" \
        "Animated Divider" \
        "divider" \
        "rounded" \
        "flexible" \
        "complex" \
        "Dynamic transitions, interactive separators" \
        "draw_animated_divider"
    
    # ────────────────────────────────────────────────────────────────────
    # HEADERS & TITLES
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_header_simple" \
        "Simple Header" \
        "header" \
        "single" \
        "flexible" \
        "simple" \
        "Section titles, basic headings" \
        "draw_simple_header"
    
    register_ui_element \
        "ui_header_decorated" \
        "Decorated Header" \
        "header" \
        "double" \
        "flexible" \
        "moderate" \
        "Important headers, emphasized titles" \
        "draw_decorated_header"
    
    register_ui_element \
        "ui_header_3d" \
        "3D Header" \
        "header" \
        "double" \
        "flexible" \
        "complex" \
        "Premium headers, depth effects, showcase" \
        "quantum_header_3d"
    
    register_ui_element \
        "ui_header_gradient" \
        "Gradient Header" \
        "header" \
        "rounded" \
        "flexible" \
        "complex" \
        "Colorful headers, visual branding" \
        "draw_gradient_header"
    
    # ────────────────────────────────────────────────────────────────────
    # PROGRESS & GAUGE ELEMENTS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_progress_bar" \
        "Progress Bar" \
        "element" \
        "single" \
        "flexible" \
        "simple" \
        "File downloads, task progress, completion status" \
        "draw_progress_bar"
    
    register_ui_element \
        "ui_progress_3d" \
        "3D Progress Bar" \
        "element" \
        "rounded" \
        "flexible" \
        "moderate" \
        "Modern progress display, enhanced visualization" \
        "rounded_progress_3d"
    
    register_ui_element \
        "ui_progress_wave" \
        "Wave Progress" \
        "element" \
        "rounded" \
        "flexible" \
        "complex" \
        "Flowing progress, liquid effect" \
        "draw_wave_progress"
    
    register_ui_element \
        "ui_gauge_circular" \
        "Circular Gauge" \
        "element" \
        "bold" \
        "square" \
        "complex" \
        "Percentage displays, statistics, metrics" \
        "draw_circular_gauge"
    
    # ────────────────────────────────────────────────────────────────────
    # LISTS & TABLES
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_list_simple" \
        "Simple List" \
        "element" \
        "single" \
        "flexible" \
        "simple" \
        "Item lists, bullet points, enumeration" \
        "draw_simple_list"
    
    register_ui_element \
        "ui_list_numbered" \
        "Numbered List" \
        "element" \
        "single" \
        "flexible" \
        "simple" \
        "Ordered items, steps, sequences" \
        "draw_numbered_list"
    
    register_ui_element \
        "ui_table_simple" \
        "Simple Table" \
        "element" \
        "single" \
        "flexible" \
        "moderate" \
        "Data display, structured information" \
        "draw_simple_table"
    
    register_ui_element \
        "ui_table_decorated" \
        "Decorated Table" \
        "element" \
        "double" \
        "flexible" \
        "complex" \
        "Formatted tables, highlighted data" \
        "draw_decorated_table"
    
    # ────────────────────────────────────────────────────────────────────
    # BOXES & HIGHLIGHTS
    # ────────────────────────────────────────────────────────────────────
    
    register_ui_element \
        "ui_box_simple" \
        "Simple Box" \
        "box" \
        "single" \
        "flexible" \
        "simple" \
        "Information boxes, emphasis areas" \
        "draw_simple_box"
    
    register_ui_element \
        "ui_box_shadow" \
        "Shadowed Box" \
        "box" \
        "double" \
        "flexible" \
        "moderate" \
        "3D effect boxes, depth simulation" \
        "draw_shadow_box"
    
    register_ui_element \
        "ui_box_glow" \
        "Glowing Box" \
        "box" \
        "rounded" \
        "flexible" \
        "complex" \
        "Highlighted boxes, attention elements" \
        "draw_glow_box"
    
    register_ui_element \
        "ui_highlight_bar" \
        "Highlight Bar" \
        "element" \
        "single" \
        "flexible" \
        "simple" \
        "Information highlights, emphasis bars" \
        "draw_highlight_bar"
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 UI COMPONENT SCORING
# ════════════════════════════════════════════════════════════════════════

calculate_ui_score() {
    local comp_id="$1"
    local comp_data="${UI_COMPONENTS[$comp_id]}"
    
    local element_type=$(echo "$comp_data" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
    local style=$(echo "$comp_data" | grep -o '"style": "[^"]*"' | cut -d'"' -f4)
    local complexity=$(echo "$comp_data" | grep -o '"complexity": "[^"]*"' | cut -d'"' -f4)
    
    # Scoring dimensions
    local usability=0
    local visual_appeal=0
    local simplicity=0
    local versatility=0
    
    # 1️⃣ USABILITY
    case "$element_type" in
        frame|panel|button|element) usability=90 ;;
        header|divider) usability=80 ;;
        box) usability=75 ;;
    esac
    
    # 2️⃣ VISUAL APPEAL
    case "$style" in
        rounded|gradient|3d) visual_appeal=95 ;;
        double|bold) visual_appeal=85 ;;
        single) visual_appeal=70 ;;
        ascii) visual_appeal=60 ;;
    esac
    
    # 3️⃣ SIMPLICITY
    case "$complexity" in
        simple) simplicity=100 ;;
        moderate) simplicity=75 ;;
        complex) simplicity=50 ;;
    esac
    
    # 4️⃣ VERSATILITY
    case "$element_type" in
        frame|panel) versatility=95 ;;
        element|box) versatility=85 ;;
        button|header) versatility=80 ;;
        divider) versatility=70 ;;
    esac
    
    # Final UI Score
    local score=$(( 
        (usability * 30 + 
         visual_appeal * 25 + 
         simplicity * 20 + 
         versatility * 25) / 100
    ))
    
    UI_SCORES[$comp_id]="$(cat <<-EOF
{
  "ui_score": $score,
  "usability": $usability,
  "visual_appeal": $visual_appeal,
  "simplicity": $simplicity,
  "versatility": $versatility
}
EOF
)"
    
    return $score
}

# ════════════════════════════════════════════════════════════════════════
# 🔍 UI QUERIES
# ════════════════════════════════════════════════════════════════════════

list_ui_by_type() {
    local element_type="$1"
    
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║            🎛️ UI Elements: $element_type                           ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    for comp_id in ${(k)UI_COMPONENTS}; do
        local comp_data="${UI_COMPONENTS[$comp_id]}"
        local comp_type=$(echo "$comp_data" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_type" == "$element_type" ]]; then
            local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
            local style=$(echo "$comp_data" | grep -o '"style": "[^"]*"' | cut -d'"' -f4)
            local score_data="${UI_SCORES[$comp_id]}"
            local score=$(echo "$score_data" | grep -o '"ui_score": [0-9]*' | grep -o '[0-9]*' 2>/dev/null || echo "N/A")
            
            printf "  %-30s [%-7s] Score: %s\n" "$name" "$style" "$score"
        fi
    done
    
    echo ""
}

list_all_ui_elements() {
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║              🎛️  UI ELEMENTS REGISTRY                          ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    for comp_id in ${(k)UI_COMPONENTS}; do
        local comp_data="${UI_COMPONENTS[$comp_id]}"
        local score_data="${UI_SCORES[$comp_id]}"
        
        local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
        local type=$(echo "$comp_data" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
        local score=$(echo "$score_data" | grep -o '"ui_score": [0-9]*' | grep -o '[0-9]*' 2>/dev/null || echo "N/A")
        
        printf "  %-30s [%-10s] Score: %s\n" "$name" "$type" "$score"
    done
    
    echo ""
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 INITIALIZATION
# ════════════════════════════════════════════════════════════════════════

load_border_sets
load_ui_database

# Calculate scores
for comp_id in ${(k)UI_COMPONENTS}; do
    calculate_ui_score "$comp_id" >/dev/null
done

echo "✅ UI Elements Sub-Registry loaded with ${#UI_COMPONENTS} components and ${#BORDER_SETS} border sets" >&2
return 0
