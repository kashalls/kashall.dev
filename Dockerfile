# syntax=docker/dockerfile:1

# ---- Build stage ---------------------------------------------------------
# Pin bun to the version that wrote bun.lock so the frozen install matches.
FROM oven/bun:1.4.3-slim AS build
# Nuxt Content's build uses node:sqlite, which Bun doesn't implement. With node
# on PATH, `bun run build` runs the nuxt CLI (a node shebang) under Node 26,
# matching the runtime image. Node 26 links libatomic, which bun's image lacks.
RUN apt-get update \
 && apt-get install -y --no-install-recommends libatomic1 \
 && rm -rf /var/lib/apt/lists/*
COPY --from=node:26-slim /usr/local/bin/node /usr/local/bin/node
WORKDIR /app

# Install dependencies first (cached layer). --ignore-scripts skips the
# `nuxt prepare` postinstall, which would run before the source is copied;
# `bun run build` runs prepare itself.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

# Build the Nuxt app targeting a standalone Node server (.output/server).
COPY . .
ENV NITRO_PRESET=node-server
RUN bun run build

# ---- Runtime stage -------------------------------------------------------
# Distroless: no shell/package manager, glibc-based, runs as non-root `nonroot`.
# Nitro bundles its own minimal node_modules into .output, so that's all we ship.
FROM gcr.io/distroless/nodejs26-debian13 AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000
USER nonroot
CMD ["/app/.output/server/index.mjs"]
