---
description: Implement a feature with high-quality code
agent: developer
chain: run-tests, review-code
---

# Command: /implement-feature

## Purpose
Implement a feature with high-quality code. If a ticket/issue ID is provided, fetches requirements from Jira/GitHub. Write production-ready code for new features or functionality.

## Usage
```
/implement-feature [feature description or ticket/issue ID]
```

## Arguments
- `feature description or ticket/issue ID`: Either a description string or ticket/issue ID (Jira: PROJ-123, GitHub: #123 or 123)

## Examples
```
# Manual descriptions
/implement-feature "Add dark mode toggle"
/implement-feature "Create user registration form"

# Jira tickets
/implement-feature PROJ-123
/implement-feature AUTH-456

# GitHub issues
/implement-feature 789
/implement-feature "#101"
```

## Workflow Integration
- **Before**: Review feature plan or fetch requirements from ticket/issue
- **During**: Follow existing patterns, write tests
- **After**: Run /run-tests and /review-code

## Integration Options

### Jira Integration (Atlassian MCP)
**When Atlassian MCP is available and Jira ticket ID provided:**
- Fetches ticket title, description, acceptance criteria
- Extracts implementation requirements and user stories
- Uses ticket context for code implementation

### GitHub Integration (GitHub MCP)
**When GitHub MCP is available and GitHub issue ID provided:**
- Fetches issue title, description, labels
- Extracts requirements from issue body and comments
- Uses issue context for code implementation

### Fallback (No MCP or Manual Description)
**When MCP not available or manual description provided:**
- Uses provided description directly
- Manual requirement interpretation

## Implementation Notes
Execute these steps:

1. **Parse input**: Determine if it's a ticket/issue ID or manual description
2. **Fetch requirements** (if ID provided):
   - If Jira format and Atlassian MCP available → Fetch ticket details
   - If GitHub format and GitHub MCP available → Fetch issue details
   - Extract implementation requirements from fetched data
3. **Implement the feature** using the description/requirements
4. **Use Serena** for understanding existing code patterns and architecture

After implementation:
1. Run tests to validate functionality: /run-tests
2. Review code quality: /review-code

Consider updating repository memory with new patterns if significant architectural changes were made.