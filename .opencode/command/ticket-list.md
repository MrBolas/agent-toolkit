---
description: List all active ticket worktrees with Jira status
---

List all active git worktrees created for parallel ticket development, with optional Jira status integration.

## Usage

```
/ticket-list
```

## What This Shows

For each worktree:
- Path to the worktree directory
- Current branch name
- Latest commit hash
- Ticket ID extracted from branch name
- **Jira status** (if Atlassian MCP is available)
- **Jira assignee** (if available)
- **Jira priority** (if available)

## Example Output

```
Active Ticket Worktrees:
========================

📁 ../agent-toolkit-PROJ-123
   Branch: feature/PROJ-123
   Commit: abc1234
   Jira: In Progress | Assigned: John Doe | Priority: High
   
📁 ../agent-toolkit-AUTH-456
   Branch: feature/AUTH-456
   Commit: def5678
   Jira: To Do | Assigned: Jane Smith | Priority: Medium
```

## Jira Integration

**When Atlassian MCP is available:**
- Fetches current status from Jira
- Shows assignee and priority
- Highlights blocked or high-priority tickets

**When Atlassian MCP is not available:**
- Shows basic git worktree information
- No Jira status displayed

## Implementation

Execute these steps:

1. **List all git worktrees** with `git worktree list`
2. **Filter ticket worktrees** (exclude main repo)
3. **Extract ticket IDs** from branch names
4. **If Atlassian MCP available:**
   - Query Jira for each ticket ID
   - Fetch status, assignee, priority
   - Format with Jira context
5. **Display formatted list** with all available information
