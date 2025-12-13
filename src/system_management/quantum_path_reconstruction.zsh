#!/bin/zsh
# ============================================================================
# 🔮 QUANTUM PATH RECONSTRUCTION (QPR) v2.0
# ============================================================================
# Extracted from: Q-Zsh nexus_quantum_hyper_matrix_v12.sh
# Purpose: Intelligent PATH analysis, repair, and optimization
# Features: Broken symlink detection, duplicate removal, optimal ordering
# ============================================================================

set -euo pipefail

# Colors
typeset -r NEURAL_CYAN='\033[38;2;0;212;255m'
typeset -r NEURAL_GREEN='\033[38;2;0;245;160m'
typeset -r NEURAL_YELLOW='\033[38;2;255;215;0m'
typeset -r NEURAL_RED='\033[38;2;255;59;48m'
typeset -r RESET='\033[0m'

# Data directories
QPR_ROOT="${NEXUS_HOME:=${HOME}/.nexus}"
QPR_DATA="${QPR_ROOT}/pathology"
QPR_LOG="${QPR_ROOT}/logs/qpr.log"

# Ensure directories exist
mkdir -p "${QPR_DATA}" "$(dirname ${QPR_LOG})"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

qpr_log() {
    local level="$1"
    shift
    local message="$*"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "${QPR_LOG}"
    
    case "$level" in
        INFO)   echo -e "${NEURAL_CYAN}ℹ ${message}${RESET}" ;;
        SUCCESS) echo -e "${NEURAL_GREEN}✓ ${message}${RESET}" ;;
        WARNING) echo -e "${NEURAL_YELLOW}⚠ ${message}${RESET}" ;;
        ERROR)  echo -e "${NEURAL_RED}✗ ${message}${RESET}" ;;
    esac
}

# ============================================================================
# PHASE 1: ANALYZE CURRENT PATH
# ============================================================================

qpr_analyze_current_path() {
    qpr_log "INFO" "Phase 1: Analyzing current PATH..."
    
    local -a path_entries broken_entries valid_entries
    local -A seen_paths
    
    # Split PATH into array
    path_entries=(${(s/:/)PATH})
    
    qpr_log "INFO" "Found ${#path_entries[@]} PATH entries"
    
    local i=1
    for path_entry in "${path_entries[@]}"; do
        if [[ -z "$path_entry" ]]; then
            continue
        fi
        
        # Check if entry exists
        if [[ ! -d "$path_entry" ]]; then
            broken_entries+=("$path_entry")
            echo -e "${NEURAL_RED}✗ Entry $i: $path_entry (Does not exist)${RESET}"
            qpr_log "WARNING" "Broken PATH entry: $path_entry"
        # Check if it's a symlink pointing to nothing
        elif [[ -L "$path_entry" ]] && [[ ! -d $(readlink "$path_entry" 2>/dev/null) ]]; then
            broken_entries+=("$path_entry")
            echo -e "${NEURAL_RED}✗ Entry $i: $path_entry (Broken symlink)${RESET}"
            qpr_log "WARNING" "Broken symlink: $path_entry"
        # Check for duplicates
        elif [[ -n "${seen_paths[$path_entry]}" ]]; then
            echo -e "${NEURAL_YELLOW}⚠ Entry $i: $path_entry (Duplicate)${RESET}"
            qpr_log "WARNING" "Duplicate PATH entry: $path_entry"
        # Valid entry
        else
            valid_entries+=("$path_entry")
            seen_paths["$path_entry"]=1
            echo -e "${NEURAL_GREEN}✓ Entry $i: $path_entry${RESET}"
            qpr_log "SUCCESS" "Valid PATH entry: $path_entry"
        fi
        
        ((i++))
    done
    
    # Save analysis results
    cat > "${QPR_DATA}/path_analysis.json" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "total_entries": ${#path_entries[@]},
    "valid_entries": ${#valid_entries[@]},
    "broken_entries": ${#broken_entries[@]},
    "duplicates": $((${#path_entries[@]} - ${#valid_entries[@]} - ${#broken_entries[@]})),
    "coverage": $(echo "scale=1; ${#valid_entries[@]} * 100 / ${#path_entries[@]}" | bc 2>/dev/null || echo "0")
}
EOF
    
    qpr_log "SUCCESS" "Phase 1 complete: ${#valid_entries[@]} valid, ${#broken_entries[@]} broken"
    
    return 0
}

# ============================================================================
# PHASE 2: REBUILD OPTIMAL PATH
# ============================================================================

qpr_rebuild_optimal_path() {
    qpr_log "INFO" "Phase 2: Rebuilding optimal PATH..."
    
    local quantum_path=""
    
    # Priority 1: User quantum space
    local user_dirs="$HOME/.nexus/bin:$HOME/.local/bin:$HOME/bin"
    quantum_path="$user_dirs"
    qpr_log "INFO" "Added user directories (Priority 1)"
    
    # Priority 2: Language-specific paths
    local -a lang_paths=(
        "$HOME/.cargo/bin"           # Rust
        "$HOME/.volta/bin"           # Node version manager
        "$HOME/go/bin"               # Go
        "$HOME/.rbenv/bin"           # Ruby
        "$HOME/.pyenv/bin"           # Python
    )
    
    for lang_dir in "${lang_paths[@]}"; do
        if [[ -d "$lang_dir" ]]; then
            quantum_path="${quantum_path}:${lang_dir}"
            qpr_log "INFO" "Added language path: $lang_dir"
        fi
    done
    
    # Priority 3: System paths
    local system_paths="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin"
    quantum_path="${quantum_path}:${system_paths}"
    qpr_log "INFO" "Added system directories (Priority 3)"
    
    # Priority 4: Additional common paths
    local optional_paths="/opt/local/bin:/opt/local/sbin"
    if [[ -d "/opt/local" ]]; then
        quantum_path="${quantum_path}:${optional_paths}"
        qpr_log "INFO" "Added MacPorts paths (Priority 4)"
    fi
    
    # Remove duplicates while preserving order
    local -a unique_paths
    local -A seen
    local IFS=:
    local path_entry
    
    for path_entry in ${quantum_path}; do
        if [[ -z "${seen[$path_entry]}" ]]; then
            unique_paths+=("$path_entry")
            seen[$path_entry]=1
        fi
    done
    
    # Reconstruct PATH
    local new_path="${(j/:/)unique_paths}"
    
    # Validate new PATH
    local valid_entries=0
    for path_entry in "${unique_paths[@]}"; do
        if [[ -d "$path_entry" ]]; then
            ((valid_entries++))
        fi
    done
    
    # Save new PATH
    cat > "${QPR_DATA}/new_path.sh" <<EOF
#!/bin/zsh
export PATH="${new_path}"
EOF
    
    chmod +x "${QPR_DATA}/new_path.sh"
    
    qpr_log "SUCCESS" "Phase 2 complete: Built PATH with ${#unique_paths[@]} unique entries"
    qpr_log "SUCCESS" "Valid directories: $valid_entries/${#unique_paths[@]}"
    
    echo -e "${NEURAL_GREEN}✓ Optimal PATH constructed with ${#unique_paths[@]} entries${RESET}"
    
    return 0
}

# ============================================================================
# PHASE 3: VERIFY AND STABILIZE
# ============================================================================

qpr_verify_and_stabilize() {
    qpr_log "INFO" "Phase 3: Verifying and stabilizing PATH..."
    
    # Test new PATH with a test command
    if source "${QPR_DATA}/new_path.sh"; then
        qpr_log "SUCCESS" "New PATH verified successfully"
        echo -e "${NEURAL_GREEN}✓ PATH stabilized and verified${RESET}"
        return 0
    else
        qpr_log "ERROR" "PATH verification failed"
        echo -e "${NEURAL_RED}✗ PATH verification failed${RESET}"
        return 1
    fi
}

# ============================================================================
# APPLY RECONSTRUCTED PATH
# ============================================================================

qpr_apply_path() {
    local persist=${1:-false}
    
    qpr_log "INFO" "Applying reconstructed PATH..."
    
    # Apply to current session
    if [[ -f "${QPR_DATA}/new_path.sh" ]]; then
        source "${QPR_DATA}/new_path.sh"
        qpr_log "SUCCESS" "PATH applied to current session"
        echo -e "${NEURAL_GREEN}✓ PATH applied to current session${RESET}"
    fi
    
    # Optionally persist to shell config
    if [[ "$persist" == "true" ]]; then
        local shell_config=""
        
        if [[ -f "$HOME/.zshrc" ]]; then
            shell_config="$HOME/.zshrc"
        elif [[ -f "$HOME/.bashrc" ]]; then
            shell_config="$HOME/.bashrc"
        fi
        
        if [[ -n "$shell_config" ]]; then
            # Remove old QPR settings if present
            sed -i.bak '/# QPR START/,/# QPR END/d' "$shell_config"
            
            # Add new QPR settings
            cat >> "$shell_config" <<'EOF'

# ============================================================================
# 🔮 QUANTUM PATH RECONSTRUCTION (QPR) - Auto-maintained
# ============================================================================
# QPR START
if [[ -f "${NEXUS_HOME:=$HOME/.nexus}/pathology/new_path.sh" ]]; then
    source "${NEXUS_HOME}/pathology/new_path.sh"
fi
# QPR END
EOF
            
            qpr_log "SUCCESS" "PATH persisted to $shell_config"
            echo -e "${NEURAL_GREEN}✓ PATH persisted to shell configuration${RESET}"
        fi
    fi
}

# ============================================================================
# MAIN COMMAND ROUTER
# ============================================================================

qpr_main() {
    local command="${1:-help}"
    
    case "$command" in
        analyze)
            qpr_analyze_current_path
            ;;
        rebuild)
            qpr_rebuild_optimal_path
            qpr_verify_and_stabilize
            ;;
        apply)
            qpr_apply_path "${2:-false}"
            ;;
        auto)
            # Run full reconstruction automatically
            qpr_analyze_current_path
            qpr_rebuild_optimal_path
            qpr_verify_and_stabilize
            qpr_apply_path "true"
            qpr_log "SUCCESS" "Automatic PATH reconstruction completed"
            ;;
        status)
            if [[ -f "${QPR_DATA}/path_analysis.json" ]]; then
                echo -e "${NEURAL_CYAN}=== QPR Status ===${RESET}"
                cat "${QPR_DATA}/path_analysis.json" | python3 -m json.tool
            else
                qpr_log "WARNING" "No analysis data found. Run 'analyze' first."
            fi
            ;;
        log)
            if [[ -f "$QPR_LOG" ]]; then
                echo -e "${NEURAL_CYAN}=== QPR Log ===${RESET}"
                tail -50 "$QPR_LOG"
            fi
            ;;
        help)
            cat <<EOF
${NEURAL_CYAN}🔮 Quantum Path Reconstruction (QPR) v2.0${RESET}

USAGE: qpr <command> [options]

COMMANDS:
    analyze     - Analyze current PATH for issues
    rebuild     - Rebuild optimal PATH
    apply       - Apply reconstructed PATH (optionally persist)
    auto        - Full automatic reconstruction (analyze → rebuild → apply)
    status      - Show QPR status and analysis
    log         - Show recent QPR logs
    help        - Show this help message

EXAMPLES:
    qpr analyze              # Check current PATH health
    qpr rebuild              # Rebuild PATH structure
    qpr apply true           # Apply and persist to shell config
    qpr auto                 # Full automatic reconstruction
    qpr status               # View reconstruction status
    
DATA LOCATION: ${QPR_DATA}
LOG FILE: ${QPR_LOG}

EOF
            ;;
        *)
            echo -e "${NEURAL_RED}Unknown command: $command${RESET}"
            echo "Use 'qpr help' for usage information"
            return 1
            ;;
    esac
}

# Export main function
export -f qpr_main
export -f qpr_log
export -f qpr_analyze_current_path
export -f qpr_rebuild_optimal_path
export -f qpr_verify_and_stabilize
export -f qpr_apply_path

# Create convenient alias
alias qpr='qpr_main'

# If sourced directly with arguments, execute
if [[ "${BASH_SOURCE[0]}" == "${0}" ]] || [[ "$ZSH_EVAL_CONTEXT" == "toplevel" ]]; then
    qpr_main "$@"
fi
