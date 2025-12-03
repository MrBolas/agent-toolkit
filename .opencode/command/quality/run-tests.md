---
description: Run tests and analyze failures
agent: tester
chain: review-code
---

# Command: /run-tests

## Purpose
Run tests and analyze failures. Execute test suite and fix any failing tests.

## Usage
```
/run-tests
```

## Arguments
None (runs all tests)

## Examples
```
/run-tests
```

## Workflow Integration
- **Before**: Code changes committed
- **During**: Run tests, analyze failures
- **After**: If passing, suggest /review-code

## Implementation Notes
Run tests and fix any failures. Use Serena for code queries to understand test context and implementation details.

After testing:
- If tests pass, consider a code review: /review-code
- If failures persist, debug the issues: /debug-issue
- Update test coverage insights in memory