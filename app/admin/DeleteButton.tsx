"use client";

import { useTransition } from "react";

type Props = {
  id: string;
  action: (formData: FormData) => Promise<void>;
  confirmMessage?: string;
};

export default function DeleteButton({ id, action, confirmMessage = "Wirklich löschen?" }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        const fd = new FormData();
        fd.append("id", id);
        startTransition(() => action(fd));
      }}
      style={{
        background: "none",
        border: "none",
        fontSize: "0.78rem",
        color: isPending ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.5)",
        cursor: isPending ? "wait" : "pointer",
        padding: 0,
        transition: "color 0.15s",
      }}
      className="hover-white"
    >
      {isPending ? "…" : "Löschen"}
    </button>
  );
}
