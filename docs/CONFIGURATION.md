# Configuration Guide

## 🎛️ System Configuration Overview

Complete reference for configuring NEXUSPRO Terminal System to match your workflow and preferences.

---

## 📋 Configuration Hierarchy

The system applies settings in this priority order (highest to lowest):

```
1. Runtime overrides (command line)
   export SHELL_STARTUP_TARGET=100
   
2. Environment variables (shell export)
   export THEME="light"
   
3. User configuration files (~/.nexuspro/config/)
   setup.config, custom.zsh, custom.env
   
4. Module defaults (built-in values)
   Defined in module.zsh files
```

---

## ⚙️ Core Configuration

### Global Settings

Edit or add to your shell environment:

```bash
# ~/.zshrc or ~/.nexuspro/custom.env

# System paths
export NEXUSPRO_ROOT="${HOME}/.nexuspro"
export NEXUSPRO_CONFIG="${NEXUSPRO_ROOT}/config"
export NEXUSPRO_MODULES="${NEXUSPRO_ROOT}/modules"
export NEXUSPRO_CACHE="${NEXUSPRO_ROOT}/cache"
export NEXUSPRO_LOG="${NEXUSPRO_ROOT}/logs"

# Language and locale
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

# Editor
export EDITOR="nano"           # or vim, emacs, etc
export VISUAL="${EDITOR}"

# Shell options
export SHELL_STARTUP_TARGET=50  # milliseconds

# Performance
export CACHE_EXPIRY=86400      # 24 hours
export LAZY_LOAD_ENABLED=true
```

### System Diagnostics

```bash
# Check current configuration
system_diagnostics

# Output includes:
# - System information
# - Module status
# - Startup time
# - Conflicts detected
# - Performance metrics

# Detailed diagnostics
debug_modules          # Show module loading process
profile_shell         # Detailed startup profiling
show_startup_time    # Last startup performance
```

---

## 🎨 Visual Configuration

### Theme Selection

```bash
# Set theme in ~/.zshrc or ~/.nexuspro/config/setup.config

export THEME="dark"        # dark, light, or auto

# After change, reload:
source ~/.zshrc
```

### Theme Options

| Theme | Best For | Colors |
|-------|----------|--------|
| **dark** | Night work, reduced eye strain | Dark backgrounds, bright text |
| **light** | Daytime, presentations | Light backgrounds, dark text |
| **auto** | Day/night adaptation | Automatic based on time |

### Prompt Customization

```bash
# Edit prompt in ~/.nexuspro/modules/visual.module.zsh

# Standard prompt format:
# [user@host path] $

# Or customize in ~/.nexuspro/custom.zsh:
function custom_prompt() {
    echo "$(date '+%H:%M') $ "
}
PROMPT='$(custom_prompt)'
```

### Color Configuration

```bash
# Define custom colors in ~/.nexuspro/custom.env
export COLOR_PRIMARY="#007AFF"
export COLOR_ACCENT="#34C759"
export COLOR_WARNING="#FF9500"
export COLOR_ERROR="#FF3B30"
```

### Syntax Highlighting

```bash
# Install highlighting plugin
brew install zsh-syntax-highlighting

# Configure in ~/.zshrc
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Custom highlighting settings
ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets)
ZSH_HIGHLIGHT_STYLES[reserved-word]='fg=magenta,bold'
```

### Autosuggestions

```bash
# Install autosuggestions
brew install zsh-autosuggestions

# Configure in ~/.zshrc
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# Keybinding for suggestions
bindkey '^[' autosuggest-accept  # alt+right arrow
```

---

## 🔧 Module Configuration

### Enable/Disable Modules

In `~/.nexuspro/zshrc.main`, comment/uncomment module loads:

```bash
# Skip a module by commenting:
# load_module "devtools"
# load_module "cleanup"

# Keep loaded:
load_module "performance"
load_module "visual"

# Reload shell
source ~/.zshrc
```

### Path Module

**File**: `~/.nexuspro/modules/path.module.zsh`

**Configuration**:

```bash
# Homebrew architecture (auto-detected)
HOMEBREW_ARCH="arm64"  # or "x86_64"

# Additional PATH entries
path_add "/usr/local/opt/custom/bin"
path_add "${HOME}/.local/bin"

# Custom PATH priority
# Higher priority paths come first
PATH="/opt/homebrew/bin:${PATH}"
```

**Functions**:

```bash
# Add directory to PATH
path_add "/my/custom/path"

# List PATH entries
path_list

# Remove duplicates
path_deduplicate

# Find executable
path_find_command "python"
```

### Package Manager Module

**File**: `~/.nexuspro/modules/pkgmgr.module.zsh`

**Configuration**:

```bash
# Homebrew location (auto-detected)
export HOMEBREW_INSTALL_CLEANUP=1
export HOMEBREW_NO_ANALYTICS=1

# Package manager preferences
export PKG_MANAGER_TIMEOUT=60

# Homebrew options
brew_enable_cask=true
```

**Functions**:

```bash
# Install package
pkg_install "package_name"

# Update packages
pkg_update

# Search for package
pkg_search "pattern"

# List installed packages
pkg_list

# Clean up
pkg_cleanup
```

### Development Tools Module

**File**: `~/.nexuspro/modules/devtools.module.zsh`

**Configuration**:

```bash
# Git configuration
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global init.defaultBranch "main"

# Docker settings
export DOCKER_BUILDKIT=1
export DOCKER_CONTENT_TRUST=1

# Kubernetes settings
export KUBE_NAMESPACE="default"
export KUBE_CONTEXT="docker-desktop"

# Language runtime versions
export NODE_VERSION="18"
export PYTHON_VERSION="3.11"
export RUBY_VERSION="3.2"

# Enable specific tools
export ENABLE_GIT=true
export ENABLE_DOCKER=true
export ENABLE_KUBERNETES=true
export ENABLE_AWS=true
```

**Available Aliases**:

```bash
# Git
gst        # git status
gaa        # git add --all
gcm        # git commit -m
gp         # git push

# Docker
dps        # docker ps
dpsall     # docker ps -a
drm        # docker rm

# Kubernetes
k          # kubectl
kgp        # kubectl get pods
kdp        # kubectl describe pod
```

### Performance Module

**File**: `~/.nexuspro/modules/performance.module.zsh`

**Configuration**:

```bash
# Lazy loading
export LAZY_LOAD_ENABLED=true

# Cache settings
export CACHE_EXPIRY=86400      # 24 hours
export CACHE_CLEAR_ON_START=false

# Profiling
export PROFILE_ENABLED=false   # Enable for testing
export PROFILE_THRESHOLD=10    # Log if startup >10ms

# Startup target
export SHELL_STARTUP_TARGET=50 # milliseconds
```

**Performance Profiles**:

```bash
# Select profile
configure_performance_profile

# Available profiles:
# 1. MAX_PERFORMANCE  - Minimal features, <20ms startup
# 2. BALANCED         - Most features, ~40ms startup
# 3. MAX_FEATURES     - All features, ~60ms startup
```

**Functions**:

```bash
# Show startup time
show_startup_time

# Profile next startup
profile_shell

# Analyze performance
analyze_startup

# Cache management
cache_clear
cache_invalidate "key"
```

### Visual Module

**File**: `~/.nexuspro/modules/visual.module.zsh`

**Configuration**:

```bash
# Prompt style
export PROMPT_STYLE="modern"    # classic, modern, minimal

# Colors
export USE_COLORS=true
export COLORIZE_LS=true

# Syntax highlighting
export SYNTAX_HIGHLIGHT=true

# Completion styling
export COMPLETION_MENU=true
```

### Cleanup Module

**File**: `~/.nexuspro/modules/cleanup.module.zsh`

**Configuration**:

```bash
# Auto-fix conflicts
export AUTO_FIX_CONFLICTS=false  # Manual review first

# Cleanup options
export REMOVE_ORPHANED_DOTFILES=false
export FIX_PATH_DUPLICATES=true
export DETECT_TOOL_CONFLICTS=true

# Report level
export REPORT_LEVEL="MEDIUM"    # LOW, MEDIUM, HIGH, DEBUG
```

**Functions**:

```bash
# Run diagnostics
system_diagnostics

# Find conflicts
find_conflicts

# Fix specific conflict
fix_path_duplicates
fix_tool_conflicts "docker"
cleanup_orphaned_dotfiles

# Generate report
generate_conflict_report
```

---

## 🌍 Integration Configuration

### Git Integration

```bash
# Configure globally
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# SSH key setup
ssh-keygen -t ed25519 -C "email@example.com"
ssh-add ~/.ssh/id_ed25519

# GitHub CLI
gh auth login
```

### Docker Integration

```bash
# Install Docker Desktop for Mac
brew install --cask docker

# Verify installation
docker --version

# Docker Compose
docker-compose --version
```

### Kubernetes Integration

```bash
# Install kubectl
brew install kubectl

# Install minikube (local K8s)
brew install minikube

# Or use Docker Desktop K8s
# Docker Desktop Settings → Kubernetes → Enable

# Configure context
kubectl config use-context docker-desktop
```

### Language Runtime Configuration

**Python**:

```bash
# Install pyenv
brew install pyenv

# Install Python version
pyenv install 3.11.0

# Set local version
pyenv local 3.11.0

# Verify
python --version
```

**Node.js**:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node version
nvm install 18

# Set default
nvm alias default 18

# Verify
node --version
```

**Ruby**:

```bash
# Install rbenv
brew install rbenv

# Install Ruby version
rbenv install 3.2.0

# Set local version
rbenv local 3.2.0

# Verify
ruby --version
```

### Cloud CLI Configuration

**AWS**:

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# Test
aws s3 ls
```

**Google Cloud**:

```bash
# Install gcloud
brew install --cask google-cloud-sdk

# Initialize
gcloud init

# Test
gcloud projects list
```

**Azure**:

```bash
# Install Azure CLI
brew install azure-cli

# Login
az login

# Test
az account list
```

---

## 💾 Environment Variables

### Core Variables

```bash
# NEXUSPRO system
NEXUSPRO_ROOT="${HOME}/.nexuspro"
NEXUSPRO_CONFIG="${NEXUSPRO_ROOT}/config"
NEXUSPRO_MODULES="${NEXUSPRO_ROOT}/modules"
NEXUSPRO_CACHE="${NEXUSPRO_ROOT}/cache"
NEXUSPRO_LOG="${NEXUSPRO_ROOT}/logs"

# Display
LANG="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
COLORTERM="truecolor"

# Editors
EDITOR="nano"
VISUAL="${EDITOR}"
```

### Optional Variables

```bash
# Performance
SHELL_STARTUP_TARGET=50
LAZY_LOAD_ENABLED=true
PROFILE_ENABLED=false

# Homebrew
HOMEBREW_NO_ANALYTICS=1
HOMEBREW_INSTALL_CLEANUP=1

# Git
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=accept-new"

# Docker
DOCKER_BUILDKIT=1
DOCKER_CONTENT_TRUST=1

# Kubernetes
KUBECONFIG="${HOME}/.kube/config"
```

### Custom Variables

```bash
# Add to ~/.nexuspro/custom.env

# Project paths
export MY_PROJECT_DIR="${HOME}/projects"
export MY_WORKSPACE="${HOME}/workspace"

# API endpoints
export API_BASE="https://api.example.com"
export API_KEY="your-api-key"  # Better: use keychain

# Build settings
export BUILD_TARGET="release"
export BUILD_PARALLEL=4
```

---

## 🔄 Saving Configuration

### Configuration Files

Configuration is saved in:

```
~/.nexuspro/config/
├── setup.config         # Wizard settings
├── custom.env          # User environment variables
└── custom.zsh          # User functions/aliases
```

### Save from Wizard

```bash
bash setup-wizard.sh

# Creates ~/.nexuspro/config/setup.config with:
export ENABLE_DEVTOOLS="true"
export ENABLE_VISUAL="true"
export THEME="dark"
# ... etc
```

### Manual Save

```bash
# Edit config directly
nano ~/.nexuspro/config/setup.config

# Or add environment variables
echo 'export MY_VAR="value"' >> ~/.nexuspro/custom.env

# Reload
source ~/.zshrc
```

---

## 🔍 Verifying Configuration

### Configuration Check

```bash
# View current configuration
echo "NEXUSPRO_ROOT=$NEXUSPRO_ROOT"
echo "THEME=$THEME"
echo "LAZY_LOAD=$LAZY_LOAD_ENABLED"

# List all NEXUSPRO variables
env | grep NEXUSPRO

# List module configuration
show_module_config "devtools"
```

### Testing Changes

```bash
# Reload shell (don't restart terminal)
source ~/.zshrc

# Run diagnostics
system_diagnostics

# Check startup time
show_startup_time
```

---

## 🆘 Configuration Troubleshooting

### Issue: Configuration Not Applied

**Solution**:

```bash
# Check if file sourced
grep "source.*zshrc.main" ~/.zshrc

# Check for errors in config
zsh -x ~/.zshrc 2>&1 | head -20

# Reload configuration
source ~/.zshrc
```

### Issue: Module Not Loading

**Solution**:

```bash
# Check module exists
ls ~/.nexuspro/modules/

# Check module syntax
zsh -n ~/.nexuspro/modules/mymodule.module.zsh

# Load manually with debug
source ~/.nexuspro/modules/mymodule.module.zsh 2>&1
```

### Issue: Performance Degraded

**Solution**:

```bash
# Check startup time
show_startup_time

# Profile startup
profile_shell

# Disable lazy loading to test
export LAZY_LOAD_ENABLED=false
source ~/.zshrc
show_startup_time
```

---

*Configuration Guide - NEXUSPRO Terminal System v1.0*
