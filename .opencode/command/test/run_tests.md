---
description: Run tests and analyze failures
agent: tester
chain: review_code
---

# Command Name: /run_tests

## Purpose
Run tests and analyze failures. Execute test suite and fix any failing tests.

## Usage
```
/run_tests
```

## Arguments
None (runs all tests)

## Examples
```
/run_tests
```

## Workflow Integration
- **Before**: Code changes committed
- **During**: Run tests, analyze failures
- **After**: If passing, suggest /review_code

## Implementation Notes
Run tests and fix any failures. Use Serena for code queries to understand test context and implementation details.

After testing:
- If tests pass, consider a code review: /review_code
- If failures persist, debug the issues: /debug_issue
- Update test coverage insights in memory