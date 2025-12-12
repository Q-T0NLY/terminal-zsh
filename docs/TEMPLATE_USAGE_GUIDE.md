# 📝 Dashboard Layout Template - Quick Start Guide

## 🎯 Overview

The **dashboard_layout_template.zsh** is a fully customizable template with clear placeholders that allows you to create your own dashboard layouts without modifying the core layout engine.

## 🚀 Quick Start

### 1. Copy the Template

```bash
# Create your own dashboard
cp examples/dashboard_layout_template.zsh examples/my_dashboard.zsh
chmod +x examples/my_dashboard.zsh
```

### 2. Edit Customization Sections

Open `my_dashboard.zsh` and modify these clearly marked sections:

#### **Section 1: Branding & Theme**
```zsh
DASHBOARD_TITLE="MY PROJECT NAME"           # Your dashboard name
DASHBOARD_SUBTITLE="v1.0"                   # Version/subtitle
GRADIENT_TYPE="rainbow"                     # rainbow|ocean|sunset|aurora|fire
DEFAULT_BORDER_STYLE="double"               # double|single|rounded|thick|ascii
```

#### **Section 2: Panel Configuration**
```zsh
typeset -A PANEL_CONFIG=(
  [panel_1]="top_left|CPU Monitor|50|12|5|3|double"
  [panel_2]="top_right|Memory|50|12|60|3|rounded"
  # Add more panels...
)
```

#### **Section 3: Content Generators**
```zsh
generate_content_top_left() {
  cat <<'CONTENT_EOF'
Your custom content here
Can be multi-line
Include data, charts, etc.
CONTENT_EOF
}
```

### 3. Run Your Dashboard

```bash
./examples/my_dashboard.zsh
```

---

## 🎨 Customization Guide

### Layout Presets

Choose from built-in presets or create custom:

```zsh
LAYOUT_PRESET="grid_4"    # 4-panel grid
LAYOUT_PRESET="grid_6"    # 6-panel grid
LAYOUT_PRESET="sidebar"   # Main + sidebar
LAYOUT_PRESET="centered"  # Single centered panel
LAYOUT_PRESET="golden"    # Golden ratio layout
LAYOUT_PRESET="custom"    # Use PANEL_CONFIG
```

### Panel Definition Format

```zsh
[panel_id]="id|title|width|height|x|y|border"
```

**Parameters:**
- `id`: Unique identifier (alphanumeric)
- `title`: Display title in panel header
- `width`: Panel width in characters
- `height`: Panel height in lines
- `x`: Horizontal position (number or "auto")
- `y`: Vertical position (number or "auto")
- `border`: Border style (double/single/rounded/thick/ascii)

**Example:**
```zsh
[main]="dashboard|Main Panel|80|20|auto|auto|rounded"
```

### Gradient Types

Available gradients for text colorization:

| Gradient | Colors | Best For |
|----------|--------|----------|
| `rainbow` | 🌈 Full spectrum | Headers, titles |
| `ocean` | 🌊 Blue-cyan | Calm, professional |
| `sunset` | 🌅 Orange-yellow | Warm, vibrant |
| `aurora` | 🌌 Blue-purple | Tech, futuristic |
| `fire` | 🔥 Red-orange | Alerts, warnings |

### Border Styles

| Style | Characters | Preview |
|-------|------------|---------|
| `double` | `╔═╗║╚╝` | ╔═══╗ |
| `single` | `┌─┐│└┘` | ┌───┐ |
| `rounded` | `╭─╮│╰╯` | ╭───╮ |
| `thick` | `┏━┓┃┗┛` | ┏━━━┓ |
| `ascii` | `+-+|` | +---+ |

### Content Generators

Create functions that return content for each panel:

```zsh
generate_content_my_panel() {
  # Static content
  cat <<'EOF'
Static text
Multiple lines
EOF
}

# Or dynamic content
generate_live_stats() {
  local cpu=$(top -l 1 | grep "CPU" | awk '{print $3}')
  echo "CPU: ${cpu}%"
  echo "Time: $(date '+%H:%M:%S')"
}
```

### Keyboard Shortcuts

Add custom shortcuts in `handle_custom_keys()`:

```zsh
handle_custom_keys() {
  local key="$1"
  
  case "$key" in
    'm'|'M')
      # Switch to monitoring view
      LAYOUT_PRESET="grid_4"
      return 0
      ;;
    
    'd'|'D')
      # Toggle debug mode
      DEBUG_MODE=true
      return 0
      ;;
    
    # Add more...
  esac
}
```

---

## 📊 Example Configurations

### Example 1: System Monitor Dashboard

```zsh
DASHBOARD_TITLE="SYSTEM MONITOR"
LAYOUT_PRESET="grid_4"

typeset -A PANEL_CONFIG=(
  [panel_1]="cpu|CPU Monitor|55|14|5|3|double"
  [panel_2]="mem|Memory|55|14|65|3|double"
  [panel_3]="disk|Disk I/O|55|12|5|19|double"
  [panel_4]="net|Network|55|12|65|19|double"
)

generate_content_cpu() {
  top -l 1 | head -10
}
```

### Example 2: AI Process Dashboard

```zsh
DASHBOARD_TITLE="NEXUS AI STUDIO"
GRADIENT_TYPE="aurora"
LAYOUT_PRESET="sidebar"

typeset -A PANEL_CONFIG=(
  [panel_1]="main|GPU Status|90|28|5|3|rounded"
  [panel_2]="side|Model Queue|30|28|100|3|single"
)
```

### Example 3: Centered Welcome Screen

```zsh
DASHBOARD_TITLE="WELCOME"
LAYOUT_PRESET="centered"

typeset -A PANEL_CONFIG=(
  [panel_1]="welcome|Welcome Dashboard|80|25|auto|auto|thick"
)

generate_content_welcome() {
  cat <<'EOF'
╔════════════════════════════════════════════╗
║                                            ║
║         WELCOME TO YOUR DASHBOARD          ║
║                                            ║
║  Press numbers to switch layouts           ║
║  Press T to change themes                  ║
║  Press H for help                          ║
║  Press Q to quit                           ║
║                                            ║
╚════════════════════════════════════════════╝
EOF
}
```

### Example 4: Golden Ratio Layout

```zsh
DASHBOARD_TITLE="NEXUS ANALYTICS"
LAYOUT_PRESET="golden"

# The golden ratio preset automatically calculates:
# - Main panel: 61.8% of screen width
# - Sidebar: 38.2% of screen width
```

---

## 🎯 Advanced Customization

### Custom Header/Footer

```zsh
render_custom_header() {
  local title=$(layout_apply_gradient "$DASHBOARD_TITLE" "$GRADIENT_TYPE")
  
  echo "╔═══════════════════════════════════════════════════════════╗"
  printf "║  %b  ║\n" "$title"
  echo "║  $(date '+%Y-%m-%d %H:%M:%S')  ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
}
```

### Panel Spacing Configuration

```zsh
PANEL_MARGIN_X=5    # Distance from left/right edge
PANEL_MARGIN_Y=3    # Distance from top/bottom edge
PANEL_GAP_X=5       # Horizontal gap between panels
PANEL_GAP_Y=2       # Vertical gap between panels
```

### Auto-Updating Content

```zsh
# In your content generator:
generate_live_data() {
  while true; do
    clear
    render_dashboard
    sleep 2  # Update every 2 seconds
  done
}
```

### Responsive Breakpoints

The engine automatically detects terminal size:

```zsh
# Adjust panels based on terminal width
local breakpoint=$(layout_detect_breakpoint)

case "$breakpoint" in
  xs|sm)  # Small screens (< 80 cols)
    LAYOUT_PRESET="centered"
    ;;
  md|lg)  # Medium screens (80-120 cols)
    LAYOUT_PRESET="sidebar"
    ;;
  xl|xxl) # Large screens (> 120 cols)
    LAYOUT_PRESET="grid_6"
    ;;
esac
```

---

## 🛠️ Template Variables Reference

### Global Variables

| Variable | Default | Options |
|----------|---------|---------|
| `DASHBOARD_TITLE` | "NEXUS AI STUDIO" | Any string |
| `DASHBOARD_SUBTITLE` | Version info | Any string |
| `GRADIENT_TYPE` | "rainbow" | rainbow\|ocean\|sunset\|aurora\|fire |
| `DEFAULT_BORDER_STYLE` | "double" | double\|single\|rounded\|thick\|ascii |
| `LAYOUT_PRESET` | "custom" | grid_4\|grid_6\|sidebar\|centered\|golden\|custom |
| `PANEL_MARGIN_X` | 5 | Integer (chars) |
| `PANEL_MARGIN_Y` | 3 | Integer (lines) |
| `PANEL_GAP_X` | 5 | Integer (chars) |
| `PANEL_GAP_Y` | 2 | Integer (lines) |

### Panel Configuration Array

```zsh
typeset -A PANEL_CONFIG=(
  [key]="id|title|width|height|x|y|border"
)
```

| Field | Type | Description |
|-------|------|-------------|
| `key` | String | Unique key (panel_1, panel_2, etc.) |
| `id` | String | Panel identifier |
| `title` | String | Display title |
| `width` | Integer | Panel width in characters |
| `height` | Integer | Panel height in lines |
| `x` | Integer/"auto" | Horizontal position |
| `y` | Integer/"auto" | Vertical position |
| `border` | String | Border style |

---

## 🎮 Interactive Controls

### Default Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Q` | Quit dashboard |
| `R` | Refresh/redraw |
| `H` | Show help |
| `1` | Switch to Grid 4 layout |
| `2` | Switch to Grid 6 layout |
| `3` | Switch to Golden Ratio |
| `C` | Switch to Centered layout |
| `T` | Cycle theme/gradient |
| `B` | Cycle border style |
| `S` | Show statistics |
| `V` | Validate layout |

### Adding Custom Shortcuts

Edit `handle_custom_keys()` function:

```zsh
handle_custom_keys() {
  local key="$1"
  
  case "$key" in
    'x'|'X')
      # Your custom action
      echo "Custom action triggered!"
      return 0
      ;;
  esac
}
```

---

## 📋 Template Checklist

When creating your dashboard, customize these sections:

- [ ] **Section 1: Branding**
  - [ ] Dashboard title
  - [ ] Subtitle/version
  - [ ] Gradient type
  - [ ] Border style

- [ ] **Section 2: Panel Layout**
  - [ ] Choose layout preset
  - [ ] Define panel positions
  - [ ] Set panel sizes
  - [ ] Configure spacing

- [ ] **Section 3: Content**
  - [ ] Top-left panel content
  - [ ] Top-right panel content
  - [ ] Bottom-left panel content
  - [ ] Bottom-right panel content
  - [ ] Additional panels

- [ ] **Section 4: Presets** (optional)
  - [ ] Customize existing presets
  - [ ] Add new layout presets

- [ ] **Section 5: Interactivity**
  - [ ] Add custom keyboard shortcuts
  - [ ] Define custom actions

- [ ] **Section 6: UI Elements**
  - [ ] Customize header
  - [ ] Customize footer
  - [ ] Customize help screen

---

## 💡 Pro Tips

1. **Start Simple**: Begin with `LAYOUT_PRESET="centered"` and one panel
2. **Test Frequently**: Run your dashboard after each change
3. **Use Auto-Centering**: Set x/y to "auto" for responsive layouts
4. **Iterate**: Start with static content, then add dynamic data
5. **Responsive Design**: Test on different terminal sizes
6. **Keep it Clean**: Clear, focused content is better than clutter
7. **Use Comments**: Document your customizations for future reference

---

## 🔧 Troubleshooting

### Panels Don't Appear
- Check panel IDs match in PANEL_CONFIG and content generators
- Verify layout preset is correct
- Run with `layout_validate` (press V)

### Content Not Showing
- Ensure content generator functions are defined
- Check function names match panel IDs
- Verify heredoc syntax is correct

### Layout Looks Wrong
- Check terminal size: `echo $COLUMNS x $LINES`
- Adjust panel sizes for your screen
- Use auto-centering: `x="auto" y="auto"`

### Colors Not Working
- Verify terminal supports 256 colors
- Check gradient type is valid
- Ensure layout engine is sourced correctly

---

## 📚 Additional Resources

- **Full API Documentation**: [HYPER_DASHBOARD_LAYOUT_GUIDE.md](../docs/HYPER_DASHBOARD_LAYOUT_GUIDE.md)
- **Layout Engine Source**: [hyper_dashboard_layout_engine.zsh](../src/ui/hyper_dashboard_layout_engine.zsh)
- **Demo Examples**: [dashboard_layout_demo.zsh](dashboard_layout_demo.zsh)

---

## 🎉 Examples Gallery

Want inspiration? Check out these example dashboards:

```bash
# System monitoring
examples/dashboards/system_monitor.zsh

# AI/ML processes
examples/dashboards/ai_dashboard.zsh

# DevOps status
examples/dashboards/devops_status.zsh

# Analytics view
examples/dashboards/analytics.zsh
```

---

**Happy customizing! 🚀**

Create beautiful, functional dashboards tailored to your exact needs.
