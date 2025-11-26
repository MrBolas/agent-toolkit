# Implementation Tasks for Add Atlassian Ticket Fetch Command

## Task 1: Implement Command Logic
- Parse ticket reference (PROJ-123, JIRA-456, or full URL)
- Extract issue key from reference
- Get accessible Atlassian resources to obtain cloudId
- Call atlassian_getJiraIssue with cloudId and issue key
- Expand comments in the API call
- Parse response and format output

## Task 2: Add Command to Agent Configuration
- Update orchestrator agent configuration to handle /atlassian-ticket-fetch command
- Add command routing logic
- Test command parsing and delegation

## Task 3: Error Handling and Validation
- Handle invalid ticket references
- Handle authentication failures
- Handle inaccessible Jira instances
- Provide clear error messages

## Task 4: Output Formatting
- Format ticket information as specified in proposal
- Extract acceptance criteria from description
- Include related issues/links
- Format comments chronologically

## Task 5: Integration Testing
- Test with various ticket reference formats
- Test with different Jira instances
- Verify output formatting matches specification
- Test error scenarios

## Task 6: Documentation Update
- Update AGENTS.md with new command
- Add examples to README.md
- Document required Atlassian MCP configuration</content>
<parameter name="filePath">openspec/add-atlassian-ticket-fetch-command/tasks.md