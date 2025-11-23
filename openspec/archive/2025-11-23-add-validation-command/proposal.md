# Add OpenSpec Validation Command

## Purpose
Add a new slash command `/openspec-validate` to validate OpenSpec change proposals and ensure they follow proper formatting and structure before implementation.

## Motivation
Currently, users can create OpenSpec proposals but there's no automated way to validate that the specs follow the required format (ADDED/MODIFIED/REMOVED sections, proper scenario structure, etc.). This command will help catch formatting issues early and ensure consistency across all changes.

## Scope
- Add new command file in `.opencode/command/openspec/validate.md`
- Command validates spec delta files for proper OpenSpec format
- Command checks task structure and completeness
- Integration with existing OpenSpec workflow

## Success Criteria
- `/openspec-validate` command is available
- Command identifies common formatting issues
- Command provides helpful error messages and suggestions
- Command integrates seamlessly with proposal → apply → archive workflow