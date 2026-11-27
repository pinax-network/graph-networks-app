# Production image for Kubernetes (pinax-network/k8s-pinax-ui, ott-monitor1),
# served at https://graph-networks.pinax.network. .github/workflows/container.yml
# builds it on every push to main, and Flux proposes the new tag in a "Deploy to
# prod" pull request there; merging it deploys.
#
# GRAPH_API_KEY is runtime-only (Kubernetes Secret graph-networks-app-env); never
# pass it as a build arg. The build needs no secret: /api/subgraphs reads the key
# per request.

FROM node:24-alpine AS dependencies
COPY --from=oven/bun:1.4.3-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json bun.lock bunfig.toml .npmrc ./
RUN bun install --frozen-lockfile

FROM node:24-alpine AS builder
COPY --from=oven/bun:1.4.3-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
# NEXT_OUTPUT=standalone switches on the self-contained server (next.config.ts).
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT=standalone
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The docker-build action passes the short commit hash as COMMIT (and VERSION,
# unused here). The full revision is in the image's OCI labels.
ARG COMMIT=unknown
ENV GIT_COMMIT=${COMMIT}

# Standalone output leaves out public/ and .next/static; copy both. .next stays
# writable by `node` for Next.js's caches (the registry and subgraph fetches are
# cached there for 5 minutes, per pod).
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
