---
description: Review code for quality, security, and best practices
agent: code_reviewer
chain: issue-debug, code-refactor, docs-generate
---

# Command: /code-review

## Purpose
Review code for quality, security, and best practices. Use Serena tools for symbol searches and understanding code context.

## Usage
```
/code-review
```

## Arguments
None (analyzes current codebase or specified files)

## Examples
```
/code-review
```

## Workflow Integration
- **Before**: Ensure code is committed or staged
- **During**: Use Serena for context, check security/performance/maintainability
- **After**: Follow-up actions or suggested commands from `chain`

## Implementation Notes
After review:
- If issues found, suggest fixes: /issue-debug or /code-refactor
- If code is ready, consider documentation: /docs-generate
- Store review insights in repository memory