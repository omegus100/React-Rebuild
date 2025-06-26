# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies with cache and bind mounts for deterministic builds
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --production

# Copy application source code (excluding node_modules and sensitive files)
COPY --link . .

# Create a non-root user for security
RUN groupadd -r appuser && useradd -m -r -g appuser appuser \
    && mkdir -p /app/uploads \
    && chown -R appuser:appuser /app

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 5000

CMD ["npm", "start"]
