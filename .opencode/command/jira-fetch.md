---
description: Fetch Atlassian Jira ticket details for context and planning
agent: orchestrator
subtask: true
---

# Command: /jira-fetch

## Purpose
Fetch detailed information about a Jira ticket from Atlassian for use in planning and implementation. Supports various ticket reference formats and provides structured context for development work.

## Usage
```
/jira-fetch [ticket-reference]
```

## Arguments
- `ticket-reference`: Ticket reference in formats like PROJ-123, JIRA-456, or full URL

## Examples
```
/jira-fetch PROJ-123
/jira-fetch JIRA-456
/jira-fetch https://company.atlassian.net/browse/PROJ-789
```

## Integration
- Used by /feature-plan when Jira ticket IDs are provided
- Provides context for implementation planning
- Supports both cloud and server Atlassian instances

## Requirements
- Atlassian MCP must be available and configured
- Valid authentication (API token or OAuth)
- Access to the specified Jira instance and project

## Example Output

When fetching a Jira ticket, the command returns structured information:

```
🎫 **Jira Ticket: PROJ-123**
**Title:** Implement user authentication system
**Status:** In Progress
**Assignee:** john.doe@company.com
**Priority:** High
**Type:** Story

**Description:**
As a user, I want to be able to log in to the application so that I can access my personal data.

**Acceptance Criteria:**
- [ ] User can log in with email/password
- [ ] Password must be at least 8 characters
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to dashboard

**Related Issues:**
- PROJ-122: Design authentication UI
- PROJ-124: Set up user database schema

**Comments:** (3 comments)
- John Doe: Started implementation of login form
- Jane Smith: Database schema is ready for review
- Bob Wilson: Need to add password reset functionality
```

This structured output provides all the context needed for planning and implementation.