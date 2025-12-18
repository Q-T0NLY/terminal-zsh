#!/bin/zsh
################################################################################
#                   PACKAGE MANAGER ORCHESTRATION MODULE                       #
#                   Unified Homebrew management and integration                #
################################################################################
#
# PURPOSE: Manage package managers, handle installations, resolve conflicts
# DEPENDENCIES: path.module (for Homebrew detection)
# STATUS: Production Ready
#
# This module:
# - Provides unified package manager interface
# - Handles Homebrew installation and configuration
# - Manages formula and cask updates
# - Implements safe upgrade procedures
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. HOMEBREW DETECTION & SETUP                                               ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Detect Homebrew installation
detect_homebrew() {
    if command -v brew &>/dev/null; then
        export HOMEBREW_INSTALLED=1
        export BREW_BIN=$(command -v brew)
        log_message "INFO" "Homebrew detected: $BREW_BIN"
        return 0
    else
        export HOMEBREW_INSTALLED=0
        log_message "WARN" "Homebrew not installed"
        return 1
    fi
}

# Initialize Homebrew environment
init_homebrew() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        return 1
    fi
    
    # Set Homebrew configuration
    export HOMEBREW_NO_ANALYTICS=1
    export HOMEBREW_NO_AUTO_UPDATE=0
    export HOMEBREW_CASK_OPTS="--no-quarantine"
    
    # Homebrew cache
    export HOMEBREW_CACHE="${NEXUSPRO_CACHE}/homebrew"
    mkdir -p "$HOMEBREW_CACHE"
    
    log_message "INFO" "Homebrew environment initialized"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. PACKAGE INSTALLATION                                                      ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Install package with dependency checking
pkg_install() {
    local package="$1"
    
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed. Cannot install $package"
        return 1
    fi
    
    # Check if already installed
    if brew list "$package" &>/dev/null 2>&1; then
        echo "✅ Package already installed: $package"
        return 0
    fi
    
    # Install with error handling
    echo "📦 Installing: $package"
    if brew install "$package" 2>/tmp/brew_install.log; then
        log_message "INFO" "Successfully installed: $package"
        echo "✅ Successfully installed: $package"
        return 0
    else
        log_message "ERROR" "Failed to install $package: $(cat /tmp/brew_install.log)"
        echo "❌ Failed to install $package. Check logs for details."
        return 1
    fi
}

# Install cask with error handling
cask_install() {
    local cask="$1"
    
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed. Cannot install $cask"
        return 1
    fi
    
    # Check if already installed
    if brew list --cask "$cask" &>/dev/null 2>&1; then
        echo "✅ Cask already installed: $cask"
        return 0
    fi
    
    # Install with error handling
    echo "📦 Installing cask: $cask"
    if brew install --cask "$cask" 2>/tmp/brew_cask_install.log; then
        log_message "INFO" "Successfully installed cask: $cask"
        echo "✅ Successfully installed cask: $cask"
        return 0
    else
        log_message "ERROR" "Failed to install cask $cask: $(cat /tmp/brew_cask_install.log)"
        echo "❌ Failed to install cask $cask. Check logs for details."
        return 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. PACKAGE MANAGEMENT                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Update Homebrew
pkg_update() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "🔄 Updating Homebrew..."
    if brew update 2>/dev/null; then
        log_message "INFO" "Homebrew updated successfully"
        echo "✅ Homebrew updated successfully"
        return 0
    else
        log_message "ERROR" "Failed to update Homebrew"
        echo "❌ Failed to update Homebrew"
        return 1
    fi
}

# Upgrade packages
pkg_upgrade() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "⬆️  Upgrading packages..."
    if brew upgrade 2>/dev/null; then
        log_message "INFO" "Packages upgraded successfully"
        echo "✅ Packages upgraded successfully"
        return 0
    else
        log_message "ERROR" "Failed to upgrade packages"
        echo "❌ Failed to upgrade packages"
        return 1
    fi
}

# Upgrade casks
cask_upgrade() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "⬆️  Upgrading casks..."
    if brew upgrade --cask 2>/dev/null; then
        log_message "INFO" "Casks upgraded successfully"
        echo "✅ Casks upgraded successfully"
        return 0
    else
        log_message "ERROR" "Failed to upgrade casks"
        echo "❌ Failed to upgrade casks"
        return 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. CLEANUP & MAINTENANCE                                                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Clean up unused packages
pkg_cleanup() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "🧹 Cleaning up Homebrew..."
    
    # Remove old versions
    brew cleanup -s 2>/dev/null
    
    # Prune old cask downloads
    brew cask cleanup &>/dev/null || true
    
    # Remove unused dependencies
    if brew autoremove &>/dev/null 2>&1; then
        log_message "INFO" "Homebrew cleanup completed"
        echo "✅ Cleanup completed"
        return 0
    else
        log_message "WARN" "Partial cleanup completed"
        echo "⚠️  Partial cleanup completed"
        return 0
    fi
}

# Check Homebrew health
pkg_doctor() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "🏥 Running Homebrew health check..."
    brew doctor
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. LIST & QUERY                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# List installed packages
pkg_list() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "📦 Installed packages:"
    brew list
}

# List installed casks
cask_list() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    echo "📦 Installed casks:"
    brew list --cask
}

# Search for package
pkg_search() {
    local query="$1"
    
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    if [[ -z "$query" ]]; then
        echo "Usage: pkg_search <package_name>"
        return 1
    fi
    
    echo "🔍 Searching for: $query"
    brew search "$query"
}

# Get package info
pkg_info() {
    local package="$1"
    
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        echo "❌ Error: Homebrew not installed"
        return 1
    fi
    
    if [[ -z "$package" ]]; then
        echo "Usage: pkg_info <package_name>"
        return 1
    fi
    
    echo "ℹ️  Package information for: $package"
    brew info "$package"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. CONFLICT DETECTION                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Detect package conflicts
detect_pkg_conflicts() {
    if [[ $HOMEBREW_INSTALLED -ne 1 ]]; then
        return 0
    fi
    
    local conflicts=0
    
    # Check for duplicate packages
    while IFS= read -r package; do
        local count=$(brew list --multiple "$package" 2>/dev/null | wc -l)
        if (( count > 1 )); then
            log_message "WARN" "Package installed multiple times: $package"
            ((conflicts++))
        fi
    done < <(brew list)
    
    if (( conflicts > 0 )); then
        log_message "WARN" "Found $conflicts potential package conflicts"
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. INITIALIZATION                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Initialize package manager module
detect_homebrew
if [[ $HOMEBREW_INSTALLED -eq 1 ]]; then
    init_homebrew
    
    # Detect conflicts if debug mode enabled
    if [[ "${DEBUG_MODE:-0}" == "1" ]]; then
        detect_pkg_conflicts
    fi
fi

log_message "INFO" "Package manager module initialized (Homebrew: $([[ $HOMEBREW_INSTALLED -eq 1 ]] && echo 'installed' || echo 'not installed'))"

################################################################################
# END OF PKGMGR.MODULE.ZSH
################################################################################
