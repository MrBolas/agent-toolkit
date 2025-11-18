# OpenCode Agent Toolkit

This repository provides a blueprint for configuring the OpenCode Agent Toolkit.

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys:
   - `GEMINI_API_KEY`: Your Google Gemini API key
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

3. Set the `GEMINI_API_KEY` environment variable with your API key:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

   Add this to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`) for persistence.

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

This toolkit includes a primary orchestrator agent and four subagents for specialized tasks:

- **Orchestrator** (primary): The default agent that manages tasks and delegates to subagents as needed.
- **General Coder** (subagent): Handles general coding, refactoring, and best practices.
- **Debugger** (subagent): Focuses on bug identification and fixes.
- **Code Reviewer** (subagent): Reviews code for quality, security, and standards.
- **Memory Manager** (subagent): Manages repository memory, storing/retrieving code explanations.

The orchestrator calls subagents using @mentions (e.g., @debugger) for specific workflows.

## Memory Setup

Repository memory is managed by the **memory_manager** agent using ChromaDB with a custom skill.

### Quick Start

1. **Start ChromaDB and Admin UI**:
   ```bash
   make up
   ```

2. **View the database**:
   ```bash
   make viewdb
   ```
   - ChromaDB API: http://localhost:8420/docs
   - ChromaDB Admin UI: http://localhost:3001 (connect to `http://chromadb:8000` in setup)

3. **Initialize repository memory**:
   Ask the orchestrator: `@memory_manager scan and initialize the repository memory`

### ChromaDB MCP Integration

The memory_manager uses the **ChromaDB MCP server** to interact with a persistent ChromaDB instance via the Model Context Protocol.

**Important Configuration**:
- The MCP server connects to ChromaDB using `--client-type http` (NOT ephemeral)
- This ensures memories persist across sessions and are visible in the Admin UI
- ChromaDB runs on port 8420 (mapped from container port 8000)
- Data is persisted to `./chroma_data/` volume

**How it works**:
- memory_manager uses MCP tools (`chroma_*`) to interact with ChromaDB
- All operations target the persistent database at `http://localhost:8420`
- Collections are automatically created when first used
- Memories persist across agent sessions and container restarts

**Collection Strategy**: 
- Repository name as base collection (e.g., `agent-toolkit`)
- Sub-collections for services/areas (e.g., `agent-toolkit-auth-service`)
- Hierarchical memory IDs: `<collection>:<category>:<scope>:<identifier>`

**After configuration changes**, reinstall the config:
```bash
make opencode  # Reinstalls OS-specific config to ~/.config/opencode/
```

### Memory Structure

Memories are stored with metadata:
- `file_path`: Full path to the file
- `commit_hash`: Git commit hash
- `section_type`: Type (interface, class, function, config, documentation, architecture)
- `language`: Programming language
- `importance`: Relevance score (1-10)
- `dependencies`: Related file paths

The orchestrator will suggest updating memory after significant code changes.

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