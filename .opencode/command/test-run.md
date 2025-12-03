---
description: Run tests and analyze failures
agent: tester
chain: code-review
---

# Command: /test-run

## Purpose
Run tests and analyze failures. Execute test suite and fix any failing tests.

## Usage
```
/test-run
```

## Arguments
None (runs all tests)

## Examples
```
/test-run
```

## Workflow Integration
- **Before**: Code changes committed
- **During**: Run tests, analyze failures
- **After**: If passing, suggest /code-review

## Implementation Notes
Run tests and fix any failures. Use Serena for code queries to understand test context and implementation details.

After testing:
- If tests pass, consider a code review: /code-review
- If failures persist, debug the issues: /issue-debug
- Update test coverage insights in memory