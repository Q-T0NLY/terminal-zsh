#!/bin/zsh
################################################################################
#                        ALIASES & FUNCTIONS MODULE                            #
#                    Productivity aliases and custom functions                 #
################################################################################
#
# PURPOSE: Define custom aliases and utility functions
# DEPENDENCIES: devtools.module
# STATUS: Production Ready
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. FILESYSTEM ALIASES                                                       ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

alias ll="ls -lah"
alias la="ls -la"
alias l="ls -lh"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias mkdir="mkdir -p"
alias cp="cp -i"
alias mv="mv -i"
alias rm="rm -i"

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. UTILITY FUNCTIONS                                                         ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Create directory and cd into it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Search for file
findfile() {
    find . -name "*$1*" -type f
}

# Search for directory
finddir() {
    find . -name "*$1*" -type d
}

# Extract archives
extract() {
    case "$1" in
        *.tar.bz2)   tar xjf "$1"   ;;
        *.tar.gz)    tar xzf "$1"   ;;
        *.bz2)       bunzip2 "$1"   ;;
        *.rar)       unrar x "$1"   ;;
        *.gz)        gunzip "$1"    ;;
        *.tar)       tar xf "$1"    ;;
        *.tbz2)      tar xjf "$1"   ;;
        *.tgz)       tar xzf "$1"   ;;
        *.zip)       unzip "$1"     ;;
        *.Z)         uncompress "$1";;
        *.7z)        7z x "$1"      ;;
        *)           echo "Cannot extract '$1'" ;;
    esac
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. QUICK NAVIGATION                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

alias home="cd ~"
alias desktop="cd ~/Desktop"
alias docs="cd ~/Documents"
alias downloads="cd ~/Downloads"
alias projects="cd ~/Projects"

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. SYSTEM UTILITIES                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Network utilities
alias myip="curl ipinfo.io/ip"
alias ports="netstat -tulanp"
alias ipconfig="ifconfig"

# System information
alias sysinfo="system_profiler SPHardwareDataType"
alias diskspace="df -h"
alias meminfo="vm_stat"

log_message "INFO" "Aliases and functions module initialized"

################################################################################
# END OF ALIASES.MODULE.ZSH
################################################################################
