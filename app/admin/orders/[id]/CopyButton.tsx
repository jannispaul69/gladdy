"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, label = "Kopieren" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.35rem",
        background: "none", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "6px", padding: "0.3rem 0.65rem", cursor: "pointer",
        fontSize: "0.7rem", color: copied ? "#4ade80" : "rgba(255,255,255,0.35)",
        fontFamily: "inherit", transition: "all 0.15s", letterSpacing: "0.04em",
      }}
    >
      {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.75} />}
      {copied ? "Kopiert!" : label}
    </button>
  );
}
