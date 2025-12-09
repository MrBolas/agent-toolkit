#!/bin/bash

# MCP Toggle Script
# Usage: ./mcp-toggle.sh <mcp-name> <enable|disable>
# Example: ./mcp-toggle.sh github enable

set -e

# Configuration
OPENCODE_HOST="${OPENCODE_HOST:-localhost}"
OPENCODE_PORT="${OPENCODE_PORT:-4096}"
OPENCODE_URL="http://${OPENCODE_HOST}:${OPENCODE_PORT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validate arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 <mcp-name> <enable|disable>"
    echo "Example: $0 github enable"
    echo ""
    echo "Available MCPs:"
    echo "  - github"
    echo "  - context7"
    echo "  - atlassian"
    exit 1
fi

MCP_NAME="$1"
ACTION="$2"

# Validate action
if [ "$ACTION" != "enable" ] && [ "$ACTION" != "disable" ]; then
    echo -e "${RED}Error: Invalid action '$ACTION'${NC}"
    echo "Valid actions: enable, disable"
    exit 1
fi

# Validate MCP name
case "$MCP_NAME" in
    github|context7|atlassian|serena|sequential-thinking)
        ;;
    *)
        echo -e "${RED}Error: Unknown MCP '$MCP_NAME'${NC}"
        echo "Available MCPs: github, context7, atlassian, serena, sequential-thinking"
        exit 1
        ;;
esac

# Warn about protected MCPs
if [ "$MCP_NAME" = "serena" ] || [ "$MCP_NAME" = "sequential-thinking" ]; then
    echo -e "${YELLOW}Warning: $MCP_NAME is essential and should remain enabled${NC}"
    if [ "$ACTION" = "disable" ]; then
        echo -e "${RED}Aborting: Cannot disable essential MCPs${NC}"
        exit 1
    fi
fi

# Determine endpoint
if [ "$ACTION" = "enable" ]; then
    ENDPOINT="/mcp/${MCP_NAME}/connect"
    METHOD="POST"
else
    ENDPOINT="/mcp/${MCP_NAME}/disconnect"
    METHOD="POST"
fi

# Make the API call
echo -e "${BLUE}Attempting to ${ACTION} ${MCP_NAME} MCP...${NC}"

RESPONSE=$(curl -s -X "$METHOD" \
    -H "Content-Type: application/json" \
    "${OPENCODE_URL}${ENDPOINT}" 2>&1)

# Check if curl succeeded
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to connect to OpenCode at ${OPENCODE_URL}${NC}"
    echo "Make sure OpenCode is running with 'opencode serve' or in TUI mode"
    exit 1
fi

# Parse response
if echo "$RESPONSE" | grep -q "error\|Error\|ERROR"; then
    echo -e "${RED}Error: ${RESPONSE}${NC}"
    exit 1
fi

# Success
if [ "$ACTION" = "enable" ]; then
    echo -e "${GREEN}✓ Successfully enabled ${MCP_NAME} MCP${NC}"
    echo -e "${BLUE}The ${MCP_NAME} MCP is now available for use${NC}"
else
    echo -e "${GREEN}✓ Successfully disabled ${MCP_NAME} MCP${NC}"
    echo -e "${BLUE}The ${MCP_NAME} MCP has been disconnected${NC}"
fi

exit 0
