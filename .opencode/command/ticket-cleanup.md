---
description: Clean up a completed ticket worktree and optionally update Jira
---

Remove a ticket worktree and optionally delete its branch after work is complete. Can also update Jira ticket status if Atlassian MCP is available.

## Usage

```
/ticket-cleanup <ticket-id>
```

## Examples

```
/ticket-cleanup AUTH-123
/ticket-cleanup PROJ-456
```

## What This Does

1. **Checks for uncommitted changes** - Warns if there are unsaved changes
2. **Checks Jira status** (if Atlassian MCP available) - Shows current ticket status
3. **Removes the worktree** - Deletes the worktree directory
4. **Asks about branch deletion** - Prompts whether to delete the branch
5. **Checks merge status** - Warns if branch is not merged into master
6. **Optionally updates Jira** - Can transition ticket to "Done" or "In Review"

## Jira Integration

**When Atlassian MCP is available:**
- Shows current Jira ticket status
- Offers to update ticket status:
  - "In Review" - If branch is pushed but not merged
  - "Done" - If branch is merged to master
- Adds comment to Jira with branch/PR information

**When Atlassian MCP is not available:**
- Standard cleanup without Jira updates

## Safety Features

- ⚠️ Warns about uncommitted changes before deletion
- ⚠️ Warns if branch is not merged
- ⚠️ Shows Jira status before cleanup
- ✅ Requires confirmation for destructive actions
- ✅ Optional Jira status update

## Workflow Examples

**Scenario 1: Work completed and merged**
```
/ticket-cleanup PROJ-123
→ Branch merged to master
→ Offer to mark Jira ticket as "Done"
→ Remove worktree and branch
```

**Scenario 2: PR created but not merged**
```
/ticket-cleanup AUTH-456
→ Branch not merged (PR pending)
→ Offer to mark Jira ticket as "In Review"
→ Keep branch, remove worktree only
```

**Scenario 3: Work abandoned**
```
/ticket-cleanup API-789
→ Uncommitted changes detected
→ Confirm deletion
→ Remove worktree and branch
→ Leave Jira status unchanged
```

## Implementation

Execute these steps:

1. **Validate ticket ID** and check worktree exists
2. **Check Jira status** (if Atlassian MCP available)
   - Fetch current ticket status
   - Display to user
3. **Check for uncommitted changes** in the worktree
4. **If changes exist**, warn user and ask for confirmation
5. **Check branch merge status**
   - Is branch merged to master?
   - Is branch pushed to remote?
6. **If Atlassian MCP available**, offer Jira update:
   - If merged: "Mark as Done?"
   - If pushed but not merged: "Mark as In Review?"
   - If not pushed: No Jira update
7. **Update Jira** if user confirms
   - Transition ticket status
   - Add comment with branch/PR info
8. **Remove the worktree** with `git worktree remove`
9. **Ask about branch deletion**
10. **Delete branch** (with appropriate flags based on merge status)
11. **Report completion** with summary of actions taken
