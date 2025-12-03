---
description: Generate or improve documentation for code or features
agent: developer
---

# Command: /docs-generate

## Purpose
Generate or improve documentation for code or features. Create comprehensive documentation for code, APIs, or features.

## Usage
```
/docs-generate [target]
```

## Arguments
- `target`: What to document (function, class, feature, etc.)

## Examples
```
/docs-generate "User authentication API"
/docs-generate "PaymentService class"
```

## Workflow Integration
- **Before**: Understand code structure with Serena
- **During**: Generate docs with examples, API descriptions
- **After**: Store documentation patterns in memory

## Implementation Notes
Create documentation for: $ARGUMENTS

Documentation should include:
1. Clear overview of purpose and functionality
2. Usage examples with code snippets
3. API/interface descriptions
4. Edge cases and limitations
5. Links to related documentation

Use Serena to understand the code context and existing documentation patterns.
Store documentation patterns back to Serena for consistency.