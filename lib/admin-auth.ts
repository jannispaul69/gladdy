import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gladdy_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAdminSession(): Promise<void> {
  const token = process.env.ADMIN_SESSION_TOKEN;
  if (!token) throw new Error("ADMIN_SESSION_TOKEN not configured");
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  return !!(expected && token === expected);
}
