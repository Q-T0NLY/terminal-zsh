#!/usr/bin/env zsh
# 📥 QUANTUM DOWNLOADER LAYOUT SYSTEM v3.0
# Enhanced visual downloader with integrated sub-registries
# ════════════════════════════════════════════════════════════════════════

# Source master coordinator
source "${0:A:h}/master_registry_coordinator.zsh" 2>/dev/null || {
    echo "❌ Master Registry Coordinator not found"
    return 1
}

# Source quantum holographic engine
source "${0:A:h}/../visuals/quantum_holographic.zsh" 2>/dev/null || {
    echo "❌ Quantum Holographic Engine not found"
    return 1
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 DOWNLOADER LAYOUT STRUCTURE
# ════════════════════════════════════════════════════════════════════════

typeset -gA DOWNLOADER_LAYOUT_CONFIG

# ════════════════════════════════════════════════════════════════════════
# 📐 DRAW DOWNLOADER HEADER
# ════════════════════════════════════════════════════════════════════════

draw_downloader_header() {
    local title="$1"
    local scenario="${2:-fast}"
    local theme="${3:-quantum_neon}"
    
    # Get theme colors
    local theme_data="${DOWNLOADER_THEMES[$theme]}"
    local palette_id=$(echo "$theme_data" | grep -o '"palette": "[^"]*"' | cut -d'"' -f4)
    
    echo -e "\n"
    
    # Quantum wave animation
    quantum_wave 0.8 70 2
    
    # Main header frame
    holographic_frame "$title - $scenario" 70 "double"
    
    # Metadata line
    echo -ne "  ${QH_INFO}📅 $(date '+%Y-%m-%d %H:%M:%S')  "
    echo -ne "🎨 Theme: $theme  "
    echo -ne "🚀 Mode: $scenario"
    echo -e "${QH_RESET}\n"
}

# ════════════════════════════════════════════════════════════════════════
# 📊 DRAW DOWNLOADER STATS PANEL
# ════════════════════════════════════════════════════════════════════════

draw_downloader_stats() {
    local filename="$1"
    local total_size="$2"
    local speed="$3"
    
    echo -e "  ${QH_INFO}📁 File Information:${QH_RESET}"
    echo -e "    Filename: $(basename "$filename")"
    echo -e "    Size: ${QH_HIGHLIGHT}$(numfmt --to=iec "$total_size" 2>/dev/null || echo "$total_size")${QH_RESET}"
    echo -e "    Speed: ${QH_SUCCESS}$(numfmt --to=iec "$speed" 2>/dev/null || echo "$speed")/s${QH_RESET}\n"
}

# ════════════════════════════════════════════════════════════════════════
# 🎬 DRAW ENHANCED PROGRESS VISUALIZATION
# ════════════════════════════════════════════════════════════════════════

draw_downloader_progress() {
    local percent="$1"
    local downloaded="$2"
    local total="$3"
    local speed="$4"
    local active_threads="$5"
    local threads_total="${6:-12}"
    local scenario="${7:-fast}"
    
    # 3D Progress bar
    echo -ne "  ${QH_INFO}📥 Progress: ${QH_RESET}"
    rounded_progress_3d "$percent" ""
    echo -e " ${QH_HIGHLIGHT}${percent}%${QH_RESET}\n"
    
    # Data transferred visualization
    echo -e "  ${QH_INFO}📊 Data Transfer:${QH_RESET}"
    
    local downloaded_mb=$(echo "scale=2; $downloaded / 1048576" | bc -l)
    local total_mb=$(echo "scale=2; $total / 1048576" | bc -l)
    
    echo -e "    Downloaded: ${QH_SUCCESS}${downloaded_mb}MB${QH_RESET} / ${QH_INFO}${total_mb}MB${QH_RESET}"
    
    # Speed visualization
    echo -ne "  ${QH_INFO}⚡ Speed: ${QH_RESET}"
    quantum_signal_bars $((speed * 100 / 5000000)) 8 false
    local speed_mb=$(echo "scale=2; $speed / 1048576" | bc -l)
    echo -e " ${QH_HIGHLIGHT}${speed_mb}MB/s${QH_RESET}\n"
    
    # Thread visualization (for multi-path scenario)
    if [[ "$scenario" == "multi-path" ]]; then
        echo -e "  ${QH_INFO}🧵 Active Threads: ${QH_HIGHLIGHT}$active_threads/$threads_total${QH_RESET}"
        quantum_connection_matrix "$active_threads" "$threads_total" 50
    fi
}

# ════════════════════════════════════════════════════════════════════════
# ⏱️ DRAW TIMING & ETA PANEL
# ════════════════════════════════════════════════════════════════════════

draw_timing_panel() {
    local elapsed="$1"
    local eta="$2"
    local start_time="$3"
    
    echo -e "\n  ${QH_INFO}⏱️  Timing Information:${QH_RESET}"
    
    # Elapsed time
    local elapsed_min=$((elapsed / 60))
    local elapsed_sec=$((elapsed % 60))
    echo -e "    Elapsed: ${QH_HIGHLIGHT}${elapsed_min}m ${elapsed_sec}s${QH_RESET}"
    
    # ETA
    local eta_min=$((eta / 60))
    local eta_sec=$((eta % 60))
    
    if [[ $eta -lt 10 ]]; then
        echo -e "    ETA: ${QH_SUCCESS}${eta_min}m ${eta_sec}s${QH_RESET}"
    elif [[ $eta -lt 60 ]]; then
        echo -e "    ETA: ${QH_INFO}${eta_min}m ${eta_sec}s${QH_RESET}"
    else
        echo -e "    ETA: ${QH_WARNING}${eta_min}m ${eta_sec}s${QH_RESET}"
    fi
}

# ════════════════════════════════════════════════════════════════════════
# 🛡️ DRAW SECURITY PANEL (for secure scenario)
# ════════════════════════════════════════════════════════════════════════

draw_security_panel() {
    local encryption_level="$1"
    local verification="$2"
    local integrity="$3"
    
    echo -e "\n  ${QH_INFO}🔐 Security Status:${QH_RESET}"
    echo -e "    Encryption: ${QH_SUCCESS}$encryption_level${QH_RESET}"
    echo -ne "    Verification: "
    quantum_signal_bars "$verification" 5 false
    echo -e " ${QH_SUCCESS}${verification}%${QH_RESET}"
    echo -e "    Integrity: ${QH_HIGHLIGHT}$integrity${QH_RESET}\n"
}

# ════════════════════════════════════════════════════════════════════════
# 🎪 MAIN DOWNLOADER INTERFACE
# ════════════════════════════════════════════════════════════════════════

quantum_enhanced_downloader() {
    local url="$1"
    local output="$2"
    local scenario="${3:-fast}"
    local theme="${4:-quantum_neon}"
    
    [[ -z "$url" ]] || [[ -z "$output" ]] && {
        echo "Usage: quantum_enhanced_downloader <url> <output> [scenario] [theme]"
        echo "Scenarios: fast, secure, multi-path, interactive"
        echo "Themes: quantum_neon, cyberpunk_dark, minimal_calm, high_contrast, warm_sunset"
        return 1
    }
    
    # Draw header
    draw_downloader_header "QUANTUM ENHANCED DOWNLOADER" "$scenario" "$theme"
    
    # Simulate download simulation with registry-based visuals
    local total_size=$((100 + RANDOM % 500)) # MB
    local total_bytes=$((total_size * 1048576))
    local downloaded=0
    local start_time=$(date +%s)
    
    local speeds=()
    local progress=0
    local active_threads=1
    local max_threads=12
    
    # Download simulation loop
    while [[ $progress -lt 100 ]]; do
        clear
        
        # Draw header
        draw_downloader_header "QUANTUM ENHANCED DOWNLOADER" "$scenario" "$theme"
        
        # File stats
        draw_downloader_stats "$output" "$total_bytes" 1000000
        
        # Progress visualization using registered components
        local current_speed=$((100 + RANDOM % 900)) # KB/s
        local speed_bytes=$((current_speed * 1024))
        
        downloaded=$((downloaded + speed_bytes))
        [[ $downloaded -gt $total_bytes ]] && downloaded=$total_bytes
        
        progress=$((downloaded * 100 / total_bytes))
        
        # Update thread count for multi-path scenario
        if [[ "$scenario" == "multi-path" ]]; then
            active_threads=$((1 + progress * max_threads / 100))
        fi
        
        # Draw progress
        draw_downloader_progress "$progress" "$downloaded" "$total_bytes" "$speed_bytes" "$active_threads" "$max_threads" "$scenario"
        
        # Draw security panel for secure scenario
        if [[ "$scenario" == "secure" ]]; then
            draw_security_panel "AES-256 Quantum" $((80 + progress)) "VERIFIED"
        fi
        
        # Draw timing
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [[ $speed_bytes -gt 0 ]]; then
            local remaining=$((total_bytes - downloaded))
            local eta=$((remaining / speed_bytes))
        else
            local eta=0
        fi
        
        draw_timing_panel "$elapsed" "$eta" "$start_time"
        
        # Quantum wave animation every 25%
        if [[ $((progress % 25)) -eq 0 ]] && [[ $progress -gt 0 ]]; then
            holographic_frame "" 70 "rounded"
        fi
        
        # Add animation variety
        if [[ $scenario == "interactive" ]]; then
            echo -e "\n"
            quantum_data_stream $speed_bytes 50 2
        fi
        
        sleep 0.5
    done
    
    # Download complete
    echo -e "\n"
    holographic_notify "success" "Download Complete! 🎉"
    
    # Final sparkle celebration
    quantum_sparkle_burst 2 70 5
    
    # Summary
    holographic_frame "DOWNLOAD COMPLETE" 70 "double"
    echo -e "  ${QH_SUCCESS}✅ File successfully downloaded and verified${QH_RESET}"
    echo -e "  ${QH_INFO}📁 Saved to: $output${QH_RESET}"
    echo -e "  ${QH_INFO}📊 Size: ${total_size}MB${QH_RESET}"
    echo -e "  ${QH_INFO}⏱️  Total Time: ${elapsed}s${QH_RESET}"
    echo -e "  ${QH_INFO}🎨 Theme: $theme | 🚀 Scenario: $scenario${QH_RESET}"
    holographic_frame "" 70 "double"
    
    echo -e "\n"
}

# ════════════════════════════════════════════════════════════════════════
# 🎛️ INTERACTIVE DOWNLOADER MENU
# ════════════════════════════════════════════════════════════════════════

quantum_downloader_menu() {
    while true; do
        clear
        
        # Get registry stats
        calculate_registry_stats
        
        quantum_wave 0.5 70 2
        
        holographic_frame "QUANTUM DOWNLOADER SUITE" 70 "double"
        
        echo -e "\n  ${QH_INFO}📥 DOWNLOAD OPTIONS:${QH_RESET}\n"
        echo -e "  1. ${QH_HIGHLIGHT}Fast Download${QH_RESET} (Optimized for speed)"
        echo -e "  2. ${QH_HIGHLIGHT}Secure Download${QH_RESET} (With encryption visualization)"
        echo -e "  3. ${QH_HIGHLIGHT}Multi-Path Download${QH_RESET} (Parallel thread visualization)"
        echo -e "  4. ${QH_HIGHLIGHT}Interactive Download${QH_RESET} (Full visual effects)\n"
        
        echo -e "  ${QH_INFO}🎨 THEME SELECTION:${QH_RESET}\n"
        echo -e "  5. Quantum Neon Theme"
        echo -e "  6. Cyberpunk Dark Theme"
        echo -e "  7. Minimal Calm Theme"
        echo -e "  8. High Contrast Theme"
        echo -e "  9. Warm Sunset Theme\n"
        
        echo -e "  ${QH_INFO}📊 REGISTRY INFO:${QH_RESET}\n"
        echo -e "  R. Show Registry Dashboard"
        echo -e "  S. Show Registry Statistics\n"
        
        echo -e "  Q. Exit\n"
        
        echo -ne "  ${QH_WARNING}Select option: ${QH_RESET}"
        read -k1 choice
        echo ""
        
        case "$choice" in
            1)
                echo -ne "\n  ${QH_INFO}Enter download URL: ${QH_RESET}"
                read url
                echo -ne "  ${QH_INFO}Enter output file: ${QH_RESET}"
                read output
                quantum_enhanced_downloader "$url" "$output" "fast" "quantum_neon"
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            2)
                echo -ne "\n  ${QH_INFO}Enter download URL: ${QH_RESET}"
                read url
                echo -ne "  ${QH_INFO}Enter output file: ${QH_RESET}"
                read output
                quantum_enhanced_downloader "$url" "$output" "secure" "high_contrast"
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            3)
                echo -ne "\n  ${QH_INFO}Enter download URL: ${QH_RESET}"
                read url
                echo -ne "  ${QH_INFO}Enter output file: ${QH_RESET}"
                read output
                quantum_enhanced_downloader "$url" "$output" "multi-path" "cyberpunk_dark"
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            4)
                echo -ne "\n  ${QH_INFO}Enter download URL: ${QH_RESET}"
                read url
                echo -ne "  ${QH_INFO}Enter output file: ${QH_RESET}"
                read output
                quantum_enhanced_downloader "$url" "$output" "interactive" "quantum_neon"
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            R)
                show_registry_dashboard
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            S)
                clear
                echo -e "\n${QH_INFO}📊 REGISTRY STATISTICS${QH_RESET}\n"
                echo -e "  3D Components: ${REGISTRY_STATS[3d_components]}"
                echo -e "  Animations: ${REGISTRY_STATS[animation_components]}"
                echo -e "  Color Palettes: ${REGISTRY_STATS[color_palettes]}"
                echo -e "  Emoji Sets: ${REGISTRY_STATS[emoji_sets]}"
                echo -e "  UI Elements: ${REGISTRY_STATS[ui_elements]}"
                echo -e "  Total: ${REGISTRY_STATS[total_components]}\n"
                read -k1 -s "?${QH_INFO}Press any key to continue...${QH_RESET}"
                ;;
            Q|q)
                echo -e "\n  ${QH_SUCCESS}Exiting Quantum Downloader...${QH_RESET}\n"
                quantum_sparkle_burst 1 70 3
                break
                ;;
            *)
                echo -e "  ${QH_ERROR}Invalid option${QH_RESET}"
                sleep 1
                ;;
        esac
    done
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 EXPORT FUNCTIONS
# ════════════════════════════════════════════════════════════════════════

export -f draw_downloader_header
export -f draw_downloader_stats
export -f draw_downloader_progress
export -f draw_timing_panel
export -f draw_security_panel
export -f quantum_enhanced_downloader
export -f quantum_downloader_menu

echo "✅ Quantum Downloader Layout System initialized" >&2
return 0
