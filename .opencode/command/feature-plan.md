---
description: Plan implementation steps for a feature using code analysis
agent: orchestrator
subtask: true
---

# Command: /feature-plan

## Purpose
Plan implementation steps for a feature using code analysis. If a ticket/issue ID is provided, fetches requirements from Jira/GitHub. Break down feature requirements into actionable implementation steps.

## Usage
```
/feature-plan [feature description or ticket/issue ID]
```

## Arguments
- `feature description or ticket/issue ID`: Either a description string or ticket/issue ID (Jira: PROJ-123, GitHub: #123 or 123)

## Examples
```
# Manual descriptions
/feature-plan "Add user profile page"
/feature-plan "Implement payment processing"

# Jira tickets
/feature-plan PROJ-123
/feature-plan AUTH-456

# GitHub issues
/feature-plan 789
/feature-plan "#101"
```

## Workflow Integration
- **Before**: Gather requirements (fetch from ticket/issue if ID provided)
- **During**: Analyze existing code patterns
- **After**: Feed into /feature-implement command

## Integration Options

### Jira Integration (Atlassian MCP)
**When Atlassian MCP is available and Jira ticket ID provided:**
- Automatically calls `/jira-fetch` to get ticket details
- Fetches ticket title, description, acceptance criteria
- Extracts planning requirements and user stories
- Uses ticket context for implementation planning

### GitHub Integration (GitHub MCP)
**When GitHub MCP is available and GitHub issue ID provided:**
- Fetches issue title, description, labels
- Extracts requirements from issue body and comments
- Uses issue context for implementation planning

### Fallback (No MCP or Manual Description)
**When MCP not available or manual description provided:**
- Uses provided description directly
- Manual requirement gathering

## Implementation Notes

**Feature description or ticket/issue ID: $ARGUMENTS**

Execute these steps:

1. **Parse input**: Determine if $ARGUMENTS is a ticket/issue ID or manual description
2. **Fetch requirements** (if ID provided):
   - If Jira format and Atlassian MCP available → Fetch ticket details
   - If GitHub format and GitHub MCP available → Fetch issue details
   - Extract planning requirements from fetched data
3. **Plan the implementation** with detailed steps using the requirements
4. **Use Serena** for code analysis to understand existing patterns and architecture