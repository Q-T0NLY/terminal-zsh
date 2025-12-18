#!/usr/bin/env zsh
# ═══════════════════════════════════════════════════════════════════════════
# Performance Monitoring Library
# Provides benchmarking, profiling, and performance tracking
# ═══════════════════════════════════════════════════════════════════════════

# Namespace: perflib
typeset -A PERFLIB_CONFIG
PERFLIB_CONFIG=(
    metrics_dir "${HOME}/.local/share/nova/metrics"
    metrics_file "performance.json"
    enabled true
)

# Performance metrics storage
typeset -A PERFLIB_TIMERS
typeset -A PERFLIB_COUNTERS
typeset -A PERFLIB_STATS

# ═══════════════════════════════════════════════════════════════════════════
# TIMING
# ═══════════════════════════════════════════════════════════════════════════

# Start a timer
# Usage: perflib::timer_start <name>
perflib::timer_start() {
    local name="$1"
    PERFLIB_TIMERS[$name]=$(date +%s.%N)
}

# Stop a timer and get elapsed time
# Usage: perflib::timer_stop <name>
perflib::timer_stop() {
    local name="$1"
    
    if [[ -z "${PERFLIB_TIMERS[$name]}" ]]; then
        echo "Timer '$name' not started" >&2
        return 1
    fi
    
    local start=${PERFLIB_TIMERS[$name]}
    local end=$(date +%s.%N)
    
    # Use bc if available, otherwise use zsh arithmetic (less precise)
    local elapsed
    if command -v bc &>/dev/null; then
        elapsed=$(echo "$end - $start" | bc)
    else
        # Fallback to integer arithmetic (loses decimal precision)
        elapsed=$((${end%.*} - ${start%.*}))
    fi
    
    # Store metric
    perflib::_record_metric "timer" "$name" "$elapsed"
    
    echo "$elapsed"
}

# Time a command execution
# Usage: perflib::time_command <name> <command> [args...]
perflib::time_command() {
    local name="$1"
    shift
    local command="$@"
    
    perflib::timer_start "$name"
    
    local exit_code=0
    eval "$command" || exit_code=$?
    
    local elapsed=$(perflib::timer_stop "$name")
    
    echo "⏱️  $name took ${elapsed}s" >&2
    
    return $exit_code
}

# ═══════════════════════════════════════════════════════════════════════════
# COUNTERS
# ═══════════════════════════════════════════════════════════════════════════

# Increment a counter
# Usage: perflib::counter_inc <name> [amount]
perflib::counter_inc() {
    local name="$1"
    local amount="${2:-1}"
    
    local current=${PERFLIB_COUNTERS[$name]:-0}
    PERFLIB_COUNTERS[$name]=$((current + amount))
    
    perflib::_record_metric "counter" "$name" "${PERFLIB_COUNTERS[$name]}"
}

# Get counter value
# Usage: perflib::counter_get <name>
perflib::counter_get() {
    local name="$1"
    echo "${PERFLIB_COUNTERS[$name]:-0}"
}

# Reset counter
# Usage: perflib::counter_reset <name>
perflib::counter_reset() {
    local name="$1"
    PERFLIB_COUNTERS[$name]=0
}

# ═══════════════════════════════════════════════════════════════════════════
# STATISTICS
# ═══════════════════════════════════════════════════════════════════════════

# Record a metric value
# Usage: perflib::stat_record <name> <value>
perflib::stat_record() {
    local name="$1"
    local value="$2"
    
    # Initialize if needed
    if [[ -z "${PERFLIB_STATS[$name]}" ]]; then
        PERFLIB_STATS[$name]="$value"
    else
        PERFLIB_STATS[$name]="${PERFLIB_STATS[$name]},$value"
    fi
    
    perflib::_record_metric "stat" "$name" "$value"
}

# Calculate statistics
# Usage: perflib::stat_summary <name>
perflib::stat_summary() {
    local name="$1"
    
    if [[ -z "${PERFLIB_STATS[$name]}" ]]; then
        echo "No stats for '$name'" >&2
        return 1
    fi
    
    local values=(${(s:,:)PERFLIB_STATS[$name]})
    local count=${#values[@]}
    
    # Calculate sum, min, max
    local sum=0
    local min=${values[1]}
    local max=${values[1]}
    
    for val in "${values[@]}"; do
        sum=$(echo "$sum + $val" | bc)
        
        if (( $(echo "$val < $min" | bc -l) )); then
            min=$val
        fi
        
        if (( $(echo "$val > $max" | bc -l) )); then
            max=$val
        fi
    done
    
    local avg=$(echo "scale=6; $sum / $count" | bc)
    
    cat <<EOF
Statistics for '$name':
  Count: $count
  Min:   $min
  Max:   $max
  Avg:   $avg
  Sum:   $sum
EOF
}

# ═══════════════════════════════════════════════════════════════════════════
# BENCHMARKING
# ═══════════════════════════════════════════════════════════════════════════

# Benchmark a command (run multiple times)
# Usage: perflib::benchmark <iterations> <command> [args...]
perflib::benchmark() {
    local iterations="$1"
    shift
    local command="$@"
    
    echo "Benchmarking: $command (${iterations} iterations)" >&2
    
    local i
    for ((i = 1; i <= iterations; i++)); do
        perflib::timer_start "bench_${i}"
        eval "$command" >/dev/null 2>&1 || true
        local elapsed=$(perflib::timer_stop "bench_${i}")
        perflib::stat_record "benchmark" "$elapsed"
    done
    
    perflib::stat_summary "benchmark"
}

# ═══════════════════════════════════════════════════════════════════════════
# STARTUP TIME TRACKING
# ═══════════════════════════════════════════════════════════════════════════

# Track startup time for shell initialization
perflib::track_startup() {
    local component="$1"
    
    if [[ -z "$PERFLIB_STARTUP_TIME" ]]; then
        PERFLIB_STARTUP_TIME=$(date +%s.%N)
    fi
    
    local current=$(date +%s.%N)
    local elapsed=$(echo "$current - $PERFLIB_STARTUP_TIME" | bc)
    
    echo "  ⏱️  $component: +${elapsed}s" >&2
    perflib::_record_metric "startup" "$component" "$elapsed"
}

# ═══════════════════════════════════════════════════════════════════════════
# METRICS PERSISTENCE
# ═══════════════════════════════════════════════════════════════════════════

perflib::_record_metric() {
    local type="$1"
    local name="$2"
    local value="$3"
    
    if [[ "${PERFLIB_CONFIG[enabled]}" != "true" ]]; then
        return 0
    fi
    
    local metrics_file="${PERFLIB_CONFIG[metrics_dir]}/${PERFLIB_CONFIG[metrics_file]}"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # Ensure directory exists
    mkdir -p "${PERFLIB_CONFIG[metrics_dir]}"
    
    # Append metric
    local metric="{\"timestamp\":\"$timestamp\",\"type\":\"$type\",\"name\":\"$name\",\"value\":$value}"
    echo "$metric" >> "$metrics_file"
}

# Export metrics summary
perflib::export_metrics() {
    local output_file="${1:-${PERFLIB_CONFIG[metrics_dir]}/summary.json}"
    
    cat > "$output_file" <<EOF
{
  "timers": $(typeset -p PERFLIB_TIMERS | sed 's/^typeset -A PERFLIB_TIMERS=//'),
  "counters": $(typeset -p PERFLIB_COUNTERS | sed 's/^typeset -A PERFLIB_COUNTERS=//'),
  "stats": $(typeset -p PERFLIB_STATS | sed 's/^typeset -A PERFLIB_STATS=//')
}
EOF
    
    echo "Metrics exported to: $output_file"
}

# ═══════════════════════════════════════════════════════════════════════════
# REPORTING
# ═══════════════════════════════════════════════════════════════════════════

perflib::report() {
    echo "=== Performance Report ==="
    echo
    
    echo "Timers:"
    for name in "${(@k)PERFLIB_TIMERS}"; do
        echo "  $name: ${PERFLIB_TIMERS[$name]}s"
    done
    echo
    
    echo "Counters:"
    for name in "${(@k)PERFLIB_COUNTERS}"; do
        echo "  $name: ${PERFLIB_COUNTERS[$name]}"
    done
    echo
    
    echo "Statistics:"
    for name in "${(@k)PERFLIB_STATS}"; do
        perflib::stat_summary "$name"
        echo
    done
}

# ═══════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

# Ensure metrics directory exists
mkdir -p "${PERFLIB_CONFIG[metrics_dir]}"

# Export functions
autoload -Uz perflib::timer_start
autoload -Uz perflib::timer_stop
autoload -Uz perflib::time_command
autoload -Uz perflib::counter_inc
autoload -Uz perflib::counter_get
autoload -Uz perflib::counter_reset
autoload -Uz perflib::stat_record
autoload -Uz perflib::stat_summary
autoload -Uz perflib::benchmark
autoload -Uz perflib::track_startup
autoload -Uz perflib::export_metrics
autoload -Uz perflib::report
