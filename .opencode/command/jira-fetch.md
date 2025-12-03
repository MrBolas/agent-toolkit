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

## Implementation

When this command is invoked, perform the following steps:

1. **Extract Ticket Reference**: Parse the ticket reference from the command argument
   - Support formats: `PROJ-123`, `JIRA-456`, or full Atlassian URLs
   - Extract the project key and ticket number

2. **Fetch Ticket Data**: Use the Atlassian MCP to retrieve ticket information
   - Call the appropriate Atlassian MCP tool to fetch the ticket
   - Include all relevant fields: title, description, status, assignee, priority, type, comments, related issues

3. **Format Response**: Present the information in a clear, structured format
   - Use the example output format as a template
   - Include emoji indicators for visual clarity (🎫 for ticket header)
   - Format acceptance criteria as checkboxes if present
   - List related issues and recent comments

4. **Error Handling**: Handle common failure scenarios
   - Ticket not found: Inform user and verify ticket reference format
   - Authentication issues: Guide user to check MCP configuration
   - Permission denied: Explain access requirements
   - MCP unavailable: Inform user that Atlassian MCP must be configured

5. **Context Preservation**: Store the fetched information for use in subsequent commands
   - This data will be used by `/feature-plan` and other workflow commands
   - Include ticket key, description, and acceptance criteria in context

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
