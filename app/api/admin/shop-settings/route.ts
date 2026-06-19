import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { key: string; value: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = ["shop_enabled", "test_mode"];
  if (!allowed.includes(body.key) || !["true", "false"].includes(body.value)) {
    return NextResponse.json({ error: "Invalid key or value" }, { status: 400 });
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("settings")
    .upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
