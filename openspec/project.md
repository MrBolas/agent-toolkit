# OpenCode Agent Toolkit Project Context

## Overview
This repository provides a blueprint for configuring OpenCode multi-agent systems with semantic memory and spec-driven development using OpenSpec.

## Tech Stack
- **Primary Language**: TypeScript/JavaScript (agents and commands)
- **Configuration**: YAML, JSONC
- **Documentation**: Markdown
- **Tools**: Node.js, npm, Docker (for ChromaDB)

## Architecture Patterns
- **Agent Pattern**: Primary orchestrator + specialized subagents (developer, code_reviewer, tester)
- **Command Pattern**: Slash commands in .opencode/command/ structure
- **Memory Pattern**: Serena semantic code database for persistent knowledge
- **Spec-Driven Development**: OpenSpec for aligning human-AI requirements

## Code Standards
- **Meta-Prompting**: Agent prompts use meta-prompting language (capabilities, not prescriptions)
- **Tool Usage**: Prefer Serena for semantic understanding, Context7 for external docs
- **Delegation**: Orchestrator coordinates, subagents focus on specific tasks
- **Memory**: Store significant outcomes in Serena for future reference

## Development Workflow
1. **Planning**: Use /openspec-proposal for new features
2. **Implementation**: /openspec-apply executes approved changes
3. **Review**: Code reviewer evaluates quality and security
4. **Testing**: Tester validates functionality
5. **Archiving**: /openspec-archive merges completed changes

## Conventions
- **File Structure**: .opencode/ for configuration, openspec/ for specifications
- **Commits**: Conventional commits with type(scope): subject
- **Issues**: Use GitHub issues for tracking work
- **Documentation**: Keep README and AGENTS.md updated

## Integration Points
- **GitHub**: Issues, PRs, releases
- **Docker**: Infrastructure for vector databases
- **Node.js**: Runtime for CLI tools and agents
- **OpenSpec**: Spec-driven development workflow