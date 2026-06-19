"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Music,
  ShoppingBag,
  ShoppingCart,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { adminLogout } from "@/app/actions/admin-auth";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/bookings", icon: FileText, label: "Anfragen" },
  { href: "/admin/events", icon: Calendar, label: "Termine" },
  { href: "/admin/songs", icon: Music, label: "Songs" },
  { href: "/admin/products", icon: ShoppingBag, label: "Produkte" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Bestellungen" },
  { href: "/admin/waitlist",  icon: Bell,       label: "Warteliste" },
  { href: "/admin/pressekit", icon: FolderOpen, label: "Pressematerial" },
  { href: "/admin/shop",      icon: Settings,   label: "Shop-Einstellungen" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function close() { setOpen(false); }

  return (
    <>
      {/* Mobile top-bar hamburger */}
      <button className="admin-hamburger" onClick={() => setOpen(true)} aria-label="Menü öffnen">
        <Menu size={18} strokeWidth={1.75} />
        <span>GLADDY Admin</span>
      </button>

      {/* Backdrop */}
      {open && <div className="admin-backdrop" onClick={close} aria-hidden />}

      <aside
        className={`admin-sidebar-panel${open ? " open" : ""}`}
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#0D0D0D",
          borderRight: "1px solid rgba(230,34,140,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
      {/* Logo */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >

        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "1px solid rgba(230,34,140,0.3)",
          }}
        >
          <Image
            src="/gladdy-logo.png"
            alt="GLADDY"
            width={36}
            height={36}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-anton)", fontSize: "0.95rem", color: "#fff", letterSpacing: "0.08em", lineHeight: 1.1 }}>
            GLADDY
          </div>
          <div style={{ fontSize: "0.55rem", color: "var(--primary)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Admin
          </div>
        </div>
        {/* Close button — mobile only */}
        <button className="admin-close-btn" onClick={close} aria-label="Menü schließen">
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.15rem",
        }}
      >
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.575rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                textDecoration: "none",
                color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                background: isActive ? "rgba(230,34,140,0.1)" : "transparent",
                borderLeft: `2px solid ${isActive ? "var(--primary)" : "transparent"}`,
                transition: "all 0.15s",
                fontWeight: isActive ? 500 : 400,
              }}
              className={isActive ? "" : "hover-white"}
            >
              <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <form action={adminLogout}>
          <button
            type="submit"
            className="hover-white"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.575rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.3)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "color 0.15s",
            }}
          >
            <LogOut size={15} strokeWidth={1.75} />
            Abmelden
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}
