# OpenCode Agent Toolkit

This repository provides a blueprint for configuring the OpenCode Agent Toolkit.

## Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd agent-toolkit
   ```

2. Copy the `.opencode` folder to your system-wide OpenCode configuration directory (only copying files that don't already exist):
   ```bash
   make opencode
   ```

3. Set the `GEMINI_API_KEY` environment variable with your API key:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

    Add this to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`) for persistence.

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

### ChromaDB Skill Commands

The memory_manager uses `.opencode/skills/chromadb.js` to interact with ChromaDB. **Collections are automatically created** when first used, allowing the agent to organize memories by service or context.

```bash
# List all collections
node .opencode/skills/chromadb.js collections

# Add memory (creates collection if needed)
node .opencode/skills/chromadb.js add <collection> <id> <content> <metadata_json>

# Search memories in a collection
node .opencode/skills/chromadb.js search <collection> "<query>" [n_results]

# Update memory
node .opencode/skills/chromadb.js update <collection> <id> <content> <metadata_json>

# Delete memory
node .opencode/skills/chromadb.js delete <collection> <id>

# List all memories in a collection
node .opencode/skills/chromadb.js list <collection> [limit]

# Get collection stats
node .opencode/skills/chromadb.js stats <collection>

# Delete entire collection
node .opencode/skills/chromadb.js delete-collection <collection>
```

**Collection Strategy**: The agent intelligently chooses collections based on context:
- `service-<name>` for service-specific code (e.g., `service-bananas`, `service-auth`)
- `repo_memory` for general repository knowledge
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