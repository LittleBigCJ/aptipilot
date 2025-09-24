// app/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (password !== confirm) {
    throw new Error("Passwords do not match.");
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message || "Failed to update password.");
  }

  redirect("/profile");
}
