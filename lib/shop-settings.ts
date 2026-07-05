import { getSupabaseAdmin } from "./supabase-admin";

export interface ShopSettings {
  shopEnabled: boolean;
  testMode: boolean;
}

// Shop launch: Sunday July 5, 2026 at 18:00 CEST (UTC+2)
const SHOP_LAUNCH_TIME = new Date("2026-07-05T18:00:00+02:00").getTime();

export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["shop_enabled", "test_mode"]);

    const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
    return {
      shopEnabled: map["shop_enabled"] === "true" || Date.now() >= SHOP_LAUNCH_TIME,
      testMode: map["test_mode"] === "true",
    };
  } catch {
    return { shopEnabled: Date.now() >= SHOP_LAUNCH_TIME, testMode: false };
  }
}
