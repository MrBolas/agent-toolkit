---
description: Implement an approved OpenSpec change by working through the tasks
agent: developer
subtask: false
---

# Command Name: /openspec-apply

## Purpose
Implement an approved OpenSpec change by executing the tasks defined in the change proposal. This ensures implementation follows the agreed specifications.

## Usage
```
/openspec-apply [change-name]
```

## Arguments
- `change-name`: Name of the change folder in openspec/changes/

## Examples
```
/openspec-apply add-profile-filters
/openspec-apply implement-2fa
/openspec-apply PROJ-456-fix
```

## Workflow Integration
- **Before**: Change proposal must be reviewed and approved
- **During**: Implement tasks from openspec/changes/{change-name}/tasks.md
- **After**: Mark tasks complete, then use /openspec-archive when done

## Implementation Notes
Execute these steps:

1. **Validate change**: Ensure change folder exists and specs are approved
2. **Read tasks**: Parse openspec/changes/{change-name}/tasks.md
3. **Implement sequentially**: Work through each task in order
4. **Update task status**: Mark completed tasks with checkboxes
5. **Code implementation**: Write/modify code according to spec deltas
6. **Testing**: Run relevant tests for each implemented component
7. **Use Serena** to understand existing code patterns and ensure consistency

## Task Format Expected
Tasks should be in markdown checklist format:
```markdown
## 1. Database Setup
- [ ] 1.1 Add column to users table
- [ ] 1.2 Create migration script

## 2. Backend Implementation
- [ ] 2.1 Add API endpoint
- [ ] 2.2 Update business logic
```

## Success Criteria
- All tasks marked as completed
- Code implements the spec deltas accurately
- Tests pass for implemented functionality
- Code follows project conventions and patterns