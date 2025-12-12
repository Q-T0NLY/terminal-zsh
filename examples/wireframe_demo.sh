#!/usr/bin/env zsh
# ============================================================================
# WIREFRAME DASHBOARD DEMO
# Showcase the new modular panel system
# ============================================================================

echo "🎨 Nexus-Nova Wireframe Dashboard Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if wireframe dashboard is loaded
if ! command -v nexus_enhanced_dashboard &> /dev/null; then
  echo "📦 Loading wireframe dashboard module..."
  source "$(dirname "${(%):-%x}")/../src/ui/nexus_wireframe_dashboard.zsh"
fi

echo "✅ Wireframe dashboard loaded"
echo ""
echo "🎯 This demo showcases:"
echo "   • Modular, collapsible panel architecture"
echo "   • F-key navigation (F6-F10)"
echo "   • Interactive panel states"
echo "   • Split-view multi-panel mode"
echo "   • Responsive wireframe layouts"
echo ""
echo "📋 Available Views:"
echo "   F6  - Chat Assistant (AI Q&A)"
echo "   F7  - Command Terminal (Direct commands)"
echo "   F8  - Code Editor (Syntax-highlighted)"
echo "   F9  - Visual Reasoning (Charts & graphs)"
echo "   F10 - Split View (Multi-panel)"
echo ""
echo "💡 Navigation:"
echo "   M - Main menu"
echo "   H - Help guide"
echo "   Q - Quit"
echo ""
read "?Press ENTER to launch the wireframe dashboard..."

# Launch the enhanced dashboard
nexus_enhanced_dashboard
