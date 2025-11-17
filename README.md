# OpenCode Agent Toolkit

This repository provides a blueprint for configuring the OpenCode Agent Toolkit.

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token (with `repo` scope for PR access)

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

1. **Start ChromaDB**:
   ```bash
   make chromadb
   ```

2. **View the database**:
   ```bash
   make viewdb
   ```
   - ChromaDB API: http://localhost:8000/docs
   - ChromaDB Admin UI: http://localhost:3000

3. **Initialize repository memory**:
   Ask the orchestrator: `@memory_manager scan and initialize the repository memory`

### ChromaDB OpenCode Skill

The memory_manager uses a custom **OpenCode skill** to interact with ChromaDB. This provides seamless integration using the chromadb npm package without dependency conflicts.

**How it works**:
- The chromadb skill is located at `.opencode/skills/chromadb/` (project-local)
- The memory_manager invokes the `skills_chromadb` tool to access it
- The skill provides commands for all ChromaDB operations
- Collections are automatically created when first used
- All operations are logged to `.opencode/logs/chromadb.log`

**Available Commands** (used by memory_manager):
- Collection management: `collections`, `create-collection`, `delete-collection`
- Document operations: `add`, `update`, `delete`, `list`
- Search: `search` (semantic vector search)
- Stats: `stats` (collection statistics)

**Collection Strategy**: The agent intelligently chooses collections based on context:
- Repository name for general code (e.g., `agent-toolkit`, `my-api`)
- `service-<name>` for service-specific code (e.g., `service-bananas`, `service-auth`)
- Custom collections for specific contexts as needed

### Memory Structure

Memories are stored with metadata:
- `file_path`: Full path to the file
- `commit_hash`: Git commit hash
- `section_type`: Type (interface, class, function, config, documentation, architecture)
- `language`: Programming language
- `importance`: Relevance score (1-10)
- `dependencies`: Related file paths

The orchestrator will suggest updating memory after significant code changes.