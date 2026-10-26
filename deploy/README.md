# Deploying on a VPS

The plan the section settled on: one small Hetzner Cloud server (the CX23
is plenty now that the site is a plain Next.js app), Docker, Caddy for
TLS, Supabase for the database and auth.

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
4. **Supabase.** Create the production project, run `supabase/schema.sql`
   once in the SQL editor, then in Authentication: custom SMTP with the FER
   relay, the "Confirm signup" and "Reset password" templates containing
   `{{ .Token }}`, Site URL and redirect URLs set to the domain, and a higher
   hourly email limit than the default.
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
Backups: Supabase Pro keeps daily backups; on Free, schedule `pg_dump`
yourself.
