// app/members/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MembersPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/members");

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-2">Members</h1>
      <p className="text-slate-700">Welcome, {user.email}</p>
      {/* members-only content */}
    </main>
  );
}
