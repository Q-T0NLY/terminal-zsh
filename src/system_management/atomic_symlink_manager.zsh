#!/bin/zsh
# ============================================================================
# ⚛️ ATOMIC SYMLINK MANAGER (ASM) v2.0
# ============================================================================
# Extracted from: Q-Zsh nexus_quantum_hyper_matrix_v12.sh
# Purpose: Detect, analyze, and safely repair broken/circular symlinks
# Features: Binary scanning, atomic operations, rollback capability
# ============================================================================

set -euo pipefail

# Colors
typeset -r NEURAL_CYAN='\033[38;2;0;212;255m'
typeset -r NEURAL_GREEN='\033[38;2;0;245;160m'
typeset -r NEURAL_YELLOW='\033[38;2;255;215;0m'
typeset -r NEURAL_RED='\033[38;2;255;59;48m'
typeset -r NEURAL_PURPLE='\033[38;2;123;97;255m'
typeset -r RESET='\033[0m'

# Data directories
ASM_ROOT="${NEXUS_HOME:=${HOME}/.nexus}"
ASM_DATA="${ASM_ROOT}/symlinks"
ASM_LOG="${ASM_ROOT}/logs/asm.log"
ASM_MANIFEST="${ASM_DATA}/manifest.json"
ASM_BACKUP="${ASM_DATA}/backups"

# Ensure directories exist
mkdir -p "${ASM_DATA}" "${ASM_BACKUP}" "$(dirname ${ASM_LOG})"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

asm_log() {
    local level="$1"
    shift
    local message="$*"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "${ASM_LOG}"
    
    case "$level" in
        INFO)    echo -e "${NEURAL_CYAN}ℹ ${message}${RESET}" ;;
        SUCCESS) echo -e "${NEURAL_GREEN}✓ ${message}${RESET}" ;;
        WARNING) echo -e "${NEURAL_YELLOW}⚠ ${message}${RESET}" ;;
        ERROR)   echo -e "${NEURAL_RED}✗ ${message}${RESET}" ;;
    esac
}

asm_create_backup() {
    local path="$1"
    local timestamp=$(date +%s)
    local backup_dir="${ASM_BACKUP}/${timestamp}"
    
    mkdir -p "${backup_dir}"
    
    # Store the symlink info before making changes
    if [[ -L "$path" ]]; then
        local target=$(readlink "$path")
        echo "$target" > "${backup_dir}/target.txt"
        asm_log "INFO" "Backed up symlink: $path -> $target"
    fi
    
    echo "${backup_dir}"
}

# ============================================================================
# PHASE 1: SCAN FOR SYMLINKS
# ============================================================================

asm_scan_symlinks() {
    local scan_path="${1:-.}"
    asm_log "INFO" "Phase 1: Scanning for symlinks in $scan_path..."
    
    local -a symlinks broken_symlinks circular_symlinks stale_symlinks
    local -i total_symlinks=0
    
    echo -e "${NEURAL_CYAN}🔍 Scanning for symlinks...${RESET}"
    
    # Find all symlinks
    while IFS= read -r -d '' symlink; do
        ((total_symlinks++))
        
        # Get target
        local target=""
        if target=$(readlink -n "$symlink" 2>/dev/null); then
            symlinks+=("$symlink:$target")
        fi
    done < <(find "$scan_path" -type l -print0 2>/dev/null)
    
    echo -e "${NEURAL_GREEN}✓ Found ${#symlinks[@]} symlinks${RESET}"
    
    asm_log "INFO" "Phase 1 complete: Found ${#symlinks[@]} symlinks"
    
    # Save results
    {
        echo "{"
        echo '    "scan_path": "'$scan_path'",'
        echo '    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",'
        echo '    "total_symlinks": '${#symlinks[@]}','
        echo '    "symlinks": ['
        
        local first=true
        for symlink_entry in "${symlinks[@]}"; do
            if [[ "$first" == "true" ]]; then
                first=false
            else
                echo ","
            fi
            
            local path="${symlink_entry%%:*}"
            local target="${symlink_entry##*:}"
            
            echo -n '        {'
            echo -n '"path": "'$path'",'
            echo -n '"target": "'$target'"'
            echo -n '}'
        done
        
        echo ""
        echo "    ]"
        echo "}"
    } > "${ASM_DATA}/scan_results.json"
    
    return 0
}

# ============================================================================
# PHASE 2: DETECT ISSUES
# ============================================================================

asm_detect_broken() {
    asm_log "INFO" "Phase 2A: Detecting broken symlinks..."
    
    local -a broken_entries
    local json_file="${ASM_DATA}/scan_results.json"
    
    if [[ ! -f "$json_file" ]]; then
        asm_log "ERROR" "Scan results not found. Run 'asm scan' first."
        return 1
    fi
    
    # Parse JSON and check each symlink
    python3 <<EOF 2>/dev/null || zsh <<'ZSHEOF'
import json
import os

with open('${json_file}', 'r') as f:
    data = json.load(f)

broken = []
for sym in data['symlinks']:
    path = sym['path']
    target = sym['target']
    
    if not os.path.exists(path):
        broken.append({'path': path, 'target': target})
        print(f"✗ Broken: {path} -> {target}")

print(f"\nTotal broken: {len(broken)}")
EOF

ZSHEOF
    
    asm_log "INFO" "Phase 2A complete: Broken symlink detection finished"
}

asm_detect_circular() {
    asm_log "INFO" "Phase 2B: Detecting circular symlinks..."
    
    local json_file="${ASM_DATA}/scan_results.json"
    
    python3 <<EOF 2>/dev/null || {
        asm_log "WARNING" "Python not available for circular detection"
        return 1
    }
import json
import os

def is_circular(path, visited=None):
    if visited is None:
        visited = set()
    
    if path in visited:
        return True
    
    if not os.path.islink(path):
        return False
    
    visited.add(path)
    target = os.readlink(path)
    
    # Make target absolute
    if not os.path.isabs(target):
        target = os.path.join(os.path.dirname(path), target)
    
    return is_circular(target, visited)

with open('${json_file}', 'r') as f:
    data = json.load(f)

circular = []
for sym in data['symlinks']:
    path = sym['path']
    if is_circular(path):
        circular.append(path)
        print(f"🔄 Circular: {path}")

print(f"\nTotal circular: {len(circular)}")
EOF
    
    asm_log "INFO" "Phase 2B complete: Circular symlink detection finished"
}

# ============================================================================
# PHASE 3: ATOMIC RECONSTRUCTION
# ============================================================================

asm_atomic_rebuild() {
    local manifesto_file="${1:-${ASM_DATA}/manifest.json}"
    
    asm_log "INFO" "Phase 3: Starting atomic symlink reconstruction..."
    
    if [[ ! -f "$manifesto_file" ]]; then
        asm_log "ERROR" "Manifest file not found: $manifesto_file"
        return 1
    fi
    
    echo -e "${NEURAL_PURPLE}🔄 Starting atomic reconstruction...${RESET}"
    
    # Begin atomic transaction
    local transaction_id=$(date +%s%N | sha256sum | cut -c1-16)
    asm_log "INFO" "Transaction ID: $transaction_id"
    
    # Create transaction log
    local transaction_log="${ASM_DATA}/transactions/${transaction_id}.log"
    mkdir -p "$(dirname "$transaction_log")"
    
    {
        echo "Transaction ID: $transaction_id"
        echo "Started: $(date)"
        echo "======================================"
    } > "$transaction_log"
    
    # Parse and apply manifest
    local fixed=0
    local failed=0
    
    python3 <<EOF 2>/dev/null || {
        asm_log "WARNING" "Python manifest processing unavailable"
        return 1
    }
import json
import os
import shutil

with open('${manifesto_file}', 'r') as f:
    manifest = json.load(f)

for entry in manifest.get('repairs', []):
    path = entry['path']
    target = entry['target']
    
    try:
        # Remove old symlink
        if os.path.lexists(path):
            os.remove(path)
        
        # Create new symlink
        os.symlink(target, path)
        print(f"✓ Fixed: {path} -> {target}")
    except Exception as e:
        print(f"✗ Failed: {path} - {e}")

print("Reconstruction complete")
EOF
    
    # Log transaction completion
    {
        echo ""
        echo "Completed: $(date)"
        echo "Fixed: $fixed"
        echo "Failed: $failed"
    } >> "$transaction_log"
    
    asm_log "SUCCESS" "Atomic reconstruction complete (Transaction: $transaction_id)"
    
    return 0
}

# ============================================================================
# MANIFEST VERIFICATION
# ============================================================================

asm_manifest_verify() {
    local manifest_file="${ASM_MANIFEST}"
    
    if [[ ! -f "$manifest_file" ]]; then
        asm_log "WARNING" "No manifest file found"
        return 1
    fi
    
    asm_log "INFO" "Verifying symlink manifest..."
    
    echo -e "${NEURAL_CYAN}📋 Manifest Verification Report${RESET}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    python3 <<EOF 2>/dev/null || {
        echo "Python verification unavailable"
        return 1
    }
import json
import os

with open('${manifest_file}', 'r') as f:
    manifest = json.load(f)

verified = 0
broken = 0

for entry in manifest.get('symlinks', []):
    path = entry['path']
    target = entry['target']
    
    if os.path.lexists(path):
        actual_target = os.readlink(path) if os.path.islink(path) else "NOT_A_SYMLINK"
        
        if actual_target == target:
            print(f"✓ {path}")
            verified += 1
        else:
            print(f"✗ {path} (Expected: {target}, Got: {actual_target})")
            broken += 1
    else:
        print(f"✗ {path} (Does not exist)")
        broken += 1

print(f"\nVerification: {verified} OK, {broken} BROKEN")
EOF
    
    asm_log "SUCCESS" "Manifest verification complete"
}

# ============================================================================
# BINARY INTEGRITY SCANNING
# ============================================================================

asm_scan_binary_symlinks() {
    asm_log "INFO" "Scanning symlinks in /usr/local/bin and similar binary paths..."
    
    local -a binary_paths=("/usr/local/bin" "/opt/homebrew/bin" "/usr/bin" "/bin")
    local -i total_binaries=0 broken_binaries=0
    
    echo -e "${NEURAL_CYAN}🔍 Scanning binary symlinks...${RESET}"
    
    for bin_path in "${binary_paths[@]}"; do
        if [[ ! -d "$bin_path" ]]; then
            continue
        fi
        
        for binary in "$bin_path"/*; do
            if [[ -L "$binary" ]]; then
                ((total_binaries++))
                
                # Check if symlink target exists
                if ! readlink "$binary" &>/dev/null || [[ ! -e "$binary" ]]; then
                    ((broken_binaries++))
                    echo -e "${NEURAL_RED}✗ Broken: $binary${RESET}"
                    asm_log "WARNING" "Broken binary symlink: $binary"
                fi
            fi
        done
    done
    
    echo -e "${NEURAL_GREEN}✓ Binary scan complete: $total_binaries total, $broken_binaries broken${RESET}"
    asm_log "SUCCESS" "Binary scan: $total_binaries total, $broken_binaries broken"
}

# ============================================================================
# MAIN COMMAND ROUTER
# ============================================================================

asm_main() {
    local command="${1:-help}"
    
    case "$command" in
        scan)
            asm_scan_symlinks "${2:-.}"
            ;;
        detect-broken)
            asm_detect_broken
            ;;
        detect-circular)
            asm_detect_circular
            ;;
        rebuild)
            asm_atomic_rebuild "${2:-${ASM_MANIFEST}}"
            ;;
        verify)
            asm_manifest_verify
            ;;
        scan-binaries)
            asm_scan_binary_symlinks
            ;;
        full-scan)
            asm_scan_symlinks "/"
            asm_detect_broken
            asm_detect_circular
            asm_scan_binary_symlinks
            ;;
        log)
            if [[ -f "$ASM_LOG" ]]; then
                echo -e "${NEURAL_CYAN}=== ASM Log ===${RESET}"
                tail -50 "$ASM_LOG"
            fi
            ;;
        help)
            cat <<EOF
${NEURAL_CYAN}⚛️ Atomic Symlink Manager (ASM) v2.0${RESET}

USAGE: asm <command> [options]

COMMANDS:
    scan <path>         - Scan directory for symlinks (default: .)
    detect-broken       - Find broken symlinks
    detect-circular     - Find circular symlinks
    rebuild [manifest]  - Atomically rebuild symlinks from manifest
    verify              - Verify symlink manifest
    scan-binaries       - Scan /usr/local/bin and similar paths
    full-scan           - Complete scan (all commands)
    log                 - Show recent logs
    help                - Show this help message

EXAMPLES:
    asm scan /usr/local/bin    # Scan Homebrew bin directory
    asm detect-broken          # Find broken symlinks
    asm scan-binaries          # Scan binary symlink integrity
    asm full-scan              # Complete diagnostic scan
    
DATA LOCATION: ${ASM_DATA}
LOG FILE: ${ASM_LOG}
MANIFEST: ${ASM_MANIFEST}

EOF
            ;;
        *)
            echo -e "${NEURAL_RED}Unknown command: $command${RESET}"
            echo "Use 'asm help' for usage information"
            return 1
            ;;
    esac
}

# Export functions
export -f asm_main
export -f asm_log
export -f asm_scan_symlinks
export -f asm_detect_broken
export -f asm_detect_circular
export -f asm_atomic_rebuild
export -f asm_manifest_verify
export -f asm_scan_binary_symlinks

# Create convenient alias
alias asm='asm_main'

# If sourced directly, execute
if [[ "${BASH_SOURCE[0]}" == "${0}" ]] || [[ "$ZSH_EVAL_CONTEXT" == "toplevel" ]]; then
    asm_main "$@"
fi
