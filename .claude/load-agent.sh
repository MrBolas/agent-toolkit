#!/bin/bash
# Load agent context into Claude Code conversation
# Usage: load-agent <agent-name>
# Example: load-agent developer

AGENT_NAME=$1
AGENT_DIR="$HOME/.claude/agents"

if [ -z "$AGENT_NAME" ]; then
    echo "Available agents:"
    ls -1 "$AGENT_DIR"/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md//' | grep -v README | sed 's/^/  - /'
    echo ""
    echo "Usage: load-agent <agent-name>"
    echo "Example: load-agent developer"
    exit 1
fi

AGENT_FILE="$AGENT_DIR/$AGENT_NAME.md"

if [ ! -f "$AGENT_FILE" ]; then
    echo "❌ Agent '$AGENT_NAME' not found"
    echo ""
    echo "Available agents:"
    ls -1 "$AGENT_DIR"/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md//' | grep -v README | sed 's/^/  - /'
    exit 1
fi

echo "🤖 Loading agent: $AGENT_NAME"
echo ""
echo "=== AGENT CONTEXT: $AGENT_NAME ==="
echo ""
cat "$AGENT_FILE"
echo ""
echo "=== END AGENT CONTEXT ==="
