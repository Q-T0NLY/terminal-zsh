# Troubleshooting Guide

## 🔍 Common Issues & Solutions

Complete reference for diagnosing and resolving issues with NEXUSPRO Terminal System.

---

## 🚨 Installation Issues

### Issue 1: "Permission Denied" Error

**Symptom**: 
```
bash: ./install.sh: Permission denied
```

**Cause**: Script not marked as executable

**Solution**:

```bash
# Make scripts executable
chmod +x install.sh setup-wizard.sh restore.sh

# Then run
bash install.sh
```

### Issue 2: "Zsh Not Found" or "Zsh Not Default"

**Symptom**:
```
Error: Zsh is not installed or not the default shell
```

**Cause**: Zsh not installed or not set as default shell

**Solution**:

```bash
# Install Zsh (if needed)
brew install zsh

# Add to valid shells
echo $(brew --prefix)/bin/zsh | sudo tee -a /etc/shells

# Set as default
chsh -s $(brew --prefix)/bin/zsh

# Verify
echo $SHELL    # Should show: /opt/homebrew/bin/zsh or /usr/local/bin/zsh

# Restart terminal
```

### Issue 3: Homebrew Not Found

**Symptom**:
```
brew: command not found
```

**Cause**: Homebrew not installed or not in PATH

**Solution**:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (for Apple Silicon Macs)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Intel Macs:
# export PATH="/usr/local/bin:$PATH"

# Verify
brew --version
```

### Issue 4: Installation Fails Midway

**Symptom**:
```
Error during installation... [specific error]
```

**Cause**: Various (disk space, permissions, network, package conflicts)

**Solution**:

```bash
# 1. Check installation log
cat ~/.nexuspro/logs/install.log | tail -50

# 2. Check system resources
df -h | grep -E "/$"     # Disk space
free -h                  # Memory (Linux)
vm_stat                  # Memory (macOS)

# 3. Check internet connection
curl -I https://brew.sh

# 4. Restore from backup
bash restore.sh

# 5. Try again with force flag
bash install.sh --force
```

### Issue 5: Backup Restore Fails

**Symptom**:
```
Backup directory not found
No backups available
```

**Cause**: Backups not created or not found

**Solution**:

```bash
# List backups
bash restore.sh --list

# If no backups, manually restore original .zshrc
# From a backup you may have elsewhere, or start fresh

# Create manual backup
cp ~/.zshrc ~/.zshrc.manual_backup

# Restore manual backup
cp ~/.zshrc.manual_backup ~/.zshrc
source ~/.zshrc
```

---

## ⚡ Performance Issues

### Issue 6: Slow Shell Startup (>100ms)

**Symptom**:
```
Shell takes >100ms to load
Each new terminal is slow
```

**Cause**: Lazy loading not working, heavy module, network delays

**Solution**:

```bash
# 1. Check startup time
show_startup_time

# 2. Profile startup to find slow section
profile_shell

# 3. Disable lazy loading to test
export LAZY_LOAD_ENABLED=false
source ~/.zshrc
show_startup_time

# 4. Identify slow module
# From profile output, find slowest section

# 5. Temporarily disable module
vim ~/.nexuspro/zshrc.main
# Comment out slow module
source ~/.zshrc
show_startup_time

# 6. If faster, that's the culprit
# Either:
# - Keep disabled if not essential
# - Lazy load it
# - Report as issue

# 7. Check for network delays
# Some commands may be reaching network
time git config user.name     # Check git
time docker ps 2>/dev/null    # Check docker
```

### Issue 7: Freezing or Hanging

**Symptom**:
```
Shell freezes/hangs when opened
Terminal becomes unresponsive
```

**Cause**: Module error, network call, infinite loop

**Solution**:

```bash
# 1. Interrupt and get debug info
# Ctrl+C to interrupt

# 2. Enable debug mode
zsh -x ~/.zshrc 2>&1 | head -100

# 3. Look for where it hangs
# Usually stops at problematic line

# 4. Temporarily disable problem module
vim ~/.nexuspro/zshrc.main
# Comment out problematic module

# 5. Test
source ~/.zshrc

# 6. If works, investigate module
# Check module file for:
# - Network calls (curl, git, ssh)
# - Infinite loops
# - Subprocess issues
```

### Issue 8: High Memory Usage

**Symptom**:
```
Shell process using >100MB memory
System sluggish
```

**Cause**: Memory leak, large cache, heavy functions

**Solution**:

```bash
# 1. Check memory usage
ps aux | grep zsh

# 2. Clear caches
cache_clear

# 3. Check for large files in cache
du -sh ~/.nexuspro/cache/

# 4. Disable problematic caching
export LAZY_LOAD_ENABLED=false
source ~/.zshrc

# 5. Monitor
ps aux | grep zsh        # After change
```

---

## 🔧 Configuration Issues

### Issue 9: Modules Not Loading

**Symptom**:
```
Modules not loaded
Commands from missing modules fail
```

**Cause**: Module file missing, syntax error, wrong path

**Solution**:

```bash
# 1. Check if modules exist
ls -la ~/.nexuspro/modules/

# 2. Check for syntax errors
for module in ~/.nexuspro/modules/*.module.zsh; do
    echo "Checking $module..."
    zsh -n "$module"
done

# 3. Check NEXUSPRO_ROOT set correctly
echo "NEXUSPRO_ROOT=$NEXUSPRO_ROOT"

# 4. Check if being sourced
cat ~/.zshrc | grep "zshrc.main"

# 5. Try loading manually
source ~/.nexuspro/zshrc.main 2>&1 | head -20

# 6. Check logs
cat ~/.nexuspro/logs/zshrc.log
```

### Issue 10: Aliases Not Working

**Symptom**:
```
Alias command not found
alias -L shows nothing
```

**Cause**: Module not loaded, alias not defined, shell function issue

**Solution**:

```bash
# 1. Check alias exists
alias | grep "myalias"

# 2. If not found, check module loaded
echo $LOADED_MODULES

# 3. Try loading module manually
source ~/.nexuspro/modules/devtools.module.zsh

# 4. Check alias definition
grep -n "alias.*myalias" ~/.nexuspro/modules/*.module.zsh

# 5. Test function directly
# Some "aliases" are actually functions
type mycommand

# 6. Reload and retry
source ~/.zshrc
myalias         # Should work now
```

### Issue 11: Environment Variables Not Set

**Symptom**:
```
Environment variables missing
$MY_VAR is empty
```

**Cause**: Not exported, module not loaded, wrong file

**Solution**:

```bash
# 1. Check if variable set
echo "$MY_VAR"

# 2. Check if exported
env | grep MY_VAR

# 3. Check where set
grep -r "MY_VAR" ~/.nexuspro/

# 4. If not found, add to ~/.nexuspro/custom.env
echo 'export MY_VAR="value"' >> ~/.nexuspro/custom.env

# 5. Reload
source ~/.zshrc

# 6. Verify
echo "$MY_VAR"
```

### Issue 12: PATH Issues

**Symptom**:
```
Command not found
Wrong version of tool running
```

**Cause**: PATH incorrect, duplicates, wrong order

**Solution**:

```bash
# 1. Check PATH
echo $PATH

# 2. Check order
echo $PATH | tr ':' '\n' | cat -n

# 3. Check for duplicates
echo $PATH | tr ':' '\n' | sort | uniq -d

# 4. Fix duplicates
path_deduplicate
source ~/.zshrc

# 5. Check which version running
which python
type python
python --version

# 6. If wrong version, adjust PATH
# Higher priority paths come first
```

### Issue 13: Git Configuration Issues

**Symptom**:
```
Git commands fail
Git not recognizing user
```

**Cause**: Git not installed, config incomplete, SSH key issue

**Solution**:

```bash
# 1. Check git installed
git --version

# 2. Check git config
git config --global user.name
git config --global user.email

# 3. Set config if missing
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 4. Check SSH key
ls -la ~/.ssh/

# 5. If no SSH key, create one
ssh-keygen -t ed25519 -C "your@email.com"
ssh-add ~/.ssh/id_ed25519

# 6. Add key to GitHub
# Copy: cat ~/.ssh/id_ed25519.pub
# Paste into GitHub Settings → SSH Keys

# 7. Test
ssh -T git@github.com
```

---

## 🐳 Development Tool Issues

### Issue 14: Docker Commands Fail

**Symptom**:
```
docker: command not found
Docker commands return errors
```

**Cause**: Docker not installed, not running, permission issue

**Solution**:

```bash
# 1. Check docker installed
docker --version

# 2. If not installed
brew install --cask docker

# 3. Start Docker Desktop
open /Applications/Docker.app

# 4. Wait for Docker to start
sleep 5

# 5. Verify running
docker ps

# 6. If permission denied
# Add user to docker group
sudo dseditgroup -o edit -a "$USER" -t user docker

# 7. Restart terminal
```

### Issue 15: Kubernetes/kubectl Issues

**Symptom**:
```
kubectl: command not found
Unable to connect to cluster
```

**Cause**: kubectl not installed, context not set, cluster not running

**Solution**:

```bash
# 1. Check kubectl installed
kubectl version --client

# 2. If not installed
brew install kubectl

# 3. Check context
kubectl config current-context

# 4. List available contexts
kubectl config get-contexts

# 5. Set context (e.g., Docker Desktop)
kubectl config use-context docker-desktop

# 6. Enable K8s in Docker Desktop
# Docker Desktop Settings → Kubernetes → Enable Kubernetes

# 7. Wait for K8s to start
# Check Docker Desktop menu

# 8. Verify connection
kubectl cluster-info
```

### Issue 16: Language Runtime Issues

**Symptom**:
```
Python/Node/Ruby command fails
Wrong version running
```

**Cause**: Runtime not installed, lazy loading issue, PATH problem

**Solution - Python**:

```bash
# Check Python
python --version
which python

# If not found, install pyenv
brew install pyenv

# Install Python
pyenv install 3.11.0

# Set version
pyenv local 3.11.0

# Reload
source ~/.zshrc

# Verify
python --version
```

**Solution - Node.js**:

```bash
# Check Node
node --version

# If not found, install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node
nvm install 18

# Set default
nvm alias default 18

# Reload terminal and verify
node --version
```

---

## 🔍 Diagnostic Commands

### System Diagnostics

```bash
# Complete system check
system_diagnostics

# Output includes:
# - OS and shell info
# - Module loading status
# - Startup performance
# - Conflicts detected
# - Recommendations
```

### Detailed Debugging

```bash
# Run with full debug output
zsh -x ~/.zshrc 2>&1 | tee debug.log

# See what functions/aliases loaded
typeset -f | grep -E '^[a-z_]+ \(\)' | cut -d' ' -f1

# Profile next startup
profile_shell

# Check module logs
tail -50 ~/.nexuspro/logs/zshrc.log

# See loaded modules
echo $LOADED_MODULES
```

### Performance Analysis

```bash
# Startup time
show_startup_time

# Compare with/without lazy loading
export LAZY_LOAD_ENABLED=false
source ~/.zshrc
show_startup_time

# Restore
export LAZY_LOAD_ENABLED=true
source ~/.zshrc
```

---

## 🆘 Getting Help

### Before Contacting Support

1. Run diagnostics:
   ```bash
   system_diagnostics > diagnostic_report.txt
   ```

2. Check logs:
   ```bash
   cat ~/.nexuspro/logs/zshrc.log
   ```

3. Try to isolate issue:
   ```bash
   # Disable modules one by one to find culprit
   ```

4. Provide information:
   - macOS version: `sw_vers`
   - Shell info: `echo $SHELL`
   - Error message (full text)
   - Steps to reproduce

### Report Information

When reporting an issue, include:

```
- macOS version
- Zsh version: zsh --version
- NEXUSPRO version: cat ~/.nexuspro/version (if exists)
- Full error message
- Output of: system_diagnostics
- Last 50 lines of: ~/.nexuspro/logs/zshrc.log
- Steps to reproduce
```

### Temporary Workarounds

While investigating:

```bash
# Disable problematic module
vim ~/.nexuspro/zshrc.main
# Comment out the module

# Or restore previous version
bash restore.sh

# Or use system shell
bash

# Or use alternate shell
zsh --no-rcs   # Skip all configs
```

---

## 📞 Support Resources

- **Documentation**: See INSTALLATION.md, CONFIGURATION.md, ARCHITECTURE.md
- **Logs**: `cat ~/.nexuspro/logs/zshrc.log`
- **Diagnostics**: Run `system_diagnostics`
- **Backups**: List with `bash restore.sh --list`

---

*Troubleshooting Guide - NEXUSPRO Terminal System v1.0*
