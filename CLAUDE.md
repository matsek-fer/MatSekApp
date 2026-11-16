# MatSekApp

Termin organisation for the Mathematics Section (Matematička sekcija) at FER.
Members propose activities, an admin approves or denies them, and approved ones
appear on a public calendar. Everything users see is in Croatian.

Next.js 15 (App Router) · TypeScript · Tailwind · PostgreSQL (RLS, via
postgres.js) · S3 for attached files · Nodemailer.

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
│   ├── activities/            ActivityBrowser, ActivityListItem, ActivityTimeline,
│   │                          ActivityForm (propose and edit) + ActivityMaterialsEditor,
│   │                          ActivityMaterialsList, ReservationIndicator
│   ├── layout/                VoronoiNavbarLink
│   ├── landing/               ContentPanel
│   └── notifications/         NotificationBell
├── lib/
│   ├── ascii-tree.ts          Procedural tree generator (the largest file here)
│   ├── db/                    withUser() (RLS) · asService() (owner) · loadActivity
│   ├── auth/                  Sessions, scrypt passwords, e-mailed codes
│   ├── storage.ts             S3 bucket for activity files
│   ├── validation.ts          Domain lock, enum guards, writable-field whitelist
│   ├── activity-materials.ts  Signed download URLs for uploaded activity materials
│   ├── activity-edits.ts      What an edit of an approved activity changed, and the note it leaves the admins
│   ├── materials.ts           Loader for content/materials (topics, connections, library index)
│   ├── library.ts             The MatSek library site's address and its search index, for the form
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

**Two ways into the database, deliberately.** `withUser(userId, tx => …)`
from `lib/db` runs one transaction as `authenticated` (or `anon` for a
visitor) with `app.user_id` set, so every RLS policy and column grant in
`db/schema.sql` applies — the same two roles Supabase had, under the same
names, and `auth.uid()` reads that setting. That is the default everywhere.
`asService(tx => …)` runs as the owning role and bypasses RLS entirely; it
exists for the auth internals (the `auth.*` tables, which neither request
role may touch) and to leave a notification with somebody else, which no
member may do: the approve and deny routes, after their own admin check,
notify the proposer (and read their e-mail for the decision mail — members
cannot read each other's), and `lib/activity-edits` notifies the admins once
a member's edit of an approved activity has gone through RLS. Don't reach
for it to make a query easier. The pool itself is not exported.

The current member comes from `getCurrentUser()` in `lib/auth/session`
(cached per request, with `role` and `full_name`); guarded pages call
`requireUser(next)`, and `/admin` is guarded by its layout. The middleware
runs on the Edge runtime and cannot reach Postgres, so it only checks that a
session cookie exists. Don't re-read the member's own profile for its name or
role: `authenticated` may select only `id`, `full_name` and `role` from
`profiles`, and a query naming any other column is refused outright.

**postgres.js v4 gotchas.** jsonb values go through `tx.json(obj)` — a
pre-stringified one is stored as a JSON *string*. `count(*)` comes back as a
string unless cast `::int`. Route ids go through `isUuid()` first, since a
malformed uuid is a Postgres error (500), not a miss. An activity with its
proposer's name and materials is `loadActivity()`; the
`activities_with_creator` view gives the list shape.

**Never trust a request body's shape.** Client input is filtered through
`pickActivityFields()` so server-owned columns (`status`, `reviewed_by`,
`admin_comment`, …) can't be written, and enum and id parameters are
checked first (`isActivityStatus`, `isUuid`) so a bad value is a 400 or 404,
not a cast error. Values reach SQL only as postgres.js parameters. No schema library is installed; the hand-written guards
in `lib/validation.ts` are the pattern.

**A member never sets an activity's status; the database does.** An author
may edit their activity until it is rejected. While it is pending the edit
just goes through. Once it is approved, changing when, where or what kind
(`start_time`, `end_time`, `location`, `activity_type`) puts it back to
`pending` — off the public calendar until an admin approves it again — and
anything else, materials and the reservation status included, leaves it
published. That rule is the `settle_member_edit` trigger in
`db/schema.sql`, so it holds for every write made as a member; the PATCH
route only reads the outcome off the returned row and tells
the admins what changed. Admins' edits are saved as written.

**Times are instants.** The forms turn a `datetime-local` value into an ISO
instant in the browser, where the member's zone is known — sent as typed,
Postgres would read it as UTC. Everything renders them with `date-fns` in the
zone of whatever is rendering, which is why the container sets
`TZ=Europe/Zagreb`: without it server-rendered times are UTC and disagree
with the browser's.

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

`DATABASE_URL` (its password), the S3 keys and `SMTP_PASS` are real secrets.
Anything prefixed
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
`lib/supabase/index.ts`) don't exist. It also predates the move off Supabase
(November 2026): read its "Supabase client" as `withUser()`, "service_role"
as `asService()`, and its auth and storage as `lib/auth` and `lib/storage.ts`.
Trust the code over that document where they disagree.
