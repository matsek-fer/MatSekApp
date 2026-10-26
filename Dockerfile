# syntax=docker/dockerfile:1
#
# The site as one container: a Node process serving Next's standalone
# build behind the reverse proxy in docker-compose.yml. Debian, not Alpine,
# so sharp's prebuilt binary loads without a musl build.

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# The two public values are inlined into the browser bundle at build time,
# so they must be present here; the secrets are read at runtime only.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system app && useradd --system --gid app --home /app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# The materials are read from disk at request time, by path, which the
# standalone trace cannot see; they are copied in whole.
COPY --from=build --chown=app:app /app/content ./content
USER app
EXPOSE 3000
CMD ["node", "server.js"]
