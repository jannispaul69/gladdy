"use client";
import { quickStatusUpdate } from "@/app/actions/admin-products";

const STATUSES = [
  { value: "draft",    label: "Entwurf",    color: "#fbbf24" },
  { value: "active",   label: "Aktiv",      color: "#4ade80" },
  { value: "archived", label: "Archiviert", color: "rgba(255,255,255,0.3)" },
];

export default function StatusSelect({ id, status }: { id: string; status: string }) {
  const s = STATUSES.find(x => x.value === status);
  return (
    <form style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={async (e) => {
          const fd = new FormData();
          fd.set("id", id);
          fd.set("status", e.target.value);
          await quickStatusUpdate(fd);
        }}
        style={{
          background: `${s?.color ?? "#888"}22`,
          color: s?.color ?? "#888",
          border: `1px solid ${s?.color ?? "#888"}44`,
          borderRadius: "100px",
          padding: "0.2rem 0.6rem",
          fontSize: "0.65rem",
          letterSpacing: "0.06em",
          cursor: "pointer",
          fontFamily: "inherit",
          outline: "none",
        }}
      >
        {STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
      </select>
    </form>
  );
}
