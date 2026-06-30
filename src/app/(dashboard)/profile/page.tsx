import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: myActivities } = await supabase
    .from("activities")
    .select("id, title, status, start_time, activity_type")
    .eq("created_by", session.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Moj profil</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Ime:</span>{" "}
            {profile?.full_name || "—"}
          </div>
          <div>
            <span className="text-gray-500">Email:</span>{" "}
            {profile?.email || session.user.email}
          </div>
          <div>
            <span className="text-gray-500">Uloga:</span>{" "}
            {profile?.role === "admin" ? "Admin" : "Korisnik"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Moje aktivnosti</h2>
        </div>
        {!myActivities || myActivities.length === 0 ? (
          <p className="p-4 text-gray-500">Još nisi predložio/la aktivnosti.</p>
        ) : (
          <div className="divide-y">
            {myActivities.map((a) => (
              <div key={a.id} className="p-4 flex justify-between items-center">
                <Link
                  href={`/activities/${a.id}`}
                  className="text-gray-900 hover:text-brand-600"
                >
                  {a.title}
                </Link>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : a.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {a.status === "approved"
                    ? "Odobreno"
                    : a.status === "rejected"
                    ? "Odbijeno"
                    : "Na čekanju"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
