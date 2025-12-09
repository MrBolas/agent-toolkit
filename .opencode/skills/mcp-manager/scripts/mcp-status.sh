#!/bin/bash

# MCP Status Script
# Shows current status of all MCPs

set -e

# Configuration
OPENCODE_HOST="${OPENCODE_HOST:-localhost}"
OPENCODE_PORT="${OPENCODE_PORT:-4096}"
OPENCODE_URL="http://${OPENCODE_HOST}:${OPENCODE_PORT}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== MCP Status ===${NC}"
echo ""

# Try to get status from OpenCode
RESPONSE=$(curl -s "${OPENCODE_URL}/status" 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot connect to OpenCode at ${OPENCODE_URL}${NC}"
    echo "Make sure OpenCode is running with 'opencode serve' or in TUI mode"
    exit 1
fi

# Parse and display MCPs
if echo "$RESPONSE" | grep -q "mcp"; then
    echo -e "${GREEN}MCPs detected:${NC}"
    echo "$RESPONSE" | grep -o '"[a-z0-9-]*"' | sort | uniq | while read -r mcp; do
        mcp_name=$(echo "$mcp" | tr -d '"')
        echo "  - $mcp_name"
    done
else
    echo -e "${YELLOW}No MCPs found in status${NC}"
fi

echo ""
echo -e "${BLUE}To enable/disable MCPs, use:${NC}"
echo "  bash scripts/mcp-toggle.sh <mcp-name> <enable|disable>"
echo ""
echo -e "${BLUE}Available MCPs:${NC}"
echo "  - github (disabled by default)"
echo "  - context7 (disabled by default)"
echo "  - atlassian (disabled by default)"
echo "  - serena (always enabled)"
echo "  - sequential-thinking (always enabled)"
