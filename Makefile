.PHONY: opencode up viewdb stop clean memory-collections memory-stats memory-list

opencode:
	mkdir -p ~/.config/opencode
	rsync -a --ignore-existing .opencode/ ~/.config/opencode/
	@echo "Installing ChromaDB skill dependencies..."
	cd ~/.config/opencode && npm install
	@echo "OpenCode configuration installed successfully!"

up:
	docker compose up -d

viewdb:
	@echo "ChromaDB API/docs available at: http://localhost:8000/docs"
	@echo "ChromaDB Admin UI available at: http://localhost:3000"
	@echo "Open these URLs in your browser to view and interact with the database."

stop:
	docker compose down

clean:
	docker compose down -v
	@echo "All containers stopped and volumes removed."

memory-collections:
	@cd .opencode && node skills/chromadb.js collections

memory-stats:
	@echo "Usage: make memory-stats COLLECTION=<name>"
	@if [ -z "$(COLLECTION)" ]; then \
		echo "Example: make memory-stats COLLECTION=repo_memory"; \
		exit 1; \
	fi
	@cd .opencode && node skills/chromadb.js stats $(COLLECTION)

memory-list:
	@echo "Usage: make memory-list COLLECTION=<name>"
	@if [ -z "$(COLLECTION)" ]; then \
		echo "Example: make memory-list COLLECTION=repo_memory"; \
		exit 1; \
	fi
	@cd .opencode && node skills/chromadb.js list $(COLLECTION)
