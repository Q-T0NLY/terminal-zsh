# Terminal-ZSH Library System

Enterprise-grade modular libraries for ZSH shell scripting.

## Overview

The library system provides reusable, well-tested modules for common shell scripting tasks:

- **errorlib** - Error handling, retry logic, and recovery mechanisms
- **loglib** - Structured logging with levels and rotation
- **perflib** - Performance monitoring and benchmarking
- **configlib** - Configuration management with environment overrides
- **modulelib** - Dynamic module loading and dependency management

## Quick Start

### Loading Libraries

```zsh
# Load a single library
source "${NOVA_ROOT}/src/lib/errorlib.zsh"

# Or use the module loader
source "${NOVA_ROOT}/src/lib/modulelib.zsh"
modulelib::load errorlib
modulelib::load loglib
```

### Using Libraries

```zsh
# Error handling
source errorlib.zsh
errorlib::enable_error_trap
errorlib::retry 3 curl -f https://api.example.com

# Logging
source loglib.zsh
loglib::info "Application started"
loglib::error "Something went wrong"

# Performance monitoring
source perflib.zsh
perflib::timer_start "operation"
# ... do work ...
elapsed=$(perflib::timer_stop "operation")

# Configuration
source configlib.zsh
configlib::load
api_key=$(configlib::get "api_key" "default-key")
```

## Library Reference

### errorlib.zsh - Error Handling

#### Functions

**errorlib::enable_error_trap**
- Enable automatic error handling
- Sets errexit, nounset, pipefail

**errorlib::retry <max_attempts> <command>**
- Retry command with exponential backoff
- Default: 3 attempts

**errorlib::try_or_fallback <command> <fallback>**
- Try primary command, use fallback on failure

**errorlib::require_vars <var1> <var2> ...**
- Validate required variables are set

**errorlib::require_command <cmd>**
- Check if command is available

**errorlib::register_cleanup <function>**
- Register cleanup handler for exit

#### Example

```zsh
source errorlib.zsh

# Enable error handling
errorlib::enable_error_trap

# Validate prerequisites
errorlib::require_vars API_KEY DATABASE_URL
errorlib::require_command curl jq

# Retry with backoff
errorlib::retry 5 curl -f https://api.example.com/data

# Register cleanup
errorlib::register_cleanup "rm -f /tmp/lockfile"
errorlib::enable_cleanup_trap
```

### loglib.zsh - Logging

#### Functions

**loglib::debug <message>**
- Log debug message (only if LOG_LEVEL=DEBUG)

**loglib::info <message>**
- Log info message

**loglib::warn <message>**
- Log warning message

**loglib::error <message>**
- Log error message

**loglib::set_level <level>**
- Set log level (DEBUG|INFO|WARNING|ERROR|CRITICAL)

**loglib::set_format <format>**
- Set output format (json|text)

#### Example

```zsh
source loglib.zsh

# Configure logging
loglib::set_level INFO
loglib::set_format json

# Log messages
loglib::info "Starting application"
loglib::warn "Deprecated feature used"
loglib::error "Database connection failed"

# With context
loglib::info "User login" "user_id=123 ip=192.168.1.1"
```

### perflib.zsh - Performance Monitoring

#### Functions

**perflib::timer_start <name>**
- Start a named timer

**perflib::timer_stop <name>**
- Stop timer and return elapsed time

**perflib::time_command <name> <command>**
- Time a command execution

**perflib::benchmark <iterations> <command>**
- Benchmark command with statistics

**perflib::counter_inc <name> [amount]**
- Increment a counter

**perflib::track_startup <component>**
- Track startup time for component

#### Example

```zsh
source perflib.zsh

# Time an operation
perflib::timer_start "database_query"
# ... execute query ...
elapsed=$(perflib::timer_stop "database_query")

# Benchmark function
perflib::benchmark 100 "my_function arg1 arg2"

# Track startup
perflib::track_startup "Load config"
# ... load config ...
perflib::track_startup "Initialize DB"
# ... init DB ...

# Counters
perflib::counter_inc "requests_processed"
perflib::counter_inc "bytes_sent" 1024
```

### configlib.zsh - Configuration Management

#### Functions

**configlib::load [file]**
- Load configuration from JSON file

**configlib::get <key> [default]**
- Get configuration value (checks env vars first)

**configlib::set <key> <value>**
- Set configuration value (in memory)

**configlib::save [file]**
- Save configuration to file

**configlib::require <key1> <key2> ...**
- Validate required keys exist

#### Example

```zsh
source configlib.zsh

# Load config
configlib::load ~/.config/nova/config.json

# Get values (with env var override)
database_url=$(configlib::get "database_url" "sqlite:///data.db")
api_key=$(configlib::get "api_key")

# Set values
configlib::set "last_run" "$(date -u +%Y-%m-%d)"

# Validate
configlib::require "api_key" "database_url"

# Save
configlib::save
```

### modulelib.zsh - Module Loading

#### Functions

**modulelib::load <module>**
- Load a module and its dependencies

**modulelib::load_all <module1> <module2> ...**
- Load multiple modules

**modulelib::lazy <module> <trigger_function>**
- Register module for lazy loading

**modulelib::depends <module> <dep1> <dep2> ...**
- Register module dependencies

**modulelib::list**
- List loaded modules

#### Example

```zsh
source modulelib.zsh

# Register dependencies
modulelib::depends "myapp" "errorlib" "loglib"

# Load module (will load dependencies first)
modulelib::load "myapp"

# Lazy loading
modulelib::lazy "advanced_feature" "advanced_feature_init"

# List loaded modules
modulelib::list
```

## Best Practices

### Error Handling

1. **Always enable error traps** for critical scripts
2. **Use retry logic** for network operations
3. **Validate prerequisites** before execution
4. **Register cleanup handlers** for resources

### Logging

1. **Use appropriate log levels** (don't spam with DEBUG in production)
2. **Include context** in log messages
3. **Use JSON format** for production (easier parsing)
4. **Monitor log rotation** to prevent disk fill

### Performance

1. **Profile critical paths** with timers
2. **Benchmark optimizations** to verify improvements
3. **Track startup time** to identify slow components
4. **Use counters** for operational metrics

### Configuration

1. **Use environment variables** for secrets
2. **Validate configuration** on load
3. **Provide sensible defaults**
4. **Document all config options**

### Modules

1. **Declare dependencies** explicitly
2. **Use lazy loading** for optional features
3. **Keep modules focused** (single responsibility)
4. **Export functions** properly

## Testing

Each library includes inline examples and can be tested:

```zsh
# Run library tests
bats tests/unit/test_libs.bats

# Test individual library
source errorlib.zsh
errorlib::require_command zsh
echo "✅ errorlib works"
```

## Integration

### With Existing Code

```zsh
#!/usr/bin/env zsh

# Load core libraries
NOVA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "${NOVA_ROOT}/src/lib/modulelib.zsh"

# Load what you need
modulelib::load errorlib
modulelib::load loglib

# Enable error handling
errorlib::enable_error_trap
errorlib::enable_cleanup_trap

# Configure logging
loglib::set_level INFO

# Your code here
loglib::info "Script started"
# ...
```

### Performance Impact

All libraries are designed for minimal overhead:

- Loading: <10ms per library
- Function calls: <1ms
- Memory: <1MB total

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

Part of the terminal-zsh project.
