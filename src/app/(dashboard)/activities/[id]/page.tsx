import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-fg-subtle">{label}</dt>
      <dd className="mt-0.5 text-fg">{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-medium text-fg">{title}</h2>
      <p className="mt-1 whitespace-pre-wrap text-fg-muted">{children}</p>
    </div>
  );
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("activities")
    .select("*, creator:profiles!created_by(id, email, full_name)")
    .eq("id", params.id)
    .single();

  if (!data) notFound();
  const activity = data as Activity;

  const dateFmt = (iso: string) =>
    format(parseISO(iso), "dd.MM.yyyy. HH:mm", { locale: hr });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/calendar" className="text-sm text-brand hover:underline">
        ← Natrag na kalendar
      </Link>

      <Card className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-fg">{activity.title}</h1>
          <StatusBadge status={activity.status} />
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <DetailRow label="Tip">
            {ACTIVITY_TYPE_LABELS[activity.activity_type]}
          </DetailRow>
          <DetailRow label="Lokacija">{activity.location || "—"}</DetailRow>
          <DetailRow label="Početak">
            <time dateTime={activity.start_time}>
              {dateFmt(activity.start_time)}
            </time>
          </DetailRow>
          <DetailRow label="Kraj">
            <time dateTime={activity.end_time}>{dateFmt(activity.end_time)}</time>
          </DetailRow>
        </dl>

        <Section title="Opis">{activity.description}</Section>

        {activity.prerequisites && (
          <Section title="Preduvjeti">{activity.prerequisites}</Section>
        )}

        {activity.target_audience && (
          <Section title="Ciljana publika">{activity.target_audience}</Section>
        )}

        {activity.admin_comment && (
          <Alert tone="error">
            <span className="font-medium">Komentar admina: </span>
            {activity.admin_comment}
          </Alert>
        )}

        <p className="border-t border-border pt-4 text-xs text-fg-subtle">
          Predložio/la: {activity.creator?.full_name || activity.creator?.email}
        </p>
      </Card>
    </div>
  );
}
