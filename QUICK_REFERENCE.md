# NexusPro ZSH - Quick Reference Card

## 🚀 Essential Setup

```bash
# 1. Deploy configuration
cp ~/.zshrc ~/.zshrc.backup
cp .zshrc ~/.zshrc
cp .zshrc_custom ~/.zshrc_custom

# 2. Reload terminal
source ~/.zshrc
# OR open new terminal tab

# 3. Verify everything works
./verify_zshrc.sh
```

---

## 🎯 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **Powerlevel10k console output** | Run `p10k configure` |
| **Docker command fails** | Run `brew reinstall --cask docker` |
| **PATH not correct** | Check `echo $PATH \| head -1` |
| **read command fails** | Verify running ZSH: `echo $SHELL` |
| **Changes not taking effect** | Reload: `source ~/.zshrc` |
| **Command not found** | Check: `which <command>` |
| **Slow startup** | Run: `time zsh -i -c exit` |

---

## 💡 Quick Commands

### Aliases
```bash
ll          # ls -lhF (detailed listing)
la          # ls -lha (with hidden files)
l           # ls -lh (compact)
cd..        # cd .. (typo-proof)
gs          # git status
ga          # git add
gc          # git commit
```

### Functions
```bash
nexus-ai "prompt"           # AI chat
nexus-code python "desc"    # Generate code
nexus-git-stats             # Repository stats
nexus-git-clean             # Clean branches
nexus-check file.py         # Check syntax
nexus-k8s                   # Install K8s tools
nexus-monitor               # Monitor system
```

### File Navigation
```bash
mkcd dirname    # Create and enter directory
cd -            # Go to previous directory
cd ~            # Go to home
cd /path        # Absolute path
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `~/.zshrc` | Main ZSH config (PRIMARY) |
| `~/.zshrc_custom` | Custom functions/aliases |
| `~/.zshenv` | Environment variables |
| `~/.p10k.zsh` | Powerlevel10k theme |
| `~/.zshrc.backup` | Previous config backup |

---

## ✅ Verification Checklist

- [ ] Run `verify_zshrc.sh` - all checks pass
- [ ] Test alias: `ll ~`
- [ ] Test git: `git status` (in a repo)
- [ ] Check PATH: `echo $PATH | head -c 50`
- [ ] Test function: `nexus-ai "hello"` (if API key set)
- [ ] Terminal loads in <2 seconds

---

## 🎓 Usage Examples

### Daily Development
```bash
# Start work
cd ~/projects
git status          # Via alias 'gs'
ls -la              # Via alias 'll'

# Make changes
vim file.py
check_code file.py  # Check syntax

# Commit work
git add .           # Via alias 'ga'
git commit "msg"    # Via alias 'gc'
git_stats           # View stats
```

### AI Development
```bash
# Generate code
nexus-code python "fibonacci function"

# Ask AI questions
nexus-ai "How do I use asyncio in Python?"

# Check code quality
nexus-check ./my_script.py
```

### System Maintenance
```bash
# Monitor performance
nexus-monitor

# Clean git
git_clean

# Check docker
docker --version

# Reinstall K8s tools
nexus-k8s
```

---

## 🔐 Security Notes

1. **API Keys**: Store in `~/.zshenv` (not tracked by git)
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```

2. **Permissions**: Keep config files secure
   ```bash
   chmod 600 ~/.zshrc
   chmod 600 ~/.zshenv
   ```

3. **Backups**: Keep `~/.zshrc.backup` for emergencies

---

## 📊 Performance Tips

```bash
# Check startup time
time zsh -i -c exit

# If >2 seconds, profile:
zsh -x -i -c exit 2>&1 | head -30

# Disable slow features:
# 1. Comment out instant prompt
# 2. Remove unused aliases/functions
# 3. Check for network operations
```

---

## 🆘 Emergency Troubleshooting

```bash
# Syntax error? Check:
zsh -n ~/.zshrc

# Can't load ZSH? Use system shell:
sh

# Reset to backup:
cp ~/.zshrc.backup ~/.zshrc
source ~/.zshrc

# Nuclear option (restore defaults):
rm ~/.zshrc ~/.zshenv ~/.p10k.zsh
exec zsh
```

---

## 📚 More Information

- **Full Setup Guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Verification Suite**: Run `./verify_zshrc.sh`
- **Custom Extensions**: Edit `~/.zshrc_custom`
- **Environment Setup**: Edit `~/.zshenv`

---

## ✨ What's Included

✅ **ZSH Configuration** - Production-ready setup  
✅ **Enterprise Aliases** - 20+ shortcuts for daily tasks  
✅ **Smart Functions** - Git, Docker, AI integrations  
✅ **Error Handling** - Graceful fallbacks for missing tools  
✅ **Performance** - Optimized for fast startup (<1s)  
✅ **Extensibility** - Easy to add custom functions  
✅ **Documentation** - Complete guides and references  

---

## 🎉 Get Started

1. Copy files to home directory
2. Run `./verify_zshrc.sh` 
3. Open new terminal
4. Start using commands!

**Status**: ✅ Production Ready
