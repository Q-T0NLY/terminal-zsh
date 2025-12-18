# NEXUS AI Studio

Production-grade ZSH configuration for macOS.

## Installation

```bash
# Clone to ~/.nexus-ai
git clone https://github.com/Q-T0NLY/.ZSHRC.git ~/.nexus-ai

# Backup existing config
mv ~/.zshrc ~/.zshrc.backup 2>/dev/null

# Link configuration
ln -s ~/.nexus-ai/.zshrc ~/.zshrc
ln -s ~/.nexus-ai/.zshenv ~/.zshenv

# Reload shell
source ~/.zshrc
```

## Features

- ⚡ Fast startup (<100ms)
- 🎨 Clean, modular structure
- 📦 Essential aliases and functions
- 🔧 Sensible defaults
- 🎯 macOS optimized

## Quick Start

```bash
nexus-help    # Show help
reload        # Reload config
ll            # List files
mkcd mydir    # Make and enter directory
```

## Structure

```
.nexus-ai/
├── .zshrc              # Main configuration
├── .zshenv             # Environment variables
└── lib/
    ├── aliases.zsh     # Command shortcuts
    └── functions.zsh   # Utility functions
```

## Customization

Edit files in `~/.nexus-ai/lib/` to add your own aliases and functions.

## License

MIT
