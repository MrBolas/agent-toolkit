# Delta for OpenCode Agent Toolkit

## ADDED Requirements
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
- AND provides examples of correct format