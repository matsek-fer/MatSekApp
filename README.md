# MatSekApp

Organizacija termina i ostalo — aplikacija Matematičke sekcije FER.

Next.js 15 (App Router) · Tailwind · PostgreSQL (RLS) · S3 · Nodemailer.
Arhitektura je opisana u [ARCHITECTURE.md](./ARCHITECTURE.md).

## Setup

```bash
npm install
cp .env.local.example .env.local     # then fill in the values
git config core.hooksPath .githooks  # enables the secret-scanning pre-commit hook
npm run dev
```

It needs three services, all reached through `.env.local`:

- **PostgreSQL 15+.** Create the roles and apply `db/schema.sql` as its header
  describes (or mount `db/init.sh` into a fresh `postgres` container, which
  does both). The schema holds the tables, the RLS policies, the `@fer.hr`
  domain lock, and the users, sessions and sign-in codes.
- **An S3-compatible store** for files attached to activities (SeaweedFS,
  MinIO, Garage, R2, AWS). The bucket is created on first upload.
- **SMTP.** The app mails signup and password-reset codes itself, so nobody
  can register without it. Port 465 is implicit TLS; any other port must
  offer STARTTLS.

Promote yourself to admin once registered:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'ime.prezime@fer.hr';
```

## Secrets

| Variable | Secret? | Why |
|---|---|---|
| `DATABASE_URL` | **Yes** | Logs in as the role that owns the schema and bypasses RLS |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | **Yes** | Read/write on every attached file |
| `SMTP_PASS` | **Yes** | Mail server credentials |
| `APP_URL` | No | The public address; used in e-mail links and metadata |

Nothing is `NEXT_PUBLIC_`: every value is read by the server at run time, so
neither the build nor the image carries any configuration. Keep it that way —
anything with that prefix is compiled into JavaScript that ships to every
visitor.

**Never commit `.env.local` or a build directory.** Both are gitignored, and
`.githooks/pre-commit` blocks them plus any database URL with a password,
Supabase key or private key found in staged content. Enable it once per clone
with the `git config` line above.

For deployment, give the variables to whatever runs the container
(`deploy/.env` for the compose file, a Secret for Kubernetes), never to the
repository or the build.

If a secret is ever exposed, change it where it is used (`ALTER ROLE matsek
PASSWORD …` for the database) — removing the commit is not enough, since
anyone may already have copied it.

## Deploy

The production build is a self-contained Node server (`output: "standalone"`
in `next.config.js`) packaged by the `Dockerfile`; `docker-compose.yml` runs it
behind Caddy, which obtains and renews the TLS certificate. The step-by-step
server setup is in [deploy/README.md](./deploy/README.md).

The server refuses to start (see `src/instrumentation.ts`) unless every
variable below is set and `APP_URL` is an `https://` address, so a
half-configured deployment fails loudly at boot rather than with a broken
e-mail link a week later.

| Variable | Where it comes from |
|---|---|
| `DATABASE_URL` | `postgres://matsek:…@host:5432/matsek` (**secret**) |
| `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | The S3 store (keys are **secret**); `S3_ENDPOINT` and `S3_REGION` as it needs |
| `APP_URL` | The public address, e.g. `https://matsek.example.hr` — used in e-mail links and metadata |
| `SMTP_HOST`, `SMTP_PORT` | The mail provider; port 465 is implicit TLS, anything else must offer STARTTLS |
| `SMTP_USER`, `SMTP_PASS` | Mail credentials (`SMTP_PASS` is **secret**) |
| `SMTP_FROM` | The sender address, e.g. `MatSek <noreply@example.hr>` |

The schema is applied once, to an empty database: `db/init.sh` does it for
a fresh `postgres` container, and the header of `db/schema.sql` lists the
steps by hand. There is no migration tool yet; a later schema change is
applied with `psql` and noted in that file.

`.github/workflows/docker.yml` builds the image on every pull request and
pushes it to `ghcr.io/matsek-fer/matsekapp` from `main` and `v*` tags. The
build takes no arguments and no configuration, so the published image is the
same for every deployment; Kubernetes, compose or `docker run --env-file`
supply the variables above when they start it.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
