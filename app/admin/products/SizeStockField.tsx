"use client";
import { useState } from "react";
const ALL_SIZES = ["XS","S","M","L","XL","2XL","3XL","4XL"] as const;
type SizeKey = typeof ALL_SIZES[number];
type SizeEntry = { size: SizeKey; stock: number };
export default function SizeStockField({ defaultValue = [] }: { defaultValue?: SizeEntry[] }) {
  const initial = Object.fromEntries(ALL_SIZES.map(s => {
    const found = defaultValue.find(e => e.size === s);
    return [s, found?.stock ?? 0];
  })) as Record<SizeKey, number>;
  const [stocks, setStocks] = useState(initial);
  function update(size: SizeKey, val: string) {
    setStocks(p => ({ ...p, [size]: Math.max(0, parseInt(val, 10) || 0) }));
  }
  const total = ALL_SIZES.reduce((sum, s) => sum + stocks[s], 0);
  return (
    <div>
      <input type="hidden" name="sizes" value={JSON.stringify(ALL_SIZES.map(s => ({ size: s, stock: stocks[s] })))} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
        {ALL_SIZES.map(size => (
          <div key={size}>
            <label style={{ display: "block", fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem", textAlign: "center" }}>{size}</label>
            <input type="number" min="0" value={stocks[size]} onChange={e => update(size, e.target.value)}
              className="input-pink" style={{ textAlign: "center", fontSize: "0.85rem", padding: "0.4rem" }} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", marginTop: "0.5rem" }}>
        Gesamt: <span style={{ color: "rgba(255,255,255,0.55)" }}>{total} Stück</span>
      </p>
    </div>
  );
}
