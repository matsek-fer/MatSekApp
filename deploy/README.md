# Deploying on a VPS

The plan the section settled on: one small Hetzner Cloud server (the CX23
is plenty now that the site is a plain Next.js app), Docker, Caddy for
TLS. The database (PostgreSQL), the file bucket (S3) and mail (SMTP) are
reached through environment variables, wherever they run.

1. **Server.** Ubuntu 24.04, your SSH key, `apt install git docker.io
   docker-compose-v2`, a user in the `docker` group (log in again after
   adding it — the group is read at login), then the firewall, port 22
   first so enabling it cannot lock you out:
   `ufw allow 22/tcp && ufw allow 80,443/tcp && ufw allow 443/udp && ufw enable`.
   Docker publishes its ports past ufw on its own, so the rules protect
   whatever else listens on the box, not the site.
2. **Checkout.** `git clone https://github.com/matsek-fer/MatSekApp.git && cd
   MatSekApp`, on the branch to deploy. Everything below runs from there.
3. **DNS.** An A record for the domain pointing at the server's IPv4 (and
   AAAA for IPv6). Caddy needs the name to resolve before it can get a
   certificate.
4. **Postgres, S3 and SMTP.** None of them runs in this compose file; the
   app reaches each through its environment variables.
   - **Postgres 15+**, managed or your own. Create the roles and apply
     `db/schema.sql` once, as the header of that file lists (a fresh
     `postgres` container with `db/init.sh` mounted into
     `/docker-entrypoint-initdb.d/` does both).
   - **An S3-compatible bucket** for files attached to activities. The app
     creates it on first upload if its keys are allowed to.
   - **SMTP**, the FER relay. The app sends the signup and password-reset
     codes itself, so registration does not work until mail does.
5. **Environment.** `cp .env.local.example deploy/.env` on the server and
   fill it in; add `DOMAIN=matsek.example.hr`. The file stays on the server
   and nowhere else. It is read by docker compose, whose parser is stricter
   than Next's: a value is either unquoted or quoted as a whole
   (`SMTP_FROM="Name <addr>"`, never `"Name" <addr>`), and a `$` inside a
   value must be single-quoted or doubled.
6. **Run.** `docker compose --env-file deploy/.env up -d --build`. The app
   refuses to start if a variable is missing or still a placeholder and
   says which — in `docker compose logs app`; `up` itself then stops with
   "dependency failed to start", because Caddy waits for the app's health
   check. `docker compose ps` shows both containers once it is up.
7. **Check.** Register with a `@fer.hr` address, confirm the code arrives,
   propose and approve an activity, confirm both emails. Promote the first
   admin as section 8 of the schema describes.

Updating: `git pull && docker compose --env-file deploy/.env up -d --build`.
Backups: schedule `pg_dump` of the database and a copy of the bucket, or
rely on the managed services' own.

The same image runs anywhere: `ghcr.io/matsek-fer/matsekapp` is built by
`.github/workflows/docker.yml` with no configuration in it, so a Kubernetes
Deployment (or `docker run --env-file`) only has to supply the variables
from `.env.local.example`.
