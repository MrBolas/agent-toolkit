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

Repository memory is managed by the memory_manager agent using ChromaDB via MCP.

1. Start ChromaDB using Docker Compose: `docker-compose up -d`
2. Ensure MCP server for ChromaDB is configured in `.opencode/config.yaml`.
3. Use the orchestrator to call @memory_manager for scanning/updating memory (e.g., "Scan the repository for initial memories").

The orchestrator will prompt to update memory after significant changes.