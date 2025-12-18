#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                     NEXUS AI Studio - Functions                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# Make directory and cd into it
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# System status check
nexus-status() {
  echo "╔═══════════════════════════════════════════════════════════════════════╗"
  echo "║                    🚀 NEXUS AI Studio Status                          ║"
  echo "╚═══════════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "System Information:"
  echo "  Version: 1.0.0"
  echo "  Home: $NEXUS_HOME"
  echo "  Shell: $SHELL"
  echo ""
  echo "Loaded Modules:"
  [[ "$NEXUS_LOAD_ALIASES" == "true" ]] && echo "  ✅ Aliases" || echo "  ❌ Aliases"
  [[ "$NEXUS_LOAD_FUNCTIONS" == "true" ]] && echo "  ✅ Functions" || echo "  ❌ Functions"
  [[ "$NEXUS_LOAD_AI" == "true" ]] && echo "  ✅ AI Assistant" || echo "  ⚪ AI Assistant"
  [[ "$NEXUS_LOAD_MONITOR" == "true" ]] && echo "  ✅ System Monitor" || echo "  ⚪ System Monitor"
  echo ""
  echo "Performance:"
  echo "  History Size: $NEXUS_HISTORY_SIZE"
  echo "  Lazy Load: $NEXUS_LAZY_LOAD"
  echo ""
  echo "Configuration: ${NEXUS_HOME}/config/control.zsh"
  echo "Documentation: ${NEXUS_HOME}/SYSTEM_INSTRUCTIONS.md"
  echo ""
}

# Open configuration
nexus-config() {
  ${EDITOR:-vim} "${NEXUS_HOME}/config/control.zsh"
}

# Quick help
nexus-help() {
  cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════╗
║                    🚀 NEXUS AI Studio                                 ║
║              Production-Grade ZSH Configuration                       ║
╚═══════════════════════════════════════════════════════════════════════╝

Quick Commands:
  nexus-help     - Show this help
  reload         - Reload ZSH configuration
  ll             - List files with details
  mkcd <dir>     - Create and enter directory

Git Shortcuts:
  gs, ga, gc, gp, gl

Navigation:
  .., ..., ~

Configuration:
  ~/.zshrc       - Main config
  ~/.zshenv      - Environment variables
  ~/.nexus-ai/lib/ - Modular configs

EOF
}
