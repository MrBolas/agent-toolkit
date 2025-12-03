---
description: Refactor code for better clarity, performance, or maintainability
agent: developer
chain: test-run, code-review
---

# Command: /code-refactor

## Purpose
Refactor code for better clarity, performance, or maintainability. Improve existing code without changing functionality.

## Usage
```
/code-refactor [target code]
```

## Arguments
- `target code`: What to refactor

## Examples
```
/code-refactor "UserService class"
/code-refactor "payment processing logic"
```

## Workflow Integration
- **Before**: Ensure tests exist, understand patterns with Serena
- **During**: Improve clarity/performance/maintainability
- **After**: Run /test-run and /code-review

## Implementation Notes
Refactor the code described in: $ARGUMENTS

Before refactoring:
1. Use Serena to understand existing patterns and architectural decisions
2. Ensure tests exist for the code being refactored
3. Identify the specific improvement goal (clarity, performance, maintainability)

After refactoring:
1. Verify all tests still pass: /test-run
2. Store any new patterns or decisions in Serena
3. Review code quality: /code-review