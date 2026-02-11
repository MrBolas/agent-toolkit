.PHONY: help opencode openspec clean status openclaw

.DEFAULT_GOAL := help

help:
	@echo "Available commands:"
	@echo "  make opencode          - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make openspec          - Install OpenSpec CLI globally"
	@echo "  make clean             - Stop containers and remove volumes"
	@echo "  make status            - Show status of all containers"
	@echo ""
	@echo "OpenClaw (Portable Docker):"
	@echo "  make openclaw          - Show OpenClaw usage instructions"

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

 openspec:
	@echo "Installing OpenSpec CLI globally..."
	@npm install -g @fission-ai/openspec@latest
	@echo "✓ OpenSpec CLI installed. Run 'openspec --version' to verify."

 clean:
	docker compose down -v
	@echo "All containers stopped and volumes removed."

 status:
	docker compose ps

# OpenClaw - Portable Docker (manual commands)
openclaw:
	@echo "OpenClaw Portable Docker Setup"
	@echo "=============================="
	@echo ""
	@echo "Files: openclaw/Dockerfile, openclaw/README.md"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. Build:        docker build -t openclaw ./openclaw"
	@echo "  2. Onboard:      docker run -it -v openclaw-data:/data/.openclaw -p 18789:18789 openclaw node openclaw.mjs onboard --no-install-daemon"
	@echo "  3. Start:        docker run -d --name openclaw -v openclaw-data:/data/.openclaw -p 18789:18789 openclaw node openclaw.mjs gateway --bind lan --port 18789"
	@echo ""
	@echo "See openclaw/README.md for full details."

