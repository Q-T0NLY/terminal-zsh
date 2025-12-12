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

# Load Aeternum Download Guardian
if [[ -f "${CLEAN_SLATE_ROOT}/aeternum_guardian.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/aeternum_guardian.zsh"
    clean_slate_log "INFO" "Loaded Aeternum Download Guardian"
fi

# Load Installation Guardian
if [[ -f "${CLEAN_SLATE_ROOT}/installation_guardian.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/installation_guardian.zsh"
    clean_slate_log "INFO" "Loaded Installation Guardian"
fi

# Load Package Manager Integration
if [[ -f "${CLEAN_SLATE_ROOT}/pkg_manager_integration.zsh" ]]; then
    source "${CLEAN_SLATE_ROOT}/pkg_manager_integration.zsh"
    clean_slate_log "INFO" "Loaded Package Manager Integration"
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
  daemon      Start Aeternum monitoring daemon
  status      Show protection status and recent activity
  help        Show this help message

INTEGRATED PROTECTION SYSTEMS:
  ✓ Aeternum Download Guardian (7-layer verification)
  ✓ Installation Guardian (9-phase protection)
  ✓ Package Manager Integration (brew, pip, npm, cargo, gem)
  ✓ Process Monitoring & Auto-Recovery

EXAMPLES:
  clean_slate detect           # Scan system for paths/tools/apps
  clean_slate propagate        # Update configs with discoveries
  clean_slate scan             # Full Clean Slate operation
  clean_slate daemon           # Start background monitoring
  clean_slate status           # Check protection status

ALSO AVAILABLE:
  aeternum <command>          - Download protection commands
  install-guardian <command>  - Installation protection commands

DATA LOCATION:
  ~/.nexus/clean_slate/        - Detection data and configs
  ~/.aeternum/                 - Download protection vault
  ~/.install_guardian/         - Installation checkpoints

LOGS:
  ~/.nexus/clean_slate/logs/
  ~/.aeternum/logs/
  ~/.install_guardian/logs/

Ready for detailed advanced code implementation.
EOF
}

clean_slate_main() {
    local command="${1:-help}"
    shift
    
    case "$command" in
        detect)
            clean_slate_run_detection
            ;;
        propagate)
            clean_slate_propagate_config
            ;;
        cleanup)
            clean_slate_cleanup "$@"
            ;;
        scan)
            clean_slate_full_scan
            ;;
        daemon)
            if command -v start_monitoring_daemon &>/dev/null; then
                start_monitoring_daemon
            else
                echo "Aeternum Guardian not loaded"
            fi
            ;;
        status)
            clean_slate_status
            ;;
        help|--help|-h|"")
            clean_slate_help
            ;;
        *)
            echo "Unknown command: ${command}"
            echo "Run 'clean_slate help' for usage information"
            return 1
            ;;
    esac
}

clean_slate_status() {
    echo ""
    echo "=== Clean Slate Protection Status ==="
    echo ""
    
    # Aeternum status
    if [[ -f "${AETERNUM_DAEMON_PID:-}" ]]; then
        local pid=$(cat "${AETERNUM_DAEMON_PID}")
        if kill -0 "$pid" 2>/dev/null; then
            echo "✓ Aeternum Daemon: Running (PID: $pid)"
        else
            echo "⚠ Aeternum Daemon: Stopped (stale PID file)"
        fi
    else
        echo "ℹ Aeternum Daemon: Not running"
    fi
    
    # Protection status
    echo ""
    echo "Package Manager Protection:"
    echo "  Homebrew: ${AETERNUM_PROTECT_BREW:-false}"
    echo "  pip/pip3: ${AETERNUM_PROTECT_PIP:-false}"
    echo "  npm:      ${AETERNUM_PROTECT_NPM:-false}"
    echo "  cargo:    ${AETERNUM_PROTECT_CARGO:-false}"
    echo "  gem:      ${AETERNUM_PROTECT_GEM:-false}"
    
    # Storage info
    echo ""
    echo "Storage Locations:"
    echo "  Aeternum:     ${AETERNUM_ROOT:-Not loaded}"
    echo "  Install Guard: ${INSTALL_GUARDIAN_ROOT:-Not loaded}"
    echo "  Clean Slate:  ${CLEAN_SLATE_DATA}"
    
    # Recent activity
    echo ""
    if [[ -f "${AETERNUM_JOURNAL:-}" ]]; then
        local count=$(wc -l < "${AETERNUM_JOURNAL}" 2>/dev/null || echo 0)
        echo "Recent Activity:"
        echo "  Total operations: $count"
        if [[ $count -gt 0 ]]; then
            echo "  Last 3 operations:"
            tail -3 "${AETERNUM_JOURNAL}" | while IFS= read -r line; do
                local op=$(echo "$line" | grep -o '"operation": "[^"]*"' | cut -d'"' -f4)
                local status=$(echo "$line" | grep -o '"status": "[^"]*"' | cut -d'"' -f4)
                local timestamp=$(echo "$line" | grep -o '"timestamp": "[^"]*"' | cut -d'"' -f4)
                echo "    [$timestamp] $op - $status"
            done
        fi
    fi
    
    # Resumable installations
    echo ""
    if [[ -d "${INSTALL_GUARDIAN_CHECKPOINTS:-}" ]]; then
        local resumable_count=$(ls -1 "${INSTALL_GUARDIAN_CHECKPOINTS}" 2>/dev/null | wc -l)
        if [[ $resumable_count -gt 0 ]]; then
            echo "ℹ Resumable installations: $resumable_count (run 'install-guardian list' for details)"
        else
            echo "  No resumable installations"
        fi
    fi
    
    echo ""
}

# Create convenient alias
alias clean_slate='clean_slate_main'

clean_slate_log "INFO" "Clean Slate v${CLEAN_SLATE_VERSION} initialized"
