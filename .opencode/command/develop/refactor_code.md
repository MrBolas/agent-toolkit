---
description: Refactor code for better clarity, performance, or maintainability
agent: developer
---

# Command Name: /refactor_code

## Purpose
Refactor code for better clarity, performance, or maintainability. Improve existing code without changing functionality.

## Usage
```
/refactor_code [target code]
```

## Arguments
- `target code`: What to refactor

## Examples
```
/refactor_code "UserService class"
/refactor_code "payment processing logic"
```

## Workflow Integration
- **Before**: Ensure tests exist, understand patterns
- **During**: Improve clarity/performance/maintainability
- **After**: Run tests, store new patterns, request review

## Implementation Notes
Refactor the code described in: $ARGUMENTS

Before refactoring:
1. Use Serena to understand existing patterns and architectural decisions
2. Ensure tests exist for the code being refactored
3. Identify the specific improvement goal (clarity, performance, maintainability)

After refactoring:
1. Verify all tests still pass
2. Store any new patterns or decisions in Serena
3. Consider requesting @code_reviewer feedback for significant changes