.PHONY: help opencode openspec clean status copaw-up copaw-down copaw-logs copaw-shell copaw-init copaw-clean

.DEFAULT_GOAL := help

help:
	@echo "Available commands:"
	@echo "  make opencode          - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make openspec          - Install OpenSpec CLI globally"
	@echo "  make clean             - Stop containers and remove volumes"
	@echo "  make status            - Show status of all containers"
	@echo ""
	@echo "CoPaw commands:"
	@echo "  make copaw-up          - Start CoPaw container (docker compose up -d)"
	@echo "  make copaw-down        - Stop CoPaw container (docker compose down)"
	@echo "  make copaw-logs        - View CoPaw container logs"
	@echo "  make copaw-shell       - Open shell in CoPaw container"
	@echo "  make copaw-init        - Initialize CoPaw with default config"
	@echo "  make copaw-clean       - Remove CoPaw container and volumes"

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

# =============================================================================
# COPAW COMMANDS
# =============================================================================

copaw-up:
	@echo "Starting CoPaw..."
	@docker compose -f copaw/docker-compose.yml up -d
	@echo "✓ CoPaw started"
	@echo ""
	@echo "Access URLs:"
	@echo "  Local:     http://127.0.0.1:8088"
	@echo "  Network:   http://$$(hostname -I | awk '{print $$1}'):8088"
	@echo ""
	@echo "Configure your local model in the Console:"
	@echo "  Settings → Models → Add OpenAI-compatible provider"
	@echo "  Base URL: http://192.168.1.50:9293/v1"
	@echo "  API Key: random-key"

copaw-down:
	@echo "Stopping CoPaw..."
	@docker compose -f copaw/docker-compose.yml down
	@echo "✓ CoPaw stopped"

copaw-logs:
	@docker logs -f copaw

copaw-shell:
	@docker exec -it copaw /bin/bash

copaw-init:
	@echo "Initializing CoPaw with defaults..."
	@docker exec copaw copaw init --defaults --accept-security
	@echo "✓ CoPaw initialized"

copaw-clean:
	@echo "Removing CoPaw container and volumes..."
	@docker compose -f copaw/docker-compose.yml down -v
	@echo "✓ CoPaw cleaned up"

