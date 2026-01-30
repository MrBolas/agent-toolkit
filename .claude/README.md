# Claude Code Configuration

This directory contains a mirrored configuration for **Claude Code** that parallels the OpenCode agent toolkit setup.

## ⚠️ Important: How Agents Work in Claude Code

**Claude Code does NOT have an agent browser or registry like OpenCode.** 

The agents are markdown files in `~/.claude/agents/` that you **manually load** into conversations. You won't "see" them listed anywhere in Claude Code's UI.

### Quick Agent Usage

**Option 1: Tell Claude to use an agent:**
```
Act as Developer Agent and implement user authentication
```

**Option 2: Copy-paste agent instructions:**
```bash
cat ~/.claude/agents/developer.md
# Copy output and paste into Claude Code
```

**Option 3: Use the helper script:**
```bash
~/.claude/load-agent.sh developer
```

See `AGENT_USAGE.md` for detailed instructions.

## Purpose

Claude Code is an AI coding assistant from Anthropic. This configuration provides:

- **Same MCP servers** as OpenCode (Serena, GitHub, Atlassian, Context7, Sequential Thinking)
- **Same model configurations** for local LLM providers
- **Same permission settings** for safe operations
- **OS-specific templates** for macOS and Linux

## Structure

```
.claude/
├── agents/               # Ported OpenCode agents for Claude Code
│   ├── orchestrator.md   # Coordination agent
│   ├── developer.md      # Implementation agent
│   ├── reviewer.md       # Code review agent
│   ├── tester.md         # Testing agent
│   └── README.md         # Agents documentation
├── claude.linux.jsonc    # Linux-specific configuration template
├── claude.macos.jsonc    # macOS-specific configuration template
├── claude.jsonc          # Generated config (created by `make claude`, gitignored)
└── README.md             # This file
```

## Installation

```bash
make claude
```

This will:
1. Detect your OS (macOS or Linux)
2. Copy the appropriate template to `claude.jsonc`
3. Install the configuration to `~/.claude/`

## Differences from OpenCode

While this mirrors the OpenCode configuration, Claude Code uses a different configuration format:

- **OpenCode**: Uses `opencode.jsonc` with its own schema
- **Claude Code**: Uses `settings.json` with Claude-specific settings

The configurations here are adapted to work with Claude Code's expected format while maintaining the same MCP servers and model settings.

## Parallel Usage

You can now use both tools on the same project:

```bash
# Use OpenCode for spec-driven development
/openspec-proposal "add new feature"

# Use Claude Code for quick exploration
claude "explain this codebase"
```

Both tools share:
- Same MCP server configurations
- Same local LLM endpoints
- Same project context (via Serena)

## Using Agents in Claude Code

The `.claude/agents/` directory contains ported versions of your OpenCode agents:

### Available Agents
- **orchestrator.md** - Coordinates tasks and delegates
- **developer.md** - Implements features and writes code
- **reviewer.md** - Reviews code for quality and security
- **tester.md** - Runs tests and analyzes results

### How to Use

Unlike OpenCode's `@agent` mentions, you explicitly load agent contexts:

**Method 1: Role Declaration**
```
Act as Developer Agent:
[paste from .claude/agents/developer.md]

Task: Implement user authentication
```

**Method 2: Reference by Name**
```
Switch to Reviewer Agent mode and review src/auth/
```

**Method 3: Full Orchestration**
```
As Orchestrator, coordinate this feature:
1. Developer: Implement the API
2. Reviewer: Review the code
3. Tester: Run tests
```

### Key Differences from OpenCode

| Feature | OpenCode | Claude Code |
|---------|----------|-------------|
| Agent invocation | `@developer` | Manual prompt loading |
| Auto-loading | Yes | No - paste or reference |
| Context isolation | Automatic | Use `/compact` to clear |
| Parallel agents | Built-in | Use `/spawn` command |

See `.claude/agents/README.md` for detailed usage instructions.

## Configuration Details

### MCP Servers

- **Serena**: Semantic code search and memory
- **GitHub**: PR and issue management
- **Atlassian**: Jira integration
- **Context7**: External documentation lookup
- **Sequential Thinking**: Complex reasoning support

### Model Providers

Configured for local LLM endpoints (e.g., llama.cpp, Ollama):
- GLM 4.6V (various quantizations)
- Qwen3 Coder/Next/VL (various sizes)
- MiniMax M21
- GPT OSS 120B

### Permissions

Safety settings:
- Deny: `rm -rf *`, `rm -rf /`
- Ask: Force git push, npm publish, docker system prune
- Ask: External directory access, doom loops

## Updating Configuration

After modifying `.claude/claude.*.jsonc` files:

```bash
make claude  # Re-install to ~/.config/claude/
```

Then restart Claude Code to pick up changes.

## Troubleshooting

### MCP Servers Not Loading

1. Verify MCP commands are correct for your OS
2. Check environment variables (`.env` file)
3. Restart Claude Code

### Configuration Not Applied

1. Run `make claude` to re-sync
2. Check `~/.claude/` has the latest files
3. Restart Claude Code

## See Also

- [OpenCode Configuration](../.opencode/)
- [Main README](../README.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
