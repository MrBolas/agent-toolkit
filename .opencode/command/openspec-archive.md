---
description: Archive a completed OpenSpec change and merge spec updates into the source of truth
agent: orchestrator
---

# Command: /openspec-archive

## Purpose
Archive a completed OpenSpec change by merging the approved spec deltas into the main specs directory and moving the change to the archive. Ensures the source of truth is updated and change history is preserved.

## Usage
```
/openspec-archive [change-name] [--yes]
```

## Arguments
- `change-name`: Name of the completed change folder in openspec/changes/
- `--yes`: Skip confirmation prompts (optional)

## Examples
```
/openspec-archive add-profile-filters
/openspec-archive implement-2fa --yes
/openspec-archive user-authentication
```

## Workflow Integration
- **Before**: All tasks in change must be completed and implementation verified
- **During**: Merge spec deltas into openspec/specs/ and move change to openspec/archive/
- **After**: Change is complete, specs are updated, and change is archived for future reference

## Implementation Notes

Execute these steps:

1. **Validate completion**:
   - Ensure openspec/changes/{change-name}/ exists
   - Verify all tasks in tasks.md are marked complete `[x]`
   - Check that implementation has been tested and reviewed
   - Warn if incomplete tasks found (require --yes to proceed)

2. **Search for context** (see _fragments/serena-search.md):
   - Query Serena for related specs and changes
   - Understand dependencies on other specifications
   - Verify no conflicts with recent changes

3. **Read spec deltas**:
   - Parse all files in openspec/changes/{change-name}/specs/
   - Extract ADDED, MODIFIED, and REMOVED sections
   - Validate delta format before merging

4. **Merge spec deltas into main specs**:
   - For each spec file in the change:
     - Locate corresponding file in openspec/specs/
     - Apply ADDED sections (append new requirements)
     - Apply MODIFIED sections (update existing requirements)
     - Apply REMOVED sections (delete deprecated requirements)
   - Preserve proper formatting and structure
   - Maintain requirement ordering and organization

5. **Delta merge process**:
   
   **For ADDED sections**:
   - Append new requirements to target spec file
   - Preserve all scenarios and context
   - Add to appropriate section (maintain organization)
   
   **For MODIFIED sections**:
   - Find existing requirement by name
   - Replace entire requirement block with updated version
   - Preserve scenarios unless explicitly changed
   - Update any cross-references
   
   **For REMOVED sections**:
   - Find and remove the requirement
   - Remove associated scenarios
   - Check for orphaned references in other specs
   - Add comment noting when/why removed (optional)

6. **Verify merge results**:
   - Ensure all deltas were applied successfully
   - Check that no requirements were accidentally duplicated
   - Verify proper markdown formatting maintained
   - Validate merged specs with /openspec-validate (optional)

7. **Create archive structure**:
   - Create openspec/archive/ directory if it doesn't exist
   - Move entire change folder to openspec/archive/{change-name}/
   - Preserve all files: proposal.md, tasks.md, design.md, specs/

8. **Add archive metadata**:
   - Create openspec/archive/{change-name}/ARCHIVED.md with:
     ```markdown
     # Archived: {change-name}
     
     **Archived Date**: YYYY-MM-DD
     **Implementation Status**: Complete
     **Specs Merged**: Yes
     
     ## Summary
     [Brief description of what was changed]
     
     ## Files Modified
     - openspec/specs/[list of spec files updated]
     
     ## Related
     - Ticket/Issue: [if applicable]
     - PR: [if applicable]
     ```

9. **Store in Serena**:
   - Document the completed change
   - Record architectural decisions made
   - Link archived change for future reference

10. **Confirm and report**:
    - List all spec files modified
    - Show archive location
    - Provide summary of changes merged
    - Report any warnings or issues

## Example Merge Workflow

**Before merge**:
```
openspec/specs/user-profile.md (existing)
openspec/changes/add-filters/specs/user-profile.md (deltas)
```

**Delta file contains**:
```markdown
### ADDED

### Requirement: filter-by-location
The system SHALL allow filtering by location
...

### MODIFIED

### Requirement: search-results
[Updated requirement text]
...
```

**After merge**:
```
openspec/specs/user-profile.md (updated with new requirement and modified one)
openspec/archive/add-filters/ (change moved here)
```

## Handling Conflicts

If conflicts detected during merge:
- **Conflicting modifications**: Manual review required
- **Missing target spec**: Create new spec file if intentional
- **Orphaned references**: Warn and list for manual cleanup
- **Format issues**: Report and suggest fixes

Conflict resolution:
1. Stop merge process
2. Report specific conflicts with line numbers
3. Suggest resolution approach
4. Require manual conflict resolution
5. User can re-run after conflicts resolved

## Safety Checks

- ⚠️ Warn if tasks are incomplete (unless --yes)
- ⚠️ Warn if specs have validation errors
- ⚠️ Check if archive folder already exists (prevent overwrites)
- ⚠️ Confirm before making irreversible changes
- ✅ Backup original specs before merging (optional)
- ✅ Verify merge didn't introduce duplicates
- ✅ Preserve original change folder in archive

## Rollback Support

If issues discovered after merge:
1. Archived change contains original deltas
2. Can recreate change from archive if needed
3. Git history provides additional safety
4. Consider using git worktree for isolated archiving

## Success Criteria
- Change folder moved to openspec/archive/{change-name}/
- Main specs updated with all approved changes
- No conflicts or data loss during merge
- Archive contains complete change history with metadata
- Spec files maintain proper format and structure
- No duplicate requirements in merged specs
- Related cross-references updated if needed