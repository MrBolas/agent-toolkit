# OpenClaw - Portable Self-Contained Docker
# Based on the official Dockerfile: https://github.com/openclaw/openclaw/blob/main/Dockerfile
# Difference: clones from GitHub instead of requiring a local checkout.

FROM node:22-bookworm

# Install Bun (required for build scripts)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

RUN corepack enable

WORKDIR /app

# Clone OpenClaw from GitHub
ARG OPENCLAW_VERSION=main
RUN git clone --depth 1 --branch ${OPENCLAW_VERSION} https://github.com/openclaw/openclaw.git .

# Optional: install extra apt packages (e.g. ffmpeg, build-essential)
ARG OPENCLAW_DOCKER_APT_PACKAGES=""
RUN if [ -n "$OPENCLAW_DOCKER_APT_PACKAGES" ]; then \
      apt-get update && \
      DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends $OPENCLAW_DOCKER_APT_PACKAGES && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*; \
    fi

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Force pnpm for UI build (Bun may fail on ARM/Synology architectures)
ENV OPENCLAW_PREFER_PNPM=1
RUN pnpm ui:build

ENV NODE_ENV=production

# Allow non-root user to write temp files during runtime/tests
RUN chown -R node:node /app

# Security hardening: run as non-root user (uid 1000)
USER node

# Gateway + Bridge ports
EXPOSE 18789 18790

# Start gateway server
# --allow-unconfigured: allows first-time startup without config
# --bind lan: allows connections from outside the container
CMD ["node", "openclaw.mjs", "gateway", "--allow-unconfigured", "--bind", "lan"]
