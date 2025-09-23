// lib/ensureUser.ts
import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

/** Ensures there is an authenticated user (Supabase Auth). */
export async function requireUser(nextPath: string = "/members") {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();

  // If SDK error or no user, bounce to sign-in and preserve destination
  if (error || !data?.user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }
  return data.user;
}
