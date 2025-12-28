#!/bin/bash
# Setup verification script for notifications plugin

set -e

echo "🔍 Verifying notifications plugin setup..."

# Check plugin file exists
if [ ! -f ".opencode/plugin/notifications.ts" ]; then
  echo "❌ Plugin file not found: .opencode/plugin/notifications.ts"
  exit 1
fi
echo "✅ Plugin file exists"

# Check dependencies installed
if [ ! -d ".opencode/plugin/node_modules" ]; then
  echo "❌ Dependencies not installed"
  echo "Run: cd .opencode/plugin && npm install"
  exit 1
fi
echo "✅ Dependencies installed"

# Check plugin registered in config
if ! grep -q "./plugin/notifications.ts" .opencode/opencode.jsonc; then
  echo "❌ Plugin not registered in opencode.jsonc"
  exit 1
fi
echo "✅ Plugin registered in config"

# Check platform and notification command
PLATFORM=$(uname -s)
echo "📱 Detected platform: $PLATFORM"

if [ "$PLATFORM" = "Darwin" ]; then
  echo "✅ macOS detected - osascript should be available"
  if ! command -v osascript &> /dev/null; then
    echo "⚠️  Warning: osascript not found (unusual on macOS)"
  fi
elif [ "$PLATFORM" = "Linux" ]; then
  echo "✅ Linux detected"
  if ! command -v notify-send &> /dev/null; then
    echo "⚠️  Warning: notify-send not found"
    echo "Install with: sudo apt-get install libnotify-bin"
  fi
else
  echo "⚠️  Unknown platform: $PLATFORM"
  echo "Notifications may not work"
fi

echo ""
echo "✨ Setup verification complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart OpenCode to load the plugin"
echo "2. Start a session and perform actions"
echo "3. Watch for desktop notifications"
echo ""
echo "🎯 To customize notifications:"
echo "   Edit: .opencode/plugin/notifications.ts"
echo "   Events hooked: session, tool, message, command, todo"
