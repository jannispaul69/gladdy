import { Settings } from "lucide-react";
import { getShopSettings } from "@/lib/shop-settings";
import ShopSettingsClient from "./ShopSettingsClient";

export default async function ShopSettingsPage() {
  const settings = await getShopSettings();

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "700px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
          <Settings size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
          <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>
            SHOP-EINSTELLUNGEN
          </h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
          Shop aktivieren / deaktivieren · Test-Modus (Stripe Sandbox)
        </p>
      </div>

      <ShopSettingsClient shopEnabled={settings.shopEnabled} testMode={settings.testMode} />

      <div style={{
        marginTop: "2.5rem",
        padding: "1.25rem 1.5rem",
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        fontSize: "0.78rem",
        color: "rgba(255,255,255,0.3)",
        lineHeight: 1.7,
      }}>
        <strong style={{ color: "rgba(255,255,255,0.5)" }}>Hinweis:</strong> Änderungen werden sofort wirksam — kein Neustart oder Deployment nötig.
        Im Test-Modus werden echte Bestellungen in Supabase gespeichert, aber keine echten Zahlungen verarbeitet.
        Zum Wechsel in den Live-Modus: Stripe Dashboard → Konto abschließend einrichten → dann Test-Modus hier deaktivieren.
      </div>
    </div>
  );
}
