import { ensureUserRow } from "@/lib/ensureUser";
import { getMeWithSubscription, hasActiveSub } from "@/lib/memberships";
import { redirect } from "next/navigation";

export const runtime = "nodejs"; // important for Prisma

export default async function MembersPage() {
  await ensureUserRow();
  const { user, subscription } = await getMeWithSubscription();
  if (!user || !hasActiveSub(subscription?.status)) redirect("/pricing?upgrade=1");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Members Area</h1>
      <p className="text-gray-600 mt-2">Sub status: {subscription?.status}</p>
    </main>
  );
}
