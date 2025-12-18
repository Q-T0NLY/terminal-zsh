#!/usr/bin/env bash
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║            NEXUSPRO HYPER REGISTRY - ADVANCED GRAPH ENGINE                   ║
# ║      Real-time Charts, Sparklines & Glowing Line Visualizations              ║
# ╠═══════════════════════════════════════════════════════════════════════════════╣
# ║ Purpose: Advanced data visualization for CLI applications                    ║
# ║ Features: Line charts, bar charts, sparklines, glowing effects               ║
# ║ Version: v1.0.0 | Created: 2025-12-16                                        ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

set -euo pipefail

# Source visual engine
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/visual_engine.sh"

# ═══════════════════════════════════════════════════════════════════════════════
# GRAPH CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Chart dimensions
CHART_WIDTH=60
CHART_HEIGHT=15
CHART_PADDING=2

# Sparkline characters
declare -a SPARKLINE_CHARS=("▁" "▂" "▃" "▄" "▅" "▆" "▇" "█")

# Braille characters for smooth lines
declare -a BRAILLE_DOTS=(
    "⠀" "⠁" "⠂" "⠃" "⠄" "⠅" "⠆" "⠇"
    "⠈" "⠉" "⠊" "⠋" "⠌" "⠍" "⠎" "⠏"
    "⠐" "⠑" "⠒" "⠓" "⠔" "⠕" "⠖" "⠗"
    "⠘" "⠙" "⠚" "⠛" "⠜" "⠝" "⠞" "⠟"
)

# Plotting characters
declare -A PLOT_CHARS=(
    [dot]="●"
    [circle]="○"
    [square]="■"
    [diamond]="◆"
    [triangle]="▲"
    [star]="★"
    [cross]="✖"
    [plus]="+"
)

# ═══════════════════════════════════════════════════════════════════════════════
# SPARKLINE RENDERING
# ═══════════════════════════════════════════════════════════════════════════════

render_sparkline_advanced() {
    local label=$1
    shift
    local values=("$@")
    local width=${CHART_WIDTH:-60}
    
    if [[ ${#values[@]} -eq 0 ]]; then
        echo -e "${COLORS[ACCENT_RED]}No data to display${COLORS[RESET]}"
        return 1
    fi
    
    # Find min/max for normalization
    local min=${values[0]}
    local max=${values[0]}
    
    for val in "${values[@]}"; do
        if (( $(echo "$val < $min" | bc -l) )); then min=$val; fi
        if (( $(echo "$val > $max" | bc -l) )); then max=$val; fi
    done
    
    local range=$(bc <<< "$max - $min")
    if (( $(echo "$range == 0" | bc -l) )); then range=1; fi
    
    # Build sparkline with glowing gradient
    local sparkline=""
    local gradient_colors=(51 45 39 87 123 159 195 231)  # Cyan to white gradient
    local num_colors=${#gradient_colors[@]}
    
    for i in "${!values[@]}"; do
        local val=${values[$i]}
        
        # Normalize to 0-7 range
        local normalized=$(bc <<< "scale=0; ($val - $min) * 7 / $range")
        local char_idx=$(printf "%.0f" "$normalized")
        
        # Select color based on position (glowing effect)
        local color_idx=$(( i % num_colors ))
        local color="\033[38;5;${gradient_colors[$color_idx]}m"
        
        sparkline+="${color}${SPARKLINE_CHARS[$char_idx]}${COLORS[RESET]}"
    done
    
    # Render with label and stats
    printf "%-20s ${COLORS[BOLD]}%s${COLORS[RESET]} " "$label" "$sparkline"
    printf "${COLORS[DIM]}(min:%.1f max:%.1f avg:%.1f)${COLORS[RESET]}\n" \
        "$min" "$max" "$(calculate_average "${values[@]}")"
}

calculate_average() {
    local values=("$@")
    local sum=0
    local count=${#values[@]}
    
    for val in "${values[@]}"; do
        sum=$(bc <<< "$sum + $val")
    done
    
    bc <<< "scale=2; $sum / $count"
}

# ═══════════════════════════════════════════════════════════════════════════════
# LINE CHART WITH GLOWING LINES
# ═══════════════════════════════════════════════════════════════════════════════

render_line_chart() {
    local title=$1
    shift
    local data_points=("$@")
    
    if [[ ${#data_points[@]} -eq 0 ]]; then
        echo -e "${COLORS[ACCENT_RED]}No data to display${COLORS[RESET]}"
        return 1
    fi
    
    # Calculate dimensions
    local width=$((CHART_WIDTH - CHART_PADDING * 2))
    local height=$((CHART_HEIGHT - 4))
    
    # Find min/max
    local min=${data_points[0]}
    local max=${data_points[0]}
    
    for val in "${data_points[@]}"; do
        if (( $(echo "$val < $min" | bc -l) )); then min=$val; fi
        if (( $(echo "$val > $max" | bc -l) )); then max=$val; fi
    done
    
    local range=$(bc <<< "$max - $min")
    if (( $(echo "$range == 0" | bc -l) )); then range=1; fi
    
    # Initialize chart grid
    declare -A grid
    
    # Plot data points with interpolation
    local step_x=$(bc <<< "scale=4; $width / ${#data_points[@]}")
    
    for i in "${!data_points[@]}"; do
        local val=${data_points[$i]}
        
        # Normalize y position
        local y=$(bc <<< "scale=0; ($height - 1) * ($val - $min) / $range")
        y=$(printf "%.0f" "$y")
        
        # Calculate x position
        local x=$(bc <<< "scale=0; $i * $step_x")
        x=$(printf "%.0f" "$x")
        
        # Mark point with glow
        for dy in -1 0 1; do
            for dx in -1 0 1; do
                local gx=$((x + dx))
                local gy=$((y + dy))
                
                if [[ $gx -ge 0 && $gx -lt $width && $gy -ge 0 && $gy -lt $height ]]; then
                    # Center point is brightest
                    if [[ $dx -eq 0 && $dy -eq 0 ]]; then
                        grid[$gx,$gy]="●"
                    else
                        grid[$gx,$gy]="○"
                    fi
                fi
            done
        done
        
        # Draw connecting line to next point
        if [[ $i -lt $((${#data_points[@]} - 1)) ]]; then
            local next_val=${data_points[$((i + 1))]}
            local next_y=$(bc <<< "scale=0; ($height - 1) * ($next_val - $min) / $range")
            next_y=$(printf "%.0f" "$next_y")
            local next_x=$(bc <<< "scale=0; ($i + 1) * $step_x")
            next_x=$(printf "%.0f" "$next_x")
            
            # Draw line between points
            draw_line_segment "$x" "$y" "$next_x" "$next_y" width height grid
        fi
    done
    
    # Render chart
    echo
    draw_box "$title" $CHART_WIDTH \
        "$(render_y_axis "$height" "$min" "$max")" \
        "$(render_chart_grid width height grid)" \
        "$(render_x_axis "$width" "${#data_points[@]}")" \
        ""
}

draw_line_segment() {
    local x1=$1 y1=$2 x2=$3 y2=$4
    local width=$5 height=$6
    local -n grid_ref=$7
    
    # Bresenham's line algorithm
    local dx=$((x2 - x1))
    local dy=$((y2 - y1))
    local steps=$(( dx > dy ? dx : dy ))
    
    if [[ $steps -eq 0 ]]; then return; fi
    
    local x_inc=$(bc <<< "scale=4; $dx / $steps")
    local y_inc=$(bc <<< "scale=4; $dy / $steps")
    
    local x=$x1
    local y=$y1
    
    for ((i=0; i<=steps; i++)); do
        local px=$(printf "%.0f" "$x")
        local py=$(printf "%.0f" "$y")
        
        if [[ $px -ge 0 && $px -lt $width && $py -ge 0 && $py -lt $height ]]; then
            grid_ref[$px,$py]="─"
        fi
        
        x=$(bc <<< "$x + $x_inc")
        y=$(bc <<< "$y + $y_inc")
    done
}

render_chart_grid() {
    local width=$1 height=$2
    local -n grid_ref=$3
    
    local output=""
    
    # Render from top to bottom (inverted y-axis for display)
    for ((y=height-1; y>=0; y--)); do
        output+="  "
        
        for ((x=0; x<width; x++)); do
            if [[ -n "${grid_ref[$x,$y]}" ]]; then
                # Glowing effect based on character type
                if [[ "${grid_ref[$x,$y]}" == "●" ]]; then
                    output+="${COLORS[NEURAL_LIME]}●${COLORS[RESET]}"
                elif [[ "${grid_ref[$x,$y]}" == "○" ]]; then
                    output+="${COLORS[QUANTUM_CYAN]}○${COLORS[RESET]}"
                else
                    output+="${COLORS[QUANTUM_BLUE]}─${COLORS[RESET]}"
                fi
            else
                output+=" "
            fi
        done
        
        output+="\n"
    done
    
    echo -e "$output"
}

render_y_axis() {
    local height=$1 min=$2 max=$3
    
    local output=""
    local step=$(bc <<< "scale=2; ($max - $min) / 4")
    
    for i in {4..0}; do
        local val=$(bc <<< "scale=1; $min + ($step * $i)")
        output+=$(printf "%6.1f │\n" "$val")
    done
    
    echo -e "$output"
}

render_x_axis() {
    local width=$1 num_points=$2
    
    local output="       └"
    
    for ((i=0; i<width; i++)); do
        output+="─"
    done
    
    output+="┘\n"
    output+="        0"
    
    # Add tick marks
    local quarter=$((width / 4))
    for ((i=1; i<=3; i++)); do
        printf "%*s" "$quarter" "" >> /dev/null
        output+=$(printf "%*d" "$quarter" $((num_points * i / 4)))
    done
    
    output+=$(printf "%*d" "$((width - quarter * 3))" "$num_points")
    
    echo -e "$output"
}

# ═══════════════════════════════════════════════════════════════════════════════
# BAR CHART
# ═══════════════════════════════════════════════════════════════════════════════

render_bar_chart() {
    local title=$1
    shift
    local labels=()
    local values=()
    
    # Parse label:value pairs
    while [[ $# -gt 0 ]]; do
        IFS=':' read -r label value <<< "$1"
        labels+=("$label")
        values+=("$value")
        shift
    done
    
    if [[ ${#values[@]} -eq 0 ]]; then
        echo -e "${COLORS[ACCENT_RED]}No data to display${COLORS[RESET]}"
        return 1
    fi
    
    # Find max for scaling
    local max=${values[0]}
    for val in "${values[@]}"; do
        if (( $(echo "$val > $max" | bc -l) )); then max=$val; fi
    done
    
    # Render bars
    echo
    draw_box "$title" 70 ""
    
    local bar_width=40
    
    for i in "${!labels[@]}"; do
        local label=${labels[$i]}
        local value=${values[$i]}
        
        # Calculate bar length
        local bar_len=$(bc <<< "scale=0; $bar_width * $value / $max")
        bar_len=$(printf "%.0f" "$bar_len")
        
        # Build gradient bar
        local bar=""
        local gradient_colors=(46 82 118 154 190 226)
        
        for ((j=0; j<bar_len; j++)); do
            local color_idx=$(( (j * ${#gradient_colors[@]}) / bar_len ))
            bar+="\033[38;5;${gradient_colors[$color_idx]}m█${COLORS[RESET]}"
        done
        
        printf "  %-15s %s %.1f\n" "$label" "$bar" "$value"
    done
    
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# REAL-TIME GRAPH STREAMING
# ═══════════════════════════════════════════════════════════════════════════════

stream_live_graph() {
    local title=$1
    local data_generator=$2  # Function name that generates data
    local interval=${3:-1}  # Update interval in seconds
    
    hide_cursor
    
    # Initialize data buffer
    local -a buffer=()
    local max_points=50
    
    clear_screen
    
    while true; do
        # Get new data point
        local new_value=$($data_generator)
        buffer+=("$new_value")
        
        # Keep buffer size limited
        if [[ ${#buffer[@]} -gt $max_points ]]; then
            buffer=("${buffer[@]:1}")
        fi
        
        # Render
        move_cursor 1 1
        
        draw_quantum_header "$title" "Real-time Monitoring" 70
        echo
        
        render_sparkline_advanced "Live Data" "${buffer[@]}"
        echo
        
        # Mini line chart
        local mini_chart=""
        for val in "${buffer[@]}"; do
            local height=$(bc <<< "scale=0; $val / 10")
            height=$(printf "%.0f" "$height")
            [[ $height -gt 7 ]] && height=7
            mini_chart+="${SPARKLINE_CHARS[$height]}"
        done
        
        echo -e "  ${COLORS[NEURAL_LIME]}$mini_chart${COLORS[RESET]}"
        echo
        
        show_progress_bar "${buffer[-1]}" 60 "Current Value"
        
        echo
        echo -e "${COLORS[DIM]}Press Ctrl+C to stop${COLORS[RESET]}"
        
        sleep "$interval"
    done
    
    show_cursor
}

# ═══════════════════════════════════════════════════════════════════════════════
# HEATMAP VISUALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

render_heatmap() {
    local title=$1
    shift
    local rows=$1
    shift
    local cols=$1
    shift
    local data=("$@")
    
    # Heat characters (cold to hot)
    local heat_chars=(" " "░" "▒" "▓" "█")
    local heat_colors=(51 87 123 159 195 226 220 214 208 202 196)
    
    echo
    draw_box "$title" 70 ""
    
    # Find min/max
    local min=${data[0]}
    local max=${data[0]}
    
    for val in "${data[@]}"; do
        if (( $(echo "$val < $min" | bc -l) )); then min=$val; fi
        if (( $(echo "$val > $max" | bc -l) )); then max=$val; fi
    done
    
    local range=$(bc <<< "$max - $min")
    if (( $(echo "$range == 0" | bc -l) )); then range=1; fi
    
    # Render grid
    for ((r=0; r<rows; r++)); do
        echo -n "  "
        for ((c=0; c<cols; c++)); do
            local idx=$((r * cols + c))
            
            if [[ $idx -lt ${#data[@]} ]]; then
                local val=${data[$idx]}
                
                # Normalize to 0-10 range
                local normalized=$(bc <<< "scale=0; ($val - $min) * 10 / $range")
                normalized=$(printf "%.0f" "$normalized")
                
                local color="\033[38;5;${heat_colors[$normalized]}m"
                local char_idx=$((normalized / 2))
                [[ $char_idx -gt 4 ]] && char_idx=4
                
                echo -ne "${color}${heat_chars[$char_idx]}${COLORS[RESET]} "
            else
                echo -n "  "
            fi
        done
        echo
    done
    
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# GAUGE / METER VISUALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

render_gauge() {
    local label=$1
    local value=$2
    local max=$3
    local unit=${4:-"%"}
    
    local width=50
    local percent=$(bc <<< "scale=0; 100 * $value / $max")
    
    # ASCII gauge arc
    local gauge_chars=("◜" "◝" "◞" "◟" "◠" "◡" "◸" "◹" "◺" "◿")
    local filled=$(bc <<< "scale=0; ${#gauge_chars[@]} * $value / $max")
    filled=$(printf "%.0f" "$filled")
    
    local gauge=""
    for ((i=0; i<${#gauge_chars[@]}; i++)); do
        if [[ $i -lt $filled ]]; then
            gauge+="${COLORS[NEURAL_GREEN]}${gauge_chars[$i]}${COLORS[RESET]}"
        else
            gauge+="${COLORS[DIM]}${gauge_chars[$i]}${COLORS[RESET]}"
        fi
    done
    
    echo -e "  ${label}"
    echo -e "  ${gauge} ${COLORS[ACCENT_GOLD]}${value}${unit}${COLORS[RESET]} / ${max}${unit}"
    show_progress_bar "$percent" "$width" ""
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEMO MODE
# ═══════════════════════════════════════════════════════════════════════════════

demo_graphs() {
    clear_screen
    
    draw_quantum_header "GRAPH ENGINE DEMONSTRATION" "Advanced CLI Visualizations" 80
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}1. Sparklines with Glowing Effect${COLORS[RESET]}"
    echo
    
    # Sample data
    local cpu_data=(45 52 48 55 63 58 51 49 54 61 67 72 68 64 59)
    local mem_data=(62 65 63 68 71 69 66 64 67 70 73 75 72 68 65)
    local net_data=(12 18 15 22 28 31 26 19 16 21 27 33 29 23 18)
    
    render_sparkline_advanced "CPU Usage %" "${cpu_data[@]}"
    render_sparkline_advanced "Memory %" "${mem_data[@]}"
    render_sparkline_advanced "Network MB/s" "${net_data[@]}"
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}2. Bar Chart${COLORS[RESET]}"
    
    render_bar_chart "Resource Distribution" \
        "Frontend:45.5" \
        "Backend:78.3" \
        "Database:92.1" \
        "Cache:56.7" \
        "Queue:33.2"
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}3. Gauge Meters${COLORS[RESET]}"
    echo
    
    render_gauge "CPU Temperature" 67 100 "°C"
    render_gauge "Disk Usage" 234 500 "GB"
    
    echo
    echo -e "${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}✓ Graph Engine Demo Complete${COLORS[RESET]}"
    echo
}

# Export functions
export -f render_sparkline_advanced
export -f render_line_chart
export -f render_bar_chart
export -f render_heatmap
export -f render_gauge
export -f stream_live_graph

# Run demo if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    demo_graphs
fi
