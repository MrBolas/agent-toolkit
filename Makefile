.PHONY: help opencode openspec clean status \
       openclaw-build openclaw-onboard openclaw-start openclaw-stop \
       openclaw-logs openclaw-shell openclaw-clean

.DEFAULT_GOAL := help

help:
	@echo "Available commands:"
	@echo "  make opencode            - Install OS-specific OpenCode configuration to ~/.config/opencode/"
	@echo "  make openspec            - Install OpenSpec CLI globally"
	@echo "  make clean               - Stop containers and remove volumes"
	@echo "  make status              - Show status of all containers"
	@echo ""
	@echo "OpenClaw:"
	@echo "  make openclaw-build      - Build the OpenClaw Docker image"
	@echo "  make openclaw-onboard    - Run the onboarding wizard (first time)"
	@echo "  make openclaw-start      - Start the OpenClaw gateway"
	@echo "  make openclaw-stop       - Stop the OpenClaw gateway"
	@echo "  make openclaw-logs       - View gateway logs"
	@echo "  make openclaw-shell      - Enter the container shell"
	@echo "  make openclaw-clean      - Remove container and volumes"

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

# OpenClaw targets
OPENCLAW_IMAGE := openclaw
OPENCLAW_CONTAINER := openclaw
OPENCLAW_VOLUME := openclaw-data

openclaw-build:
	docker build -t $(OPENCLAW_IMAGE) ./openclaw

openclaw-onboard:
	docker run -it \
		-v $(OPENCLAW_VOLUME):/home/node/.openclaw \
		-p 18789:18789 \
		-p 18790:18790 \
		$(OPENCLAW_IMAGE) \
		node openclaw.mjs onboard --no-install-daemon

openclaw-start:
	docker run -d \
		--name $(OPENCLAW_CONTAINER) \
		-v $(OPENCLAW_VOLUME):/home/node/.openclaw \
		-p 18789:18789 \
		-p 18790:18790 \
		--restart unless-stopped \
		$(OPENCLAW_IMAGE)
	@echo ""
	@echo "OpenClaw running at http://localhost:18789"

openclaw-stop:
	docker stop $(OPENCLAW_CONTAINER)
	docker rm $(OPENCLAW_CONTAINER)

openclaw-logs:
	docker logs -f $(OPENCLAW_CONTAINER)

openclaw-shell:
	docker exec -it $(OPENCLAW_CONTAINER) /bin/bash

openclaw-clean:
	-docker rm -f $(OPENCLAW_CONTAINER)
	-docker volume rm $(OPENCLAW_VOLUME)
	@echo "Container and volume removed."

