# OpenClaw - Portable Docker

Portable, self-contained Docker setup for [OpenClaw](https://github.com/openclaw/openclaw).

Based on the [official Docker guide](https://docs.openclaw.ai/install/docker). The only difference is that this Dockerfile clones from GitHub instead of requiring a local checkout — making it portable to any machine with Docker.

## Quick Start

### 1. Build

```bash
docker build -t openclaw .
```

### 2. Onboard (First Time Only)

```bash
docker run -it \
  -v openclaw-data:/home/node/.openclaw \
  -p 18789:18789 \
  -p 18790:18790 \
  openclaw \
  node openclaw.mjs onboard --no-install-daemon
```

### 3. Start the Gateway

```bash
docker run -d \
  --name openclaw \
  -v openclaw-data:/home/node/.openclaw \
  -p 18789:18789 \
  -p 18790:18790 \
  --restart unless-stopped \
  openclaw
```

### 4. Open the Dashboard

http://localhost:18789

## Daily Commands

```bash
docker start openclaw                       # Start
docker stop openclaw                        # Stop
docker logs -f openclaw                     # Logs
docker exec -it openclaw /bin/bash          # Shell
docker exec openclaw node openclaw.mjs health  # Health check
```

## Channel Setup

```bash
# WhatsApp (QR code)
docker run -it -v openclaw-data:/home/node/.openclaw openclaw node openclaw.mjs channels login

# Telegram
docker run -it -v openclaw-data:/home/node/.openclaw openclaw node openclaw.mjs channels add --channel telegram --token "<token>"

# Discord
docker run -it -v openclaw-data:/home/node/.openclaw openclaw node openclaw.mjs channels add --channel discord --token "<token>"
```

## Build Options

```bash
# Pin to a specific version
docker build --build-arg OPENCLAW_VERSION=v2025.2.1 -t openclaw .

# Install extra system packages
docker build --build-arg OPENCLAW_DOCKER_APT_PACKAGES="ffmpeg build-essential" -t openclaw .
```

## Environment Variables

Pass API keys and tokens via `-e`:

```bash
docker run -d \
  --name openclaw \
  -v openclaw-data:/home/node/.openclaw \
  -p 18789:18789 \
  -e OPENCLAW_GATEWAY_TOKEN=your-token \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  openclaw
```

See the [.env.example](https://github.com/openclaw/openclaw/blob/main/.env.example) for all available variables.

## Data Persistence

All data lives in the `openclaw-data` Docker volume:

```
/home/node/.openclaw/
├── openclaw.json        # Configuration
├── workspace/           # Agent workspace + skills
├── credentials/         # Channel credentials
└── agents/              # Agent sessions
```

```bash
# Backup
docker run --rm -v openclaw-data:/data -v $(pwd):/backup alpine tar czf /backup/openclaw-backup.tar.gz -C /data .

# Restore
docker run --rm -v openclaw-data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/openclaw-backup.tar.gz"

# Reset (removes all data!)
docker rm -f openclaw && docker volume rm openclaw-data
```

## Portable Usage

Copy this folder to any machine with Docker:

```bash
scp -r openclaw/ user@remote-machine:~/openclaw/
ssh user@remote-machine
cd openclaw
docker build -t openclaw .
docker run -it -v openclaw-data:/home/node/.openclaw -p 18789:18789 openclaw node openclaw.mjs onboard --no-install-daemon
docker run -d --name openclaw -v openclaw-data:/home/node/.openclaw -p 18789:18789 --restart unless-stopped openclaw
```

## References

- [OpenClaw Docs](https://docs.openclaw.ai)
- [Official Docker Guide](https://docs.openclaw.ai/install/docker)
- [Getting Started](https://docs.openclaw.ai/start/getting-started)
- [Configuration Reference](https://docs.openclaw.ai/gateway/configuration)
