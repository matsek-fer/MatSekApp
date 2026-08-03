import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { AI_PROVIDERS } from "@/lib/ai";
import { loadUserKeySuffix } from "@/lib/ai/keys";
import AiKeyForm from "@/components/ai/AiKeyForm";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AiKeysPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const keys = AI_PROVIDERS.map((provider) => ({
    provider,
    suffix: loadUserKeySuffix(session.user.id, provider),
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <Link href="/profile" className="text-sm text-fg-muted hover:text-brand">
          ← Moj profil
        </Link>
        <h1 className="text-xl font-bold text-fg">AI ključevi</h1>
        <p className="text-sm text-fg-muted">
          Asistent za čitanje koristi tvoj vlastiti ključ kod pružatelja. Upiši
          barem jedan da bi mogao/la postavljati pitanja o dokumentima.
        </p>
      </div>

      <Card className="space-y-2 p-6">
        <h2 className="font-medium text-fg">Kako čuvamo ključ</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
          <li>
            Ključ se sprema šifrirano u kolačić tvog preglednika i ne zapisuje
            se u bazu.
          </li>
          <li>
            Vrijedi najviše 12 sati, nakon čega ga treba upisati ponovno.
          </li>
          <li>
            Nakon spremanja ti se prikazuju samo posljednja četiri znaka —
            ključ se više nigdje ne prikazuje.
          </li>
          <li>
            Troškove obračunava pružatelj na tvoj račun. Uklanjanje ključa ovdje
            ga ne opoziva kod pružatelja.
          </li>
        </ul>
      </Card>

      <div className="space-y-4">
        {keys.map(({ provider, suffix }) => (
          <AiKeyForm key={provider} provider={provider} suffix={suffix} />
        ))}
      </div>
    </div>
  );
}
