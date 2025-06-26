# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# --- Build Stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (with cache and bind mounts for deterministic builds)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the app source
COPY --link . .

# Build the React app
RUN npm run build

# --- Production Stage ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Security: create non-root user
RUN addgroup --system appuser && adduser --system --ingroup appuser appuser

# Copy built app and only production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
