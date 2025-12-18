#!/bin/bash
################################################################################
#           NEXUSPRO TERMINAL SYSTEM - RESTORE & ROLLBACK UTILITY              #
#                  Recover previous shell configurations                        #
################################################################################
#
# PURPOSE: Restore backup of previous shell configurations
# USAGE: bash restore.sh [--list] [--interactive]
# STATUS: Production Ready
#
# Features:
# - List available backups
# - Interactive backup selection
# - Automated restore with verification
# - Safety checks and confirmations
#
################################################################################

set -euo pipefail

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. CONFIGURATION                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

BACKUP_DIR="${HOME}/.dotfiles.backup"
RESTORE_LOG="${HOME}/.restore.log"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. UTILITY FUNCTIONS                                                         ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$RESTORE_LOG"
}

print_error() {
    echo -e "${RED}❌${NC} $*" | tee -a "$RESTORE_LOG"
}

print_success() {
    echo -e "${GREEN}✅${NC} $*" | tee -a "$RESTORE_LOG"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $*" | tee -a "$RESTORE_LOG"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $*" | tee -a "$RESTORE_LOG"
}

show_header() {
    echo -e "${CYAN}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════════════════╗
║              NEXUSPRO Restore & Rollback Utility                           ║
║           Recover previous shell configurations                            ║
╚════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. BACKUP DISCOVERY                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

check_backup_exists() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        print_error "Backup directory not found: $BACKUP_DIR"
        log "ERROR: Backup directory not found"
        exit 1
    fi
    
    local backup_count=$(find "$BACKUP_DIR" -type f -name ".zshrc*" 2>/dev/null | wc -l)
    if (( backup_count == 0 )); then
        print_error "No backups found in: $BACKUP_DIR"
        log "ERROR: No backups found"
        exit 1
    fi
    
    print_success "Found $backup_count backup file(s)"
}

list_backups() {
    echo ""
    echo -e "${BLUE}Available Backups:${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
    echo ""
    
    local index=0
    declare -a backup_files
    
    for backup in "$BACKUP_DIR"/.zshrc*; do
        if [[ -f "$backup" ]]; then
            local filename=$(basename "$backup")
            local filesize=$(stat -f%z "$backup" 2>/dev/null || echo "unknown")
            local timestamp=${filename##*.}
            
            if [[ ${#timestamp} -eq 15 ]]; then
                local date_str=$(echo "$timestamp" | sed 's/\([0-9]\{8\}\)_\([0-9]\{6\}\)/\1 \2/')
                date_str=$(date -f "%Y%m%d %H%M%S" "$date_str" 2>/dev/null || echo "$timestamp")
            else
                date_str="unknown date"
            fi
            
            backup_files+=("$backup")
            echo "  $((index + 1)). $filename"
            echo "     Date: $date_str"
            echo "     Size: $filesize bytes"
            echo ""
            
            ((index++))
        fi
    done
    
    return 0
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. RESTORE OPERATIONS                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

restore_file() {
    local backup_file="$1"
    local target_file="$2"
    
    if [[ ! -f "$backup_file" ]]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi
    
    print_info "Restoring from: $(basename "$backup_file")"
    
    # Create backup of current file
    if [[ -f "$target_file" ]]; then
        local current_backup="${target_file}.pre-restore.$(date +%s)"
        cp "$target_file" "$current_backup"
        print_info "Current file backed up to: $(basename "$current_backup")"
    fi
    
    # Restore file
    if cp "$backup_file" "$target_file"; then
        print_success "Restored: $target_file"
        log "Restored: $target_file from $backup_file"
        return 0
    else
        print_error "Failed to restore: $target_file"
        log "ERROR: Failed to restore $target_file"
        return 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. INTERACTIVE RESTORE                                                       ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

interactive_restore() {
    echo ""
    print_info "Restoration process:"
    echo ""
    
    local index=1
    declare -a backup_files
    
    for backup in "$BACKUP_DIR"/.zshrc*; do
        if [[ -f "$backup" ]]; then
            backup_files+=("$backup")
            ((index++))
        fi
    done
    
    if (( ${#backup_files[@]} == 0 )); then
        print_error "No backup files found"
        return 1
    fi
    
    # Single backup - restore directly
    if (( ${#backup_files[@]} == 1 )); then
        print_warning "Only one backup found"
        local backup="${backup_files[0]}"
        echo ""
        echo "Backup: $(basename "$backup")"
    else
        # Multiple backups - let user choose
        echo "Multiple backups available. Select one to restore:"
        echo ""
        
        for i in "${!backup_files[@]}"; do
            local filename=$(basename "${backup_files[$i]}")
            echo "  $((i + 1)). $filename"
        done
        echo ""
        
        read -p "$(echo -e ${CYAN}Enter choice (1-${#backup_files[@]}): ${NC})" choice
        
        if ! [[ "$choice" =~ ^[0-9]+$ ]] || (( choice < 1 || choice > ${#backup_files[@]} )); then
            print_error "Invalid choice"
            return 1
        fi
        
        local backup="${backup_files[$((choice - 1))]}"
    fi
    
    # Confirm restoration
    echo ""
    echo -e "${YELLOW}This will restore your .zshrc from backup.${NC}"
    echo "Current .zshrc will be backed up first."
    echo ""
    
    read -p "$(echo -e ${CYAN}Continue with restoration? [y/N] ${NC})" -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Restoration cancelled"
        return 0
    fi
    
    # Perform restoration
    if restore_file "$backup" "$HOME/.zshrc"; then
        echo ""
        print_success "Restoration completed successfully"
        log "Restoration completed successfully"
        
        echo ""
        echo "Next steps:"
        echo "1. Restart your terminal"
        echo "2. Or reload configuration: source ~/.zshrc"
        echo ""
        
        return 0
    else
        print_error "Restoration failed"
        return 1
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. ARGUMENT PARSING                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

parse_args() {
    case "${1:-}" in
        --list)
            show_header
            check_backup_exists
            list_backups
            exit 0
            ;;
        --interactive)
            show_header
            check_backup_exists
            interactive_restore
            exit $?
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            show_header
            check_backup_exists
            interactive_restore
            exit $?
            ;;
    esac
}

show_help() {
    cat << EOF
NEXUSPRO Restore & Rollback Utility

Usage: bash restore.sh [OPTIONS]

Options:
    --list          List all available backups
    --interactive   Restore interactively (default)
    --help          Show this help message

Examples:
    bash restore.sh
    bash restore.sh --list
    bash restore.sh --interactive

EOF
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. MAIN                                                                      ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

parse_args "$@"

################################################################################
# END OF RESTORE.SH
################################################################################
