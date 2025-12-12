#!/usr/bin/env zsh
# ============================================================================
# Nexus-AI-Studio: Visual Rendering Engine
# Version: 9.0
# Description: Advanced terminal UI with quantum effects and animations
# ============================================================================

# Prevent multiple sourcing
[[ -n "${NEXUS_VISUAL_ENGINE_LOADED}" ]] && return
export NEXUS_VISUAL_ENGINE_LOADED=1

# ============================================================================
# TERMINAL DETECTION AND CAPABILITIES
# ============================================================================

# Terminal dimensions
get_terminal_size() {
    TERMINAL_WIDTH=$(tput cols 2>/dev/null || echo 80)
    TERMINAL_HEIGHT=$(tput lines 2>/dev/null || echo 24)
    export TERMINAL_WIDTH TERMINAL_HEIGHT
}

# Detect terminal capabilities
detect_terminal_capabilities() {
    # Check for 256 color support
    if [[ $(tput colors 2>/dev/null) -ge 256 ]]; then
        export NEXUS_COLOR_SUPPORT="256"
    elif [[ $(tput colors 2>/dev/null) -ge 16 ]]; then
        export NEXUS_COLOR_SUPPORT="16"
    else
        export NEXUS_COLOR_SUPPORT="8"
    fi
    
    # Check for Unicode support
    if locale charmap 2>/dev/null | grep -qi utf; then
        export NEXUS_UNICODE_SUPPORT="true"
    else
        export NEXUS_UNICODE_SUPPORT="false"
    fi
    
    # Check for mouse support
    if [[ -t 0 ]]; then
        export NEXUS_MOUSE_SUPPORT="true"
    else
        export NEXUS_MOUSE_SUPPORT="false"
    fi
}

# ============================================================================
# COLOR DEFINITIONS
# ============================================================================

# Initialize color system
init_colors() {
    if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
        # Basic ANSI colors
        export COLOR_RESET='\033[0m'
        export COLOR_BOLD='\033[1m'
        export COLOR_DIM='\033[2m'
        export COLOR_ITALIC='\033[3m'
        export COLOR_UNDERLINE='\033[4m'
        export COLOR_BLINK='\033[5m'
        
        # Standard colors
        export COLOR_BLACK='\033[30m'
        export COLOR_RED='\033[31m'
        export COLOR_GREEN='\033[32m'
        export COLOR_YELLOW='\033[33m'
        export COLOR_BLUE='\033[34m'
        export COLOR_MAGENTA='\033[35m'
        export COLOR_CYAN='\033[36m'
        export COLOR_WHITE='\033[37m'
        
        # Bright colors
        export COLOR_BRIGHT_BLACK='\033[90m'
        export COLOR_BRIGHT_RED='\033[91m'
        export COLOR_BRIGHT_GREEN='\033[92m'
        export COLOR_BRIGHT_YELLOW='\033[93m'
        export COLOR_BRIGHT_BLUE='\033[94m'
        export COLOR_BRIGHT_MAGENTA='\033[95m'
        export COLOR_BRIGHT_CYAN='\033[96m'
        export COLOR_BRIGHT_WHITE='\033[97m'
        
        # Gradients (RGB colors)
        export GRADIENT_1='\033[38;2;255;94;247m'   # Pink
        export GRADIENT_2='\033[38;2;255;154;162m'  # Light Pink
        export GRADIENT_3='\033[38;2;255;204;128m'  # Peach
        export GRADIENT_4='\033[38;2;255;229;153m'  # Light Yellow
        export GRADIENT_5='\033[38;2;255;255;255m'  # White
    else
        # No color mode
        export COLOR_RESET=''
        export COLOR_BOLD=''
        export COLOR_DIM=''
        export COLOR_ITALIC=''
        export COLOR_UNDERLINE=''
        export COLOR_BLINK=''
        export COLOR_BLACK=''
        export COLOR_RED=''
        export COLOR_GREEN=''
        export COLOR_YELLOW=''
        export COLOR_BLUE=''
        export COLOR_MAGENTA=''
        export COLOR_CYAN=''
        export COLOR_WHITE=''
        export COLOR_BRIGHT_BLACK=''
        export COLOR_BRIGHT_RED=''
        export COLOR_BRIGHT_GREEN=''
        export COLOR_BRIGHT_YELLOW=''
        export COLOR_BRIGHT_BLUE=''
        export COLOR_BRIGHT_MAGENTA=''
        export COLOR_BRIGHT_CYAN=''
        export COLOR_BRIGHT_WHITE=''
        export GRADIENT_1=''
        export GRADIENT_2=''
        export GRADIENT_3=''
        export GRADIENT_4=''
        export GRADIENT_5=''
    fi
}

# ============================================================================
# HEADER AND BANNER RENDERING
# ============================================================================

# 3D Figlet rendering with gradients
print_quantum_header() {
    local title="$1"
    local width=${TERMINAL_WIDTH:-80}
    
    # Calculate centering
    local padding=$(( (width - ${#title} - 4) / 2 ))
    padding=$(( padding > 0 ? padding : 0 ))
    
    echo -e "${GRADIENT_1}${COLOR_BOLD}"
    echo "╔$(printf '═%.0s' $(seq 1 $((width-2))))╗"
    echo "║$(printf ' %.0s' $(seq 1 $padding)) ${title} $(printf ' %.0s' $(seq 1 $padding))║"
    echo "╚$(printf '═%.0s' $(seq 1 $((width-2))))╝"
    echo -e "${COLOR_RESET}"
}

# Simple header
print_header() {
    local title="$1"
    local color="${2:-BRIGHT_CYAN}"
    
    echo ""
    echo -e "${COLOR_BOLD}${(P)${:-COLOR_${color}}}═══════════════════════════════════════════════════════════${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${(P)${:-COLOR_${color}}} ${title}${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${(P)${:-COLOR_${color}}}═══════════════════════════════════════════════════════════${COLOR_RESET}"
    echo ""
}

# Banner with box
print_banner() {
    local title="$1"
    local subtitle="${2:-}"
    
    echo ""
    echo -e "${COLOR_BRIGHT_CYAN}${COLOR_BOLD}╔════════════════════════════════════════════════════════════════════╗${COLOR_RESET}"
    echo -e "${COLOR_BRIGHT_CYAN}${COLOR_BOLD}║${COLOR_RESET}  ${COLOR_BRIGHT_WHITE}${COLOR_BOLD}${title}${COLOR_RESET}$(printf ' %.0s' $(seq 1 $((66 - ${#title}))))${COLOR_BRIGHT_CYAN}${COLOR_BOLD}║${COLOR_RESET}"
    
    if [[ -n "$subtitle" ]]; then
        echo -e "${COLOR_BRIGHT_CYAN}${COLOR_BOLD}║${COLOR_RESET}  ${COLOR_CYAN}${subtitle}${COLOR_RESET}$(printf ' %.0s' $(seq 1 $((66 - ${#subtitle}))))${COLOR_BRIGHT_CYAN}${COLOR_BOLD}║${COLOR_RESET}"
    fi
    
    echo -e "${COLOR_BRIGHT_CYAN}${COLOR_BOLD}╚════════════════════════════════════════════════════════════════════╝${COLOR_RESET}"
    echo ""
}

# ============================================================================
# PROGRESS BARS AND LOADERS
# ============================================================================

# Animated progress bar
animated_progress_bar() {
    local current="${1:-0}"
    local total="${2:-100}"
    local width="${3:-50}"
    
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\r${GRADIENT_3}["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "] ${percentage}%%${COLOR_RESET}"
    
    if [[ $current -eq $total ]]; then
        printf "\n"
    fi
}

# Wave loader
wave_loader() {
    local message="${1:-Loading}"
    local width=20
    local phases=("▁" "▂" "▃" "▄" "▅" "▆" "▇" "█" "▇" "▆" "▅" "▄" "▃" "▂")
    
    printf "\r${COLOR_CYAN}${message}${COLOR_RESET} "
    for phase in "${phases[@]}"; do
        echo -ne "${GRADIENT_2}${phase}${COLOR_RESET}"
        sleep 0.1
    done
    printf "\n"
}

# Circular loading animation
circular_loader() {
    local pid=$1
    local message="${2:-Processing}"
    local spin=('◐' '◓' '◑' '◒')
    local i=0
    
    while kill -0 "$pid" 2>/dev/null; do
        i=$(( (i+1) % 4 ))
        printf "\r${GRADIENT_2}${spin[$i]}${COLOR_RESET} ${message}..."
        sleep 0.1
    done
    printf "\r${COLOR_GREEN}✓${COLOR_RESET} ${message} complete!\n"
}

# Spinner animation
spinner() {
    local pid=$1
    local message="${2:-Processing}"
    local delay=0.1
    local spinstr='|/-\'
    
    echo -ne "  ${COLOR_BRIGHT_CYAN}${message}... ${COLOR_RESET}"
    
    while kill -0 "$pid" 2>/dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
    echo -e "${COLOR_GREEN}✓${COLOR_RESET} ${COLOR_BRIGHT_GREEN}Complete!${COLOR_RESET}"
}

# ============================================================================
# VISUAL EFFECTS
# ============================================================================

# Sparkle particle animation
sparkle_animation() {
    local duration="${1:-2}"
    local frames=("★" "✦" "✧" "✶" "✸" "✹" "✺" "✻")
    local colors=("$GRADIENT_1" "$GRADIENT_2" "$GRADIENT_3" "$GRADIENT_4")
    
    for ((i=0; i<duration*10; i++)); do
        local frame=${frames[$((RANDOM % ${#frames[@]}))]}
        local color=${colors[$((RANDOM % ${#colors[@]}))]}
        echo -ne "${color}${frame}${COLOR_RESET}"
        sleep 0.1
        echo -ne "\b"
    done
}

# Quantum matrix effect
matrix_effect() {
    local duration="${1:-3}"
    local width=${TERMINAL_WIDTH:-80}
    local height=10
    
    for ((t=0; t<duration*10; t++)); do
        clear
        for ((h=0; h<height; h++)); do
            for ((w=0; w<width; w++)); do
                if (( RANDOM % 100 < 5 )); then
                    echo -ne "${GRADIENT_1}█${COLOR_RESET}"
                else
                    echo -ne "${COLOR_DIM}░${COLOR_RESET}"
                fi
            done
            echo
        done
        sleep 0.1
    done
    clear
}

# Holographic text
holographic_text() {
    local text="$1"
    local depth=3
    
    for ((d=0; d<depth; d++)); do
        local offset=$((depth - d))
        local color
        case $d in
            0) color="$GRADIENT_1" ;;
            1) color="$GRADIENT_2" ;;
            2) color="$GRADIENT_3" ;;
        esac
        
        tput cup $(( (TERMINAL_HEIGHT / 2) + offset )) $(( (TERMINAL_WIDTH - ${#text}) / 2 + offset ))
        echo -ne "${color}${text}${COLOR_RESET}"
    done
    
    # Main text
    tput cup $((TERMINAL_HEIGHT / 2)) $(( (TERMINAL_WIDTH - ${#text}) / 2 ))
    echo -e "${COLOR_BOLD}${COLOR_WHITE}${text}${COLOR_RESET}"
}

# ============================================================================
# CHARTS AND GRAPHS
# ============================================================================

# Gradient bar chart
gradient_bar_chart() {
    local values=("$@")
    local max_value=0
    
    # Find max value
    for value in "${values[@]}"; do
        (( value > max_value )) && max_value=$value
    done
    
    local width=50
    printf "\n"
    for value in "${values[@]}"; do
        local bar_length=$(( value * width / max_value ))
        printf "${GRADIENT_1}"
        printf "%${bar_length}s" | tr ' ' '█'
        printf "${COLOR_RESET} ${value}\n"
    done
}

# Horizontal bar
print_bar() {
    local current="$1"
    local total="$2"
    local width="${3:-40}"
    local color="${4:-GREEN}"
    
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    echo -ne "${COLOR_BOLD}${(P)${:-COLOR_${color}}}"
    printf "%${filled}s" | tr ' ' '█'
    echo -ne "${COLOR_DIM}"
    printf "%${empty}s" | tr ' ' '░'
    echo -e "${COLOR_RESET} ${percentage}%"
}

# ============================================================================
# ASCII ART GENERATION
# ============================================================================

# ASCII art generator
generate_ascii_art() {
    local text="$1"
    local style="${2:-standard}"
    
    case "$style" in
        "quantum")
            cat << EOF
    ╔═══════════════════════════════════════╗
    ║    ╦  ╔═╗╔╗ ╔═╗╔═╗╦ ╦╔═╗╦  ╦╔═╗      ║
    ║    ║  ║ ║╠╩╗║╣ ║  ╠═╣║ ║║  ║║╣       ║
    ║    ╩═╝╚═╝╚═╝╚═╝╚═╝╩ ╩╚═╝╩═╝╩╚═╝      ║
    ║    ${text}                        ║
    ╚═══════════════════════════════════════╝
EOF
            ;;
        "neural")
            cat << EOF
    ┌───────────────────────────────────────┐
    │  ▗▄▄▄▖ ▗▄▄▖ ▗▄▄▄▖▗▄▄▄▖▗▄▄▄▖ ▗▄▄▄▖    │
    │  ▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌   ▐▌ ▐▌      │
    │  ▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌   ▐▌ ▐▌      │
    │  ▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌   ▐▌ ▐▌      │
    │   ▀▀▀▀ ▝▀▀▀┘ ▀▀▀▘ ▀▀▀▘ ▀▀▀▘  ▀▀▀▘    │
    │  ${text}                          │
    └───────────────────────────────────────┘
EOF
            ;;
        "nexus")
            cat << EOF
${COLOR_BRIGHT_CYAN}${COLOR_BOLD}
    ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
    ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
    ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
    ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
    ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
    ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
    ${text}
${COLOR_RESET}
EOF
            ;;
        *)
            if command -v figlet &>/dev/null; then
                figlet -f slant "$text" 2>/dev/null
            else
                echo "=== $text ==="
            fi
            ;;
    esac
}

# ============================================================================
# STATUS AND MESSAGES
# ============================================================================

# Print status message
print_status() {
    local label="$1"
    local value="$2"
    local color="${3:-BRIGHT_CYAN}"
    
    echo -e "  ${COLOR_BOLD}${(P)${:-COLOR_${color}}}${label}:${COLOR_RESET} ${value}"
}

# Print success message
print_success() {
    local message="$1"
    echo -e "${COLOR_BRIGHT_GREEN}✓${COLOR_RESET} ${COLOR_GREEN}${message}${COLOR_RESET}"
}

# Print error message
print_error() {
    local message="$1"
    echo -e "${COLOR_BRIGHT_RED}✗${COLOR_RESET} ${COLOR_RED}${message}${COLOR_RESET}"
}

# Print warning message
print_warning() {
    local message="$1"
    echo -e "${COLOR_BRIGHT_YELLOW}⚠${COLOR_RESET} ${COLOR_YELLOW}${message}${COLOR_RESET}"
}

# Print info message
print_info() {
    local message="$1"
    echo -e "${COLOR_BRIGHT_CYAN}ℹ${COLOR_RESET} ${COLOR_CYAN}${message}${COLOR_RESET}"
}

# ============================================================================
# INTERACTIVE ELEMENTS
# ============================================================================

# Confirmation prompt
confirm_action() {
    local prompt="${1:-Continue?}"
    local default="${2:-n}"
    
    if [[ "$default" == "y" ]]; then
        echo -ne "${COLOR_YELLOW}${prompt} [Y/n]: ${COLOR_RESET}"
    else
        echo -ne "${COLOR_YELLOW}${prompt} [y/N]: ${COLOR_RESET}"
    fi
    
    read -r response
    response=${response:-$default}
    
    [[ "$response" =~ ^[Yy]$ ]]
}

# Menu selection
show_menu() {
    local title="$1"
    shift
    local options=("$@")
    
    echo ""
    echo -e "${COLOR_BOLD}${COLOR_BRIGHT_CYAN}${title}${COLOR_RESET}"
    echo ""
    
    local i=1
    for option in "${options[@]}"; do
        echo -e "  ${COLOR_BRIGHT_WHITE}${i}.${COLOR_RESET} ${option}"
        ((i++))
    done
    
    echo ""
    echo -ne "${COLOR_YELLOW}Select option: ${COLOR_RESET}"
}

# ============================================================================
# ENGINE INITIALIZATION
# ============================================================================

# Initialize visual engine
init_visual_engine() {
    get_terminal_size
    detect_terminal_capabilities
    init_colors
    
    # Enable mouse support if available
    if [[ "$NEXUS_MOUSE_SUPPORT" == "true" ]]; then
        printf '\e[?1000;1006;1015h'  # Enable mouse tracking
        trap 'cleanup_visual_engine' EXIT INT TERM
    fi
    
    # Enable alternative screen buffer (optional)
    # tput smcup 2>/dev/null || true
}

# Clean up visual engine
cleanup_visual_engine() {
    # Disable mouse tracking
    if [[ "$NEXUS_MOUSE_SUPPORT" == "true" ]]; then
        printf '\e[?1000;1006;1015l' 2>/dev/null || true
    fi
    
    # Restore screen buffer (if enabled)
    # tput rmcup 2>/dev/null || true
    
    # Reset colors
    printf "${COLOR_RESET}"
}

# Auto-initialize on load
init_visual_engine

echo "Visual Rendering Engine loaded (v9.0)"
