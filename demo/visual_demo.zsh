#!/usr/bin/env zsh
# 🎬 VISUAL DEMO APPLICATION
# 🎨 Showcase of Quantum Visual Effects
# 📅 Deployed: December 12, 2025

source "${AETERNUM_HOME}/src/visuals/quantum_core.zsh" 2>/dev/null || source ./quantum_core.zsh
source "${AETERNUM_HOME}/src/gui/visual_enhancements.zsh" 2>/dev/null || source ./visual_enhancements.zsh

# ==================== MAIN DEMO ====================
visual_demo_app() {
    # Hide cursor and clear
    echo -ne "\033[?25l"
    clear
    
    # Initial starfield
    starfield 80 24 100 0.8 &
    local starfield_pid=$!
    sleep 2
    
    # Title sequence
    kill $starfield_pid 2>/dev/null
    clear
    
    echo -e "\n\n\n"
    rainbow_wave "          ⚡ QUANTUM VISUAL DEMO ⚡" 2 0.5
    echo -e "\n\n"
    glow_text "          Terminal Graphics Redefined" "100,200,255" 1.5 2
    echo -e "\n\n"
    
    sleep 2
    
    # Demo menu
    while true; do
        clear
        
        # Main menu
        local choice=$(visual_menu "VISUAL DEMO SUITE" \
            "🎬 Full Effects Demo" \
            "🔥 Fire & Energy Effects" \
            "🌊 Water & Liquid Effects" \
            "💎 Crystal & Geometric Patterns" \
            "✨ Starfield & Space Effects" \
            "📊 Visual Components Demo" \
            "🎮 Interactive Dashboard" \
            "🚪 Exit")
        
        case $choice in
            1) demo_full_effects ;;
            2) demo_fire_energy ;;
            3) demo_water_liquid ;;
            4) demo_crystal_geo ;;
            5) demo_starfield_space ;;
            6) demo_components ;;
            7) demo_dashboard ;;
            0|8) break ;;
        esac
    done
    
    # Exit sequence
    clear
    echo -e "\n\n\n"
    glow_text "          Thank you for experiencing Quantum Visuals!" "255,200,100" 1.5 2
    echo -e "\n\n"
    rainbow_wave "          Reality will never look the same again." 1 0.3
    echo -e "\n\n\n"
    
    echo -ne "\033[?25h"
    sleep 1
}

# ==================== DEMO SCENES ====================
demo_full_effects() {
    clear
    echo -ne "\033[?25l"
    
    visual_progress_screen "Loading Full Effects" 50
    
    # Fire effect
    echo -e "\n\n"
    glow_text "    🔥 FIRE EFFECT" "255,100,100" 1.5 3
    echo -e "\n"
    fire_effect 70 15 0.8
    
    # Water effect
    echo -e "\n\n"
    glow_text "    🌊 LIQUID EFFECT" "100,200,255" 1.5 3
    echo -e "\n"
    liquid_effect 70 15 0.9
    
    # Energy effect
    echo -e "\n\n"
    glow_text "    ⚡ ENERGY EFFECT" "100,255,255" 1.5 3
    echo -e "\n"
    energy_effect 70 15 2.0
    
    # Crystal effect
    echo -e "\n\n"
    glow_text "    💎 CRYSTAL EFFECT" "255,100,255" 1.5 3
    echo -e "\n"
    crystal_effect 70 15 5
    
    echo -e "\n\n"
    visual_notify "info" "Full effects demo complete! Press any key..." 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_fire_energy() {
    clear
    echo -ne "\033[?25l"
    
    # Fire variations
    echo -e "\n"
    glow_text "    🔥 FIRE INTENSITY VARIATIONS" "255,150,100" 1.5 2
    echo -e "\n"
    
    fire_effect 70 12 0.5 &
    local fire1_pid=$!
    sleep 3
    kill $fire1_pid 2>/dev/null
    
    fire_effect 70 12 1.0 &
    local fire2_pid=$!
    sleep 3
    kill $fire2_pid 2>/dev/null
    
    fire_effect 70 12 1.5 &
    local fire3_pid=$!
    sleep 3
    kill $fire3_pid 2>/dev/null
    
    # Energy variations
    echo -e "\n"
    glow_text "    ⚡ ENERGY FIELD VARIATIONS" "100,255,255" 1.5 2
    echo -e "\n"
    
    energy_effect 70 12 1.0 &
    local energy1_pid=$!
    sleep 3
    kill $energy1_pid 2>/dev/null
    
    energy_effect 70 12 2.0 &
    local energy2_pid=$!
    sleep 3
    kill $energy2_pid 2>/dev/null
    
    energy_effect 70 12 3.0 &
    local energy3_pid=$!
    sleep 3
    kill $energy3_pid 2>/dev/null
    
    echo -e "\n\n"
    visual_notify "success" "Fire & Energy demo complete!" 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_water_liquid() {
    clear
    echo -ne "\033[?25l"
    
    # Water variations
    echo -e "\n"
    glow_text "    🌊 LIQUID PHYSICS DEMO" "100,150,255" 1.5 2
    echo -e "\n"
    
    echo -e "    $(quantum_color "200" "200" "255")Low Viscosity (Water-like):\033[0m\n"
    liquid_effect 70 12 0.7
    
    echo -e "\n    $(quantum_color "200" "200" "255")Medium Viscosity (Oil-like):\033[0m\n"
    liquid_effect 70 12 0.85
    
    echo -e "\n    $(quantum_color "200" "200" "255")High Viscosity (Honey-like):\033[0m\n"
    liquid_effect 70 12 0.95
    
    # Wave patterns
    echo -e "\n"
    glow_text "    🌊 WAVE PATTERNS" "100,200,255" 1.5 2
    
    for pattern in {1..3}; do
        echo -e "\n    Pattern $pattern:\n"
        liquid_effect 70 10 0.8 &
        local liquid_pid=$!
        sleep 2
        kill $liquid_pid 2>/dev/null
    done
    
    echo -e "\n\n"
    visual_notify "info" "Water & Liquid demo complete!" 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_crystal_geo() {
    clear
    echo -ne "\033[?25l"
    
    # Crystal complexity variations
    echo -e "\n"
    glow_text "    💎 CRYSTAL FORMATIONS" "200,100,255" 1.5 2
    
    for complexity in 2 4 6 8; do
        echo -e "\n    Complexity $complexity:\n"
        crystal_effect 70 12 "$complexity" &
        local crystal_pid=$!
        sleep 2
        kill $crystal_pid 2>/dev/null
    done
    
    # Geometric patterns
    echo -e "\n"
    glow_text "    🔷 GEOMETRIC PATTERNS" "100,100,255" 1.5 2
    
    echo -e "\n    $(quantum_color "200" "200" "255")Grid Pattern:\033[0m\n"
    for ((y=0; y<10; y++)); do
        for ((x=0; x<70; x++)); do
            if [[ $(( (x + y) % 4 )) -eq 0 ]]; then
                echo -ne "$(quantum_color "100" "150" "255")#\033[0m"
            else
                echo -ne "$(quantum_color "50" "50" "100")·\033[0m"
            fi
        done
        echo ""
    done
    
    echo -e "\n\n"
    visual_notify "success" "Crystal & Geometry demo complete!" 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_starfield_space() {
    clear
    echo -ne "\033[?25l"
    
    # Starfield variations
    echo -e "\n"
    glow_text "    ✨ STARFIELD SIMULATIONS" "255,255,200" 1.5 2
    
    echo -e "\n    $(quantum_color "200" "200" "255")Sparse Starfield:\033[0m\n"
    starfield 70 12 30 0.5
    
    echo -e "\n    $(quantum_color "200" "200" "255")Dense Starfield:\033[0m\n"
    starfield 70 12 100 1.0
    
    echo -e "\n    $(quantum_color "200" "200" "255")Fast Travel:\033[0m\n"
    starfield 70 12 80 2.0
    
    # Nebula effect
    echo -e "\n"
    glow_text "    🌌 NEBULA SIMULATION" "200,100,255" 1.5 2
    echo -e "\n"
    
    for ((i=0; i<5; i++)); do
        crystal_effect 70 15 3 &
        local nebula_pid=$!
        sleep 1
        kill $nebula_pid 2>/dev/null
    done
    
    echo -e "\n\n"
    visual_notify "info" "Starfield & Space demo complete!" 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_components() {
    clear
    echo -ne "\033[?25l"
    
    # Progress bars showcase
    echo -e "\n\n"
    glow_text "    📊 ANIMATED PROGRESS BARS" "100,200,255" 1.5 2
    echo -e "\n"
    
    local styles=("rainbow" "fire" "water" "energy")
    for style in "${styles[@]}"; do
        echo -ne "    $(quantum_color "150" "200" "255")$style: \033[0m"
        for percent in {0..100..2}; do
            animated_progress_bar "$percent" "" 40 "$style"
            sleep 0.01
        done
        echo -e "\n"
    done
    
    # Gradient showcase
    echo -e "\n"
    glow_text "    🌈 GRADIENT EFFECTS" "255,100,255" 1.5 2
    echo -e "\n"
    
    gradient_box 70 5 "0,100,50" "360,100,50" 5 0 "horizontal"
    echo -e "\n"
    gradient_box 70 5 "180,100,50" "0,100,50" 5 8 "vertical"
    
    # Button showcase
    echo -e "\n\n"
    glow_text "    🎛️  INTERACTIVE BUTTONS" "255,200,100" 1.5 2
    echo -e "\n"
    
    for i in {1..3}; do
        pulsing_button " Button Variant $i " $((10 + i * 20)) 5 18 "true" "$i"
    done
    
    echo -e "\n\n\n"
    visual_notify "success" "Visual components demo complete!" 2
    read -k1 -s key 2>/dev/null || read -n1 key
    
    echo -ne "\033[?25h"
}

demo_dashboard() {
    clear
    
    # Create sample widgets
    demo_widget1() {
        local x="$1"
        local y="$2"
        local width="$3"
        local height="$4"
        
        visual_window "System Monitor" "$width" "$height" "glass" > /dev/null
        
        # Animated CPU graph
        echo -ne "\033[$((y + 2))B\033[$((x + 2))C"
        echo -ne "$(quantum_color "255" "255" "200")CPU Usage:\033[0m\n"
        
        for ((row=0; row<5; row++)); do
            echo -ne "\033[$((y + 3 + row))B\033[$((x + 2))C"
            local usage=$((10 + RANDOM % 30 + row * 5))
            for ((col=0; col<usage; col++)); do
                local pulse=$(echo "sin($(date +%s%N) * 0.000000001 * 10 + $col * 0.3) * 0.5 + 0.5" | bc -l)
                local r=$(echo "100 * $pulse" | bc -l | cut -d. -f1)
                local g=$(echo "200 * $pulse" | bc -l | cut -d. -f1)
                local b=255
                echo -ne "$(quantum_color "$r" "$g" "$b")█\033[0m"
            done
        done
    }
    
    demo_widget2() {
        local x="$1"
        local y="$2"
        local width="$3"
        local height="$4"
        
        visual_window "Network Traffic" "$width" "$height" "energy" > /dev/null
        
        echo -ne "\033[$((y + 2))B\033[$((x + 2))C"
        echo -ne "$(quantum_color "255" "200" "100")Live Traffic:\033[0m\n"
        
        for ((i=0; i<5; i++)); do
            echo -ne "\033[$((y + 3 + i))B\033[$((x + 2))C"
            animated_progress_bar "$((20 + i * 15 + RANDOM % 10))" "" "$((width - 4))" "energy"
        done
    }
    
    demo_widget3() {
        local x="$1"
        local y="$2"
        local width="$3"
        local height="$4"
        
        visual_window "Storage" "$width" "$height" "holographic" > /dev/null
        
        local disks=("System" "Home" "Backup" "Media")
        for ((i=0; i<${#disks[@]}; i++)); do
            local disk_y=$((y + 2 + i * 2))
            echo -ne "\033[${disk_y}B\033[$((x + 2))C"
            echo -ne "$(quantum_color "200" "200" "255")${disks[$i]}:\033[0m"
            
            local percent=$((30 + i * 15 + RANDOM % 20))
            echo -ne "\033[${disk_y}B\033[$((x + 10))C"
            animated_progress_bar "$percent" "" "$((width - 12))" "water"
        done
    }
    
    demo_widget4() {
        local x="$1"
        local y="$2"
        local width="$3"
        local height="$4"
        
        visual_window "Alerts" "$width" "$height" "neon" > /dev/null
        
        local alerts=(
            "info:System update available"
            "success:Backup completed"
            "warning:CPU temperature high"
            "error:Network latency detected"
        )
        
        for ((i=0; i<${#alerts[@]}; i++)); do
            IFS=':' read -r type message <<< "${alerts[$i]}"
            local alert_y=$((y + 2 + i))
            
            echo -ne "\033[${alert_y}B\033[$((x + 2))C"
            case "$type" in
                "info") echo -ne "$(quantum_color "100" "200" "255")ℹ️\033[0m" ;;
                "success") echo -ne "$(quantum_color "100" "255" "100")✅\033[0m" ;;
                "warning") echo -ne "$(quantum_color "255" "200" "100")⚠️\033[0m" ;;
                "error") echo -ne "$(quantum_color "255" "100" "100")❌\033[0m" ;;
            esac
            
            echo -ne " $(quantum_color "200" "200" "255")$message\033[0m"
        done
    }
    
    # Run dashboard
    visual_dashboard "QUANTUM DASHBOARD DEMO" \
        "demo_widget1" \
        "demo_widget2" \
        "demo_widget3" \
        "demo_widget4"
    
    echo -ne "\033[?25h"
}

# ==================== RUN DEMO ====================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]] || [[ -n "$ZSH_VERSION" ]]; then
    visual_demo_app
fi

return 0
