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
# No build arguments: nothing deployment-specific is compiled in. The
# database, S3, SMTP and APP_URL all reach the container as environment
# variables from whatever runs it, so one image serves every deployment.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
# Activity times are stored as instants and formatted where they are
# rendered. A container runs in UTC unless told otherwise, so every time on
# a server-rendered page — the activity page, the admin queue, the note an
# admin gets about a moved activity — would read an hour or two early for an
# audience that is in Zagreb, and disagree with the same time rendered in
# the browser.
ENV TZ=Europe/Zagreb
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
