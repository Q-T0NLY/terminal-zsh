#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# Configuration Management Library
# Provides hierarchical configuration with environment overrides
# ═══════════════════════════════════════════════════════════════════════════

# Namespace: configlib
typeset -A CONFIGLIB_CONFIG
CONFIGLIB_CONFIG=(
    config_dir "${HOME}/.config/nova"
    config_file "config.json"
    environment "development"
)

# Configuration storage
typeset -A CONFIGLIB_VALUES

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION LOADING
# ═══════════════════════════════════════════════════════════════════════════

# Load configuration from file
# Usage: configlib::load [config_file]
configlib::load() {
    local config_file="${1:-${CONFIGLIB_CONFIG[config_dir]}/${CONFIGLIB_CONFIG[config_file]}}"
    
    if [[ ! -f "$config_file" ]]; then
        echo "⚠️  Config file not found: $config_file, using defaults" >&2
        return 1
    fi
    
    # Parse JSON config
    if command -v jq &>/dev/null; then
        local keys=($(jq -r 'keys[]' "$config_file" 2>/dev/null))
        
        for key in "${keys[@]}"; do
            local value=$(jq -r ".${key}" "$config_file")
            CONFIGLIB_VALUES[$key]="$value"
        done
    else
        echo "⚠️  jq not found, cannot parse JSON config" >&2
        return 1
    fi
    
    echo "✅ Loaded configuration from $config_file" >&2
}

# Load environment-specific configuration
# Usage: configlib::load_env <environment>
configlib::load_env() {
    local env="$1"
    local env_file="${CONFIGLIB_CONFIG[config_dir]}/config.${env}.json"
    
    if [[ -f "$env_file" ]]; then
        configlib::load "$env_file"
        CONFIGLIB_CONFIG[environment]="$env"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION ACCESS
# ═══════════════════════════════════════════════════════════════════════════

# Get configuration value
# Usage: configlib::get <key> [default]
configlib::get() {
    local key="$1"
    local default="${2:-}"
    
    # Check environment variable override
    local env_var="NOVA_${key^^}"
    if [[ -n "${(P)env_var}" ]]; then
        echo "${(P)env_var}"
        return 0
    fi
    
    # Check loaded config
    if [[ -n "${CONFIGLIB_VALUES[$key]}" ]]; then
        echo "${CONFIGLIB_VALUES[$key]}"
        return 0
    fi
    
    # Return default
    echo "$default"
}

# Set configuration value (in memory only)
# Usage: configlib::set <key> <value>
configlib::set() {
    local key="$1"
    local value="$2"
    
    CONFIGLIB_VALUES[$key]="$value"
}

# Check if key exists
# Usage: configlib::has <key>
configlib::has() {
    local key="$1"
    
    [[ -n "${CONFIGLIB_VALUES[$key]}" ]]
}

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION PERSISTENCE
# ═══════════════════════════════════════════════════════════════════════════

# Save configuration to file
# Usage: configlib::save [config_file]
configlib::save() {
    local config_file="${1:-${CONFIGLIB_CONFIG[config_dir]}/${CONFIGLIB_CONFIG[config_file]}}"
    
    # Ensure directory exists
    mkdir -p "$(dirname "$config_file")"
    
    # Build JSON
    local json="{"
    local first=true
    
    for key in "${(@k)CONFIGLIB_VALUES}"; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            json+=","
        fi
        
        local value="${CONFIGLIB_VALUES[$key]}"
        json+="\"$key\":\"$value\""
    done
    
    json+="}"
    
    echo "$json" | jq '.' > "$config_file" 2>/dev/null || echo "$json" > "$config_file"
    
    echo "✅ Saved configuration to $config_file" >&2
}

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION VALIDATION
# ═══════════════════════════════════════════════════════════════════════════

# Validate required configuration keys
# Usage: configlib::require <key1> <key2> ...
configlib::require() {
    local missing=()
    
    for key in "$@"; do
        if ! configlib::has "$key"; then
            missing+=("$key")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "❌ Missing required configuration: ${missing[*]}" >&2
        return 1
    fi
    
    return 0
}

# Validate configuration value format
# Usage: configlib::validate <key> <pattern>
configlib::validate() {
    local key="$1"
    local pattern="$2"
    
    local value=$(configlib::get "$key")
    
    if [[ ! "$value" =~ $pattern ]]; then
        echo "❌ Invalid value for $key: '$value' (expected pattern: $pattern)" >&2
        return 1
    fi
    
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

# List all configuration keys
configlib::keys() {
    for key in "${(@k)CONFIGLIB_VALUES}"; do
        echo "$key"
    done
}

# Show all configuration values
configlib::show() {
    echo "=== Configuration (${CONFIGLIB_CONFIG[environment]}) ==="
    
    for key in "${(@k)CONFIGLIB_VALUES}"; do
        echo "  $key = ${CONFIGLIB_VALUES[$key]}"
    done
}

# Reset configuration
configlib::reset() {
    CONFIGLIB_VALUES=()
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

# Ensure config directory exists
mkdir -p "${CONFIGLIB_CONFIG[config_dir]}"

# Auto-load from environment variable
if [[ -n "$NOVA_ENV" ]]; then
    configlib::load_env "$NOVA_ENV"
fi

# Export functions
autoload -Uz configlib::load
autoload -Uz configlib::load_env
autoload -Uz configlib::get
autoload -Uz configlib::set
autoload -Uz configlib::has
autoload -Uz configlib::save
autoload -Uz configlib::require
autoload -Uz configlib::validate
autoload -Uz configlib::keys
autoload -Uz configlib::show
autoload -Uz configlib::reset
