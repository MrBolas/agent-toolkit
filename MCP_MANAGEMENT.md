# MCP Management Strategy

This document explains how your OpenCode setup manages MCP (Model Context Protocol) servers to optimize context usage.

## Overview

Your OpenCode configuration uses a **lean-by-default** approach to minimize baseline context overhead:

- **Baseline**: ~10-13k tokens (Serena + Sequential-Thinking + agent prompts)
- **With GitHub**: +3-4k tokens
- **With Context7**: +2-3k tokens  
- **With Atlassian**: +2-3k tokens

MCPs are disabled by default and enabled only when needed for specific tasks.

## Architecture

### Configuration Changes

1. **Plugin Installation** (`.opencode/opencode.linux.jsonc` and `.opencode/opencode.macos.jsonc`):
   ```json
   "plugin": ["@tarquinen/opencode-dcp@0.4.12", "opencode-skills"]
   ```
   - Added `opencode-skills` plugin for skill discovery and management

2. **MCP Configuration** (unchanged):
   - GitHub: `enabled: false` (disabled by default)
   - Context7: `enabled: false` (disabled by default)
   - Atlassian: `enabled: false` (disabled by default)
   - Serena: `enabled: true` (always on)
   - Sequential-Thinking: `enabled: true` (always on)

3. **Agent Prompt Updates** (`.opencode/agent/orchestrator.md`):
   - Added MCP Management section
   - Teaches orchestrator when to enable/disable MCPs
   - Provides bash commands for MCP toggling

### Skill Implementation

Created `.opencode/skills/mcp-manager/` with:

- **SKILL.md** - Comprehensive guide on MCP management
  - Overview of each MCP
  - When to enable/disable each one
  - Decision tree for MCP selection
  - Context optimization tips
  - Troubleshooting guide

- **scripts/mcp-toggle.sh** - Bash script to enable/disable MCPs
  - Usage: `bash scripts/mcp-toggle.sh <mcp-name> <enable|disable>`
  - Validates MCP names and actions
  - Calls OpenCode API endpoints
  - Provides colored output for feedback

- **scripts/mcp-status.sh** - Bash script to check MCP status
  - Shows current MCP state
  - Lists available MCPs
  - Provides usage instructions

- **references/mcp-available.md** - Detailed MCP specifications
  - Summary table of all MCPs
  - Detailed specs for each MCP
  - Capabilities and use cases
  - Context budget breakdown
  - Troubleshooting guide

## How It Works

### Workflow

1. **User requests a task** that requires GitHub/Context7/Atlassian
2. **Orchestrator detects the need** (from task description or skill content)
3. **Orchestrator enables the MCP**:
   ```bash
   bash .opencode/skills/mcp-manager/scripts/mcp-toggle.sh github enable
   ```
4. **OpenCode API** (`/mcp/github/connect`) connects the MCP server
5. **Agent uses the MCP** for the task
6. **Orchestrator disables the MCP** when done:
   ```bash
   bash .opencode/skills/mcp-manager/scripts/mcp-toggle.sh github disable
   ```
7. **Context returns to baseline** for next task

### Agent Behavior

The orchestrator is instructed to:
- Use the `skills_mcp_manager` tool to understand MCP management
- Detect when GitHub/Context7/Atlassian are needed
- Enable MCPs proactively before using them
- Disable MCPs after task completion
- Explain MCP toggling to the user

### Manual Control

Users can also manually toggle MCPs in the TUI:
1. Type `/mcp` in OpenCode
2. Navigate with arrow keys
3. Press Space to toggle enable/disable
4. Changes apply immediately

## Context Optimization

### Baseline (Always On)
```
Serena: 2-3k tokens
Sequential-Thinking: 1-2k tokens
Agent prompts: 5-8k tokens
────────────────────
Total: ~10-13k tokens
```

### Optional (Enable as Needed)
```
GitHub: +3-4k tokens (PR/issue operations)
Context7: +2-3k tokens (external docs)
Atlassian: +2-3k tokens (Jira management)
```

### Strategy
1. **Start lean** - Keep optional MCPs disabled
2. **Enable strategically** - Only when needed
3. **Disable when done** - Free context after task
4. **Monitor usage** - Track which MCPs you actually use
5. **Adjust defaults** - If using frequently, consider enabling by default

## Usage Examples

### Example 1: Review a GitHub PR

```
User: "Review the PR at owner/repo/pull/123"

Orchestrator:
1. Detects GitHub needed
2. Enables GitHub MCP: bash scripts/mcp-toggle.sh github enable
3. Fetches PR details using GitHub tools
4. Reviews the PR
5. Disables GitHub MCP: bash scripts/mcp-toggle.sh github disable
6. Reports findings
```

### Example 2: Look Up API Documentation

```
User: "Help me understand how to use React hooks"

Orchestrator:
1. Detects Context7 needed
2. Enables Context7 MCP: bash scripts/mcp-toggle.sh context7 enable
3. Searches documentation using Context7
4. Explains React hooks with examples
5. Disables Context7 MCP: bash scripts/mcp-toggle.sh context7 disable
```

### Example 3: Work on Jira Ticket

```
User: "Implement the feature in ticket PROJ-123"

Orchestrator:
1. Detects Atlassian needed
2. Enables Atlassian MCP: bash scripts/mcp-toggle.sh atlassian enable
3. Fetches ticket details
4. Implements the feature
5. Updates ticket status
6. Disables Atlassian MCP: bash scripts/mcp-toggle.sh atlassian disable
```

## Troubleshooting

### MCP toggle script fails

**Error**: "Cannot connect to OpenCode at http://localhost:4096"

**Solution**:
- Ensure OpenCode is running: `opencode serve` or in TUI mode
- Check OpenCode is accessible at `http://localhost:4096`
- Verify the MCP name is correct (github, context7, atlassian)

### MCP doesn't appear after enabling

**Error**: MCP enabled but tools not available

**Solution**:
- OpenCode may need a moment to initialize the MCP server
- Try using the MCP tool immediately - it should work
- If still not available, restart OpenCode

### Context still high after disabling MCPs

**Error**: Context usage doesn't decrease after disabling MCPs

**Solution**:
- Some MCPs may take time to fully disconnect
- Restart OpenCode to reset to baseline
- Check with `/status` command to see current MCP state

### Skill not discovered

**Error**: `skills_mcp_manager` tool not available

**Solution**:
- Verify `opencode-skills` plugin is in config
- Check `.opencode/skills/mcp-manager/SKILL.md` exists
- Restart OpenCode to trigger skill discovery
- Check console for discovery messages

## Advanced Configuration

### Disabling Skills Plugin

If you want to disable the skills plugin:

Edit `.opencode/opencode.linux.jsonc` and `.opencode/opencode.macos.jsonc`:
```json
"plugin": ["@tarquinen/opencode-dcp@0.4.12"]
```

Remove `"opencode-skills"` from the array.

### Custom MCP Defaults

To enable an MCP by default (e.g., if you use GitHub frequently):

Edit `.opencode/opencode.linux.jsonc` and `.opencode/opencode.macos.jsonc`:
```json
"mcp": {
  "github": {
    "type": "local",
    "command": [...],
    "enabled": true  // Change from false to true
  }
}
```

### Per-Agent MCP Access

To restrict which agents can use which MCPs:

Edit `.opencode/opencode.json`:
```json
{
  "tools": {
    "github": false  // Disable GitHub tool globally
  },
  "agent": {
    "developer": {
      "tools": {
        "github": true  // Enable only for developer agent
      }
    }
  }
}
```

## Integration with Other Features

### Dynamic Context Pruning (DCP)
- DCP is configured to deduplicate tool outputs
- MCP toggles don't interfere with DCP
- Context savings from DCP + MCP management = significant token savings

### Serena Memory
- Serena is always enabled (essential for code understanding)
- MCP management decisions are stored in Serena
- Agents can query Serena for MCP usage patterns

### Sequential-Thinking
- Sequential-Thinking is always enabled (lightweight)
- Useful for complex MCP management decisions
- Agents can use it to reason about when to enable/disable MCPs

## Future Enhancements

Potential improvements:
1. **Auto-detection** - Automatically detect when MCPs are needed
2. **Smart toggling** - Enable MCPs based on task keywords
3. **Usage tracking** - Track which MCPs are used most frequently
4. **Cost analysis** - Show context cost of each MCP
5. **Custom MCPs** - Add support for user-defined MCPs

## References

- [OpenCode Skills Plugin](https://github.com/malhashemi/opencode-skills)
- [OpenCode MCP Documentation](https://opencode.ai/docs/mcp-servers/)
- [PR #4509 - MCP Toggle Feature](https://github.com/sst/opencode/pull/4509)
- [Anthropic Skills Specification](https://github.com/anthropics/skills)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the `mcp-manager` skill content: `.opencode/skills/mcp-manager/SKILL.md`
3. Check MCP reference: `.opencode/skills/mcp-manager/references/mcp-available.md`
4. Review orchestrator prompt: `.opencode/agent/orchestrator.md`
