"use client";

import { useActionState } from "react";
import Image from "next/image";
import { adminLogin, type LoginState } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(adminLogin, null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0A",
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 1rem",
              border: "1.5px solid rgba(230,34,140,0.35)",
            }}
          >
            <Image
              src="/gladdy-logo.png"
              alt="GLADDY"
              width={64}
              height={64}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          <p
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "1.5rem",
              letterSpacing: "0.08em",
              color: "#fff",
            }}
          >
            GLADDY
          </p>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "var(--primary)",
              textTransform: "uppercase",
              marginTop: "0.2rem",
            }}
          >
            Admin
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#141414",
            border: "1px solid rgba(230,34,140,0.15)",
            borderRadius: "12px",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            Anmelden
          </h1>

          <form action={action}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Passwort
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoFocus
                autoComplete="current-password"
                className="input-pink"
                placeholder="••••••••"
                aria-invalid={!!state?.error}
              />
            </div>

            {state?.error && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#f87171",
                  marginBottom: "1rem",
                  padding: "0.6rem 0.875rem",
                  background: "rgba(239,68,68,0.08)",
                  borderRadius: "6px",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
                cursor: isPending ? "wait" : "pointer",
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "Einen Moment …" : "Anmelden"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/"
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
            }}
            className="hover-white"
          >
            ← Zurück zur Website
          </a>
        </p>
      </div>
    </div>
  );
}
