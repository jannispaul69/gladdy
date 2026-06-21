import { notFound } from "next/navigation";
import DocumentEditor from "./DocumentEditor";

async function getDocument(id: string) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data } = await getSupabaseAdmin().from("documents").select("*").eq("id", id).single();
    return data;
  } catch { return null; }
}

export default async function DokumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocument(id);
  if (!doc) notFound();
  return <DocumentEditor doc={doc} />;
}
