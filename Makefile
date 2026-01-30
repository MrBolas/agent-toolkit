.PHONY: help opencode claude openspec clean status

 .DEFAULT_GOAL := help

 help:
	@echo "Available commands:"
	@echo "  make opencode          - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make claude            - Install OS-specific Claude Code configuration to ~/.claude/"
	@echo "  make openspec          - Install OpenSpec CLI globally"
	@echo "  make clean             - Stop containers and remove volumes"
	@echo "  make status            - Show status of all containers"

opencode:
	@echo "Generating OS-specific opencode.jsonc..."
	@if [ "$$(uname -s)" = "Darwin" ]; then \
		cp .opencode/opencode.macos.jsonc .opencode/opencode.jsonc; \
		echo "✓ Using macOS configuration"; \
	else \
		cp .opencode/opencode.linux.jsonc .opencode/opencode.jsonc; \
		echo "✓ Using Linux configuration"; \
	fi
	@echo "Installing to ~/.config/opencode/..."
	@mkdir -p ~/.config/opencode
	@rsync -a --exclude='opencode.macos.jsonc' --exclude='opencode.linux.jsonc' .opencode/ ~/.config/opencode/
	@echo "✓ OpenCode configuration installed successfully"

claude:
	@echo "Generating OS-specific claude.jsonc..."
	@if [ "$$(uname -s)" = "Darwin" ]; then \
		cp .claude/claude.macos.jsonc .claude/claude.jsonc; \
		echo "✓ Using macOS configuration"; \
	else \
		cp .claude/claude.linux.jsonc .claude/claude.jsonc; \
		echo "✓ Using Linux configuration"; \
	fi
	@echo "Installing to ~/.claude/..."
	@mkdir -p ~/.claude
	@rsync -a --exclude='claude.macos.jsonc' --exclude='claude.linux.jsonc' .claude/ ~/.claude/
	@echo "✓ Claude Code configuration installed successfully"

 openspec:
	@echo "Installing OpenSpec CLI globally..."
	@npm install -g @fission-ai/openspec@latest
	@echo "✓ OpenSpec CLI installed. Run 'openspec --version' to verify."

 clean:
	docker compose down -v
	@echo "All containers stopped and volumes removed."

 status:
	docker compose ps

