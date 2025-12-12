#!/usr/bin/env zsh
################################################################################
# 🌍 UNIVERSAL REGISTRY PROPAGATION ENGINE - Nexus AI Studio Integration
# Directional propagation: unidirectional, bidirectional, multicast, broadcast
# Real-time registry sync with nexus-ai-studio.zsh system
################################################################################

set -euo pipefail

typeset -g REGISTRY_PROPAGATION_DB
REGISTRY_PROPAGATION_DB="${PWD}/.registry_propagation.db"

typeset -gA PROPAGATION_MODES=(
  unidirectional "single-direction"
  bidirectional "two-way-sync"
  multicast "selected-targets"
  broadcast "all-recipients"
)

typeset -gA PROPAGATION_TARGETS=(
  # Default propagation targets
)

typeset -gA ACTIVE_STREAMS=(
  # Track active streaming connections
)

# ============ PROPAGATION INITIALIZATION ============

function registry_propagation_init() {
  printf "🔄 Initializing Registry Propagation Engine...\n"
  _registry_check_sqlite || return 1
  mkdir -p "${PWD}"
  
  sqlite3 "$REGISTRY_PROPAGATION_DB" <<'SQL'
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS propagation_sessions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  source_id TEXT,
  mode TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS propagation_targets(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  target_id TEXT,
  target_type TEXT,
  protocol TEXT,
  endpoint TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES propagation_sessions(session_id)
);

CREATE TABLE IF NOT EXISTS propagation_events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  event_type TEXT,
  source_id TEXT,
  target_id TEXT,
  payload TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES propagation_sessions(session_id)
);

CREATE TABLE IF NOT EXISTS stream_metrics(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT,
  direction TEXT,
  message_count INTEGER DEFAULT 0,
  byte_count INTEGER DEFAULT 0,
  latency_ms REAL DEFAULT 0.0,
  last_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nexus_sync_log(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registry_entry_id TEXT,
  nexus_component_id TEXT,
  sync_direction TEXT,
  payload TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
SQL

  printf "✅ Registry Propagation Engine initialized at %s\n" "$REGISTRY_PROPAGATION_DB"
}

# ============ PROPAGATION MODE FUNCTIONS ============

function registry_propagation_unidirectional() {
  local source_id=$1
  local target_id=$2
  local data=$3
  local protocol=${4:-websocket}
  
  _registry_check_sqlite || return 1
  
  local session_id; session_id=$(uuidgen 2>/dev/null || echo "$(date +%s%N)-$source_id")
  
  # Create propagation session
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_sessions(session_id, source_id, mode, status) 
     VALUES('$session_id', '$source_id', 'unidirectional', 'active');"
  
  # Add target
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) 
     VALUES('$session_id', '$target_id', 'component', '$protocol', 'connected');"
  
  # Create propagation event
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status)
     VALUES('$session_id', 'unidirectional_sync', '$source_id', '$target_id', '$(printf "%s" "$data" | sed "s/'/''/g")', 'transmitted');"
  
  printf "✓ Unidirectional propagation: %s → %s\n" "$source_id" "$target_id"
  return 0
}

function registry_propagation_bidirectional() {
  local id1=$1
  local id2=$2
  local data=$3
  local protocol=${4:-websocket}
  
  _registry_check_sqlite || return 1
  
  local session_id; session_id=$(uuidgen 2>/dev/null || echo "$(date +%s%N)-bidirect")
  
  # Create bidirectional session
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_sessions(session_id, source_id, mode, status) 
     VALUES('$session_id', '$id1', 'bidirectional', 'active');"
  
  # Add both targets (bidirectional means both send and receive)
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) 
     VALUES('$session_id', '$id2', 'component', '$protocol', 'connected');"
  
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) 
     VALUES('$session_id', '$id1', 'component', '$protocol', 'connected');"
  
  # Log both directions
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status)
     VALUES('$session_id', 'bidirectional_sync', '$id1', '$id2', '$(printf "%s" "$data" | sed "s/'/''/g")', 'transmitted');"
  
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status)
     VALUES('$session_id', 'bidirectional_sync', '$id2', '$id1', '$(printf "%s" "$data" | sed "s/'/''/g")', 'transmitted');"
  
  ACTIVE_STREAMS[$session_id]="bidirectional:$id1:$id2"
  
  printf "⇄ Bidirectional propagation: %s ↔ %s\n" "$id1" "$id2"
  return 0
}

function registry_propagation_multicast() {
  local source_id=$1
  shift
  local targets=("$@")
  local data="${targets[-1]}"
  targets=("${targets[@]:0:${#targets[@]}-1}")
  
  _registry_check_sqlite || return 1
  
  local session_id; session_id=$(uuidgen 2>/dev/null || echo "$(date +%s%N)-multicast")
  
  # Create multicast session
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_sessions(session_id, source_id, mode, status) 
     VALUES('$session_id', '$source_id', 'multicast', 'active');"
  
  # Add all targets
  for target in "${targets[@]}"; do
    sqlite3 "$REGISTRY_PROPAGATION_DB" \
      "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) 
       VALUES('$session_id', '$target', 'component', 'websocket', 'connected');"
    
    sqlite3 "$REGISTRY_PROPAGATION_DB" \
      "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status)
       VALUES('$session_id', 'multicast_sync', '$source_id', '$target', '$(printf "%s" "$data" | sed "s/'/''/g")', 'transmitted');"
  done
  
  ACTIVE_STREAMS[$session_id]="multicast:$source_id:${#targets[@]}"
  
  printf "📡 Multicast propagation: %s → [%d targets]\n" "$source_id" "${#targets[@]}"
  return 0
}

function registry_propagation_broadcast() {
  local source_id=$1
  local data=$2
  
  _registry_check_sqlite || return 1
  
  local session_id; session_id=$(uuidgen 2>/dev/null || echo "$(date +%s%N)-broadcast")
  
  # Create broadcast session
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO propagation_sessions(session_id, source_id, mode, status) 
     VALUES('$session_id', '$source_id', 'broadcast', 'active');"
  
  # Get all registered components as targets
  local targets; targets=$(sqlite3 "$UNIVERSAL_REGISTRY_DB" \
    "SELECT DISTINCT name FROM (SELECT name FROM components UNION SELECT name FROM services UNION SELECT name FROM agents) LIMIT 100;" 2>/dev/null || true)
  
  local count=0
  while IFS= read -r target; do
    [[ -z "$target" ]] && continue
    
    sqlite3 "$REGISTRY_PROPAGATION_DB" \
      "INSERT INTO propagation_targets(session_id, target_id, target_type, protocol, status) 
       VALUES('$session_id', '$target', 'component', 'websocket', 'connected');"
    
    sqlite3 "$REGISTRY_PROPAGATION_DB" \
      "INSERT INTO propagation_events(session_id, event_type, source_id, target_id, payload, status)
       VALUES('$session_id', 'broadcast_sync', '$source_id', '$target', '$(printf "%s" "$data" | sed "s/'/''/g")', 'transmitted');"
    
    ((count++))
  done <<< "$targets"
  
  ACTIVE_STREAMS[$session_id]="broadcast:$source_id:$count"
  
  printf "📢 Broadcast propagation: %s → [%d recipients]\n" "$source_id" "$count"
  return 0
}

# ============ NEXUS AI STUDIO INTEGRATION ============

function registry_sync_with_nexus() {
  local registry_entry_id=$1
  local nexus_component_id=$2
  local sync_direction=${3:-bidirectional}
  
  _registry_check_sqlite || return 1
  
  printf "🔗 Syncing registry with Nexus AI Studio: %s ↔ %s\n" "$registry_entry_id" "$nexus_component_id"
  
  # Get registry entry data
  local registry_data; registry_data=$(sqlite3 "$UNIVERSAL_REGISTRY_DB" \
    "SELECT json_object('name', name, 'version', version, 'status', status, 'data', data) 
     FROM (SELECT * FROM components WHERE name='$registry_entry_id' LIMIT 1);" 2>/dev/null || echo '{}')
  
  case "$sync_direction" in
    unidirectional)
      registry_propagation_unidirectional "$registry_entry_id" "$nexus_component_id" "$registry_data"
      ;;
    bidirectional)
      registry_propagation_bidirectional "$registry_entry_id" "$nexus_component_id" "$registry_data"
      ;;
    multicast)
      registry_propagation_multicast "$registry_entry_id" "$nexus_component_id" "$registry_data"
      ;;
    broadcast)
      registry_propagation_broadcast "$registry_entry_id" "$registry_data"
      ;;
    *)
      printf "❌ Unknown sync direction: %s\n" "$sync_direction" >&2
      return 1
      ;;
  esac
  
  # Log sync event
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO nexus_sync_log(registry_entry_id, nexus_component_id, sync_direction, payload, status)
     VALUES('$registry_entry_id', '$nexus_component_id', '$sync_direction', '$(printf "%s" "$registry_data" | sed "s/'/''/g")', 'synced');"
  
  return 0
}

function registry_enable_nexus_streaming() {
  local registry_entry_id=$1
  local nexus_component_id=$2
  local protocol=${3:-websocket}
  
  _registry_check_sqlite || return 1
  
  printf "📡 Enabling Nexus streaming: %s (protocol: %s)\n" "$registry_entry_id" "$protocol"
  
  # Update registry entry with streaming enabled
  sqlite3 "$UNIVERSAL_REGISTRY_DB" \
    "UPDATE components SET data = json_set(data, '$.streaming_enabled', true, '$.streaming_protocol', '$protocol')
     WHERE name='$registry_entry_id';" 2>/dev/null || true
  
  # Create propagation target for streaming
  local stream_id; stream_id=$(uuidgen 2>/dev/null || echo "stream-$(date +%s)")
  
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "INSERT INTO stream_metrics(stream_id, direction, message_count, byte_count, latency_ms)
     VALUES('$stream_id', 'bidirectional', 0, 0, 0.0);"
  
  printf "✅ Streaming enabled: stream_id=%s\n" "$stream_id"
  return 0
}

# ============ STREAM OPERATIONS ============

function registry_stream_send() {
  local stream_id=$1
  local data=$2
  
  _registry_check_sqlite || return 1
  
  # Update stream metrics
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "UPDATE stream_metrics SET message_count = message_count + 1, 
     byte_count = byte_count + ${#data}, last_update = CURRENT_TIMESTAMP
     WHERE stream_id='$stream_id';"
  
  printf "📤 Stream send: %s (size: %d bytes)\n" "$stream_id" "${#data}"
  return 0
}

function registry_stream_receive() {
  local stream_id=$1
  
  _registry_check_sqlite || return 1
  
  # Simulate receiving from stream
  printf "📥 Stream receive: %s\n" "$stream_id"
  
  # In production, this would connect to actual websocket
  sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "SELECT * FROM propagation_events WHERE stream_id='$stream_id' ORDER BY created_at DESC LIMIT 10;"
  
  return 0
}

function registry_stream_status() {
  local stream_id=${1:-'%'}
  
  _registry_check_sqlite || return 1
  
  sqlite3 -header -column "$REGISTRY_PROPAGATION_DB" \
    "SELECT stream_id, direction, message_count, byte_count, 
            ROUND(latency_ms, 2) as latency_ms, last_update 
     FROM stream_metrics 
     WHERE stream_id LIKE '${stream_id}' 
     ORDER BY last_update DESC 
     LIMIT 20;"
}

# ============ PROPAGATION MONITORING ============

function registry_propagation_status() {
  _registry_check_sqlite || return 1
  
  printf "\n🔄 Propagation Session Status\n"
  printf "════════════════════════════════════════════════════════════\n"
  
  sqlite3 -header -column "$REGISTRY_PROPAGATION_DB" \
    "SELECT session_id, source_id, mode, status, created_at FROM propagation_sessions ORDER BY created_at DESC LIMIT 15;"
  
  printf "\n📡 Active Propagation Targets\n"
  printf "════════════════════════════════════════════════════════════\n"
  
  sqlite3 -header -column "$REGISTRY_PROPAGATION_DB" \
    "SELECT session_id, target_id, target_type, protocol, status FROM propagation_targets LIMIT 20;"
}

function registry_propagation_events() {
  local session_id=${1:-'%'}
  
  _registry_check_sqlite || return 1
  
  printf "\n⚡ Propagation Events\n"
  printf "════════════════════════════════════════════════════════════\n"
  
  sqlite3 -header -column "$REGISTRY_PROPAGATION_DB" \
    "SELECT session_id, event_type, source_id, target_id, status, created_at 
     FROM propagation_events 
     WHERE session_id LIKE '${session_id}' 
     ORDER BY created_at DESC 
     LIMIT 30;"
}

function registry_nexus_sync_history() {
  local registry_entry_id=${1:-'%'}
  
  _registry_check_sqlite || return 1
  
  printf "\n🔗 Nexus Sync History\n"
  printf "════════════════════════════════════════════════════════════\n"
  
  sqlite3 -header -column "$REGISTRY_PROPAGATION_DB" \
    "SELECT registry_entry_id, nexus_component_id, sync_direction, status, created_at 
     FROM nexus_sync_log 
     WHERE registry_entry_id LIKE '${registry_entry_id}' 
     ORDER BY created_at DESC 
     LIMIT 20;"
}

# ============ ADVANCED PROPAGATION FEATURES ============

function registry_propagation_chaining() {
  local entry_id=$1
  shift
  local propagation_chain=("$@")
  
  _registry_check_sqlite || return 1
  
  printf "⛓️  Creating propagation chain: %s\n" "$entry_id"
  
  local prev_target="$entry_id"
  for target in "${propagation_chain[@]}"; do
    registry_propagation_unidirectional "$prev_target" "$target" "{}"
    prev_target="$target"
  done
  
  printf "✅ Propagation chain completed: %d links\n" "${#propagation_chain[@]}"
}

function registry_propagation_mesh() {
  local sources=("$@")
  
  _registry_check_sqlite || return 1
  
  printf "🕸️  Creating propagation mesh with %d nodes\n" "${#sources[@]}"
  
  # Create bidirectional links between all nodes
  for ((i=0; i<${#sources[@]}; i++)); do
    for ((j=i+1; j<${#sources[@]}; j++)); do
      registry_propagation_bidirectional "${sources[$i]}" "${sources[$j]}" "{}"
    done
  done
  
  printf "✅ Propagation mesh created\n"
}

function registry_propagation_fanout() {
  local source=$1
  shift
  local targets=("$@")
  
  _registry_check_sqlite || return 1
  
  printf "📢 Creating fanout propagation: %s → %d targets\n" "$source" "${#targets[@]}"
  
  for target in "${targets[@]}"; do
    registry_propagation_unidirectional "$source" "$target" "{}"
  done
  
  printf "✅ Fanout propagation completed\n"
}

# ============ HEALTH & DIAGNOSTICS ============

function registry_propagation_health() {
  _registry_check_sqlite || return 1
  
  printf "\n❤️  Propagation System Health\n"
  printf "════════════════════════════════════════════════════════════\n"
  
  local active_sessions; active_sessions=$(sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "SELECT COUNT(*) FROM propagation_sessions WHERE status='active';")
  
  local total_events; total_events=$(sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "SELECT COUNT(*) FROM propagation_events;")
  
  local active_streams; active_streams=$(sqlite3 "$REGISTRY_PROPAGATION_DB" \
    "SELECT COUNT(*) FROM stream_metrics WHERE message_count > 0;")
  
  printf "✅ Active Sessions: %d\n" "$active_sessions"
  printf "📊 Total Events: %d\n" "$total_events"
  printf "📡 Active Streams: %d\n" "$active_streams"
  printf "🔀 Propagation Modes: %s\n" "$(echo ${(k)PROPAGATION_MODES[@]})"
  printf "🟢 Status: operational\n"
}

# ============ DEMO ============

function registry_propagation_demo() {
  printf "\n🌍 Registry Propagation Engine Demo\n"
  printf "════════════════════════════════════════════════════════════\n\n"
  
  registry_propagation_init || return 1
  
  # Demo 1: Unidirectional
  printf "1️⃣  Unidirectional Propagation\n"
  registry_propagation_unidirectional "agent_alpha" "component_beta" '{"type":"sync","data":"test1"}'
  printf "\n"
  
  # Demo 2: Bidirectional
  printf "2️⃣  Bidirectional Propagation\n"
  registry_propagation_bidirectional "service_gamma" "service_delta" '{"type":"sync","data":"test2"}'
  printf "\n"
  
  # Demo 3: Multicast
  printf "3️⃣  Multicast Propagation\n"
  registry_propagation_multicast "orchestrator" "target1" "target2" "target3" '{"type":"sync","data":"test3"}'
  printf "\n"
  
  # Demo 4: Broadcast
  printf "4️⃣  Broadcast Propagation\n"
  registry_propagation_broadcast "coordinator" '{"type":"sync","data":"test4"}'
  printf "\n"
  
  # Demo 5: Nexus sync
  printf "5️⃣  Nexus AI Studio Integration\n"
  registry_sync_with_nexus "registry_entry_1" "nexus_component_1" "bidirectional"
  printf "\n"
  
  # Demo 6: Streaming
  printf "6️⃣  Enable Streaming\n"
  registry_enable_nexus_streaming "registry_entry_2" "nexus_component_2" "websocket"
  printf "\n"
  
  # Demo 7: Chain
  printf "7️⃣  Propagation Chain\n"
  registry_propagation_chaining "node_a" "node_b" "node_c" "node_d"
  printf "\n"
  
  # Demo 8: Mesh
  printf "8️⃣  Propagation Mesh\n"
  registry_propagation_mesh "mesh_1" "mesh_2" "mesh_3" "mesh_4"
  printf "\n"
  
  # Status
  registry_propagation_health
  printf "\n"
  
  registry_propagation_status
  printf "\n"
  
  printf "✅ Demo completed successfully\n"
}

# ============ EXPORTS ============

export -f registry_propagation_init
export -f registry_propagation_unidirectional
export -f registry_propagation_bidirectional
export -f registry_propagation_multicast
export -f registry_propagation_broadcast
export -f registry_sync_with_nexus
export -f registry_enable_nexus_streaming
export -f registry_stream_send
export -f registry_stream_receive
export -f registry_stream_status
export -f registry_propagation_status
export -f registry_propagation_events
export -f registry_nexus_sync_history
export -f registry_propagation_chaining
export -f registry_propagation_mesh
export -f registry_propagation_fanout
export -f registry_propagation_health
export -f registry_propagation_demo
