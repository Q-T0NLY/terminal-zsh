#!/usr/bin/env zsh
# ============================================================================
# NEXUS AI STUDIO - Clean Slate System Manager
# Version: 9.0
# Description: Advanced detection, discovery, cleanup, and reinstallation system
# ============================================================================

# Prevent multiple sourcing
[[ -n "${CLEAN_SLATE_LOADED}" ]] && return 0
export CLEAN_SLATE_LOADED=1

# ============================================================================
# CONFIGURATION
# ============================================================================

CLEAN_SLATE_VERSION="9.0"
CLEAN_SLATE_ROOT="${0:A:h}"
CLEAN_SLATE_DATA="${HOME}/.nexus/clean_slate"
CLEAN_SLATE_LOGS="${CLEAN_SLATE_DATA}/logs"
CLEAN_SLATE_BACKUP="${CLEAN_SLATE_DATA}/backups"
CLEAN_SLATE_MANIFEST="${CLEAN_SLATE_DATA}/manifest.json"

# Create necessary directories
mkdir -p "${CLEAN_SLATE_DATA}" "${CLEAN_SLATE_LOGS}" "${CLEAN_SLATE_BACKUP}"

# ============================================================================
# LOGGING
# ============================================================================

clean_slate_log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_file="${CLEAN_SLATE_LOGS}/clean_slate_$(date +%Y%m%d).log"
    
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${log_file}"
}

# ============================================================================
# MODULE LOADING
# ============================================================================

# Load detection engine
if [[ -f "${CLEAN_SLATE_ROOT}/detection_engine.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/detection_engine.zsh"
    clean_slate_log "INFO" "Loaded detection engine"
fi

# Load config propagator
if [[ -f "${CLEAN_SLATE_ROOT}/config_propagator.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/config_propagator.zsh"
    clean_slate_log "INFO" "Loaded config propagator"
fi

# Load cleanup engine
if [[ -f "${CLEAN_SLATE_ROOT}/cleanup_engine.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/cleanup_engine.zsh"
    clean_slate_log "INFO" "Loaded cleanup engine"
fi

# ============================================================================
# MAIN CLEAN SLATE OPERATIONS
# ============================================================================

clean_slate_run_detection() {
    clean_slate_log "INFO" "Starting system-wide detection and discovery"
    
    # Call detection engine (stub - ready for your detailed code)
    if typeset -f nexus_detect_system &>/dev/null; then
        nexus_detect_system
    else
        clean_slate_log "WARN" "Detection engine not yet implemented"
    fi
}

clean_slate_propagate_config() {
    clean_slate_log "INFO" "Auto-propagating discovered items to configs"
    
    # Call config propagator (stub - ready for your detailed code)
    if typeset -f nexus_propagate_config &>/dev/null; then
        nexus_propagate_config
    else
        clean_slate_log "WARN" "Config propagator not yet implemented"
    fi
}

clean_slate_cleanup() {
    clean_slate_log "INFO" "Running cleanup and core file management"
    
    # Call cleanup engine (stub - ready for your detailed code)
    if typeset -f nexus_cleanup_system &>/dev/null; then
        nexus_cleanup_system
    else
        clean_slate_log "WARN" "Cleanup engine not yet implemented"
    fi
}

clean_slate_full_scan() {
    clean_slate_log "INFO" "========== CLEAN SLATE FULL SCAN =========="
    
    # Phase 1: Detection
    clean_slate_run_detection
    
    # Phase 2: Propagation
    clean_slate_propagate_config
    
    # Phase 3: Cleanup (optional)
    read "cleanup?Run cleanup? (y/N): "
    if [[ "${cleanup}" =~ ^[Yy]$ ]]; then
        clean_slate_cleanup
    fi
    
    clean_slate_log "INFO" "========== CLEAN SLATE COMPLETE =========="
}

# ============================================================================
# CLI INTERFACE
# ============================================================================

clean_slate_help() {
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════════╗
║             NEXUS AI STUDIO - Clean Slate v9.0                     ║
║         Advanced System Detection & Management System              ║
╚════════════════════════════════════════════════════════════════════╝

USAGE:
  clean_slate <command> [options]

COMMANDS:
  detect      Run system-wide detection and discovery
  propagate   Auto-propagate discovered items to configs
  cleanup     Run cleanup and core file management
  scan        Run full scan (detect + propagate + optional cleanup)
  help        Show this help message

EXAMPLES:
  clean_slate detect           # Scan system for paths/tools/apps
  clean_slate propagate        # Update configs with discoveries
  clean_slate scan             # Full Clean Slate operation

DATA LOCATION:
  ~/.nexus/clean_slate/

LOGS:
  ~/.nexus/clean_slate/logs/

Ready for detailed advanced code implementation.
EOF
}

clean_slate_main() {
    case "${1}" in
        detect)
            clean_slate_run_detection
            ;;
        propagate)
            clean_slate_propagate_config
            ;;
        cleanup)
            clean_slate_cleanup
            ;;
        scan)
            clean_slate_full_scan
            ;;
        help|--help|-h|"")
            clean_slate_help
            ;;
        *)
            echo "Unknown command: ${1}"
            echo "Run 'clean_slate help' for usage information"
            return 1
            ;;
    esac
}

# Create convenient alias
alias clean_slate='clean_slate_main'

clean_slate_log "INFO" "Clean Slate v${CLEAN_SLATE_VERSION} initialized"
