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
- Used by /plan-feature when issue IDs are provided
- Provides context for implementation planning
- Supports both public and authenticated private repositories