---
description: Create a new git worktree for parallel ticket development with Jira integration
---

Create a new git worktree workspace for developing a ticket in parallel with other work. Automatically fetches ticket details from Jira (via Atlassian MCP) if available.

## Usage

```
/ticket-create <ticket-id> [description]
```

## Examples

```
/ticket-create PROJ-123
/ticket-create AUTH-456 "Implement OAuth2 authentication"
/ticket-create API-789
```

## What This Does

1. **Fetches ticket from Jira** (if Atlassian MCP is available and ticket ID matches Jira format)
   - Retrieves title, description, acceptance criteria
   - Gets assignee, status, priority
   - Fetches related tickets and subtasks
   
2. **Creates a git worktree** at `../agent-toolkit-<ticket-id>/`

3. **Creates a new branch** `feature/<ticket-id>`

4. **Initializes Serena** for the new worktree with isolated memories
   - Stores Jira ticket context in Serena for easy reference
   
5. **Creates TICKET.md** with comprehensive details:
   - Jira ticket information (if available)
   - Branch and worktree paths
   - Acceptance criteria
   - Related tickets
   - Development notes

## Jira Integration

**When Atlassian MCP is available (Linux):**
- Automatically fetches ticket details from Jira
- Populates TICKET.md with rich context
- Stores ticket context in Serena
- Links related tickets and subtasks

**When Atlassian MCP is not available (macOS):**
- Uses provided description
- Creates basic TICKET.md
- Manual context entry

**Jira Ticket ID Formats:**
- `PROJ-123` - Standard Jira format
- `AUTH-456` - Project key + number
- `API-789` - Any uppercase prefix + number

## After Creation

```bash
cd ../agent-toolkit-<ticket-id>
opencode
```

Each worktree has:
- ✅ Same `.opencode/` configuration (shared)
- ✅ Isolated `.serena/` memories (ticket-specific)
- ✅ Jira context stored in Serena (if available)
- ✅ Independent OpenCode session
- ✅ Separate git branch

## Implementation

Execute these steps:

1. **Validate ticket ID** is provided
2. **Check Atlassian MCP availability**
3. **If available, fetch Jira ticket:**
   - Query Jira for ticket details
   - Extract title, description, acceptance criteria
   - Get related tickets and subtasks
4. **Check if worktree already exists**
5. **Create git worktree** with new branch
6. **Initialize Serena project** in the worktree
7. **Store Jira context in Serena** (if fetched)
8. **Create TICKET.md** with all available details:
   - Jira ticket info (if available)
   - Branch and worktree paths
   - Acceptance criteria
   - Related tickets
   - Development notes
9. **Report success** with next steps and ticket summary
