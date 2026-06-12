# syntax=docker/dockerfile:1

# ---- Build stage ---------------------------------------------------------
# Pin bun to the version that wrote bun.lockb so the frozen install matches.
FROM oven/bun:1.3.14-slim AS build
WORKDIR /app

# Install dependencies first (cached layer). --ignore-scripts skips the
# `nuxt prepare` postinstall, which would run before the source is copied;
# `bun run build` runs prepare itself.
COPY package.json bun.lockb bunfig.toml ./
RUN bun install --frozen-lockfile --ignore-scripts

# Build the Nuxt app targeting a standalone Node server (.output/server).
COPY . .
ENV NITRO_PRESET=node-server
RUN bun run build

# ---- Runtime stage -------------------------------------------------------
# Distroless: no shell/package manager, glibc-based, runs as non-root `nonroot`.
# Nitro bundles its own minimal node_modules into .output, so that's all we ship.
FROM gcr.io/distroless/nodejs22-debian12 AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000
USER nonroot
CMD ["/app/.output/server/index.mjs"]
