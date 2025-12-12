#!/usr/bin/env zsh
# 🎨 COLOR PALETTE SUB-REGISTRY  
# Comprehensive color management system for Quantum Downloader
# ════════════════════════════════════════════════════════════════════════

typeset -gA COLOR_PALETTES
typeset -gA COLOR_SCHEMES
typeset -gA GRADIENT_EFFECTS
typeset -gA COLOR_SCORES

# ════════════════════════════════════════════════════════════════════════
# 🌈 QUANTUM NEON PALETTE DEFINITION
# ════════════════════════════════════════════════════════════════════════

# Primary Neon Colors
export QH_SUCCESS="\033[38;2;0;255;204m"       # Cyber Cyan
export QH_INFO="\033[38;2;64;224;240m"         # Holographic Blue
export QH_WARNING="\033[38;2;255;215;0m"       # Golden Pulse
export QH_ERROR="\033[38;2;255;20;147m"        # Neon Magenta
export QH_ACCENT="\033[38;2;147;112;219m"      # Quantum Purple
export QH_HIGHLIGHT="\033[38;2;0;247;255m"     # Arctic Glow
export QH_DARK="\033[38;2;25;25;40m"           # Void Black
export QH_LIGHT="\033[38;2;255;255;255m"       # Pure White
export QH_GLOW="\033[38;2;200;220;255m"        # Holo Glow
export QH_NEON="\033[38;2;0;255;255m"          # Neon Cyan

# Background Colors
export QH_BG_DARK="\033[48;2;10;10;20m"
export QH_BG_LIGHT="\033[48;2;30;30;50m"

# ════════════════════════════════════════════════════════════════════════
# 📦 PALETTE REGISTRATION
# ════════════════════════════════════════════════════════════════════════

register_palette() {
    local id="$1"
    local name="$2"
    local theme_type="$3"      # quantum, neon, dark, light, gradient
    local mood="$4"            # aggressive, calm, neutral, vibrant, etc.
    local accessibility="$5"   # wcag_aaa, wcag_aa, none
    local colors_json="$6"
    
    COLOR_PALETTES[$id]=$(cat <<-EOF
{
  "name": "$name",
  "type": "$theme_type",
  "mood": "$mood",
  "accessibility": "$accessibility",
  "colors": $colors_json,
  "registered": "$(date -Iseconds)"
}
EOF
)
}

register_gradient() {
    local id="$1"
    local name="$2"
    local start_color="$3"     # RGB tuple "R,G,B"
    local end_color="$4"       # RGB tuple "R,G,B"
    local steps="${5:-20}"
    local animation="${6:-false}"
    
    GRADIENT_EFFECTS[$id]=$(cat <<-EOF
{
  "name": "$name",
  "start": "$start_color",
  "end": "$end_color",
  "steps": $steps,
  "animated": $animation,
  "registered": "$(date -Iseconds)"
}
EOF
)
}

# ════════════════════════════════════════════════════════════════════════
# 🎨 PREDEFINED COLOR PALETTES
# ════════════════════════════════════════════════════════════════════════

load_color_database() {
    
    # ────────────────────────────────────────────────────────────────────
    # QUANTUM NEON THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_quantum_neon" \
        "Quantum Neon Theme" \
        "quantum" \
        "vibrant" \
        "wcag_aa" \
        '{
            "primary": "0,255,204",
            "secondary": "64,224,240", 
            "accent": "147,112,219",
            "highlight": "0,247,255",
            "success": "0,255,204",
            "warning": "255,215,0",
            "error": "255,20,147",
            "info": "64,224,240",
            "dark": "25,25,40",
            "light": "255,255,255"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # CYBERPUNK DARK THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_cyberpunk_dark" \
        "Cyberpunk Dark Theme" \
        "neon" \
        "aggressive" \
        "wcag_aa" \
        '{
            "primary": "255,0,127",
            "secondary": "0,255,255",
            "accent": "255,0,255",
            "highlight": "0,255,127",
            "success": "0,255,127",
            "warning": "255,200,0",
            "error": "255,0,0",
            "info": "0,200,255",
            "dark": "10,10,20",
            "light": "200,200,200"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # MINIMAL CALM THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_minimal_calm" \
        "Minimal Calm Theme" \
        "light" \
        "calm" \
        "wcag_aaa" \
        '{
            "primary": "70,130,180",
            "secondary": "100,149,237",
            "accent": "75,0,130",
            "highlight": "176,196,222",
            "success": "34,139,34",
            "warning": "218,165,32",
            "error": "220,20,60",
            "info": "100,149,237",
            "dark": "47,79,79",
            "light": "240,248,255"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # HIGH CONTRAST THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_high_contrast" \
        "High Contrast Accessibility" \
        "dark" \
        "neutral" \
        "wcag_aaa" \
        '{
            "primary": "0,0,0",
            "secondary": "255,255,255",
            "accent": "255,0,0",
            "highlight": "255,255,0",
            "success": "0,255,0",
            "warning": "255,165,0",
            "error": "255,0,0",
            "info": "0,0,255",
            "dark": "0,0,0",
            "light": "255,255,255"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # WARM SUNSET THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_warm_sunset" \
        "Warm Sunset Theme" \
        "gradient" \
        "calm" \
        "wcag_aa" \
        '{
            "primary": "255,127,39",
            "secondary": "255,188,67",
            "accent": "238,82,83",
            "highlight": "255,205,86",
            "success": "76,175,80",
            "warning": "255,152,0",
            "error": "244,67,54",
            "info": "66,165,245",
            "dark": "56,34,22",
            "light": "255,243,224"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # ICE COLD THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_ice_cold" \
        "Ice Cold Theme" \
        "light" \
        "calm" \
        "wcag_aa" \
        '{
            "primary": "0,188,212",
            "secondary": "144,202,249",
            "accent": "100,181,246",
            "highlight": "129,199,247",
            "success": "0,150,136",
            "warning": "33,150,243",
            "error": "244,67,54",
            "info": "3,155,229",
            "dark": "33,150,243",
            "light": "224,242,254"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # MATRIX RAIN THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_matrix_rain" \
        "Matrix Rain Theme" \
        "neon" \
        "aggressive" \
        "wcag_aa" \
        '{
            "primary": "0,255,0",
            "secondary": "0,200,0",
            "accent": "0,255,0",
            "highlight": "255,255,0",
            "success": "0,255,0",
            "warning": "255,255,0",
            "error": "255,0,0",
            "info": "0,200,100",
            "dark": "0,20,0",
            "light": "200,255,200"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # QUANTUM FLUID NEURAL THEME
    # ────────────────────────────────────────────────────────────────────
    
    register_palette \
        "palette_quantum_fluid_neural" \
        "Quantum Fluid Neural Gradient" \
        "gradient" \
        "vibrant" \
        "wcag_aa" \
        '{
            "primary": "0,255,187",
            "secondary": "85,221,255",
            "accent": "187,85,255",
            "highlight": "0,255,255",
            "success": "0,255,187",
            "warning": "255,221,0",
            "error": "255,68,153",
            "info": "85,221,255",
            "dark": "15,15,35",
            "light": "255,255,255",
            "glow": "170,221,255",
            "neon": "0,255,238",
            "psychedelic": "255,85,187",
            "quantum": "170,85,255"
        }'
    
    # ────────────────────────────────────────────────────────────────────
    # GRADIENTS
    # ────────────────────────────────────────────────────────────────────
    
    register_gradient \
        "grad_cyan_to_blue" \
        "Cyan to Blue Gradient" \
        "0,255,204" \
        "64,224,240" \
        30 \
        true
    
    register_gradient \
        "grad_purple_to_magenta" \
        "Purple to Magenta Gradient" \
        "147,112,219" \
        "255,20,147" \
        25 \
        true
    
    register_gradient \
        "grad_gold_to_orange" \
        "Gold to Orange Gradient" \
        "255,215,0" \
        "255,140,0" \
        20 \
        true
    
    register_gradient \
        "grad_rainbow" \
        "Full Rainbow Gradient" \
        "255,0,0" \
        "255,255,0" \
        360 \
        true
    
    register_gradient \
        "grad_fire" \
        "Fire Gradient (Red to Yellow)" \
        "255,0,0" \
        "255,255,0" \
        15 \
        true
    
    register_gradient \
        "grad_ocean" \
        "Ocean Gradient (Deep to Light)" \
        "25,25,112" \
        "0,255,204" \
        25 \
        true
    
    # ────────────────────────────────────────────────────────────────────
    # QUANTUM FLUID NEURAL GRADIENTS
    # ────────────────────────────────────────────────────────────────────
    
    register_gradient \
        "grad_quantum_neural_flow" \
        "Quantum Neural Flow (Void to Cyan)" \
        "15,15,35" \
        "0,255,187" \
        50 \
        true
    
    register_gradient \
        "grad_quantum_synapse" \
        "Quantum Synapse (Blue to Glow)" \
        "85,221,255" \
        "170,221,255" \
        40 \
        true
    
    register_gradient \
        "grad_neural_activation" \
        "Neural Activation (Violet to Pink)" \
        "187,85,255" \
        "255,85,187" \
        35 \
        true
    
    register_gradient \
        "grad_quantum_nexus_core" \
        "Quantum Nexus Core (Neon to Neon)" \
        "0,255,238" \
        "0,255,255" \
        30 \
        true
    
    register_gradient \
        "grad_psychedelic_wave" \
        "Psychedelic Wave (Pink to Purple)" \
        "255,85,187" \
        "170,85,255" \
        45 \
        true
    
    register_gradient \
        "grad_quantum_consciousness" \
        "Quantum Consciousness (Dark to Gold)" \
        "15,15,35" \
        "255,221,0" \
        60 \
        true
    
    register_gradient \
        "grad_neural_error_cascade" \
        "Neural Error Cascade (Red to Magenta)" \
        "255,68,153" \
        "255,0,255" \
        25 \
        true
    
    register_gradient \
        "grad_full_quantum_spectrum" \
        "Full Quantum Spectrum" \
        "15,15,35" \
        "255,255,255" \
        120 \
        true
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 COLOR SCORING
# ════════════════════════════════════════════════════════════════════════

calculate_color_score() {
    local palette_id="$1"
    local palette_data="${COLOR_PALETTES[$palette_id]}"
    
    local theme_type=$(echo "$palette_data" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
    local mood=$(echo "$palette_data" | grep -o '"mood": "[^"]*"' | cut -d'"' -f4)
    local accessibility=$(echo "$palette_data" | grep -o '"accessibility": "[^"]*"' | cut -d'"' -f4)
    
    # Scoring dimensions
    local contrast=0
    local accessibility_score=0
    local harmony=0
    local versatility=0
    
    # 1️⃣ CONTRAST QUALITY
    case "$theme_type" in
        quantum) contrast=90 ;;
        neon) contrast=95 ;;
        dark) contrast=85 ;;
        light) contrast=80 ;;
        gradient) contrast=75 ;;
    esac
    
    # 2️⃣ ACCESSIBILITY COMPLIANCE
    case "$accessibility" in
        wcag_aaa) accessibility_score=100 ;;
        wcag_aa) accessibility_score=85 ;;
        none) accessibility_score=50 ;;
    esac
    
    # 3️⃣ COLOR HARMONY
    case "$mood" in
        vibrant) harmony=90 ;;
        calm) harmony=85 ;;
        neutral) harmony=80 ;;
        aggressive) harmony=75 ;;
    esac
    
    # 4️⃣ VERSATILITY (use across different contexts)
    case "$theme_type" in
        quantum) versatility=95 ;;
        neon) versatility=85 ;;
        gradient) versatility=80 ;;
        dark|light) versatility=75 ;;
    esac
    
    # Final Color Score
    local score=$(( 
        (contrast * 25 + 
         accessibility_score * 30 + 
         harmony * 25 + 
         versatility * 20) / 100
    ))
    
    COLOR_SCORES[$palette_id]="$(cat <<-EOF
{
  "color_score": $score,
  "contrast": $contrast,
  "accessibility": $accessibility_score,
  "harmony": $harmony,
  "versatility": $versatility,
  "rating": "$(get_color_rating $score)"
}
EOF
)"
    
    return $score
}

get_color_rating() {
    local score=$1
    if (( score >= 90 )); then
        echo "Exceptional"
    elif (( score >= 80 )); then
        echo "Excellent"
    elif (( score >= 70 )); then
        echo "Good"
    else
        echo "Fair"
    fi
}

# ════════════════════════════════════════════════════════════════════════
# 🌈 GRADIENT GENERATOR
# ════════════════════════════════════════════════════════════════════════

generate_color_gradient() {
    local start_rgb="$1"  # "R,G,B"
    local end_rgb="$2"    # "R,G,B"
    local steps="${3:-10}"
    
    IFS=',' read -r start_r start_g start_b <<< "$start_rgb"
    IFS=',' read -r end_r end_g end_b <<< "$end_rgb"
    
    local gradient_colors=()
    
    for ((i=0; i<steps; i++)); do
        local ratio=$(echo "scale=3; $i / ($steps - 1)" | bc -l)
        local r=$(echo "$start_r + ($end_r - $start_r) * $ratio" | bc -l | cut -d. -f1)
        local g=$(echo "$start_g + ($end_g - $start_g) * $ratio" | bc -l | cut -d. -f1)
        local b=$(echo "$start_b + ($end_b - $start_b) * $ratio" | bc -l | cut -d. -f1)
        
        gradient_colors+=("\033[38;2;${r};${g};${b}m")
    done
    
    echo "${gradient_colors[@]}"
}

# ════════════════════════════════════════════════════════════════════════
# 🎨 COLOR APPLICATION FUNCTIONS
# ════════════════════════════════════════════════════════════════════════

apply_palette() {
    local palette_id="$1"
    local palette_data="${COLOR_PALETTES[$palette_id]}"
    
    # Extract colors and export them
    echo "$palette_data"
}

colorize_text() {
    local text="$1"
    local color_code="$2"
    
    echo -ne "${color_code}${text}\033[0m"
}

colorize_gradient() {
    local text="$1"
    local start_rgb="$2"
    local end_rgb="$3"
    
    local gradient=($(generate_color_gradient "$start_rgb" "$end_rgb" ${#text}))
    
    for ((i=0; i<${#text}; i++)); do
        echo -ne "${gradient[$i]}${text:$i:1}\033[0m"
    done
}

# ════════════════════════════════════════════════════════════════════════
# 🔍 COLOR QUERIES
# ════════════════════════════════════════════════════════════════════════

list_palettes() {
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║              🎨 COLOR PALETTES REGISTRY                         ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    for palette_id in ${(k)COLOR_PALETTES}; do
        local palette_data="${COLOR_PALETTES[$palette_id]}"
        local score_data="${COLOR_SCORES[$palette_id]}"
        
        local name=$(echo "$palette_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
        local mood=$(echo "$palette_data" | grep -o '"mood": "[^"]*"' | cut -d'"' -f4)
        local score=$(echo "$score_data" | grep -o '"color_score": [0-9]*' | grep -o '[0-9]*' 2>/dev/null || echo "N/A")
        
        printf "  %-30s [%-8s] Score: %s\n" "$name" "$mood" "$score"
    done
    
    echo ""
}

show_palette_preview() {
    local palette_id="$1"
    local palette_data="${COLOR_PALETTES[$palette_id]}"
    
    if [[ -z "$palette_data" ]]; then
        echo "❌ Palette '$palette_id' not found"
        return 1
    fi
    
    local name=$(echo "$palette_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
    local type=$(echo "$palette_data" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
    local mood=$(echo "$palette_data" | grep -o '"mood": "[^"]*"' | cut -d'"' -f4)
    
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║            📊 PALETTE: $name               ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    
    # Show color swatches
    echo -e "\n  Type: $type | Mood: $mood\n"
    
    # Extract and display colors
    local colors=$(echo "$palette_data" | grep -o '"colors": {[^}]*}' | cut -d'{' -f2 | cut -d'}' -f1)
    
    echo "  Color Swatches:"
    IFS=',' read -r -a color_pairs <<< "$colors"
    for pair in "${color_pairs[@]}"; do
        local key=$(echo "$pair" | cut -d':' -f1 | tr -d ' "')
        local rgb=$(echo "$pair" | cut -d'"' -f4)
        
        if [[ -n "$rgb" ]]; then
            echo -ne "    ${key}: "
            echo -ne "\033[38;2;${rgb//,/;}m████████\033[0m"
            echo -e " RGB($rgb)"
        fi
    done
    
    echo ""
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 INITIALIZATION
# ════════════════════════════════════════════════════════════════════════

load_color_database

# Calculate scores
for palette_id in ${(k)COLOR_PALETTES}; do
    calculate_color_score "$palette_id" >/dev/null
done

echo "✅ Color Palette Sub-Registry loaded with ${#COLOR_PALETTES} palettes and ${#GRADIENT_EFFECTS} gradients" >&2
return 0
