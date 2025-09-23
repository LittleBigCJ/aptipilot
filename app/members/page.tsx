// app/members/page.tsx
import { redirect } from "next/navigation";
import { getMeWithSubscription, hasActiveSub } from "@/lib/memberships";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { user, subscriptionRow } = await getMeWithSubscription();
  if (!user) redirect("/sign-in?next=/members");

  const active = hasActiveSub(subscriptionRow?.subscription ?? null); // <- uses your "subscription" column
  if (!active) redirect("/pricing");

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-2">Members</h1>
      <p className="text-slate-700">Welcome, {user.email}</p>
    </main>
  );
}
