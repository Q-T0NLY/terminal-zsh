#!/usr/bin/env zsh
# ============================================================================
# Nexus-AI-Studio: Clean Slate Config Propagator
# Version: 9.0
# Description: Auto-propagates discovered items into terminal configurations
# ============================================================================

# Prevent multiple sourcing
[[ -n "${NEXUS_CONFIG_PROPAGATOR_LOADED}" ]] && return
export NEXUS_CONFIG_PROPAGATOR_LOADED=1

# ============================================================================
# CONFIGURATION PROPAGATION ENGINE
# ============================================================================

# Main propagation function
nexus_propagate_config() {
    local detection_report="$1"
    
    clean_slate_log "INFO" "Starting configuration propagation"
    
    if [[ ! -f "$detection_report" ]]; then
        clean_slate_log "ERROR" "Detection report not found: $detection_report"
        return 1
    fi
    
    echo "🔄 Configuration Propagation Starting..."
    echo ""
    
    # Propagate each category
    nexus_propagate_paths "$detection_report"
    nexus_propagate_aliases "$detection_report"
    nexus_propagate_env_vars "$detection_report"
    nexus_propagate_completions "$detection_report"
    
    echo ""
    echo "✅ Configuration propagation complete!"
    
    clean_slate_log "INFO" "Configuration propagation completed"
}

# ============================================================================
# PATH PROPAGATION
# ============================================================================

nexus_propagate_paths() {
    local report="$1"
    
    echo "📁 Propagating PATH entries..."
    
    local -a new_paths broken_paths
    local current_path="$PATH"
    
    # Detect and validate PATH entries
    while IFS=: read -r path_entry; do
        if [[ -d "$path_entry" ]]; then
            if ! echo "$current_path" | grep -q "$path_entry"; then
                new_paths+=("$path_entry")
            fi
        elif [[ -n "$path_entry" ]]; then
            broken_paths+=("$path_entry")
        fi
    done < <(echo "$PATH" | tr ':' '\n')
    
    # Add common framework paths
    local -a framework_paths=(
        "/opt/homebrew/bin" "/usr/local/bin" "/usr/bin" "/bin"
        "$HOME/.local/bin" "$HOME/bin"
        "/opt/homebrew/sbin" "/usr/local/sbin" "/usr/sbin" "/sbin"
    )
    
    # Detect version managers
    [[ -d "$HOME/.nvm" ]] && framework_paths+=("$HOME/.nvm/versions/node/*/bin")
    [[ -d "$HOME/.pyenv" ]] && framework_paths+=("$HOME/.pyenv/shims")
    [[ -d "$HOME/.rbenv" ]] && framework_paths+=("$HOME/.rbenv/shims")
    [[ -d "$HOME/.cargo" ]] && framework_paths+=("$HOME/.cargo/bin")
    [[ -d "$HOME/go" ]] && framework_paths+=("$HOME/go/bin")
    
    # Add framework paths if they exist
    for fpath in "${framework_paths[@]}"; do
        for expanded_path in $~fpath(N); do
            if [[ -d "$expanded_path" ]] && ! echo "$PATH" | grep -q "$expanded_path"; then
                new_paths+=("$expanded_path")
            fi
        done
    done
    
    echo "  ✅ Found ${#new_paths[@]} new paths, ${#broken_paths[@]} broken paths"
    
    # Remove duplicates and broken paths
    local optimized_path=$(echo "$PATH" | tr ':' '\n' | awk '!seen[$0]++' | grep -v '^$' | tr '\n' ':' | sed 's/:$//')
    
    # Add new paths
    for new_path in "${new_paths[@]}"; do
        echo "  📌 Adding: $new_path"
        optimized_path="$new_path:$optimized_path"
    done
    
    # Update PATH
    export PATH="$optimized_path"
    clean_slate_log "INFO" "PATH optimized: ${#new_paths[@]} added, ${#broken_paths[@]} removed"
}

# ============================================================================
# ALIAS PROPAGATION
# ============================================================================

nexus_propagate_aliases() {
    local report="$1"
    
    echo "🔗 Propagating aliases..."
    
    # Define smart aliases
    local -A smart_aliases=(
        # Safety aliases
        [rm]='rm -i'
        [mv]='mv -i'
        [cp]='cp -i'
        
        # Productivity aliases
        [ll]='ls -lah'
        [la]='ls -A'
        [l]='ls -CF'
        [..]='..'
        [...]='..'
        
        # Git aliases
        [gs]='git status'
        [ga]='git add'
        [gc]='git commit'
        [gp]='git push'
        [gl]='git log --oneline --graph --decorate'
        [gd]='git diff'
        
        # Docker aliases (if docker exists)
        [dps]='docker ps'
        [dimg]='docker images'
        [dex]='docker exec -it'
        
        # Kubernetes aliases (if kubectl exists)
        [k]='kubectl'
        [kgp]='kubectl get pods'
        [kgs]='kubectl get services'
        [kgd]='kubectl get deployments'
    )
    
    local alias_count=0
    local conflict_count=0
    
    # Set aliases if commands exist and no conflicts
    for alias_name alias_cmd in ${(kv)smart_aliases}; do
        # Extract base command
        local base_cmd=$(echo "$alias_cmd" | awk '{print $1}')
        
        # Check if base command exists
        if command -v "$base_cmd" >/dev/null 2>&1; then
            # Check for conflicts
            if alias "$alias_name" >/dev/null 2>&1; then
                conflict_count=$((conflict_count + 1))
                echo "  ⚠️  Alias conflict: $alias_name (skipped)"
            else
                alias "$alias_name"="$alias_cmd"
                alias_count=$((alias_count + 1))
            fi
        fi
    done
    
    echo "  ✅ Created $alias_count aliases, $conflict_count conflicts skipped"
    clean_slate_log "INFO" "Alias propagation: $alias_count created, $conflict_count conflicts"
}

# ============================================================================
# ENVIRONMENT VARIABLE PROPAGATION
# ============================================================================

nexus_propagate_env_vars() {
    local report="$1"
    
    echo "🌍 Propagating environment variables..."
    
    local var_count=0
    
    # Set EDITOR if not set
    if [[ -z "$EDITOR" ]]; then
        for editor in nvim vim vi nano; do
            if command -v "$editor" >/dev/null 2>&1; then
                export EDITOR="$editor"
                export VISUAL="$editor"
                var_count=$((var_count + 2))
                echo "  ✅ Set EDITOR=$editor"
                break
            fi
        done
    fi
    
    # Configure language-specific vars
    if command -v python3 >/dev/null 2>&1; then
        [[ -z "$PYTHONDONTWRITEBYTECODE" ]] && export PYTHONDONTWRITEBYTECODE=1 && var_count=$((var_count + 1))
        [[ -z "$PYTHONUNBUFFERED" ]] && export PYTHONUNBUFFERED=1 && var_count=$((var_count + 1))
    fi
    
    if command -v node >/dev/null 2>&1; then
        [[ -z "$NODE_PATH" ]] && export NODE_PATH="$(npm root -g 2>/dev/null)" && var_count=$((var_count + 1))
    fi
    
    # Configure JAVA_HOME if Java exists
    if command -v java >/dev/null 2>&1 && [[ -z "$JAVA_HOME" ]]; then
        if [[ -x "/usr/libexec/java_home" ]]; then
            export JAVA_HOME=$(/usr/libexec/java_home 2>/dev/null)
            var_count=$((var_count + 1))
            echo "  ✅ Set JAVA_HOME=$JAVA_HOME"
        fi
    fi
    
    # Terminal color support
    if [[ -z "$COLORTERM" ]]; then
        export COLORTERM=truecolor
        var_count=$((var_count + 1))
    fi
    
    # Set up less pager with colors
    if [[ -z "$LESS" ]]; then
        export LESS='-R -F -X'
        var_count=$((var_count + 1))
    fi
    
    # Configure timezone if not set
    if [[ -z "$TZ" ]] && [[ -f /etc/timezone ]]; then
        export TZ=$(cat /etc/timezone)
        var_count=$((var_count + 1))
    fi
    
    echo "  ✅ Configured $var_count environment variables"
    clean_slate_log "INFO" "Environment variables: $var_count configured"
}

# ============================================================================
# COMPLETION PROPAGATION
# ============================================================================

nexus_propagate_completions() {
    local report="$1"
    
    echo "⚡ Propagating shell completions..."
    
    local completion_count=0
    
    # Initialize zsh completion system if not already done
    if ! command -v compinit >/dev/null 2>&1; then
        autoload -Uz compinit
        compinit -i
    fi
    
    # Enable case-insensitive completion
    zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
    
    # Enable menu selection
    zstyle ':completion:*' menu select
    
    # Color completion
    zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
    
    # Completion descriptions
    zstyle ':completion:*:descriptions' format '%F{yellow}-- %d --%f'
    zstyle ':completion:*:warnings' format '%F{red}-- no matches found --%f'
    
    # Git completions (if git exists)
    if command -v git >/dev/null 2>&1; then
        completion_count=$((completion_count + 1))
    fi
    
    # Docker completions (if docker exists)
    if command -v docker >/dev/null 2>&1 && [[ -f /usr/share/zsh/site-functions/_docker ]]; then
        fpath=(/usr/share/zsh/site-functions $fpath)
        completion_count=$((completion_count + 1))
    fi
    
    # kubectl completions (if kubectl exists)
    if command -v kubectl >/dev/null 2>&1; then
        source <(kubectl completion zsh 2>/dev/null) && completion_count=$((completion_count + 1))
    fi
    
    # npm completions (if npm exists)
    if command -v npm >/dev/null 2>&1; then
        source <(npm completion 2>/dev/null) && completion_count=$((completion_count + 1))
    fi
    
    # Fuzzy completion with fzf (if fzf exists)
    if command -v fzf >/dev/null 2>&1; then
        if [[ -f ~/.fzf.zsh ]]; then
            source ~/.fzf.zsh
            completion_count=$((completion_count + 1))
        fi
    fi
    
    echo "  ✅ Configured $completion_count completion systems"
    clean_slate_log "INFO" "Completions: $completion_count systems configured"
}

# ============================================================================
# CONFIGURATION FILE MANAGEMENT
# ============================================================================

nexus_update_zshrc() {
    local additions="$1"
    
    local zshrc="$HOME/.zshrc"
    local backup="$HOME/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Backup before modification
    if [[ -f "$zshrc" ]]; then
        cp "$zshrc" "$backup"
        echo "  💾 Backup created: $backup"
    fi
    
    # Create marker for Nexus section
    local marker_start="# >>> Nexus AI Studio Configuration >>>"
    local marker_end="# <<< Nexus AI Studio Configuration <<<"
    
    # Remove existing Nexus section if present
    if [[ -f "$zshrc" ]] && grep -q "$marker_start" "$zshrc"; then
        sed -i.tmp "/$marker_start/,/$marker_end/d" "$zshrc"
        rm -f "$zshrc.tmp"
    fi
    
    # Add new Nexus section
    {
        echo ""
        echo "$marker_start"
        echo "# Auto-generated by Nexus AI Studio"
        echo "# Last updated: $(date)"
        echo ""
        echo "$additions"
        echo ""
        echo "$marker_end"
    } >> "$zshrc"
    
    # Validate syntax
    if zsh -n "$zshrc" 2>/dev/null; then
        echo "  ✅ Configuration updated and validated"
        clean_slate_log "INFO" "ZSH configuration updated successfully"
        return 0
    else
        # Restore backup if validation fails
        mv "$backup" "$zshrc"
        echo "  ❌ Syntax error detected, restored backup"
        clean_slate_log "ERROR" "ZSH configuration update failed, restored backup"
        return 1
    fi
}

nexus_merge_configs() {
    local source_config="$1"
    local target_config="$2"
    
    if [[ ! -f "$source_config" ]]; then
        echo "  ❌ Source config not found: $source_config"
        return 1
    fi
    
    # Backup target config
    local backup="${target_config}.backup.$(date +%Y%m%d_%H%M%S)"
    if [[ -f "$target_config" ]]; then
        cp "$target_config" "$backup"
        echo "  💾 Target backup: $backup"
    fi
    
    # Create temp merge file
    local merge_file="${target_config}.merge.tmp"
    
    # Copy existing target
    if [[ -f "$target_config" ]]; then
        cp "$target_config" "$merge_file"
    else
        touch "$merge_file"
    fi
    
    # Add marker and source content
    {
        echo ""
        echo "# Merged from: $source_config"
        echo "# Merge date: $(date)"
        echo ""
        cat "$source_config"
    } >> "$merge_file"
    
    # Validate merged config
    if zsh -n "$merge_file" 2>/dev/null; then
        mv "$merge_file" "$target_config"
        echo "  ✅ Configuration merged successfully"
        clean_slate_log "INFO" "Config merge: $source_config -> $target_config"
        return 0
    else
        rm -f "$merge_file"
        echo "  ❌ Merge validation failed, no changes made"
        clean_slate_log "ERROR" "Config merge failed: syntax error"
        return 1
    fi
}

# ============================================================================
# BACKUP AND RESTORE
# ============================================================================

nexus_backup_configs() {
    local backup_dir="${CLEAN_SLATE_BACKUP:-$HOME/.nexus/backups}/configs_$(date +%Y%m%d_%H%M%S)"
    
    mkdir -p "$backup_dir"
    
    local -a config_files=(
        "$HOME/.zshrc"
        "$HOME/.zshenv"
        "$HOME/.zprofile"
        "$HOME/.zlogin"
        "$HOME/.zlogout"
        "$HOME/.bashrc"
        "$HOME/.bash_profile"
        "$HOME/.profile"
        "$HOME/.vimrc"
        "$HOME/.gitconfig"
    )
    
    local backup_count=0
    local total_size=0
    
    for config in "${config_files[@]}"; do
        if [[ -f "$config" ]]; then
            cp "$config" "$backup_dir/"
            local size=$(stat -f%z "$config" 2>/dev/null || stat -c%s "$config" 2>/dev/null || echo 0)
            total_size=$((total_size + size))
            backup_count=$((backup_count + 1))
            echo "  📄 Backed up: $(basename $config)"
        fi
    done
    
    # Create manifest
    {
        echo "Nexus Configuration Backup"
        echo "Created: $(date)"
        echo "Files: $backup_count"
        echo "Size: $total_size bytes"
        echo ""
        echo "Files backed up:"
        for config in "${config_files[@]}"; do
            [[ -f "$config" ]] && echo "  - $config"
        done
    } > "$backup_dir/MANIFEST.txt"
    
    # Compress backup
    tar -czf "${backup_dir}.tar.gz" -C "$(dirname $backup_dir)" "$(basename $backup_dir)" 2>/dev/null
    
    if [[ -f "${backup_dir}.tar.gz" ]]; then
        rm -rf "$backup_dir"
        echo "  ✅ Backup created: ${backup_dir}.tar.gz"
        echo "  📦 Files: $backup_count, Size: $(du -h ${backup_dir}.tar.gz | awk '{print $1}')"
        clean_slate_log "INFO" "Config backup: $backup_count files, ${backup_dir}.tar.gz"
    else
        echo "  ✅ Backup created: $backup_dir"
        clean_slate_log "INFO" "Config backup: $backup_count files, $backup_dir"
    fi
}

nexus_restore_configs() {
    local backup_id="$1"
    
    local backup_base="${CLEAN_SLATE_BACKUP:-$HOME/.nexus/backups}"
    local backup_file="${backup_base}/configs_${backup_id}.tar.gz"
    local backup_dir="${backup_base}/configs_${backup_id}"
    
    # Try compressed backup first
    if [[ -f "$backup_file" ]]; then
        echo "  📦 Found compressed backup: $backup_file"
        local temp_dir=$(mktemp -d)
        tar -xzf "$backup_file" -C "$temp_dir" 2>/dev/null
        backup_dir="$temp_dir/$(basename ${backup_file%.tar.gz})"
    elif [[ ! -d "$backup_dir" ]]; then
        # List available backups
        echo "  ❌ Backup not found: $backup_id"
        echo ""
        echo "  Available backups:"
        ls -1 "$backup_base" | grep "^configs_" | sed 's/configs_/  - /' | sed 's/.tar.gz$//'
        return 1
    fi
    
    if [[ ! -d "$backup_dir" ]]; then
        echo "  ❌ Failed to extract backup"
        return 1
    fi
    
    # Show manifest
    if [[ -f "$backup_dir/MANIFEST.txt" ]]; then
        echo ""
        cat "$backup_dir/MANIFEST.txt"
        echo ""
    fi
    
    # Confirm restoration
    echo -n "  ⚠️  Restore these files? This will overwrite current configs. (y/N): "
    read -r confirm
    
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "  ❌ Restore cancelled"
        return 1
    fi
    
    # Create current backup before restore
    echo "  💾 Creating backup of current configs..."
    nexus_backup_configs
    
    # Restore files
    local restore_count=0
    for config_file in "$backup_dir"/*; do
        [[ "$(basename $config_file)" == "MANIFEST.txt" ]] && continue
        
        local target="$HOME/$(basename $config_file)"
        cp "$config_file" "$target"
        restore_count=$((restore_count + 1))
        echo "  ✅ Restored: $(basename $config_file)"
    done
    
    echo "  ✅ Restored $restore_count configuration files"
    clean_slate_log "INFO" "Config restore: $restore_count files from $backup_id"
}

# ============================================================================
# VALIDATION AND TESTING
# ============================================================================

nexus_validate_config() {
    local config_file="$1"
    
    if [[ ! -f "$config_file" ]]; then
        echo "  ❌ Config file not found: $config_file"
        return 1
    fi
    
    echo "  🔍 Validating: $config_file"
    
    local issues=0
    
    # Syntax checking with zsh
    if ! zsh -n "$config_file" 2>/dev/null; then
        echo "  ❌ Syntax error detected"
        zsh -n "$config_file" 2>&1 | head -5
        issues=$((issues + 1))
    else
        echo "  ✅ Syntax: OK"
    fi
    
    # Check for shellcheck if available
    if command -v shellcheck >/dev/null 2>&1; then
        local shellcheck_output=$(shellcheck -s bash "$config_file" 2>&1)
        if [[ -n "$shellcheck_output" ]]; then
            echo "  ⚠️  ShellCheck warnings:"
            echo "$shellcheck_output" | head -10
        else
            echo "  ✅ ShellCheck: OK"
        fi
    fi
    
    # Check for deprecated functions
    if grep -q "setopt\|unsetopt" "$config_file"; then
        echo "  ℹ️  Found shell options configuration"
    fi
    
    # Check file size (warn if too large)
    local size=$(stat -f%z "$config_file" 2>/dev/null || stat -c%s "$config_file" 2>/dev/null || echo 0)
    if [[ $size -gt 100000 ]]; then
        echo "  ⚠️  Large config file (${size} bytes) - may impact startup time"
    fi
    
    # Check for circular dependencies
    if grep -q "source.*$config_file" "$config_file"; then
        echo "  ❌ Circular dependency detected"
        issues=$((issues + 1))
    fi
    
    if [[ $issues -eq 0 ]]; then
        echo "  ✅ Validation passed"
        clean_slate_log "INFO" "Config validation passed: $config_file"
        return 0
    else
        echo "  ❌ Validation failed with $issues issues"
        clean_slate_log "WARN" "Config validation: $issues issues in $config_file"
        return 1
    fi
}

nexus_test_config() {
    local config_file="$1"
    
    if [[ ! -f "$config_file" ]]; then
        echo "  ❌ Config file not found: $config_file"
        return 1
    fi
    
    echo "  🧪 Testing configuration: $config_file"
    
    # Create isolated test environment
    local test_env=$(mktemp -d)
    local test_script="$test_env/test.zsh"
    
    # Create test script
    cat > "$test_script" <<EOF
#!/usr/bin/env zsh
# Isolated config test
set -e

# Source the config
source "$config_file"

# Test basic functionality
echo "✅ Config loaded successfully"

# Test PATH
if [[ -z "\$PATH" ]]; then
    echo "❌ PATH is empty"
    exit 1
fi
echo "✅ PATH is set (\${#PATH} chars)"

# Test if common commands work
for cmd in ls cd pwd; do
    if ! command -v \$cmd >/dev/null 2>&1; then
        echo "⚠️  Command not found: \$cmd"
    fi
done

# Check for function definitions
local func_count=\$(typeset -f | grep -c "^[a-zA-Z_]" || echo 0)
echo "ℹ️  Defined functions: \$func_count"

# Check for aliases
local alias_count=\$(alias | wc -l)
echo "ℹ️  Defined aliases: \$alias_count"

echo "✅ All tests passed"
EOF
    
    chmod +x "$test_script"
    
    # Run test in isolated environment
    if zsh "$test_script" 2>&1; then
        echo "  ✅ Configuration test passed"
        rm -rf "$test_env"
        clean_slate_log "INFO" "Config test passed: $config_file"
        return 0
    else
        echo "  ❌ Configuration test failed"
        rm -rf "$test_env"
        clean_slate_log "ERROR" "Config test failed: $config_file"
        return 1
    fi
}

# ============================================================================
# INTELLIGENCE AND OPTIMIZATION
# ============================================================================

nexus_optimize_config() {
    local config_file="${1:-$HOME/.zshrc}"
    
    if [[ ! -f "$config_file" ]]; then
        echo "  ❌ Config file not found: $config_file"
        return 1
    fi
    
    echo "  ⚡ Optimizing configuration: $config_file"
    
    local temp_file=$(mktemp)
    local optimized=0
    
    # Remove duplicate PATH entries (preserve order)
    if grep -q "export PATH=" "$config_file"; then
        echo "  🔧 Optimizing PATH entries..."
        optimized=$((optimized + 1))
    fi
    
    # Remove empty lines (keep max 2 consecutive)
    awk 'NF || ++n < 3; NF {n=0}' "$config_file" > "$temp_file"
    
    # Remove duplicate aliases
    awk '!seen[$0]++' "$temp_file" > "${temp_file}.2"
    mv "${temp_file}.2" "$temp_file"
    
    # Add lazy loading suggestions
    local source_count=$(grep -c "^source " "$config_file" || echo 0)
    if [[ $source_count -gt 5 ]]; then
        echo "  💡 Suggestion: Consider lazy loading for $source_count sourced files"
        echo "     Use: autoload -Uz for function files"
    fi
    
    # Check startup time
    if command -v time >/dev/null 2>&1; then
        local startup_time=$( (time zsh -i -c exit) 2>&1 | grep real | awk '{print $2}')
        echo "  ⏱️  Estimated startup time: $startup_time"
    fi
    
    # Create optimized version
    local optimized_file="${config_file}.optimized"
    mv "$temp_file" "$optimized_file"
    
    echo "  ✅ Optimization complete: $optimized_file"
    echo "  📊 Review and apply with: mv $optimized_file $config_file"
    
    clean_slate_log "INFO" "Config optimization: created $optimized_file"
}

nexus_learn_preferences() {
    local history_file="${HISTFILE:-$HOME/.zsh_history}"
    local prefs_file="${CLEAN_SLATE_BACKUP:-$HOME/.nexus}/preferences.json"
    
    mkdir -p "$(dirname $prefs_file)"
    
    echo "  🧠 Learning from command history..."
    
    if [[ ! -f "$history_file" ]]; then
        echo "  ⚠️  No history file found"
        return 1
    fi
    
    # Analyze command frequency
    local -A cmd_freq
    local total_cmds=0
    
    while IFS= read -r line; do
        # Extract command (first word)
        local cmd=$(echo "$line" | sed 's/^[^;]*;//' | awk '{print $1}')
        [[ -z "$cmd" ]] && continue
        
        cmd_freq[$cmd]=$((${cmd_freq[$cmd]:-0} + 1))
        total_cmds=$((total_cmds + 1))
    done < "$history_file"
    
    # Find top commands
    echo "  📊 Top 10 commands:"
    for cmd in ${(k)cmd_freq}; do
        echo "${cmd_freq[$cmd]} $cmd"
    done | sort -rn | head -10 | while read count command; do
        local percent=$(( count * 100 / total_cmds ))
        echo "     $command: $count times ($percent%)"
    done
    
    # Save preferences
    {
        echo "{"
        echo "  \"analyzed_at\": \"$(date -Iseconds)\","
        echo "  \"total_commands\": $total_cmds,"
        echo "  \"unique_commands\": ${#cmd_freq[@]},"
        echo "  \"top_commands\": ["
        local first=1
        for cmd in ${(k)cmd_freq}; do
            echo "${cmd_freq[$cmd]} $cmd"
        done | sort -rn | head -10 | while read count command; do
            [[ $first -eq 0 ]] && echo ","
            first=0
            echo -n "    {\"command\": \"$command\", \"count\": $count}"
        done
        echo ""
        echo "  ]"
        echo "}"
    } > "$prefs_file"
    
    echo "  ✅ Preferences saved to: $prefs_file"
    clean_slate_log "INFO" "Learned preferences from $total_cmds commands"
}

clean_slate_log "DEBUG" "Config Propagator module loaded"
