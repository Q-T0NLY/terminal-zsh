#!/usr/bin/env zsh
# ⚡ ANIMATIONS SUB-REGISTRY
# Dynamic animation and transition components for Quantum Downloader
# ════════════════════════════════════════════════════════════════════════

typeset -gA ANIMATION_COMPONENTS
typeset -gA ANIMATION_SCORES
typeset -gA ANIMATION_METADATA

# ════════════════════════════════════════════════════════════════════════
# 🎬 ANIMATION COMPONENT REGISTRATION
# ════════════════════════════════════════════════════════════════════════

register_animation() {
    local id="$1"
    local name="$2"
    local category="$3"        # spinner, wave, particle, transition, pulse, glitch, etc.
    local duration="$4"         # in seconds or "loop"
    local performance="$5"      # realtime, smooth, standard, batch
    local use_case="$6"
    local function_ref="$7"
    
    ANIMATION_COMPONENTS[$id]=$(cat <<-EOF
{
  "name": "$name",
  "category": "$category",
  "duration": "$duration",
  "performance": "$performance",
  "use_case": "$use_case",
  "function": "$function_ref",
  "registered": "$(date -Iseconds)"
}
EOF
)
}

# ════════════════════════════════════════════════════════════════════════
# 🎨 ANIMATION DATABASE
# ════════════════════════════════════════════════════════════════════════

load_animation_database() {
    
    # ────────────────────────────────────────────────────────────────────
    # SPINNERS & ROTATING ELEMENTS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_quantum_spinner" \
        "Quantum Spinner v3" \
        "spinner" \
        "loop" \
        "smooth" \
        "Loading states, processing, waiting for operations" \
        "quantum_spinner"
    
    register_animation \
        "anim_braille_spinner" \
        "Braille Dot Spinner" \
        "spinner" \
        "loop" \
        "realtime" \
        "Smooth ASCII loading, elegant progress indication" \
        "braille_spinner"
    
    register_animation \
        "anim_block_spinner" \
        "Block Rotation Spinner" \
        "spinner" \
        "loop" \
        "smooth" \
        "Linear loading animation, data processing" \
        "block_spinner"
    
    register_animation \
        "anim_directional_spinner" \
        "Directional Arrow Spinner" \
        "spinner" \
        "loop" \
        "smooth" \
        "Rotating arrows, directional flow visualization" \
        "directional_spinner"
    
    register_animation \
        "anim_rainbow_spinner" \
        "Rainbow Gradient Spinner" \
        "spinner" \
        "loop" \
        "smooth" \
        "Colorful loading with rainbow effects" \
        "rainbow_spinner"
    
    # ────────────────────────────────────────────────────────────────────
    # WAVE & FLOW ANIMATIONS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_quantum_wave" \
        "Quantum Wave Pattern" \
        "wave" \
        "1-3" \
        "smooth" \
        "Initialization, section transitions, elegant dividers" \
        "quantum_wave"
    
    register_animation \
        "anim_data_stream" \
        "Data Stream Flow" \
        "wave" \
        "loop" \
        "smooth" \
        "Real-time data visualization, bandwidth representation" \
        "quantum_data_stream"
    
    register_animation \
        "anim_sine_wave" \
        "Sine Wave Oscillation" \
        "wave" \
        "loop" \
        "realtime" \
        "Smooth undulating motion, rhythmic effects" \
        "sine_wave_animation"
    
    register_animation \
        "anim_ripple_effect" \
        "Ripple Wave Effect" \
        "wave" \
        "0.5-1" \
        "smooth" \
        "Water-like ripples, impact effects, event notifications" \
        "ripple_animation"
    
    # ────────────────────────────────────────────────────────────────────
    # PARTICLE EFFECTS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_particle_burst" \
        "Particle Burst System" \
        "particle" \
        "0.5-2" \
        "smooth" \
        "Explosion effects, celebration, impact highlights" \
        "quantum_particles"
    
    register_animation \
        "anim_sparkle_burst" \
        "Sparkle Burst Celebration" \
        "particle" \
        "1-2" \
        "smooth" \
        "Success celebrations, achievement effects" \
        "quantum_sparkle_burst"
    
    register_animation \
        "anim_confetti" \
        "Confetti Particle System" \
        "particle" \
        "1-3" \
        "smooth" \
        "Victory celebrations, milestone achievements" \
        "confetti_animation"
    
    register_animation \
        "anim_snow_fall" \
        "Falling Snow Animation" \
        "particle" \
        "loop" \
        "smooth" \
        "Background effects, atmospheric visualization" \
        "snow_animation"
    
    register_animation \
        "anim_rain_effect" \
        "Rain Drop Effect" \
        "particle" \
        "loop" \
        "smooth" \
        "Cascading data, information flow" \
        "rain_animation"
    
    # ────────────────────────────────────────────────────────────────────
    # PULSING & BREATHING EFFECTS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_pulse_breath" \
        "Breathing Pulse Effect" \
        "pulse" \
        "loop" \
        "realtime" \
        "Continuous subtle animations, focus indicators" \
        "pulse_breathing"
    
    register_animation \
        "anim_glow_pulse" \
        "Glowing Pulse Animation" \
        "pulse" \
        "loop" \
        "smooth" \
        "Active indicators, attention-grabbers, status lights" \
        "glow_pulse"
    
    register_animation \
        "anim_blink_effect" \
        "Blinking Animation" \
        "pulse" \
        "loop" \
        "realtime" \
        "Quick attention signals, alerts, highlights" \
        "blink_animation"
    
    register_animation \
        "anim_heartbeat" \
        "Heartbeat Pulse" \
        "pulse" \
        "loop" \
        "realtime" \
        "System health indication, vital statistics" \
        "heartbeat_animation"
    
    # ────────────────────────────────────────────────────────────────────
    # TRANSITION EFFECTS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_fade_in" \
        "Fade In Transition" \
        "transition" \
        "0.3-0.5" \
        "realtime" \
        "Element appearance, smooth visibility changes" \
        "fade_in"
    
    register_animation \
        "anim_fade_out" \
        "Fade Out Transition" \
        "transition" \
        "0.3-0.5" \
        "realtime" \
        "Element disappearance, smooth cleanup" \
        "fade_out"
    
    register_animation \
        "anim_slide_in" \
        "Slide In Transition" \
        "transition" \
        "0.4-0.6" \
        "smooth" \
        "Panels entering, content sliding in from edges" \
        "slide_in"
    
    register_animation \
        "anim_scroll_reveal" \
        "Scroll Reveal Transition" \
        "transition" \
        "0.5-1" \
        "smooth" \
        "Content reveal, information unrolling" \
        "scroll_reveal"
    
    # ────────────────────────────────────────────────────────────────────
    # GLITCH & EFFECT ANIMATIONS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_glitch_effect" \
        "Cyberpunk Glitch Effect" \
        "glitch" \
        "0.2-0.5" \
        "smooth" \
        "Error states, dramatic effects, tension building" \
        "glitch_animation"
    
    register_animation \
        "anim_shimmer" \
        "Shimmer Glow Effect" \
        "glitch" \
        "loop" \
        "smooth" \
        "Magical effects, premium feel, highlighting" \
        "shimmer_animation"
    
    register_animation \
        "anim_static_burst" \
        "Static Burst Effect" \
        "glitch" \
        "0.1-0.3" \
        "standard" \
        "Shock effects, disruption animation" \
        "static_burst"
    
    # ────────────────────────────────────────────────────────────────────
    # PROGRESS ANIMATIONS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_progress_fill" \
        "Progress Bar Fill Animation" \
        "progress" \
        "loop" \
        "realtime" \
        "Download progress, task completion, file transfers" \
        "progress_fill"
    
    register_animation \
        "anim_progress_wave" \
        "Wave Progress Animation" \
        "progress" \
        "loop" \
        "smooth" \
        "Flowing progress visualization, liquid fill effect" \
        "progress_wave"
    
    register_animation \
        "anim_progress_3d" \
        "3D Rounded Progress" \
        "progress" \
        "loop" \
        "smooth" \
        "Modern 3D progress bars with depth effects" \
        "rounded_progress_3d"
    
    register_animation \
        "anim_progress_shimmer" \
        "Shimmer Progress Bar" \
        "progress" \
        "loop" \
        "smooth" \
        "Shimmering progress with moving highlight" \
        "shimmer_progress"
    
    # ────────────────────────────────────────────────────────────────────
    # CONNECTION & NETWORK ANIMATIONS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_connection_matrix" \
        "Connection Matrix Animation" \
        "network" \
        "loop" \
        "smooth" \
        "Network visualization, connection mapping, thread visualization" \
        "quantum_connection_matrix"
    
    register_animation \
        "anim_network_pulse" \
        "Network Pulse Animation" \
        "network" \
        "loop" \
        "smooth" \
        "Data packet flow, network activity" \
        "network_pulse"
    
    register_animation \
        "anim_signal_strength" \
        "Signal Strength Bars" \
        "network" \
        "loop" \
        "realtime" \
        "Connection quality display, signal visualization" \
        "quantum_signal_bars"
    
    # ────────────────────────────────────────────────────────────────────
    # NUMERIC & COUNTER ANIMATIONS
    # ────────────────────────────────────────────────────────────────────
    
    register_animation \
        "anim_number_counter" \
        "Number Counter Animation" \
        "counter" \
        "0.5-2" \
        "realtime" \
        "Statistics display, metric animations, progress numbers" \
        "number_counter"
    
    register_animation \
        "anim_flip_digit" \
        "Flip Digit Animation" \
        "counter" \
        "0.3-0.5" \
        "smooth" \
        "Scoreboard style numbers, timing display" \
        "flip_digit"
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 ANIMATION SCORING
# ════════════════════════════════════════════════════════════════════════

calculate_animation_score() {
    local comp_id="$1"
    local comp_data="${ANIMATION_COMPONENTS[$comp_id]}"
    
    local category=$(echo "$comp_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
    local performance=$(echo "$comp_data" | grep -o '"performance": "[^"]*"' | cut -d'"' -f4)
    local duration=$(echo "$comp_data" | grep -o '"duration": "[^"]*"' | cut -d'"' -f4)
    
    # Scoring dimensions for animations
    local smoothness=0
    local resource_efficiency=0
    local visual_quality=0
    local versatility=0
    
    # 1️⃣ SMOOTHNESS
    case "$performance" in
        realtime) smoothness=100 ;;
        smooth) smoothness=85 ;;
        standard) smoothness=65 ;;
        batch) smoothness=40 ;;
    esac
    
    # 2️⃣ RESOURCE EFFICIENCY
    case "$performance" in
        realtime) resource_efficiency=80 ;;
        smooth) resource_efficiency=75 ;;
        standard) resource_efficiency=60 ;;
        batch) resource_efficiency=50 ;;
    esac
    
    # 3️⃣ VISUAL QUALITY (by category)
    case "$category" in
        particle) visual_quality=95 ;;
        wave) visual_quality=85 ;;
        glitch) visual_quality=90 ;;
        spinner) visual_quality=70 ;;
        pulse) visual_quality=75 ;;
        progress) visual_quality=80 ;;
        transition) visual_quality=78 ;;
        network) visual_quality=85 ;;
        counter) visual_quality=70 ;;
    esac
    
    # 4️⃣ VERSATILITY
    case "$category" in
        spinner|pulse|network|progress) versatility=90 ;;
        particle|wave) versatility=85 ;;
        transition) versatility=80 ;;
        counter) versatility=75 ;;
        glitch) versatility=65 ;;
    esac
    
    # Final Animation Score
    local score=$(( 
        (smoothness * 30 + 
         resource_efficiency * 20 + 
         visual_quality * 30 + 
         versatility * 20) / 100
    ))
    
    ANIMATION_SCORES[$comp_id]="$(cat <<-EOF
{
  "animation_score": $score,
  "smoothness": $smoothness,
  "efficiency": $resource_efficiency,
  "visual_quality": $visual_quality,
  "versatility": $versatility,
  "rank": "$(get_animation_rank $score)"
}
EOF
)"
    
    return $score
}

get_animation_rank() {
    local score=$1
    if (( score >= 85 )); then
        echo "Premium Animation"
    elif (( score >= 75 )); then
        echo "High-Quality"
    elif (( score >= 65 )); then
        echo "Standard"
    else
        echo "Basic"
    fi
}

# ════════════════════════════════════════════════════════════════════════
# 🔍 ANIMATION QUERIES
# ════════════════════════════════════════════════════════════════════════

get_animations_by_category() {
    local category="$1"
    local results=()
    
    for comp_id in ${(k)ANIMATION_COMPONENTS}; do
        local comp_data="${ANIMATION_COMPONENTS[$comp_id]}"
        local comp_cat=$(echo "$comp_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_cat" == "$category" ]]; then
            results+=("$comp_id")
        fi
    done
    
    echo "${results[@]}"
}

get_animations_by_performance() {
    local performance="$1"
    local results=()
    
    for comp_id in ${(k)ANIMATION_COMPONENTS}; do
        local comp_data="${ANIMATION_COMPONENTS[$comp_id]}"
        local comp_perf=$(echo "$comp_data" | grep -o '"performance": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_perf" == "$performance" ]]; then
            results+=("$comp_id")
        fi
    done
    
    echo "${results[@]}"
}

list_animations_by_category() {
    local category="$1"
    
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║           ⚡ $category ANIMATIONS (${#ANIMATION_COMPONENTS}+ total)              ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    local count=0
    for comp_id in ${(k)ANIMATION_COMPONENTS}; do
        local comp_data="${ANIMATION_COMPONENTS[$comp_id]}"
        local comp_cat=$(echo "$comp_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
        
        if [[ "$comp_cat" == "$category" ]]; then
            local name=$(echo "$comp_data" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
            local perf=$(echo "$comp_data" | grep -o '"performance": "[^"]*"' | cut -d'"' -f4)
            local score_data="${ANIMATION_SCORES[$comp_id]}"
            local score=$(echo "$score_data" | grep -o '"animation_score": [0-9]*' | grep -o '[0-9]*' 2>/dev/null || echo "N/A")
            
            printf "  %-35s [%-8s] Score: %s\n" "$name" "$perf" "$score"
            ((count++))
        fi
    done
    
    echo ""
    echo "  Total $category animations: $count"
    echo ""
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 INITIALIZATION
# ════════════════════════════════════════════════════════════════════════

load_animation_database

# Calculate scores
for comp_id in ${(k)ANIMATION_COMPONENTS}; do
    calculate_animation_score "$comp_id" >/dev/null
done

echo "✅ Animations Sub-Registry loaded with ${#ANIMATION_COMPONENTS} components" >&2
return 0
