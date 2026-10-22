import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { AI_PROVIDERS } from "@/lib/ai";
import { loadUserKeySuffix } from "@/lib/ai/keys";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploader from "@/components/documents/DocumentUploader";
import Alert from "@/components/ui/Alert";
import type { Document } from "@/types";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login?next=%2Fdocuments");

  // RLS scopes this to the member; there is no owner filter to forget.
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  const hasKey = AI_PROVIDERS.some((provider) =>
    loadUserKeySuffix(session.user.id, provider)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-fg">Dokumenti</h1>
        <p className="text-sm text-fg-muted">
          Učitaj skripta i bilješke da ih možeš čitati ovdje i pitati asistenta
          o odabranom dijelu teksta.
        </p>
      </div>

      {!hasKey && (
        <Alert tone="info">
          Nemaš spremljen nijedan AI ključ. Dokumente možeš učitati i čitati bez
          njega, ali za pitanja asistentu{" "}
          <Link href="/profile/ai" className="underline">
            upiši ključ
          </Link>
          .
        </Alert>
      )}

      <DocumentUploader />

      <DocumentList documents={(documents ?? []) as Document[]} />
    </div>
  );
}
