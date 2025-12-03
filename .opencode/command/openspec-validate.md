---
description: Validate OpenSpec change proposals for proper formatting and structure
agent: orchestrator
---

# Command: /openspec-validate

## Purpose
Validate an OpenSpec change proposal to ensure it follows proper formatting and structure before implementation. Catches issues early in the development workflow.

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
/openspec-validate user-profile-filters
```

## Workflow Integration
- **Before**: Run after creating a proposal with /openspec-proposal
- **During**: Validates proposal.md, tasks.md, and spec deltas
- **After**: Use validated proposals with /openspec-apply

## Implementation Notes

Execute these validation steps:

1. **Validate change folder structure**:
   - Ensure openspec/changes/{change-name}/ exists
   - Check for required files:
     - ✅ proposal.md (required)
     - ✅ tasks.md (required)
     - ✅ specs/ directory (required)
     - ⚠️ design.md (optional)
   - Report missing required files

2. **Validate proposal.md**:
   - Check for required sections:
     - Purpose
     - Scope
     - Requirements
     - Success Criteria
   - Verify content is not empty
   - Check for proper markdown formatting
   - Ensure links to tickets/issues are valid format

3. **Validate tasks.md**:
   - Verify markdown checklist format: `- [ ]` or `- [x]`
   - Ensure tasks are organized in sections
   - Check that tasks are specific and actionable
   - Verify task numbering is consistent
   - Warn if tasks are too vague (e.g., "implement feature")
   - Check for proper nesting and hierarchy

4. **Validate spec deltas** (in openspec/changes/{change-name}/specs/):
   - Ensure at least one spec file exists
   - For each spec file, validate:
     - Proper section headers: ADDED, MODIFIED, REMOVED
     - At least one section must have content
     - Requirement format: `### Requirement: requirement-name`
     - Requirement uses SHALL or MUST language
     - Scenario format: `#### Scenario: description`
     - Scenarios use GIVEN/WHEN/THEN format
   - Check for orphaned scenarios (scenario without requirement)
   - Verify requirement names are unique within file

5. **Validate requirement format**:
   ```markdown
   ### Requirement: requirement-name
   The system SHALL [clear, testable requirement]
   
   #### Scenario: scenario-description
   GIVEN [context/precondition]
   WHEN [action/trigger]
   THEN [expected result]
   ```

6. **Check for common issues**:
   - Empty sections (ADDED/MODIFIED/REMOVED with no content)
   - Missing SHALL/MUST in requirements
   - Incomplete GIVEN/WHEN/THEN scenarios
   - Vague or untestable requirements
   - Missing scenario names
   - Inconsistent naming conventions
   - Duplicate requirement names

7. **Generate validation report**:
   ```
   ## Validation Report: {change-name}
   
   ### Summary
   ✅ Change folder structure valid
   ✅ proposal.md valid
   ⚠️ tasks.md has 2 warnings
   ❌ specs/ has 3 errors
   
   ### Errors (must fix)
   - specs/user-profile.md:15: Requirement missing SHALL/MUST
   - specs/user-profile.md:23: Scenario missing WHEN clause
   - specs/filters.md:8: Orphaned scenario (no parent requirement)
   
   ### Warnings (should fix)
   - tasks.md:12: Task too vague: "implement feature"
   - tasks.md:18: Task not properly indented
   
   ### Info
   - 3 requirements validated
   - 7 scenarios validated
   - 12 tasks validated
   
   ### Recommendation
   ❌ Not ready for /openspec-apply - fix errors first
   ```

## Validation Levels

### Error (Must Fix)
- Missing required files or sections
- Invalid requirement format (no SHALL/MUST)
- Invalid scenario format (missing GIVEN/WHEN/THEN)
- Orphaned scenarios
- Duplicate requirement names
- Invalid markdown syntax

### Warning (Should Fix)
- Vague task descriptions
- Empty optional sections
- Inconsistent naming
- Missing design.md for complex changes
- Tasks without clear acceptance criteria

### Info (Nice to Have)
- Statistics about requirements and scenarios
- Suggestions for improvement
- Best practice recommendations

## Success Criteria
- Returns validation success/failure status
- Identifies specific formatting issues with line numbers
- Provides actionable suggestions for fixes
- Does not modify any files (read-only validation)
- Clear categorization of errors vs warnings
- Easy to understand and act upon