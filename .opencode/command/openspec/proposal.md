---
description: Create an OpenSpec change proposal for a feature or change
agent: orchestrator
---

# Command: /openspec-proposal

## Purpose
Create an OpenSpec change proposal that captures spec updates for a new feature or modification. Aligns human and AI stakeholders on requirements before implementation begins.

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
- **After**: Review and refine specs, validate with /openspec-validate, then use /openspec-apply

## Implementation Notes

Execute these steps:

1. **Apply ticket-fetch pattern** (see _fragments/ticket-fetch.md):
   - Parse input to determine if it's a ticket ID or description
   - Fetch from Jira/GitHub if ID detected and MCP available
   - Extract requirements from fetched data or use manual description

2. **Search for existing patterns** (see _fragments/serena-search.md):
   - Query Serena for similar features or patterns
   - Understand current architectural approach
   - Review existing specs for format and style
   - Identify related components or systems

3. **Generate change name**:
   - Create unique, descriptive folder name from description
   - Format: lowercase-with-hyphens
   - Example: "add-profile-filters", "implement-2fa"

4. **Create change folder structure**:
   ```
   openspec/changes/{change-name}/
   ├── proposal.md      # Why and what changes
   ├── tasks.md         # Implementation checklist
   ├── design.md        # Technical decisions (optional)
   └── specs/           # Delta files showing spec updates
   ```

5. **Generate proposal.md**:
   ```markdown
   # Proposal: [Change Name]
   
   ## Purpose
   [Why this change is needed]
   
   ## Scope
   [What will be changed]
   
   ## Requirements
   [List of requirements from ticket/issue/description]
   
   ## Success Criteria
   [How to know when this is complete]
   
   ## Related
   [Links to tickets, issues, or related changes]
   ```

6. **Generate tasks.md**:
   - Break down implementation into actionable tasks
   - Use markdown checklist format
   - Organize by logical phases (database, backend, frontend, tests, etc.)
   - Make tasks specific and measurable
   ```markdown
   # Implementation Tasks
   
   ## 1. Database Setup
   - [ ] 1.1 Add column to users table
   - [ ] 1.2 Create migration script
   
   ## 2. Backend Implementation
   - [ ] 2.1 Add API endpoint
   - [ ] 2.2 Update business logic
   ```

7. **Generate spec deltas**:
   - Create delta files in openspec/changes/{change-name}/specs/
   - Follow OpenSpec delta format with sections:
     - `### ADDED` - New requirements or scenarios
     - `### MODIFIED` - Updated requirements or scenarios
     - `### REMOVED` - Deleted requirements or scenarios
   - Use proper requirement format:
     ```markdown
     ### Requirement: [requirement-name]
     The system SHALL [requirement description]
     
     #### Scenario: [scenario description]
     GIVEN [context]
     WHEN [action]
     THEN [expected result]
     ```

8. **Store context in Serena**:
   - Save proposal summary for future reference
   - Link to ticket/issue if applicable
   - Document architectural decisions made

## OpenSpec Delta Format

Spec deltas show what will change in the main specs:

```markdown
# Feature: User Profile Filters

### ADDED

### Requirement: filter-by-location
The system SHALL allow users to filter profiles by location

#### Scenario: User filters by city
GIVEN a user is on the profile search page
WHEN the user selects "New York" from the location filter
THEN only profiles with location "New York" are displayed

### MODIFIED

### Requirement: search-results (previously: basic-search)
The system SHALL display search results with pagination and filters

[Updated scenarios...]

### REMOVED

### Requirement: legacy-search-ui
[This requirement is being replaced by the new filter system]
```

## Success Criteria
- Change folder created successfully
- All required files generated (proposal.md, tasks.md, specs/)
- Spec deltas follow OpenSpec format (ADDED/MODIFIED/REMOVED)
- Tasks are actionable and complete
- Requirements use proper SHALL/MUST language
- Scenarios follow GIVEN/WHEN/THEN format