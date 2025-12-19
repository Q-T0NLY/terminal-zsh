#!/usr/bin/env bash
#
# fullstack.sh - Advanced full-stack orchestrator for Nexus (terminal-zsh)
#
# Commands:
#   setup       - Ensure .venv exists and install requirements.txt
#   backend     - Run nexus_api.py FastAPI app via uvicorn on port 8080
#   frontend    - Run Nexus-Q Next.js frontend from nexus-q/ (requires pnpm)
#   all         - Run backend (background) + frontend (foreground)
#   shell       - Open a venv-activated Zsh shell at repo root
#
# This script is idempotent and safe to re-run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$REPO_ROOT/.venv"
BACKEND_HOST="0.0.0.0"
BACKEND_PORT="8080"
BACKEND_APP="nexus_api:app"  # nexus_api.py with `app = FastAPI(...)`

log()   { printf '%s\n' "[$(date +%H:%M:%S)] $*"; }
err()   { printf '%s\n' "[$(date +%H:%M:%S)] ERROR: $*" >&2; }
fatal() { err "$@"; exit 1; }

ensure_python() {
  if command -v python3 >/dev/null 2>&1; then
    PY_BIN="python3"
  elif command -v python >/dev/null 2>&1; then
    PY_BIN="python"
  else
    fatal "Python (python3/python) is not installed. Install it and re-run."
  fi
}

activate_venv() {
  if [[ ! -d "$VENV_DIR" || ! -f "$VENV_DIR/bin/activate" ]]; then
    fatal "Virtualenv not found at $VENV_DIR. Run '$0 setup' first."
  fi
  # shellcheck disable=SC1090
  source "$VENV_DIR/bin/activate"
}

cmd_setup() {
  log "=== [setup] Ensuring Python venv and requirements ==="
  ensure_python

  if [[ ! -d "$VENV_DIR" ]]; then
    log "• Creating venv at $VENV_DIR ..."
    "$PY_BIN" -m venv "$VENV_DIR"
  else
    log "• Existing venv found at $VENV_DIR"
  fi

  activate_venv
  log "• Using venv Python: $(python -V 2>&1)"

  if [[ -f "$REPO_ROOT/requirements.txt" ]]; then
    log "• Installing requirements from requirements.txt into venv..."
    python -m pip install --upgrade pip
    python -m pip install -r "$REPO_ROOT/requirements.txt"
  else
    log "• No requirements.txt found; skipping dependency install."
  fi

  log "=== [setup] Done ==="
}

cmd_backend() {
  log "=== [backend] Starting Nexus API (FastAPI/uvicorn) ==="
  activate_venv

  if [[ ! -f "$REPO_ROOT/nexus_api.py" ]]; then
    fatal "nexus_api.py not found at $REPO_ROOT/nexus_api.py"
  fi

  cd "$REPO_ROOT"
  log "• Serving $BACKEND_APP at http://$BACKEND_HOST:$BACKEND_PORT"
  log "• Press Ctrl+C to stop."
  exec uvicorn "$BACKEND_APP" \
    --host "$BACKEND_HOST" \
    --port "$BACKEND_PORT" \
    --reload
}

cmd_frontend() {
  log "=== [frontend] Starting Nexus-Q frontend (Next.js) ==="

  if [[ ! -d "$REPO_ROOT/nexus-q" ]]; then
    fatal "nexus-q/ directory not found. Attach or clone Q-T0NLY/Nexus-Q into nexus-q/."
  fi

  if ! command -v pnpm >/dev/null 2>&1; then
    fatal "pnpm not found. Install pnpm via your Node manager (Volta/nvm/etc.) and try again."
  fi

  cd "$REPO_ROOT/nexus-q"
  if [[ ! -f "package.json" ]]; then
    fatal "nexus-q/package.json not found. This directory doesn't look like a Node/Next.js app."
  fi

  if [[ ! -d "node_modules" ]]; then
    log "• Running pnpm install in nexus-q/ ..."
    pnpm install
  fi

  log "• Running pnpm dev in nexus-q/ (Next.js dev server, typically http://localhost:3000)"
  log "• Press Ctrl+C to stop."
  exec pnpm dev
}

cmd_all() {
  log "=== [all] Starting backend and frontend together ==="

  # Start backend in background
  log "• Launching backend in background..."
  "$0" backend &
  BACKEND_PID=$!
  log "• Backend PID: $BACKEND_PID (FastAPI/uvicorn on port $BACKEND_PORT)"

  cleanup() {
    log "• Caught signal, stopping backend PID $BACKEND_PID"
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    exit 0
  }
  trap cleanup INT TERM

  # Start frontend in foreground
  log "• Launching frontend in foreground..."
  "$0" frontend
}

cmd_shell() {
  log "=== [shell] Venv-activated Zsh shell in repo root ==="
  ensure_python

  if [[ ! -d "$VENV_DIR" || ! -f "$VENV_DIR/bin/activate" ]]; then
    log "• No venv found; running setup first..."
    cmd_setup
  fi

  cd "$REPO_ROOT"
  activate_venv

  if command -v zsh >/dev/null 2>&1; then
    log "• Starting Zsh with venv active at $REPO_ROOT"
    exec zsh
  else
    log "• zsh not found; falling back to current shell."
    exec "$SHELL"
  fi
}

usage() {
  cat <<EOF
Usage: $0 <command>

Commands:
  setup       Ensure .venv exists and install requirements.txt
  backend     Run Nexus API (nexus_api.py) via uvicorn on port $BACKEND_PORT
  frontend    Run Nexus-Q frontend (Next.js) from nexus-q/ (requires pnpm)
  all         Run backend (background) + frontend (foreground)
  shell       Open a venv-activated Zsh shell at repo root

Examples:
  $0 setup
  $0 backend
  $0 frontend
  $0 all
  $0 shell
EOF
}

COMMAND="${1-}"

case "$COMMAND" in
  setup)
    shift
    cmd_setup "$@"
    ;;
  backend)
    shift
    cmd_backend "$@"
    ;;
  frontend)
    shift
    cmd_frontend "$@"
    ;;
  all)
    shift
    cmd_all "$@"
    ;;
  shell)
    shift
    cmd_shell "$@"
    ;;
  ""|help|-h|--help)
    usage
    ;;
  *)
    err "Unknown command: $COMMAND"
    echo
    usage
    exit 1
    ;;
esac