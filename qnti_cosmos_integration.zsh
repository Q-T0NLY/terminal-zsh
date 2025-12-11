#!/usr/bin/env zsh
################################################################################
# ╭══════════════════════════════════════════════════════════════════════╮
# ║  ██████╗  ██████╗ ███╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗      ║
# ║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║      ║
# ║  ██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║  ██║█████╗  ███████║██║      ║
# ║  ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══╝  ██╔══██║██║      ║
# ║  ██████╔╝╚██████╔╝██║ ╚████║███████╗██████╔╝███████╗██║  ██║███████╗ ║
# ║  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ║
# ╰══════════════════════════════════════════════════════════════════════╯
#
# QNTI / COSMOS INTEGRATION WRAPPER
# Purpose: unify/bridge the existing Nexus/Nova/Cosmos scripts into one
# launcher and validation harness. This file does not duplicate large
# implementations — it orchestrates and validates existing modules,
# provides a unified menu and documents any missing pieces.
#
# Usage: source qnti_cosmos_integration.zsh && qnti_menu
#
################################################################################

set -euo pipefail

# Prefer workspace-local nexus merged script if present
if [[ -f "${PWD}/nexus_merged.zsh" ]]; then
  source "${PWD}/nexus_merged.zsh"
fi

# Create a small helper to test function availability
function _qnti_has() {
  local name=$1
  type -w "$name" &>/dev/null
}

# Feature validation: scans a list of expected functions and reports
function qnti_validate_features() {
  emulate -L zsh
  local -a expected=(
    nexus_menu
    quantum_menu
    cosmos_menu
    nexus_discover_services
    nexus_propagate_alert
    nexus_reconstruct_path_quantum
    nexus_execute_clean_slate
    init_hyper_registry
    quantum_path_reconstruction
    atomic_symlink_reconstruction
    render_cosmos_header
    telemetry_dashboard
  )

  local missing=0
  printf "\nQNTI Feature Validation:\n"
  for fn in $expected; do
    if _qnti_has "$fn"; then
      printf "  [OK] %s\n" "$fn"
    else
      printf "  [MISSING] %s\n" "$fn"
      missing=$((missing+1))
    fi
  done

  if [[ $missing -gt 0 ]]; then
    printf "\nWarning: %d feature(s) missing. See README for integration notes.\n" "$missing"
  else
    printf "\nAll expected features present.\n"
  fi
}

# Unified quick launcher that chooses the best available menu
function qnti_menu() {
  # prefer the richest available menu in order: cosmos_menu, nexus_menu, quantum_menu, nova_menu
  if _qnti_has cosmos_menu; then
    cosmos_menu
    return
  fi
  if _qnti_has nexus_menu; then
    nexus_menu
    return
  fi
  if _qnti_has quantum_menu; then
    quantum_menu
    return
  fi
  if _qnti_has nova_menu; then
    nova_menu
    return
  fi

  # Fallback simple menu
  qnti_fallback_menu
}

function qnti_fallback_menu() {
  clear
  cat <<'EOF'
QNTI Integrated Menu - Fallback

1) Validate features
2) Show README
3) Launch nexus_menu (if available)
4) Launch cosmos_menu (if available)
q) Quit
EOF
  while true; do
    printf "Choose: "; read -r c
    case $c in
      1) qnti_validate_features ;;
      2) less README_MERGED.md ;;
      3) if _qnti_has nexus_menu; then nexus_menu; else printf "nexus_menu not available\n"; fi ;;
      4) if _qnti_has cosmos_menu; then cosmos_menu; else printf "cosmos_menu not available\n"; fi ;;
      q) return ;;
      *) printf "Invalid\n" ;;
    esac
  done
}

# Utility: register integration metadata for documentation
function qnti_write_integration_manifest() {
  local manifest="${PWD}/QNTI_INTEGRATION_MANIFEST.txt"
  cat > "$manifest" <<EOF
QNTI / COSMOS Integration Manifest
Generated: $(date -u)

Sourced modules:
  - nexus_merged.zsh (if present)
  - deploy_nexuspro.sh (deployment helper, not sourced)

Validation: Run qnti_validate_features to list expected function availability.

Usage: source qnti_cosmos_integration.zsh && qnti_menu

EOF
  printf "Integration manifest written: %s\n" "$manifest"
}

# Write manifest on load for visibility
qnti_write_integration_manifest

export QNTI_INTEGRATION_LOADED=1

printf "QNTI Integration loaded. Run 'qnti_menu' to start.\n"
