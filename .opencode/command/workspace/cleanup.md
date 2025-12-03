---
description: Clean up a completed worktree and optionally update ticket/issue status
agent: orchestrator
---

# Command: /workspace-cleanup

## Purpose
Remove a worktree and optionally delete its branch after work is complete. Can also update Jira ticket or GitHub issue status if respective MCP is available.

## Usage
```
/workspace-cleanup <ticket-id>
```

## Arguments
- `ticket-id`: Ticket/issue to clean up (Jira: PROJ-123, GitHub: #123 or 123)

## Examples
```
# Jira tickets
/workspace-cleanup AUTH-123
/workspace-cleanup PROJ-456

# GitHub issues
/workspace-cleanup 789
/workspace-cleanup "#101"
```

## Workflow Integration
- **Before**: Work completed and merged/pushed
- **During**: Check status, remove worktree, update ticket/issue
- **After**: Worktree and optionally branch deleted

## What This Does

1. **Checks for uncommitted changes** - Warns if there are unsaved changes
2. **Checks ticket/issue status** (if MCP available) - Shows current status
3. **Removes the worktree** - Deletes the worktree directory
4. **Asks about branch deletion** - Prompts whether to delete the branch
5. **Checks merge status** - Warns if branch is not merged into master
6. **Optionally updates ticket/issue** - Can close issue or update status

## Integration Options

### Jira Integration (Atlassian MCP)

**When Atlassian MCP is available:**
- Shows current Jira ticket status
- Offers to update ticket status:
  - "In Review" - If branch is pushed but not merged
  - "Done" - If branch is merged to master
- Adds comment to Jira with branch/PR information

### GitHub Integration (GitHub MCP)

**When GitHub MCP is available:**
- Shows current GitHub issue status
- Offers to update issue:
  - Close issue - If branch is merged to master
  - Add "ready for review" label - If branch is pushed but not merged
- Adds comment to issue with branch/PR information

### Fallback (No MCP)

**When neither MCP is available:**
- Standard cleanup without ticket/issue updates

## Safety Features

- ⚠️ Warns about uncommitted changes before deletion
- ⚠️ Warns if branch is not merged
- ⚠️ Shows ticket/issue status before cleanup
- ✅ Requires confirmation for destructive actions
- ✅ Optional ticket/issue status update

## Workflow Examples

**Scenario 1: Jira - Work completed and merged**
```
/workspace-cleanup PROJ-123
→ Branch merged to master
→ Offer to mark Jira ticket as "Done"
→ Remove worktree and branch
```

**Scenario 2: GitHub - Work completed and merged**
```
/workspace-cleanup 789
→ Branch merged to master
→ Offer to close GitHub issue
→ Remove worktree and branch
```

**Scenario 3: PR created but not merged**
```
/workspace-cleanup AUTH-456
→ Branch not merged (PR pending)
→ Offer to mark ticket/issue as "In Review"
→ Keep branch, remove worktree only
```

**Scenario 4: Work abandoned**
```
/workspace-cleanup API-789
→ Uncommitted changes detected
→ Confirm deletion
→ Remove worktree and branch
→ Leave ticket/issue status unchanged
```

## Implementation

Execute these steps:

1. **Validate ticket/issue ID** and check worktree exists
2. **Check ticket/issue status** (if MCP available)
   - If Atlassian MCP available and Jira format → Fetch Jira ticket status
   - If GitHub MCP available and numeric format → Fetch GitHub issue status
   - Display current status to user
3. **Check for uncommitted changes** in the worktree
4. **If changes exist**, warn user and ask for confirmation
5. **Check branch merge status**
   - Is branch merged to master?
   - Is branch pushed to remote?
6. **If MCP available**, offer ticket/issue update:
   - **Jira**: If merged: "Mark as Done?"; If pushed but not merged: "Mark as In Review?"
   - **GitHub**: If merged: "Close issue?"; If pushed but not merged: "Add ready for review label?"
   - If not pushed: No update
7. **Update ticket/issue** if user confirms
   - Transition status or close issue
   - Add comment with branch/PR info
8. **Remove the worktree** with `git worktree remove`
9. **Ask about branch deletion**
10. **Delete branch** (with appropriate flags based on merge status)
11. **Report completion** with summary of actions taken