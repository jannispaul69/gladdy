import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "GLADDY Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0A" }}>
      <AdminSidebar />
      <main className="admin-main" style={{ flex: 1, minWidth: 0, overflow: "auto" }}>{children}</main>
    </div>
  );
}
