// lib/memberships.ts
import "server-only";
import { createSupabaseServer } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

type SubscriptionRow = {
  userId: string;
  subscription: string | null;
  created_at?: string | null;
};

export const ACTIVE_STATUSES = new Set(["active", "trialing", "paid", "pro"]);
export const hasActiveSub = (status?: string | null) =>
  !!status && ACTIVE_STATUSES.has(status);

/**
 * Returns the signed-in user and their latest subscription row (if any).
 */
export async function getMeWithSubscription(): Promise<{
  user: User | null;
  subscriptionRow: SubscriptionRow | null;
}> {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, subscriptionRow: null };
  }

  const { data: subscriptionRow, error } = await supabase
    .from("subscriptions")
    .select("userId,subscription,created_at")
    .eq("userId", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  if (error) {
    console.error("Subscription fetch error:", error);
    return { user, subscriptionRow: null };
  }

  return { user, subscriptionRow };
}

/** Convenience helper: does the current user have an active sub? */
export async function userHasActiveSubscription() {
  const { subscriptionRow } = await getMeWithSubscription();
  return hasActiveSub(subscriptionRow?.subscription ?? null);
}
