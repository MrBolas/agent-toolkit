# OpenCode Commands

This directory contains custom commands for the OpenCode agent toolkit. Commands are organized by category for easy discovery.

## Directory Structure

```
.opencode/command/
├── develop/          # Feature implementation and code changes
├── quality/          # Testing and code review
├── openspec/         # OpenSpec specification workflow
├── workspace/        # Git worktree management
├── integration/      # External system integrations (Jira, GitHub)
├── search/           # Code and knowledge search
├── docs/             # Documentation generation
└── workflow/         # Multi-step workflows
```

## Command Categories

### Develop Commands
Commands for implementing features and making code changes:
- `/implement-feature` - Implement a feature with high-quality code
- `/refactor-code` - Refactor code for better clarity, performance, or maintainability
- `/debug-issue` - Debug and fix issues in the codebase
- `/plan-feature` - Plan implementation steps for a feature

### Quality Commands
Commands for testing and code review:
- `/run-tests` - Run tests and analyze failures
- `/review-code` - Review code for quality, security, and best practices
- `/review-pr` - Review a GitHub PR with automated code review

### OpenSpec Commands
Commands for specification-driven development:
- `/openspec-proposal` - Create an OpenSpec change proposal
- `/openspec-validate` - Validate proposal formatting and structure
- `/openspec-apply` - Implement an approved OpenSpec change
- `/openspec-archive` - Archive completed change and merge specs

### Workspace Commands
Commands for managing git worktrees:
- `/workspace-create` - Create a new worktree for parallel development
- `/workspace-list` - List all active worktrees
- `/workspace-cleanup` - Clean up a completed worktree

### Integration Commands
Commands for external system integration:
- `/jira-fetch` - Fetch Jira ticket details
- `/github-fetch` - Fetch GitHub issue details

### Search Commands
- `/search-code` - Search for information using semantic code search

### Documentation Commands
- `/generate-docs` - Generate or improve documentation

### Workflow Commands
Multi-step composite workflows:
- `/feature-workflow` - Complete feature development workflow (plan → implement → test → review)

## Command Format

Each command file follows this structure:

```markdown
---
description: Brief description of what the command does
agent: developer | orchestrator | code_reviewer | tester
chain: command1, command2  # Optional: commands to run after
---

# Command: /command-name

## Purpose
Detailed explanation of the command's purpose.

## Usage
Command syntax and arguments.

## Examples
Concrete usage examples.

## Workflow Integration
How this command fits into development workflows.

## Implementation Notes
Detailed steps for executing the command.
```

## Naming Conventions

- All command files use hyphens: `implement-feature.md`
- All command names use hyphens: `/implement-feature`
- Command headers use format: `# Command: /command-name`

## Ticket/Issue Integration

Many commands support automatic fetching of requirements from Jira or GitHub:

### Jira Integration (Atlassian MCP)
When a Jira ticket ID is provided (e.g., `PROJ-123`):
- Automatically fetches ticket details, description, acceptance criteria
- Extracts requirements and user stories
- Uses context for implementation

### GitHub Integration (GitHub MCP)
When a GitHub issue ID is provided (e.g., `#123` or `123`):
- Automatically fetches issue details, description, labels
- Extracts requirements from issue body and comments
- Uses context for implementation

### Commands with Ticket/Issue Support:
- `/implement-feature`
- `/plan-feature`
- `/feature-workflow`
- `/openspec-proposal`
- `/workspace-create`

## Command Chaining

Commands can automatically suggest or chain to related commands:

- `/implement-feature` → `/run-tests` → `/review-code`
- `/refactor-code` → `/run-tests` → `/review-code`
- `/debug-issue` → `/run-tests` → `/review-code`
- `/run-tests` → `/review-code`
- `/review-code` → `/debug-issue`, `/refactor-code`, or `/generate-docs`
- `/openspec-apply` → `/run-tests` → `/review-code`

## Serena Integration

Most commands leverage Serena (semantic memory) for:
- Understanding existing code patterns and architecture
- Finding similar implementations
- Storing significant outcomes for future reference
- Maintaining consistency with established conventions

Commands should:
1. **Search before implementing** - Query Serena for existing patterns
2. **Store after significant work** - Document architectural decisions
3. **Maintain consistency** - Follow patterns found in Serena

## Adding New Commands

To add a new command:

1. Choose the appropriate category directory
2. Create a new `.md` file with a hyphenated name
3. Follow the command format structure
4. Use simple frontmatter (description, agent, optional chain)
5. Make the command self-contained (include all necessary context)
6. Update this README if adding a new category

## Best Practices

- **Self-contained documentation** - Each command should be understandable on its own
- **Clear examples** - Provide concrete usage examples
- **Integration clarity** - Clearly document MCP integration behavior
- **Error handling** - Explain fallback behavior when integrations unavailable
- **Workflow context** - Show how the command fits into larger workflows