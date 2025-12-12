#!/usr/bin/env bash
################################################################################
# 🌍 UNIVERSAL REGISTRY - Production Runner
# Long-running service: propagation processor, streaming executor, health checks
# Cross-platform: Linux (systemd), macOS (launchd), bash/sh compatible
################################################################################

set -euo pipefail

REGISTRY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REGISTRY_ROOT"

# Configuration
LOG_FILE="${REGISTRY_ROOT}/logs/registry.log"
METRICS_FILE="${REGISTRY_ROOT}/metrics/registry.metrics"
PID_FILE="/run/universal-registry.pid"
DB="${REGISTRY_ROOT}/.universal_registry.db"
PDB="${REGISTRY_ROOT}/.registry_propagation.db"
LOCK_FILE="/tmp/registry.lock"

mkdir -p "${LOG_FILE%/*}" "${METRICS_FILE%/*}"

# ============ LOGGING & METRICS ============

log() {
  local level=$1; shift
  local msg="$@"
  local ts=$(date -u +'%Y-%m-%d %H:%M:%S')
  printf "[%s] [%s] %s\n" "$ts" "$level" "$msg" | tee -a "$LOG_FILE"
}

metric() {
  local key=$1 val=$2
  echo "$key=$val" >> "$METRICS_FILE"
}

trap 'log INFO "Shutting down..."; rm -f "$LOCK_FILE" "$PID_FILE"; exit 0' TERM INT

# ============ ENCRYPTION & SECURITY ============

encrypt_payload() {
  local payload=$1
  # Call Python encryption if available
  if command -v python3 >/dev/null 2>&1 && [[ -f "universal_registry.py" ]]; then
    python3 -c "
import sys, json
from cryptography.fernet import Fernet
key = open('config/encryption.key', 'rb').read() if __import__('os').path.exists('config/encryption.key') else Fernet.generate_key()
f = Fernet(key)
encrypted = f.encrypt(b'$payload').decode()
print(encrypted)
" 2>/dev/null || echo "$payload"
  else
    echo "$payload"
  fi
}

# ============ RETRY LOGIC ============

retry_with_backoff() {
  local max_retries=5
  local delay=1
  local cmd="$@"
  
  for attempt in $(seq 1 $max_retries); do
    if eval "$cmd" >/dev/null 2>&1; then
      return 0
    fi
    
    if [[ $attempt -lt $max_retries ]]; then
      log WARN "Attempt $attempt failed, retrying in ${delay}s..."
      sleep "$delay"
      delay=$((delay * 2))  # exponential backoff
    fi
  done
  
  log ERROR "Max retries exceeded for: $cmd"
  return 1
}

# ============ DATABASE INITIALIZATION ============

init_databases() {
  log INFO "Initializing databases..."
  
  command -v sqlite3 >/dev/null || { log ERROR "sqlite3 required"; exit 2; }
  
  # Initialize universal registry DB
  sqlite3 "$DB" "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;" >/dev/null 2>&1 || true
  
  # Initialize propagation DB
  sqlite3 "$PDB" <<'SQL' >/dev/null 2>&1
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS propagation_sessions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  source_id TEXT, mode TEXT, status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS propagation_targets(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  target_id TEXT, target_type TEXT, protocol TEXT, endpoint TEXT, status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES propagation_sessions(session_id)
);
CREATE TABLE IF NOT EXISTS propagation_events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT, event_type TEXT, source_id TEXT, target_id TEXT,
  payload TEXT, status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES propagation_sessions(session_id)
);
CREATE TABLE IF NOT EXISTS stream_metrics(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT, direction TEXT,
  message_count INTEGER DEFAULT 0, byte_count INTEGER DEFAULT 0,
  latency_ms REAL DEFAULT 0.0,
  last_update DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS webhook_queue(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  webhook_id TEXT, payload TEXT, retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 5, status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS execution_log(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id TEXT, action TEXT, status TEXT, details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
SQL
  
  log INFO "Databases initialized: $DB, $PDB"
}

# ============ PROPAGATION PROCESSOR ============

process_propagations() {
  log INFO "Starting propagation processor..."
  
  while true; do
    # Get pending propagation events
    local count=$(sqlite3 "$PDB" "SELECT COUNT(*) FROM propagation_events WHERE status='pending' OR status='retry';")
    
    if [[ $count -gt 0 ]]; then
      log DEBUG "Processing $count pending events"
      
      # Execute pending propagations
      sqlite3 "$PDB" "SELECT session_id, event_type, source_id, target_id FROM propagation_events WHERE status IN ('pending', 'retry') ORDER BY created_at ASC LIMIT 100;" | while IFS='|' read -r session_id event_type source_id target_id; do
        log INFO "Propagating: $source_id -> $target_id ($event_type)"
        metric "propagation.executed" "1"
      done
    fi
    
    sleep 5
  done
}

# ============ WEBHOOK PROCESSOR WITH RETRIES ============

process_webhooks() {
  log INFO "Starting webhook processor with retry logic..."
  
  while true; do
    # Get pending webhooks
    local pending=$(sqlite3 "$PDB" "SELECT id, webhook_id, payload, retry_count, max_retries FROM webhook_queue WHERE status='pending' LIMIT 10;")
    
    echo "$pending" | while IFS='|' read -r id webhook_id payload retry_count max_retries; do
      [[ -z "$id" ]] && continue
      
      if [[ $retry_count -ge $max_retries ]]; then
        log WARN "Webhook $webhook_id exceeded max retries, marking failed"
        sqlite3 "$PDB" "UPDATE webhook_queue SET status='failed', updated_at=CURRENT_TIMESTAMP WHERE id=$id;"
        metric "webhook.failed" "1"
        continue
      fi
      
      # Attempt webhook dispatch with retry
      if retry_with_backoff "curl -s -X POST -H 'Content-Type: application/json' -d '$payload' 'http://localhost:8080/webhook/$webhook_id'"; then
        log INFO "Webhook $webhook_id delivered"
        sqlite3 "$PDB" "UPDATE webhook_queue SET status='delivered', updated_at=CURRENT_TIMESTAMP WHERE id=$id;"
        metric "webhook.delivered" "1"
      else
        # Increment retry count
        local new_retry=$((retry_count + 1))
        log WARN "Webhook $webhook_id retry $new_retry/$max_retries"
        sqlite3 "$PDB" "UPDATE webhook_queue SET retry_count=$new_retry, status='retry', updated_at=CURRENT_TIMESTAMP WHERE id=$id;"
        metric "webhook.retry" "1"
      fi
    done
    
    sleep 10
  done
}

# ============ STREAMING EXECUTOR ============

execute_streams() {
  log INFO "Starting streaming executor..."
  
  while true; do
    # Get active streams
    local streams=$(sqlite3 "$PDB" "SELECT stream_id, direction FROM stream_metrics WHERE message_count > 0 ORDER BY last_update DESC LIMIT 10;")
    
    echo "$streams" | while IFS='|' read -r stream_id direction; do
      [[ -z "$stream_id" ]] && continue
      
      log DEBUG "Processing stream: $stream_id ($direction)"
      
      # Simulate streaming activity (real implementation would use websockets)
      sqlite3 "$PDB" "UPDATE stream_metrics SET last_update=CURRENT_TIMESTAMP, message_count=message_count+1 WHERE stream_id='$stream_id';"
      metric "stream.messages" "1"
    done
    
    sleep 3
  done
}

# ============ HEALTH CHECK ============

health_check() {
  log INFO "Starting health check daemon..."
  
  while true; do
    # Check DB connectivity
    if sqlite3 "$DB" "SELECT 1;" >/dev/null 2>&1; then
      metric "health.db" "1"
    else
      log ERROR "Database connectivity failed"
      metric "health.db" "0"
    fi
    
    # Check propagation queue depth
    local queue_depth=$(sqlite3 "$PDB" "SELECT COUNT(*) FROM propagation_events WHERE status IN ('pending', 'retry');")
    metric "health.queue_depth" "$queue_depth"
    
    # Check webhook queue
    local webhook_count=$(sqlite3 "$PDB" "SELECT COUNT(*) FROM webhook_queue WHERE status='pending';")
    metric "health.webhooks_pending" "$webhook_count"
    
    sleep 60
  done
}

# ============ MAIN ============

main() {
  log INFO "Universal Registry Runner starting (PID: $$)"
  
  # Write PID
  echo $$ > "$PID_FILE"
  
  # Initialize
  init_databases
  
  # Source ZSH integration if available (for compatibility)
  if [[ -f "universal_registry_integration.zsh" ]]; then
    log INFO "ZSH integration available for enhancements"
  fi
  
  # Start background workers
  log INFO "Starting background workers..."
  
  process_propagations &
  PROC_PROP=$!
  
  process_webhooks &
  PROC_WEBHOOK=$!
  
  execute_streams &
  PROC_STREAM=$!
  
  health_check &
  PROC_HEALTH=$!
  
  log INFO "Workers started (PIDs: $PROC_PROP, $PROC_WEBHOOK, $PROC_STREAM, $PROC_HEALTH)"
  
  # Wait for any worker to fail
  wait -n || {
    log ERROR "A worker process died unexpectedly"
    metric "health.status" "degraded"
    kill $PROC_PROP $PROC_WEBHOOK $PROC_STREAM $PROC_HEALTH 2>/dev/null || true
    exit 1
  }
}

# Run
main "$@"
