# ============================================================================
# NEXUS-NOVA ZSH INTEGRATION SNIPPET
# Copy this to your ~/.zshrc file for auto-loading
# ============================================================================

# Source Nexus-Nova system (update path to your installation directory)
if [ -f "/workspaces/terminal-zsh/nexus_nova.zsh" ]; then
  source "/workspaces/terminal-zsh/nexus_nova.zsh"
elif [ -f "$HOME/nexus-nova/nexus_nova.zsh" ]; then
  source "$HOME/nexus-nova/nexus_nova.zsh"
else
  echo "⚠️  Nexus-Nova not found. Update the path in your .zshrc"
fi

# Optional: Add custom aliases
alias nn='nexus_nova_dashboard'
alias nnhelp='nexus_nova_help'
alias nninfo='nexus_nova_info'

# END NEXUS-NOVA INTEGRATION
