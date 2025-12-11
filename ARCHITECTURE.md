# OpenCode Agent Architecture

## Overview

This document describes the OpenCode agent architecture and configuration strategy used across all machines. This is a **spec-driven, multi-agent system** designed to minimize context pollution while maintaining clear task orchestration.

**Key Metrics:**
- **4 Commands** (down from 20) - OpenSpec-focused workflow
- **6 Agents** (1 primary + 5 subagents) - Clear role separation
- **2 Skills** - Reusable knowledge (code-search, documentation-standards)
- **Zero MCP context pollution** - MCPs isolated to dedicated subagents

---

## Architecture Diagram

```
User (Daily Driver)
  ↓
Primary Agent: orchestrator
  ├─ Maintains shared context pool
  ├─ Runs OpenSpec workflow commands
  ├─ Searches for high-level patterns
  ├─ Evaluates feedback and makes decisions
  │
  ├─ Delegates to → @developer (subagent)
  │   ├─ Implements tasks incrementally
  │   ├─ Updates task checkboxes
  │   ├─ Searches for implementation patterns
  │   └─ Reports progress
  │
  ├─ Delegates to → @code_reviewer (subagent)
  │   ├─ Reviews code against specs
  │   ├─ Classifies issues by severity
  │   └─ Provides actionable feedback
  │
  ├─ Delegates to → @tester (subagent)
  │   ├─ Runs test suite
  │   ├─ Reports results
  │   └─ Suggests fixes
  │
  ├─ Delegates to → @jira-mcp (subagent)
  │   ├─ Fetches Jira tickets
  │   ├─ Makes comments
  │   └─ Updates ticket status
  │
  └─ Delegates to → @github-mcp (subagent)
      ├─ Fetches PRs and branches
      ├─ Posts code reviews
      └─ Makes comments on PRs
```

---

## Agents

### Primary Agent: orchestrator

**Role:** Daily driver and context hub

**Responsibilities:**
- Execute OpenSpec workflow commands (`/openspec-proposal`, `/openspec-apply`, `/openspec-validate`, `/openspec-archive`)
- Search Serena for HIGH-LEVEL architectural patterns
- Delegate implementation to @developer
- Evaluate code review feedback and decide next steps
- Ask user confirmation only on critical issues and test failures
- Coordinate sequential task execution

**Context:** Maintains shared context pool for all work

**Tools:** Full access (bash, edit, write, read, grep, serena, todowrite, todoread, webfetch)

**Skills:** `skills_code_search` (for pattern search during planning)

**MCPs:** None (delegates to @jira-mcp and @github-mcp)

---

### Subagent: developer

**Role:** Implementation specialist

**Responsibilities:**
- Receive task list from `/openspec-apply`
- Choose task order (sequential execution)
- Implement one task at a time
- Update task checkboxes in tasks.md
- Search Serena for IMPLEMENTATION-SPECIFIC patterns
- Report progress to orchestrator

**Context:** Receives full context from orchestrator

**Tools:** read, grep, serena, bash, todowrite, todoread, webfetch, write, edit

**Skills:** `skills_code_search`, `skills_documentation_standards`

**MCPs:** None (can call @jira-mcp and @github-mcp if needed)

**Permissions:** write=allow, edit=allow, bash=allow

---

### Subagent: code_reviewer

**Role:** Quality assurance specialist

**Responsibilities:**
- Review code against provided specifications
- Classify issues by severity (CRITICAL, HIGH, MEDIUM, LOW)
- Provide specific, actionable feedback
- Include positive feedback on good implementation
- Be clear about what MUST be fixed vs what CAN be improved

**Context:** Receives implementation context from orchestrator

**Tools:** read, grep, serena, bash, todoread, webfetch

**Skills:** `skills_code_search`, `skills_documentation_standards`

**MCPs:** None (can call @github-mcp if reviewing a PR)

**Permissions:** write=deny, edit=deny, bash=allow

---

### Subagent: tester

**Role:** Validation specialist

**Responsibilities:**
- Run test suite
- Report results clearly (pass/fail, which tests failed, error messages)
- Suggest what developer should fix
- Be actionable and specific

**Context:** Receives implementation context from orchestrator

**Tools:** read, grep, serena, bash, todowrite, todoread, webfetch

**Skills:** None

**MCPs:** None

**Permissions:** bash=ask, write=ask, edit=ask

---

### Subagent: jira-mcp

**Role:** Jira interface

**Responsibilities:**
- Fetch Jira ticket details
- Make comments on tickets
- Update ticket status

**Context:** Isolated subagent context

**Tools:** Minimal (just MCP access)

**MCPs:** atlassian (Jira)

---

### Subagent: github-mcp

**Role:** GitHub interface

**Responsibilities:**
- Fetch PR information
- Fetch branch information
- Post code reviews
- Make comments on PRs

**Context:** Isolated subagent context

**Tools:** Minimal (just MCP access)

**MCPs:** github

---

## Commands

### 4 OpenSpec Commands (down from 20)

1. **`/openspec-proposal [description|ticket]`**
   - Create change proposals with specs and tasks
   - Orchestrator runs this to define what will change

2. **`/openspec-apply [change-name]`**
   - Orchestrate implementation of approved changes
   - Coordinates developer → code_reviewer → tester workflow

3. **`/openspec-validate [change-name]`**
   - Validate spec structure and formatting
   - Catch issues before implementation

4. **`/openspec-archive [change-name]`**
   - Merge specs and archive completed changes
   - Final step after all tasks complete and tests pass

### Deleted Commands (16 total)

These were replaced by agent behavior or skills:
- `code-search` → `skills_code_search`
- `docs-generate` → `skills_documentation_standards`
- `jira-fetch` → `@jira-mcp` subagent
- `github-fetch` → `@github-mcp` subagent
- `feature-plan` → Orchestrator behavior
- `feature-workflow` → Orchestrator behavior
- `feature-implement` → @developer behavior
- `code-refactor` → @developer behavior
- `code-review` → @code_reviewer behavior
- `github-pr-review` → @code_reviewer behavior
- `issue-debug` → @developer behavior
- `test-run` → @tester behavior
- `workspace-*` (3 commands) → Out of scope for now

---

## Skills

### 2 Reusable Skills

1. **`skills_code_search`**
   - Location: `.opencode/skills/code-search/SKILL.md`
   - Available to: orchestrator, developer, code_reviewer
   - Purpose: Teach agents how to search code semantically
   - Persists in context throughout conversations

2. **`skills_documentation-standards`**
   - Location: `.opencode/skills/documentation-standards/SKILL.md`
   - Available to: developer, code_reviewer
   - Purpose: Provide documentation standards and templates
   - Persists in context throughout conversations

---

## The OpenSpec Workflow

### Step-by-Step Execution

```
1. User: /openspec-proposal "add user authentication"
   OR
   User: /openspec-proposal WTM-263
   ↓
   Orchestrator creates proposal with specs and tasks
   - If Jira ticket: change name = "WTM-263"
   - If description: change name = "add-user-authentication"

2. User: /openspec-apply WTM-263
   ↓
   Orchestrator:
   - Reads proposal and specs
   - Searches Serena for HIGH-LEVEL patterns
   - Delegates to @developer with full context
   
3. @developer:
   - Reviews task list
   - Searches Serena for IMPLEMENTATION patterns
   - Implements tasks sequentially
   - Updates task checkboxes
   - Reports: "All tasks complete, ready for review"

4. Orchestrator: **WAITS for user confirmation**
   ↓
   Reports: "Implementation complete. Ready for code review."
   Asks: "Should I proceed with code review?"
   **STOPS and waits for explicit user approval**

5. User: "Yes, proceed with code review"
   ↓
   Orchestrator: @code_reviewer review the implementation
   ↓
   @code_reviewer:
   - Reviews code against specs
   - Classifies issues by severity
   - Reports findings

6. Orchestrator evaluates feedback:
   - CRITICAL issues → "@developer please fix"
   - HIGH/MEDIUM issues → Ask user first
   - LOW/OPTIONAL issues → Inform user, proceed
   - No issues → Continue to step 7

7. Orchestrator: **WAITS for user confirmation**
   ↓
   Reports: "Code review complete. Ready for testing."
   Asks: "Should I proceed with testing?"
   **STOPS and waits for explicit user approval**

8. User: "Yes, proceed with testing"
   ↓
   Orchestrator: @tester run tests
   ↓
   @tester:
   - Runs test suite
   - Reports results
   - If failures: suggests fixes

9. If test failures → Ask user confirmation before looping back

10. Orchestrator: **WAITS for user confirmation**
    ↓
    Reports: "All tasks complete and tests pass. Ready to archive."
    Asks: "Should I archive this change with /openspec-archive?"
    **STOPS and waits for explicit user approval**

11. User: "Yes, archive" OR User: /openspec-archive WTM-263
    ↓
    Orchestrator:
    - Merges specs into main specs directory
    - Moves change to archive
    - Workflow complete
```

**IMPORTANT:** The orchestrator never automatically transitions between phases. User confirmation is required at steps 4, 7, and 10.

---

## Design Decisions & Trade-offs

### 1. Sequential Task Execution (Not Parallel)

**Decision:** Developer implements tasks one at a time, sequentially.

**Why:**
- Simpler orchestration (no inter-subagent communication needed)
- Natural dependency handling (later tasks can depend on earlier ones)
- Easier to debug (clear execution order)
- Sufficient for most feature development

**Trade-off:** Slower than parallel execution, but avoids complexity of task coordination.

**Future:** Can revisit if parallel execution becomes critical.

---

### 2. Single Developer (Not Multiple)

**Decision:** One @developer subagent handles all implementation.

**Why:**
- Simpler orchestration (no task distribution logic)
- Maintains code consistency (single developer perspective)
- Easier context management
- Sufficient for most workflows

**Trade-off:** Can't parallelize across multiple developers.

**Future:** Can add multiple developer subagents if needed, but requires explicit task distribution logic.

---

### 3. Developer Chooses Task Order

**Decision:** Orchestrator provides task list, developer decides implementation order.

**Why:**
- Gives developer autonomy (can optimize based on dependencies)
- Simpler than orchestrator managing task order
- Developer understands dependencies better
- Allows for flexible implementation strategy

**Trade-off:** Less explicit control from orchestrator.

**Future:** Can add explicit task ordering if needed.

---

### 4. MCPs Isolated to Dedicated Subagents

**Decision:** Atlassian and GitHub MCPs only available in @jira-mcp and @github-mcp subagents.

**Why:**
- **Zero context pollution** in primary agent
- MCPs only load when explicitly called
- Clean separation of concerns
- Orchestrator stays lightweight

**Trade-off:** Requires delegation to subagents for MCP operations.

**Benefit:** Massive context savings (MCPs add 3-4k tokens each).

---

### 5. User Confirmation Required for Phase Transitions

**Decision:** Ask user confirmation for:
- **Phase transitions** (implementation → code review → testing → archive)
- **CRITICAL code review issues**
- **Test failures**

For HIGH/MEDIUM issues: Ask user first.
For LOW/OPTIONAL issues: Proceed without confirmation.

**Why:**
- User maintains full control over workflow progression
- Prevents unexpected automatic transitions
- User can review implementation before code review
- User can review code review results before testing
- User can review test results before archiving
- Critical issues always require attention

**Trade-off:** Requires more user interaction, but provides explicit control.

**Workflow Checkpoints:**
1. After implementation completes → Ask before code review
2. After code review completes → Ask before testing
3. After testing completes → Ask before archiving

---

### 6. High-Level vs Implementation-Specific Pattern Search

**Decision:**
- Orchestrator searches for HIGH-LEVEL patterns (architecture, design decisions)
- Developer searches for IMPLEMENTATION-SPECIFIC patterns (how similar code is written)

**Why:**
- Clear separation of concerns
- Orchestrator focuses on system design
- Developer focuses on code patterns
- Prevents redundant searches

**Trade-off:** Requires agents to understand what patterns to search for.

---

### 7. Meta-Prompting for Agent Capabilities

**Decision:** Agent system prompts define WHO they are, their PURPOSE, then WHAT THEY CAN DO (not what they must do).

**Why:**
- Gives agents autonomy within their domain
- Frames capabilities as options, not prescriptions
- Allows agents to make intelligent decisions
- More flexible than rigid instructions

**Example:**
```
# Who you are
You are a developer focused on implementing features incrementally.

# Your purpose
Your purpose is to implement features from OpenSpec task lists.

# What you can do
You can:
- Choose which task to implement first
- Search Serena for implementation patterns
- Update task checkboxes as you progress
- Call @jira-mcp if you need ticket context
```

---

### 8. Commands Replaced by Agent Behavior

**Decision:** Removed 16 commands, replaced with agent behavior and skills.

**Why:**
- Cleaner command list (4 instead of 20)
- Behavior is more flexible than commands
- Skills persist in context (better than command responses)
- Reduces command maintenance burden

**Trade-off:** Less explicit control (agents decide how to implement).

**Benefit:** Simpler, more maintainable system.

---

## Context Management

### Token Optimization

**Baseline Context:**
- Serena MCP: ~2-3k tokens
- Sequential-Thinking MCP: ~1-2k tokens
- Total baseline: ~10-13k tokens

**When Subagents Are Called:**
- Orchestrator delegates to subagent
- Subagent loads with its own context
- MCPs only load in subagent context (not primary)
- Subagent session ends, MCPs unload
- Primary agent context stays clean

**Result:** Zero MCP context pollution in primary agent.

---

## System Prompt Philosophy

### Structure

Each agent's system prompt follows this structure:

1. **WHO YOU ARE** - Role and identity
   - Example: "You are a developer focused on implementing features incrementally"

2. **YOUR PURPOSE** - What you're trying to achieve
   - Example: "Your purpose is to implement features from OpenSpec task lists"

3. **WHAT YOU CAN DO** - Capabilities (meta-prompting)
   - Framed as options, not prescriptions
   - Gives agents autonomy
   - Example: "You can choose which task to implement first"

### Meta-Prompting Approach

Instead of:
```
You must implement tasks sequentially.
You should update checkboxes after each task.
```

We use:
```
You can implement tasks sequentially, choosing the order that makes sense.
You're able to update task checkboxes to show progress.
You can search Serena for implementation patterns to inform your decisions.
```

**Benefits:**
- Agents have autonomy within their domain
- Capabilities are options, not rigid rules
- More flexible and adaptive
- Agents can make intelligent decisions

---

## Limitations & Future Considerations

### Current Limitations

1. **Sequential Execution Only** - Tasks run one at a time
2. **Single Developer** - Can't parallelize across multiple developers
3. **No Workspace Integration** - Doesn't use git worktrees yet
4. **No Task Dependencies** - Developer must understand dependencies manually

### Future Roadmap

#### Phase 2: Parallel Execution (Deferred)
- Multiple developer subagents
- Explicit task distribution
- Task dependency management
- Interface definitions between tasks

#### Phase 3: Workspace Integration (Deferred)
- Automatic worktree creation for changes
- Branch management
- Isolated development environments

#### Phase 4: Advanced Orchestration (Deferred)
- Dynamic task scheduling
- Resource-aware task allocation
- Performance optimization

---

## How to Use This Architecture

### For Daily Development

1. **Create a proposal:** `/openspec-proposal "what you want to build"`
2. **Apply the change:** `/openspec-apply change-name`
3. **Monitor progress:** Orchestrator coordinates everything
4. **Approve or iterate:** Respond to user confirmation requests
5. **Archive when done:** `/openspec-archive change-name`

### For Extending the System

**Add a new skill:**
1. Create `.opencode/skills/skill-name/SKILL.md`
2. Define WHO, PURPOSE, WHAT YOU CAN DO
3. Enable in config for relevant agents
4. Skills auto-discover on restart

**Add a new agent:**
1. Create `.opencode/agent/agent-name.md`
2. Set `mode: subagent`
3. Define system prompt (WHO, PURPOSE, WHAT YOU CAN DO)
4. Configure tools and permissions
5. Call with `@agent-name` from orchestrator

**Modify a command:**
1. Edit `.opencode/command/command-name.md`
2. Update implementation notes
3. Restart OpenCode

---

## Configuration Files

### System-Specific Configs

- **macOS:** `.opencode/opencode.macos.jsonc`
  - Uses `host.docker.internal` for Docker networking
  - MCP commands use macOS-specific paths

- **Linux:** `.opencode/opencode.linux.jsonc`
  - Uses `--network host` for Docker networking
  - MCP commands use Linux-specific paths

### Shared Configuration

Both files include:
- Tool access control (MCPs disabled globally, enabled per-agent)
- Agent definitions (orchestrator + 5 subagents)
- Skill access control
- Permission settings

---

## Key Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Commands | 20 | 4 | -80% |
| Agents | 4 | 6 | +50% (but clearer roles) |
| Skills | 0 | 2 | +2 |
| MCP Context Pollution | High | Zero | Eliminated |
| Command Complexity | High | Low | Simplified |
| Agent Autonomy | Low | High | Increased |

---

## Troubleshooting

### MCPs Not Loading

**Problem:** Atlassian or GitHub MCP not available when calling @jira-mcp or @github-mcp.

**Solution:**
1. Verify MCP is enabled in config
2. Check MCP command is correct for your OS
3. Verify environment variables (GITHUB_PERSONAL_ACCESS_TOKEN, etc.)
4. Restart OpenCode

### Skills Not Discoverable

**Problem:** `skills_code_search` or `skills_documentation_standards` not available.

**Solution:**
1. Verify skill files exist in `.opencode/skills/`
2. Verify skill names match config
3. Restart OpenCode
4. Check that agent has tool access enabled

### Developer Not Updating Checkboxes

**Problem:** Developer completes tasks but doesn't update tasks.md.

**Solution:**
1. Remind developer in prompt to update checkboxes
2. Check developer's system prompt includes this responsibility
3. Verify developer has write/edit permissions

---

## References

- **OpenCode Documentation:** https://opencode.ai
- **OpenSpec Format:** See `openspec/` directory
- **Skills Plugin:** https://github.com/malhashemi/opencode-skills
- **Serena:** Semantic code analysis tool

---

## Document History

- **Created:** December 2024
- **Last Updated:** December 2024
- **Status:** Active
- **Maintainer:** Agent Toolkit Repository

---

## Questions?

This architecture represents significant design decisions made through iterative refinement. If you have questions about:

- **Why a decision was made** - See "Design Decisions & Trade-offs" section
- **How to extend the system** - See "How to Use This Architecture" section
- **Future plans** - See "Limitations & Future Considerations" section
- **Configuration** - See "Configuration Files" section

For changes to this architecture, update this document to prevent regression.
