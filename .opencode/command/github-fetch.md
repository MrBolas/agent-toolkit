---
description: Fetch GitHub issue details for context and planning
agent: orchestrator
subtask: true
---

# Command: /github-fetch

## Purpose
Fetch detailed information about a GitHub issue for use in planning and implementation. Supports various issue reference formats.

## Usage
```
/github-fetch [issue-reference]
```

## Arguments
- `issue-reference`: Issue reference in formats like #123, 123, PROJ-123, or full URL

## Examples
```
/github-fetch #456
/github-fetch 789
/github-fetch https://github.com/owner/repo/issues/123
```

## Integration
- Used by /feature-plan when issue IDs are provided
- Provides context for implementation planning
- Supports both public and authenticated private repositories

## Implementation

**Issue reference to fetch: $ARGUMENTS**

Execute these steps to fetch the GitHub issue:

### Step 1: Parse the Issue Reference
Extract the issue number from the provided argument: $ARGUMENTS
- Input format: `#123`, `123`, or full URLs like `https://github.com/owner/repo/issues/123`
- Extract just the issue number (e.g., `123` from any format)

### Step 2: Call GitHub MCP
Use the available GitHub MCP tools to fetch the issue:
- Look for GitHub MCP tools in your available tools list
- Call the appropriate tool to retrieve issue information for the extracted issue number
- Request all available fields: title, description, status, assignee, labels, comments, linked PRs

### Step 3: Format and Present Results
Display the fetched information in a structured, readable format:

```
🐙 **GitHub Issue: #[ISSUE-NUMBER]**
**Title:** [issue title]
**Status:** [current status]
**Assignee:** [assignee username]
**Labels:** [label1, label2, ...]

**Description:**
[issue description text]

**Comments:** ([count] comments)
- [Author]: [comment text]

**Linked PRs:** (if present)
- #[PR-1]: [title]
```

### Step 4: Handle Errors Gracefully
If issues occur:
- **MCP not available**: "The GitHub MCP is not available. Please ensure it's configured in `.opencode/opencode.*.jsonc`"
- **Issue not found**: "Issue #[NUMBER] not found. Please verify the issue number and repository access."
- **Authentication failed**: "Authentication failed. Please check your GitHub token configuration."
- **Permission denied**: "You don't have permission to access this issue. Please verify your GitHub access."

### Step 5: Preserve Context
Keep the fetched issue information in context for use by subsequent commands like `/feature-plan` or `/feature-implement`.