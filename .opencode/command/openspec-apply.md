---
description: Implement an approved OpenSpec change by orchestrating task execution
agent: orchestrator
---

# Command: /openspec-apply

## Purpose
Orchestrate the implementation of an approved OpenSpec change by coordinating developer, code reviewer, and tester agents through the complete workflow.

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
- **During**: Coordinate implementation, review, and testing
- **After**: Use /openspec-archive when all tasks complete and tests pass

## Implementation Notes

**Change name to apply: $ARGUMENTS**

Execute these steps:

1. **Validate change exists** for $ARGUMENTS:
   - Ensure openspec/changes/{change-name}/ folder exists
   - Verify proposal.md, tasks.md, and specs/ are present

2. **Read specifications and search patterns**:
   - Review proposal.md for context and goals
   - Study spec deltas in openspec/changes/{change-name}/specs/
   - Search Serena for HIGH-LEVEL patterns (architectural approach, design decisions)
   - Understand how this fits with existing system design

3. **Prepare task list**:
   - Read tasks.md
   - Understand task sequence

4. **Delegate to developer**:
   - "@developer here are the tasks to implement"
   - Pass full task list and specs
   - Developer will:
     - Choose task order
     - Implement incrementally
     - Update checkboxes as they go
     - Search Serena for implementation patterns
     - Report when ready for review

5. **WAIT for user confirmation to proceed to code review**:
   - Report: "Implementation complete. Ready for code review."
   - Ask: "Should I proceed with code review?"
   - **STOP and wait for explicit user approval**

6. **Request code review** (only after user confirms):
   - "@code_reviewer review the implementation"
   - code_reviewer will classify issue severity

7. **Evaluate feedback and iterate**:
   - If no issues: continue to step 8
   - If CRITICAL issues: "@developer please fix these critical issues"
   - If HIGH/MEDIUM issues: Ask user confirmation first before delegating
   - If LOW/OPTIONAL issues: Inform user but proceed without confirmation
   - Loop back to code review if developer made changes

8. **WAIT for user confirmation to proceed to testing**:
   - Report: "Code review complete. Ready for testing."
   - Ask: "Should I proceed with testing?"
   - **STOP and wait for explicit user approval**

9. **Run tests** (only after user confirms):
   - "@tester run tests"
   - If tests pass: continue to step 10
   - If tests fail: Ask user confirmation before looping back to developer

10. **WAIT for user confirmation to archive**:
    - Report: "All tasks complete and tests pass. Ready to archive."
    - Ask: "Should I archive this change with /openspec-archive?"
    - **STOP and wait for explicit user approval**

11. **Archive** (only after user confirms):
    - "/openspec-archive {change-name}"
    - Merge specs into main specs directory
    - Move change to archive
    - Update documentation

**IMPORTANT:** Never automatically transition between phases. Always wait for explicit user confirmation at steps 5, 8, and 10.

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