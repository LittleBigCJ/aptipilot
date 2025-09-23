// lib/memberships.ts
import "server-only";
import { createSupabaseServer } from "@/utils/supabase/server";

/** Table/column mapping for YOUR schema */
const SUBS_TABLE = "subscriptions";
const SUBS_USER_ID_COL = "userId";
/** If your status column is named differently (e.g., "status", "plan"), change this */
const SUBS_STATUS_COL = "subscription";

/** Which statuses count as active? Adjust to your system. */
export const hasActiveSub = (status?: string | null) =>
  status === "active" || status === "trialing" || status === "pro" || status === "paid";

/** Get current auth user and their subscription row (if any) */
export async function getMeWithSubscription() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) return { user: null, subscriptionRow: null };

  const { data: subscriptionRow, error } = await supabase
    .from(SUBS_TABLE)
    .select("*")
    .eq(SUBS_USER_ID_COL, user.id)
    .order("created_at", { ascending: false }) // in case of history
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Subscription fetch error:", error);
    return { user, subscriptionRow: null };
  }
  return { user, subscriptionRow };
}

export async function userHasActiveSubscription() {
  const { subscriptionRow } = await getMeWithSubscription();
  return hasActiveSub(subscriptionRow?.[SUBS_STATUS_COL] ?? null);
}
