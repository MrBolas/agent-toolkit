---
description: Validate OpenSpec change proposals for proper formatting and structure
agent: orchestrator
subtask: false
---

# Command Name: /openspec-validate

## Purpose
Validate an OpenSpec change proposal to ensure it follows proper formatting and structure before implementation. This helps catch issues early in the development workflow.

## Usage
```
/openspec-validate [change-name]
```

## Arguments
- `change-name`: Name of the change folder in openspec/changes/ to validate

## Examples
```
/openspec-validate add-validation-command
/openspec-validate implement-2fa
```

## Workflow Integration
- **Before**: Run after creating a proposal with /openspec-proposal
- **During**: Validates proposal.md, tasks.md, and spec deltas
- **After**: Use validated proposals with /openspec-apply

## Validation Checks
Execute these validation steps:

1. **Change Structure**: Ensure change folder exists with required files
2. **Spec Deltas**: Validate openspec/changes/{change-name}/specs/ files
   - Check for ADDED/MODIFIED/REMOVED section headers
   - Verify requirement format (### Requirement: name)
   - Ensure scenario structure (#### Scenario: description)
   - Check for SHALL/MUST language in requirements
3. **Tasks**: Validate openspec/changes/{change-name}/tasks.md
   - Check markdown checklist format
   - Ensure tasks are actionable and specific
4. **Proposal**: Validate openspec/changes/{change-name}/proposal.md
   - Check for purpose, motivation, scope sections
   - Ensure success criteria are defined

## Success Criteria
- Returns validation success with summary
- Identifies specific formatting issues with line numbers
- Provides actionable suggestions for fixes
- Does not modify any files (read-only validation)