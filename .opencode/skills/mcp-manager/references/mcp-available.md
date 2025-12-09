# Available MCPs Reference

This document provides detailed information about each MCP available in your OpenCode setup.

## Summary Table

| MCP | Status | Cost | Use Case | Enable Command |
|-----|--------|------|----------|----------------|
| Serena | Always On | 2-3k | Code analysis & memory | N/A (essential) |
| Sequential-Thinking | Always On | 1-2k | Complex reasoning | N/A (essential) |
| GitHub | Off by default | 3-4k | PR/issue operations | `bash scripts/mcp-toggle.sh github enable` |
| Context7 | Off by default | 2-3k | External docs lookup | `bash scripts/mcp-toggle.sh context7 enable` |
| Atlassian | Off by default | 2-3k | Jira management | `bash scripts/mcp-toggle.sh atlassian enable` |

## Detailed Specifications

### Serena (Always Enabled)
**Type**: Local MCP  
**Purpose**: Semantic code analysis and persistent memory  
**Cost**: ~2-3k tokens (baseline, always included)

**Capabilities**:
- Semantic code search (find by meaning, not just text)
- Code symbol analysis
- Project knowledge storage
- Cross-session memory persistence
- Architectural pattern recognition

**When to use**:
- Understanding existing code
- Finding similar implementations
- Storing architectural decisions
- Querying project knowledge

**Tools available**:
- `serena_find_symbol` - Find code symbols by name/pattern
- `serena_search_for_pattern` - Semantic code search
- `serena_read_file` - Read and analyze files
- `serena_write_memory` - Store project knowledge
- `serena_read_memory` - Retrieve stored knowledge

**Example usage**:
```
Search Serena for authentication patterns in this codebase
Store this database migration strategy in Serena for future reference
```

---

### Sequential-Thinking (Always Enabled)
**Type**: Local MCP  
**Purpose**: Complex reasoning and step-by-step problem solving  
**Cost**: ~1-2k tokens (lightweight, always included)

**Capabilities**:
- Multi-step reasoning
- Problem decomposition
- Hypothesis generation and verification
- Complex decision trees
- Detailed thinking process

**When to use**:
- Complex architectural decisions
- Multi-step debugging
- Algorithm design
- System design problems
- Anything requiring deep reasoning

**Tools available**:
- `sequential-thinking` - Trigger detailed reasoning process

**Example usage**:
```
I need to design a caching strategy for this API. Use sequential-thinking to work through the options.
```

---

### GitHub (Disabled by Default)
**Type**: Local MCP (Docker-based)  
**Purpose**: GitHub repository operations  
**Cost**: ~3-4k tokens (moderate overhead)

**Capabilities**:
- Fetch PR details and comments
- Create/update issues
- List branches and commits
- Repository information
- PR review operations

**When to use**:
- Reviewing GitHub pull requests
- Creating/updating GitHub issues
- Fetching PR context
- Repository analysis
- GitHub-based workflows

**Enable**: `bash scripts/mcp-toggle.sh github enable`  
**Disable**: `bash scripts/mcp-toggle.sh github disable`

**Tools available**:
- `github_pull_request_read` - Get PR details
- `github_issue_read` - Get issue details
- `github_list_commits` - List commits
- `github_create_pull_request` - Create PR
- `github_issue_write` - Create/update issues

**Example usage**:
```
Enable GitHub MCP, then review the PR at owner/repo/pull/123
```

**Requirements**:
- `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable set
- Docker running (for local MCP server)

---

### Context7 (Disabled by Default)
**Type**: Remote MCP  
**Purpose**: Search external documentation and APIs  
**Cost**: ~2-3k tokens (light overhead)

**Capabilities**:
- Search framework documentation
- API reference lookup
- Best practices and patterns
- Library documentation
- Code examples from GitHub

**When to use**:
- Looking up API documentation
- Finding framework examples
- Learning new libraries
- Searching best practices
- Understanding third-party tools

**Enable**: `bash scripts/mcp-toggle.sh context7 enable`  
**Disable**: `bash scripts/mcp-toggle.sh context7 disable`

**Tools available**:
- `context7_resolve-library-id` - Find library documentation
- `context7_get-library-docs` - Fetch library documentation

**Example usage**:
```
Enable Context7 MCP, then help me understand how to use React hooks
```

**Requirements**:
- `CONTEXT7_API_KEY` environment variable (optional, for higher rate limits)
- Internet connection

---

### Atlassian (Disabled by Default)
**Type**: Remote MCP  
**Purpose**: Jira ticket management and integration  
**Cost**: ~2-3k tokens (light overhead)

**Capabilities**:
- Fetch Jira ticket details
- Update ticket status
- Create/update tickets
- Link related tickets
- Ticket search

**When to use**:
- Working on Jira-tracked tasks
- Fetching ticket requirements
- Updating ticket status
- Creating related tickets
- Jira-based workflows

**Enable**: `bash scripts/mcp-toggle.sh atlassian enable`  
**Disable**: `bash scripts/mcp-toggle.sh atlassian disable`

**Tools available**:
- `atlassian_ticket_fetch` - Get ticket details
- `atlassian_ticket_update` - Update ticket
- `atlassian_ticket_create` - Create ticket

**Example usage**:
```
Enable Atlassian MCP, then fetch details for ticket PROJ-123
```

**Requirements**:
- Jira instance configured
- Atlassian authentication set up
- Internet connection

---

## Context Budget

Your baseline context allocation:

```
Baseline (always on):
  - Serena: 2-3k tokens
  - Sequential-Thinking: 1-2k tokens
  - Agent prompts: 5-8k tokens
  ────────────────────────
  Total baseline: ~10-13k tokens

Optional (enable as needed):
  - GitHub: +3-4k tokens
  - Context7: +2-3k tokens
  - Atlassian: +2-3k tokens
```

## Optimization Strategy

1. **Start lean**: Keep optional MCPs disabled
2. **Enable strategically**: Only enable for specific tasks
3. **Disable when done**: Free context after task completion
4. **Monitor usage**: Track which MCPs you actually use
5. **Adjust defaults**: If you use an MCP frequently, consider enabling by default

## Troubleshooting

### MCP not connecting
- Verify OpenCode is running: `opencode serve` or in TUI mode
- Check OpenCode is accessible at `http://localhost:4096`
- Verify MCP name is correct

### High context usage
- Check which MCPs are enabled: `bash scripts/mcp-status.sh`
- Disable unused MCPs: `bash scripts/mcp-toggle.sh <name> disable`
- Restart OpenCode to reset baseline

### MCP tools not available
- Ensure MCP is enabled: `bash scripts/mcp-toggle.sh <name> enable`
- Wait a moment for MCP server to initialize
- Check agent has permission to use MCP tools

## Manual MCP Control

If you prefer not to use scripts, you can manually toggle MCPs in the TUI:

1. Type `/mcp` in OpenCode
2. Navigate with arrow keys
3. Press Space to toggle enable/disable
4. Changes apply immediately

This is useful for quick toggles without running scripts.
