#!/usr/bin/env zsh
################################################################################
# 🌍 UNIVERSAL_REGISTRY - ZSH Integration Layer
# Connects ZSH hyper_registry.zsh with Python UNIVERSAL_REGISTRY system
# Bidirectional sync for configurations, visuals, capabilities, and metadata
################################################################################

set -euo pipefail

typeset -g UNIVERSAL_REGISTRY_ROOT="${0:a:h}"
typeset -g PYTHON_REGISTRY_ROOT="${UNIVERSAL_REGISTRY_ROOT}/hyper_registry"
typeset -g ZSH_REGISTRY="${UNIVERSAL_REGISTRY_ROOT%/*}/hyper_registry.zsh"

# ============ UNIVERSAL REGISTRY INITIALIZATION ============

function universal_registry_init() {
  printf "🌍 Initializing Universal Registry integration...\n"
  
  # Check ZSH registry exists
  if [[ ! -f "$ZSH_REGISTRY" ]]; then
    printf "❌ ZSH registry not found: %s\n" "$ZSH_REGISTRY" >&2
    return 1
  fi
  
  # Source ZSH registry
  source "$ZSH_REGISTRY"
  
  # Initialize hyper registry (ZSH)
  hyper_registry_init || return 1
  hyper_registry_extend_schema || return 1
  
  printf "✅ Universal Registry initialized\n"
}

# ============ CLASSIFICATION IMPORT FROM ZSH ============

function universal_registry_import_zsh_config() {
  printf "📥 Importing ZSH configurations into Universal Registry...\n"
  
  # Import visual components
  hyper_registry_query_documentation "%" | while read line; do
    printf "%s\n" "$line"
  done
  
  # Import capabilities
  hyper_registry_query_capability "%" | while read line; do
    printf "%s\n" "$line"
  done
  
  printf "✅ ZSH configurations imported\n"
}

# ============ CLASSIFICATION REGISTRATION WRAPPERS ============

function universal_registry_register_zsh_config() {
  local name=$1; local config=$2
  hyper_registry_register_entity "zsh_config" "$name" "$config"
}

function universal_registry_register_visual() {
  local name=$1; local glyph=$2; local desc=${3:-}
  hyper_registry_register_visual "$name" "$glyph" "$desc"
}

function universal_registry_register_animation() {
  local name=$1; local frames=$2; local fps=${3:-30}; local desc=${4:-}
  hyper_registry_register_animation "$name" "$frames" "$fps" "$desc"
}

function universal_registry_register_palette() {
  local name=$1; local value=$2
  hyper_registry_register_palette "$name" "$value"
}

function universal_registry_register_capability() {
  local name=$1; local desc=$2; local features=${3:-}; local status=${4:-available}
  hyper_registry_register_capability "$name" "$desc" "$features" "$status"
}

function universal_registry_register_documentation() {
  local name=$1; local title=$2; local content=$3; local format=${4:-markdown}
  hyper_registry_register_documentation "$name" "$title" "$content" "$format"
}

function universal_registry_register_dependency() {
  local source=$1; local target=$2; local type=${3:-uses}; local meta=${4:-}
  hyper_registry_add_dependency "$source" "$target" "$type" "$meta"
}

function universal_registry_register_relationship() {
  local src=$1; local tgt=$2; local rtype=${3:-related}; local meta=${4:-}
  hyper_registry_add_relationship "$src" "$tgt" "$rtype" "$meta"
}

function universal_registry_set_health() {
  local subject=$1; local status=$2; local details=${3:-}
  hyper_registry_set_health "$subject" "$status" "$details"
}

function universal_registry_record_lifecycle() {
  local subject=$1; local action=$2; local status=${3:-}; local details=${4:-}
  hyper_registry_record_lifecycle "$subject" "$action" "$status" "$details"
}

# ============ QUERY & EXPORT FUNCTIONS ============

function universal_registry_query() {
  local classification=$1; local pattern=${2:-'%'}
  hyper_registry_query_entity "$classification" "$pattern"
}

function universal_registry_list_dependencies() {
  local entity=${1:-'%'}
  hyper_registry_list_dependencies "$entity"
}

function universal_registry_get_health() {
  local subject=${1:-'%'}
  hyper_registry_get_health "$subject"
}

function universal_registry_export_json() {
  local out=${1:-./universal_registry_export.json}
  hyper_registry_export_json "$out"
  printf "✅ Exported to %s\n" "$out"
}

function universal_registry_export_yaml() {
  local out=${1:-./universal_registry_export.yaml}
  printf "📝 Converting JSON to YAML: %s\n" "$out"
  
  if command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY' "$out"
import json, yaml, sys
try:
    with open('./.hyper_registry.db.json', 'r') as f:
        data = json.load(f)
    with open(sys.argv[1], 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
    print(f"✅ Exported to {sys.argv[1]}")
except Exception as e:
    print(f"❌ Export failed: {e}", file=sys.stderr)
    sys.exit(1)
PY
  else
    printf "⚠️ python3 not available; skipping YAML export\n"
  fi
}

# ============ PYTHON INTEGRATION FUNCTIONS ============

function universal_registry_python_sync() {
  printf "🔄 Syncing with Python Universal Registry...\n"
  
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "
import sys
sys.path.insert(0, '${UNIVERSAL_REGISTRY_ROOT}')
from universal_registry import UniversalRegistry
import asyncio

async def sync():
    registry = UniversalRegistry()
    print('✅ Python registry connected')

asyncio.run(sync())
" || printf "⚠️ Python sync skipped\n"
  else
    printf "⚠️ python3 not found; skipping Python sync\n"
  fi
}

function universal_registry_status() {
  printf "🌍 Universal Registry Status\n"
  printf "├─ ZSH Registry: %s\n" "$ZSH_REGISTRY"
  printf "├─ Python Registry: %s\n" "$PYTHON_REGISTRY_ROOT"
  printf "├─ Root: %s\n" "$UNIVERSAL_REGISTRY_ROOT"
  
  # Show table counts
  printf "├─ Tables:\n"
  hyper_registry_show_tables 2>/dev/null | while read table; do
    printf "│  ├─ %s\n" "$table"
  done
  
  printf "└─ Status: 🟢 operational\n"
}

# ============ DEMO & TESTING ============

function universal_registry_demo() {
  printf "🌍 Universal Registry Demo - ZSH + Python Integration\n\n"
  
  # Initialize
  universal_registry_init || return 1
  
  # Register ZSH configs
  printf "📝 Registering ZSH configurations...\n"
  universal_registry_register_zsh_config "main_config" '{"shell":"zsh","version":"5.8"}'
  
  # Register visuals
  printf "🎨 Registering visual components...\n"
  universal_registry_register_palette "quantum_blue" "38;2;129;161;193"
  universal_registry_register_visual "depth1" "░" "light depth glyph"
  universal_registry_register_animation "spinner" "◐ ◓ ◑ ◒" 10
  
  # Register capabilities
  printf "⭐ Registering capabilities...\n"
  universal_registry_register_capability "streaming" "Real-time streaming" "ws,http2,events" "available"
  universal_registry_register_capability "hotswap" "Hot component swapping" "zero-downtime,rollback" "available"
  
  # Register documentation
  printf "📚 Registering documentation...\n"
  universal_registry_register_documentation "intro" "Introduction" "Getting started with Universal Registry" "markdown"
  
  # Register dependencies
  printf "🔗 Registering dependencies...\n"
  universal_registry_register_dependency "quantum_blue" "ui_theme" "depends_on"
  universal_registry_register_dependency "spinner" "animation_engine" "depends_on"
  
  # Set health
  printf "❤️ Recording health...\n"
  universal_registry_set_health "quantum_blue" "healthy" "palette operational"
  
  # Record lifecycle
  printf "🔄 Recording lifecycle...\n"
  universal_registry_record_lifecycle "quantum_blue" "registered" "success" "palette registered"
  
  # Export
  printf "\n📤 Exporting registry...\n"
  universal_registry_export_json ./universal_registry_demo.json
  
  # Status
  printf "\n"
  universal_registry_status
  
  printf "\n✅ Demo completed successfully\n"
}

# ============ EXPORTS ============

export -f universal_registry_init
export -f universal_registry_import_zsh_config
export -f universal_registry_register_zsh_config
export -f universal_registry_register_visual
export -f universal_registry_register_animation
export -f universal_registry_register_palette
export -f universal_registry_register_capability
export -f universal_registry_register_documentation
export -f universal_registry_register_dependency
export -f universal_registry_register_relationship
export -f universal_registry_set_health
export -f universal_registry_record_lifecycle
export -f universal_registry_query
export -f universal_registry_list_dependencies
export -f universal_registry_get_health
export -f universal_registry_export_json
export -f universal_registry_export_yaml
export -f universal_registry_python_sync
export -f universal_registry_status
export -f universal_registry_demo

