---
description: List all active ticket/issue worktrees with Jira/GitHub status
agent: orchestrator
---

# Command Name: /list_worktrees

## Purpose
List all active git worktrees created for parallel ticket/issue development, with optional Jira/GitHub status integration.

## Usage
```
/list_worktrees
```

## Arguments
None

## Examples
```
/list_worktrees
```

## Workflow Integration
- **Before**: Worktrees exist
- **During**: List worktrees with ticket/issue status
- **After**: Use for navigation or cleanup decisions

## What This Shows

For each worktree:
- Path to the worktree directory
- Current branch name
- Latest commit hash
- Ticket/issue ID extracted from branch name
- **Jira status** (if Atlassian MCP available and Jira ticket)
- **GitHub status** (if GitHub MCP available and GitHub issue)
- **Assignee** (if available)
- **Priority/Labels** (if available)

## Example Output

```
Active Ticket/Issue Worktrees:
==============================

📁 ../agent-toolkit-PROJ-123
   Branch: feature/PROJ-123
   Commit: abc1234
   Jira: In Progress | Assigned: John Doe | Priority: High

📁 ../agent-toolkit-456
   Branch: feature/456
   Commit: def5678
   GitHub: Open | Assigned: Jane Smith | Labels: bug, high-priority
```

## Integration Options

### Jira Integration (Atlassian MCP)

**When Atlassian MCP is available:**
- Fetches current status from Jira for Jira-format ticket IDs
- Shows assignee and priority
- Highlights blocked or high-priority tickets

### GitHub Integration (GitHub MCP)

**When GitHub MCP is available:**
- Fetches current status from GitHub for numeric issue IDs
- Shows assignee and labels
- Highlights issues with specific labels (e.g., high-priority, blocked)

### Fallback (No MCP)

**When neither MCP is available:**
- Shows basic git worktree information
- No ticket/issue status displayed

## Implementation

Execute these steps:

1. **List all git worktrees** with `git worktree list`
2. **Filter ticket/issue worktrees** (exclude main repo)
3. **Extract ticket/issue IDs** from branch names
4. **Check MCP availability and query status:**
   - If Atlassian MCP available and ID matches Jira format → Query Jira for status/assignee/priority
   - If GitHub MCP available and ID is numeric → Query GitHub for status/assignee/labels
5. **Format with ticket/issue context** (if fetched)
6. **Display formatted list** with all available information