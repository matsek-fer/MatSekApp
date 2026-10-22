import { notFound, redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import ReaderShell from "@/components/documents/ReaderShell";
import type { Document, DocumentBlock } from "@/types";

export const dynamic = "force-dynamic";

/** How long the reader's copy of the file stays fetchable. */
const FILE_URL_TTL_SECONDS = 60 * 60;

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect(`/login?next=%2Fdocuments%2F${params.id}`);

  // Owner-only RLS does the access check. Another member's document comes
  // back empty here, which is the same 404 as one that does not exist — and
  // deliberately indistinguishable from outside.
  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!document) notFound();

  const { data: blocks } = await supabase
    .from("document_blocks")
    .select("*")
    .eq("document_id", params.id)
    .order("block_index", { ascending: true });

  let fileUrl: string | null = null;
  if (document.status === "ready") {
    const { data: signed } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.storage_path, FILE_URL_TTL_SECONDS);
    fileUrl = signed?.signedUrl ?? null;
  }

  return (
    <ReaderShell
      document={document as Document}
      blocks={(blocks ?? []) as DocumentBlock[]}
      fileUrl={fileUrl}
    />
  );
}
