# OpenCode Agent Toolkit

This repository provides a blueprint for configuring the OpenCode Agent Toolkit.

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token (with `repo` scope for PR access)

2. **OS-Specific Configuration**: This toolkit automatically detects your OS and uses the appropriate config:
   - **macOS**: Uses `.opencode/opencode.macos.jsonc` (with `host.docker.internal`)
   - **Linux**: Uses `.opencode/opencode.linux.jsonc` (with `--network host`)
   - Run `make opencode` to install the correct config to `~/.config/opencode/`

This repository serves as a blueprint/template for OpenCode agent configuration. Use it to bootstrap new projects.

### Using as a Template

1. **For new projects**: Copy the `.opencode` folder to your project root:
   ```bash
   cp -r /path/to/agent-toolkit/.opencode /path/to/your-project/
   cd /path/to/your-project
   npm install  # Install dependencies in .opencode/
   ```

2. **Optional - Install globally** (for reference or fallback):
   ```bash
   make opencode  # Copies to ~/.config/opencode/
   ```

### Project-Local Configuration

Each project should have its own `.opencode/` directory with:
- Agent configurations
- Skills (like chromadb)
- Dependencies (node_modules)
- Logs

Agents will always use the **project-local** `.opencode/` directory in the repository they're working on.

## Parallel Ticket Development

Work on multiple tickets simultaneously using **git worktrees** with **Jira integration** via Atlassian MCP.

### Create a Ticket Workspace

In OpenCode TUI:
```
/ticket-create PROJ-123
```

Or with manual description:
```
/ticket-create AUTH-456 "Implement OAuth2 authentication"
```

Or use the script:
```bash
./scripts/create-ticket-workspace.sh PROJ-123
```

**With Jira Integration (Atlassian MCP enabled):**
- ✅ Automatically fetches ticket details from Jira
- ✅ Populates TICKET.md with description, acceptance criteria
- ✅ Stores ticket context in Serena
- ✅ Links related tickets and subtasks

This creates:
- New worktree at `../agent-toolkit-PROJ-123/`
- New branch: `feature/PROJ-123`
- Isolated `.serena/` project data with Jira context
- `TICKET.md` with comprehensive ticket details

### Work on the Ticket

```bash
cd ../agent-toolkit-AUTH-123
opencode  # Start OpenCode in this worktree
```

Each worktree has:
- ✅ Same `.opencode/` configuration (shared from master)
- ✅ Isolated `.serena/` memories (ticket-specific knowledge)
- ✅ Independent OpenCode session
- ✅ Shared git history

### Manage Workspaces

**List active workspaces with Jira status:**
```
/ticket-list
```
Shows: worktree path, branch, commit, Jira status, assignee, priority

**Clean up when done:**
```
/ticket-cleanup PROJ-123
```
- Removes worktree and optionally deletes branch
- Can update Jira ticket status (Done/In Review)
- Adds comment to Jira with branch/PR info

### Why Worktrees + Jira Integration?

- **Parallel work**: Multiple tickets open simultaneously
- **No context switching**: Each ticket has its own terminal/editor
- **Isolated Serena**: Ticket-specific knowledge doesn't pollute other tickets
- **Shared config**: All tickets use the same agent configuration
- **Jira integration**: Automatic ticket context and status updates
- **Rich context**: Acceptance criteria, related tickets, and subtasks in TICKET.md

### Atlassian MCP Setup

The Atlassian MCP is enabled by default and provides:
- Automatic Jira ticket fetching
- Ticket status tracking
- Jira status updates on cleanup
- Rich ticket context in Serena

**Authentication**: Follow Atlassian MCP prompts on first use to authenticate with your Jira instance.

See `PARALLEL-DEVELOPMENT.md` for detailed guide.

## Commands

### Code Review & Analysis
- **`/review-pr <url>`** - Automated PR code review with inline comments
- **`/code-review`** - Review code for quality, security, and best practices
- **`/refactor`** - Refactor code for clarity and maintainability

### Development Workflow
- **`/implement`** - Implement a feature or fix
- **`/test`** - Run tests and analyze results
- **`/debug`** - Debug issues and errors

### Ticket Management (Parallel Development)
- **`/ticket-create <id> [description]`** - Create a new ticket worktree with Jira integration
- **`/ticket-list`** - List all active ticket worktrees with Jira status
- **`/ticket-cleanup <id>`** - Clean up a completed ticket worktree and update Jira

### Documentation & Planning
- **`/document`** - Generate or update documentation
- **`/feature-plan`** - Plan a new feature implementation
- **`/query`** - Query Serena for project knowledge

## Agents

This toolkit uses a streamlined **primary + subagent** architecture with 4 focused agents:

- **orchestrator** (primary): Coordinates tasks, delegates to specialists, and makes strategic decisions
- **developer** (subagent): Implements features, refactors code, and builds software
- **code_reviewer** (subagent): Evaluates code quality, security, and best practices
- **tester** (subagent): Executes tests, analyzes failures, and validates functionality

**Key Principles:**
- All agents use **meta-prompting** language (describing capabilities, not prescribing actions)
- **Subagents cannot delegate** to each other - only the orchestrator can coordinate
- Each agent has optimized **temperature** settings for its task type
- **Serena MCP** replaces ChromaDB for semantic memory and code analysis

The orchestrator delegates using @mentions (e.g., `@developer implement user auth`) with complete context.

## MCP Integrations

This toolkit integrates multiple MCP (Model Context Protocol) servers for enhanced capabilities:

### Serena MCP - Semantic Code Memory

**Serena MCP** provides semantic code understanding and persistent memory across sessions.

### Quick Start

Serena runs automatically when OpenCode starts (no separate setup needed):

1. **Query existing knowledge**:
   ```
   Search Serena for authentication patterns in this codebase
   ```

2. **Store architectural decisions**:
   ```
   Store this database migration strategy in Serena for future reference
   ```

3. **Before making changes**:
   ```
   Check Serena for existing error handling patterns
   ```

### How It Works

- **Automatic integration**: Serena MCP is enabled in `.opencode/opencode.*.jsonc`
- **Semantic search**: Understands code by meaning, not just text matching
- **Cross-session memory**: Knowledge persists across OpenCode sessions
- **All agents have access**: Each agent can query and store in Serena

### Best Practices

1. **Before implementation**: Query Serena for existing patterns
2. **After significant changes**: Store architectural decisions and new patterns
3. **For consistency**: Check Serena when choosing implementation approaches
4. **Use hierarchical organization**: Structure knowledge by area/component/feature

### Migration from ChromaDB

This toolkit originally used ChromaDB. Serena MCP provides superior:
- Semantic understanding of code structure
- Automatic indexing and retrieval
- No manual database management
- Better integration with OpenCode workflows

ChromaDB support remains available but disabled by default.

### Atlassian MCP - Jira Integration

**Atlassian MCP** provides seamless Jira integration for ticket management:

**Features:**
- Automatic ticket detail fetching
- Live ticket status tracking
- Bidirectional sync (git → Jira)
- Rich context for agents

**Usage:**
```
/ticket-create PROJ-123  # Fetches from Jira
/ticket-list             # Shows Jira status
/ticket-cleanup PROJ-123 # Updates Jira
```

**Setup:**
- Enabled by default in both Linux and macOS
- Authenticate on first use
- Works with any Jira instance

### Context7 MCP - Documentation Lookup

**Context7 MCP** provides access to external documentation:

**Features:**
- API documentation lookup
- Framework guides
- Best practices and patterns

**Usage:**
Agents automatically use Context7 when they need external documentation.

### GitHub MCP - Repository Integration

**GitHub MCP** provides GitHub API access (disabled by default):

**Features:**
- PR management
- Issue tracking
- Repository operations

**Enable:**
Set `GITHUB_PERSONAL_ACCESS_TOKEN` in `.env` and enable in config.

## Troubleshooting

### ChromaDB Admin UI shows no collections
**Problem**: The MCP server was using `--client-type ephemeral`, creating a temporary in-memory database instead of connecting to your persistent ChromaDB.

**Solution**: 
1. Ensure configs use `--client-type http` (already fixed in this repo)
2. Reinstall config: `make opencode`
3. Restart your OpenCode session
4. Verify connection: `@memory_manager list all collections`

### Config changes not taking effect
After modifying `.opencode/opencode.*.jsonc` files:
```bash
make opencode  # Copy to ~/.config/opencode/
# Then restart OpenCode
```
