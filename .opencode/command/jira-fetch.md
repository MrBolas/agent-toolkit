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

**Ticket ID to fetch: $ARGUMENTS**

Execute these steps to fetch the Jira ticket:

### Step 1: Parse the Ticket Reference
Extract the ticket key from the provided argument: $ARGUMENTS
- Input format: `PROJ-123`, `WTM-336`, `JIRA-456`, or full URLs like `https://company.atlassian.net/browse/PROJ-789`
- Extract just the ticket key (e.g., `WTM-336` from any format)

### Step 2: Call Atlassian MCP
Use the available Atlassian MCP tools to fetch the ticket:
- Look for Atlassian MCP tools in your available tools list
- Call the appropriate tool to retrieve ticket information for the extracted ticket key
- Request all available fields: title, description, status, assignee, priority, type, acceptance criteria, comments, related issues

### Step 3: Format and Present Results
Display the fetched information in a structured, readable format:

```
🎫 **Jira Ticket: [TICKET-KEY]**
**Title:** [ticket title]
**Status:** [current status]
**Assignee:** [assignee email/name]
**Priority:** [priority level]
**Type:** [issue type]

**Description:**
[ticket description text]

**Acceptance Criteria:** (if present)
- [ ] [criterion 1]
- [ ] [criterion 2]

**Related Issues:** (if present)
- [KEY-1]: [title]
- [KEY-2]: [title]

**Comments:** ([count] comments)
- [Author]: [comment text]
```

### Step 4: Handle Errors Gracefully
If issues occur:
- **MCP not available**: "The Atlassian MCP is not available. Please ensure it's configured in `.opencode/opencode.*.jsonc`"
- **Ticket not found**: "Ticket [KEY] not found. Please verify the ticket key and your access permissions."
- **Authentication failed**: "Authentication failed. Please check your Atlassian API token configuration."
- **Permission denied**: "You don't have permission to access ticket [KEY]. Please verify your Jira access."

### Step 5: Preserve Context
Keep the fetched ticket information in context for use by subsequent commands like `/feature-plan` or `/feature-implement`.

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
