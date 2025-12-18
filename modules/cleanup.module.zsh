#!/bin/zsh
################################################################################
#                   CLEANUP & CONFLICT DETECTION MODULE                        #
#              Detect and resolve configuration conflicts                      #
################################################################################
#
# PURPOSE: Clean up system, detect conflicts, validate configuration
# DEPENDENCIES: performance.module
# STATUS: Production Ready
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. CONFLICT DETECTION                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Detect duplicate shell configurations
detect_config_conflicts() {
    echo "🔍 Detecting configuration conflicts..."
    
    local conflicts=0
    
    # Check for multiple shell config sources
    if [[ -f ~/.zshrc && -f ~/.zsh_profile ]]; then
        echo "⚠️  Found both ~/.zshrc and ~/.zsh_profile"
        ((conflicts++))
    fi
    
    # Check for duplicate PATH entries
    local path_count=$(echo "$PATH" | tr ':' '\n' | sort | uniq -d | wc -l)
    if (( path_count > 0 )); then
        echo "⚠️  Found $path_count duplicate PATH entries"
        ((conflicts++))
    fi
    
    # Check for orphaned .shell rc files
    if [[ -f ~/.bashrc && ! -f ~/.bash_profile ]]; then
        echo "ℹ️  Found ~/.bashrc but no ~/.bash_profile"
    fi
    
    if (( conflicts == 0 )); then
        echo "✅ No major configuration conflicts detected"
        return 0
    else
        echo "⚠️  Found $conflicts potential conflicts"
        return 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. DUPLICATE PATH CLEANUP                                                    ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Remove duplicate PATH entries
cleanup_duplicate_paths() {
    echo "🧹 Cleaning duplicate PATH entries..."
    
    declare -a UNIQUE
    declare -A SEEN
    
    for entry in ${(s/:/)PATH}; do
        [[ -z "${SEEN[$entry]}" ]] && UNIQUE+=("$entry") && SEEN[$entry]=1
    done
    
    export PATH="${(j/:/)UNIQUE}"
    
    echo "✅ Removed duplicates. Unique entries: ${#UNIQUE[@]}"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. DOTFILE CLEANUP                                                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Identify orphaned dotfiles
find_orphaned_dotfiles() {
    echo "🔍 Scanning for orphaned dotfiles..."
    
    local orphaned=()
    local common_dotfiles=(
        ".bashrc" ".bash_profile" ".bash_logout" ".profile"
        ".kshrc" ".cshrc" ".tcshrc"
        ".vim" ".vimrc" ".config/vim"
        ".emacs" ".emacs.d"
        ".gitignore_global" ".gitconfig"
        ".npmrc" ".pythonrc"
    )
    
    for file in "${common_dotfiles[@]}"; do
        if [[ -e "$HOME/$file" && ! -L "$HOME/$file" ]]; then
            # Check if it's referenced in current shell config
            if ! grep -q "$file" ~/.zshrc 2>/dev/null; then
                orphaned+=("$file")
            fi
        fi
    done
    
    if (( ${#orphaned[@]} > 0 )); then
        echo "Found potentially orphaned dotfiles:"
        printf '  - %s\n' "${orphaned[@]}"
    else
        echo "✅ No obvious orphaned dotfiles found"
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. PACKAGE MANAGER CLEANUP                                                   ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Check for package manager conflicts
check_pkg_manager_conflicts() {
    echo "🔍 Checking for package manager conflicts..."
    
    local pkg_managers=()
    
    # Check which package managers are installed
    [[ -x "$(command -v brew)" ]] && pkg_managers+=("homebrew")
    [[ -x "$(command -v port)" ]] && pkg_managers+=("macports")
    [[ -x "$(command -v fink)" ]] && pkg_managers+=("fink")
    
    if (( ${#pkg_managers[@]} > 1 )); then
        echo "⚠️  Multiple package managers detected:"
        printf '  - %s\n' "${pkg_managers[@]}"
        echo "This may cause conflicts. Recommended: Use only Homebrew"
    else
        echo "✅ No package manager conflicts detected"
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. SYSTEM CLEANUP FUNCTIONS                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Full system cleanup
system_cleanup() {
    echo "🧹 Running full system cleanup..."
    
    # Remove old log files
    find "$LOG_DIR" -name "*.log" -mtime +30 -delete 2>/dev/null
    
    # Clear cache
    clear_cache
    
    # Cleanup Homebrew
    if command -v brew &>/dev/null; then
        echo "Cleaning Homebrew..."
        brew cleanup -s 2>/dev/null
        brew cask cleanup 2>/dev/null || true
        brew autoremove 2>/dev/null || true
    fi
    
    # Cleanup npm cache (if nvm is installed)
    if [[ -d "${HOME}/.nvm" ]]; then
        echo "Cleaning npm cache..."
        npm cache clean --force 2>/dev/null || true
    fi
    
    # Cleanup Python cache
    find "$HOME" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find "$HOME" -type f -name "*.pyc" -delete 2>/dev/null || true
    
    echo "✅ System cleanup completed"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. VALIDATION & DIAGNOSTICS                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Comprehensive system diagnostics
system_diagnostics() {
    echo "🔍 Running comprehensive system diagnostics..."
    echo ""
    
    echo "📊 System Information:"
    echo "  OS: $OS_TYPE"
    echo "  Version: $MACOS_VERSION"
    echo "  Architecture: $OS_ARCH"
    echo ""
    
    echo "📦 Package Managers:"
    [[ -x "$(command -v brew)" ]] && echo "  ✅ Homebrew" || echo "  ❌ Homebrew"
    echo ""
    
    echo "🛠️  Development Tools:"
    [[ -x "$(command -v git)" ]] && echo "  ✅ Git" || echo "  ❌ Git"
    [[ -x "$(command -v docker)" ]] && echo "  ✅ Docker" || echo "  ❌ Docker"
    [[ -x "$(command -v kubectl)" ]] && echo "  ✅ Kubernetes" || echo "  ❌ Kubernetes"
    echo ""
    
    echo "🚀 Performance:"
    show_startup_time
    echo ""
    
    echo "⚠️  Conflicts:"
    detect_config_conflicts
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. INITIALIZATION                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Run initial diagnostics if debug mode enabled
if [[ "${DEBUG_MODE:-0}" == "1" ]]; then
    detect_config_conflicts
    check_pkg_manager_conflicts
fi

log_message "INFO" "Cleanup and conflict detection module initialized"

################################################################################
# END OF CLEANUP.MODULE.ZSH
################################################################################
