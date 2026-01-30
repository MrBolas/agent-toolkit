# OpenCode Agent Toolkit

A **spec-driven, multi-agent system** for software development with semantic code understanding and zero MCP context pollution.

**Key Features:**
- **4 OpenSpec Commands** - Proposal → Apply → Validate → Archive workflow
- **6 Specialized Agents** - Orchestrator + 5 focused subagents
- **Zero Context Pollution** - MCPs isolated to dedicated subagents
- **Semantic Memory** - Serena MCP for persistent code understanding
- **Meta-Prompting** - Agents have autonomy within clear boundaries

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design decisions and trade-offs.

---

## Quick Start

### 1. Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your tokens:
# - GITHUB_TOKEN (for GitHub MCP)
# - JIRA_API_TOKEN (for Atlassian MCP)

# Generate OS-specific config and install
make opencode
```

**OS-Specific Configuration:**
- **macOS**: Uses `.opencode/opencode.macos.jsonc` (with `host.docker.internal`)
- **Linux**: Uses `.opencode/opencode.linux.jsonc` (with `--network host`)
- `make opencode` detects your OS and generates the appropriate config

### 2. Use as Template

**For new projects:**
```bash
cp -r /path/to/agent-toolkit/.opencode /path/to/your-project/
cd /path/to/your-project
npm install  # Install dependencies in .opencode/
```

**For global reference:**
```bash
make opencode  # Copies to ~/.config/opencode/
```

### 3. Claude Code Setup (Optional)

If you also use **Claude Code**, you can install a mirrored configuration:

```bash
# Install Claude Code configuration
make claude
```

This creates a parallel configuration in `~/.config/claude/` with:
- Same MCP servers (Serena, GitHub, Atlassian, Context7, Sequential Thinking)
- Same model configurations for local LLMs
- Same permission settings

See `.claude/README.md` for details.

---

## Architecture Overview

### Agents

This toolkit uses a **primary + subagent** pattern with clear role separation:

- **orchestrator** (primary) - Daily driver, coordinates tasks, delegates to specialists
- **@developer** (subagent) - Implements features incrementally, updates task checkboxes
- **@code_reviewer** (subagent) - Reviews code quality, classifies issues by severity
- **@tester** (subagent) - Runs tests, analyzes failures, suggests fixes
- **@jira-mcp** (subagent) - Jira interface (zero context pollution)
- **@github-mcp** (subagent) - GitHub interface (zero context pollution)

**Key Principle:** Subagents cannot delegate to each other - only the orchestrator coordinates.

### Commands (4 Total)

All development flows through the **OpenSpec workflow**:

1. **`/openspec-proposal [description|ticket]`** - Create change proposals with specs and tasks
2. **`/openspec-apply [change-name]`** - Implement approved changes (orchestrator → developer → code_reviewer → tester)
3. **`/openspec-validate [change-name]`** - Validate spec structure before implementation
4. **`/openspec-archive [change-name]`** - Merge completed changes into main specs

### Skills (2 Total)

Reusable knowledge that persists in agent context:

1. **`skills_code_search`** - Semantic code search methodology
2. **`skills_documentation_standards`** - Documentation templates and standards

---

## Design Philosophy

### 1. Spec-Driven Development

All features start with a proposal that defines:
- **What** will change (specs)
- **How** it will be implemented (tasks)
- **Why** it's needed (context)

This ensures human-AI alignment before implementation begins.

### 2. Zero Context Pollution

**Problem:** MCPs add 3-4k tokens each to every conversation.

**Solution:** Isolate MCPs to dedicated subagents:
- Orchestrator delegates to `@jira-mcp` or `@github-mcp`
- MCPs only load in subagent context
- Primary agent stays lightweight (~10-13k baseline tokens)

### 3. Meta-Prompting

Agent system prompts define:
1. **WHO** they are (role and identity)
2. **PURPOSE** (what they're trying to achieve)
3. **WHAT THEY CAN DO** (capabilities, not prescriptions)

This gives agents autonomy within clear boundaries.

### 4. Sequential Task Execution

**Decision:** Developer implements tasks one at a time, sequentially.

**Why:**
- Simpler orchestration (no inter-agent coordination)
- Natural dependency handling
- Easier to debug
- Sufficient for most workflows

**Trade-off:** Slower than parallel execution, but avoids complexity.

See [ARCHITECTURE.md](ARCHITECTURE.md) for full design rationale.

---

## OpenSpec Workflow

### Example: Adding User Authentication

```bash
# 1. Create a proposal
/openspec-proposal "add user authentication with JWT tokens"

# Orchestrator creates:
# - openspec/changes/add-user-auth/proposal.md
# - openspec/changes/add-user-auth/specs/auth-service.md
# - openspec/changes/add-user-auth/tasks.md

# 2. Review and refine the proposal
# Edit specs and tasks as needed

# 3. Implement the change
/openspec-apply add-user-auth

# Orchestrator coordinates with USER CONFIRMATION at each phase:
# - @developer implements tasks sequentially
# - [WAIT] User confirms: "Proceed with code review?"
# - @code_reviewer reviews implementation
# - [WAIT] User confirms: "Proceed with testing?"
# - @tester runs test suite
# - [WAIT] User confirms: "Archive this change?"

# 4. Archive when user approves
/openspec-archive add-user-auth

# Merges specs into main specs directory
# Moves change to archive
```

### With Jira Integration

```bash
# Fetch Jira ticket and create proposal
# Orchestrator delegates to @jira-mcp (zero context pollution)
# Change name will be "WTM-263" (uses ticket code)
/openspec-proposal WTM-263

# Rest of workflow is the same (with user confirmations)
/openspec-apply WTM-263
# [User confirms at each phase: implementation → review → testing → archive]
/openspec-archive WTM-263
```

---

## Typical Workflows

### Feature Development

```
User: /openspec-proposal "add dark mode toggle"
  ↓
Orchestrator: Creates proposal with specs and tasks
  ↓
User: /openspec-apply add-dark-mode
  ↓
Orchestrator: Searches Serena for high-level patterns
  ↓
Orchestrator: @developer implement these tasks
  ↓
@developer: Implements tasks sequentially, updates checkboxes
  ↓
Orchestrator: [WAITS] "Implementation complete. Proceed with code review?"
  ↓
User: "Yes, proceed"
  ↓
Orchestrator: @code_reviewer review the implementation
  ↓
@code_reviewer: Reviews code, classifies issues by severity
  ↓
Orchestrator: Evaluates feedback, asks user for critical issues
  ↓
Orchestrator: [WAITS] "Code review complete. Proceed with testing?"
  ↓
User: "Yes, proceed"
  ↓
Orchestrator: @tester run tests
  ↓
@tester: Runs tests, reports results
  ↓
Orchestrator: [WAITS] "Tests pass. Archive this change?"
  ↓
User: "Yes, archive" OR /openspec-archive add-dark-mode
```

### Code Review

```
User: @code_reviewer review src/auth/
  ↓
@code_reviewer: 
  - Searches Serena for project standards
  - Reviews code against specs
  - Classifies issues (CRITICAL, HIGH, MEDIUM, LOW)
  - Provides actionable feedback
```

### Testing

```
User: @tester run the test suite
  ↓
@tester:
  - Executes tests
  - Reports pass/fail with details
  - Suggests fixes for failures
```

---

## MCP Integrations

This toolkit uses **MCP isolation** to prevent context pollution:

### Serena MCP (Always Enabled)

**Semantic code understanding and persistent memory.**

**Usage:**
```
# Orchestrator searches for high-level patterns
Search Serena for authentication architecture patterns

# Developer searches for implementation patterns
Search Serena for how we handle JWT token validation
```

**Features:**
- Semantic search (understands code by meaning)
- Cross-session memory (knowledge persists)
- Automatic indexing and retrieval
- Available to all agents (~2-3k tokens)

**Best Practices:**
1. Query Serena before implementation for existing patterns
2. Store architectural decisions after significant changes
3. Use hierarchical organization (area/component/feature)

---

### Atlassian MCP (Isolated to @jira-mcp)

**Jira integration with zero context pollution.**

**Usage:**
```
# Orchestrator delegates to @jira-mcp
/openspec-proposal WTM-263

# Behind the scenes:
# - Orchestrator calls @jira-mcp subagent
# - @jira-mcp loads Atlassian MCP (~2-3k tokens)
# - Fetches ticket details
# - Returns to orchestrator
# - MCP unloads (zero pollution)
```

**Features:**
- Automatic ticket fetching
- Ticket status tracking
- Bidirectional sync (git → Jira)
- Rich context for proposals

**Setup:**
- Enabled in `@jira-mcp` subagent only
- Authenticate on first use
- Works with any Jira instance

---

### GitHub MCP (Isolated to @github-mcp)

**GitHub integration with zero context pollution.**

**Usage:**
```
# Orchestrator delegates to @github-mcp
@github-mcp fetch PR #123

# Behind the scenes:
# - Orchestrator calls @github-mcp subagent
# - @github-mcp loads GitHub MCP (~3-4k tokens)
# - Fetches PR details
# - Returns to orchestrator
# - MCP unloads (zero pollution)
```

**Features:**
- PR management
- Issue tracking
- Repository operations
- Code review posting

**Setup:**
- Enabled in `@github-mcp` subagent only
- Set `GITHUB_PERSONAL_ACCESS_TOKEN` in `.env`
- Authenticate on first use

---

### Context7 MCP (Available to All)

**External documentation lookup.**

**Usage:**
Agents automatically use Context7 when they need external API docs or framework guides.

**Features:**
- API documentation
- Framework guides
- Best practices

**Note:** Adds ~2-3k tokens when active.

---

### Why MCP Isolation?

**Problem:** MCPs add 3-4k tokens each to every conversation.

**Solution:** Isolate MCPs to dedicated subagents:
- Orchestrator delegates to `@jira-mcp` or `@github-mcp`
- MCPs only load in subagent context
- Subagent returns results and unloads
- Primary agent stays lightweight (~10-13k baseline)

**Result:** Zero MCP context pollution in daily driver.

## Key Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Commands | 20 | 4 | **-80%** |
| Agents | 4 | 6 | +50% (clearer roles) |
| Skills | 0 | 2 | +2 |
| MCP Context Pollution | High | **Zero** | **Eliminated** |
| Command Complexity | High | **Low** | **Simplified** |
| Agent Autonomy | Low | **High** | **Increased** |

---

## Design Trade-offs

### Sequential vs Parallel Execution

**Decision:** Tasks execute sequentially (one at a time).

**Why:**
- Simpler orchestration (no inter-agent coordination)
- Natural dependency handling
- Easier to debug
- Sufficient for most workflows

**Trade-off:** Slower than parallel, but avoids complexity.

**Future:** Can add parallel execution if needed.

---

### Single Developer vs Multiple

**Decision:** One `@developer` subagent handles all implementation.

**Why:**
- Simpler orchestration (no task distribution)
- Maintains code consistency
- Easier context management

**Trade-off:** Can't parallelize across developers.

**Future:** Can add multiple developers with explicit task distribution.

---

### User Confirmation Strategy

**Decision:** Ask user confirmation for:
- **Phase transitions** (implementation → code review → testing → archive)
- **CRITICAL code review issues**
- **Test failures**

For HIGH/MEDIUM: Ask user first.
For LOW/OPTIONAL: Proceed without confirmation.

**Why:**
- User maintains full control over workflow progression
- Can review implementation before code review
- Can review code review results before testing
- Can review test results before archiving
- Critical issues always require attention

**Trade-off:** Requires more user interaction, but provides explicit control.

**Workflow Checkpoints:**
1. After implementation → Ask before code review
2. After code review → Ask before testing
3. After testing → Ask before archiving

---

## Troubleshooting

### MCPs Not Loading

**Problem:** Atlassian or GitHub MCP not available when calling `@jira-mcp` or `@github-mcp`.

**Solution:**
1. Verify MCP is enabled in subagent config
2. Check MCP command is correct for your OS
3. Verify environment variables (`.env` file)
4. Restart OpenCode

---

### Skills Not Discoverable

**Problem:** `skills_code_search` or `skills_documentation_standards` not available.

**Solution:**
1. Verify skill files exist in `.opencode/skills/`
2. Verify skill names match config
3. Restart OpenCode
4. Check agent has tool access enabled

---

### Config Changes Not Taking Effect

After modifying `.opencode/opencode.*.jsonc` files:

```bash
make opencode  # Copy to ~/.config/opencode/
# Then restart OpenCode
```

---

## Further Reading

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed design decisions, trade-offs, and system architecture
- **[AGENTS.md](AGENTS.md)** - Agent configurations and delegation patterns
- **OpenCode Documentation** - https://opencode.ai
- **Skills Plugin** - https://github.com/malhashemi/opencode-skills

---

## Document History

- **Created:** December 2024
- **Last Updated:** December 2024
- **Status:** Active
- **Maintainer:** Agent Toolkit Repository

---

## Questions?

For detailed information about:
- **Design decisions** → See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Agent behavior** → See [AGENTS.md](AGENTS.md)
- **OpenSpec workflow** → See `openspec/` directory
- **Configuration** → See `.opencode/opencode.*.jsonc`

This architecture represents significant design decisions made through iterative refinement. Update this documentation when making changes to prevent regression.
