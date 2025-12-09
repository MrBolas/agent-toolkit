# MCP Manager - Quick Start

## TL;DR

Your OpenCode starts with minimal MCPs to save context. Enable MCPs only when needed.

## Quick Commands

### Enable an MCP
```bash
bash scripts/mcp-toggle.sh github enable      # Enable GitHub
bash scripts/mcp-toggle.sh context7 enable    # Enable Context7
bash scripts/mcp-toggle.sh atlassian enable   # Enable Atlassian
```

### Disable an MCP
```bash
bash scripts/mcp-toggle.sh github disable     # Disable GitHub
bash scripts/mcp-toggle.sh context7 disable   # Disable Context7
bash scripts/mcp-toggle.sh atlassian disable  # Disable Atlassian
```

### Check Status
```bash
bash scripts/mcp-status.sh
```

### Manual Toggle (TUI)
Type `/mcp` in OpenCode, use arrow keys, press Space to toggle.

## When to Enable Each MCP

| MCP | When to Enable | Cost |
|-----|----------------|------|
| **GitHub** | Working with PRs, issues, repos | +3-4k tokens |
| **Context7** | Looking up API docs, frameworks | +2-3k tokens |
| **Atlassian** | Working with Jira tickets | +2-3k tokens |

## Baseline Context

```
Always on:
  - Serena (code analysis): 2-3k
  - Sequential-Thinking (reasoning): 1-2k
  - Agent prompts: 5-8k
  ─────────────────────────
  Total: ~10-13k tokens
```

## Workflow

1. **Start OpenCode** (baseline: ~10-13k tokens)
2. **Detect need** - "I need to review a GitHub PR"
3. **Enable MCP** - `bash scripts/mcp-toggle.sh github enable`
4. **Use MCP** - Agent fetches PR and reviews it
5. **Disable MCP** - `bash scripts/mcp-toggle.sh github disable`
6. **Continue** - Context back to baseline for next task

## Troubleshooting

**MCP toggle fails?**
- Make sure OpenCode is running: `opencode serve` or in TUI
- Check OpenCode is at `http://localhost:4096`

**MCP not working after enabling?**
- Wait a moment for server to initialize
- Restart OpenCode if still not working

**Context still high?**
- Restart OpenCode to reset to baseline
- Check `/status` to see current MCPs

## Learn More

- Full guide: `SKILL.md`
- MCP details: `references/mcp-available.md`
- Agent instructions: `.opencode/agent/orchestrator.md`
