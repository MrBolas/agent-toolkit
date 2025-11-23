---
description: Archive a completed OpenSpec change and merge spec updates into the source of truth
agent: orchestrator
subtask: false
---

# Command Name: /openspec-archive

## Purpose
Archive a completed OpenSpec change by merging the approved spec deltas into the main specs directory and moving the change to the archive.

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
```

## Workflow Integration
- **Before**: All tasks in change must be completed and implementation verified
- **During**: Merge spec deltas into openspec/specs/ and move change to openspec/archive/
- **After**: Change is complete and specs are updated for future reference

## Implementation Notes
Execute these steps:

1. **Validate completion**: Ensure all tasks are marked complete
2. **Merge specs**: Apply deltas from openspec/changes/{change-name}/specs/ to openspec/specs/
3. **Move to archive**: Move entire change folder to openspec/archive/{change-name}/
4. **Update references**: Ensure any cross-references are maintained
5. **Clean up**: Remove temporary files if any

## Delta Merge Process
For each spec file in the change:
- Apply ADDED sections to main specs
- Apply MODIFIED sections (replace existing content)
- Apply REMOVED sections (delete content)
- Preserve existing specs not mentioned in deltas

## Success Criteria
- Change folder moved to openspec/archive/
- Main specs updated with approved changes
- No conflicts or data loss during merge
- Archive contains complete change history