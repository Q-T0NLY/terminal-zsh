#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                   NEXUS AI Studio - System Control                        ║
# ║                  Configuration & Feature Management                       ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🎛️  FEATURE CONTROL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Core modules (always enabled)
export NEXUS_LOAD_ALIASES=true
export NEXUS_LOAD_FUNCTIONS=true

# Optional modules (set to true/false to enable/disable)
export NEXUS_LOAD_AI=false          # AI assistant integration
export NEXUS_LOAD_MONITOR=false     # System monitoring
export NEXUS_LOAD_WELCOME=false     # Welcome message
export NEXUS_LOAD_GIT_PROMPT=false  # Enhanced git prompt

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ⚡ PERFORMANCE SETTINGS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# History configuration
export NEXUS_HISTORY_SIZE=50000
export NEXUS_HISTORY_SAVE=50000

# Completion settings
export NEXUS_LAZY_LOAD=true
export NEXUS_COMPLETION_CACHE=true

# Startup optimization
export NEXUS_INSTANT_PROMPT=false   # Requires Powerlevel10k
export NEXUS_SKIP_GLOBAL_COMPINIT=true

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🤖 AI PROVIDER SETTINGS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Primary AI provider (claude, openai, ollama)
export NEXUS_AI_PRIMARY="claude"

# Enable/disable individual providers
export NEXUS_AI_CLAUDE=true
export NEXUS_AI_OPENAI=false
export NEXUS_AI_OLLAMA=false

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🎨 THEME & APPEARANCE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Color scheme (auto, light, dark)
export NEXUS_COLOR_SCHEME="auto"

# Prompt style (simple, minimal, full)
export NEXUS_PROMPT_STYLE="simple"

# Show git status in prompt
export NEXUS_SHOW_GIT=true

# Show execution time for long commands
export NEXUS_SHOW_EXEC_TIME=true
export NEXUS_EXEC_TIME_THRESHOLD=3  # seconds

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔧 SYSTEM PATHS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export NEXUS_CONFIG_DIR="${NEXUS_HOME}/config"
export NEXUS_CACHE_DIR="${NEXUS_HOME}/cache"
export NEXUS_LOG_DIR="${NEXUS_HOME}/logs"
export NEXUS_PLUGIN_DIR="${NEXUS_HOME}/plugins"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🐛 DEBUG & LOGGING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Debug mode (shows detailed loading info)
export NEXUS_DEBUG=false

# Log level (debug, info, warn, error)
export NEXUS_LOG_LEVEL="info"

# Save logs
export NEXUS_SAVE_LOGS=false
