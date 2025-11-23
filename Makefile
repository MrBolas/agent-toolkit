.PHONY: help opencode openspec up viewdb stop clean clean-mcp status

.DEFAULT_GOAL := help

help:
	@echo "Available commands:"
	@echo "  make opencode          - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make openspec          - Install OpenSpec CLI globally"
	@echo "  make up                - Start ChromaDB and ChromaDB Admin UI containers"
	@echo "  make viewdb            - Show URLs for accessing ChromaDB"
	@echo "  make status            - Show status of all ChromaDB and MCP containers"
	@echo "  make stop              - Stop all containers"
	@echo "  make clean             - Stop containers and remove volumes"
	@echo "  make clean-mcp         - Clean up orphaned chroma-mcp containers"

opencode:
	mkdir -p ~/.config/opencode
	@if [ "$$(uname -s)" = "Darwin" ]; then \
		cp .opencode/opencode.macos.jsonc ~/.config/opencode/opencode.jsonc; \
	else \
		cp .opencode/opencode.linux.jsonc ~/.config/opencode/opencode.jsonc; \
	fi
	rsync -a --ignore-existing .opencode/ ~/.config/opencode/

openspec:
	@echo "Installing OpenSpec CLI globally..."
	@npm install -g @fission-ai/openspec@latest
	@echo "✓ OpenSpec CLI installed. Run 'openspec --version' to verify."

up:
	docker compose up -d

viewdb:
	@echo "ChromaDB API/docs available at: http://localhost:8420/docs"
	@echo "ChromaDB Admin UI available at: http://localhost:3001"
	@echo "Connect to http://chromadb:8000 in the admin UI setup."
	@echo "Open these URLs in your browser to view and interact with the database."

stop:
	docker compose down

clean:
	docker compose down -v
	@echo "All containers stopped and volumes removed."

clean-mcp:
	@echo "Cleaning up chroma-mcp containers..."
	@docker ps -q --filter ancestor=ghcr.io/chroma-core/chroma-mcp:latest | xargs -r docker stop || true
	@docker ps -aq --filter ancestor=ghcr.io/chroma-core/chroma-mcp:latest | xargs -r docker rm || true
	@echo "✓ All chroma-mcp containers stopped and removed."
