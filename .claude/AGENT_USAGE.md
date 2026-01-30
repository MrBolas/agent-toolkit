# Agent Quick Reference

## Why Don't I See Agents?

Claude Code **doesn't have an agent browser** like OpenCode. The agents are markdown files that you manually load into the conversation context.

## How to Use Agents

### Option 1: Copy-Paste (Easiest)

1. Open the agent file:
   ```bash
   cat ~/.claude/agents/developer.md
   ```

2. Copy the content

3. Paste into Claude Code:
   ```
   Act as Developer Agent with these instructions:
   [paste content here]
   
   Task: Implement user authentication
   ```

### Option 2: Use the Load Script

```bash
# Load agent context to clipboard (requires xclip or pbcopy)
~/.claude/load-agent.sh developer | xclip -selection clipboard

# Then paste into Claude Code
```

### Option 3: Reference by Name

Simply tell Claude which agent to use:
```
Switch to Developer Agent mode and implement the login endpoint
```

Claude will look for the agent definition in `~/.claude/agents/`.

### Option 4: Create a Keyboard Shortcut

Add to your `.bashrc` or `.zshrc`:
```bash
# Quick agent loading
agent() {
    if [ -f "$HOME/.claude/agents/$1.md" ]; then
        cat "$HOME/.claude/agents/$1.md"
    else
        echo "Available agents:"
        ls -1 ~/.claude/agents/*.md | xargs -n1 basename | sed 's/.md//'
    fi
}
```

Then use:
```bash
agent developer  # Prints agent content to terminal
```

## Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| Orchestrator | `~/.claude/agents/orchestrator.md` | Coordinates tasks |
| Developer | `~/.claude/agents/developer.md` | Implements features |
| Reviewer | `~/.claude/agents/reviewer.md` | Code review |
| Tester | `~/.claude/agents/tester.md` | Runs tests |

## Quick Start Template

Copy this template into Claude Code:

```markdown
## Orchestrator Mode

I need to implement [FEATURE]. Coordinate the development:

### Phase 1: Development
Load Developer Agent and implement:
- [requirement 1]
- [requirement 2]

### Phase 2: Review  
Load Reviewer Agent and review the implementation

### Phase 3: Testing
Load Tester Agent and run tests

Report back when complete.
```

## Tips

1. **Use `/compact`** before switching agents to clear context
2. **Keep agent files open** in a separate terminal for easy copy-paste
3. **Create aliases** for frequently used agents
4. **Use the CLAUDE.md** file - it auto-loads when you start Claude Code in this directory

## Troubleshooting

**"Agent not found"**
- Check: `ls ~/.claude/agents/`
- If empty, run: `make claude`

**"How do I switch agents?"**
- Use `/compact` to clear context
- Then paste new agent instructions

**"Can I use multiple agents at once?"**
- Yes! Use `/spawn` to create parallel subagents
- Or manually coordinate: "Now acting as Reviewer Agent..."
