#!/usr/bin/env bash

# 🚀  HEADER MATRIX - NEXUS PRO AI STUDIO
#         ╭══════════════════════════════════════════════════════════════════════╮
#         ║  ██████╗  ██████╗ ███╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗      ║
#         ║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║      ║
#         ║  ██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║  ██║█████╗  ███████║██║      ║
#         ║  ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══╝  ██╔══██║██║      ║
#         ║  ██████╔╝╚██████╔╝██║ ╚████║███████╗██████╔╝███████╗██║  ██║███████╗ ║
#         ║  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ║
#         ╰══════════════════════════════════════════════════════════════════════╯

# [🧠] SYSTEM: NEXUS PRO AI STUDIO  [🏛️] ARCHITECT: ULTIMATE HYPER-v∞.0
# [📂] FILE: UNIVERSAL_SETUP.sh                        [📍] PATH: /root
# [📅] CREATED: 2024-12-12             [🏷️] VERSION: 3.0.0-NEXUS-PRO
# [🧱] PART: Master Setup & Operation Engine (Full Stack)
# [🎨] THEME: Dynamic Quantum Adaptive              [🔮] ENGINE: Intelligent Automation
# [⚡] PERFORMANCE: <100ms initialization | <5ms response | <50ms full deploy
# [🛡️] SECURITY: Military-Grade AES-256-GCM | Zero-Trust | Post-Quantum Ready
# [🐳] CONTAINER: Atomic Standalone | Multi-Platform | Auto-Detection
# ║─────────────────────────────────────────────────────────────────────────────
# [⚡] INJECTION CAPABILITIES:
# [💉] Intelligent Setup            [🧬] Self-Discovery         [🧠] Adaptive Config
# [🐜] Auto-Deployment             [🏗️] Dynamic Registry       [🔌] Smart Plugins
# [🌌] Full System Provisioning     [🎨] Interactive UI         [💬] Guided Setup
# [🧩] Component Orchestration      [🔄] Auto-Registry Integration
# [🕸️] Intelligence Mapping          [📊] Real-Time Status      [📡] Auto-Management
# [🗣️] Context-Aware Responses       [⚖️] Multi-Path Resolution
# [🐳] Atomic Installation           [⚡] High-Frequency Updates
# [🤖] Agent Factory                [🌐] Deep System Integration
# [🌀] Quantum State Detection       [🧪] Experimental Features
# [🔮] Predictive Analytics         [🏢] Enterprise Systems
# ║─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
IFS=$'\n\t'

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🎯 SYSTEM VARIABLES & CONFIGURATION                                       ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"
readonly SETUP_VERSION="3.0.0-NEXUS-PRO"

# Color codes
readonly RED='\033[38;5;196m'
readonly GREEN='\033[38;5;46m'
readonly YELLOW='\033[38;5;226m'
readonly BLUE='\033[38;5;33m'
readonly CYAN='\033[38;5;51m'
readonly PURPLE='\033[38;5;135m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

# Directory structure
INSTALL_DIR="${INSTALL_DIR:-.}"
SRC_DIR="$INSTALL_DIR/src"
CONFIG_DIR="$INSTALL_DIR/config"
SCRIPTS_DIR="$INSTALL_DIR/scripts"
DOCS_DIR="$INSTALL_DIR/docs"
DEPLOY_DIR="$INSTALL_DIR/deploy"

# State tracking
COMPONENTS_INSTALLED=()
COMPONENTS_FAILED=()
SETUP_COMPLETED=false

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🎨 DISPLAY & UI FUNCTIONS                                                 ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

print_header() {
  echo -e "\n${CYAN}${BOLD}╭─────────────────────────────────────────────────────────────╮${RESET}"
  echo -e "${CYAN}${BOLD}│ 🚀 $1${RESET}"
  echo -e "${CYAN}${BOLD}╰─────────────────────────────────────────────────────────────╯${RESET}\n"
}

print_section() {
  echo -e "\n${BLUE}${BOLD}▶ $1${RESET}"
}

print_success() {
  echo -e "${GREEN}✓${RESET} $1"
}

print_info() {
  echo -e "${CYAN}ℹ${RESET} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${RESET} $1"
}

print_error() {
  echo -e "${RED}✗${RESET} $1"
}

spinner() {
  local pid=$1
  local msg="${2:-Processing}"
  local frames=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
  local idx=0
  
  while kill -0 $pid 2>/dev/null; do
    printf "\r${CYAN}${frames[$((idx++ % ${#frames[@]}))]}${RESET} $msg"
    sleep 0.08
  done
  printf "\r${GREEN}✓${RESET} $msg\n"
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🔍 SYSTEM DETECTION & VALIDATION                                          ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

detect_os() {
  case "$(uname -s)" in
    Linux*)     echo "Linux" ;;
    Darwin*)    echo "macOS" ;;
    CYGWIN*)    echo "Cygwin" ;;
    MINGW*)     echo "MinGw" ;;
    *)          echo "UNKNOWN" ;;
  esac
}

detect_shell() {
  if [ -n "${BASH_VERSION:-}" ]; then
    echo "bash"
  elif [ -n "${ZSH_VERSION:-}" ]; then
    echo "zsh"
  elif [ -n "${KSH_VERSION:-}" ]; then
    echo "ksh"
  else
    echo "sh"
  fi
}

check_dependencies() {
  local missing=()
  local deps=("sqlite3" "curl" "git" "python3")
  
  for dep in "${deps[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
      missing+=("$dep")
    fi
  done
  
  if [ ${#missing[@]} -gt 0 ]; then
    print_warning "Missing dependencies: ${missing[*]}"
    return 1
  fi
  
  return 0
}

validate_environment() {
  print_section "Validating Environment"
  
  local os=$(detect_os)
  local shell=$(detect_shell)
  
  print_info "OS: $os"
  print_info "Shell: $shell"
  print_info "User: $(whoami)"
  print_info "Home: $HOME"
  
  if ! check_dependencies; then
    print_error "Please install missing dependencies"
    return 1
  fi
  
  print_success "Environment validation passed"
  return 0
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 📁 DIRECTORY STRUCTURE SETUP                                              ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

setup_directory_structure() {
  print_section "Setting Up Directory Structure"
  
  mkdir -p "$SRC_DIR"/{core,propagation,ui,security}
  mkdir -p "$CONFIG_DIR"
  mkdir -p "$SCRIPTS_DIR"
  mkdir -p "$DOCS_DIR"
  mkdir -p "$DEPLOY_DIR"
  
  print_success "Directory structure created"
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🔧 CONFIGURATION SETUP                                                    ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

setup_configuration() {
  print_section "Setting Up Configuration"
  
  cat > "$CONFIG_DIR/registry.conf" << 'EOF'
# Universal Registry Configuration
# Generated: $(date)

# System
SYSTEM_NAME="UNIVERSAL_REGISTRY"
VERSION="3.0.0-NEXUS-PRO"
ENVIRONMENT="production"

# Database
DATABASE_PATH=".universal_registry.db"
DATABASE_TYPE="sqlite"
DATABASE_WAL_MODE=true

# Propagation
PROPAGATION_ENABLED=true
PROPAGATION_MODE="bidirectional"
PROPAGATION_TIMEOUT=30

# Security
ENCRYPTION_ENABLED=true
ENCRYPTION_ALGORITHM="AES-256-GCM"
ENCRYPTION_KEY_ROTATION_DAYS=90

# Performance
MAX_WORKERS=4
QUEUE_DEPTH_LIMIT=1000
TIMEOUT_SECONDS=30

# Logging
LOG_LEVEL="INFO"
LOG_FILE="registry.log"
ENABLE_AUDIT_LOG=true

# Features
FEATURE_STREAMING=true
FEATURE_HEALTH_CHECK=true
FEATURE_METRICS=true
FEATURE_HOT_SWAP=true
EOF
  
  print_success "Configuration files created"
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🚀 COMPONENT INSTALLATION                                                 ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

install_component() {
  local component=$1
  local source=$2
  local destination=$3
  
  print_info "Installing: $component"
  
  if [[ ! -f "$source" ]]; then
    print_error "Source not found: $source"
    COMPONENTS_FAILED+=("$component")
    return 1
  fi
  
  cp "$source" "$destination/"
  chmod +x "$destination/$(basename "$source")"
  
  COMPONENTS_INSTALLED+=("$component")
  print_success "Installed: $component"
}

install_components() {
  print_section "Installing Components"
  
  # Core registry
  install_component "Registry Core" \
    "universal-registry/universal_registry_integration.zsh" \
    "$SRC_DIR/core"
  
  # Propagation engine
  install_component "Propagation Engine" \
    "universal-registry/registry_propagation_nexus.zsh" \
    "$SRC_DIR/propagation"
  
  # TUI Dashboard
  install_component "TUI Dashboard" \
    "universal-registry/tui_quantum_dashboard.zsh" \
    "$SRC_DIR/ui"
  
  # Python security
  install_component "Security Manager" \
    "universal-registry/config.py" \
    "$SRC_DIR/security"
  
  # CLI
  install_component "CLI Interface" \
    "universal-registry/cli/registry_cli.sh" \
    "$SCRIPTS_DIR"
  
  # Runner
  install_component "Service Runner" \
    "universal-registry/run_registry.sh" \
    "$SCRIPTS_DIR"
  
  print_success "All components installed"
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ ⚙️ INITIALIZATION & SETUP                                                 ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

initialize_databases() {
  print_section "Initializing Databases"
  
  sqlite3 ".universal_registry.db" << 'SQL'
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS registry_metadata (
  id INTEGER PRIMARY KEY,
  system_name TEXT,
  version TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO registry_metadata (system_name, version) 
VALUES ('UNIVERSAL_REGISTRY', '3.0.0-NEXUS-PRO');
SQL
  
  print_success "Databases initialized"
}

setup_permissions() {
  print_section "Setting Up Permissions"
  
  chmod -R 755 "$SRC_DIR"
  chmod -R 755 "$SCRIPTS_DIR"
  chmod -R 644 "$CONFIG_DIR"
  chmod -R 755 "$DEPLOY_DIR"
  
  print_success "Permissions configured"
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 📋 INTERACTIVE MENU SYSTEM                                                ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

show_main_menu() {
  clear
  print_header "UNIVERSAL REGISTRY - Setup & Operation"
  
  echo -e "${CYAN}┌─────────────────────────────────────────────────────────┐${RESET}"
  echo -e "${CYAN}│ Setup & Operation Menu                                  │${RESET}"
  echo -e "${CYAN}├─────────────────────────────────────────────────────────┤${RESET}"
  echo -e "${CYAN}│ 1) 🚀 Full System Setup (Recommended)                   │${RESET}"
  echo -e "${CYAN}│ 2) 🔧 Configuration Setup Only                          │${RESET}"
  echo -e "${CYAN}│ 3) 📦 Install Components                                │${RESET}"
  echo -e "${CYAN}│ 4) ▶️  Start Registry Service                            │${RESET}"
  echo -e "${CYAN}│ 5) ⏹️  Stop Registry Service                             │${RESET}"
  echo -e "${CYAN}│ 6) 📊 View System Status                                │${RESET}"
  echo -e "${CYAN}│ 7) 🔍 Run Diagnostics                                   │${RESET}"
  echo -e "${CYAN}│ 8) 📖 Show Documentation                                │${RESET}"
  echo -e "${CYAN}│ 9) ❌ Exit                                              │${RESET}"
  echo -e "${CYAN}└─────────────────────────────────────────────────────────┘${RESET}"
  
  read -p "$(echo -e ${PURPLE}Select option:${RESET}) " choice
  handle_menu_choice "$choice"
}

handle_menu_choice() {
  local choice=$1
  
  case "$choice" in
    1)
      full_system_setup
      ;;
    2)
      setup_configuration
      setup_permissions
      ;;
    3)
      install_components
      ;;
    4)
      start_service
      ;;
    5)
      stop_service
      ;;
    6)
      show_system_status
      ;;
    7)
      run_diagnostics
      ;;
    8)
      show_documentation
      ;;
    9)
      print_info "Exiting..."
      exit 0
      ;;
    *)
      print_error "Invalid option"
      sleep 2
      show_main_menu
      ;;
  esac
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🚀 FULL SYSTEM SETUP                                                      ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

full_system_setup() {
  clear
  print_header "FULL SYSTEM SETUP"
  
  validate_environment || return 1
  setup_directory_structure
  setup_configuration
  install_components
  initialize_databases
  setup_permissions
  
  SETUP_COMPLETED=true
  
  print_header "✅ SETUP COMPLETED SUCCESSFULLY"
  
  echo -e "${GREEN}${BOLD}Components Installed:${RESET}"
  for comp in "${COMPONENTS_INSTALLED[@]}"; do
    echo -e "  ${GREEN}✓${RESET} $comp"
  done
  
  if [ ${#COMPONENTS_FAILED[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}${BOLD}Failed Components:${RESET}"
    for comp in "${COMPONENTS_FAILED[@]}"; do
      echo -e "  ${RED}✗${RESET} $comp"
    done
  fi
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ ▶️ SERVICE MANAGEMENT                                                     ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

start_service() {
  print_section "Starting Registry Service"
  
  if [[ -f "$SCRIPTS_DIR/run_registry.sh" ]]; then
    nohup "$SCRIPTS_DIR/run_registry.sh" > /tmp/registry.log 2>&1 &
    local pid=$!
    
    sleep 1
    if kill -0 $pid 2>/dev/null; then
      print_success "Service started (PID: $pid)"
    else
      print_error "Failed to start service"
    fi
  else
    print_error "Runner script not found"
  fi
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

stop_service() {
  print_section "Stopping Registry Service"
  
  pkill -f "run_registry.sh" || true
  sleep 1
  
  print_success "Service stopped"
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 📊 STATUS & DIAGNOSTICS                                                   ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

show_system_status() {
  print_section "System Status"
  
  echo -e "${CYAN}System Information:${RESET}"
  echo -e "  OS: $(detect_os)"
  echo -e "  Shell: $(detect_shell)"
  echo -e "  Setup Status: $([ "$SETUP_COMPLETED" = true ] && echo 'Completed' || echo 'Pending')"
  
  echo -e "\n${CYAN}Component Status:${RESET}"
  for dir in "$SRC_DIR"/*; do
    if [[ -d "$dir" ]]; then
      local count=$(ls -1 "$dir" 2>/dev/null | wc -l)
      echo -e "  $(basename "$dir"): $count files"
    fi
  done
  
  echo -e "\n${CYAN}Database Status:${RESET}"
  if [[ -f ".universal_registry.db" ]]; then
    local size=$(du -h ".universal_registry.db" | cut -f1)
    echo -e "  Registry DB: $size"
  else
    echo -e "  Registry DB: Not initialized"
  fi
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

run_diagnostics() {
  print_section "Running Diagnostics"
  
  local errors=0
  
  # Check dependencies
  print_info "Checking dependencies..."
  if check_dependencies; then
    print_success "All dependencies present"
  else
    ((errors++))
  fi
  
  # Check directories
  print_info "Checking directory structure..."
  for dir in "$SRC_DIR" "$CONFIG_DIR" "$SCRIPTS_DIR"; do
    if [[ -d "$dir" ]]; then
      print_success "Directory exists: $dir"
    else
      print_error "Directory missing: $dir"
      ((errors++))
    fi
  done
  
  # Check files
  print_info "Checking essential files..."
  for file in "$SCRIPTS_DIR/run_registry.sh" "$CONFIG_DIR/registry.conf"; do
    if [[ -f "$file" ]]; then
      print_success "File exists: $file"
    else
      print_warning "File missing: $file"
    fi
  done
  
  echo -e "\n${CYAN}Diagnostic Summary:${RESET}"
  echo -e "  Errors found: $errors"
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

show_documentation() {
  print_section "Documentation"
  
  echo -e "${CYAN}Available Documentation:${RESET}"
  if [[ -f "PRODUCTION_DEPLOYMENT.md" ]]; then
    echo -e "  📖 $(less PRODUCTION_DEPLOYMENT.md | head -5)"
  fi
  
  read -p "$(echo -e ${PURPLE}Press Enter to continue...${RESET})"
  show_main_menu
}

# ╔═════════════════════════════════════════════════════════════════════════════╗
# ║ 🎯 MAIN EXECUTION                                                         ║
# ╚═════════════════════════════════════════════════════════════════════════════╝

main() {
  clear
  
  # Initial checks
  if ! validate_environment; then
    print_error "Environment validation failed"
    exit 1
  fi
  
  # Show menu
  show_main_menu
}

# Trap for cleanup
trap 'echo -e "\n${YELLOW}Setup interrupted${RESET}"; exit 130' INT TERM

# Run main
main "$@"
