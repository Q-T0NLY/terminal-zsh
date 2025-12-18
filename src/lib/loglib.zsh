#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# Logging Library - Structured Logging for ZSH
# Provides JSON and plain text logging with levels and rotation
# ═══════════════════════════════════════════════════════════════════════════

# Namespace: loglib
typeset -A LOGLIB_CONFIG
LOGLIB_CONFIG=(
    log_dir "${HOME}/.local/share/nova/logs"
    log_file "nova.log"
    log_level "INFO"
    json_format true
    max_size 10485760  # 10MB
    max_files 5
)

# Log levels (numeric for comparison)
typeset -A LOGLIB_LEVELS
LOGLIB_LEVELS=(
    DEBUG 10
    INFO 20
    WARNING 30
    ERROR 40
    CRITICAL 50
)

# ═══════════════════════════════════════════════════════════════════════════
# CORE LOGGING
# ═══════════════════════════════════════════════════════════════════════════

# Log a message with level
# Usage: loglib::log <level> <message> [context...]
loglib::log() {
    local level="$1"
    shift
    local message="$1"
    shift
    local context="$@"
    
    # Check if level meets threshold
    local level_num=${LOGLIB_LEVELS[$level]:-0}
    local threshold_num=${LOGLIB_LEVELS[${LOGLIB_CONFIG[log_level]}]:-20}
    
    if [[ $level_num -lt $threshold_num ]]; then
        return 0
    fi
    
    # Prepare log entry
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    local log_file="${LOGLIB_CONFIG[log_dir]}/${LOGLIB_CONFIG[log_file]}"
    
    # Ensure log directory exists
    mkdir -p "${LOGLIB_CONFIG[log_dir]}"
    
    # Format log entry
    local log_entry
    if [[ "${LOGLIB_CONFIG[json_format]}" == "true" ]]; then
        # JSON format
        local context_json=""
        if [[ -n "$context" ]]; then
            context_json=",\"context\":\"$context\""
        fi
        log_entry="{\"timestamp\":\"$timestamp\",\"level\":\"$level\",\"message\":\"$message\"${context_json}}"
    else
        # Plain text format
        log_entry="[$timestamp] [$level] $message ${context:+($context)}"
    fi
    
    # Write to file
    echo "$log_entry" >> "$log_file"
    
    # Also output to console with colors
    loglib::_console_output "$level" "$message"
    
    # Check if rotation needed
    loglib::_rotate_if_needed "$log_file"
}

# Console output with colors
loglib::_console_output() {
    local level="$1"
    local message="$2"
    
    local color reset
    color="\033[0m"
    reset="\033[0m"
    
    case "$level" in
        DEBUG)
            color="\033[0;36m"  # Cyan
            echo -e "${color}🔍 [DEBUG]${reset} $message" >&2
            ;;
        INFO)
            color="\033[0;32m"  # Green
            echo -e "${color}ℹ️  [INFO]${reset} $message"
            ;;
        WARNING)
            color="\033[1;33m"  # Yellow
            echo -e "${color}⚠️  [WARN]${reset} $message" >&2
            ;;
        ERROR)
            color="\033[0;31m"  # Red
            echo -e "${color}❌ [ERROR]${reset} $message" >&2
            ;;
        CRITICAL)
            color="\033[1;31m"  # Bold Red
            echo -e "${color}🚨 [CRITICAL]${reset} $message" >&2
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════════════════
# LOG ROTATION
# ═══════════════════════════════════════════════════════════════════════════

loglib::_rotate_if_needed() {
    local log_file="$1"
    
    if [[ ! -f "$log_file" ]]; then
        return 0
    fi
    
    local file_size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null || echo 0)
    
    if [[ $file_size -ge ${LOGLIB_CONFIG[max_size]} ]]; then
        loglib::rotate_logs
    fi
}

loglib::rotate_logs() {
    local log_file="${LOGLIB_CONFIG[log_dir]}/${LOGLIB_CONFIG[log_file]}"
    local max_files=${LOGLIB_CONFIG[max_files]}
    
    # Remove oldest log if at max
    if [[ -f "${log_file}.${max_files}.gz" ]]; then
        rm -f "${log_file}.${max_files}.gz"
    fi
    
    # Rotate existing logs
    for ((i = max_files - 1; i >= 1; i--)); do
        if [[ -f "${log_file}.${i}.gz" ]]; then
            mv "${log_file}.${i}.gz" "${log_file}.$((i + 1)).gz"
        fi
    done
    
    # Compress current log
    if [[ -f "$log_file" ]]; then
        gzip -c "$log_file" > "${log_file}.1.gz"
        > "$log_file"  # Truncate current log
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# CONVENIENCE FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

loglib::debug() {
    loglib::log DEBUG "$@"
}

loglib::info() {
    loglib::log INFO "$@"
}

loglib::warn() {
    loglib::log WARNING "$@"
}

loglib::error() {
    loglib::log ERROR "$@"
}

loglib::critical() {
    loglib::log CRITICAL "$@"
}

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

loglib::set_level() {
    local level="${1^^}"  # Convert to uppercase
    
    if [[ -n "${LOGLIB_LEVELS[$level]}" ]]; then
        LOGLIB_CONFIG[log_level]="$level"
    else
        loglib::error "Invalid log level: $level"
        return 1
    fi
}

loglib::set_format() {
    local format="$1"
    
    case "$format" in
        json|JSON)
            LOGLIB_CONFIG[json_format]=true
            ;;
        text|TEXT|plain|PLAIN)
            LOGLIB_CONFIG[json_format]=false
            ;;
        *)
            loglib::error "Invalid format: $format (use 'json' or 'text')"
            return 1
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

# Ensure log directory exists
mkdir -p "${LOGLIB_CONFIG[log_dir]}"

# Export functions
autoload -Uz loglib::log
autoload -Uz loglib::debug
autoload -Uz loglib::info
autoload -Uz loglib::warn
autoload -Uz loglib::error
autoload -Uz loglib::critical
autoload -Uz loglib::set_level
autoload -Uz loglib::set_format
autoload -Uz loglib::rotate_logs
