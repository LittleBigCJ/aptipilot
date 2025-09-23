// app/members/page.tsx
import { requireUser } from "@/lib/ensureUser";

export const dynamic = "force-dynamic"; // ensure no SSG cache for auth-gated page

export default async function MembersPage() {
  const user = await requireUser("/members");

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-2">Members</h1>
      <p className="text-slate-700">Welcome, {user.email}</p>
      {/* Your members-only content here */}
    </main>
  );
}
