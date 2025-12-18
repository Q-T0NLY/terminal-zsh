#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                 NEXUS AI Studio - Environment Variables                  ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# System
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
export EDITOR="vim"
export VISUAL="vim"

# NEXUS
export NEXUS_HOME="${HOME}/.nexus-ai"

# AI Providers
export OPENAI_API_KEY="${OPENAI_API_KEY:-}"
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
export OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
