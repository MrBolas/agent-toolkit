# OpenClaw - Portable Docker Setup
# https://github.com/openclaw/openclaw

FROM node:22-bookworm

# Install build dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Enable pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Clone OpenClaw
ARG OPENCLAW_VERSION=main
RUN git clone --depth 1 --branch ${OPENCLAW_VERSION} https://github.com/openclaw/openclaw.git .

# Install and build
RUN pnpm install --frozen-lockfile && \
    pnpm build && \
    OPENCLAW_PREFER_PNPM=1 pnpm ui:build

# Create data directory
RUN mkdir -p /data/.openclaw/workspace && \
    chown -R node:node /data

# Set production environment
ENV NODE_ENV=production
ENV HOME=/data

# Switch to non-root user
USER node

# Expose ports
EXPOSE 18789 18790

# Default command: show help
CMD ["node", "openclaw.mjs", "--help"]
