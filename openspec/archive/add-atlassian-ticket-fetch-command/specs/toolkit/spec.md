# OpenCode Agent Toolkit Specifications

## Purpose
Define the specifications for the OpenCode Agent Toolkit, including agent capabilities, command structures, and integration requirements.

## Requirements
### Requirement: GitHub Issue Integration
The system SHALL provide integration with GitHub Issues API for programmatic issue management.

#### Scenario: Issue Fetching
- WHEN an agent receives an issue reference (#123 or PROJ-123)
- THEN the system fetches issue details from GitHub
- AND provides formatted issue information to the agent

#### Scenario: Issue Creation on Failure
- WHEN a command fails with a recoverable error
- THEN the system creates a GitHub issue with failure details
- AND links the issue to the failed command

#### Scenario: Bidirectional Sync
- WHEN a command completes successfully
- THEN the system updates related GitHub issues with completion status
- AND adds progress comments to the issue

### Requirement: Atlassian Jira Integration
The system SHALL provide integration with Atlassian Jira API for programmatic ticket management.

#### Scenario: Ticket Fetching
- WHEN an agent receives a ticket reference (PROJ-123 or full URL)
- THEN the system fetches ticket details from Jira
- AND provides formatted ticket information to the agent

#### Scenario: Command Integration
- WHEN using /plan_feature with Jira ticket reference
- THEN the command fetches ticket details for context
- AND includes ticket requirements in planning

### Requirement: Authentication and Security
The system SHALL handle GitHub authentication securely and respect API rate limits.

#### Scenario: Secure Authentication
- WHEN accessing GitHub API
- THEN the system uses secure token storage
- AND validates token permissions before API calls

#### Scenario: Rate Limit Handling
- WHEN approaching GitHub API rate limits
- THEN the system implements exponential backoff
- AND provides clear error messages to users

### Requirement: Command Integration
Existing commands SHALL be enhanced to support GitHub issue integration.

#### Scenario: Enhanced Planning
- WHEN using /plan_feature with issue reference
- THEN the command fetches issue details for context
- AND includes issue requirements in planning

#### Scenario: Status Updates
- WHEN using /implement_feature
- THEN the command updates issue status on completion
- AND adds implementation notes to the issue

### Requirement: OpenSpec Validation Command
The system SHALL provide a `/openspec-validate` command to validate change proposals.

#### Scenario: Valid change validation
- WHEN a user runs `/openspec-validate <change-name>`
- THEN the command validates spec format and structure
- AND returns success if valid or detailed errors if invalid

#### Scenario: Invalid spec format detection
- WHEN a change has malformed spec deltas
- THEN the validation command identifies specific formatting issues
- AND provides actionable suggestions for fixes

### Requirement: Spec Format Validation
The validation SHALL check for proper OpenSpec delta format including section headers and requirement structure.

#### Scenario: Missing section headers
- WHEN a spec delta lacks ADDED/MODIFIED/REMOVED sections
- THEN validation fails with clear error message
- AND suggests adding appropriate section headers

#### Scenario: Malformed requirements
- WHEN requirements don't follow "### Requirement: name" format
- THEN validation identifies the specific issues
- AND provides examples of correct format</content>
<parameter name="filePath">openspec/add-atlassian-ticket-fetch-command/specs/toolkit/spec.md