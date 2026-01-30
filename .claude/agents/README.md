# Agent Toolkit - Claude Code Configuration

This directory contains custom agents for Claude Code that mirror the OpenCode agent architecture.

## Quick Start

1. **Install configuration**:
   ```bash
   make claude
   ```

2. **Start Claude Code** in your project directory

3. **Use agents by referencing their prompts**:
   - Load an agent prompt manually, or
   - Ask Claude to "act as [agent]" and paste the agent definition

## Available Agents

### orchestrator.md
**Role**: Coordinates tasks, delegates to specialists  
**Use for**: Complex multi-step work, managing development workflow  

### developer.md  
**Role**: Implements features and edits code  
**Use for**: Writing code, implementing specifications  

### reviewer.md
**Role**: Reviews code for quality, security, logic  
**Use for**: Code review before merging  

### tester.md
**Role**: Runs tests and analyzes failures  
**Use for**: Testing implementations, debugging failures  

## How to Use Agents

Unlike OpenCode's `@agent` mentions, Claude Code requires you to explicitly load agent contexts:

### Method 1: Direct Prompting
```
Act as a Developer Agent with these instructions:
[paste content from developer.md]

Now implement: [your task]
```

### Method 2: Reference by Name
```
Switch to Developer Agent mode and implement the authentication service.
```
(Claude will load the developer.md context if available)

### Method 3: Orchestrator Pattern
```
As the Orchestrator, coordinate this feature implementation:
1. Developer: Implement the API endpoint
2. Reviewer: Review the implementation  
3. Tester: Run the test suite
```

## Differences from OpenCode

| Feature | OpenCode | Claude Code |
|---------|----------|-------------|
| Agent invocation | `@developer` | Manual prompt loading |
| Orchestration | Automatic | Manual coordination |
| Context isolation | Automatic | Manual management |
| Subagent spawning | Built-in | Use `/spawn` command |

## Workflow Example

```
User: Implement user authentication

Claude (Orchestrator): I'll coordinate this implementation.

## To Developer Agent
[pastes developer.md content]
Implement JWT-based authentication...

[Developer implements...]

Claude (Orchestrator): Implementation complete. Now reviewing...

## To Reviewer Agent  
[pastes reviewer.md content]
Review the authentication implementation...

[Reviewer reviews...]

Claude (Orchestrator): Review complete. Running tests...

## To Tester Agent
[pastes tester.md content]
Run the authentication tests...
```

## Tips

1. **Load agent context explicitly** - Claude Code doesn't auto-load agents like OpenCode
2. **Use `/compact` regularly** - Clear context when switching between agents
3. **Parallel execution** - Use Claude Code's `/spawn` for parallel subagents
4. **Project memory** - Use Serena MCP for cross-session memory

## Customization

Edit the `.md` files in this directory to customize agent behavior:
- Adjust instructions
- Add new agents
- Modify workflows

After editing, restart Claude Code to pick up changes.

## See Also

- [OpenCode Agents](../../.opencode/agent/) - Original agent definitions
- [OpenCode README](../../README.md) - Main project documentation
