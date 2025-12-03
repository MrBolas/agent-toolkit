---
description: Review a GitHub PR with automated code review and inline comments
agent: orchestrator
---

# Command: /github-pr-review

## Purpose
Review a GitHub PR with automated code review and inline comments. Provides a concise overall summary with detailed feedback in inline comments. Uses GitHub MCP for inline comments when available, otherwise delegates to @code_reviewer.

## Usage
```
/github-pr-review [PR URL]
```

## Arguments
- `PR URL`: GitHub pull request URL

## Examples
```
/github-pr-review https://github.com/user/repo/pull/123
```

## Workflow Integration
- **Before**: PR should be open and ready for review
- **During**: Analyze code changes and post review comments
- **After**: PR has review feedback and approval/rejection

## GitHub Integration

### With GitHub MCP Available
- Fetches PR details, changed files, and existing comments
- Performs automated code analysis
- Posts inline comments directly on the PR
- Can approve, request changes, or leave general comments
- Updates PR status and adds review labels

### Without GitHub MCP (Fallback)
- Delegates to @code_reviewer agent for analysis
- Provides review feedback through chat
- Manual PR commenting required

## Implementation Notes

**PR URL or reference: $ARGUMENTS**

Execute these steps:

1. **Parse PR URL** from $ARGUMENTS and validate format
2. **Check GitHub MCP availability**
3. **If GitHub MCP available:**
   - Fetch PR details and changed files
   - Perform code analysis using Serena
    - Post inline comments with specific line references
    - Provide a concise overall review summary (detailed feedback is in inline comments)
4. **If GitHub MCP not available:**
   - Delegate to @code_reviewer for analysis
   - Generate review feedback for manual application
5. **Store review insights** in repository memory