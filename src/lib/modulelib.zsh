#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# Module Loader - Dynamic Module Loading with Dependencies
# Provides lazy loading and dependency management for ZSH modules
# ═══════════════════════════════════════════════════════════════════════════

# Namespace: modulelib
typeset -A MODULELIB_CONFIG
MODULELIB_CONFIG=(
    module_dir "${NOVA_ROOT:-$(dirname ${(%):-%x})}/../.."
    lib_dir "${NOVA_ROOT:-$(dirname ${(%):-%x})}"
)

# Module registry
typeset -A MODULELIB_LOADED
typeset -A MODULELIB_DEPENDENCIES

# ═══════════════════════════════════════════════════════════════════════════
# MODULE LOADING
# ═══════════════════════════════════════════════════════════════════════════

# Load a module
# Usage: modulelib::load <module_name>
modulelib::load() {
    local module="$1"
    
    # Check if already loaded
    if [[ -n "${MODULELIB_LOADED[$module]}" ]]; then
        return 0
    fi
    
    # Try different paths
    local module_paths=(
        "${MODULELIB_CONFIG[lib_dir]}/${module}.zsh"
        "${MODULELIB_CONFIG[module_dir]}/src/lib/${module}.zsh"
        "${MODULELIB_CONFIG[module_dir]}/src/modules/${module}.zsh"
        "${MODULELIB_CONFIG[module_dir]}/src/core/${module}.zsh"
    )
    
    local module_file=""
    for path in "${module_paths[@]}"; do
        if [[ -f "$path" ]]; then
            module_file="$path"
            break
        fi
    done
    
    if [[ -z "$module_file" ]]; then
        echo "❌ Module not found: $module" >&2
        return 1
    fi
    
    # Load dependencies first
    if [[ -n "${MODULELIB_DEPENDENCIES[$module]}" ]]; then
        local deps=(${(s:,:)MODULELIB_DEPENDENCIES[$module]})
        for dep in "${deps[@]}"; do
            modulelib::load "$dep" || return 1
        done
    fi
    
    # Source the module
    source "$module_file"
    MODULELIB_LOADED[$module]="$module_file"
    
    echo "✅ Loaded module: $module" >&2
    return 0
}

# Load multiple modules
# Usage: modulelib::load_all <module1> <module2> ...
modulelib::load_all() {
    local success=true
    
    for module in "$@"; do
        if ! modulelib::load "$module"; then
            success=false
        fi
    done
    
    $success
}

# ═══════════════════════════════════════════════════════════════════════════
# LAZY LOADING
# ═══════════════════════════════════════════════════════════════════════════

# Register module for lazy loading
# Usage: modulelib::lazy <module_name> <trigger_function>
modulelib::lazy() {
    local module="$1"
    local trigger_func="$2"
    
    # Create wrapper function that loads module on first call
    eval "
    $trigger_func() {
        unfunction $trigger_func
        modulelib::load $module
        $trigger_func \"\$@\"
    }
    "
}

# ═══════════════════════════════════════════════════════════════════════════
# DEPENDENCY MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

# Register module dependencies
# Usage: modulelib::depends <module> <dep1> <dep2> ...
modulelib::depends() {
    local module="$1"
    shift
    local deps="$*"
    
    MODULELIB_DEPENDENCIES[$module]="${deps// /,}"
}

# Check if module is loaded
# Usage: modulelib::is_loaded <module>
modulelib::is_loaded() {
    local module="$1"
    [[ -n "${MODULELIB_LOADED[$module]}" ]]
}

# ═══════════════════════════════════════════════════════════════════════════
# MODULE INFORMATION
# ═══════════════════════════════════════════════════════════════════════════

# List loaded modules
modulelib::list() {
    echo "=== Loaded Modules ==="
    
    for module in "${(@k)MODULELIB_LOADED}"; do
        local path="${MODULELIB_LOADED[$module]}"
        echo "  ✓ $module"
        echo "    → $path"
        
        if [[ -n "${MODULELIB_DEPENDENCIES[$module]}" ]]; then
            local deps="${MODULELIB_DEPENDENCIES[$module]//,/ }"
            echo "    ⚙ Dependencies: $deps"
        fi
    done
}

# Get module path
# Usage: modulelib::path <module>
modulelib::path() {
    local module="$1"
    echo "${MODULELIB_LOADED[$module]}"
}

# ═══════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

# Reload a module
# Usage: modulelib::reload <module>
modulelib::reload() {
    local module="$1"
    local path="${MODULELIB_LOADED[$module]}"
    
    if [[ -z "$path" ]]; then
        echo "❌ Module not loaded: $module" >&2
        return 1
    fi
    
    unset "MODULELIB_LOADED[$module]"
    modulelib::load "$module"
}

# Unload a module
# Usage: modulelib::unload <module>
modulelib::unload() {
    local module="$1"
    
    if [[ -z "${MODULELIB_LOADED[$module]}" ]]; then
        echo "⚠️  Module not loaded: $module" >&2
        return 1
    fi
    
    unset "MODULELIB_LOADED[$module]"
    echo "✅ Unloaded module: $module" >&2
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

# Set module path from environment if available
if [[ -n "$NOVA_ROOT" ]]; then
    MODULELIB_CONFIG[module_dir]="$NOVA_ROOT"
fi

# Export functions
autoload -Uz modulelib::load
autoload -Uz modulelib::load_all
autoload -Uz modulelib::lazy
autoload -Uz modulelib::depends
autoload -Uz modulelib::is_loaded
autoload -Uz modulelib::list
autoload -Uz modulelib::path
autoload -Uz modulelib::reload
autoload -Uz modulelib::unload
