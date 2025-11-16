---
name: chromadb
description: Provides semantic memory storage and retrieval using ChromaDB vector database for repository knowledge management
license: MIT
metadata:
  version: "1.0.0"
  author: "agent-toolkit"
---

# ChromaDB Memory Skill

This skill provides semantic memory storage and retrieval capabilities using ChromaDB.

## Prerequisites

- ChromaDB server running at http://localhost:8000
- Start with: `docker compose up -d chromadb` or `make chromadb`

## Available Operations

Use the helper script in this skill directory to interact with ChromaDB:

```bash
# List all collections
node <skill-base-dir>/index.js collections

# Create a collection
node <skill-base-dir>/index.js create-collection <name> [description]

# Add a document (memory)
node <skill-base-dir>/index.js add <collection> <id> <content> [metadata-json]

# Search for similar documents
node <skill-base-dir>/index.js search <collection> <query> [n-results] [metadata-filter-json]

# Update a document
node <skill-base-dir>/index.js update <collection> <id> <content> [metadata-json]

# Delete a document
node <skill-base-dir>/index.js delete <collection> <id>

# List all documents in a collection
node <skill-base-dir>/index.js list <collection> [limit]

# Get collection stats
node <skill-base-dir>/index.js stats <collection>

# Delete a collection
node <skill-base-dir>/index.js delete-collection <collection>
```

## Document Structure

Documents should follow this structure:
- **id**: Unique identifier (e.g., "authentication-system", "docker-setup")
- **content**: The summary/description text
- **metadata**: JSON object with:
  - `area_name`: Descriptive name
  - `file_paths`: Comma-separated list of files
  - `commit_hash`: Git commit hash
  - `section_type`: system, feature, interface, architecture, config, documentation
  - `importance`: Score 1-10
  - `dependencies`: Related areas

## Example Usage

```bash
# Add a memory about authentication system
node <skill-base-dir>/index.js add "my-project" "auth-system" \
  "JWT-based authentication with login, logout, and token refresh" \
  '{"area_name":"authentication","file_paths":"auth/login.js,auth/tokens.js","section_type":"system","importance":10}'

# Search for authentication-related code
node <skill-base-dir>/index.js search "my-project" "how does authentication work" 5

# List all memories in a project
node <skill-base-dir>/index.js list "my-project" 20
```

## Error Handling

All commands output JSON. Errors are returned as:
```json
{"error": "Error message here"}
```

Success responses vary by operation but always include a `success` field or the requested data.

## Logging

All operations are logged to `.opencode/logs/chromadb.log` (project-local) for debugging and audit purposes.
