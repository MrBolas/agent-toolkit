---
description: Review code for quality, security, and best practices
agent: code_reviewer
chain: debug_issue, refactor_code, generate_documentation
---

# Command Name: /review_code

## Purpose
Review code for quality, security, and best practices. Use Serena tools for symbol searches and understanding code context.

## Usage
```
/review_code
```

## Arguments
None (analyzes current codebase or specified files)

## Examples
```
/review_code
```

## Workflow Integration
- **Before**: Ensure code is committed or staged
- **During**: Use Serena for context, check security/performance/maintainability
- **After**: Follow-up actions or suggested commands from `chain`

## Implementation Notes
After review:
- If issues found, suggest fixes: /debug_issue or /refactor_code
- If code is ready, consider documentation: /generate_documentation
- Store review insights in repository memory