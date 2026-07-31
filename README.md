# MatSekApp

Organizacija termina i ostalo — aplikacija Matematičke sekcije FER.

Next.js 14 (App Router) · Tailwind · Supabase (PostgreSQL + Auth + RLS) · Nodemailer.
Arhitektura je opisana u [ARCHITECTURE.md](./ARCHITECTURE.md).

## Setup

```bash
npm install
cp .env.local.example .env.local     # then fill in the values
git config core.hooksPath .githooks  # enables the secret-scanning pre-commit hook
npm run dev
```

Create a Supabase project, run `supabase/schema.sql` in the SQL Editor (it
creates the tables, RLS policies and the `@fer.hr` domain-lock trigger), then
copy the URL and keys from **Project Settings → API** into `.env.local`.

Promote yourself to admin once registered:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'ime.prezime@fer.hr';
```

## Secrets

Two kinds of value live in `.env.local`, and they need different care:

| Variable | Secret? | Why |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Inlined into the browser bundle |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Public by design; RLS is what protects the data |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Bypasses RLS entirely — full access to every table |
| `SMTP_PASS` | **Yes** | Mail server credentials |

Anything prefixed `NEXT_PUBLIC_` is compiled into JavaScript that ships to every
visitor. Never put a secret behind that prefix.

**Never commit `.env.local` or a build directory.** `.next/` contains every
`NEXT_PUBLIC_*` value baked into the JS chunks — committing it leaks them even
though `.env.local` itself was never staged. Both are gitignored, and
`.githooks/pre-commit` blocks them plus any Supabase key or private key found in
staged content. Enable it once per clone with the `git config` line above.

For deployment, set the variables in the host's dashboard (Vercel → Settings →
Environment Variables), not in the repository.

If a secret is ever exposed, rotate it in the Supabase dashboard — removing the
commit is not enough, since anyone may already have copied it.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
