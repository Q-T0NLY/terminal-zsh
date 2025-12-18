#!/bin/zsh
################################################################################
#                    PATH & DEPENDENCY MANAGEMENT MODULE                       #
#                 Intelligent PATH configuration and resolution                #
################################################################################
#
# PURPOSE: Manage system PATH, resolve dependencies, detect conflicts
# DEPENDENCIES: None (core module)
# STATUS: Production Ready
#
# This module:
# - Intelligently configures PATH to avoid conflicts
# - Detects and resolves dependency issues
# - Provides centralized PATH management
# - Supports multiple package managers
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. PATH FOUNDATION                                                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Clear PATH and rebuild from scratch to avoid conflicts
declare -a NEW_PATH

# 1. System core paths (highest priority)
NEW_PATH+=(
    "/usr/local/bin"
    "/usr/local/sbin"
    "/usr/bin"
    "/usr/sbin"
    "/bin"
    "/sbin"
)

# 2. Homebrew paths (macOS-specific, high priority)
if [[ -d "/opt/homebrew" ]]; then
    export HOMEBREW_PREFIX="/opt/homebrew"
    NEW_PATH+=(
        "${HOMEBREW_PREFIX}/bin"
        "${HOMEBREW_PREFIX}/sbin"
    )
    export HOMEBREW_CELLAR="${HOMEBREW_PREFIX}/Cellar"
    export HOMEBREW_REPOSITORY="${HOMEBREW_PREFIX}"
elif [[ -d "/usr/local/Homebrew" ]]; then
    export HOMEBREW_PREFIX="/usr/local"
    NEW_PATH+=(
        "${HOMEBREW_PREFIX}/bin"
        "${HOMEBREW_PREFIX}/sbin"
    )
fi

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. PROGRAMMING LANGUAGE ENVIRONMENTS                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Python (pyenv for version management)
if [[ -d "${HOME}/.pyenv" ]]; then
    export PYENV_ROOT="${HOME}/.pyenv"
    NEW_PATH+=(
        "${PYENV_ROOT}/bin"
    )
fi

# Node.js (nvm for version management)
if [[ -d "${HOME}/.nvm" ]]; then
    export NVM_DIR="${HOME}/.nvm"
    # NVM loads itself, don't add to PATH here
fi

# Go
if [[ -d "/opt/homebrew/opt/go/libexec/bin" ]]; then
    NEW_PATH+=("/opt/homebrew/opt/go/libexec/bin")
fi

# Ruby (rbenv for version management)
if [[ -d "${HOME}/.rbenv" ]]; then
    export RBENV_ROOT="${HOME}/.rbenv"
    NEW_PATH+=(
        "${RBENV_ROOT}/bin"
    )
fi

# Rust
if [[ -d "${HOME}/.cargo" ]]; then
    export CARGO_HOME="${HOME}/.cargo"
    NEW_PATH+=(
        "${CARGO_HOME}/bin"
    )
fi

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. DEVELOPMENT TOOLS                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Docker (if installed)
if command -v docker &>/dev/null; then
    export DOCKER_CONFIG="${XDG_CONFIG_HOME}/docker"
fi

# Kubernetes tools
if [[ -d "/opt/homebrew/opt/kubectl/bin" ]]; then
    NEW_PATH+=("/opt/homebrew/opt/kubectl/bin")
fi

# Google Cloud SDK
if [[ -d "${HOME}/google-cloud-sdk" ]]; then
    NEW_PATH+=(
        "${HOME}/google-cloud-sdk/bin"
    )
fi

# AWS CLI
if [[ -d "/opt/homebrew/opt/awscli" ]]; then
    NEW_PATH+=("/opt/homebrew/opt/awscli/bin")
fi

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. LOCAL USER PATHS                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# User local bin (highest priority for custom scripts)
NEW_PATH+=(
    "${HOME}/.local/bin"
    "${HOME}/bin"
)

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. DEDUPLICATE AND SET PATH                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Remove duplicates while preserving order
declare -a UNIQUE_PATH
declare -A PATH_SEEN

for dir in "${NEW_PATH[@]}"; do
    # Skip if directory doesn't exist
    [[ ! -d "$dir" ]] && continue
    
    # Skip if already seen
    [[ -n "${PATH_SEEN[$dir]}" ]] && continue
    
    PATH_SEEN[$dir]=1
    UNIQUE_PATH+=("$dir")
done

# Set the final PATH
export PATH="${(j/:/)UNIQUE_PATH}"

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. CONFLICT DETECTION                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

detect_path_conflicts() {
    local conflicts=0
    
    # Check for duplicate executables in different PATH entries
    declare -A binary_locations
    
    for dir in "${(@s/:/)PATH}"; do
        [[ ! -d "$dir" ]] && continue
        for binary in "$dir"/*; do
            [[ ! -x "$binary" ]] && continue
            local name=$(basename "$binary")
            
            if [[ -n "${binary_locations[$name]}" ]]; then
                if [[ "${binary_locations[$name]}" != "$binary" ]]; then
                    log_message "WARN" "Duplicate binary found: $name in $dir and ${binary_locations[$name]}"
                    ((conflicts++))
                fi
            else
                binary_locations[$name]="$binary"
            fi
        done
    done
    
    [[ $conflicts -gt 0 ]] && log_message "INFO" "Found $conflicts potential PATH conflicts"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. DEPENDENCY RESOLUTION                                                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Check for critical tools
check_critical_dependencies() {
    local missing=()
    
    for tool in zsh git curl; do
        if ! command -v "$tool" &>/dev/null; then
            missing+=("$tool")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_message "ERROR" "Missing critical tools: ${missing[@]}"
        echo "❌ Error: Missing critical tools: ${missing[@]}"
        return 1
    fi
    
    return 0
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 8. UTILITY FUNCTIONS                                                         ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Print current PATH in readable format
path_show() {
    echo "Current PATH:"
    echo "$PATH" | tr ':' '\n' | nl
}

# Add directory to PATH (intelligent, no duplicates)
path_add() {
    local dir="$1"
    
    [[ ! -d "$dir" ]] && {
        echo "❌ Directory not found: $dir"
        return 1
    }
    
    # Check if already in PATH
    if [[ ":$PATH:" == *":$dir:"* ]]; then
        echo "⚠️  Already in PATH: $dir"
        return 0
    fi
    
    # Add to front of PATH
    export PATH="${dir}:${PATH}"
    log_message "INFO" "Added to PATH: $dir"
    echo "✅ Added to PATH: $dir"
}

# Remove directory from PATH
path_remove() {
    local dir="$1"
    export PATH="${PATH//:$dir://:}"
    export PATH="${PATH#$dir:}"
    export PATH="${PATH%:$dir}"
    log_message "INFO" "Removed from PATH: $dir"
    echo "✅ Removed from PATH: $dir"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 9. INITIALIZATION                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Check critical dependencies on initialization
check_critical_dependencies || handle_module_error "path" "missing critical dependencies"

# Detect conflicts if verbose mode enabled
if [[ "${DEBUG_MODE:-0}" == "1" ]]; then
    detect_path_conflicts
fi

log_message "INFO" "PATH module initialized with ${#UNIQUE_PATH[@]} entries"

################################################################################
# END OF PATH.MODULE.ZSH
################################################################################
