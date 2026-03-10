.PHONY: help opencode openspec clean status zeroclaw zeroclaw-down zeroclaw-logs moltis moltis-down moltis-logs

 .DEFAULT_GOAL := help

 help:
	@echo "Available commands:"
	@echo "  make opencode          - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make openspec          - Install OpenSpec CLI globally"
	@echo "  make clean             - Stop containers and remove volumes"
	@echo "  make status            - Show status of all containers"
	@echo "  make zeroclaw          - Build and start ZeroClaw container"
	@echo "  make zeroclaw-down     - Stop ZeroClaw container"
	@echo "  make zeroclaw-logs     - Tail ZeroClaw container logs"
	@echo "  make moltis            - Start Moltis AI gateway container"
	@echo "  make moltis-down       - Stop Moltis container"
	@echo "  make moltis-logs       - Tail Moltis container logs"

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

 zeroclaw:
	docker compose -f zeroclaw/docker-compose.yml up -d --build

 zeroclaw-down:
	docker compose -f zeroclaw/docker-compose.yml down

 zeroclaw-logs:
	docker compose -f zeroclaw/docker-compose.yml logs -f

 moltis:
	@test -f moltis/.env || (cp moltis/.env.example moltis/.env && echo "✓ Created moltis/.env from example — edit it to add your API keys")
	@mkdir -p moltis/data
	docker compose -f moltis/docker-compose.yml up -d

 moltis-down:
	docker compose -f moltis/docker-compose.yml down

 moltis-logs:
	docker compose -f moltis/docker-compose.yml logs -f

