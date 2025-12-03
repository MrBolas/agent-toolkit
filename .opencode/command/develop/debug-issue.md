---
description: Debug and fix issues in the codebase
agent: developer
chain: run-tests, review-code
---

# Command: /debug-issue

## Purpose
Debug and fix issues in the codebase. Identify and resolve bugs, errors, or unexpected behavior.

## Usage
```
/debug-issue [issue description]
```

## Arguments
- `issue description`: Description of the problem to debug

## Examples
```
/debug-issue "App crashes on login"
/debug-issue "API returns 500 error"
```

## Workflow Integration
- **Before**: Reproduce the issue if possible
- **During**: Use Serena for code analysis, check logs/stack traces
- **After**: Run /run-tests and /review-code

## Implementation Notes
Debug the issue: $ARGUMENTS

Debugging approach:
1. Reproduce the issue if possible
2. Use Serena to understand relevant code context
3. Analyze error messages, logs, and stack traces
4. Identify root cause before implementing fixes
5. Consider edge cases and related functionality
6. Add tests to prevent regression

If the issue is complex, consider breaking it down with the orchestrator first.