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

## Common Workflows

### Feature Development
1. Orchestrator searches Serena for existing patterns
2. Delegates implementation to @developer with context
3. @developer builds, potentially calling @tester for validation
4. @code_reviewer evaluates for quality/security
5. Orchestrator stores architectural decisions in Serena

### Spec-Driven Development with OpenSpec
1. Use `/openspec-proposal` to create change proposals with specs and tasks
2. Review and refine proposals until requirements are clear
3. Use `/openspec-apply` to implement approved changes
4. @code_reviewer evaluates implemented code
5. Use `/openspec-archive` to merge completed changes into main specs

### Code Review
1. Use `/code-review` command or mention @code_reviewer
2. Reviewer analyzes against project standards (from Serena)
3. Provides structured feedback with severity/issue/suggestion/rationale
4. Stores significant patterns back to Serena

### Testing
1. Use `/test` command or mention @tester
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
