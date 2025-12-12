#!/usr/bin/env bash
set -euo pipefail
# CLI Generator for creating scaffolded ZSH/TUI apps that integrate with theme_manager

USAGE() {
  cat <<'USAGE'
Usage: cli_generator.sh new <name> [--theme THEME]

Commands:
  new <name>        Create a new generated UI script under src/ui/generated/<name>.zsh
  list-themes       Print available themes (requires sourcing theme_manager)
  help              Show this help

Examples:
  ./scripts/cli_generator.sh new sample_app --theme quantum_primary
  ./scripts/cli_generator.sh list-themes
USAGE
}

gen_dir="src/ui/generated"
mkdir -p "$gen_dir"

cmd=${1:-help}
case "$cmd" in
  new)
    name=${2:-}
    if [ -z "$name" ]; then
      echo "new requires a name" >&2; USAGE; exit 2
    fi
    shift 2 || true
    theme="quantum_primary"
    while [ "$#" -gt 0 ]; do
      case "$1" in
        --theme) theme=${2:-$theme}; shift 2 ;;
        *) shift ;;
      esac
    done

    out="$gen_dir/${name}.zsh"
    cat > "$out" <<EOF
#!/usr/bin/env zsh
# Generated UI: ${name}
source ../theme_manager.zsh || source src/ui/theme_manager.zsh
theme_apply ${theme}

render_${name}() {
  clear
  tui_colorize "=== ${name} (theme: ${theme}) ===" 1
  tui_colorize "This is a generated scaffolding. Customize as needed." 2
}

if [ "
$0" = "
${0}" ]; then
  render_${name}
fi
EOF

    chmod +x "$out"
    echo "Created $out (theme: $theme)"
    ;;
  list-themes)
    # try to source the theme manager from repo path
    if [ -f src/ui/theme_manager.zsh ]; then
      # shellcheck disable=SC1090
      . src/ui/theme_manager.zsh
      theme_list
    else
      echo "theme manager not found (src/ui/theme_manager.zsh)" >&2; exit 2
    fi
    ;;
  help|--help|-h)
    USAGE
    ;;
  *)
    USAGE
    exit 1
    ;;
esac
