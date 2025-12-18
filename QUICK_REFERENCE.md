# ⚡ NEXUSPRO Terminal System - Quick Reference Guide

> **Fast lookup for commands, functions, and common tasks**

---

## 🚀 Quick Start (30 seconds)

```bash
# Install
bash install.sh

# Reload shell
source ~/.zshrc

# Check system
system_diagnostics
```

---

## 📋 Essential Commands

### System Health

```bash
system_diagnostics           # Complete system check
show_startup_time           # Shell startup performance
profile_shell               # Detailed timing breakdown
```

### Module Management

```bash
load_module "module_name"    # Load a module
list_modules                 # Show loaded modules
debug_modules                # Debug module loading
```

### Performance

```bash
cache_clear                  # Clear all caches
cache_invalidate "key"       # Clear specific cache
analyze_startup              # Analyze startup timing
```

---

## 🛠️ Development Aliases

### Git (10+ aliases)

| Alias | Command |
|-------|---------|
| `gst` | `git status` |
| `gaa` | `git add --all` |
| `gcm "msg"` | `git commit -m "msg"` |
| `gp` | `git push` |
| `gl` | `git pull` |
| `gb` | `git branch` |
| `gco "branch"` | `git checkout "branch"` |
| `gd` | `git diff` |
| `gl` | `git log --oneline -n 10` |
| `grs` | `git reset --soft HEAD~1` |

### Docker (6+ aliases)

| Alias | Command |
|-------|---------|
| `dps` | `docker ps` |
| `dpsall` | `docker ps -a` |
| `di` | `docker images` |
| `drm` | `docker rm` |
| `drmi` | `docker rmi` |
| `dexec` | `docker exec -it` |

### Kubernetes (3+ aliases)

| Alias | Command |
|-------|---------|
| `k` | `kubectl` |
| `kgp` | `kubectl get pods` |
| `kdp` | `kubectl describe pod` |

### Utilities

| Alias | Command |
|-------|---------|
| `ll` | `ls -lah` |
| `cd..` | `cd ..` |
| `mkdir -p` | Make parent directories |
| `cp -i` | Copy with confirmation |
| `rm -i` | Remove with confirmation |

---

## 🔧 Utility Functions

### File Operations

```bash
mkcd "dirname"              # Create directory and cd into it
extract "archive.zip"       # Extract any archive format
findfile "name"             # Find file by name
```

### Directory Navigation

```bash
cd..                        # Go up one directory
cd...                       # Go up two directories
cd~                         # Go to home
```

### System Information

```bash
diskspace                   # Show disk usage
meminfo                     # Show memory info
cpuinfo                     # Show CPU info
```

---

## 📚 PATH Management

### View and Modify PATH

```bash
path_list                   # List all PATH entries
path_add "/new/path"        # Add to PATH
path_find_command "cmd"     # Find command in PATH
path_remove "/bad/path"     # Remove from PATH
```

---

## 📦 Package Management

### Homebrew Commands

```bash
brew_update                 # Update Homebrew and packages
brew_list                   # List installed packages
brew_search "term"          # Search for package
brew_install "package"      # Install package
brew_remove "package"       # Remove package
brew_doctor                 # Check Homebrew health
```

---

## 🎨 Customization

### Visual Settings

```bash
# Set theme
export TERM_THEME="dark"    # or "light" or "auto"

# Edit configuration
$EDITOR ~/.nexuspro/custom.zsh
```

### Language Runtimes

```bash
# Python (pyenv)
pyenv versions
pyenv install 3.11.0
pyenv global 3.11.0

# Node.js (nvm)
nvm list
nvm install 20
nvm use 20

# Ruby (rbenv)
rbenv versions
rbenv install 3.2.0
rbenv global 3.2.0
```

---

## ⚙️ Configuration

### Configuration Priority

1. **Local** (~/.nexuspro/custom.zsh) - Highest priority
2. **Module** (core functionality)
3. **Default** (built-in defaults)

### Key Configuration Files

```
~/.nexuspro/zshrc.main          # Core initialization
~/.nexuspro/modules/            # All feature modules
~/.nexuspro/custom.zsh          # Your customizations
~/.nexuspro/config/             # Configuration files
~/.nexuspro/cache/              # Cached data
~/.nexuspro/logs/zshrc.log      # System logs
```

---

## 🔄 Backup & Restore

### Backup Operations

```bash
# Automatic backups created at:
~/.dotfiles.backup/

# List backups
bash restore.sh --list

# Interactive restore
bash restore.sh
```

---

## 🐛 Troubleshooting Quick Fixes

### Problem: Slow startup

```bash
show_startup_time           # Check current time
profile_shell               # See detailed breakdown
```

### Problem: Module not loading

```bash
system_diagnostics          # Full health check
debug_modules               # Debug module issues
```

### Problem: Command not found

```bash
path_find_command "cmd"     # Check if in PATH
which "cmd"                 # Show command location
```

### Problem: Cache corrupted

```bash
cache_clear                 # Clear all caches
```

### Problem: Installation failed

```bash
bash restore.sh             # Restore previous config
bash install.sh --help      # See options
```

---

## 📖 Documentation Quick Links

| Need | Location |
|------|----------|
| Installation help | `docs/INSTALLATION.md` |
| How to customize | `docs/CONFIGURATION.md` |
| Technical details | `docs/ARCHITECTURE.md` |
| Solve problems | `docs/TROUBLESHOOTING.md` |
| Full overview | `README_NEXUSPRO.md` |

---

## 🎯 Common Tasks

### Add Custom Alias

```bash
# Add to ~/.nexuspro/custom.zsh
alias myalias="command here"
```

### Add Custom Function

```bash
# Add to ~/.nexuspro/custom.zsh
myfunction() {
    # Your code here
}
```

### Temporarily Disable Module

```bash
# Comment out in ~/.nexuspro/zshrc.main
# load_module "module_name"
```

### Check System Health

```bash
system_diagnostics
```

---

## ⚡ Performance Tips

### Startup Optimization

1. Disable unused modules
2. Use lazy loading (already enabled)
3. Clear caches periodically
4. Check for PATH duplicates

### Ongoing Maintenance

```bash
# Weekly
cache_clear

# Monthly
system_diagnostics

# Quarterly
bash restore.sh --list  # Check backups
```

---

## 🔐 Security Notes

- Keep config files private (chmod 600)
- Don't store credentials in config
- Use system keychain for passwords
- Review backups regularly
- Keep system updated

---

## 📞 Getting Help

### Built-in Diagnostics

```bash
system_diagnostics              # Full system check
show_startup_time              # Performance check
debug_modules                  # Module debugging
```

### View Logs

```bash
cat ~/.nexuspro/logs/zshrc.log
```

### Installation Help

```bash
bash install.sh --help
```

---

## 🚀 Quick Reference by Task

### I need to...

| Task | Command |
|------|---------|
| **Check system** | `system_diagnostics` |
| **See startup time** | `show_startup_time` |
| **List modules** | `list_modules` |
| **Clear cache** | `cache_clear` |
| **Restore config** | `bash restore.sh` |
| **Fix conflicts** | `system_diagnostics` then follow suggestions |
| **Add custom alias** | Edit `~/.nexuspro/custom.zsh` |
| **View logs** | `cat ~/.nexuspro/logs/zshrc.log` |
| **Reload shell** | `source ~/.zshrc` |
| **Get help** | See docs/ folder or run `system_diagnostics` |

---

## 💡 Pro Tips

1. **Use `show_startup_time`** regularly to track performance
2. **Run `system_diagnostics`** monthly for health checks
3. **Create custom aliases** in `~/.nexuspro/custom.zsh`
4. **Check logs** when something seems wrong
5. **Keep backups** by checking restore.sh --list regularly

---

## 🎓 Learning Path

1. **Day 1**: Install and verify (10 minutes)
   - `bash install.sh`
   - `system_diagnostics`

2. **Day 2**: Explore commands (15 minutes)
   - Try aliases (gst, dps, k, etc.)
   - Run diagnostics

3. **Day 3**: Customize (20 minutes)
   - Read CONFIGURATION.md
   - Edit custom.zsh

4. **Ongoing**: Maintain and optimize
   - Monthly: system_diagnostics
   - As needed: Refer to docs

---

## 📋 System Architecture (Overview)

```
NEXUSPRO Terminal System
├── Core Initialization (zshrc.main)
├── Feature Modules (8 total)
│   ├── PATH Management
│   ├── Package Manager
│   ├── Development Tools
│   ├── Aliases & Functions
│   ├── Visual Enhancements
│   ├── Performance Optimization
│   ├── Cleanup & Diagnostics
│   └── Custom Extensions
├── Deployment Scripts (3 total)
│   ├── Installer (install.sh)
│   ├── Setup Wizard (setup-wizard.sh)
│   └── Backup Manager (restore.sh)
└── Support Systems
    ├── Logging & Diagnostics
    ├── Backup & Restore
    └── Performance Monitoring
```

---

## ✨ Key Features at a Glance

✅ **<50ms startup** - Performance optimized  
✅ **Conflict detection** - Automatic cleanup  
✅ **Backup & restore** - Safe operations  
✅ **25+ dev aliases** - Productive development  
✅ **Visual themes** - Beautiful terminal  
✅ **Easy customization** - Add your own aliases/functions  
✅ **Comprehensive docs** - 5 detailed guides  
✅ **Full diagnostics** - system_diagnostics command  

---

## 🎉 You're Ready!

Everything is installed and configured. Start using your enhanced terminal now!

```bash
# Your terminal is ready
system_diagnostics
```

---

**NEXUSPRO Terminal System - Quick Reference Guide**

*For complete information, see README_NEXUSPRO.md or the docs/ folder*
