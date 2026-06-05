"use server";

import { redirect } from "next/navigation";
import { setAdminSession, clearAdminSession } from "@/lib/admin-auth";

export type LoginState = { error?: string } | null;

export async function adminLogin(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { error: "Falsches Passwort. Bitte erneut versuchen." };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin/login");
}
