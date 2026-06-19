"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  shopEnabled: boolean;
  testMode: boolean;
}

function Toggle({ label, description, checked, onChange, loading }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  loading: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1.25rem 1.5rem",
      background: "#141414",
      border: `1px solid ${checked ? "rgba(230,34,140,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "10px",
      gap: "1.5rem",
      transition: "border-color 0.2s",
    }}>
      <div>
        <p style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 500, marginBottom: "0.2rem" }}>{label}</p>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={loading}
        aria-label={checked ? "Deaktivieren" : "Aktivieren"}
        style={{
          width: "52px", height: "28px", flexShrink: 0,
          borderRadius: "100px", border: "none", cursor: loading ? "wait" : "pointer",
          background: checked ? "linear-gradient(135deg, #FF3D9A, #B01570)" : "rgba(255,255,255,0.1)",
          position: "relative", transition: "background 0.25s", opacity: loading ? 0.6 : 1,
          padding: 0,
        }}
      >
        <span style={{
          position: "absolute", top: "3px",
          left: checked ? "calc(100% - 25px)" : "3px",
          width: "22px", height: "22px", borderRadius: "50%",
          background: "#fff",
          transition: "left 0.25s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }} />
      </button>
    </div>
  );
}

export default function ShopSettingsClient({ shopEnabled: init_shop, testMode: init_test }: Props) {
  const router = useRouter();
  const [shopEnabled, setShopEnabled] = useState(init_shop);
  const [testMode, setTestMode] = useState(init_test);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function update(key: string, value: boolean) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/shop-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: String(value) }),
      });
      const data = await res.json();
      if (data.ok) {
        if (key === "shop_enabled") setShopEnabled(value);
        if (key === "test_mode") setTestMode(value);
        setMsg({ ok: true, text: "Gespeichert." });
        router.refresh();
      } else {
        setMsg({ ok: false, text: data.error ?? "Fehler" });
      }
    } catch {
      setMsg({ ok: false, text: "Verbindungsfehler" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "560px" }}>
      <Toggle
        label="Shop aktiv"
        description='Wenn aktiviert, sehen Besucher den "Jetzt kaufen" Button und können Bestellungen aufgeben.'
        checked={shopEnabled}
        onChange={(v) => update("shop_enabled", v)}
        loading={loading}
      />
      <Toggle
        label="Test-Modus (Stripe Sandbox)"
        description="Im Test-Modus werden Zahlungen über Stripes Sandbox verarbeitet. Testkarte: 4242 4242 4242 4242."
        checked={testMode}
        onChange={(v) => update("test_mode", v)}
        loading={loading}
      />

      {msg && (
        <p style={{
          fontSize: "0.78rem",
          color: msg.ok ? "#4ade80" : "#f87171",
          padding: "0.6rem 1rem",
          background: msg.ok ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
          border: `1px solid ${msg.ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
          borderRadius: "8px",
        }}>
          {msg.ok ? "✓" : "✗"} {msg.text}
        </p>
      )}

      {testMode && (
        <div style={{
          padding: "1rem 1.25rem",
          background: "rgba(255,179,71,0.06)",
          border: "1px solid rgba(255,179,71,0.2)",
          borderRadius: "8px",
          fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6,
        }}>
          <strong style={{ color: "#FFB347" }}>Test-Karte:</strong> 4242 4242 4242 4242 · Ablauf: 12/34 · CVV: 123 · PLZ: beliebig
        </div>
      )}
    </div>
  );
}
