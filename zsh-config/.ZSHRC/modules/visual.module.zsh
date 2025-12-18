#!/bin/zsh
################################################################################
#                        VISUAL ENHANCEMENTS MODULE                            #
#           Prompt configuration, colors, themes, and terminal aesthetics      #
################################################################################
#
# PURPOSE: Configure visual appearance of terminal
# DEPENDENCIES: aliases.module
# STATUS: Production Ready
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. COLOR SUPPORT                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Enable color output
export CLICOLOR=1
export CLICOLOR_FORCE=1
export LS_COLORS="di=34:ln=35:so=32:pi=33:ex=31:bd=36;01:cd=33;01:su=31;40;07:sg=36;40;07:tw=32;40;07:ow=33;40;07:"

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. PROMPT CONFIGURATION                                                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Simple but effective prompt
PROMPT='%F{cyan}❯%f %F{green}%n%f@%F{blue}%m%f:%F{yellow}%~%f %F{cyan}$%f '
RPROMPT='%F{gray}%D{%H:%M}%f'

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. SYNTAX HIGHLIGHTING                                                      ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Enable syntax highlighting if available
if [[ -f "/opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]]; then
    source "/opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
elif [[ -f "/usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]]; then
    source "/usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
fi

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. AUTO-SUGGESTIONS                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Enable auto-suggestions if available
if [[ -f "/opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh" ]]; then
    source "/opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh"
    export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=59"
elif [[ -f "/usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh" ]]; then
    source "/usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh"
    export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=59"
fi

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. THEME SUPPORT                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Function to switch themes
switch_theme() {
    local theme="$1"
    case "$theme" in
        dark)
            echo "🌙 Switching to dark theme..."
            ;;
        light)
            echo "☀️  Switching to light theme..."
            ;;
        *)
            echo "Usage: switch_theme [dark|light]"
            return 1
            ;;
    esac
}

log_message "INFO" "Visual enhancements module initialized"

################################################################################
# END OF VISUAL.MODULE.ZSH
################################################################################
