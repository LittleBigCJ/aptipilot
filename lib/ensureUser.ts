// lib/ensureUser.ts
import "server-only";
import { createSupabaseServer } from "@/utils/supabase/server";

/**
 * Ensures there's a row in your public.users table keyed to auth.users.id.
 * Adjust column names to match your schema.
 *
 * Suggested columns in public.users:
 *   id uuid primary key (== auth.users.id)
 *   email text
 *   full_name text
 *   created_at timestamptz default now()
 */
export async function ensureUserRow() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { user: null, created: false };

  // Try to find an existing row
  const { data: existing, error: fetchErr } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchErr) {
    console.error("users fetch error", fetchErr);
    return { user, created: false };
  }
  if (existing) return { user, created: false };

  // Create a minimal profile row
  const fullName =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null;

  const { error: insertErr } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    full_name: fullName,
  });

  if (insertErr) {
    console.error("users insert error", insertErr);
    return { user, created: false };
  }

  return { user, created: true };
}
