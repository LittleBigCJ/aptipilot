import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function ensureUserRow() {
  const supabase = await createSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email ?? "";
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    create: { id: user.id, email },
    update: { email },
  });
  return dbUser;
}
