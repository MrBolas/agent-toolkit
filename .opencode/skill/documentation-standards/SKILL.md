---
name: documentation-standards
description: Documentation standards, templates, and best practices for creating comprehensive project documentation
license: MIT
---

# Documentation Standards Skill

This skill provides guidelines and standards for creating consistent, high-quality documentation across your project.

## Documentation Principles

### 1. Clarity Over Completeness

- Write for your audience (developers, users, maintainers)
- Use clear, simple language
- Avoid jargon unless necessary (define if used)
- One idea per paragraph

### 2. Structure and Organization

- Use clear headings and hierarchy
- Organize logically (overview → details → examples)
- Use lists for multiple items
- Break long sections into subsections

### 3. Practical Examples

- Include code examples for technical documentation
- Show real-world usage patterns
- Provide both simple and advanced examples
- Keep examples up-to-date with code

### 4. Completeness

- Document the "why" not just the "what"
- Include edge cases and limitations
- Explain assumptions and prerequisites
- Link to related documentation

## Documentation Types

### API Documentation

**Structure:**
```
# [API Name]

## Overview
Brief description of what this API does

## Endpoints
- List all endpoints with methods

## Authentication
How to authenticate (if needed)

## Request/Response
- Request format and parameters
- Response format and examples
- Error codes and meanings

## Examples
- Basic usage
- Advanced usage
- Error handling

## Related
- Links to related APIs or docs
```

**Include:**
- Clear parameter descriptions
- Request/response examples
- Error handling and status codes
- Rate limits (if applicable)
- Authentication requirements

### Function/Class Documentation

**Structure:**
```
## [Function/Class Name]

### Purpose
What does it do and why would you use it?

### Signature
```typescript
functionName(param1: Type, param2: Type): ReturnType
```

### Parameters
- `param1` - Description and type
- `param2` - Description and type

### Returns
Description of return value and type

### Examples
```typescript
// Basic usage
const result = functionName(value1, value2);

// Advanced usage
const result = functionName(complexValue, options);
```

### Throws
What exceptions/errors can it throw?

### See Also
- Related functions
- Related documentation
```

**Include:**
- Clear purpose statement
- Parameter descriptions with types
- Return value description
- Usage examples
- Error conditions

### Feature Documentation

**Structure:**
```
# [Feature Name]

## Overview
What is this feature and why does it exist?

## Use Cases
When and why would you use this feature?

## Getting Started
- Prerequisites
- Basic setup
- First example

## How It Works
Explain the mechanism and design

## Configuration
- Available options
- Default values
- Examples

## Examples
- Basic usage
- Common patterns
- Advanced usage

## Limitations
- What it doesn't do
- Known issues
- Workarounds

## Related
- Related features
- Related documentation
```

**Include:**
- Clear purpose and use cases
- Step-by-step setup
- Configuration options
- Real-world examples
- Limitations and edge cases

## Writing Guidelines

### Headings

- Use `#` for main title (one per document)
- Use `##` for major sections
- Use `###` for subsections
- Use `####` for sub-subsections
- Avoid going deeper than 4 levels

### Code Examples

```typescript
// Good: Shows real usage
const user = await getUserById(123);
console.log(user.name);

// Bad: Too abstract
const x = f(y);
```

**Best practices:**
- Use real variable names
- Show complete, runnable examples
- Include error handling
- Comment complex logic
- Keep examples focused

### Lists

**Use unordered lists for:**
- Items without order
- Features or capabilities
- Options or choices

**Use ordered lists for:**
- Steps in a process
- Priorities
- Sequences

**Use definition lists for:**
- Terms and definitions
- Parameters and descriptions

### Links

- Link to related documentation
- Link to external resources
- Use descriptive link text (not "click here")
- Keep links current

## Common Documentation Sections

### Overview/Introduction
- What is this?
- Why does it exist?
- Who should use it?

### Prerequisites
- Required knowledge
- Required tools/libraries
- System requirements

### Installation/Setup
- Step-by-step instructions
- Configuration needed
- Verification steps

### Usage/Examples
- Basic usage
- Common patterns
- Advanced usage

### API Reference
- All available functions/methods
- Parameters and return values
- Error codes

### Configuration
- Available options
- Default values
- Examples

### Troubleshooting
- Common issues
- Solutions
- Where to get help

### Related Resources
- Links to related docs
- External references
- Community resources

## Documentation Checklist

Before publishing documentation, verify:

- [ ] Clear, descriptive title
- [ ] Overview/purpose section
- [ ] Audience is clear
- [ ] Examples are accurate and runnable
- [ ] All parameters/options documented
- [ ] Error cases documented
- [ ] Links are current and relevant
- [ ] No broken references
- [ ] Consistent formatting
- [ ] Proper heading hierarchy
- [ ] Code examples are syntax-highlighted
- [ ] Related docs are linked

## Maintenance

### Keeping Documentation Current

- Update docs when code changes
- Review docs during code review
- Test examples regularly
- Fix broken links
- Improve clarity based on feedback

### Documentation Debt

- Track outdated sections
- Prioritize high-impact updates
- Remove obsolete documentation
- Consolidate duplicated docs

## Tools and Formatting

### Markdown

Use standard Markdown for all documentation:
- `**bold**` for emphasis
- `_italic_` for secondary emphasis
- `` `code` `` for inline code
- Code blocks with language specification
- Links with `[text](url)` format

### Code Blocks

Always specify the language:

```typescript
// Good - language specified
function example() {
  return "highlighted";
}
```

```
// Bad - no language specified
function example() {
  return "not highlighted";
}
```

## Examples of Good Documentation

When creating documentation:
1. Read existing project docs for style consistency
2. Follow the structure templates provided
3. Include practical, runnable examples
4. Explain the "why" not just the "what"
5. Link to related documentation
6. Keep it current and accurate

## After Writing

1. Review for clarity and completeness
2. Test all code examples
3. Check all links
4. Verify formatting
5. Get feedback from team members
6. Update related documentation
7. Store documentation patterns in project memory
