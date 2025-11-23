---
description: Fetch GitHub issue details for context and planning
agent: orchestrator
subtask: true
---

# Command Name: /github-issue-fetch

## Purpose
Fetch detailed information about a GitHub issue for use in planning and implementation. Supports various issue reference formats.

## Usage
```
/github-issue-fetch [issue-reference]
```

## Arguments
- `issue-reference`: Issue reference in formats like #123, 123, PROJ-123, or full URL

## Examples
```
/github-issue-fetch #456
/github-issue-fetch PROJ-789
/github-issue-fetch https://github.com/owner/repo/issues/123
```

## Integration
- Used by /plan_feature when issue IDs are provided
- Provides context for implementation planning
- Supports both public and authenticated private repositories