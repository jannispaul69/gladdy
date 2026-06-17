"use client";

export default function ConfirmDelete({
  action,
  id,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Eintrag löschen?")) e.preventDefault();
      }}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.75rem",
          fontFamily: "inherit",
        }}
        className="hover-pink"
      >
        Entfernen
      </button>
    </form>
  );
}
