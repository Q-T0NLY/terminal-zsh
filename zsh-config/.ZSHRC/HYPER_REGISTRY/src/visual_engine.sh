#!/usr/bin/env bash
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║                    NEXUSPRO HYPER REGISTRY - VISUAL ENGINE                   ║
# ║                 Ultra-Modern 3D/Animation/Visual Framework                   ║
# ╠═══════════════════════════════════════════════════════════════════════════════╣
# ║ Purpose: Core visual rendering engine with quantum effects                   ║
# ║ Features: 3D rendering, animations, gradients, particles, emojis             ║
# ║ Version: v1.0.0 | Created: 2025-12-16                                        ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════════
# VISUAL ENGINE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Terminal capabilities detection
TERM_COLORS="${TERM_COLORS:-256}"
UNICODE_SUPPORT="${UNICODE_SUPPORT:-true}"
ANIMATION_ENABLED="${ANIMATION_ENABLED:-true}"
FPS_TARGET="${FPS_TARGET:-60}"
FRAME_BUDGET_MS="${FRAME_BUDGET_MS:-16}"  # 60 FPS = 16ms per frame

# Color palettes - Quantum Neural Theme
declare -A COLORS=(
    # Primary quantum colors
    [QUANTUM_CYAN]='\033[38;5;51m'
    [QUANTUM_BLUE]='\033[38;5;39m'
    [QUANTUM_PURPLE]='\033[38;5;135m'
    [QUANTUM_MAGENTA]='\033[38;5;201m'
    
    # Secondary neural colors
    [NEURAL_GREEN]='\033[38;5;46m'
    [NEURAL_LIME]='\033[38;5;118m'
    [NEURAL_YELLOW]='\033[38;5;226m'
    [NEURAL_ORANGE]='\033[38;5;208m'
    
    # Accent colors
    [ACCENT_GOLD]='\033[38;5;220m'
    [ACCENT_PINK]='\033[38;5;213m'
    [ACCENT_RED]='\033[38;5;196m'
    [ACCENT_WHITE]='\033[38;5;231m'
    
    # Backgrounds
    [BG_DARK]='\033[48;5;235m'
    [BG_DARKER]='\033[48;5;232m'
    [BG_TRANSPARENT]='\033[49m'
    
    # Effects
    [BOLD]='\033[1m'
    [DIM]='\033[2m'
    [ITALIC]='\033[3m'
    [UNDERLINE]='\033[4m'
    [BLINK]='\033[5m'
    [REVERSE]='\033[7m'
    [HIDDEN]='\033[8m'
    
    # Reset
    [RESET]='\033[0m'
    [CLEAR_LINE]='\033[2K'
    [CLEAR_SCREEN]='\033[2J'
)

# Gradient definitions (8-step quantum gradients)
declare -A GRADIENTS=(
    [QUANTUM_WAVE]="51 45 39 33 27 21 57 93"
    [NEURAL_PULSE]="46 82 118 154 190 226 220 214"
    [HOLOGRAPHIC]="201 165 129 93 57 21 27 33"
    [RAINBOW]="196 208 220 226 118 51 57 93"
    [FIRE]="196 202 208 214 220 226 231 255"
    [ICE]="51 87 123 159 195 231 255 231"
)

# Box drawing characters (Unicode)
BOX_TL="╔"  BOX_TR="╗"  BOX_BL="╚"  BOX_BR="╝"
BOX_H="═"   BOX_V="║"   BOX_VR="╠"  BOX_VL="╣"
BOX_HU="╩"  BOX_HD="╦"  BOX_VH="╬"

# Animation characters
SPINNER_FRAMES=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
PULSE_FRAMES=("◜" "◝" "◞" "◟")
PARTICLE_CHARS=("✦" "✧" "✶" "✷" "★" "☆" "✪" "✫")
SPARKLE_CHARS=("✨" "💫" "⭐" "🌟" "✴" "❇" "🔆")

# 3D wireframe characters
WIREFRAME_CUBE=(
    "    ┌────┐"
    "   ╱│   ╱│"
    "  ┌─┼──┐ │"
    "  │ └──┼─┘"
    "  │╱   │╱ "
    "  └────┘  "
)

# ═══════════════════════════════════════════════════════════════════════════════
# CORE VISUAL FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

# Move cursor to position
move_cursor() {
    local row=$1 col=$2
    printf '\033[%d;%dH' "$row" "$col"
}

# Hide/show cursor
hide_cursor() { printf '\033[?25l'; }
show_cursor() { printf '\033[?25h'; }

# Clear operations
clear_screen() { printf '\033[2J\033[H'; }
clear_line() { printf '\033[2K\r'; }

# Save/restore cursor position
save_cursor() { printf '\033[s'; }
restore_cursor() { printf '\033[u'; }

# Get terminal dimensions
get_terminal_size() {
    local size
    size=$(stty size 2>/dev/null || echo "24 80")
    TERM_ROWS=${size%% *}
    TERM_COLS=${size##* }
}

# ═══════════════════════════════════════════════════════════════════════════════
# COLOR & GRADIENT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

# Apply color to text
colorize() {
    local color_name=$1
    local text=$2
    echo -e "${COLORS[$color_name]}${text}${COLORS[RESET]}"
}

# Generate gradient text (character-by-character coloring)
gradient_text() {
    local text=$1
    local gradient_name=${2:-QUANTUM_WAVE}
    local output=""
    local text_len=${#text}
    
    # Get gradient color codes
    IFS=' ' read -ra gradient_colors <<< "${GRADIENTS[$gradient_name]}"
    local num_colors=${#gradient_colors[@]}
    
    # Apply gradient
    for ((i=0; i<text_len; i++)); do
        local char="${text:$i:1}"
        local color_idx=$((i % num_colors))
        local color_code=${gradient_colors[$color_idx]}
        output+="\033[38;5;${color_code}m${char}"
    done
    
    echo -e "${output}${COLORS[RESET]}"
}

# Animate gradient (cycling through colors)
animate_gradient() {
    local text=$1
    local gradient_name=${2:-QUANTUM_WAVE}
    local duration=${3:-5}  # seconds
    local fps=${4:-30}
    
    IFS=' ' read -ra gradient_colors <<< "${GRADIENTS[$gradient_name]}"
    local num_colors=${#gradient_colors[@]}
    local frames=$((duration * fps))
    
    save_cursor
    hide_cursor
    
    for ((frame=0; frame<frames; frame++)); do
        restore_cursor
        local offset=$((frame % num_colors))
        
        # Shift gradient based on frame
        local output=""
        for ((i=0; i<${#text}; i++)); do
            local char="${text:$i:1}"
            local color_idx=$(( (i + offset) % num_colors ))
            local color_code=${gradient_colors[$color_idx]}
            output+="\033[38;5;${color_code}m${char}"
        done
        
        echo -ne "${output}${COLORS[RESET]}"
        sleep $(bc <<< "scale=3; 1/$fps")
    done
    
    show_cursor
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# BOX DRAWING & FRAMES
# ═══════════════════════════════════════════════════════════════════════════════

# Draw a box with title
draw_box() {
    local title=$1
    local width=${2:-80}
    local content_lines=("${@:3}")
    
    # Calculate dimensions
    local title_len=${#title}
    local padding=$(( (width - title_len - 4) / 2 ))
    
    # Top border with title
    echo -ne "${COLORS[QUANTUM_CYAN]}${BOX_TL}"
    for ((i=0; i<padding; i++)); do echo -n "${BOX_H}"; done
    echo -ne " ${COLORS[ACCENT_GOLD]}${title}${COLORS[QUANTUM_CYAN]} "
    for ((i=0; i<padding; i++)); do echo -n "${BOX_H}"; done
    echo -e "${BOX_TR}${COLORS[RESET]}"
    
    # Content lines
    for line in "${content_lines[@]}"; do
        printf "${COLORS[QUANTUM_CYAN]}%s${COLORS[RESET]} %-$((width-2))s ${COLORS[QUANTUM_CYAN]}%s${COLORS[RESET]}\n" \
            "$BOX_V" "$line" "$BOX_V"
    done
    
    # Bottom border
    echo -ne "${COLORS[QUANTUM_CYAN]}${BOX_BL}"
    for ((i=0; i<width-2; i++)); do echo -n "${BOX_H}"; done
    echo -e "${BOX_BR}${COLORS[RESET]}"
}

# Draw quantum header with animation
draw_quantum_header() {
    local title=$1
    local subtitle=${2:-""}
    local width=${3:-80}
    
    clear_screen
    
    # Animated top border
    echo -ne "${COLORS[QUANTUM_CYAN]}${COLORS[BOLD]}"
    for ((i=0; i<width; i++)); do
        echo -n "${BOX_H}"
        sleep 0.001
    done
    echo -e "${COLORS[RESET]}"
    
    # Title with gradient
    local title_gradient=$(gradient_text "$title" "RAINBOW")
    local padding=$(( (width - ${#title}) / 2 ))
    printf "%${padding}s%s\n" "" "$title_gradient"
    
    # Subtitle if provided
    if [[ -n "$subtitle" ]]; then
        local sub_gradient=$(gradient_text "$subtitle" "QUANTUM_WAVE")
        local sub_padding=$(( (width - ${#subtitle}) / 2 ))
        printf "%${sub_padding}s%s\n" "" "$sub_gradient"
    fi
    
    # Bottom border
    echo -ne "${COLORS[QUANTUM_CYAN]}${COLORS[BOLD]}"
    for ((i=0; i<width; i++)); do
        echo -n "${BOX_H}"
    done
    echo -e "${COLORS[RESET]}"
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# ANIMATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

# Spinner animation
show_spinner() {
    local message=$1
    local duration=${2:-5}
    local color=${3:-QUANTUM_CYAN}
    
    save_cursor
    hide_cursor
    
    local end_time=$((SECONDS + duration))
    local frame=0
    
    while [[ $SECONDS -lt $end_time ]]; do
        restore_cursor
        local spinner_char=${SPINNER_FRAMES[$((frame % ${#SPINNER_FRAMES[@]}))]}
        echo -ne "${COLORS[$color]}${spinner_char} ${COLORS[ACCENT_WHITE]}${message}${COLORS[RESET]}"
        ((frame++))
        sleep 0.1
    done
    
    restore_cursor
    clear_line
    show_cursor
}

# Pulse animation
show_pulse() {
    local text=$1
    local cycles=${2:-3}
    
    save_cursor
    hide_cursor
    
    for ((cycle=0; cycle<cycles; cycle++)); do
        for frame in "${PULSE_FRAMES[@]}"; do
            restore_cursor
            echo -ne "${COLORS[QUANTUM_PURPLE]}${frame} ${COLORS[ACCENT_WHITE]}${text}${COLORS[RESET]}"
            sleep 0.15
        done
    done
    
    restore_cursor
    show_cursor
    echo
}

# Particle burst effect
particle_burst() {
    local center_row=${1:-12}
    local center_col=${2:-40}
    local num_particles=${3:-20}
    
    save_cursor
    hide_cursor
    
    # Generate random particle positions and velocities
    local particles=()
    for ((i=0; i<num_particles; i++)); do
        local angle=$(bc <<< "scale=2; $i * 6.28 / $num_particles")
        local vx=$(bc <<< "scale=2; c($angle)")
        local vy=$(bc <<< "scale=2; s($angle)")
        particles+=("$center_row $center_col $vx $vy")
    done
    
    # Animate particles
    for ((frame=0; frame<15; frame++)); do
        for ((i=0; i<num_particles; i++)); do
            read -r row col vx vy <<< "${particles[$i]}"
            
            # Update position
            local new_row=$(bc <<< "scale=0; $row + $vy * 2")
            local new_col=$(bc <<< "scale=0; $col + $vx * 3")
            
            # Draw particle
            move_cursor "$new_row" "$new_col"
            local particle_char=${PARTICLE_CHARS[$((RANDOM % ${#PARTICLE_CHARS[@]}))]}
            echo -ne "${COLORS[NEURAL_LIME]}${particle_char}${COLORS[RESET]}"
            
            # Store updated position
            particles[$i]="$new_row $new_col $vx $vy"
        done
        sleep 0.05
    done
    
    # Clear particles
    for ((i=0; i<num_particles; i++)); do
        read -r row col _ _ <<< "${particles[$i]}"
        move_cursor "$row" "$col"
        echo -n " "
    done
    
    restore_cursor
    show_cursor
}

# ═══════════════════════════════════════════════════════════════════════════════
# 3D WIREFRAME RENDERING
# ═══════════════════════════════════════════════════════════════════════════════

# Render 3D cube with rotation animation
render_3d_cube() {
    local row=${1:-5}
    local col=${2:-10}
    local frames=${3:-30}
    
    save_cursor
    hide_cursor
    
    for ((frame=0; frame<frames; frame++)); do
        # Simple rotation effect by alternating perspectives
        local perspective=$((frame % 4))
        
        for ((i=0; i<${#WIREFRAME_CUBE[@]}; i++)); do
            move_cursor $((row + i)) "$col"
            
            # Apply color gradient based on depth
            local color_idx=$((i % 6))
            local colors=(QUANTUM_CYAN QUANTUM_BLUE QUANTUM_PURPLE NEURAL_LIME NEURAL_YELLOW ACCENT_GOLD)
            local color=${colors[$color_idx]}
            
            echo -ne "${COLORS[$color]}${WIREFRAME_CUBE[$i]}${COLORS[RESET]}"
        done
        
        sleep 0.1
    done
    
    restore_cursor
    show_cursor
}

# Render holographic grid effect
render_holographic_grid() {
    local width=${1:-40}
    local height=${2:-10}
    
    clear_screen
    
    for ((row=0; row<height; row++)); do
        for ((col=0; col<width; col++)); do
            # Create wave pattern
            local wave=$((row + col))
            local char_idx=$((wave % 4))
            local chars=("░" "▒" "▓" "█")
            local char=${chars[$char_idx]}
            
            # Apply holographic gradient
            local color_idx=$(( (row * width + col) % 8 ))
            local gradient_colors=(51 45 39 33 27 21 57 93)
            local color_code=${gradient_colors[$color_idx]}
            
            echo -ne "\033[38;5;${color_code}m${char}"
        done
        echo -e "${COLORS[RESET]}"
        sleep 0.02
    done
}

# ═══════════════════════════════════════════════════════════════════════════════
# PROGRESS & STATUS INDICATORS
# ═══════════════════════════════════════════════════════════════════════════════

# Animated progress bar with sparkles
show_progress_bar() {
    local percent=$1
    local width=${2:-50}
    local label=${3:-"Progress"}
    
    local filled=$((percent * width / 100))
    local empty=$((width - filled))
    
    # Build bar with gradient
    local bar=""
    for ((i=0; i<filled; i++)); do
        local color_idx=$((i * 6 / width))
        local colors=(NEURAL_GREEN NEURAL_LIME NEURAL_YELLOW ACCENT_GOLD ACCENT_PINK QUANTUM_PURPLE)
        local color=${colors[$color_idx]}
        bar+="${COLORS[$color]}█"
    done
    
    for ((i=0; i<empty; i++)); do
        bar+="${COLORS[DIM]}░"
    done
    
    # Add sparkles at the end
    if [[ $filled -gt 0 ]]; then
        local sparkle=${SPARKLE_CHARS[$((RANDOM % ${#SPARKLE_CHARS[@]}))]}
        echo -e "${COLORS[ACCENT_WHITE]}${label}: [${bar}${COLORS[RESET]}] ${COLORS[ACCENT_GOLD]}${percent}%${COLORS[RESET]} ${sparkle}"
    else
        echo -e "${COLORS[ACCENT_WHITE]}${label}: [${bar}${COLORS[RESET]}] ${COLORS[DIM]}${percent}%${COLORS[RESET]}"
    fi
}

# Status badge with glow effect
status_badge() {
    local status=$1
    local badge=""
    
    case $status in
        "active"|"running"|"online")
            badge="${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}● ACTIVE${COLORS[RESET]}"
            ;;
        "pending"|"loading"|"processing")
            badge="${COLORS[NEURAL_YELLOW]}${COLORS[BOLD]}◐ PENDING${COLORS[RESET]}"
            ;;
        "error"|"failed"|"offline")
            badge="${COLORS[ACCENT_RED]}${COLORS[BOLD]}✖ ERROR${COLORS[RESET]}"
            ;;
        "success"|"complete"|"done")
            badge="${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}✓ SUCCESS${COLORS[RESET]}"
            ;;
        *)
            badge="${COLORS[QUANTUM_CYAN]}${COLORS[BOLD]}◯ ${status^^}${COLORS[RESET]}"
            ;;
    esac
    
    echo -e "$badge"
}

# ═══════════════════════════════════════════════════════════════════════════════
# EXPORT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

# Make functions available to other scripts
export -f colorize gradient_text animate_gradient
export -f draw_box draw_quantum_header
export -f show_spinner show_pulse particle_burst
export -f render_3d_cube render_holographic_grid
export -f show_progress_bar status_badge
export -f move_cursor hide_cursor show_cursor
export -f clear_screen clear_line save_cursor restore_cursor
export -f get_terminal_size

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO MODE (if script run directly)
# ═══════════════════════════════════════════════════════════════════════════════

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "🎨 NEXUSPRO Visual Engine Demo"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    
    # Test quantum header
    draw_quantum_header "VISUAL ENGINE v1.0" "Ultra-Modern 3D Graphics" 70
    
    # Test gradient text
    echo "Gradient Examples:"
    gradient_text "QUANTUM WAVE GRADIENT" "QUANTUM_WAVE"
    gradient_text "NEURAL PULSE GRADIENT" "NEURAL_PULSE"
    gradient_text "HOLOGRAPHIC GRADIENT" "HOLOGRAPHIC"
    gradient_text "RAINBOW GRADIENT" "RAINBOW"
    echo
    
    # Test progress bars
    echo "Progress Bar Examples:"
    show_progress_bar 25 50 "Loading"
    show_progress_bar 50 50 "Processing"
    show_progress_bar 75 50 "Optimizing"
    show_progress_bar 100 50 "Complete"
    echo
    
    # Test status badges
    echo "Status Badges:"
    status_badge "active"
    status_badge "pending"
    status_badge "success"
    status_badge "error"
    echo
    
    # Test spinner
    echo "Spinner Animation:"
    show_spinner "Loading components..." 3
    echo "✓ Complete"
    echo
    
    # Test box drawing
    draw_box "SYSTEM STATUS" 60 \
        "Registry: $(status_badge 'active')" \
        "Plugins: $(status_badge 'success')" \
        "Services: $(status_badge 'pending')" \
        ""
    
    echo
    echo "Visual Engine initialized successfully! ✨"
fi
