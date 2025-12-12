#!/usr/bin/env sh
"""
POSIX registry CLI for propagation control.
Works in sh, bash, zsh and macOS shells — does not require sourcing ZSH functions.
"""

set -eu

DB="${PWD}/.universal_registry.db"
PDB="${PWD}/.registry_propagation.db"

usage() {
  cat <<USAGE
Usage: registry_cli.sh <command> [args]

Commands:
  init                 Initialize databases (creates DB files)
  status               Show propagation status summary
  unidirectional src tgt payload
  bidirectional a b payload
  multicast src tgt1 tgt2 ... payload
  broadcast src payload
  enable-stream id protocol
  help

Examples:
  registry_cli.sh init
  registry_cli.sh unidirectional agent_a component_b '{"k":"v"}'
  registry_cli.sh bidirectional svc1 svc2 '{"cfg":1}'
  registry_cli.sh broadcast coordinator '{"alert":"go"}'
USAGE
}

init_db() {
  command -v sqlite3 >/dev/null 2>&1 || { echo "sqlite3 required" >&2; exit 2; }
  sqlite3 "$DB" "PRAGMA journal_mode=WAL;" >/dev/null 2>&1 || true
  sqlite3 "$PDB" "PRAGMA journal_mode=WAL;" >/dev/null 2>&1 || true
  # Ensure tables exist by invoking existing SQL from propagation file if present
  if [ -f "$(dirname "$0")/../registry_propagation_nexus.zsh" ]; then
    # Use a minimal table ensure for portability
    sqlite3 "$PDB" <<SQL
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS propagation_sessions(id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT UNIQUE, source_id TEXT, mode TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_activity DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS propagation_targets(id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, target_id TEXT, target_type TEXT, protocol TEXT, endpoint TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS propagation_events(id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, event_type TEXT, source_id TEXT, target_id TEXT, payload TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS stream_metrics(id INTEGER PRIMARY KEY AUTOINCREMENT, stream_id TEXT, direction TEXT, message_count INTEGER DEFAULT 0, byte_count INTEGER DEFAULT 0, latency_ms REAL DEFAULT 0.0, last_update DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS nexus_sync_log(id INTEGER PRIMARY KEY AUTOINCREMENT, registry_entry_id TEXT, nexus_component_id TEXT, sync_direction TEXT, payload TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
SQL
  fi
  echo "Initialized DBs: $DB and $PDB"
}

safe_json() {
  printf "%s" "$1" | sed "s/'/''/g"
}

cmd_unidirectional() {
  src=$1; tgt=$2; payload=$3
  sid=$(date +%s%N)-unidir
  sqlite3 "$PDB" "INSERT INTO propagation_sessions(session_id, source_id, mode, status) VALUES('$sid','$src','unidirectional','active');"
  sqlite3 "$PDB" "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) VALUES('$sid','$tgt','component','websocket','connected');"
  sqlite3 "$PDB" "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status) VALUES('$sid','unidirectional_sync','$src','$tgt','$(safe_json "$payload")','transmitted');"
  printf "Unidirectional: %s -> %s\n" "$src" "$tgt"
}

cmd_bidirectional() {
  a=$1; b=$2; payload=$3
  sid=$(date +%s%N)-bidir
  sqlite3 "$PDB" "INSERT INTO propagation_sessions(session_id, source_id, mode, status) VALUES('$sid','$a','bidirectional','active');"
  sqlite3 "$PDB" "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) VALUES('$sid','$b','component','websocket','connected');"
  sqlite3 "$PDB" "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) VALUES('$sid','$a','component','websocket','connected');"
  sqlite3 "$PDB" "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status) VALUES('$sid','bidirectional_sync','$a','$b','$(safe_json "$payload")','transmitted');"
  sqlite3 "$PDB" "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status) VALUES('$sid','bidirectional_sync','$b','$a','$(safe_json "$payload")','transmitted');"
  printf "Bidirectional: %s <-> %s\n" "$a" "$b"
}

cmd_multicast() {
  src=$1; shift; payload=${@: -1}; targets="$@"; targets=${targets% $payload}
  sid=$(date +%s%N)-mcast
  sqlite3 "$PDB" "INSERT INTO propagation_sessions(session_id, source_id, mode, status) VALUES('$sid','$src','multicast','active');"
  for t in $targets; do
    sqlite3 "$PDB" "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) VALUES('$sid','$t','component','websocket','connected');"
    sqlite3 "$PDB" "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status) VALUES('$sid','multicast_sync','$src','$t','$(safe_json "$payload")','transmitted');"
  done
  printf "Multicast: %s -> [%s]\n" "$src" "$targets"
}

cmd_broadcast() {
  src=$1; payload=$2
  sid=$(date +%s%N)-bcast
  sqlite3 "$PDB" "INSERT INTO propagation_sessions(session_id, source_id, mode, status) VALUES('$sid','$src','broadcast','active');"
  # select components from registry DB
  sqlite3 -csv "$DB" "SELECT DISTINCT name FROM (SELECT name FROM components UNION SELECT name FROM services UNION SELECT name FROM agents) LIMIT 100;" | while IFS=, read -r tgt; do
    [ -z "$tgt" ] && continue
    sqlite3 "$PDB" "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) VALUES('$sid','$tgt','component','websocket','connected');"
    sqlite3 "$PDB" "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status) VALUES('$sid','broadcast_sync','$src','$tgt','$(safe_json "$payload")','transmitted');"
  done
  printf "Broadcast: %s -> ALL (up to 100)\n" "$src"
}

cmd_status() {
  sqlite3 -header -column "$PDB" "SELECT session_id, source_id, mode, status, created_at FROM propagation_sessions ORDER BY created_at DESC LIMIT 20;"
}

main() {
  [ $# -lt 1 ] && usage && exit 1
  cmd=$1; shift
  case "$cmd" in
    init) init_db ;; 
    status) cmd_status ;; 
    unidirectional) [ $# -ne 3 ] && usage && exit 1; cmd_unidirectional "$@" ;; 
    bidirectional) [ $# -ne 3 ] && usage && exit 1; cmd_bidirectional "$@" ;; 
    multicast) [ $# -ge 3 ] || { usage; exit 1; }; cmd_multicast "$@" ;; 
    broadcast) [ $# -ne 2 ] && usage && exit 1; cmd_broadcast "$@" ;; 
    help) usage ;; 
    *) echo "Unknown command: $cmd"; usage; exit 2 ;;
  esac
}

main "$@"
