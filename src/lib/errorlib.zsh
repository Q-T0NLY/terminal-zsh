#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# Error Handling Library - Enterprise Grade
# Provides comprehensive error handling, retry logic, and recovery mechanisms
# ═══════════════════════════════════════════════════════════════════════════

# Namespace: errorlib
typeset -A ERRORLIB_CONFIG
ERRORLIB_CONFIG=(
    max_retries 3
    backoff_base 2
    backoff_max 60
    error_log "${HOME}/.local/share/nova/logs/errors.log"
)

# ═══════════════════════════════════════════════════════════════════════════
# ERROR HANDLING
# ═══════════════════════════════════════════════════════════════════════════

# Error handler with context
errorlib::handle_error() {
    local exit_code=$?
    local line_no="${1:-unknown}"
    local function_name="${2:-unknown}"
    local command="${3:-unknown}"
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    local error_msg="[${timestamp}] ERROR: Code ${exit_code} in ${function_name} at line ${line_no}: ${command}"
    
    # Log to file
    echo "$error_msg" >> "${ERRORLIB_CONFIG[error_log]}"
    
    # Output to stderr
    echo "❌ Error (code ${exit_code}): ${command}" >&2
    
    return $exit_code
}

# Trap errors with context
errorlib::enable_error_trap() {
    set -o errexit
    set -o nounset
    set -o pipefail
    
    trap 'errorlib::handle_error ${LINENO} "${funcstack[1]:-main}" "$BASH_COMMAND"' ERR
}

# Disable error trap (for expected failures)
errorlib::disable_error_trap() {
    trap - ERR
    set +o errexit
}

# ═══════════════════════════════════════════════════════════════════════════
# RETRY LOGIC WITH EXPONENTIAL BACKOFF
# ═══════════════════════════════════════════════════════════════════════════

# Retry a command with exponential backoff
# Usage: errorlib::retry <max_attempts> <command> [args...]
errorlib::retry() {
    local max_attempts="${1:-${ERRORLIB_CONFIG[max_retries]}}"
    shift
    local command="$@"
    
    local attempt=1
    local backoff=${ERRORLIB_CONFIG[backoff_base]}
    
    while [[ $attempt -le $max_attempts ]]; do
        echo "Attempt $attempt/$max_attempts: $command" >&2
        
        if eval "$command"; then
            echo "✅ Success on attempt $attempt" >&2
            return 0
        fi
        
        local exit_code=$?
        
        if [[ $attempt -lt $max_attempts ]]; then
            echo "⚠️  Failed (code $exit_code), retrying in ${backoff}s..." >&2
            sleep "$backoff"
            
            # Exponential backoff
            backoff=$((backoff * ERRORLIB_CONFIG[backoff_base]))
            [[ $backoff -gt ${ERRORLIB_CONFIG[backoff_max]} ]] && backoff=${ERRORLIB_CONFIG[backoff_max]}
        fi
        
        ((attempt++))
    done
    
    echo "❌ Failed after $max_attempts attempts" >&2
    return 1
}

# ═══════════════════════════════════════════════════════════════════════════
# GRACEFUL DEGRADATION
# ═══════════════════════════════════════════════════════════════════════════

# Try command, fallback on failure
# Usage: errorlib::try_or_fallback <command> <fallback_command>
errorlib::try_or_fallback() {
    local command="$1"
    local fallback="$2"
    
    if eval "$command" 2>/dev/null; then
        return 0
    else
        echo "⚠️  Primary command failed, using fallback" >&2
        eval "$fallback"
    fi
}

# Safe command execution with default value on failure
# Usage: errorlib::safe_exec <command> <default_value>
errorlib::safe_exec() {
    local command="$1"
    local default="${2:-}"
    
    local result
    if result=$(eval "$command" 2>/dev/null); then
        echo "$result"
    else
        echo "$default"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════════════════

# Validate required variables are set
# Usage: errorlib::require_vars VAR1 VAR2 VAR3
errorlib::require_vars() {
    local missing=()
    
    for var in "$@"; do
        if [[ -z "${(P)var:-}" ]]; then
            missing+=("$var")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "❌ Missing required variables: ${missing[*]}" >&2
        return 1
    fi
    
    return 0
}

# Validate file exists and is readable
# Usage: errorlib::require_file <file>
errorlib::require_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "❌ Required file not found: $file" >&2
        return 1
    fi
    
    if [[ ! -r "$file" ]]; then
        echo "❌ Required file not readable: $file" >&2
        return 1
    fi
    
    return 0
}

# Validate command exists
# Usage: errorlib::require_command <command>
errorlib::require_command() {
    local cmd="$1"
    
    if ! command -v "$cmd" &>/dev/null; then
        echo "❌ Required command not found: $cmd" >&2
        return 1
    fi
    
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════
# CLEANUP HANDLERS
# ═══════════════════════════════════════════════════════════════════════════

# Register cleanup function
typeset -a ERRORLIB_CLEANUP_HANDLERS
errorlib::register_cleanup() {
    ERRORLIB_CLEANUP_HANDLERS+=("$1")
}

# Execute cleanup handlers
errorlib::cleanup() {
    echo "Running cleanup handlers..." >&2
    
    for handler in "${ERRORLIB_CLEANUP_HANDLERS[@]}"; do
        echo "  Executing: $handler" >&2
        eval "$handler" || true
    done
}

# Trap exit for cleanup
errorlib::enable_cleanup_trap() {
    trap errorlib::cleanup EXIT INT TERM
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

# Ensure error log directory exists
mkdir -p "$(dirname "${ERRORLIB_CONFIG[error_log]}")"

# Export functions
autoload -Uz errorlib::handle_error
autoload -Uz errorlib::enable_error_trap
autoload -Uz errorlib::disable_error_trap
autoload -Uz errorlib::retry
autoload -Uz errorlib::try_or_fallback
autoload -Uz errorlib::safe_exec
autoload -Uz errorlib::require_vars
autoload -Uz errorlib::require_file
autoload -Uz errorlib::require_command
autoload -Uz errorlib::register_cleanup
autoload -Uz errorlib::cleanup
autoload -Uz errorlib::enable_cleanup_trap
