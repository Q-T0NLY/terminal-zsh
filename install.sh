#!/bin/bash
################################################################################
#                    NEXUSPRO TERMINAL SYSTEM INSTALLER                        #
#          Automated installation with error recovery and validation           #
################################################################################
#
# PURPOSE: Automated installer for the NEXUSPRO Terminal System
# USAGE: bash install.sh [--skip-backup] [--force]
# STATUS: Production Ready
#
# Features:
# - Automatic dependency detection
# - System backup creation
# - Error recovery with rollback
# - Configuration validation
# - Step-by-step installation logging
#
################################################################################

set -euo pipefail

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. CONFIGURATION                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_LOG="${SCRIPT_DIR}/install.log"
BACKUP_DIR="${HOME}/.dotfiles.backup"
NEXUSPRO_ROOT="${HOME}/.nexuspro"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Flags
SKIP_BACKUP=0
FORCE_INSTALL=0

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. UTILITY FUNCTIONS                                                         ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

log() {
    local level="$1"
    shift
    local message="$*"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a "$INSTALL_LOG"
}

print_status() {
    echo -e "${BLUE}➜${NC} $*"
    log "INFO" "$*"
}

print_success() {
    echo -e "${GREEN}✅${NC} $*"
    log "INFO" "$*"
}

print_error() {
    echo -e "${RED}❌${NC} $*"
    log "ERROR" "$*"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $*"
    log "WARN" "$*"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. ARGUMENT PARSING                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --skip-backup)
                SKIP_BACKUP=1
                shift
                ;;
            --force)
                FORCE_INSTALL=1
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    cat << EOF
NEXUSPRO Terminal System Installer

Usage: bash install.sh [OPTIONS]

Options:
    --skip-backup     Skip creating backup of existing dotfiles
    --force           Force installation even if NEXUSPRO already exists
    --help            Show this help message

Example:
    bash install.sh
    bash install.sh --skip-backup --force

EOF
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. SYSTEM CHECKS                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

check_requirements() {
    print_status "Checking system requirements..."
    
    local missing=()
    
    # Check OS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_error "This installer is designed for macOS only"
        exit 1
    fi
    
    # Check critical tools
    for tool in zsh git curl; do
        if ! command -v "$tool" &>/dev/null; then
            missing+=("$tool")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        print_error "Missing critical tools: ${missing[*]}"
        exit 1
    fi
    
    print_success "All requirements met"
}

check_shell() {
    print_status "Checking default shell..."
    
    if [[ "$SHELL" != *"/zsh" ]]; then
        print_warning "Default shell is not zsh"
        echo -e "${BLUE}To use NEXUSPRO Terminal System, zsh must be your default shell${NC}"
        echo "Run: chsh -s /bin/zsh"
        read -p "Change default shell to zsh? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            chsh -s /bin/zsh
            print_success "Default shell changed to zsh"
        fi
    else
        print_success "Default shell is zsh"
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. BACKUP SYSTEM                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

create_backup() {
    if [[ $SKIP_BACKUP -eq 1 ]]; then
        print_warning "Skipping backup as requested"
        return 0
    fi
    
    print_status "Creating backup of existing dotfiles..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup existing shell configurations
    local files_to_backup=( ".zshrc" ".zsh_profile" ".zshenv" ".zsh_history" )
    
    for file in "${files_to_backup[@]}"; do
        if [[ -f "$HOME/$file" ]]; then
            cp "$HOME/$file" "$BACKUP_DIR/${file}.${TIMESTAMP}"
            print_success "Backed up: $file"
        fi
    done
    
    print_success "Backup created in: $BACKUP_DIR"
}

restore_backup() {
    print_status "Restoring backup..."
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        print_error "No backup found"
        return 1
    fi
    
    for file in "$BACKUP_DIR"/*.* ; do
        local basename=$(basename "$file" | sed 's/\.[0-9]*$//')
        cp "$file" "$HOME/$basename"
    done
    
    print_success "Backup restored"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. INSTALLATION                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

setup_directories() {
    print_status "Setting up directories..."
    
    mkdir -p "$NEXUSPRO_ROOT"/{config,modules,backups,cache,logs}
    
    print_success "Directories created"
}

install_modules() {
    print_status "Installing modules..."
    
    # Copy modules from script directory
    if [[ -d "${SCRIPT_DIR}/modules" ]]; then
        cp "${SCRIPT_DIR}/modules"/*.module.zsh "$NEXUSPRO_ROOT/modules/" 2>/dev/null || true
        print_success "Modules installed"
    else
        print_warning "Modules directory not found"
    fi
}

configure_zshrc() {
    print_status "Configuring .zshrc..."
    
    # Create new .zshrc that sources NEXUSPRO system
    cat > "$HOME/.zshrc" << 'EOF'
# NEXUSPRO Terminal System Configuration
# Auto-generated - Do not edit directly

# Source the main NEXUSPRO configuration
if [[ -f "${HOME}/.nexuspro/zshrc.main" ]]; then
    source "${HOME}/.nexuspro/zshrc.main"
fi
EOF

    # Copy main zshrc to NEXUSPRO
    if [[ -f "${SCRIPT_DIR}/zshrc.main" ]]; then
        cp "${SCRIPT_DIR}/zshrc.main" "$NEXUSPRO_ROOT/"
    fi
    
    print_success ".zshrc configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. VALIDATION                                                                ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

validate_installation() {
    print_status "Validating installation..."
    
    local checks_passed=0
    local checks_failed=0
    
    # Check directories
    if [[ -d "$NEXUSPRO_ROOT" ]]; then
        ((checks_passed++))
        print_success "NEXUSPRO directory exists"
    else
        ((checks_failed++))
        print_error "NEXUSPRO directory not found"
    fi
    
    # Check modules
    local module_count=$(ls "$NEXUSPRO_ROOT/modules"/*.module.zsh 2>/dev/null | wc -l)
    if (( module_count > 0 )); then
        ((checks_passed++))
        print_success "Found $module_count modules"
    else
        ((checks_failed++))
        print_error "No modules found"
    fi
    
    # Check .zshrc
    if [[ -f "$HOME/.zshrc" ]]; then
        ((checks_passed++))
        print_success ".zshrc created"
    else
        ((checks_failed++))
        print_error ".zshrc not found"
    fi
    
    echo ""
    print_status "Validation Results: $checks_passed passed, $checks_failed failed"
    
    if (( checks_failed > 0 )); then
        return 1
    fi
    
    return 0
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 8. MAIN INSTALLATION FLOW                                                    ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

main() {
    echo -e "${BLUE}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════════════════╗
║                NEXUSPRO Terminal System Installer                          ║
║               Ultra-Modern macOS Terminal Configuration                    ║
╚════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Parse arguments
    parse_args "$@"
    
    # Initialize log
    {
        log "INFO" "Installation started at $(date)"
        log "INFO" "OS: $(uname -s) $(uname -r)"
        log "INFO" "Home: $HOME"
        log "INFO" "Shell: $SHELL"
    } 2>/dev/null
    
    # Run installation steps
    check_requirements
    check_shell
    create_backup
    setup_directories
    install_modules
    configure_zshrc
    
    # Validate
    if validate_installation; then
        echo ""
        echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ NEXUSPRO Terminal System installed successfully!${NC}"
        echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Restart your terminal or run: source ~/.zshrc"
        echo "2. Type 'system_diagnostics' to verify installation"
        echo "3. Explore available commands and functions"
        echo ""
        log "INFO" "Installation completed successfully"
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Installation validation failed${NC}"
        log "ERROR" "Installation validation failed"
        
        read -p "Restore from backup? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            restore_backup
        fi
        
        exit 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 9. ERROR HANDLING                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

cleanup_on_error() {
    print_error "Installation failed. Check $INSTALL_LOG for details."
    print_warning "You can restore your backup by running: bash restore.sh"
}

trap cleanup_on_error ERR

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 10. EXECUTION                                                                ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

main "$@"

################################################################################
# END OF INSTALL.SH
################################################################################
