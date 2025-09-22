import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function getMeWithSubscription() {
  const supabase = await createSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, subscription: null };

  const me = await prisma.user.findUnique({
    where: { id: user.id },
    include: { Subscription: true },
  });
  return { user: me, subscription: me?.Subscription ?? null };
}

export const hasActiveSub = (status?: string | null) =>
  status === "active" || status === "trialing";
