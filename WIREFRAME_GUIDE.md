# NEXUS-NOVA WIREFRAME DASHBOARD GUIDE

## 🎨 Enhanced Terminal UI with Modular Panels

This guide documents the new wireframe-based dashboard system with collapsible, interactive panels.

---

## 📐 Architecture Overview

### Panel System Hierarchy
```
┌─────────────────────────────────────────────────┐
│           Global Header                         │
│   [Settings] [Notifications] [Exit]             │
├─────────────────────────────────────────────────┤
│           Quick Access Bar                      │
│   [Telemetry] [AI] [Network] [Security]         │
├─────────────────────────────────────────────────┤
│                                                 │
│           Primary Workspace                     │
│   (Context-specific interactive panels)         │
│                                                 │
├─────────────────────────────────────────────────┤
│           Status Bar                            │
│   CPU | Memory | Disk | Temperature             │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Interactive Panels (F-Key Navigation)

### F6 - Chat Assistant Panel
**Purpose**: Interactive AI Q&A, contextual help, diagnostics

**Features**:
- Real-time conversation with AI
- Context-aware suggestions
- Command shortcuts (/status, /help, /analyze)
- Conversation history
- Smart command recommendations

**Use Cases**:
- "What's my system status?"
- "Run diagnostics on AI module"
- "Optimize memory usage"

### F7 - Command Terminal Panel
**Purpose**: Direct system command execution

**Features**:
- Full ZSH terminal access
- Command history (↑↓ navigation)
- Real-time output display
- Progress bars for long operations
- Error highlighting

**Use Cases**:
- Run nova-monitor
- Execute custom scripts
- System administration tasks

### F8 - Code Editor Panel
**Purpose**: Edit and execute code/scripts

**Features**:
- Syntax highlighting (ZSH, Python, etc.)
- Line numbers
- Output console (split view)
- Save/Run/Close controls
- File browser

**Use Cases**:
- Write automation scripts
- Edit configuration files
- Quick code testing

### F9 - Visual Reasoning Panel
**Purpose**: Data visualization and analysis

**Features**:
- ASCII charts (CPU, memory trends)
- Process flow diagrams
- Network topology maps
- 3D wireframe rendering
- Multiple visualization modes

**Views**:
1. System metrics (line charts)
2. Process flows (directed graphs)
3. Network topology
4. 3D cube animations

### F10 - Split View Mode
**Purpose**: Multi-panel simultaneous viewing

**Layouts**:
- 50/50 (Equal split)
- 70/30 (Focus left)
- 30/70 (Focus right)
- Custom ratios

**Common Combinations**:
- Telemetry + Chat (monitor while asking questions)
- Command + Output (run and watch results)
- Code + Visual (develop with immediate feedback)

---

## 🎨 Panel States

### Visual Indicators
```
[-]  = Expanded panel (click to collapse)
[>]  = Collapsed panel (click to expand)
[x]  = Closed panel (removed from view)
```

### State Transitions
```
Collapsed [>] ─┐
               ├─> Toggle ─> Expanded [-]
Expanded [-] ──┘

Expanded [-] ──> Close ──> Closed [x]

Closed [x] ────> Reopen ──> Collapsed [>]
```

---

## 🚀 User Flow Examples

### Flow 1: System Performance Alert
```
1. Alert appears in status bar: "High CPU Usage"
   └─> Status Bar: ⚡ CPU: 92% (RED)

2. User presses F7 to open Command Terminal
   └─> Command panel opens

3. User runs: nova-monitor
   └─> Real-time metrics displayed

4. User presses F6 to open Chat Assistant
   └─> Asks: "Why is CPU high?"

5. AI responds with analysis and suggestions
   └─> User follows recommendation
```

### Flow 2: Code Development Workflow
```
1. User presses F8 to open Code Editor
   └─> Editor opens with blank file

2. User writes automation script
   └─> Syntax highlighting active

3. User clicks [Run] button
   └─> Output appears in console below

4. User presses F10 for Split View
   └─> Code on left, output on right

5. User iterates with immediate feedback
   └─> Saves final version
```

### Flow 3: Data Analysis
```
1. User runs system analysis command
   └─> Data collected in background

2. User presses F9 for Visual Reasoning
   └─> Chart selection appears

3. User selects "CPU Usage (Last 60s)"
   └─> Line chart renders with ASCII art

4. User switches to "Process Flow" view
   └─> Directed graph shows system architecture

5. User exports visualization
   └─> Saved to workspace
```

---

## 🎨 Design Principles Applied

### 1. Information Architecture
**Priority Hierarchy**:
- Critical alerts → Top (header notifications)
- Primary workspace → Middle (60% of screen)
- Contextual info → Bottom (status bar)

**Data Grouping**:
- System metrics together (Telemetry panel)
- Interactive tools together (Chat, Command, Code)
- Visualizations together (Visual Reasoning)

### 2. Visual Hierarchy
**Box Drawing Characters**:
```
━  Heavy lines (top priority borders)
─  Light lines (secondary dividers)
╔╗  Rounded corners (panels)
├┤  Connections (hierarchy)
```

**Spacing Strategy**:
- 2 lines between major sections
- 1 line between related items
- Indentation for nested content

### 3. Responsive Design

**Large Terminals (>120 columns)**:
```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Telemetry    │  │  Chat         │  │  Visual       │
│  Full detail  │  │  Full conv    │  │  Full chart   │
└───────────────┘  └───────────────┘  └───────────────┘
```

**Medium Terminals (80-120 columns)**:
```
┌───────────────────────────────────┐
│  Telemetry (condensed)            │
│  ⚡45% 🧠62% 💾82%                 │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│  Chat (recent messages only)      │
└───────────────────────────────────┘
```

**Small Terminals (<80 columns)**:
```
┌─────────────┐
│  Single     │
│  Panel      │
│  Focus Mode │
└─────────────┘
  [Prev][Next]
```

### 4. Navigation Consistency
**Global Shortcuts** (work everywhere):
- F1-F5: Quick access panels
- F6-F9: Primary workspaces
- F10: View mode toggle
- ESC: Go back
- Q: Quit current view
- H: Help

**Panel Shortcuts** (context-specific):
- Ctrl+C: Cancel operation
- Ctrl+L: Clear/Refresh
- ↑↓: Navigate history
- Tab: Auto-complete

---

## 💡 Wireframing Tips for Developers

### Creating New Panels

**1. Start with Purpose**
```
What problem does this panel solve?
What data must it display?
What actions can users take?
```

**2. Sketch Information Flow**
```
Input → Processing → Output
  ↓         ↓          ↓
Field    Progress   Result
```

**3. Plan Responsive Behavior**
```
Desktop: [Full panel with details]
Tablet:  [Condensed panel]
Mobile:  [Icon only] → Click to expand
```

### ASCII Art Design Patterns

**Progress Indicators**:
```zsh
[████████████░░░░░░░░] 62%  # Bar
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%  # Filled
⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏              # Spinner
```

**Status Indicators**:
```zsh
✓ Success
✗ Failure
⚠ Warning
ℹ Info
⚡ Action
```

**Charts**:
```zsh
# Line chart
  │    ╱╲
  │   ╱  ╲
  │  ╱    ╲
  └─────────>

# Bar chart
  ████  92%
  ██    45%
  ██████  78%
```

**Flowcharts**:
```zsh
┌──────┐
│ Step │
└───┬──┘
    │
    ▼
┌──────┐
│ Next │
└──────┘
```

---

## 🔧 Integration with Existing System

### Loading the Wireframe Dashboard
```bash
# In nexus_nova.zsh, add:
source "${NEXUS_NOVA_ROOT}/src/ui/nexus_wireframe_dashboard.zsh"

# Or auto-load on startup:
if [[ -f "${NEXUS_NOVA_ROOT}/src/ui/nexus_wireframe_dashboard.zsh" ]]; then
  source "${NEXUS_NOVA_ROOT}/src/ui/nexus_wireframe_dashboard.zsh"
fi
```

### Launching the Dashboard
```bash
# Method 1: Direct command
nexus-enhanced-dashboard

# Method 2: Alias
nw

# Method 3: From main menu
nexus-dashboard  # Then select wireframe mode
```

### Adding Custom Panels
```zsh
# Create new panel function
nexus_draw_my_custom_panel() {
  clear
  cat << 'WIREFRAME'
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  MY CUSTOM PANEL            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                             ┃
┃  Custom content here        ┃
┃                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
WIREFRAME
}

# Register in nexus_enhanced_dashboard
# Add case to switch statement
```

---

## 📊 Performance Considerations

### Rendering Optimization
- **Minimize redraws**: Only redraw on state change
- **Cache static content**: Pre-generate fixed wireframes
- **Lazy load panels**: Load content when expanded
- **Debounce updates**: Limit refresh rate to 10Hz

### Memory Management
- **Clear buffers**: Reset terminal between major view changes
- **Limit history**: Keep only recent 100 chat/command entries
- **Compress logs**: Archive old data to disk

---

## 🎯 Best Practices

### Do's ✅
- Use consistent box-drawing characters
- Maintain alignment across panels
- Provide keyboard shortcuts for all actions
- Show loading states for async operations
- Preserve user context across panel switches

### Don'ts ❌
- Mix different border styles (confusing)
- Exceed terminal width (causes wrapping)
- Nest panels more than 3 levels deep
- Block on long operations without progress
- Lose user input on view changes

---

## 🚀 Future Enhancements

### Planned Features
1. **Theme System**: Cyberpunk, Matrix, Ocean color schemes
2. **Panel Layouts**: Save/load custom panel arrangements
3. **Mouse Support**: Click to expand/collapse panels
4. **Plugin System**: Third-party panel extensions
5. **Telemetry**: Track panel usage to optimize UX

### Experimental Ideas
1. **AR Mode**: Overlay on camera feed (with compatible terminals)
2. **Voice Control**: "Show AI panel" voice commands
3. **Collaborative**: Multi-user shared dashboard sessions
4. **AI Layout**: ML suggests optimal panel arrangement

---

## 📚 Reference

### Box Drawing Characters
```
┌ ┬ ┐  Top corners & T-junctions
├ ┼ ┤  Middle connections
└ ┴ ┘  Bottom corners & inverted T
─ │    Lines
═ ║    Double lines
╔ ╦ ╗  Rounded/heavy corners
╠ ╬ ╣  Heavy connectors
╚ ╩ ╝  Heavy bottom
━      Heavy horizontal
┃      Heavy vertical
```

### ANSI Escape Codes
```zsh
\033[0m     Reset
\033[1m     Bold
\033[4m     Underline
\033[30-37m Foreground colors
\033[40-47m Background colors
\033[2J     Clear screen
\033[H      Cursor home
```

### Terminal Capabilities
```bash
# Check terminal size
echo $COLUMNS x $LINES

# Detect color support
tput colors

# Check UTF-8 support
locale | grep UTF-8
```

---

**🎨 Wireframe Dashboard Ready!**

Launch with: `nexus-enhanced-dashboard` or `nw`

Press F6-F10 to navigate between interactive panels!
