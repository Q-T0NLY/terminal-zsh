#!/usr/bin/env zsh
# ============================================================================
# NEXUS-NOVA QUICK START GUIDE
# Copy-paste these commands to get started immediately
# ============================================================================

echo "🚀 Starting Nexus-Nova Quick Setup..."
echo ""

# Step 1: Navigate to installation directory
echo "📁 Step 1: Navigate to installation directory"
cd /workspaces/terminal-zsh || {
  echo "❌ Please update the path to your Nexus-Nova installation"
  exit 1
}
echo "✅ In directory: $(pwd)"
echo ""

# Step 2: Verify installation
echo "🔍 Step 2: Verifying installation..."
if [ -f "nexus_nova.zsh" ]; then
  echo "✅ nexus_nova.zsh found"
else
  echo "❌ nexus_nova.zsh not found"
  exit 1
fi

if [ -d "src/modules" ]; then
  echo "✅ Modules directory found"
  echo "   Modules: $(ls -1 src/modules/*.zsh 2>/dev/null | wc -l | tr -d ' ')"
else
  echo "❌ Modules directory not found"
  exit 1
fi
echo ""

# Step 3: Test syntax
echo "✅ Step 3: Testing syntax..."
zsh -n nexus_nova.zsh && echo "✅ Syntax validated" || {
  echo "❌ Syntax errors found"
  exit 1
}
echo ""

# Step 4: Source the system
echo "🔌 Step 4: Loading Nexus-Nova..."
source nexus_nova.zsh
echo ""

# Step 5: Show info
echo "ℹ️  Step 5: System Information"
echo ""
nexus_nova_info
echo ""

# Step 6: Next steps
echo "🎯 READY TO USE!"
echo ""
echo "Quick commands to try:"
echo "  • nexus-dashboard    - Launch main dashboard"
echo "  • nn                 - Quick dashboard alias"
echo "  • nexus-nova-help    - Show all commands"
echo "  • nova-monitor       - System monitoring"
echo "  • nova-ai-dashboard  - AI features"
echo ""
echo "To make permanent, add this to ~/.zshrc:"
echo ""
echo "  source $(pwd)/nexus_nova.zsh"
echo ""
echo "✅ Quick start complete!"
