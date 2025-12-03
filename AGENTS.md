# OpenCode Agent Toolkit

This repository provides a blueprint for configuring OpenCode multi-agent systems with semantic memory.

## Project Structure

- `.opencode/agent/` - Agent configurations (orchestrator, developer, code_reviewer, tester)
- `.opencode/command/` - Custom commands for common workflows
- `.opencode/opencode.*.jsonc` - OS-specific configurations (macOS, Linux)
- `docker-compose.yml` - Infrastructure for ChromaDB (deprecated, migrating to Serena)

## Agent Architecture

This toolkit uses a **primary + subagent** pattern:

- **orchestrator** (primary) - Coordinates tasks, delegates to specialists, makes strategic decisions
- **developer** (subagent) - Implements features, refactors code, writes new functionality
- **code_reviewer** (subagent) - Evaluates code quality, security, and best practices
- **tester** (subagent) - Runs tests, analyzes failures, validates functionality

**Important**: Subagents cannot call other subagents. Only the orchestrator can delegate.

## Code Standards

### Meta-Prompting Style
All agent prompts use meta-prompting language:
- Describe **capabilities** (what agents *can* do), not prescriptions (what they *must* do)
- Frame choices and options, not rigid workflows
- Enable agent autonomy within clear boundaries

### Tool Usage
- **Serena MCP**: Primary semantic memory and code analysis tool
  - Use for understanding existing patterns and architectural decisions
  - Store significant outcomes for future reference
  - Query before making changes to maintain consistency
  
- **Context7 MCP**: External documentation lookup
  - Use when project knowledge is insufficient
  - Good for API references and framework documentation

### Delegation Best Practices
When the orchestrator delegates:
1. Provide complete context upfront (don't make subagents ask for obvious details)
2. Explain *why* this subagent is appropriate for the task
3. Include relevant findings from Serena searches
4. Set clear success criteria

## Memory Strategy

### Serena Integration
- Memories are stored in Serena's semantic code database
- Before significant changes, query Serena for existing patterns
- After significant work, store outcomes and architectural decisions
- Use hierarchical organization for large codebases

### Task Persistence
For complex multi-step work:
- Use `todowrite` to create persistent tasks
- Update progress as work proceeds
- Suspend with detailed state when approaching context limits
- Resume from saved state in future sessions

## Command Reference

All commands follow the `<object>-<action>` pattern for consistency and discoverability.

### Command Pattern

Commands are organized by the object they operate on:
- `jira-*` - Jira ticket operations
- `github-*` - GitHub operations (issues, PRs)
- `feature-*` - Feature development workflow
- `code-*` - Code operations (refactor, review, search)
- `issue-*` - Generic issue/bug debugging
- `test-*` - Testing operations
- `docs-*` - Documentation generation
- `openspec-*` - Spec-driven development
- `workspace-*` - Workspace management

### Available Commands

#### External Integrations

**Jira**
- `/jira-fetch <ticket-key>` - Fetch Jira ticket details (e.g., WTM-263)

**GitHub**
- `/github-fetch <issue-ref>` - Fetch GitHub issue details (e.g., #123)
- `/github-pr-review <pr-ref>` - Review a GitHub pull request comprehensively

#### Feature Development

- `/feature-plan <description|ticket>` - Plan implementation steps for a feature
- `/feature-implement <description|ticket>` - Implement a feature with high-quality code
- `/feature-workflow <description|ticket>` - Complete end-to-end feature workflow

#### Code Operations

- `/code-refactor <target>` - Refactor code for better quality and maintainability
- `/code-review <target>` - Review code for quality, security, and best practices
- `/code-search <pattern>` - Search codebase for patterns, symbols, or concepts

#### Issue Management

- `/issue-debug <description>` - Debug and fix issues in the codebase (generic, works with any issue tracker)

#### Testing

- `/test-run <target>` - Run tests and analyze results

#### Documentation

- `/docs-generate <target>` - Generate or update documentation

#### Spec-Driven Development (OpenSpec)

- `/openspec-proposal <description|ticket>` - Create a change proposal with specs
- `/openspec-apply <change-name>` - Implement an approved change
- `/openspec-archive <change-name>` - Archive completed changes into main specs
- `/openspec-validate` - Validate OpenSpec structure and consistency

#### Workspace Management

- `/workspace-create <name>` - Create a new workspace for isolated work
- `/workspace-cleanup` - Clean up temporary files and artifacts
- `/workspace-list` - List available workspaces

### Quick Reference by Use Case

**Starting from a Jira Ticket**
```bash
/jira-fetch WTM-263              # Fetch ticket details
/feature-plan WTM-263            # Plan implementation
/feature-implement WTM-263       # Implement feature
/code-review                     # Review code
/test-run                        # Run tests
```

**Starting from a GitHub Issue**
```bash
/github-fetch #123               # Fetch issue details
/feature-plan #123               # Plan implementation
/feature-implement #123          # Implement feature
/github-pr-review                # Review PR
```

**GitHub PR Review Workflow**
```bash
/github-fetch #123               # Fetch issue context
/github-pr-review #456           # Review the PR
/code-review src/                # Deep dive into specific code
/test-run                        # Validate changes
```

**OpenSpec Workflow**
```bash
/openspec-proposal WTM-263       # Create proposal with specs
# Review and refine proposal
/openspec-apply my-feature       # Implement approved change
/openspec-archive my-feature     # Archive to main specs
```

**Code Quality Workflow**
```bash
/code-search "authentication"    # Find relevant code
/code-refactor auth/login.ts     # Refactor specific code
/code-review auth/               # Review changes
/test-run auth/                  # Run tests
```

**Debugging Workflow**
```bash
/issue-debug "login fails"       # Debug the issue
/code-review                     # Review fix
/test-run                        # Validate fix
```

### Command Organization

Commands are stored in two locations:
- **Root level** (`.opencode/command/*.md`) - Executable commands
- **Subdirectories** (`.opencode/command/*/`) - Source/backup (not executable)

Only root-level commands are recognized by OpenCode.

### Design Principles

**Object Grouping**
Commands are grouped by the primary object they operate on:
- **Platform-specific objects** (jira, github) - Operations on external platforms
- **Development objects** (feature, code, issue) - Core development activities
- **Process objects** (test, docs, openspec, workspace) - Development processes

**Naming Consistency**
- Use the most specific object name (e.g., `github-pr-review` not `pr-review`)
- Keep actions simple and clear (fetch, plan, implement, review, etc.)
- Maintain consistency across similar operations

### Tips

- Use tab completion to discover commands by object prefix
- Commands can accept ticket/issue IDs (PROJ-123, #123) or descriptions
- Most commands integrate with Jira/GitHub when ticket IDs are provided
- OpenSpec commands work together as a complete workflow
- GitHub commands handle both issues and pull requests

## Common Workflows

### Feature Development from Jira Ticket
1. `/jira-fetch WTM-263` - Fetch ticket details
2. `/feature-plan WTM-263` - Orchestrator plans implementation
3. `/feature-implement WTM-263` - @developer implements
4. `/code-review` - @code_reviewer evaluates
5. `/test-run` - @tester validates
6. Orchestrator stores architectural decisions in Serena

### Spec-Driven Development with OpenSpec
1. `/openspec-proposal WTM-263` - Create change proposal with specs and tasks
2. Review and refine proposals until requirements are clear
3. `/openspec-apply my-feature` - Implement approved changes
4. `/code-review` - @code_reviewer evaluates implemented code
5. `/openspec-archive my-feature` - Merge completed changes into main specs

### Code Review
1. `/code-review` command or mention @code_reviewer
2. Reviewer analyzes against project standards (from Serena)
3. Provides structured feedback with severity/issue/suggestion/rationale
4. Stores significant patterns back to Serena

### Testing
1. `/test-run` command or mention @tester
2. Tester executes tests and analyzes failures
3. May coordinate with @developer for fixes
4. Stores coverage insights to Serena

## Permissions Philosophy

- **orchestrator**: Full access (edit, bash, webfetch allowed)
- **developer**: Full implementation access
- **code_reviewer**: Read-only (edit/write denied)
- **tester**: Ask for edit/bash (needs user approval)

This creates appropriate guardrails while enabling productivity.

## External Knowledge

When project knowledge is insufficient:
- Use Context7 for API docs and framework references
- Use webfetch for blog posts and best practices
- Use Atlassian MCP for Jira ticket integration (`/atlassian-ticket-fetch`)
- Always verify external information against project standards
