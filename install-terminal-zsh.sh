#!/usr/bin/env bash
#
# terminal-zsh: Production-grade installer for macOS (Intel) + Zsh
#
# Responsibilities:
#   - Validate environment (macOS + Zsh + Python)
#   - Create/refresh a local Python virtualenv (.venv)
#   - Install Python dependencies from requirements.txt into .venv
#   - Backup and rewrite ~/.zshrc to integrate terminal-zsh
#   - Create a nexus_terminal_start launcher that activates .venv and
#     starts the main Nexus shell entrypoint
#
# This script is idempotent and safe to re-run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZSHRC="$HOME/.zshrc"
BACKUP="$HOME/.zshrc.backup-terminal-zsh-$(date +%Y%m%d-%H%M%S)"
VENV_DIR="$REPO_ROOT/.venv"

log()    { printf '%s\n' "[$(date +%H:%M:%S)] $*"; }
error()  { printf '%s\n' "[$(date +%H:%M:%S)] ERROR: $*" >&2; }
fatal()  { error "$@"; exit 1; }

log "=== terminal-zsh installer (macOS Intel, Zsh) ==="
log "Repository root: $REPO_ROOT"
echo

########################################
# 1. Environment validation
########################################
log "[1/4] Validating environment..."

# OS
OS="$(uname -s)"
ARCH="$(uname -m)"
if [[ "$OS" != "Darwin" ]]; then
  fatal "This installer is tailored for macOS. Detected: $OS"
fi
if [[ "$ARCH" != "x86_64" ]]; then
  log "Warning: Expected macOS Intel (x86_64), detected: $ARCH"
  log "The setup may still work, but it's optimized for Intel Macs."
fi
log "• macOS ($ARCH) detected."

# Shell
if ! command -v zsh >/dev/null 2>&1; then
  fatal "Zsh is not installed. Install Zsh (brew install zsh) and re-run."
fi
log "• Zsh detected: $(zsh --version)"

# Python
PY_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PY_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PY_BIN="python"
else
  fatal "Python (python3/python) is not installed. Install via Homebrew and re-run."
fi
log "• Python detected: $("$PY_BIN" -V 2>&1)"

echo

########################################
# 2. Python virtualenv + requirements
########################################
log "[2/4] Setting up Python virtual environment..."

# Create venv if needed
if [[ ! -d "$VENV_DIR" ]]; then
  log "• Creating virtualenv at $VENV_DIR ..."
  "$PY_BIN" -m venv "$VENV_DIR"
else
  log "• Existing virtualenv found at $VENV_DIR"
fi

# Activate venv
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"
log "• Using venv Python: $(python -V 2>&1)"

# Install requirements into venv
if [[ -f "$REPO_ROOT/requirements.txt" ]]; then
  log "• Installing/refreshing requirements from requirements.txt..."
  python -m pip install --upgrade pip
  python -m pip install -r "$REPO_ROOT/requirements.txt"
else
  log "• No requirements.txt found at repo root, skipping Python deps."
fi

echo

########################################
# 3. Zsh configuration wiring (~/.zshrc)
########################################
log "[3/4] Wiring Zsh configuration..."

if [[ -f "$ZSHRC" ]]; then
  log "• Backing up existing .zshrc to: $BACKUP"
  cp "$ZSHRC" "$BACKUP"
else
  log "• No existing ~/.zshrc found; creating a new one."
fi

# Choose the primary Nexus/Zsh entry script in priority order
MAIN_ZSH_ENTRY=""
if [[ -f "$REPO_ROOT/UNIFIED_MASTER_SYSTEM.zsh" ]]; then
  MAIN_ZSH_ENTRY="\$TERMINAL_ZSH_ROOT/UNIFIED_MASTER_SYSTEM.zsh"
elif [[ -f "$REPO_ROOT/launch_nexus_hyper.zsh" ]]; then
  MAIN_ZSH_ENTRY="\$TERMINAL_ZSH_ROOT/launch_nexus_hyper.zsh"
elif [[ -f "$REPO_ROOT/nexus-ai-studio.zsh" ]]; then
  MAIN_ZSH_ENTRY="\$TERMINAL_ZSH_ROOT/nexus-ai-studio.zsh"
fi

cat > "$ZSHRC" <<'EOF'
# ~/.zshrc - managed by terminal-zsh
# Your previous .zshrc was backed up as: '"$BACKUP"'

# Root of the terminal-zsh environment (monorepo)
export TERMINAL_ZSH_ROOT="'"$REPO_ROOT"'"

# Ensure terminal-zsh bin/ is at the front of PATH
if [ -d "$TERMINAL_ZSH_ROOT/bin" ]; then
  export PATH="$TERMINAL_ZSH_ROOT/bin:$PATH"
fi

# Load the main Nexus/Zsh entry script if present
if [ -n "'"$MAIN_ZSH_ENTRY"'" ] && [ -f "'"$MAIN_ZSH_ENTRY"'" ]; then
  source "'"$MAIN_ZSH_ENTRY"'"
fi

# Safely load additional Zsh configs from zsh-config/.ZSHRC and zsh-config/zsh
# Using (N) to allow "no matches" without errors
if [ -d "$TERMINAL_ZSH_ROOT/zsh-config/.ZSHRC" ]; then
  for f in "$TERMINAL_ZSH_ROOT"/zsh-config/.ZSHRC/*.zsh(N); do
    [ -f "$f" ] && source "$f"
  done
fi

if [ -d "$TERMINAL_ZSH_ROOT/zsh-config/zsh" ]; then
  for f in "$TERMINAL_ZSH_ROOT"/zsh-config/zsh/*.zsh(N); do
    [ -f "$f" ] && source "$f"
  done
fi

# Optional: user-local overrides
# Create ~/.zshrc.local for personal tweaks; it will not be touched by installer.
if [ -f "$HOME/.zshrc.local" ]; then
  source "$HOME/.zshrc.local"
fi
EOF

log "• New ~/.zshrc written. Previous version backed up."
echo

########################################
# 4. Launcher helper: bin/nexus_terminal_start
########################################
log "[4/4] Creating launcher helper..."

mkdir -p "$REPO_ROOT/bin"
LAUNCHER="$REPO_ROOT/bin/nexus_terminal_start"

cat > "$LAUNCHER" <<'EOF'
#!/usr/bin/env bash
# nexus_terminal_start: Unified launcher for terminal-zsh + Nexus stack

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$ROOT/.venv"

# Activate Python venv if present (for FastAPI, orchestration services, etc.)
if [[ -d "$VENV" && -f "$VENV/bin/activate" ]]; then
  # shellcheck disable=SC1090
  source "$VENV/bin/activate"
fi

# Ensure TERMINAL_ZSH_ROOT is set
export TERMINAL_ZSH_ROOT="${TERMINAL_ZSH_ROOT:-$ROOT}"

# Prefer a dedicated Nexus shell entrypoint if present
if [[ -f "$ROOT/launch_nexus_hyper.zsh" ]]; then
  exec zsh "$ROOT/launch_nexus_hyper.zsh" "$@"
elif [[ -f "$ROOT/nexus-ai-studio.zsh" ]]; then
  exec zsh "$ROOT/nexus-ai-studio.zsh" "$@"
elif [[ -f "$ROOT/UNIFIED_MASTER_SYSTEM.zsh" ]]; then
  exec zsh "$ROOT/UNIFIED_MASTER_SYSTEM.zsh" "$@"
else
  echo "nexus_terminal_start: No primary launcher script found in $ROOT."
  echo "Looked for: launch_nexus_hyper.zsh, nexus-ai-studio.zsh, UNIFIED_MASTER_SYSTEM.zsh"
  exit 1
fi
EOF

chmod +x "$LAUNCHER"
log "• Created launcher: $LAUNCHER"
echo

log "=== Install complete ==="
echo
log "Next steps:"
log "  1) Close and reopen Terminal.app, or run: exec zsh"
log "  2) Then run: nexus_terminal_start"
log "     (or '$LAUNCHER' directly) to enter the Nexus terminal environment."
echo
log "Repo root: $REPO_ROOT"