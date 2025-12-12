# Aeternum Download Guardian & Installation Protection System

## 🛡️ Purpose

**Aeternum Download Guardian** is a system-wide terminal integration designed to solve critical problems with package downloads and compilation processes:

### Problems Solved

1. **Incomplete Dependencies & Package Downloads**
   - Prevents partial downloads from corrupting your system
   - Verifies every download with 7-layer verification
   - Auto-recovers from network interruptions

2. **Hours-Long Compilation Failures**
   - Protects formulas that take hours to compile (e.g., LLVM, TensorFlow, Qt)
   - Prevents catastrophic loss when compilation is cut off/interrupted
   - Enables resume from last successful stage

3. **Unknown Duration & Progress**
   - Real-time progress tracking with ETA calculation
   - Visual progress bars showing current phase
   - Time elapsed and estimated time remaining

4. **System-Wide Terminal Process Control**
   - Monitors ALL downloads across the terminal
   - Tracks all compilation processes
   - Provides unified control and recovery interface

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TERMINAL LAYER                          │
│  (brew, pip, npm, cargo, make, wget, curl commands)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│          PACKAGE MANAGER INTEGRATION LAYER                  │
│  • Wrapper functions intercept install commands            │
│  • Detect long-running/risky operations                     │
│  • Route to protection systems                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────▼──────────┐     ┌───────────▼──────────┐
│  AETERNUM        │     │  INSTALLATION        │
│  DOWNLOAD        │     │  GUARDIAN            │
│  GUARDIAN        │     │                      │
│                  │     │  • 9-phase process   │
│  • 7-layer       │     │  • Checkpointing     │
│    verification  │     │  • Resume capability │
│  • Multi-thread  │     │  • Rollback support  │
│  • Erasure code  │     │  • Progress tracking │
│  • Auto-healing  │     │                      │
└──────────────────┘     └──────────────────────┘
        │                            │
        └─────────────┬──────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              MONITORING DAEMON (Background)                 │
│  • Health checks every 5 minutes                            │
│  • Auto-heal corrupted files                                │
│  • Track interrupted processes                              │
│  • Offer resume for interrupted operations                  │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Aeternum Download Guardian

#### 7-Layer Verification System
1. **Layer 1: Physical Integrity** - File exists, readable, non-zero size
2. **Layer 2: Size Validation** - Matches expected file size
3. **Layer 3: Cryptographic Hash** - SHA-256/512 verification
4. **Layer 4: Binary Structure** - File type and structure analysis
5. **Layer 5: Entropy Analysis** - Shannon entropy to detect corruption
6. **Layer 6: Format Validation** - MIME type and format checking
7. **Layer 7: Cross-Verification** - Verification against remote sources

#### Multi-Threaded Download Engine
- **Segmented Downloads**: Split large files into chunks
- **Parallel Connections**: Download multiple segments simultaneously
- **Smart Fallback**: aria2c → axel → built-in segmented downloader
- **Configurable Threads**: Default 4 connections, customizable
- **Network Acceleration**: TCP optimization and CDN routing

#### Atomic Transaction System
- **Begin/Commit/Rollback**: Database-style transaction guarantees
- **Automatic Cleanup**: Failed downloads are fully removed
- **State Tracking**: JSON metadata for every transaction
- **Recovery Support**: Resume partial transactions

#### Erasure Coding Recovery
- **Parity Shards**: Create redundant data for recovery
- **Reed-Solomon Coding**: Industry-standard error correction
- **Auto-Reconstruction**: Rebuild corrupted files from shards
- **Configurable Redundancy**: Default 3 parity shards

#### Monitoring Daemon
- **Background Process**: Continuously monitors protected files
- **Health Checks**: Verify integrity every 5 minutes
- **Auto-Healing**: Automatically repair corrupted files
- **Process Tracking**: Detect and log interrupted operations

### Installation Guardian

#### 9-Phase Installation Process
1. **Pre-flight Checks**: Verify system requirements
2. **Dependency Resolution**: Identify and validate dependencies
3. **Source/Binary Acquisition**: Download with Aeternum protection
4. **Verification & Validation**: Full 7-layer verification
5. **Preparation & Extraction**: Unpack and prepare build environment
6. **Build/Compilation**: Monitor compilation with checkpointing
7. **System Installation**: Atomic installation with snapshot
8. **Post-Install Configuration**: Shell integration and verification
9. **Final Verification**: Confirm installation success

#### Checkpoint System
- **Stage-Level Checkpoints**: Save state after each phase
- **Resume Capability**: Continue from last successful checkpoint
- **Environment Preservation**: Store PATH, CFLAGS, working directory
- **Metadata Tracking**: JSON records with timestamps and context

#### System Snapshot & Rollback
- **Pre-Install Snapshots**: Capture system state before changes
- **Package Manager State**: Record all installed packages
- **File System State**: Track /usr/local modifications
- **One-Command Rollback**: Restore to snapshot on failure

#### Real-Time Progress
- **Visual Progress Bars**: 9-phase progress indicator
- **ETA Calculation**: Estimated time to completion
- **Phase Description**: Clear indication of current operation
- **Time Tracking**: Elapsed time and average phase duration

#### Build Monitoring
- **Compilation Output Logging**: Full output capture
- **Periodic Checkpointing**: Save state during long builds
- **Interrupt Detection**: Detect and log process interruptions
- **Build State Preservation**: Save partial builds for resume

### Package Manager Integration

#### Supported Package Managers
- ✅ **Homebrew** (brew) - macOS package manager
- ✅ **pip/pip3** - Python package installer
- ✅ **npm** - Node.js package manager
- ✅ **cargo** - Rust package manager
- ✅ **gem** - Ruby package manager
- ✅ **make** - Build automation tool
- ✅ **wget/curl** - Download tools

#### Intelligent Protection
- **Risk Detection**: Identify packages needing protection
- **Selective Wrapping**: Only protect operations that need it
- **Source Build Detection**: Identify compile-from-source packages
- **Fast-Path Fallback**: Quick installs bypass protection overhead

#### Transparent Integration
- **No Configuration Required**: Works automatically
- **Override Functions**: Wrapper functions intercept commands
- **Backward Compatible**: All original flags and options work
- **Opt-Out Available**: Can disable per package manager

## 📦 Installation

### Automatic (with Nexus-AI-Studio)
```bash
# If you have Nexus-AI-Studio, it's already included
source /path/to/nexus-ai-studio.zsh
```

### Manual Integration
```bash
# Add to your ~/.zshrc
export NEXUS_ROOT="/path/to/terminal-zsh"

# Load Aeternum and guardians
source "${NEXUS_ROOT}/src/system_management/aeternum_guardian.zsh"
source "${NEXUS_ROOT}/src/system_management/installation_guardian.zsh"
source "${NEXUS_ROOT}/src/system_management/pkg_manager_integration.zsh"

# Optional: Start monitoring daemon automatically
export AETERNUM_AUTO_START_DAEMON=true
```

## 🚀 Usage

### Aeternum Download Guardian

#### Protected Download
```bash
# Download with full protection
aeternum download https://example.com/file.tar.gz ./file.tar.gz

# With hash verification
aeternum download https://example.com/file.tar.gz ./file.tar.gz abc123...

# With size and hash
aeternum download https://example.com/file.tar.gz ./file.tar.gz abc123... 1048576
```

#### Verify Existing File
```bash
# Run 7-layer verification
aeternum verify ./file.tar.gz

# With expected values
aeternum verify ./file.tar.gz 1048576 abc123... "gzip"
```

#### Daemon Control
```bash
# Start monitoring daemon
aeternum daemon-start

# Stop monitoring daemon
aeternum daemon-stop

# Check daemon status
ps aux | grep aeternum
```

#### Auto-Healing
```bash
# Attempt to heal corrupted file
aeternum heal ./corrupted-file.tar.gz
```

### Installation Guardian

#### Protected Installation
```bash
# Install with Homebrew protection
install-guardian install python@3.11 brew

# Install from source
install-guardian install https://example.com/source.tar.gz source

# Auto-detect method
install-guardian install python@3.11 auto
```

#### Resume Interrupted Installation
```bash
# List resumable installations
install-guardian list

# Resume specific installation
install-guardian resume install_1234567890_12345
```

#### System Management
```bash
# Create system snapshot
install-guardian snapshot

# Rollback to snapshot
install-guardian rollback snapshot_id

# Verify installation
install-guardian verify python@3.11
```

### Package Manager Integration (Automatic)

#### Homebrew
```bash
# Protected automatically for source builds
brew install llvm          # Protected (long compilation)
brew install wget          # Not protected (quick binary install)
brew build-from-source qt  # Protected (hours-long build)
```

#### pip/pip3
```bash
# Protected for packages with native extensions
pip3 install numpy         # Protected (compilation required)
pip3 install requests      # Not protected (pure Python)
```

#### npm
```bash
# Protected for packages with native modules
npm install node-sass      # Protected (native compilation)
npm install express        # Not protected (pure JavaScript)
```

#### cargo
```bash
# Always protected (Rust builds can be lengthy)
cargo install ripgrep      # Protected with checkpointing
cargo build --release      # Protected with progress tracking
```

#### make
```bash
# Protected automatically when Makefile detected
./configure && make        # Protected with checkpointing
make install               # Protected with system snapshot
```

### Clean Slate Integration

```bash
# Check protection status
clean_slate status

# Start monitoring daemon
clean_slate daemon

# View recent activity
clean_slate status
```

## ⚙️ Configuration

### Environment Variables

#### Aeternum Guardian
```bash
export AETERNUM_HASH_ALGO="sha256"           # Hash algorithm (sha256, sha512, md5)
export AETERNUM_PARITY_SHARDS=3              # Number of parity shards
export AETERNUM_HEALTH_CHECK_INTERVAL=300    # Health check interval (seconds)
export AETERNUM_AUTO_HEAL=true               # Enable auto-healing
export AETERNUM_MAX_RETRY=5                  # Max download retries
export AETERNUM_DOWNLOAD_THREADS=4           # Concurrent download connections
export AETERNUM_SEGMENT_SIZE=10485760        # Segment size (10MB)
export AETERNUM_TIMEOUT=300                  # Download timeout (seconds)
export AETERNUM_NETWORK_ACCEL=true           # Enable network acceleration
export AETERNUM_VERBOSE=false                # Verbose logging
```

#### Installation Guardian
```bash
export INSTALL_VERBOSE=true                  # Show detailed progress
```

#### Package Manager Integration
```bash
export AETERNUM_PROTECT_BREW=true            # Protect Homebrew
export AETERNUM_PROTECT_PIP=true             # Protect pip
export AETERNUM_PROTECT_NPM=true             # Protect npm
export AETERNUM_PROTECT_CARGO=true           # Protect cargo
export AETERNUM_PROTECT_GEM=true             # Protect gem
export AETERNUM_AUTO_START_DAEMON=false      # Auto-start daemon
```

### Storage Locations
```bash
~/.aeternum/
├── vault/              # Protected downloads
├── checkpoints/        # Process checkpoints
├── logs/               # Operation logs
├── cache/              # Download cache
├── parity/             # Erasure coding shards
├── journal.jsonl       # Forensic audit log
└── daemon.pid          # Daemon process ID

~/.install_guardian/
├── builds/             # Build artifacts
├── checkpoints/        # Installation checkpoints
├── logs/               # Installation logs
├── snapshots/          # System snapshots
└── journal.jsonl       # Installation journal

~/.nexus/clean_slate/
├── logs/               # Clean Slate logs
└── backups/            # System backups
```

## 📊 Real-World Examples

### Example 1: Protecting LLVM Compilation (Hours-Long)
```bash
# Traditional way (risky)
brew install llvm --build-from-source
# If interrupted after 3 hours, all progress lost

# With Aeternum (protected)
brew install llvm --build-from-source
# Automatic checkpointing every few minutes
# If interrupted, resume with:
install-guardian list
install-guardian resume install_xxxxx
# Continues from last successful phase
```

### Example 2: Python Package with Native Extensions
```bash
# Protected automatically
pip3 install numpy
# Output shows:
#   Aeternum: Protecting pip install operation...
#   Phase 3/9: Source/binary acquisition
#   [████████████████░░░░] 80% - ETA: 00:05
```

### Example 3: Large Source Download
```bash
# Direct download with protection
aeternum download https://www.kernel.org/pub/linux/kernel/v6.x/linux-6.5.tar.xz linux.tar.xz

# Features:
# - Multi-threaded download (4 connections)
# - 7-layer verification
# - Automatic retry on failure
# - Parity shards for recovery
```

### Example 4: Resume After System Crash
```bash
# System crashed during cargo build
# After reboot:

install-guardian list
# Shows:
#   cargo_build_1701234567_12345
#     Phase: 6/9 - Build/compilation
#     Last checkpoint: 2024-12-12T10:30:00Z

install-guardian resume cargo_build_1701234567_12345
# Continues from Phase 6, no need to restart
```

## 🔍 Monitoring & Debugging

### Check System Status
```bash
clean_slate status
```

Output:
```
=== Clean Slate Protection Status ===

✓ Aeternum Daemon: Running (PID: 12345)

Package Manager Protection:
  Homebrew: true
  pip/pip3: true
  npm:      true
  cargo:    true
  gem:      true

Storage Locations:
  Aeternum:     /Users/you/.aeternum
  Install Guard: /Users/you/.install_guardian
  Clean Slate:  /Users/you/.nexus/clean_slate

Recent Activity:
  Total operations: 15
  Last 3 operations:
    [2024-12-12T10:30:00Z] download - success
    [2024-12-12T09:15:00Z] install - success
    [2024-12-12T08:00:00Z] verify - success

ℹ Resumable installations: 1 (run 'install-guardian list' for details)
```

### View Logs
```bash
# Aeternum logs
tail -f ~/.aeternum/logs/$(date +%Y%m%d).log

# Installation logs
tail -f ~/.install_guardian/logs/$(date +%Y%m%d).log

# Specific installation
cat ~/.install_guardian/logs/install_xxxxx_make.log
```

### Forensic Audit Journal
```bash
# View all operations
cat ~/.aeternum/journal.jsonl | jq .

# Filter by operation
cat ~/.aeternum/journal.jsonl | jq 'select(.operation == "download")'

# Filter by status
cat ~/.aeternum/journal.jsonl | jq 'select(.status == "failure")'
```

## 🛠️ Advanced Usage

### Custom Protection for Scripts
```bash
#!/usr/bin/env zsh

# Source Aeternum in your script
source ~/.zsh/aeternum_guardian.zsh

# Protected download
aeternum_protected_download "https://example.com/file" "./file"

# Create checkpoint before risky operation
create_checkpoint "my_script" "1" '{"step": "preprocessing"}'

# Do work...

# Create another checkpoint
create_checkpoint "my_script" "2" '{"step": "processing"}'
```

### Custom Installation Flow
```bash
# Start protected installation
protected_install_package "my-app" "source" \
    --prefix=/usr/local \
    --enable-optimization

# Manual phase control
set_phase 1  # Pre-flight
set_phase 6  # Build
protected_make -j8
set_phase 7  # Install
protected_install
```

## 🤝 Integration with Other Tools

### With Nexus AI Studio
```bash
# Already integrated, just use it
clean_slate daemon
clean_slate status
```

### With Your CI/CD Pipeline
```bash
# In your build script
export AETERNUM_PROTECT_BREW=true
export INSTALL_VERBOSE=true

# All package installations automatically protected
brew install dependencies
pip3 install -r requirements.txt
npm install

# If CI runner crashes, resume on next run
if install-guardian list | grep -q "in_progress"; then
    install-guardian resume $(install-guardian list | grep -o 'install_[0-9_]*' | head -1)
fi
```

## 📝 Best Practices

1. **Start the Daemon**: Enable auto-start for continuous protection
   ```bash
   export AETERNUM_AUTO_START_DAEMON=true
   ```

2. **Regular Cleanup**: Clear old checkpoints periodically
   ```bash
   find ~/.install_guardian/checkpoints -mtime +30 -delete
   ```

3. **Monitor Disk Space**: Parity shards use additional space
   ```bash
   du -sh ~/.aeternum/parity
   ```

4. **Review Journals**: Check for patterns in failures
   ```bash
   cat ~/.aeternum/journal.jsonl | jq 'select(.status == "failure")' | jq -s 'group_by(.operation)'
   ```

5. **Test Resume Capability**: Periodically test resume functionality
   ```bash
   # Start a long build
   cargo build --release &
   # Kill it after a minute
   kill %1
   # Resume
   install-guardian list
   install-guardian resume cargo_build_xxxxx
   ```

## 🐛 Troubleshooting

### Downloads Keep Failing
- Check network connectivity
- Verify URL is correct
- Review logs: `tail ~/.aeternum/logs/$(date +%Y%m%d).log`
- Try with fewer threads: `export AETERNUM_DOWNLOAD_THREADS=1`

### Compilation Won't Resume
- Ensure checkpoint exists: `ls ~/.install_guardian/checkpoints/`
- Check working directory is preserved
- Review environment variables in checkpoint JSON
- Start fresh if needed: `rm -rf ~/.install_guardian/checkpoints/install_xxxxx`

### Daemon Not Starting
- Check if already running: `ps aux | grep aeternum`
- Remove stale PID: `rm ~/.aeternum/daemon.pid`
- Check logs: `tail ~/.aeternum/logs/$(date +%Y%m%d).log`

### Performance Issues
- Reduce download threads: `export AETERNUM_DOWNLOAD_THREADS=2`
- Increase health check interval: `export AETERNUM_HEALTH_CHECK_INTERVAL=600`
- Disable network acceleration: `export AETERNUM_NETWORK_ACCEL=false`

## 📚 Technical Details

### 7-Layer Verification Process
Each layer builds on the previous, creating defense-in-depth:

```
Layer 1 (Physical) → Layer 2 (Size) → Layer 3 (Hash) → 
Layer 4 (Structure) → Layer 5 (Entropy) → Layer 6 (Format) → 
Layer 7 (Cross-verify)
```

Critical failures (Layers 1, 3) cause immediate abort.  
Non-critical failures (Layers 5, 7) are warnings only.

### Checkpoint Format
```json
{
  "install_id": "install_1701234567_12345",
  "package": "python@3.11",
  "phase": 6,
  "phase_name": "Build/compilation",
  "timestamp": "2024-12-12T10:30:00Z",
  "elapsed_seconds": 1234,
  "pid": 12345,
  "working_directory": "/tmp/python-build",
  "environment": {
    "PATH": "/usr/local/bin:/usr/bin",
    "CFLAGS": "-O2",
    "CXXFLAGS": "-O2",
    "LDFLAGS": "-L/usr/local/lib"
  }
}
```

### Erasure Coding
Uses XOR-based parity (production would use Reed-Solomon).  
For a file split into N segments, creates M parity shards.  
Can recover from up to M corrupted segments.

## 🎓 Learning Resources

- [ZSH Function Documentation](https://zsh.sourceforge.io/Doc/Release/Functions.html)
- [Cryptographic Hash Functions](https://en.wikipedia.org/wiki/Cryptographic_hash_function)
- [Reed-Solomon Error Correction](https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction)
- [Shannon Entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory))

## 📄 License

Part of Nexus-AI-Studio. All rights reserved.

## 🙏 Credits

Created for Nexus-AI-Studio to solve real-world problems with:
- Incomplete package downloads
- Hours-long compilation failures
- Lack of progress visibility
- No resume capability for interrupted processes

Built with ❤️ for developers who've lost hours of compilation progress to a single interrupt.

