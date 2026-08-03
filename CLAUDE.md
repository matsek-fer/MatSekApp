# MatSekApp

Termin organisation for the Mathematics Section (Matematička sekcija) at FER.
Members propose activities, an admin approves or denies them, and approved ones
appear on a public calendar. Everything users see is in Croatian.

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres + Auth +
RLS) · Nodemailer.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run seed` | Fill `activities` with calendar test data |
| `npm run seed:clean` | Remove the seeded rows |

There is no test suite. Verify changes by running the app.

## Where things live

```
src/
├── middleware.ts              Session guard for protected routes
├── app/
│   ├── (auth)/                login, register, verify, forgot/reset-password
│   ├── (dashboard)/           calendar, activities, admin, notifications, profile
│   ├── api/                   Route handlers (auth, activities, notifications)
│   ├── page.tsx               Landing — the ASCII tree
│   └── globals.css            Design tokens. Start here for anything visual.
├── components/
│   ├── ui/                    Button, Card, Badge, Field, Alert, Logo, ThemeToggle
│   ├── activities/            ActivityBrowser, ActivityListItem, ActivityTimeline
│   ├── layout/                VoronoiNavbarLink
│   ├── landing/               ContentPanel
│   └── notifications/         NotificationBell
├── lib/
│   ├── ascii-tree.ts          Procedural tree generator (the largest file here)
│   ├── supabase/              server.ts (RLS + admin) · client.ts (browser)
│   ├── validation.ts          Domain lock, enum guards, writable-field whitelist
│   ├── theme.ts               Dark mode, applied before first paint
│   └── email.ts               Nodemailer transport + Croatian HTML templates
└── types/index.ts             Row types, payloads, ApiResponse, Croatian labels
```

`src/components/calendar/`, `src/components/admin/`, `src/app/(public)/` and
`src/utils/` exist but are empty — leftover scaffolding, not homes for new code.

Two files carry most of the difficulty and both open with a comment explaining
their model: `src/lib/ascii-tree.ts` (deterministic PRNG, step-by-step growth
under gravity; `docs/ascii-tree.md` is the full write-up) and
`src/components/activities/ActivityTimeline.tsx` (a zoomable event strip whose
selection band tracks the cursor rather than snapping to calendar boundaries).
Read those headers before changing either.

## Conventions

**Colour goes through tokens.** Every colour is declared once in
`src/app/globals.css` as space-separated RGB channels, and surfaced through
Tailwind as semantic names — `bg-surface`, `text-fg-muted`, `border-border`,
`bg-danger-bg`. Components never write a raw hex or a stock Tailwind colour like
`gray-200`; both themes then follow from that one file. Dark mode is a `.dark`
class on `<html>`, set by a blocking inline script so the page never paints
light and flips.

**UI copy is Croatian, code is English.** Identifiers, comments and commit
messages in English; anything a user reads — labels, errors, emails — in
Croatian. Enum labels live in `ACTIVITY_TYPE_LABELS` /
`ACTIVITY_STATUS_LABELS` in `src/types/index.ts`. Dates use `date-fns` with the
`hr` locale.

**API routes return `ApiResponse<T>`** — `{ success, data?, error? }` — with
conventional status codes (400 validation, 401 unauthenticated, 403 wrong role,
404, 500). The `error` string is shown to the user, so write it in Croatian.

**Two Supabase clients, deliberately.** `createClient()` from
`lib/supabase/server` uses the anon key plus the session cookie and is subject
to RLS — that is the default everywhere. `createAdminClient()` uses the
service-role key and bypasses RLS entirely; it exists only so the approve and
deny routes can insert a notification for another user. Don't reach for it to
make a query easier.

**Never trust a request body's shape.** Client input is filtered through
`pickActivityFields()` so server-owned columns (`status`, `reviewed_by`,
`admin_comment`, …) can't be written, and any value interpolated into a
PostgREST filter is checked against its enum first (`isActivityStatus`). Zod is
in the dependencies but unused; the hand-written guards in `lib/validation.ts`
are the current pattern.

**Server Components by default.** Pages fetch with the server client directly.
`"use client"` is for forms, and for anything with pointer interaction or
animation.

**Comments explain why, not what.** The existing ones give the reason a thing is
the way it is — why the theme script blocks, why a status is validated before
interpolation, why the pre-commit hook exists. Match that; skip comments that
restate the line below them.

## Commits

Conventional-commit subject, lowercase after the prefix, scoped to the area
(`feat(calendar):`, `fix(trees):`). The subject says what changed in plain
words: *"stop the vrba rationing its curtain to the first limbs it grows"*.

Bodies are prose paragraphs, never bullet lists, and they carry evidence —
measured pixel positions, the reasoning behind a constant, what was wrong before
and why the fix holds. Look at `git log` before writing one; the style is
consistent and unusual.

## Secrets

`SUPABASE_SERVICE_ROLE_KEY` and `SMTP_PASS` are real secrets. Anything prefixed
`NEXT_PUBLIC_` is compiled into the browser bundle — never put a secret behind
it. `.env.local` and `.next/` are gitignored and also blocked by
`.githooks/pre-commit`, which exists because a build directory was once
committed with the keys baked into its JS chunks. Enable the hook once per
clone: `git config core.hooksPath .githooks`.

## A note on ARCHITECTURE.md

`ARCHITECTURE.md` is the original June 2026 plan and is the best reference for
the database schema, RLS policies and the approve/deny flow — those are still
accurate. Its directory tree and roadmap have drifted: password reset, the
design-token system, the ASCII tree landing page and the timeline all arrived
after it was written, and some files it lists (`hooks/index.ts`,
`lib/supabase/index.ts`) don't exist. Trust the code over that document where
they disagree.
