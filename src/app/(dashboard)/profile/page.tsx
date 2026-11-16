import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { withUser } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser("/profile");

  // The name and role come with the session. They are not re-read from
  // profiles: a member's role may read only id, full_name and role there,
  // and a select naming any other column is refused outright.
  const activities = await withUser(user.id, (tx) =>
    tx<Activity[]>`
      SELECT id, title, status, start_time, activity_type
      FROM activities
      WHERE created_by = ${user.id}
      ORDER BY created_at DESC
      LIMIT 20
    `
  );

  const me = user;
  const myActivities: Activity[] = [...activities];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card className="space-y-4 p-6">
        <h1 className="text-xl font-bold text-fg">Moj profil</h1>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-fg-subtle">Ime</dt>
            <dd className="text-fg">{me?.full_name || "—"}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-fg-subtle">Email</dt>
            <dd className="truncate text-fg">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Uloga</dt>
            <dd className="text-fg">
              {me?.role === "admin" ? "Admin" : "Korisnik"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between gap-3">
          <CardTitle>Moje aktivnosti</CardTitle>
          <ButtonLink href="/activities/new" variant="secondary" size="sm">
            + Nova
          </ButtonLink>
        </CardHeader>

        {myActivities.length === 0 ? (
          <p className="p-6 text-center text-fg-muted">
            Još nisi predložio/la aktivnosti.
          </p>
        ) : (
          <ul>
            {myActivities.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-4 border-b
                           border-border px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <Link
                    href={`/activities/${a.id}`}
                    className="block truncate font-medium text-fg hover:text-brand"
                  >
                    {a.title}
                  </Link>
                  <p className="text-xs text-fg-subtle">
                    {ACTIVITY_TYPE_LABELS[a.activity_type]} ·{" "}
                    {format(parseISO(a.start_time), "dd.MM.yyyy. HH:mm", {
                      locale: hr,
                    })}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
