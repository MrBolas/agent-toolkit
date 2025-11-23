---
description: Create an OpenSpec change proposal for a feature or change
agent: orchestrator
subtask: false
---

# Command Name: /openspec-proposal

## Purpose
Create an OpenSpec change proposal that captures the spec updates for a new feature or modification. This aligns human and AI stakeholders on requirements before implementation begins.

## Usage
```
/openspec-proposal [change description or ticket/issue ID]
```

## Arguments
- `change description or ticket/issue ID`: Description of the change or ticket/issue ID (Jira: PROJ-123, GitHub: #123 or 123)

## Examples
```
/openspec-proposal "Add user profile search filters"
/openspec-proposal "Implement two-factor authentication"
/openspec-proposal PROJ-456
/openspec-proposal "#789"
```

## Workflow Integration
- **Before**: Gather requirements from description or ticket/issue
- **During**: Create proposal.md, tasks.md, and spec deltas in openspec/changes/
- **After**: Review and refine specs, then use /openspec-apply

## Implementation Notes
Execute these steps:

1. **Parse input**: Determine if it's a ticket/issue ID or manual description
2. **Fetch requirements** (if ID provided):
   - If Jira format and Atlassian MCP available → Fetch ticket details
   - If GitHub format and GitHub MCP available → Fetch issue details
3. **Create change folder**: Generate unique change name from description
4. **Generate proposal**: Create openspec/changes/{change-name}/proposal.md explaining the change
5. **Generate tasks**: Create openspec/changes/{change-name}/tasks.md with implementation checklist
6. **Generate spec deltas**: Create openspec/changes/{change-name}/specs/ with delta files showing spec changes
7. **Use Serena** to analyze existing code patterns for accurate spec deltas

## OpenSpec Structure Created
```
openspec/changes/{change-name}/
├── proposal.md      # Why and what changes
├── tasks.md         # Implementation checklist
├── design.md        # Technical decisions (optional)
└── specs/           # Delta files showing spec updates
```

## Success Criteria
- Change folder created successfully
- All required files generated
- Specs follow OpenSpec delta format (ADDED/MODIFIED/REMOVED sections)
- Tasks are actionable and complete