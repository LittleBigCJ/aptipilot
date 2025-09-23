// utils/supabase/signout.ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function signOutAction() {
  const supabase = await createSupabaseServer(); // ← await the async factory
  await supabase.auth.signOut();
  redirect("/");
}
