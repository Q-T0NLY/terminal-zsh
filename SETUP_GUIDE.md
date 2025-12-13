# NexusPro AI Studio v50.0 - Complete Setup & Troubleshooting Guide

## 📋 Table of Contents
1. [Quick Setup](#quick-setup)
2. [File Structure](#file-structure)
3. [Issue Resolution](#issue-resolution)
4. [Verification Steps](#verification-steps)
5. [Advanced Configuration](#advanced-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Quick Setup

### Step 1: Deploy Configuration Files
```bash
# Copy the main ZSH configuration
cp ~/.zshrc ~/.zshrc.backup
cp /path/to/.zshrc ~/.zshrc

# Copy custom extensions (optional but recommended)
cp /path/to/.zshrc_custom ~/.zshrc_custom

# Source the configuration immediately
source ~/.zshrc
```

### Step 2: Verify Installation
```bash
# Run the verification script
chmod +x /path/to/verify_zshrc.sh
/path/to/verify_zshrc.sh
```

### Step 3: Fix Powerlevel10k (if needed)
```bash
# If you see console output at startup, configure instant prompt
p10k configure

# Or manually disable if not using:
# Comment out in ~/.zshrc: source ~/.p10k.zsh
```

---

## File Structure

```
~/.zshrc                 # Main ZSH configuration (THIS IS YOUR PRIMARY FILE)
~/.zshrc_custom          # Custom enterprise extensions
~/.zshrc.backup          # Backup of previous config
~/.zshenv                # Environment variables (auto-sourced)
~/.p10k.zsh              # Powerlevel10k theme config (auto-generated)
```

---

## Issue Resolution

### Issue 1: Powerlevel10k Instant Prompt Console Output

**Problem**: Extra text appears on console at startup

**Solution**:
```bash
# Method 1: Reconfigure Powerlevel10k
p10k configure

# Method 2: Disable instant prompt (if not needed)
# Edit ~/.zshrc and comment out:
# [ -f ~/.p10k.zsh ] && source ~/.p10k.zsh

# Method 3: Manual configuration
# Edit ~/.zshrc and verify this line appears BEFORE fpath manipulation:
# if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
#   source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
# fi
```

### Issue 2: Broken Docker Symlinks

**Problem**: Docker command fails or causes PATH issues

**Solution**:
```bash
# Check Docker installation status
which docker
ls -la /usr/local/bin/docker

# Reinstall Docker via Homebrew (fixes symlinks)
brew reinstall --cask docker

# Or manual fix:
sudo rm /usr/local/bin/docker 2>/dev/null
brew link docker --force
```

### Issue 3: "read" Command Issues with Dashboard

**Problem**: ZSH read command doesn't work as expected

**Solution**:
```bash
# The .zshrc uses 'read -q' which is ZSH-specific
# Ensure you're running ZSH, not bash:
echo $SHELL

# If running bash, switch to ZSH:
chsh -s /bin/zsh

# Verify read command works:
zsh -c 'read -q "REPLY?Test (y/N): "' && echo "✅ Works"
```

### Issue 4: PATH Order Issues

**Problem**: Wrong commands are being executed (e.g., system Python instead of Homebrew)

**Solution**:
```bash
# Check current PATH
echo $PATH

# The .zshrc sets correct order:
# 1. /opt/homebrew/bin (Apple Silicon Homebrew)
# 2. /usr/local/bin (Intel Homebrew)
# 3. /usr/bin, /bin, etc. (system)

# Force correction:
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
echo $PATH  # Verify it worked
```

### Issue 5: Missing Environment Variables

**Problem**: Custom environment variables not set

**Solution**:
```bash
# Edit ~/.zshenv to add permanent variables:
cat >> ~/.zshenv << 'EOF'
export CUSTOM_VAR="value"
export OPENAI_API_KEY="sk-..."
export AI_MODEL="gpt-4"
EOF

# Source it:
source ~/.zshenv
```

---

## Verification Steps

### Test 1: ZSH Syntax Check
```bash
zsh -n ~/.zshrc
# Should produce no output if successful
```

### Test 2: Verify PATH
```bash
echo $PATH | tr ':' '\n' | head -5
# First entry should be /opt/homebrew/bin or /usr/local/bin
```

### Test 3: Check Aliases
```bash
alias | grep "ll\|la\|l"
# Should show multiple aliases

# Test an alias:
ll -la ~
# Should work without errors
```

### Test 4: Test Functions
```bash
# If custom extensions loaded:
nexus-ai "Hello"

# Check git functions:
git_stats
```

### Test 5: Docker Integration
```bash
docker --version
# Should work without errors
```

### Run Full Verification Suite
```bash
chmod +x verify_zshrc.sh
./verify_zshrc.sh
# All checks should PASS (green checkmarks)
```

---

## Advanced Configuration

### Custom AI Integration
```bash
# Set API keys in ~/.zshenv
export OPENAI_API_KEY="sk-your-key-here"
export AI_MODEL="gpt-4"  # or gpt-3.5-turbo, claude-2, etc.

# Use AI commands:
nexus-ai "Write a Python function"
nexus-code python "Calculate fibonacci"
```

### Git Workflow Enhancements
```bash
# Advanced git functions available:
git_stats        # Show repository statistics
git_clean        # Clean up merged branches
check_code       # Check code syntax

# Example:
cd /path/to/project
git_stats
git_clean
```

### Docker & Kubernetes
```bash
# Install K8s tools
nexus-k8s

# Available after install:
kubectl version
helm version
minikube start
```

### Real-time Monitoring
```bash
# Start real-time system monitoring
nexus-monitor

# Displays: CPU, Memory, Disk usage (updates every 2 seconds)
# Press Ctrl+C to exit
```

---

## Troubleshooting

### Scenario 1: Changes Not Taking Effect

**Problem**: Edited ~/.zshrc but changes don't appear

**Solution**:
```bash
# Reload configuration
source ~/.zshrc

# Or start a new terminal window/tab
# Or force reload:
exec zsh
```

### Scenario 2: Command Not Found Error

**Problem**: Common commands like `ls` not working

**Solution**:
```bash
# Check if you're using ZSH
echo $SHELL  # Should be /bin/zsh

# If not, switch:
chsh -s /bin/zsh

# Check PATH:
echo $PATH

# Verify command exists:
which ls
```

### Scenario 3: Slow Terminal Startup

**Problem**: Terminal takes 2+ seconds to load

**Causes**:
- Slow network access in PATH
- Too many functions/aliases
- Heavy prompt rendering

**Solution**:
```bash
# Time startup:
time zsh -i -c exit

# If slow, disable optional features:
# - Comment out P10k instant prompt
# - Remove heavy functions from .zshrc
# - Check for network operations in startup

# Profile startup:
zsh -xv -i -c exit 2>&1 | head -50
```

### Scenario 4: Permission Denied Errors

**Problem**: `Permission denied` when executing scripts

**Solution**:
```bash
# Make scripts executable:
chmod +x ~/.zshrc_custom
chmod +x verify_zshrc.sh

# Verify permissions:
ls -la ~/.*zsh*
# Custom files should have 'x' permission
```

### Scenario 5: git_clean Not Working

**Problem**: `git_clean` errors or doesn't find branches

**Solution**:
```bash
# Ensure you're in a git repository:
git status  # Should work without error

# If not a repo:
git init

# Manually run cleanup:
git fetch --prune
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -d
```

---

## Quick Reference

### Essential Commands
```bash
# Check configuration
cat ~/.zshrc | head -20

# Check syntax
zsh -n ~/.zshrc

# Reload immediately
source ~/.zshrc

# View PATH
echo $PATH | tr ':' '\n'

# List aliases
alias | sort

# List functions
declare -f | grep "^[a-z_]* ()" | cut -d' ' -f1

# Find config file errors
zsh -x ~/.zshrc 2>&1 | grep -i error
```

### Diagnostic Commands
```bash
# Full system diagnostic
./verify_zshrc.sh

# Check Homebrew
brew doctor

# Check Docker
docker ps

# Check Kubernetes (if installed)
kubectl cluster-info

# Monitor system
nexus-monitor
```

---

## Support & Next Steps

1. **After Setup**: Run `./verify_zshrc.sh` to confirm everything works
2. **Customization**: Edit `~/.zshrc_custom` to add your own functions/aliases
3. **Integration**: Set API keys in `~/.zshenv` for AI features
4. **Optimization**: Profile startup time and disable unused features
5. **Backup**: Keep `~/.zshrc.backup` safe for rollback

---

## Version Information

- **NexusPro AI Studio**: v50.0
- **Created**: 2025
- **ZSH Version**: 5.8+
- **Platform**: macOS/Linux (with Homebrew)
- **Status**: Production-Ready ✅

---

**Need help?** Review the specific issue in the "Issue Resolution" section above, or run the verification suite to diagnose problems automatically.
