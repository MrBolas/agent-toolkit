# OpenClaw - Portable Docker

Run OpenClaw anywhere with Docker. No dependencies, no complex setup.

## Quick Start

### 1. Build the Image

```bash
docker build -t openclaw .
```

### 2. Run Onboarding (First Time Only)

```bash
docker run -it \
  -v openclaw-data:/data/.openclaw \
  -p 18789:18789 \
  -p 18790:18790 \
  openclaw \
  node openclaw.mjs onboard --no-install-daemon
```

**During onboarding:**
- Gateway bind: `lan`
- Auth: `token` (generate one or use `--token your-token`)
- Install daemon: `No`

### 3. Start the Gateway

```bash
docker run -d \
  --name openclaw \
  -v openclaw-data:/data/.openclaw \
  -p 18789:18789 \
  -p 18790:18790 \
  openclaw \
  node openclaw.mjs gateway --bind lan --port 18789
```

### 4. Access

- **Gateway**: http://localhost:18789
- **Token**: Check your config or use the one you set during onboarding

## Daily Use Commands

```bash
# Start gateway
docker start openclaw

# Stop gateway
docker stop openclaw

# View logs
docker logs -f openclaw

# Enter container shell
docker exec -it openclaw /bin/bash

# Run CLI commands
docker exec -it openclaw node openclaw.mjs status
docker exec -it openclaw node openclaw.mjs health

# Remove everything (including data!)
docker rm -f openclaw
docker volume rm openclaw-data
```

## Portable Usage

Copy these 3 files to any machine:
- `Dockerfile`
- `README.md`
- `.dockerignore` (optional)

Then run:
```bash
docker build -t openclaw .
docker run -it -v openclaw-data:/data/.openclaw -p 18789:18789 openclaw node openclaw.mjs onboard --no-install-daemon
docker run -d --name openclaw -v openclaw-data:/data/.openclaw -p 18789:18789 openclaw node openclaw.mjs gateway --bind lan --port 18789
```

## Environment Variables

```bash
# Use specific version
docker build --build-arg OPENCLAW_VERSION=v2025.2.1 -t openclaw .

# Custom token (set during onboarding or via env)
docker run -e OPENCLAW_GATEWAY_TOKEN=your-token ...
```

## Data Persistence

Data is stored in a Docker named volume `openclaw-data`:
- Config: `/data/.openclaw/openclaw.json`
- Workspace: `/data/.openclaw/workspace/`
- Credentials: `/data/.openclaw/credentials/`

The volume persists across container restarts and rebuilds.

## What's Inside

- **Base**: `node:22-bookworm`
- **User**: Runs as `node` (non-root)
- **Data**: Stored in `/data/.openclaw` (Docker volume)
- **Ports**: 18789 (gateway), 18790 (bridge)

## No Host Access

The container **cannot** access your host files. Only the named volume `openclaw-data` is accessible.
