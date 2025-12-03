---
description: Refactor code for better clarity, performance, or maintainability
agent: developer
chain: run-tests, review-code
---

# Command: /refactor-code

## Purpose
Refactor code for better clarity, performance, or maintainability. Improve existing code without changing functionality.

## Usage
```
/refactor-code [target code]
```

## Arguments
- `target code`: What to refactor

## Examples
```
/refactor-code "UserService class"
/refactor-code "payment processing logic"
```

## Workflow Integration
- **Before**: Ensure tests exist, understand patterns with Serena
- **During**: Improve clarity/performance/maintainability
- **After**: Run /run-tests and /review-code

## Implementation Notes
Refactor the code described in: $ARGUMENTS

Before refactoring:
1. Use Serena to understand existing patterns and architectural decisions
2. Ensure tests exist for the code being refactored
3. Identify the specific improvement goal (clarity, performance, maintainability)

After refactoring:
1. Verify all tests still pass: /run-tests
2. Store any new patterns or decisions in Serena
3. Review code quality: /review-code