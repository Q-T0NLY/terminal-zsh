#!/usr/bin/env bash
# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║              NEXUSPRO HYPER REGISTRY - CORE REGISTRY ENGINE                  ║
# ║         Advanced Dynamic Universal Registry with GEFS Scoring                ║
# ╠═══════════════════════════════════════════════════════════════════════════════╣
# ║ Purpose: Central registry for all components with visual feedback            ║
# ║ Features: CRUD operations, versioning, dependencies, GEFS scoring            ║
# ║ Version: v1.0.0 | Created: 2025-12-16                                        ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

set -euo pipefail

# Source visual engine
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/visual_engine.sh"

# ═══════════════════════════════════════════════════════════════════════════════
# REGISTRY CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

REGISTRY_ROOT="${NEXUSPRO_REGISTRY_ROOT:-${HOME}/.nexuspro/registry}"
REGISTRY_DB="${REGISTRY_ROOT}/registry.db.json"
REGISTRY_INDEX="${REGISTRY_ROOT}/index.json"
REGISTRY_CACHE="${REGISTRY_ROOT}/cache"
REGISTRY_LOGS="${REGISTRY_ROOT}/logs/registry.log"

# Registry entity types
declare -a ENTITY_TYPES=(
    "plugin"
    "service"
    "component"
    "configuration"
    "theme"
    "layout"
    "extension"
    "module"
)

# GEFS Scoring weights
declare -A GEFS_WEIGHTS=(
    [quality]=0.25
    [performance]=0.20
    [security]=0.20
    [reliability]=0.15
    [maintainability]=0.10
    [documentation]=0.10
)

# ═══════════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

init_registry() {
    echo "🚀 Initializing NEXUSPRO Hyper Registry..."
    
    # Create directory structure
    mkdir -p "$REGISTRY_ROOT"/{data,cache,logs,backups}
    mkdir -p "${REGISTRY_ROOT}/entities"/{plugins,services,components,configurations,themes,layouts}
    
    # Initialize database if not exists
    if [[ ! -f "$REGISTRY_DB" ]]; then
        cat > "$REGISTRY_DB" <<EOF
{
  "version": "1.0.0",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "entities": {},
  "metadata": {
    "total_entities": 0,
    "entity_types": {},
    "last_updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
        echo "  ✓ Database initialized"
    fi
    
    # Initialize index
    if [[ ! -f "$REGISTRY_INDEX" ]]; then
        cat > "$REGISTRY_INDEX" <<EOF
{
  "namespaces": {},
  "tags": {},
  "dependencies": {},
  "versions": {}
}
EOF
        echo "  ✓ Index initialized"
    fi
    
    # Create log file
    touch "$REGISTRY_LOGS"
    
    # Show visual confirmation
    draw_box "REGISTRY INITIALIZED" 60 \
        "Database: ${REGISTRY_DB}" \
        "Index: ${REGISTRY_INDEX}" \
        "Status: $(status_badge 'success')" \
        ""
    
    log_event "INFO" "Registry initialized successfully"
}

# ═══════════════════════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════════════════════

log_event() {
    local level=$1
    local message=$2
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    echo "[${timestamp}] [${level}] ${message}" >> "$REGISTRY_LOGS"
}

# ═══════════════════════════════════════════════════════════════════════════════
# ENTITY REGISTRATION
# ═══════════════════════════════════════════════════════════════════════════════

register_entity() {
    local entity_type=$1
    local entity_name=$2
    local entity_data=$3  # JSON string
    
    # Validate entity type
    if [[ ! " ${ENTITY_TYPES[@]} " =~ " ${entity_type} " ]]; then
        echo -e "${COLORS[ACCENT_RED]}✖ Invalid entity type: ${entity_type}${COLORS[RESET]}"
        return 1
    fi
    
    # Show registration animation
    show_spinner "Registering ${entity_type}: ${entity_name}" 2
    
    # Generate entity ID
    local entity_id="${entity_type}_$(date +%s)_${RANDOM}"
    
    # Calculate GEFS score
    local gefs_score=$(calculate_gefs_score "$entity_data")
    
    # Create entity record
    local entity_record=$(cat <<EOF
{
  "id": "${entity_id}",
  "type": "${entity_type}",
  "name": "${entity_name}",
  "version": "1.0.0",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "gefs_score": ${gefs_score},
  "status": "active",
  "data": ${entity_data}
}
EOF
)
    
    # Save entity to file
    local entity_file="${REGISTRY_ROOT}/entities/${entity_type}s/${entity_id}.json"
    echo "$entity_record" > "$entity_file"
    
    # Update database
    update_database "$entity_id" "$entity_record"
    
    # Update index
    update_index "$entity_type" "$entity_id" "$entity_name"
    
    # Show success with visual effects
    particle_burst 10 40 15
    echo -e "${COLORS[NEURAL_GREEN]}✓${COLORS[RESET]} Registered: ${COLORS[ACCENT_GOLD]}${entity_name}${COLORS[RESET]} (ID: ${entity_id})"
    echo -e "  GEFS Score: $(render_gefs_badge $gefs_score)"
    
    log_event "INFO" "Registered ${entity_type}: ${entity_name} (${entity_id})"
    
    echo "$entity_id"
}

# ═══════════════════════════════════════════════════════════════════════════════
# GEFS SCORING SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

calculate_gefs_score() {
    local entity_data=$1
    
    # Extract metrics from entity data (simplified for demo)
    local quality=$(echo "$entity_data" | jq -r '.metrics.quality // 85')
    local performance=$(echo "$entity_data" | jq -r '.metrics.performance // 90')
    local security=$(echo "$entity_data" | jq -r '.metrics.security // 95')
    local reliability=$(echo "$entity_data" | jq -r '.metrics.reliability // 88')
    local maintainability=$(echo "$entity_data" | jq -r '.metrics.maintainability // 80')
    local documentation=$(echo "$entity_data" | jq -r '.metrics.documentation // 75')
    
    # Calculate weighted score
    local score=$(bc <<< "scale=2; \
        ($quality * ${GEFS_WEIGHTS[quality]}) + \
        ($performance * ${GEFS_WEIGHTS[performance]}) + \
        ($security * ${GEFS_WEIGHTS[security]}) + \
        ($reliability * ${GEFS_WEIGHTS[reliability]}) + \
        ($maintainability * ${GEFS_WEIGHTS[maintainability]}) + \
        ($documentation * ${GEFS_WEIGHTS[documentation]})")
    
    echo "$score"
}

render_gefs_badge() {
    local score=$1
    local badge=""
    
    if (( $(echo "$score >= 90" | bc -l) )); then
        badge="${COLORS[NEURAL_GREEN]}${COLORS[BOLD]}⭐ ${score}%${COLORS[RESET]} ${COLORS[DIM]}(Excellent)${COLORS[RESET]}"
    elif (( $(echo "$score >= 75" | bc -l) )); then
        badge="${COLORS[NEURAL_LIME]}${COLORS[BOLD]}✓ ${score}%${COLORS[RESET]} ${COLORS[DIM]}(Good)${COLORS[RESET]}"
    elif (( $(echo "$score >= 60" | bc -l) )); then
        badge="${COLORS[NEURAL_YELLOW]}${COLORS[BOLD]}◐ ${score}%${COLORS[RESET]} ${COLORS[DIM]}(Fair)${COLORS[RESET]}"
    else
        badge="${COLORS[ACCENT_RED]}${COLORS[BOLD]}✖ ${score}%${COLORS[RESET]} ${COLORS[DIM]}(Needs Improvement)${COLORS[RESET]}"
    fi
    
    echo -e "$badge"
}

# Display GEFS breakdown with sparklines
show_gefs_breakdown() {
    local entity_id=$1
    
    # Load entity data
    local entity_file=$(find "${REGISTRY_ROOT}/entities" -name "${entity_id}.json" 2>/dev/null | head -1)
    
    if [[ ! -f "$entity_file" ]]; then
        echo -e "${COLORS[ACCENT_RED]}✖ Entity not found${COLORS[RESET]}"
        return 1
    fi
    
    local entity_data=$(cat "$entity_file")
    
    # Extract metrics
    local quality=$(echo "$entity_data" | jq -r '.data.metrics.quality // 85')
    local performance=$(echo "$entity_data" | jq -r '.data.metrics.performance // 90')
    local security=$(echo "$entity_data" | jq -r '.data.metrics.security // 95')
    local reliability=$(echo "$entity_data" | jq -r '.data.metrics.reliability // 88')
    local maintainability=$(echo "$entity_data" | jq -r '.data.metrics.maintainability // 80')
    local documentation=$(echo "$entity_data" | jq -r '.data.metrics.documentation // 75')
    local gefs_score=$(echo "$entity_data" | jq -r '.gefs_score')
    
    echo
    draw_box "GEFS SCORING BREAKDOWN" 70 \
        "" \
        "Overall Score: $(render_gefs_badge $gefs_score)" \
        "" \
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
        ""
    
    echo "  Metric Breakdown:"
    echo
    show_progress_bar "$quality" 50 "Quality       (25%)"
    show_progress_bar "$performance" 50 "Performance   (20%)"
    show_progress_bar "$security" 50 "Security      (20%)"
    show_progress_bar "$reliability" 50 "Reliability   (15%)"
    show_progress_bar "$maintainability" 50 "Maintainability(10%)"
    show_progress_bar "$documentation" 50 "Documentation (10%)"
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

update_database() {
    local entity_id=$1
    local entity_record=$2
    
    # Use jq to update the database
    local tmp_db="${REGISTRY_DB}.tmp"
    
    jq --arg id "$entity_id" --argjson record "$entity_record" \
        '.entities[$id] = $record | .metadata.total_entities = (.entities | length) | .metadata.last_updated = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' \
        "$REGISTRY_DB" > "$tmp_db"
    
    mv "$tmp_db" "$REGISTRY_DB"
}

update_index() {
    local entity_type=$1
    local entity_id=$2
    local entity_name=$3
    
    local tmp_index="${REGISTRY_INDEX}.tmp"
    
    jq --arg type "$entity_type" --arg id "$entity_id" --arg name "$entity_name" \
        '.namespaces[$type] += [$id]' \
        "$REGISTRY_INDEX" > "$tmp_index"
    
    mv "$tmp_index" "$REGISTRY_INDEX"
}

# ═══════════════════════════════════════════════════════════════════════════════
# QUERY OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

list_entities() {
    local entity_type=${1:-"all"}
    local show_visual=${2:-true}
    
    if $show_visual; then
        draw_quantum_header "REGISTRY ENTITIES" "Listing all registered components" 70
    fi
    
    echo
    echo -e "${COLORS[ACCENT_GOLD]}${COLORS[BOLD]}Entity Type       Count   Avg GEFS Score${COLORS[RESET]}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for type in "${ENTITY_TYPES[@]}"; do
        local entity_dir="${REGISTRY_ROOT}/entities/${type}s"
        local count=0
        local total_score=0
        
        if [[ -d "$entity_dir" ]]; then
            count=$(find "$entity_dir" -name "*.json" 2>/dev/null | wc -l)
            
            if [[ $count -gt 0 ]]; then
                # Calculate average GEFS score
                for file in "$entity_dir"/*.json; do
                    local score=$(jq -r '.gefs_score' "$file" 2>/dev/null || echo "0")
                    total_score=$(bc <<< "$total_score + $score")
                done
                local avg_score=$(bc <<< "scale=2; $total_score / $count")
            else
                avg_score="N/A"
            fi
        fi
        
        printf "%-18s %-7s %s\n" \
            "$(colorize QUANTUM_CYAN "$type")" \
            "$count" \
            "$(render_gefs_badge ${avg_score})"
    done
    
    echo
}

search_registry() {
    local query=$1
    local entity_type=${2:-"all"}
    
    draw_quantum_header "SEARCH RESULTS" "Query: ${query}" 70
    
    echo
    echo "Searching registry..."
    show_spinner "Scanning entities..." 2
    
    local results=0
    
    for type in "${ENTITY_TYPES[@]}"; do
        if [[ "$entity_type" != "all" && "$entity_type" != "$type" ]]; then
            continue
        fi
        
        local entity_dir="${REGISTRY_ROOT}/entities/${type}s"
        
        if [[ -d "$entity_dir" ]]; then
            for file in "$entity_dir"/*.json; do
                [[ -f "$file" ]] || continue
                
                if grep -qi "$query" "$file"; then
                    local entity_name=$(jq -r '.name' "$file")
                    local entity_id=$(jq -r '.id' "$file")
                    local gefs_score=$(jq -r '.gefs_score' "$file")
                    
                    echo -e "  ${COLORS[NEURAL_GREEN]}✓${COLORS[RESET]} ${COLORS[ACCENT_GOLD]}${entity_name}${COLORS[RESET]} (${type})"
                    echo -e "    ID: ${entity_id}"
                    echo -e "    Score: $(render_gefs_badge $gefs_score)"
                    echo
                    
                    ((results++))
                fi
            done
        fi
    done
    
    if [[ $results -eq 0 ]]; then
        echo -e "${COLORS[NEURAL_YELLOW]}No results found for: ${query}${COLORS[RESET]}"
    else
        echo -e "${COLORS[NEURAL_GREEN]}Found ${results} result(s)${COLORS[RESET]}"
    fi
    
    echo
}

# ═══════════════════════════════════════════════════════════════════════════════
# VISUAL DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

show_dashboard() {
    clear_screen
    draw_quantum_header "NEXUSPRO HYPER REGISTRY" "Advanced Dynamic Universal Registry" 80
    
    # Calculate statistics
    local total_entities=$(jq -r '.metadata.total_entities' "$REGISTRY_DB" 2>/dev/null || echo "0")
    local last_updated=$(jq -r '.metadata.last_updated' "$REGISTRY_DB" 2>/dev/null || echo "N/A")
    
    # Show statistics box
    draw_box "SYSTEM STATISTICS" 70 \
        "Total Entities: ${COLORS[ACCENT_GOLD]}${total_entities}${COLORS[RESET]}" \
        "Last Updated: ${last_updated}" \
        "Status: $(status_badge 'active')" \
        ""
    
    echo
    
    # Show entity breakdown
    list_entities "all" false
    
    # Show GEFS distribution (sparkline visualization)
    echo
    draw_box "GEFS SCORE DISTRIBUTION" 70 \
        "Visual representation of quality across all entities" \
        ""
    
    # Render sparkline for each entity type
    for type in "${ENTITY_TYPES[@]}"; do
        local entity_dir="${REGISTRY_ROOT}/entities/${type}s"
        if [[ -d "$entity_dir" ]] && [[ -n "$(ls -A "$entity_dir" 2>/dev/null)" ]]; then
            local scores=()
            for file in "$entity_dir"/*.json; do
                [[ -f "$file" ]] || continue
                local score=$(jq -r '.gefs_score' "$file" 2>/dev/null || echo "0")
                scores+=("$score")
            done
            
            if [[ ${#scores[@]} -gt 0 ]]; then
                render_sparkline "$type" "${scores[@]}"
            fi
        fi
    done
    
    echo
}

# Render ASCII sparkline
render_sparkline() {
    local label=$1
    shift
    local values=("$@")
    
    if [[ ${#values[@]} -eq 0 ]]; then
        return
    fi
    
    # Find min/max
    local min=100
    local max=0
    for val in "${values[@]}"; do
        if (( $(echo "$val < $min" | bc -l) )); then min=$val; fi
        if (( $(echo "$val > $max" | bc -l) )); then max=$val; fi
    done
    
    # Normalize and render
    local range=$(bc <<< "$max - $min")
    if (( $(echo "$range == 0" | bc -l) )); then range=1; fi
    
    local sparkline=""
    local chars=("▁" "▂" "▃" "▄" "▅" "▆" "▇" "█")
    
    for val in "${values[@]}"; do
        local normalized=$(bc <<< "scale=0; ($val - $min) * 7 / $range")
        local char_idx=$(printf "%.0f" "$normalized")
        sparkline+="${chars[$char_idx]}"
    done
    
    printf "  %-15s ${COLORS[NEURAL_LIME]}%s${COLORS[RESET]} (min:%.1f max:%.1f)\n" "$label" "$sparkline" "$min" "$max"
}

# ═══════════════════════════════════════════════════════════════════════════════
# CLI INTERFACE
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    local command=${1:-"help"}
    
    case $command in
        init)
            init_registry
            ;;
        register)
            if [[ $# -lt 3 ]]; then
                echo "Usage: $0 register <type> <name> <json_data>"
                exit 1
            fi
            register_entity "$2" "$3" "$4"
            ;;
        list)
            list_entities "${2:-all}"
            ;;
        search)
            if [[ $# -lt 2 ]]; then
                echo "Usage: $0 search <query> [type]"
                exit 1
            fi
            search_registry "$2" "${3:-all}"
            ;;
        gefs)
            if [[ $# -lt 2 ]]; then
                echo "Usage: $0 gefs <entity_id>"
                exit 1
            fi
            show_gefs_breakdown "$2"
            ;;
        dashboard)
            show_dashboard
            ;;
        help|*)
            draw_quantum_header "NEXUSPRO HYPER REGISTRY" "Command-Line Interface" 70
            echo
            echo "Available Commands:"
            echo
            echo "  $(colorize ACCENT_GOLD 'init')           Initialize the registry"
            echo "  $(colorize ACCENT_GOLD 'register')      Register a new entity"
            echo "  $(colorize ACCENT_GOLD 'list')          List all entities"
            echo "  $(colorize ACCENT_GOLD 'search')        Search the registry"
            echo "  $(colorize ACCENT_GOLD 'gefs')          Show GEFS score breakdown"
            echo "  $(colorize ACCENT_GOLD 'dashboard')     Display visual dashboard"
            echo "  $(colorize ACCENT_GOLD 'help')          Show this help message"
            echo
            ;;
    esac
}

# Run main if script executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
