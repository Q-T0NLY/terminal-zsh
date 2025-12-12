#!/usr/bin/env zsh
# 🎮 QUANTUM DOWNLOAD VISUAL DEMO
# Showcase ultra-modern 3D download visualizations
# 📅 December 12, 2025

# Source the quantum engines
SCRIPT_DIR="${0:A:h}"
source "${SCRIPT_DIR}/../src/visuals/quantum_3d_engine.zsh"
source "${SCRIPT_DIR}/../src/core/quantum_download.zsh"

clear

# Demo menu
show_demo_menu() {
    quantum_header_3d "QUANTUM DOWNLOAD VISUAL DEMO" "🎨 Ultra-Modern 3D Experience"
    
    echo -e "${Q3D_INFO}Select a demo to experience:${Q3D_RESET}\n"
    echo -e "  ${Q3D_ACCENT}1${Q3D_RESET} - ${Q3D_SUCCESS}Multi-Threaded Download${Q3D_RESET} (8 parallel threads)"
    echo -e "  ${Q3D_ACCENT}2${Q3D_RESET} - ${Q3D_SUCCESS}Segmented Download${Q3D_RESET} (4-part assembly)"
    echo -e "  ${Q3D_ACCENT}3${Q3D_RESET} - ${Q3D_SUCCESS}Protected Download${Q3D_RESET} (7-layer security)"
    echo -e "  ${Q3D_ACCENT}4${Q3D_RESET} - ${Q3D_SUCCESS}Visual Components Test${Q3D_RESET} (all UI elements)"
    echo -e "  ${Q3D_ACCENT}5${Q3D_RESET} - ${Q3D_WARNING}Exit${Q3D_RESET}\n"
    
    echo -ne "${Q3D_HIGHLIGHT}Enter your choice [1-5]: ${Q3D_RESET}"
    read choice
    
    case $choice in
        1)
            clear
            demo_multi_threaded
            ;;
        2)
            clear
            demo_segmented
            ;;
        3)
            clear
            demo_protected
            ;;
        4)
            clear
            demo_components
            ;;
        5)
            echo -e "\n${Q3D_SUCCESS}✨ Thank you for experiencing Quantum Download Visuals!${Q3D_RESET}\n"
            exit 0
            ;;
        *)
            echo -e "\n${Q3D_ERROR}❌ Invalid choice. Please try again.${Q3D_RESET}\n"
            sleep 1
            clear
            show_demo_menu
            ;;
    esac
}

# Demo 1: Multi-threaded download
demo_multi_threaded() {
    quantum_multi_download \
        "https://example.com/large-file.iso" \
        "/tmp/demo-file.iso" \
        8
    
    echo -e "\n${Q3D_INFO}Press Enter to return to menu...${Q3D_RESET}"
    read
    clear
    show_demo_menu
}

# Demo 2: Segmented download
demo_segmented() {
    quantum_segmented_download \
        "https://example.com/large-file.iso" \
        "/tmp/demo-file.iso" \
        4
    
    echo -e "\n${Q3D_INFO}Press Enter to return to menu...${Q3D_RESET}"
    read
    clear
    show_demo_menu
}

# Demo 3: Protected download
demo_protected() {
    quantum_protected_download \
        "https://example.com/secure-file.zip" \
        "/tmp/secure-file.zip"
    
    echo -e "\n${Q3D_INFO}Press Enter to return to menu...${Q3D_RESET}"
    read
    clear
    show_demo_menu
}

# Demo 4: Individual components
demo_components() {
    quantum_header_3d "VISUAL COMPONENTS TEST" "🎨 All UI Elements Showcase"
    
    # Test 1: Progress bars
    echo -e "${Q3D_ACCENT}━━━ Progress Bars ━━━${Q3D_RESET}\n"
    for percent in 0 25 50 75 100; do
        holographic_progress "$percent" "Download Progress"
        echo ""
        sleep 0.5
    done
    
    # Test 2: Spinners
    echo -e "\n${Q3D_ACCENT}━━━ Quantum Spinner ━━━${Q3D_RESET}\n"
    spinner_3d "Processing quantum data" 3
    echo -e "${Q3D_SUCCESS}✅ Complete!${Q3D_RESET}\n"
    
    # Test 3: Speedometer
    echo -e "${Q3D_ACCENT}━━━ Speed Visualization ━━━${Q3D_RESET}\n"
    for speed in 524288 1048576 5242880 10485760 52428800; do
        quantum_speedometer "$speed"
        echo ""
        sleep 0.5
    done
    
    # Test 4: Connection visualizer
    echo -e "\n${Q3D_ACCENT}━━━ Connection Matrix ━━━${Q3D_RESET}\n"
    for active in {0..8}; do
        connection_visualizer_3d "$active" 8
        echo ""
        sleep 0.3
    done
    
    # Test 5: ETA display
    echo -e "\n${Q3D_ACCENT}━━━ ETA Countdown ━━━${Q3D_RESET}\n"
    for eta in 3600 1800 600 60 10; do
        quantum_eta_display "$eta"
        echo ""
        sleep 0.5
    done
    
    # Test 6: Statistics
    echo -e "\n${Q3D_ACCENT}━━━ Holographic Statistics ━━━${Q3D_RESET}"
    holographic_stats \
        "CPU Usage:45" \
        "Memory:67" \
        "Network:89" \
        "Disk I/O:34" \
        "Overall:72"
    
    # Test 7: Celebration
    quantum_celebration "ALL TESTS PASSED"
    
    # Test 8: Particles
    echo -e "${Q3D_ACCENT}━━━ Quantum Particles ━━━${Q3D_RESET}\n"
    quantum_particles 2
    
    echo -e "\n${Q3D_SUCCESS}✨ All visual components tested successfully!${Q3D_RESET}"
    echo -e "${Q3D_INFO}Press Enter to return to menu...${Q3D_RESET}"
    read
    clear
    show_demo_menu
}

# Start the demo
show_demo_menu
