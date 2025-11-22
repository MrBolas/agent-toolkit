---
description: Create a new git worktree for parallel ticket/issue development with Jira/GitHub integration
agent: orchestrator
---

# Command Name: /create_worktree

## Purpose
Create a new git worktree workspace for developing a ticket/issue in parallel with other work. Automatically fetches ticket details from Jira (via Atlassian MCP) or GitHub issues (via GitHub MCP) if available.

## Usage
```
/create_worktree <ticket-id> [description]
```

## Arguments
- `ticket-id`: Ticket/issue ID (Jira: PROJ-123, GitHub: #123 or 123)
- `description`: Optional description

## Examples
```
# Jira tickets
/create_worktree PROJ-123
/create_worktree AUTH-456 "Implement OAuth2 authentication"

# GitHub issues
/create_worktree 123
/create_worktree "#456" "Fix login bug"
```

## Workflow Integration
- **Before**: Ticket/issue exists in Jira or GitHub (optional)
- **During**: Create worktree, fetch ticket/issue data, initialize Serena
- **After**: Switch to new worktree for development

## What This Does

1. **Fetches ticket/issue details** (if MCP available and ID matches format)
   - **Jira**: Retrieves title, description, acceptance criteria, assignee, status, priority, related tickets
   - **GitHub**: Retrieves title, description, labels, assignee, status, comments, linked PRs

2. **Creates a git worktree** at `../agent-toolkit-<ticket-id>/`

3. **Creates a new branch** `feature/<ticket-id>`

4. **Initializes Serena** for the new worktree with isolated memories
   - Stores ticket/issue context in Serena for easy reference

5. **Creates TICKET.md** with comprehensive details:
   - Ticket/issue information (if available)
   - Branch and worktree paths
   - Acceptance criteria or requirements
   - Related tickets/issues
   - Development notes

## Integration Options

### Jira Integration (Atlassian MCP)

**When Atlassian MCP is available:**
- Automatically fetches ticket details from Jira
- Populates TICKET.md with rich context
- Stores ticket context in Serena
- Links related tickets and subtasks

**Jira Ticket ID Formats:**
- `PROJ-123` - Standard Jira format
- `AUTH-456` - Project key + number
- `API-789` - Any uppercase prefix + number

### GitHub Integration (GitHub MCP)

**When GitHub MCP is available:**
- Automatically fetches issue details from GitHub
- Retrieves issue body, comments, labels, assignees
- Links to related pull requests
- Stores issue context in Serena

**GitHub Issue ID Formats:**
- `123` - Issue number
- `#123` - Issue number with hash prefix

### Fallback (No MCP)

**When neither MCP is available:**
- Uses provided description
- Creates basic TICKET.md
- Manual context entry

## After Creation

```bash
cd ../agent-toolkit-<ticket-id>
opencode
```

Each worktree has:
- ✅ Same `.opencode/` configuration (shared)
- ✅ Isolated `.serena/` memories (ticket/issue-specific)
- ✅ Jira/GitHub context stored in Serena (if available)
- ✅ Independent OpenCode session
- ✅ Separate git branch

## Implementation

Execute these steps:

1. **Validate ticket/issue ID** is provided
2. **Check MCP availability:**
   - If ID matches Jira format (XXX-123) and Atlassian MCP available → fetch from Jira
   - Else if ID is numeric/#numeric and GitHub MCP available → fetch from GitHub
3. **Fetch ticket/issue details** (if MCP available):
   - **Jira**: Query for ticket details, extract title, description, acceptance criteria, related tickets
   - **GitHub**: Query for issue details, extract title, description, labels, comments, linked PRs
4. **Check if worktree already exists**
5. **Create git worktree** with new branch
6. **Initialize Serena project** in the worktree
7. **Store ticket/issue context in Serena** (if fetched)
8. **Create TICKET.md** with all available details:
   - Ticket/issue info (if available)
   - Branch and worktree paths
   - Acceptance criteria or requirements
   - Related tickets/issues
   - Development notes
9. **Report success** with next steps and ticket/issue summary