---
name: mcp-manager
description: Manage MCP (Model Context Protocol) servers to optimize context usage and enable specialized tools on-demand
license: MIT
metadata:
  version: "1.0"
  category: "system"
---

# MCP Manager Skill

This skill helps you intelligently manage MCP (Model Context Protocol) servers to reduce context overhead and enable specialized capabilities when needed.

## Overview

Your OpenCode setup starts with a minimal baseline of MCPs to save context tokens:
- **Enabled by default**: Serena (semantic code analysis), Sequential-Thinking (complex reasoning)
- **Disabled by default**: GitHub, Context7, Atlassian (enable only when needed)

This skill teaches you when and how to enable additional MCPs for specific tasks.

## Available MCPs

### Serena (Always Enabled)
- **Purpose**: Semantic code analysis and memory
- **Cost**: ~2-3k tokens (essential, always on)
- **When to use**: Always available for code understanding
- **Tools**: `serena_*` tools for code search and memory

### Sequential-Thinking (Always Enabled)
- **Purpose**: Complex reasoning and planning
- **Cost**: ~1-2k tokens (lightweight, always on)
- **When to use**: For complex problems requiring step-by-step reasoning
- **Tools**: Automatic, used internally by agent

### GitHub (Disabled by Default)
- **Purpose**: GitHub PR/issue operations
- **Cost**: ~3-4k tokens (moderate overhead)
- **When to use**: 
  - Fetching PR details or comments
  - Creating/updating issues
  - Reviewing GitHub-based code
- **Enable with**: `bash scripts/mcp-toggle.sh github enable`
- **Disable with**: `bash scripts/mcp-toggle.sh github disable`

### Context7 (Disabled by Default)
- **Purpose**: Search external documentation (frameworks, APIs, libraries)
- **Cost**: ~2-3k tokens (light overhead)
- **When to use**:
  - Looking up API documentation
  - Finding framework examples
  - Searching best practices
  - Learning new libraries
- **Enable with**: `bash scripts/mcp-toggle.sh context7 enable`
- **Disable with**: `bash scripts/mcp-toggle.sh context7 disable`

### Atlassian (Disabled by Default)
- **Purpose**: Jira ticket management
- **Cost**: ~2-3k tokens (light overhead)
- **When to use**:
  - Fetching Jira ticket details
  - Updating ticket status
  - Linking related tickets
- **Enable with**: `bash scripts/mcp-toggle.sh atlassian enable`
- **Disable with**: `bash scripts/mcp-toggle.sh atlassian disable`

## Decision Tree: When to Enable MCPs

```
Do you need to work with GitHub PRs or issues?
  → YES: Enable GitHub MCP
  → NO: Continue

Do you need to look up external documentation or APIs?
  → YES: Enable Context7 MCP
  → NO: Continue

Do you need to work with Jira tickets?
  → YES: Enable Atlassian MCP
  → NO: Continue

Keep disabled MCPs off to save context tokens
```

## How to Use This Skill

### 1. Check Current Status
List all MCPs and their status:
```bash
bash scripts/mcp-status.sh
```

### 2. Enable an MCP
When you need a specific MCP:
```bash
bash scripts/mcp-toggle.sh github enable
```

Wait for confirmation, then continue with your task.

### 3. Disable an MCP
When you're done with a task and want to free context:
```bash
bash scripts/mcp-toggle.sh github disable
```

### 4. View Available MCPs
See detailed information about each MCP:
```bash
cat references/mcp-available.md
```

## Context Optimization Tips

1. **Start lean**: Keep MCPs disabled by default
2. **Enable as needed**: Only enable MCPs for specific tasks
3. **Disable when done**: Free up context tokens after completing task
4. **Monitor baseline**: Your baseline context is ~10-13k tokens (Serena + Sequential-Thinking)
5. **Track overhead**: Each additional MCP adds 2-4k tokens

## Example Workflow

**Scenario**: You need to review a GitHub PR and look up API documentation

1. Start OpenCode (baseline: ~10-13k tokens)
2. Task: "Review the PR at owner/repo/pull/123"
3. Agent detects GitHub needed → runs `bash scripts/mcp-toggle.sh github enable`
4. Agent fetches PR details using GitHub MCP
5. Agent detects need for API docs → runs `bash scripts/mcp-toggle.sh context7 enable`
6. Agent searches documentation using Context7
7. Agent completes review
8. Agent runs `bash scripts/mcp-toggle.sh github disable` and `bash scripts/mcp-toggle.sh context7 disable`
9. Context returns to baseline for next task

## Troubleshooting

### MCP toggle script fails
- Ensure OpenCode is running with `opencode serve` or in TUI mode
- Check that the OpenCode server is accessible at `http://localhost:4096`
- Verify the MCP name is correct (github, context7, atlassian)

### MCP doesn't appear after enabling
- OpenCode may need a moment to initialize the MCP server
- Try using the MCP tool immediately - it should work
- If still not available, restart OpenCode

### Context still high after disabling MCPs
- Some MCPs may take time to fully disconnect
- Restart OpenCode to reset to baseline
- Check with `/status` command to see current MCP state

## Advanced: Manual MCP Control

If you prefer manual control via the TUI:
1. Type `/mcp` in OpenCode
2. Use arrow keys to navigate MCPs
3. Press Space to toggle enable/disable
4. Changes apply immediately

This is useful for quick toggles without running scripts.

## References

See `references/mcp-available.md` for detailed MCP specifications and capabilities.
