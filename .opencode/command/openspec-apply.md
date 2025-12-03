---
description: Implement an approved OpenSpec change by working through the tasks
agent: developer
chain: test-run, code-review
---

# Command: /openspec-apply

## Purpose
Implement an approved OpenSpec change by executing the tasks defined in the change proposal. Ensures implementation follows the agreed specifications.

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
- **After**: Automatically chains to /test-run and /code-review, then use /openspec-archive when done

## Implementation Notes

Execute these steps:

1. **Validate change exists**:
   - Ensure openspec/changes/{change-name}/ folder exists
   - Verify proposal.md, tasks.md, and specs/ are present
   - Confirm specs have been reviewed and approved

2. **Read specifications**:
   - Review proposal.md for context and goals
   - Study spec deltas in openspec/changes/{change-name}/specs/
   - Understand ADDED, MODIFIED, and REMOVED requirements
   - Note any design decisions in design.md if present

3. **Search for patterns** (see _fragments/serena-search.md):
   - Query Serena for similar implementations
   - Understand existing code architecture
   - Identify reusable components or utilities
   - Review relevant architectural decisions

4. **Read tasks**:
   - Parse openspec/changes/{change-name}/tasks.md
   - Understand task sequence and dependencies
   - Note which tasks depend on others completing first

5. **Implement tasks sequentially**:
   - Work through each task in order
   - For each task:
     - Implement according to spec deltas
     - Follow existing code patterns and conventions
     - Write tests alongside implementation
     - Handle edge cases and error conditions
   - Update task checkboxes as completed: `- [x] Task description`

6. **Ensure spec compliance**:
   - Verify all SHALL/MUST requirements are implemented
   - Test all scenarios described in specs
   - Ensure behavior matches expected outcomes
   - Handle all edge cases mentioned

7. **Code implementation best practices**:
   - Follow project coding standards
   - Maintain consistency with existing patterns
   - Write comprehensive tests for new functionality
   - Add inline documentation for complex logic
   - Use meaningful variable and function names

8. **Update task status**:
   - Mark completed tasks with `[x]`
   - Add notes for any deviations or issues encountered
   - Document any technical decisions made

9. **Store outcomes in Serena** (if significant):
   - Document new architectural patterns introduced
   - Record implementation approach for future reference
   - Link to proposal and specs

After implementation, automatically chains to:
1. **/test-run** - Validate functionality matches specs
2. **/code-review** - Ensure quality and best practices

Once all tasks are complete and code is reviewed, use:
- **/openspec-archive** - Merge specs and archive the change

## Task Format

Tasks should be in markdown checklist format:

```markdown
# Implementation Tasks

## 1. Database Setup
- [ ] 1.1 Add column to users table
- [ ] 1.2 Create migration script
- [ ] 1.3 Update database schema documentation

## 2. Backend Implementation
- [ ] 2.1 Add API endpoint /api/users/filters
- [ ] 2.2 Update UserService with filter logic
- [ ] 2.3 Add input validation for filter parameters

## 3. Frontend Implementation
- [ ] 3.1 Create FilterComponent UI
- [ ] 3.2 Integrate with API
- [ ] 3.3 Add loading states and error handling

## 4. Testing
- [ ] 4.1 Unit tests for filter logic
- [ ] 4.2 Integration tests for API endpoint
- [ ] 4.3 E2E tests for user workflow

## 5. Documentation
- [ ] 5.1 Update API documentation
- [ ] 5.2 Add user guide for filters
```

## Handling Task Dependencies

If a task cannot be completed due to dependencies:
- Note the blocker in the task list
- Communicate with orchestrator if external dependencies exist
- Skip to independent tasks and return later
- Update task notes with blocking information

## Spec Delta Implementation

When implementing spec deltas:

### ADDED Requirements
- Implement completely new functionality
- Write new tests for all scenarios
- Add documentation for new features

### MODIFIED Requirements
- Update existing implementation
- Ensure backward compatibility or provide migration
- Update tests to match new behavior
- Update documentation to reflect changes

### REMOVED Requirements
- Safely remove deprecated functionality
- Add deprecation warnings if needed
- Remove or update related tests
- Archive documentation appropriately

## Success Criteria
- All tasks marked as completed `[x]`
- Code implements all spec requirements accurately
- All scenarios from specs pass tests
- Code follows project conventions and patterns
- No regressions in existing functionality
- Ready for /openspec-archive