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
/code-review [prompt]
```

## Arguments

- `prompt` (optional) - Natural language description of what to review and how
  - Can describe the target (files, directories, patterns)
  - Can specify focus areas (security, performance, maintainability, testing, etc.)
  - Can request output format (summary, detailed, JSON, markdown, etc.)
  - Can mention severity levels or specific concerns
  - If omitted, reviews entire codebase with default settings

## Examples
```
# Review entire codebase with default settings
/code-review

# Review authentication module for security issues
/code-review Review the auth module focusing on security vulnerabilities

# Review with a summary report
/code-review Give me a summary of code quality issues in src/

# Detailed performance analysis
/code-review Analyze src/components for performance problems and provide detailed suggestions

# Check specific file for maintainability
/code-review Review auth/login.ts for code maintainability and readability

# JSON output for tool integration
/code-review Review the API layer and output as JSON

# Focus on critical issues only
/code-review Find critical and high-severity issues in the codebase

# Exclude tests and focus on style
/code-review Review src/ excluding test files, focus on code style and consistency

# Multi-concern review
/code-review Review database layer for security, performance, and maintainability issues
```

## Workflow Integration
- **Before**: Ensure code is committed or staged; identify review scope and focus areas
- **During**: Use Serena for context, check specified areas (security/performance/maintainability/etc.)
- **After**: Follow-up actions or suggested commands from `chain`

## Implementation Notes

### Prompt Interpretation
The code_reviewer agent should interpret the natural language prompt to understand:
- **Target scope**: Which files, directories, or patterns to review (defaults to entire codebase)
- **Focus areas**: What to prioritize (security, performance, maintainability, testing, documentation, style, etc.)
- **Output format**: How to present findings (summary, detailed, JSON, markdown, structured report)
- **Severity filtering**: Which issue levels to report (critical, high, medium, low, info)
- **Exclusions**: What to skip (test files, generated code, etc.)

### Review Execution
- Use Serena tools to analyze code based on interpreted scope and focus areas
- Apply semantic understanding to identify issues aligned with the review goals
- Consider project standards and patterns stored in Serena memory
- Prioritize findings based on severity and relevance to stated concerns

### Output Generation
- **Summary**: High-level overview with key findings and counts
- **Detailed**: Full analysis with code snippets, explanations, and recommendations
- **JSON**: Machine-readable format for tool integration and automation
- **Markdown**: Formatted for documentation, reports, or sharing
- **Structured**: Organized by issue type with severity levels (default)

### Follow-up Actions
- If critical/high issues found, suggest: `/issue-debug` or `/code-refactor`
- If code is ready, consider: `/docs-generate`
- Store review insights, patterns, and standards in Serena memory for future reference