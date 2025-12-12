#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# NovaSystem Real-Time System Monitor v3.0
# Source Nova core for unified logging and robust ERR handling
if [[ -z "${NOVA_ROOT:-}" ]]; then
    typeset -g NOVA_ROOT="${0:a:h}/../.."
fi
if [[ -f "${NOVA_ROOT}/src/core/nova_core.zsh" ]]; then
    source "${NOVA_ROOT}/src/core/nova_core.zsh"
else
    nova_info() { echo "[INFO] $*"; }
    nova_warn() { echo "[WARN] $*"; }
    nova_error() { echo "[ERROR] $*" >&2; }
    nova_debug() { [[ -n "$NOVA_DEBUG" ]] && echo "[DEBUG] $*"; }
fi
# Production-Grade System Resource Monitoring for macOS
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# QUANTUM HEADER MATRIX
# ═══════════════════════════════════════════════════════════════════════════
#  ███╗   ███╗ ██████╗ ███╗   ██╗██╗████████╗ ██████╗ ██████╗ 
#  ████╗ ████║██╔═══██╗████╗  ██║██║╚══██╔══╝██╔═══██╗██╔══██╗
#  ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║   ██║   ██║██████╔╝
#  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║   ██║   ██║██╔══██╗
#  ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║   ╚██████╔╝██║  ██║
#  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

export NOVA_MONITOR_INTERVAL="${NOVA_MONITOR_INTERVAL:-2}"
export NOVA_MONITOR_HISTORY_SIZE="${NOVA_MONITOR_HISTORY_SIZE:-60}"
export NOVA_MONITOR_CACHE="${NOVA_CACHE_DIR}/monitor_metrics.json"

# Alert thresholds
export NOVA_CPU_WARN_THRESHOLD=70
export NOVA_CPU_CRIT_THRESHOLD=90
export NOVA_MEM_WARN_THRESHOLD=80
export NOVA_MEM_CRIT_THRESHOLD=95
export NOVA_DISK_WARN_THRESHOLD=80
export NOVA_DISK_CRIT_THRESHOLD=90

# Metric history storage
typeset -A NOVA_CPU_HISTORY
typeset -A NOVA_MEM_HISTORY
typeset -A NOVA_NET_HISTORY

# ═══════════════════════════════════════════════════════════════════════════
# CPU MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_cpu() {
    # Get CPU usage using top
    local cpu_usage=$(top -l 2 -n 0 -stats pid,cpu | tail -n +13 | awk '{sum += $2} END {print int(sum)}')
    
    # Get per-core CPU usage (macOS specific)
    local cpu_user=$(ps -A -o %cpu | awk '{s+=$1} END {print int(s)}')
    
    # Get load averages
    local load_avg=$(sysctl -n vm.loadavg | awk '{print $2","$3","$4}')
    IFS=',' read -r load1 load5 load15 <<< "$load_avg"
    
    # Get CPU core count
    local cpu_cores=$(sysctl -n hw.ncpu)
    
    # Calculate percentage based on cores
    local cpu_percent=$(echo "scale=2; $cpu_user / $cpu_cores" | bc)
    
    # Store in history
    local timestamp=$(date +%s)
    NOVA_CPU_HISTORY[$timestamp]="$cpu_percent"
    
    # Return JSON
    cat <<EOF
{
  "cpu_percent": $(printf "%.1f" $cpu_percent),
  "load_1min": $(printf "%.2f" $load1),
  "load_5min": $(printf "%.2f" $load5),
  "load_15min": $(printf "%.2f" $load15),
  "cores": $cpu_cores,
  "timestamp": $timestamp
}
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# MEMORY MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_memory() {
    # Get memory statistics using vm_stat
    local vm_stat_output=$(vm_stat)
    
    # Extract page size
    local page_size=$(echo "$vm_stat_output" | grep "page size" | awk '{print $8}')
    
    # Extract various memory stats
    local pages_free=$(echo "$vm_stat_output" | grep "Pages free" | awk '{print $3}' | tr -d '.')
    local pages_active=$(echo "$vm_stat_output" | grep "Pages active" | awk '{print $3}' | tr -d '.')
    local pages_inactive=$(echo "$vm_stat_output" | grep "Pages inactive" | awk '{print $3}' | tr -d '.')
    local pages_speculative=$(echo "$vm_stat_output" | grep "Pages speculative" | awk '{print $3}' | tr -d '.')
    local pages_wired=$(echo "$vm_stat_output" | grep "Pages wired down" | awk '{print $4}' | tr -d '.')
    local pages_compressed=$(echo "$vm_stat_output" | grep "Pages occupied by compressor" | awk '{print $5}' | tr -d '.')
    
    # Get total physical memory
    local total_mem=$(sysctl -n hw.memsize)
    local total_mem_gb=$(echo "scale=2; $total_mem / 1073741824" | bc)
    
    # Calculate memory in bytes
    local mem_wired=$((pages_wired * page_size))
    local mem_active=$((pages_active * page_size))
    local mem_inactive=$((pages_inactive * page_size))
    local mem_free=$((pages_free * page_size))
    local mem_compressed=$((pages_compressed * page_size))
    
    # Calculate used memory
    local mem_used=$((mem_wired + mem_active + mem_compressed))
    local mem_used_gb=$(echo "scale=2; $mem_used / 1073741824" | bc)
    
    # Calculate memory percentage
    local mem_percent=$(echo "scale=2; ($mem_used / $total_mem) * 100" | bc)
    
    # Get swap usage
    local swap_usage=$(sysctl -n vm.swapusage | awk '{print $7}' | tr -d 'M')
    
    # Store in history
    local timestamp=$(date +%s)
    NOVA_MEM_HISTORY[$timestamp]="$mem_percent"
    
    # Return JSON
    cat <<EOF
{
  "total_gb": $(printf "%.2f" $total_mem_gb),
  "used_gb": $(printf "%.2f" $mem_used_gb),
  "free_gb": $(printf "%.2f" $(echo "scale=2; $mem_free / 1073741824" | bc)),
  "percent": $(printf "%.1f" $mem_percent),
  "swap_used_mb": $(printf "%.0f" ${swap_usage:-0}),
  "compressed_gb": $(printf "%.2f" $(echo "scale=2; $mem_compressed / 1073741824" | bc)),
  "timestamp": $timestamp
}
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# DISK MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_disk() {
    # Get disk usage for root volume
    local disk_info=$(df -h / | tail -1)
    
    local total_size=$(echo "$disk_info" | awk '{print $2}')
    local used_size=$(echo "$disk_info" | awk '{print $3}')
    local available_size=$(echo "$disk_info" | awk '{print $4}')
    local use_percent=$(echo "$disk_info" | awk '{print $5}' | tr -d '%')
    
    # Get I/O statistics using iostat
    local iostat_output=$(iostat -d disk0 | tail -1)
    local kb_per_transfer=$(echo "$iostat_output" | awk '{print $2}')
    local transfers=$(echo "$iostat_output" | awk '{print $3}')
    local mb_per_sec=$(echo "$iostat_output" | awk '{print $4}')
    
    # Return JSON
    cat <<EOF
{
  "total": "$total_size",
  "used": "$used_size",
  "available": "$available_size",
  "percent": $use_percent,
  "io_kb_per_transfer": $(printf "%.1f" ${kb_per_transfer:-0}),
  "io_transfers": $(printf "%.0f" ${transfers:-0}),
  "io_mb_per_sec": $(printf "%.2f" ${mb_per_sec:-0}),
  "timestamp": $(date +%s)
}
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# NETWORK MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_network() {
    # Get network statistics using netstat
    local netstat_output=$(netstat -ib | grep -E 'en0|en1' | head -1)
    
    if [[ -n "$netstat_output" ]]; then
        local interface=$(echo "$netstat_output" | awk '{print $1}')
        local mtu=$(echo "$netstat_output" | awk '{print $4}')
        local bytes_in=$(echo "$netstat_output" | awk '{print $7}')
        local bytes_out=$(echo "$netstat_output" | awk '{print $10}')
        
        # Calculate bandwidth if we have previous data
        local timestamp=$(date +%s)
        local prev_data="${NOVA_NET_HISTORY[$interface]}"
        
        if [[ -n "$prev_data" ]]; then
            IFS=',' read -r prev_time prev_in prev_out <<< "$prev_data"
            local time_diff=$((timestamp - prev_time))
            
            if [[ $time_diff -gt 0 ]]; then
                local bandwidth_in=$(echo "scale=2; ($bytes_in - $prev_in) / $time_diff / 1024" | bc)
                local bandwidth_out=$(echo "scale=2; ($bytes_out - $prev_out) / $time_diff / 1024" | bc)
            else
                local bandwidth_in=0
                local bandwidth_out=0
            fi
        else
            local bandwidth_in=0
            local bandwidth_out=0
        fi
        
        # Store current data for next calculation
        NOVA_NET_HISTORY[$interface]="$timestamp,$bytes_in,$bytes_out"
        
        # Get connection count
        local connection_count=$(netstat -an | grep ESTABLISHED | wc -l | tr -d ' ')
        
        # Return JSON
        cat <<EOF
{
  "interface": "$interface",
  "mtu": $mtu,
  "bytes_in": $bytes_in,
  "bytes_out": $bytes_out,
  "bandwidth_in_kb": $(printf "%.2f" ${bandwidth_in:-0}),
  "bandwidth_out_kb": $(printf "%.2f" ${bandwidth_out:-0}),
  "connections": $connection_count,
  "timestamp": $timestamp
}
EOF
    else
        cat <<EOF
{
  "interface": "unknown",
  "error": "No network interface found",
  "timestamp": $(date +%s)
}
EOF
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# PROCESS MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_top_processes() {
    local limit="${1:-10}"
    
    # Get top processes by CPU
    local top_cpu=$(ps aux | sort -k3 -r | head -n $((limit + 1)) | tail -n $limit | \
        awk '{printf "{\"user\":\"%s\",\"pid\":%s,\"cpu\":%.1f,\"mem\":%.1f,\"command\":\"%s\"},", $1, $2, $3, $4, $11}')
    top_cpu="[${top_cpu%,}]"
    
    # Get top processes by Memory
    local top_mem=$(ps aux | sort -k4 -r | head -n $((limit + 1)) | tail -n $limit | \
        awk '{printf "{\"user\":\"%s\",\"pid\":%s,\"cpu\":%.1f,\"mem\":%.1f,\"command\":\"%s\"},", $1, $2, $3, $4, $11}')
    top_mem="[${top_mem%,}]"
    
    # Get total process count
    local process_count=$(ps aux | wc -l | tr -d ' ')
    
    # Return JSON
    cat <<EOF
{
  "top_cpu": $top_cpu,
  "top_memory": $top_mem,
  "total_processes": $process_count,
  "timestamp": $(date +%s)
}
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# COMPREHENSIVE METRICS COLLECTION
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_collect_all() {
    local cpu_data=$(nova_monitor_cpu)
    local mem_data=$(nova_monitor_memory)
    local disk_data=$(nova_monitor_disk)
    local net_data=$(nova_monitor_network)
    local proc_data=$(nova_monitor_top_processes 5)
    
    # Combine into single JSON
    cat <<EOF
{
  "cpu": $cpu_data,
  "memory": $mem_data,
  "disk": $disk_data,
  "network": $net_data,
  "processes": $proc_data,
  "timestamp": $(date +%s)
}
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# ALERT SYSTEM
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_check_alerts() {
    local metrics="$1"
    
    # Extract values using jq
    local cpu_percent=$(echo "$metrics" | jq -r '.cpu.cpu_percent')
    local mem_percent=$(echo "$metrics" | jq -r '.memory.percent')
    local disk_percent=$(echo "$metrics" | jq -r '.disk.percent')
    
    # Check CPU alerts
    if (( $(echo "$cpu_percent > $NOVA_CPU_CRIT_THRESHOLD" | bc -l) )); then
        nova_error "🔥 CRITICAL: CPU usage at ${cpu_percent}%"
        osascript -e "display notification \"CPU usage critical: ${cpu_percent}%\" with title \"NovaSystem Alert\""
    elif (( $(echo "$cpu_percent > $NOVA_CPU_WARN_THRESHOLD" | bc -l) )); then
        nova_warn "⚠️  WARNING: CPU usage at ${cpu_percent}%"
    fi
    
    # Check Memory alerts
    if (( $(echo "$mem_percent > $NOVA_MEM_CRIT_THRESHOLD" | bc -l) )); then
        nova_error "🔥 CRITICAL: Memory usage at ${mem_percent}%"
        osascript -e "display notification \"Memory usage critical: ${mem_percent}%\" with title \"NovaSystem Alert\""
    elif (( $(echo "$mem_percent > $NOVA_MEM_WARN_THRESHOLD" | bc -l) )); then
        nova_warn "⚠️  WARNING: Memory usage at ${mem_percent}%"
    fi
    
    # Check Disk alerts
    if (( disk_percent > NOVA_DISK_CRIT_THRESHOLD )); then
        nova_error "🔥 CRITICAL: Disk usage at ${disk_percent}%"
        osascript -e "display notification \"Disk usage critical: ${disk_percent}%\" with title \"NovaSystem Alert\""
    elif (( disk_percent > NOVA_DISK_WARN_THRESHOLD )); then
        nova_warn "⚠️  WARNING: Disk usage at ${disk_percent}%"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# VISUALIZATION HELPERS
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_sparkline() {
    local -a data=("${@}")
    local max_value=100
    local bars="▁▂▃▄▅▆▇█"
    local output=""
    
    for value in "${data[@]}"; do
        local index=$(echo "scale=0; ($value / $max_value) * 7" | bc)
        [[ $index -gt 7 ]] && index=7
        [[ $index -lt 0 ]] && index=0
        output+="${bars:$index:1}"
    done
    
    echo "$output"
}

nova_monitor_progress_bar() {
    local percent="$1"
    local width="${2:-20}"
    local filled=$(echo "scale=0; ($percent / 100) * $width" | bc)
    local empty=$((width - filled))
    
    # Color based on percentage
    local color=""
    if (( $(echo "$percent > 90" | bc -l) )); then
        color="\033[31m"  # Red
    elif (( $(echo "$percent > 70" | bc -l) )); then
        color="\033[33m"  # Yellow
    else
        color="\033[32m"  # Green
    fi
    
    local bar=""
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done
    
    echo -e "${color}${bar}\033[0m $(printf "%5.1f%%" $percent)"
}

# ═══════════════════════════════════════════════════════════════════════════
# DASHBOARD DISPLAY
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_dashboard() {
    clear
    
    # Collect all metrics
    local metrics=$(nova_monitor_collect_all)
    
    # Check for alerts
    nova_monitor_check_alerts "$metrics"
    
    # Extract individual metrics
    local cpu_percent=$(echo "$metrics" | jq -r '.cpu.cpu_percent')
    local load1=$(echo "$metrics" | jq -r '.cpu.load_1min')
    local load5=$(echo "$metrics" | jq -r '.cpu.load_5min')
    
    local mem_used=$(echo "$metrics" | jq -r '.memory.used_gb')
    local mem_total=$(echo "$metrics" | jq -r '.memory.total_gb')
    local mem_percent=$(echo "$metrics" | jq -r '.memory.percent')
    
    local disk_used=$(echo "$metrics" | jq -r '.disk.used')
    local disk_total=$(echo "$metrics" | jq -r '.disk.total')
    local disk_percent=$(echo "$metrics" | jq -r '.disk.percent')
    
    local net_in=$(echo "$metrics" | jq -r '.network.bandwidth_in_kb')
    local net_out=$(echo "$metrics" | jq -r '.network.bandwidth_out_kb')
    
    # Display dashboard
    cat <<EOF
╔═══════════════════════════════════════════════════════════════════════════╗
║                    NovaSystem Real-Time Monitor v3.0                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║
║ 🖥️  CPU Usage
║    $(nova_monitor_progress_bar $cpu_percent 50)
║    Load Averages: $(printf "%.2f" $load1) / $(printf "%.2f" $load5)
║
║ 💾 Memory Usage
║    $(nova_monitor_progress_bar $mem_percent 50)
║    Used: $(printf "%.2f" $mem_used)GB / $(printf "%.2f" $mem_total)GB
║
║ 💿 Disk Usage
║    $(nova_monitor_progress_bar $disk_percent 50)
║    Used: $disk_used / $disk_total
║
║ 🌐 Network
║    ↓ In:  $(printf "%8.2f" $net_in) KB/s
║    ↑ Out: $(printf "%8.2f" $net_out) KB/s
║
╚═══════════════════════════════════════════════════════════════════════════╝

Press Ctrl+C to exit
EOF
    
    # Save metrics to cache
    echo "$metrics" > "$NOVA_MONITOR_CACHE"
}

# ═══════════════════════════════════════════════════════════════════════════
# BACKGROUND MONITORING
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_start_background() {
    local pid_file="${NOVA_DATA_DIR}/monitor.pid"
    
    # Check if already running
    if [[ -f "$pid_file" ]]; then
        local old_pid=$(cat "$pid_file")
        if ps -p $old_pid > /dev/null 2>&1; then
            nova_warn "Monitor already running with PID $old_pid"
            return 1
        fi
    fi
    
    # Start background monitoring
    (
        while true; do
            nova_monitor_collect_all > "$NOVA_MONITOR_CACHE"
            sleep $NOVA_MONITOR_INTERVAL
        done
    ) &
    
    echo $! > "$pid_file"
    nova_info "Background monitoring started with PID $!"
}

nova_monitor_stop_background() {
    local pid_file="${NOVA_DATA_DIR}/monitor.pid"
    
    if [[ -f "$pid_file" ]]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid
            rm "$pid_file"
            nova_info "Background monitoring stopped"
        else
            rm "$pid_file"
            nova_warn "Monitor process not found"
        fi
    else
        nova_warn "No monitor process running"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# MODULE INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

nova_monitor_init() {
    nova_debug "Initializing system monitor module"
    
    # Create cache file if it doesn't exist
    [[ -f "$NOVA_MONITOR_CACHE" ]] || echo '{}' > "$NOVA_MONITOR_CACHE"
    
    # Register commands
    alias nova-monitor='nova_safe_run nova_monitor_dashboard'
    alias nova-monitor-start='nova_safe_run nova_monitor_start_background'
    alias nova-monitor-stop='nova_safe_run nova_monitor_stop_background'
    
    nova_debug "System monitor module initialized"
}

# Export all functions
export -f nova_monitor_cpu nova_monitor_memory nova_monitor_disk nova_monitor_network
export -f nova_monitor_top_processes nova_monitor_collect_all
export -f nova_monitor_check_alerts nova_monitor_sparkline nova_monitor_progress_bar
export -f nova_monitor_dashboard nova_monitor_start_background nova_monitor_stop_background
export -f nova_monitor_init

# ═══════════════════════════════════════════════════════════════════════════
# 3D SYSTEM MONITORING ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════════════

cat >&2 <<'ARCHITECTURE'
        ╔════════════════════════════════════════╗
        ║    Real-Time Monitoring Engine         ║
        ╚═══════════════╦════════════════════════╝
                        ║
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼───┐      ┌───▼───┐      ┌───▼───┐
    │  CPU  │      │  MEM  │      │ DISK  │
    │Monitor│      │Monitor│      │Monitor│
    └───┬───┘      └───┬───┘      └───┬───┘
        │              │              │
        └──────┬───────┴──────┬───────┘
               │              │
          ┌────▼────┐    ┌───▼────┐
          │ Alert   │    │ Cache  │
          │ System  │    │ System │
          └─────────┘    └────────┘
ARCHITECTURE
