---
description: Complete feature development workflow (plan, implement, test, review)
agent: orchestrator
---

# Command Name: /feature_workflow

## Purpose
Execute the full feature development workflow. If a ticket/issue ID is provided, fetches description from Jira/GitHub. Complete feature development from planning to documentation.

## Usage
```
/feature_workflow [feature description or ticket/issue ID]
```

## Arguments
- `feature description or ticket/issue ID`: Either a description string or ticket/issue ID (Jira: PROJ-123, GitHub: #123 or 123)

## Examples
```
# Manual descriptions
/feature_workflow "Add user authentication"
/feature_workflow "Implement payment system"

# Jira tickets
/feature_workflow PROJ-123
/feature_workflow AUTH-456

# GitHub issues
/feature_workflow 789
/feature_workflow "#101"
```

## Workflow Integration
- **Before**: Gather requirements (fetch from ticket/issue if ID provided)
- **During**: Execute sequential development steps
- **After**: Feature is complete and documented

## Workflow Steps
1. Plan the feature: /plan_feature
2. Implement the feature: /implement_feature
3. Test the implementation: /run_tests
4. Review the code: /review_code
5. Document if needed: /generate_documentation

## Integration Options

### Jira Integration (Atlassian MCP)
**When Atlassian MCP is available and Jira ticket ID provided:**
- Fetches ticket title, description, acceptance criteria
- Extracts requirements and user stories
- Uses ticket context for all workflow steps

### GitHub Integration (GitHub MCP)
**When GitHub MCP is available and GitHub issue ID provided:**
- Fetches issue title, description, labels
- Extracts requirements from issue body and comments
- Uses issue context for all workflow steps

### Fallback (No MCP or Manual Description)
**When MCP not available or manual description provided:**
- Uses provided description directly
- Manual requirement gathering

## Implementation Notes
Execute these steps:

1. **Parse input**: Determine if it's a ticket/issue ID or manual description
2. **Fetch context** (if ID provided):
   - If Jira format and Atlassian MCP available → Fetch ticket details
   - If GitHub format and GitHub MCP available → Fetch issue details
   - Use fetched description for workflow
3. **Execute workflow steps** sequentially, passing the feature description to each
4. **Coordinate between agents** and ensure each step completes successfully
5. **Use Serena** for code context throughout the workflow