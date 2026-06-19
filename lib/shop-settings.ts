import { getSupabaseAdmin } from "./supabase-admin";

export interface ShopSettings {
  shopEnabled: boolean;
  testMode: boolean;
}

export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["shop_enabled", "test_mode"]);

    const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
    return {
      shopEnabled: map["shop_enabled"] === "true",
      testMode: map["test_mode"] === "true",
    };
  } catch {
    return { shopEnabled: false, testMode: false };
  }
}
