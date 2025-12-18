# Installation Guide

## 📋 Prerequisites

- macOS 10.15+ (Catalina or newer)
- Zsh shell (default on modern macOS)
- 50MB free disk space
- Git installed
- Internet connection (for Homebrew and package downloads)

---

## 🚀 Installation Methods

### Method 1: Quick Installation (Recommended)

```bash
# Clone or download the repository
git clone https://github.com/Q-T0NLY/.ZSHRC.git
cd .ZSHRC

# Run automated installer
bash install.sh

# Reload shell
source ~/.zshrc
```

### Method 2: With Setup Wizard (Interactive)

```bash
cd .ZSHRC

# Configure preferences
bash setup-wizard.sh

# Install with your preferences
bash install.sh

# Reload shell
source ~/.zshrc
```

### Method 3: Manual Installation

```bash
# Create NEXUSPRO directory structure
mkdir -p ~/.nexuspro/{config,modules,backups,cache,logs}

# Copy modules
cp modules/*.module.zsh ~/.nexuspro/modules/
cp zshrc.main ~/.nexuspro/

# Create .zshrc pointing to NEXUSPRO system
cat > ~/.zshrc << 'EOF'
# NEXUSPRO Terminal System
if [[ -f "${HOME}/.nexuspro/zshrc.main" ]]; then
    source "${HOME}/.nexuspro/zshrc.main"
fi
EOF

# Reload shell
source ~/.zshrc
```

---

## ✅ Installation Steps

### Step 1: System Check
The installer verifies:
- macOS operating system
- Zsh shell availability
- Critical tools (git, curl)
- Disk space

### Step 2: Backup Creation
- Backs up existing dotfiles to `~/.dotfiles.backup/`
- Preserves all previous configurations
- Includes timestamp for version tracking

### Step 3: Directory Setup
Creates the following structure:
```
~/.nexuspro/
├── config/          # User configurations
├── modules/         # Shell modules
├── cache/           # Caching storage
├── logs/            # Log files
└── backups/         # Manual backups
```

### Step 4: Module Installation
- Deploys all 8 modules to `~/.nexuspro/modules/`
- Configures module dependencies
- Initializes logging system

### Step 5: Shell Configuration
- Creates new `.zshrc` sourcing NEXUSPRO system
- Backs up existing `.zshrc` if present
- Enables all modules

### Step 6: Validation
The installer verifies:
- All directories created
- All modules present
- .zshrc configured correctly
- Installation successful

---

## 🔧 Configuration

### Basic Configuration

Edit `~/.zshrc` to customize:

```bash
# Set performance target (milliseconds)
export SHELL_STARTUP_TARGET=50

# Disable specific modules
# export CONFIG_ENABLE_DEVTOOLS=false

# Change theme
export THEME="light"
```

### Advanced Configuration

Edit module-specific settings:

```bash
# Git configuration
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# Docker settings
export DOCKER_BUILDKIT=1

# Language runtimes
export PYENV_ROOT="${HOME}/.pyenv"
export NVM_DIR="${HOME}/.nvm"
```

### Environment Variables

Key environment variables:

```bash
# NEXUSPRO Paths
NEXUSPRO_ROOT="${HOME}/.nexuspro"
NEXUSPRO_CONFIG="${NEXUSPRO_ROOT}/config"
NEXUSPRO_MODULES="${NEXUSPRO_ROOT}/modules"
NEXUSPRO_CACHE="${NEXUSPRO_ROOT}/cache"
NEXUSPRO_LOG="${NEXUSPRO_ROOT}/logs"

# System
LANG="en_US.UTF-8"
EDITOR="nano"  # or your preferred editor
SHELL_STARTUP_TARGET=50
```

---

## 🔄 Customization

### Disable a Module

To disable a module, comment out its load in `~/.nexuspro/zshrc.main`:

```bash
# load_module "devtools"
# load_module "cleanup"
```

### Customize Module Behavior

Edit `~/.nexuspro/modules/<module>.module.zsh`:

```bash
# Example: Customize git aliases
vim ~/.nexuspro/modules/devtools.module.zsh

# Find and modify git alias functions
# Reload shell to apply changes
source ~/.zshrc
```

### Add Custom Functions

Create `~/.nexuspro/custom.zsh`:

```bash
# My custom functions
my_function() {
    # Your code here
}

export -f my_function
```

Source it in `~/.zshrc`:

```bash
[[ -f "${HOME}/.nexuspro/custom.zsh" ]] && source "${HOME}/.nexuspro/custom.zsh"
```

---

## ⚙️ Integration with Existing Setup

### Keep Existing Dotfiles

The installer backs up existing dotfiles:

```bash
# Restore if needed
bash restore.sh

# Or manually
cp ~/.dotfiles.backup/.zshrc.TIMESTAMP ~/.zshrc
```

### Preserve Custom Aliases

Add your aliases to `~/.nexuspro/custom.zsh`:

```bash
# Move existing aliases
cat >> ~/.nexuspro/custom.zsh << 'EOF'
# My custom aliases
alias myalias="command here"
EOF

# Source in ~/.zshrc
source ~/.nexuspro/custom.zsh
```

### Use Specific Modules Only

In `~/.nexuspro/zshrc.main`, comment out unwanted modules:

```bash
# load_module "cleanup"        # Skip cleanup
load_module "performance"      # Keep performance
load_module "visual"           # Keep visual
```

---

## 🐛 Troubleshooting Installation

### Issue: "Command not found: bash"

**Solution**: Use explicit bash:

```bash
/bin/bash install.sh
```

### Issue: "Permission denied" Error

**Solution**: Make scripts executable:

```bash
chmod +x install.sh setup-wizard.sh restore.sh
bash install.sh
```

### Issue: "No module named zsh-syntax-highlighting"

**Solution**: This is optional. Install manually:

```bash
brew install zsh-syntax-highlighting
brew install zsh-autosuggestions
```

### Issue: "Homebrew not found"

**Solution**: Installer detects this and can install it:

- Follow installer prompts to install Homebrew
- Or install manually: https://brew.sh

### Issue: Installation Fails Midway

**Solution**: Restore from backup:

```bash
bash restore.sh
```

Then investigate the error in installation log:

```bash
cat ~/.nexuspro/logs/zshrc.log
```

---

## ✅ Verification

After installation, verify:

### 1. Check Installation
```bash
ls -la ~/.nexuspro/
# Should show: config, modules, cache, logs, backups
```

### 2. Verify Modules
```bash
ls ~/.nexuspro/modules/
# Should show 8 .module.zsh files
```

### 3. Test Commands
```bash
# Check system diagnostics
system_diagnostics

# Check startup time
show_startup_time

# List available functions
compgen -c | grep -E '^(path_|pkg_|setup_)' | head -10
```

### 4. Verify Performance
```bash
# Startup time should be <50ms
show_startup_time

# If slow, profile to find issues
profile_shell
analyze_startup
```

---

## 🔄 Uninstall / Restore Previous Setup

### Restore Original Configuration

```bash
bash restore.sh
```

This restores your previous shell configuration.

### Complete Removal

```bash
# Remove NEXUSPRO system
rm -rf ~/.nexuspro

# Remove installer files
cd ~
rm -rf .ZSHRC  # if you cloned to home

# Restore original configuration
bash .ZSHRC/restore.sh
```

---

## 📞 Getting Help

### Check Installation Log
```bash
cat ~/.nexuspro/logs/zshrc.log
```

### Run Diagnostics
```bash
system_diagnostics
```

### Check Module Loading
```bash
# Source shell with debug
zsh -x ~/.zshrc
```

### Get Help
```bash
bash install.sh --help
bash setup-wizard.sh --help
bash restore.sh --help
```

---

## 🎉 Success!

After successful installation:

1. **Reload your shell**: `source ~/.zshrc`
2. **Explore commands**: Type `system_diagnostics`
3. **Check performance**: Type `show_startup_time`
4. **Read documentation**: See CONFIGURATION.md and ARCHITECTURE.md
5. **Start developing**: Enjoy your enhanced terminal!

---

*Installation Guide - NEXUSPRO Terminal System v1.0*
