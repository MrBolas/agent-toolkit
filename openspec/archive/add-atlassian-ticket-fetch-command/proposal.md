# OpenSpec Proposal: Add Atlassian Ticket Fetch Command

## Summary
Add a new `/atlassian-ticket-fetch` command to the OpenCode Agent Toolkit that enables fetching detailed information about Jira tickets from Atlassian for use in planning and implementation.

## Motivation
The toolkit currently supports GitHub issue integration but lacks equivalent functionality for Jira tickets, which are commonly used in enterprise development workflows. This command will provide structured context for development work when Jira tickets are referenced.

## Proposed Changes

### New Command: /atlassian-ticket-fetch
Fetch detailed information about a Jira ticket from Atlassian for use in planning and implementation. Supports various ticket reference formats and provides structured context for development work.

#### Usage
```
/atlassian-ticket-fetch [ticket-reference]
```

#### Arguments
- `ticket-reference`: Ticket reference in formats like PROJ-123, JIRA-456, or full URL

#### Examples
```
/atlassian-ticket-fetch PROJ-123
/atlassian-ticket-fetch JIRA-456
/atlassian-ticket-fetch https://company.atlassian.net/browse/PROJ-789
```

#### Integration
- Used by /plan_feature when Jira ticket IDs are provided
- Provides context for implementation planning
- Supports both cloud and server Atlassian instances

#### Requirements
- Atlassian MCP must be available and configured
- Valid authentication (API token or OAuth)
- Access to the specified Jira instance and project

#### Example Output

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

## Impact Assessment
- **Scope**: Addition of new command, no changes to existing functionality
- **Dependencies**: Requires Atlassian MCP availability
- **Risk**: Low - isolated command implementation
- **Testing**: Unit tests for command parsing and output formatting

## Implementation Plan
1. Add Atlassian Jira Integration requirement to toolkit spec
2. Implement command logic using Atlassian MCP tools
3. Add command to agent configuration
4. Test with various ticket reference formats
5. Update documentation</content>
<parameter name="filePath">openspec/add-atlassian-ticket-fetch-command/proposal.md