# Nexus Quantum — Merged Omniverse

This repository contains a consolidated ZSH configuration and helper scripts that merge features from multiple Nexus Quantum releases (v4..v9).

Files added:

- `nexus_merged.zsh` — consolidated, production-oriented ZSH configuration combining holographic/3D visuals, TUI menu, path reconstruction, alerts, resource governor, and safe cleanup.
- `deploy_nexuspro.sh` — sanitized deployment script for the NexusPro AI Studio (bash). Review and replace secrets before use.

Quick start:

1. Review `deploy_nexuspro.sh` and set `NEXUS_REALITY_MODE=PHYSICAL_PRODUCTION` and required environment variables in a secure `.env`.
2. Source the ZSH script in your `~/.zshrc`:

```sh
source /workspaces/terminal-zsh/nexus_merged.zsh
```

3. Launch the TUI: `menu`

Security: replace placeholder keys and review destructive commands (factory reset / clean slate) before running in production.
