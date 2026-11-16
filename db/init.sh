#!/bin/sh
# Runs once, as the Postgres superuser, the first time the container starts
# on an empty volume (the image runs everything in /docker-entrypoint-initdb.d).
#
# The app does not log in as the superuser. It logs in as `matsek`, which
# owns the schema — and so bypasses RLS, the way Supabase's service role did
# — and switches to `anon` or `authenticated` for every request, the two
# roles the schema's grants name. Extensions need a superuser, so they are
# created here before the schema is applied as matsek.
set -eu

: "${APP_DB_PASSWORD:?APP_DB_PASSWORD must be set for the app's database role}"

psql -v ON_ERROR_STOP=1 -v app_password="$APP_DB_PASSWORD" \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
CREATE ROLE matsek LOGIN PASSWORD :'app_password';
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
GRANT anon, authenticated TO matsek;
SELECT format('ALTER DATABASE %I OWNER TO matsek', current_database()) \gexec
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SQL

psql -v ON_ERROR_STOP=1 --username matsek --dbname "$POSTGRES_DB" \
  -f /db/schema.sql
