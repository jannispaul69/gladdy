import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "misc";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const customPath = (formData.get("path") as string | null)?.trim();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filename = customPath ?? `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from("gladdy-uploads")
    .upload(filename, buffer, { contentType: file.type, upsert: !!customPath });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("gladdy-uploads")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
