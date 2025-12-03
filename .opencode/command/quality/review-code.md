---
description: Review code for quality, security, and best practices
agent: code_reviewer
chain: debug-issue, refactor-code, generate-docs
---

# Command: /review-code

## Purpose
Review code for quality, security, and best practices. Use Serena tools for symbol searches and understanding code context.

## Usage
```
/review-code
```

## Arguments
None (analyzes current codebase or specified files)

## Examples
```
/review-code
```

## Workflow Integration
- **Before**: Ensure code is committed or staged
- **During**: Use Serena for context, check security/performance/maintainability
- **After**: Follow-up actions or suggested commands from `chain`

## Implementation Notes
After review:
- If issues found, suggest fixes: /debug-issue or /refactor-code
- If code is ready, consider documentation: /generate-docs
- Store review insights in repository memory