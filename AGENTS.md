# OpenCode Agent Toolkit

This repository provides a blueprint for configuring OpenCode multi-agent systems with semantic memory and zero MCP context pollution.

## Quick Start

See [README.md](README.md) for setup instructions and usage examples.

## Project Structure

- `.opencode/agent/` - Agent system prompts (orchestrator, developer, code_reviewer, tester, jira-mcp, github-mcp, context7-mcp)
- `.opencode/command/` - OpenSpec workflow commands (proposal, apply, archive, validate)
- `.opencode/skill/` - Reusable knowledge (code-search, documentation-standards, code-simplifier)
- `.opencode/opencode.*.jsonc` - OS-specific configuration templates (macOS, Linux)
- `.opencode/opencode.jsonc` - Generated config (created by `make opencode`, gitignored)

### Configuration Management

The toolkit uses OS-specific configuration templates:
- `opencode.macos.jsonc` - Template for macOS (uses `host.docker.internal`)
- `opencode.linux.jsonc` - Template for Linux (uses `--network host`)

Running `make opencode` will:
1. Detect your OS and copy the appropriate template to `opencode.jsonc`
2. Install the configuration to `~/.config/opencode/`
3. Exclude the OS-specific templates from the installation (only `opencode.jsonc` is copied)

This ensures only one configuration file is active at a time.

---

## Agent Architecture

This toolkit uses a **primary + subagent** pattern with **zero MCP context pollution**:

### Primary Agent

- **orchestrator** - Daily driver, coordinates tasks, delegates to specialists, makes strategic decisions
  - See `.opencode/agent/orchestrator.md` for detailed capabilities and responsibilities

### Subagents (Loaded Dynamically)

- **@developer** - Implements features incrementally, updates task checkboxes, searches for implementation patterns
- **@code_reviewer** - Reviews code against specs, classifies issues by severity, provides actionable feedback
- **@tester** - Runs tests, reports results, suggests fixes for failures
- **@jira-mcp** - Jira interface (isolated MCP access, zero context pollution)
- **@github-mcp** - GitHub interface (isolated MCP access, zero context pollution)
- **@context7-mcp** - Context7 interface (isolated MCP access, zero context pollution)

**Important:** Subagents are loaded dynamically when called. Only the orchestrator is always in context. See individual agent files for detailed descriptions.

---

## OpenSpec Workflow

The toolkit implements **spec-driven development** with explicit user confirmation at each phase.

### Commands

1. **`/openspec-proposal [description|ticket]`**
   - Create change proposals with specs and tasks
   - If Jira ticket provided: change name uses ticket code (e.g., WTM-263)
   - If description provided: change name is descriptive (e.g., add-dark-mode)

2. **`/openspec-apply [change-name]`**
   - Orchestrate implementation with explicit user confirmation at each phase:
     - After implementation → Ask before code review
     - After code review → Ask before testing
     - After testing → Ask before archiving

3. **`/openspec-validate [change-name]`**
   - Validate spec structure and formatting before implementation

4. **`/openspec-archive [change-name]`**
   - Merge specs into main specs directory and archive completed changes

### Workflow Example

```bash
# 1. Create proposal from Jira ticket
/openspec-proposal WTM-263

# 2. Review and refine specs in openspec/changes/WTM-263/

# 3. Implement with user confirmation at each phase
/openspec-apply WTM-263
# [User confirms] → Implementation starts
# [User confirms] → Code review starts
# [User confirms] → Testing starts
# [User confirms] → Archive

# 4. Archive when complete
/openspec-archive WTM-263
```

---

## Code Standards

### Meta-Prompting Style

All agent prompts use meta-prompting language:
- Describe **capabilities** (what agents *can* do), not prescriptions (what they *must* do)
- Frame choices and options, not rigid workflows
- Enable agent autonomy within clear boundaries

### Tool Access

**Agent-specific tool permissions** are defined in each agent's `.md` file:
- Orchestrator: Full access (bash, edit, write, read, grep, serena, webfetch)
- Developer: Full implementation access (write, edit, bash)
- Code Reviewer: Read-only (no write/edit/bash)
- Tester: Limited (bash allowed, write/edit require user approval)
- MCP Subagents: Only MCP tools (no file access)

**MCP Tools** are isolated to dedicated subagents:
- Atlassian MCP: Only available in @jira-mcp
- GitHub MCP: Only available in @github-mcp
- Context7 MCP: Only available in @context7-mcp
- Serena MCP: Available to all agents (semantic code search)
- Sequential-thinking MCP: Available to all agents (complex reasoning)

### Semantic Memory (Serena)

- Query Serena before implementation for existing patterns
- Store architectural decisions and new patterns after significant work
- Use hierarchical organization for large codebases

See individual agent files for how each agent uses Serena.

---

## Skills

Reusable knowledge that persists in agent context:

1. **`skills_code_search`** (`.opencode/skill/code-search/SKILL.md`)
   - Semantic code search methodology
   - Available to: orchestrator, developer, code_reviewer

2. **`skills_documentation_standards`** (`.opencode/skill/documentation-standards/SKILL.md`)
   - Documentation templates and standards
   - Available to: developer, code_reviewer

3. **`skills_code_simplifier`** (`.opencode/skill/code-simplifier/SKILL.md`)
   - Code simplification principles and techniques
   - Available to: orchestrator, developer, code_reviewer

---

## Delegation Pattern

When the orchestrator delegates to a subagent:

1. **Provide complete context upfront**
   - Don't make subagents ask for obvious details
   - Include relevant findings from Serena searches
   - Pass full task list and specifications

2. **Be specific about what you need**
   - Clear success criteria
   - Explain why this subagent is appropriate

3. **Let them work autonomously**
   - Subagents have autonomy within their domain
   - They can make intelligent decisions about approach
   - They report progress and results

4. **Evaluate their output**
   - Orchestrator makes final decisions
   - Orchestrator coordinates next steps

---

## Task Persistence

For complex multi-step work:

- Use `todowrite` to create persistent tasks
- Update progress as work proceeds
- Suspend with detailed state when approaching context limits
- Resume from saved state in future sessions

---

## Token Optimization

### Baseline Context (~23k tokens)

- Orchestrator system prompt: ~2-3k
- Serena MCP: ~6k
- Sequential-thinking MCP: ~0.7k
- Skills (code-search + documentation-standards): ~2.2k
- Config + infrastructure: ~12k

### Dynamic Context Pruning (DCP)

This toolkit includes the [Dynamic Context Pruning plugin](https://github.com/Tarquinen/opencode-dynamic-context-pruning) to automatically optimize token usage across long sessions:

- **Automatic deduplication** - Removes redundant tool outputs
- **Zero LLM cost** - Runs automatically on every request
- **Protected tools** - Critical tools like `task`, `todowrite`, `todoread` are never pruned

### MCP Isolation Strategy

**MCPs are disabled globally** and only load when subagents are called:
- Atlassian MCP: Disabled, loads only when @jira-mcp is called
- GitHub MCP: Disabled, loads only when @github-mcp is called
- Context7 MCP: Disabled, loads only when @context7-mcp is called
- Serena MCP: Enabled (semantic code search is frequently needed)
- Sequential-thinking MCP: Enabled (complex reasoning support)

This prevents ~7-10k tokens of context pollution from unused MCPs.

---

## Architecture Decisions

For detailed design decisions, trade-offs, and rationale, see [ARCHITECTURE.md](ARCHITECTURE.md).

Key decisions include:
- Sequential task execution (not parallel)
- Single developer subagent (not multiple)
- Developer chooses task order (orchestrator provides list)
- MCPs isolated to dedicated subagents (zero context pollution)
- User confirmation required for phase transitions
- Meta-prompting for agent capabilities (not prescriptions)

---

## Common Workflows

### Spec-Driven Development

```bash
# 1. Create proposal
/openspec-proposal WTM-263

# 2. Review and refine specs
# (Edit openspec/changes/WTM-263/proposal.md, tasks.md, specs/)

# 3. Implement with confirmations
/openspec-apply WTM-263
# Orchestrator coordinates: developer → code_reviewer → tester
# User confirms at each phase transition

# 4. Archive when complete
/openspec-archive WTM-263
```

### Code Review

```bash
# Mention @code_reviewer in conversation
@code_reviewer review src/auth/

# Code reviewer will:
# - Search Serena for project standards
# - Review code against specifications
# - Classify issues by severity (CRITICAL, HIGH, MEDIUM, LOW)
# - Provide actionable feedback
```

### Testing

```bash
# Mention @tester in conversation
@tester run the test suite

# Tester will:
# - Execute tests
# - Report pass/fail with details
# - Suggest fixes for failures
```

### Jira Integration

```bash
# Orchestrator delegates to @jira-mcp
@jira-mcp fetch ticket WTM-263

# Or use in proposal creation
/openspec-proposal WTM-263
# Automatically fetches ticket details and creates proposal
```

---

## External Knowledge

When project knowledge is insufficient:
- Use Serena for semantic code search (available to all agents)
- Use Context7 for API docs and framework references
- Use webfetch for blog posts and best practices
- Always verify external information against project standards

---

## Further Reading

- **[README.md](README.md)** - Setup, quick start, and usage examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design decisions, trade-offs, and system architecture
- **Agent Files** - See `.opencode/agent/*.md` for detailed agent descriptions
- **Command Files** - See `.opencode/command/*.md` for implementation details
- **Skill Files** - See `.opencode/skill/*/SKILL.md` for methodology and best practices

---

## Document History

- **Created:** December 2024
- **Last Updated:** December 2024
- **Status:** Current
- **Maintainer:** Agent Toolkit Repository

This document provides an overview of the agent architecture. For detailed information, see the referenced documents above.
