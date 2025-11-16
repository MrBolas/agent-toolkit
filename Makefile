.PHONY: opencode chromadb viewdb stop clean

opencode:
	mkdir -p ~/.config/opencode
	rsync -a --ignore-existing .opencode/ ~/.config/opencode/

chromadb:
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
