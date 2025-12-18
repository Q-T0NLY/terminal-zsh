# NEXUS AI Studio - System Instructions & Control

**Version:** 1.0.0  
**Last Updated:** December 16, 2025  
**Maintainer:** Q-T0NLY

## 🎯 System Overview

NEXUS AI Studio is a production-grade ZSH configuration system designed for maximum productivity, performance, and customization on macOS systems.

# NEXUSPRO Terminal System - Comprehensive System Instructions & Control

**Version:** 2.0.0 (Synchronized with copilot-instructions.md)  
**Last Updated:** December 16, 2025  
**Status:** Production-Ready | **Maintainer:** Q-T0NLY / NEXUSPRO Project

---

## 🌌 Project Overview

**NEXUSPRO Terminal System** is a modular, enterprise-grade ZSH configuration framework for macOS. It provides performance-optimized shell setup with 8 independent feature modules, 3 deployment scripts, and comprehensive documentation.

**Key Goal**: Clean, maintainable shell configuration that loads in <50ms with lazy-loaded heavy tools.

---

## 🏗️ Architecture at a Glance

### Modular Structure (8 Modules)
```
zshrc.main                 → Core coordinator (200 lines)
├── path.module.zsh       → PATH management + conflict resolution
├── pkgmgr.module.zsh     → Homebrew unified interface
├── devtools.module.zsh   → Dev tools integration (25+ aliases)
├── aliases.module.zsh    → Productivity shortcuts
├── visual.module.zsh     → Terminal appearance/UX
├── performance.module.zsh→ Profiling + optimization
├── cleanup.module.zsh    → Conflict detection + cleanup
```

### Critical Pattern: Lazy Loading
- **Immediate load**: Core shell functions, critical aliases
- **Lazy load** (on first use): Python, Node.js, cloud CLIs, Docker
- **Performance target**: <50ms startup, <30ms for module loading

---

## 📋 Key Developer Workflows

### Adding a New Feature
1. **Create module**: `modules/feature.module.zsh` (follow template below)
2. **Declare in zshrc.main**: Add to `MODULES_TO_LOAD` array
3. **Document**: Add to `QUICK_REFERENCE.md` and `CONFIGURATION.md`
4. **Test**: Run `./install.sh --test` before commit

### Module Template
```bash
#!/bin/zsh
# 🔧 Feature Name Module
# Dependencies: [other modules if any]

# Export required vars
export FEATURE_ENABLED=true

# Init function (called during startup)
feature_init() {
      log_message "INFO" "Initializing feature module"
      # Setup code
}

# Load lazy-loaded resources
feature_lazy_load() {
      # Heavy initialization deferred until first use
}

# Call init during module load
feature_init
```

### Testing Changes
```bash
# Syntax check
zsh -n ./zshrc.main  # Validate syntax

# Test startup time
time source ~/.zshrc

# Check logs
tail -f ~/.nexuspro/logs/zshrc.log

# Run installer test
./install.sh --test --dry-run
```

---

## 🔧 Project-Specific Conventions

### Naming Conventions
- **Functions**: `module_function()` (e.g., `path_cleanup()`)
- **Variables**: `MODULE_VAR_NAME` (uppercase, scoped prefix)
- **Config files**: `.module.zsh` for loadable modules
- **Logs**: Single file `~/.nexuspro/logs/zshrc.log` with timestamps

### Error Handling Pattern
```bash
# Standard error handler in every function
if ! command -v tool &>/dev/null; then
      log_error "Required tool 'tool' not found"
      return 1
fi
```

### Module Dependencies
- **Explicit**: Each module declares `# Dependencies: [list]` at top
- **Order**: `zshrc.main` loads modules in dependency order
- **No circular imports**: Each module can stand alone

### Configuration Hierarchy
1. Module defaults (hardcoded)
2. `~/.nexuspro/config/*.config` (user overrides)
3. Environment variables (runtime)
4. Local `~/.zshrc` additions (final override)

---

## 🔌 Critical Integration Points

### With Package Managers
- **Homebrew**: `pkgmgr.module.zsh` - Single interface for install/update/cleanup
- **npm/pip/gem**: `devtools.module.zsh` - Lazy loads language runtimes
- **Cloud CLIs**: AWS/GCP/Azure - Lazy init on first use

### With Development Tools
- **Git/GitHub**: Aliases in `devtools.module.zsh`
- **Docker/K8s**: Lazy-loaded, health-checked
- **Python/Node.js/Ruby**: Lazy initialization with version detection

### Performance Monitoring
- **Startup timing**: Measured in `zshrc.main`, logged to `${LOG_FILE}`
- **Module load times**: Each module logs init duration
- **Profiling**: `performance.module.zsh` provides `profile_shell()` function

---

## 📊 Data Flow & Cross-Component Communication

### Startup Sequence
```
~/.zshrc
   ↓
zshrc.main (capture start time)
   ↓
Load core functions (logging, path helpers)
   ↓
Source modules in order:
   1. cleanup (must run first for safety)
   2. path (manage PATH)
   3. pkgmgr (package managers)
   4. devtools (dev tools setup)
   5. aliases (shell aliases)
   6. visual (appearance)
   7. performance (profiling)
   ↓
Register lazy loaders
   ↓
Calculate startup time, log result
```

### Module Communication
- **Shared exports**: Core vars in `zshrc.main` (e.g., `${NEXUSPRO_ROOT}`)
- **Logging**: All modules use `log_message()` function
- **Config loading**: Each module reads from `~/.nexuspro/config/`
- **Cache access**: Shared cache dir `~/.nexuspro/cache/`

---

## 💻 Code Patterns to Follow

### Lazy Loading Pattern
```bash
# Define a lazy loader stub
tool_command() {
      # First call: initialize real implementation
      source ~/.nexuspro/modules/tool_init.zsh
      # Then call the real function
      _tool_command_real "$@"
}

# Real implementation loaded on first use
_tool_command_real() {
      # Heavy setup, then actual work
}
```

### Configuration File Pattern
```bash
# In your module
config_file="${NEXUSPRO_CONFIG}/${MODULE_NAME}.config"
if [[ -f "$config_file" ]]; then
      source "$config_file"
else
      # Use sensible defaults
      DEFAULT_SETTING="value"
fi
```

### Error Recovery Pattern
```bash
# Wrap risky operations
if ! some_command; then
      log_error "Command failed, using fallback"
      use_fallback_approach
fi
```

---

## 🎛️ Configuration Control

### Module Loading Control

Edit `~/.zshrc` to control which modules load:

```zsh
# Core modules (always load)
NEXUS_LOAD_ALIASES=true
NEXUS_LOAD_FUNCTIONS=true

# Optional modules
NEXUS_HISTORY_SAVE=50000     # Entries to save

# Completion
NEXUS_LAZY_LOAD=true         # Lazy load completions
NEXUS_COMPLETION_CACHE=true  # Cache completion results

# Startup
NEXUS_INSTANT_PROMPT=true    # Use instant prompt (requires p10k)
NEXUS_SKIP_GLOBAL_COMPINIT=true  # Skip global compinit
```

### AI Provider Control

```zsh
# Primary AI provider (priority order)
NEXUS_AI_PRIMARY="claude"    # claude, openai, ollama

# Enable/disable providers
NEXUS_AI_CLAUDE=true
NEXUS_AI_OPENAI=true
NEXUS_AI_OLLAMA=false

# API Keys (set in .zshenv or .env)
ANTHROPIC_API_KEY="your-key"
OPENAI_API_KEY="your-key"
```

---

## 🔧 System Commands

### Core Commands

| Command | Description | Module |
|---------|-------------|--------|
| `nexus-help` | Show system help | functions |
| `nexus-update` | Update configuration | functions |
| `nexus-status` | System status check | functions |
| `nexus-config` | Open config editor | functions |
| `reload` | Reload ZSH config | aliases |

### Module Commands

**Aliases Module:**
- Navigation: `..`, `...`, `~`
- File ops: `ll`, `la`, `ls`
- Git: `gs`, `ga`, `gc`, `gp`, `gl`

**Functions Module:**
- `mkcd <dir>` - Make and enter directory
- `extract <file>` - Smart archive extraction
- `backup <file>` - Quick backup with timestamp

---

## 🎨 Customization Rules

### Adding Custom Aliases

Create `~/.nexus-ai/lib/custom-aliases.zsh`:

```zsh
#!/usr/bin/env zsh
# Custom user aliases

alias myalias='command here'
```

### Adding Custom Functions

Create `~/.nexus-ai/lib/custom-functions.zsh`:

```zsh
#!/usr/bin/env zsh
# Custom user functions

myfunction() {
  echo "My custom function"
}
```

### Module Loading Order

1. `.zshenv` (environment variables)
2. `.zshrc` (main config)
3. Core modules (aliases, functions)
4. Optional modules (AI, monitoring, etc.)
5. Custom modules (user additions)
6. Theme/prompt configuration

---

## 🚀 Performance Guidelines

### Startup Time Targets

- **Bare minimum:** <50ms (core only)
- **Standard setup:** <100ms (core + aliases + functions)
- **Full featured:** <200ms (all modules enabled)

### Optimization Techniques

1. **Lazy Loading:**
   - Load completions on first use
   - Defer plugin initialization
   - Use instant prompt

2. **Caching:**
   - Cache completion results
   - Cache command locations
   - Cache system checks

3. **Conditional Loading:**
   - Check if commands exist before loading
   - Skip modules if dependencies missing
   - Load only needed completions

### Profiling Startup Time

```zsh
# Add to top of .zshrc
zmodload zsh/zprof

# Add to bottom of .zshrc
zprof
```

---

## 🔐 Security Best Practices

### API Keys

- ✅ Store in `.zshenv` (never committed)
- ✅ Use environment variables
- ✅ Rotate regularly
- ❌ Never hardcode in scripts
- ❌ Never commit to Git

### File Permissions

```zsh
chmod 600 ~/.zshenv        # Environment variables
chmod 644 ~/.zshrc         # Main config
chmod 755 ~/.nexus-ai/lib/*.zsh  # Modules
```

### Git Configuration

Always add to `.gitignore`:
```
.env
.zshenv.local
*_history
*.log
.cache/
```

---

## 🧪 Testing & Validation

### Pre-Commit Checklist

- [ ] All syntax is valid ZSH
- [ ] No hardcoded paths (use variables)
- [ ] Functions have error handling
- [ ] Performance impact measured
- [ ] Documentation updated

### Testing New Modules

```zsh
# Test in subshell (won't affect current session)
zsh -c 'source ~/.nexus-ai/lib/new-module.zsh'

# Test syntax
zsh -n ~/.nexus-ai/lib/new-module.zsh

# Profile performance
time zsh -ic 'exit'
```

---

## 📊 Monitoring & Maintenance

### Health Checks

Run `nexus-status` to check:
- Module load status
- Performance metrics
- Missing dependencies
- Configuration errors
- API connectivity

### Log Management

Logs location: `~/.nexus-ai/logs/`

```zsh
# View recent errors
tail -f ~/.nexus-ai/logs/error.log

# Clear old logs (keep 30 days)
find ~/.nexus-ai/logs -mtime +30 -delete
```

---

## 🔄 Update Procedures

### Updating Configuration

```zsh
cd ~/.nexus-ai
git pull origin main
source ~/.zshrc
```

### Backup Before Update

```zsh
# Automatic backup
cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d)

# Full system backup
tar -czf ~/nexus-backup-$(date +%Y%m%d).tar.gz ~/.nexus-ai
```

---

## 🐛 Troubleshooting

### Common Issues

**Slow Startup:**
1. Profile with `zprof`
2. Disable modules one by one
3. Check for network calls in sync code
4. Enable lazy loading

**Commands Not Found:**
1. Check PATH in `.zshenv`
2. Verify module is loaded
3. Run `hash -r` to refresh command cache

**Completion Issues:**
1. Delete completion cache: `rm ~/.zcompdump*`
2. Rebuild: `compinit`
3. Check completion functions: `which _git`

### Debug Mode

```zsh
# Enable debug output
export NEXUS_DEBUG=true
source ~/.zshrc

# Trace execution
zsh -x -c 'source ~/.zshrc'
```

---

## 📚 Development Guidelines

### Code Style

- Use 2 spaces for indentation
- Quote all variables: `"$var"`
- Use `[[` for conditionals, not `[`
- Function names: lowercase with hyphens
- Constants: UPPERCASE_WITH_UNDERSCORES

### Documentation Requirements

Every function must have:
```zsh
# Function description
# Usage: function-name <arg1> [arg2]
# Arguments:
#   arg1 - Description
#   arg2 - Optional description
# Returns: 0 on success, 1 on error
function-name() {
  # Implementation
}
```

### Version Control

- Use semantic versioning: MAJOR.MINOR.PATCH
- Tag releases: `git tag v1.0.0`
- Write meaningful commit messages
- Keep commits atomic and focused

---

## 🎯 Roadmap

### Planned Features

- [ ] Plugin manager system
- [ ] Automatic backup/restore
- [ ] Cloud sync support
- [ ] Multi-platform support
- [ ] Interactive configuration wizard
- [ ] Performance analytics dashboard

### Version History

**v1.0.0** (Current)
- Initial clean architecture
- Core modules (aliases, functions)
- Git integration
- Basic documentation

---

## 📞 Support & Contributing

### Getting Help

1. Check documentation: `nexus-help`
2. Review this file
3. Check GitHub issues
4. Create new issue with debug output

### Contributing

1. Fork the repository
2. Create feature branch
3. Follow code style guidelines
4. Add tests if applicable
5. Update documentation
6. Submit pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

**System Status:** ✅ Operational  
**Configuration Version:** 1.0.0  
**Last Health Check:** Run `nexus-status` to check
