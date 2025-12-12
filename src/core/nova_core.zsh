#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
# ████╗  ██║██╔═══██╗██║   ██║██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
# ██╔██╗ ██║██║   ██║██║   ██║███████║███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
# ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
# ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
# ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
#
# NovaSystem Core Architecture v3.0
# Production-Grade macOS Terminal Orchestration Platform
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# GLOBAL CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

export NOVA_VERSION="3.0.0"
export NOVA_ROOT="${NOVA_ROOT:-$(cd "$(dirname "${(%):-%x}")/../.." && pwd)}"
export NOVA_CONFIG_DIR="${HOME}/.config/nova"
export NOVA_DATA_DIR="${HOME}/.local/share/nova"
export NOVA_CACHE_DIR="${HOME}/.cache/nova"
export NOVA_LOG_DIR="${NOVA_DATA_DIR}/logs"
export NOVA_STATE_FILE="${NOVA_DATA_DIR}/state.json"
export NOVA_SESSION_ID="$(date +%s)-$$"

# Ensure directories exist
for dir in "$NOVA_CONFIG_DIR" "$NOVA_DATA_DIR" "$NOVA_CACHE_DIR" "$NOVA_LOG_DIR"; do
    [[ -d "$dir" ]] || mkdir -p "$dir"
done

# ═══════════════════════════════════════════════════════════════════════════
# LOGGING SYSTEM
# ═══════════════════════════════════════════════════════════════════════════

nova_log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    local log_entry="{\"timestamp\":\"$timestamp\",\"level\":\"$level\",\"session\":\"$NOVA_SESSION_ID\",\"message\":\"$message\"}"
    
    # Append to log file
    echo "$log_entry" >> "${NOVA_LOG_DIR}/nova.log"
    
    # Also output to console based on level
    case "$level" in
        ERROR|CRITICAL)
            echo "❌ [ERROR] $message" >&2
            ;;
        WARNING)
            echo "⚠️  [WARN] $message" >&2
            ;;
        INFO)
            echo "ℹ️  [INFO] $message"
            ;;
        DEBUG)
            [[ -n "${NOVA_DEBUG-}" ]] && echo "🔍 [DEBUG] $message"
            ;;
    esac
}

alias nova_error='nova_log ERROR'
alias nova_warn='nova_log WARNING'
alias nova_info='nova_log INFO'
alias nova_debug='nova_log DEBUG'

# ═══════════════════════════════════════════════════════════════════════════
# STATE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

nova_state_init() {
    if [[ ! -f "$NOVA_STATE_FILE" ]]; then
        cat > "$NOVA_STATE_FILE" <<'EOF'
{
  "version": "3.0.0",
  "initialized": false,
  "last_update": null,
  "features": {},
  "modules": {},
  "config": {}
}
EOF
        nova_info "Initialized NovaSystem state"
    fi
}

nova_state_get() {
    local key="$1"
    local default="${2:-null}"
    
    if [[ -f "$NOVA_STATE_FILE" ]]; then
        jq -r ".${key} // \"${default}\"" "$NOVA_STATE_FILE" 2>/dev/null || echo "$default"
    else
        echo "$default"
    fi
}

nova_state_set() {
    local key="$1"
    local value="$2"
    
    if [[ ! -f "$NOVA_STATE_FILE" ]]; then
        nova_state_init
    fi
    
    local tmp_file="${NOVA_STATE_FILE}.tmp"
    jq ".${key} = ${value}" "$NOVA_STATE_FILE" > "$tmp_file" && mv "$tmp_file" "$NOVA_STATE_FILE"
    nova_debug "State updated: $key = $value"
}

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

nova_config_load() {
    local config_file="${NOVA_CONFIG_DIR}/nova.conf"
    
    if [[ -f "$config_file" ]]; then
        source "$config_file"
        nova_debug "Configuration loaded from $config_file"
    else
        nova_warn "Configuration file not found, using defaults"
        nova_config_create_default
    fi
}

nova_config_create_default() {
    local config_file="${NOVA_CONFIG_DIR}/nova.conf"
    
    cat > "$config_file" <<'EOF'
# NovaSystem Configuration v3.0

# Feature Toggles
NOVA_ENABLE_MONITORING=true
NOVA_ENABLE_SECURITY=true
NOVA_ENABLE_BACKUPS=true
NOVA_ENABLE_ANALYTICS=false

# Performance Settings
NOVA_MAX_PARALLEL_JOBS=4
NOVA_CACHE_TTL=3600
NOVA_LOG_RETENTION_DAYS=30

# Security Settings
NOVA_ENABLE_AUDIT_LOG=true
NOVA_REQUIRE_SUDO_CONFIRM=true
NOVA_ENCRYPT_BACKUPS=true

# UI Settings
NOVA_COLOR_SCHEME="quantum"
NOVA_SHOW_NOTIFICATIONS=true
NOVA_PROGRESS_STYLE="modern"

# Integration Settings
NOVA_HOMEBREW_AUTO_UPDATE=true
NOVA_GIT_AUTO_FETCH=false
NOVA_DOCKER_AUTO_PRUNE=false
EOF

    nova_info "Created default configuration at $config_file"
}

# ═══════════════════════════════════════════════════════════════════════════
# DEPENDENCY MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

nova_check_dependencies() {
    local required_deps=(jq sqlite3 curl git)
    local missing_deps=()
    
    for dep in "${required_deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        nova_error "Missing required dependencies: ${missing_deps[*]}"
        nova_info "Install with: brew install ${missing_deps[*]}"
        return 1
    fi
    
    nova_debug "All required dependencies present"
    return 0
}

nova_install_optional_deps() {
    local optional_deps=(figlet lolcat fzf bat exa)
    local installed=0
    
    for dep in "${optional_deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            nova_info "Installing optional dependency: $dep"
            brew install "$dep" &> /dev/null && ((installed++))
        fi
    done
    
    [[ $installed -gt 0 ]] && nova_info "Installed $installed optional dependencies"
}

# ═══════════════════════════════════════════════════════════════════════════
# MODULE SYSTEM
# ═══════════════════════════════════════════════════════════════════════════

typeset -A NOVA_MODULES
NOVA_MODULES=()

nova_module_register() {
    local module_name="$1"
    local module_path="$2"
    local module_init="${3:-${module_name}_init}"
    
    NOVA_MODULES[$module_name]="$module_path:$module_init"
    nova_debug "Registered module: $module_name"
}

nova_module_load() {
    local module_name="$1"
    
    if [[ -z "${NOVA_MODULES[$module_name]}" ]]; then
        nova_error "Module not registered: $module_name"
        return 1
    fi
    
    local module_info="${NOVA_MODULES[$module_name]}"
    local module_path="${module_info%%:*}"
    local module_init="${module_info##*:}"
    
    if [[ ! -f "$module_path" ]]; then
        nova_error "Module file not found: $module_path"
        return 1
    fi
    
    source "$module_path"
    
    # Call initialization function if it exists
    if typeset -f "$module_init" > /dev/null; then
        "$module_init"
        nova_info "Loaded module: $module_name"
    else
        nova_warn "Module $module_name has no init function: $module_init"
    fi
}

nova_module_load_all() {
    local modules_dir="${NOVA_ROOT}/src/modules"
    
    if [[ ! -d "$modules_dir" ]]; then
        nova_warn "Modules directory not found: $modules_dir"
        return 1
    fi
    
    for module_file in "$modules_dir"/*.zsh; do
        [[ -f "$module_file" ]] || continue
        
        local module_name=$(basename "$module_file" .zsh)
        nova_module_register "$module_name" "$module_file" "${module_name}_init"
        nova_module_load "$module_name"
    done
}

# ═══════════════════════════════════════════════════════════════════════════
# ERROR HANDLING & RECOVERY
# ═══════════════════════════════════════════════════════════════════════════

nova_error_handler() {
    local exit_code=$?
    local line_no=$1
    local command="$2"
    
    nova_error "Command failed with exit code $exit_code at line $line_no: $command"
    
    # Save error to state for debugging
    nova_state_set "last_error" "{\"code\":$exit_code,\"line\":$line_no,\"command\":\"$command\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
    
    # Optional: Trigger rollback if in transaction
    [[ -n "$NOVA_IN_TRANSACTION" ]] && nova_transaction_rollback
    
    return $exit_code
}

# Trap errors for debugging
# Enable robust error handling and traps (zsh-safe)
setopt ERR_EXIT
setopt ERR_RETURN
trap 'nova_error_handler ${LINENO} "$0"' ERR

# Safe command wrapper
nova_safe_run() {
    local cmd="$1"
    shift
    if ! eval "$cmd" "$@"; then
        nova_error "Command failed: $cmd $@"
        return 1
    fi
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════
# TRANSACTION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════

NOVA_TRANSACTION_LOG="${NOVA_DATA_DIR}/transaction.log"
NOVA_IN_TRANSACTION=""

nova_transaction_begin() {
    local transaction_id="txn-$(date +%s)-$$"
    export NOVA_IN_TRANSACTION="$transaction_id"
    
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] BEGIN $transaction_id" >> "$NOVA_TRANSACTION_LOG"
    nova_debug "Transaction started: $transaction_id"
}

nova_transaction_commit() {
    if [[ -z "$NOVA_IN_TRANSACTION" ]]; then
        nova_warn "No active transaction to commit"
        return 1
    fi
    
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] COMMIT $NOVA_IN_TRANSACTION" >> "$NOVA_TRANSACTION_LOG"
    nova_debug "Transaction committed: $NOVA_IN_TRANSACTION"
    
    unset NOVA_IN_TRANSACTION
}

nova_transaction_rollback() {
    if [[ -z "$NOVA_IN_TRANSACTION" ]]; then
        nova_warn "No active transaction to rollback"
        return 1
    fi
    
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ROLLBACK $NOVA_IN_TRANSACTION" >> "$NOVA_TRANSACTION_LOG"
    nova_error "Transaction rolled back: $NOVA_IN_TRANSACTION"
    
    # Implement actual rollback logic based on transaction log
    # This is a placeholder for future implementation
    
    unset NOVA_IN_TRANSACTION
}

# ═══════════════════════════════════════════════════════════════════════════
# SYSTEM INFORMATION
# ═══════════════════════════════════════════════════════════════════════════

nova_system_info() {
    local os_version=$(sw_vers -productVersion)
    local os_build=$(sw_vers -buildVersion)
    local machine_model=$(sysctl -n hw.model)
    local cpu_brand=$(sysctl -n machdep.cpu.brand_string)
    local total_ram=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024/1024)}')
    
    # Check visual capabilities
    local visuals_status="Disabled"
    nova_check_visuals_engine && visuals_status="✓ Active"
    
    cat <<EOF
╔═══════════════════════════════════════════════════════════════════╗
║                 Nexus-Nova System v${NOVA_VERSION}                     ║
╠═══════════════════════════════════════════════════════════════════╣
║ macOS: $os_version (Build $os_build)
║ Model: $machine_model
║ CPU: $cpu_brand
║ RAM: ${total_ram}GB
║ Quantum Visuals: $visuals_status
╚═══════════════════════════════════════════════════════════════════╝
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

nova_init() {
    nova_info "Initializing NovaSystem v${NOVA_VERSION}"
    
    # Initialize state
    nova_state_init
    
    # Load configuration
    nova_config_load
    
    # Check dependencies
    if ! nova_check_dependencies; then
        nova_error "Dependency check failed. Please install missing dependencies."
        return 1
    fi
    
    # Load all modules
    nova_module_load_all
    
    # Mark as initialized
    nova_state_set "initialized" "true"
    nova_state_set "last_update" "\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""
    
    nova_info "NovaSystem initialized successfully"
}

# ═══════════════════════════════════════════════════════════════════════════
# NEXUS VISUAL INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════

# Python backend path
export NEXUS_VISUALS_ENGINE="${NOVA_ROOT}/nexus_visuals.py"

# Check if visual engine is available
nova_check_visuals_engine() {
    if [[ -f "$NEXUS_VISUALS_ENGINE" ]] && command -v python3 &> /dev/null; then
        return 0
    fi
    return 1
}

# Gradient text using Nexus engine
nexus_gradient_text() {
    local text="$1"
    local gradient="${2:-rainbow}"
    
    if nova_check_visuals_engine; then
        python3 -c "from nexus_visuals import QuantumColorEngine; engine = QuantumColorEngine(); print(engine.gradient_text('$text', '$gradient'))" 2>/dev/null || echo "$text"
    else
        echo "$text"
    fi
}

# Progress bar using Nexus engine
nexus_progress_bar() {
    local percent="$1"
    local width="${2:-40}"
    local style="${3:-modern}"
    
    if nova_check_visuals_engine; then
        python3 -c "from nexus_visuals import QuantumColorEngine; engine = QuantumColorEngine(); print(engine.create_progress_bar($percent, $width, '$style'))" 2>/dev/null || echo "[$percent%]"
    else
        echo "[$percent%]"
    fi
}

# 3D Cube rendering
nexus_render_3d_cube() {
    local rotation_x="${1:-0}"
    local rotation_y="${2:-0}"
    local rotation_z="${3:-0}"
    
    if nova_check_visuals_engine; then
        python3 "$NEXUS_VISUALS_ENGINE" --cube --rotation "$rotation_x,$rotation_y,$rotation_z" 2>/dev/null
    else
        echo "3D rendering requires Python backend"
    fi
}

# Export functions for global use
# Functions are available in the current shell when sourced; no explicit export needed in zsh

# ═══════════════════════════════════════════════════════════════════════════
# 3D WIREFRAME ARCHITECTURE VISUALIZATION
# ═══════════════════════════════════════════════════════════════════════════

cat >&2 <<'WIREFRAME'
                      ┌──────────────────────────────┐
                      │   NovaSystem Architecture    │
                      └────────────┬─────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
         │  Core   │         │ Modules │         │   API   │
         │ Engine  │◄────────┤ System  │────────►│ Gateway │
         └────┬────┘         └────┬────┘         └────┬────┘
              │                   │                    │
    ┌─────────┼─────────┐    ┌───┼───┐         ┌─────┼─────┐
    │         │         │    │   │   │         │     │     │
┌───▼──┐  ┌──▼───┐ ┌───▼─┐ ┌▼───▼┐ ┌▼───┐  ┌──▼──┐ ┌▼────┐
│State │  │Config│ │Logs │ │ Mods│ │Mods│  │ REST│ │WebSk│
│  DB  │  │ Mgr  │ │  &  │ │  A  │ │  B │  │ API │ │  et │
└──────┘  └──────┘ └─────┘ └─────┘ └────┘  └─────┘ └─────┘
WIREFRAME

# Auto-initialize if sourced, unless explicitly skipped (zsh-safe)
if [[ "${(%):-%x}" != "${0}" ]]; then
    if [[ -z "${NOVA_SKIP_INIT:-}" ]]; then
        nova_init
    fi
fi
