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

## Commands

- **PR Review**: Use `/review-pr https://github.com/user/repo/pull/123` in the TUI to trigger automated PR code review with inline comments.

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

## Semantic Memory with Serena

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
