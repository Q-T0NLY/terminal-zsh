#!/usr/bin/env sh
# QUANTUM HEADER MATRIX - THEME MANAGER
# ╭─────────────────────────────────────────────────────────────────────────────╮
# │  THEME MANAGER - Priority-0: Production-grade, ultra-modern visuals        │
# ╰─────────────────────────────────────────────────────────────────────────────╯
# Theme manager (simple, portable). Define RGB triplets and helpers.
# Designed to be sourced by ZSH/Bash UI scripts.

# Theme palettes as semicolon-separated RGB triplets (r,g,b)
quantum_primary="0,255,255;0,174,239;75,0,130"
neural_secondary="138,43,226;255,0,255;148,0,211"
kinetic_tertiary="50,205,50;34,139,34;0,100,0"
accent_gold="255,215,0;255,191,0;255,140,0"
alert_red="255,165,0;255,69,0;220,20,60"

theme_list() {
  echo "quantum_primary" "neural_secondary" "kinetic_tertiary" "accent_gold" "alert_red"
}

# Return the RGB triplet for theme NAME at 1-based INDEX
theme_get_color() {
  name="$1"
  idx="$2"
  eval "palette=\"\${${name}-}\""
  if [ -z "${palette}" ]; then
    return 1
  fi
  OLD_IFS="$IFS"; IFS=';'
  set -- $palette
  IFS="$OLD_IFS"
  i=1
  for v in "$@"; do
    if [ "$i" -eq "$idx" ]; then
      printf "%s" "$v"
      return 0
    fi
    i=$((i+1))
  done
  return 1
}

# Convert "r,g,b" into an ANSI truecolor escape (foreground)
color_escape() {
  rgb="$1"
  r=$(echo "$rgb" | cut -d, -f1)
  g=$(echo "$rgb" | cut -d, -f2)
  b=$(echo "$rgb" | cut -d, -f3)
  printf '\033[38;2;%s;%s;%sm' "$r" "$g" "$b"
}

# Apply a theme by name (sets exported CURRENT_THEME and CURRENT_THEME_COLORS)
theme_apply() {
  name="$1"
  eval "palette=\"\${${name}-}\""
  if [ -z "${palette}" ]; then
    echo "theme_apply: unknown theme: ${name}" >&2
    return 1
  fi
  export CURRENT_THEME="${name}"
  export CURRENT_THEME_COLORS="${palette}"
}

# Simple helper to colorize text using CURRENT_THEME by index (1-based)
tui_colorize() {
  text="$1"
  idx="${2:-1}"
  if [ -z "${CURRENT_THEME}" ]; then
    printf "%s\n" "$text"
    return 0
  fi
  rgb=$(theme_get_color "$CURRENT_THEME" "$idx") || { printf "%s\n" "$text"; return 0; }
  esc=$(color_escape "$rgb")
  reset='\033[0m'
  printf "%b%s%b\n" "$esc" "$text" "$reset"
}

# Small example helper printed when sourced directly
if [ "${0##*/}" = "theme_manager.zsh" ] || [ "${BASH_SOURCE##*/}" = "theme_manager.zsh" ]; then
  echo "Available themes:"
  for t in $(theme_list); do echo " - $t"; done
  echo "Use: . src/ui/theme_manager.zsh && theme_apply quantum_primary && tui_colorize 'Hello' 1"
fi

# 3D WIREFRAME FOOTER (minimal) — included to satisfy Priority-0 interface policy
# This provides an ASCII wireframe footer for interface modules that source the theme manager
append_3d_wireframe_footer() {
  cat <<'FOOT'

  ▶ QUANTUM MINI WIREFRAME
    ┌─────┐
    │ ◉ ◉ │
    └─────┘

FOOT
}

***END***
