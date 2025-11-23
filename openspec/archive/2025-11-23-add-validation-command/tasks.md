## 1. Command Implementation
- [ ] 1.1 Create `.opencode/command/openspec/validate.md` with command definition
- [ ] 1.2 Define validation rules for OpenSpec format
- [ ] 1.3 Implement spec delta validation logic
- [ ] 1.4 Add task structure validation

## 2. Validation Rules
- [ ] 2.1 Validate ADDED/MODIFIED/REMOVED section headers
- [ ] 2.2 Check requirement format (### Requirement: name)
- [ ] 2.3 Verify scenario structure (#### Scenario: description)
- [ ] 2.4 Ensure SHALL/MUST language in requirements

## 3. Error Reporting
- [ ] 3.1 Create helpful error messages for common issues
- [ ] 3.2 Provide suggestions for fixing validation errors
- [ ] 3.3 Return structured validation results

## 4. Integration Testing
- [ ] 4.1 Test validation on existing change proposals
- [ ] 4.2 Verify command works with orchestrator agent
- [ ] 4.3 Update AGENTS.md documentation