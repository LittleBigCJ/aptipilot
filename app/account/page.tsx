// app/account/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

async function signOutAction() {
  "use server";
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function Page() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // If there's an auth error (e.g., missing cookies), treat as signed out
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Account</h1>

      <section className="rounded-2xl border p-4 mb-6">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">User ID</div>
          <div className="font-mono break-all">{user.id}</div>

          <div className="text-sm text-gray-500 mt-4">Email</div>
          <div>{user.email ?? "—"}</div>

          <div className="text-sm text-gray-500 mt-4">Created</div>
          <div>{new Date(user.created_at).toLocaleString()}</div>
        </div>
      </section>

      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-2xl border px-4 py-2 hover:bg-gray-50 active:bg-gray-100"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
