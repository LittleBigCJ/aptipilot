// app/profile/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function updateName(formData: FormData) {
  "use server";
  const supabase = createSupabaseServer();
  const name = String(formData.get("fullName") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/profile");

  const { error } = await supabase.auth.updateUser({
    data: { full_name: name || null },
  });
  if (error) redirect("/profile?error=" + encodeURIComponent(error.message));
  redirect("/profile?message=" + encodeURIComponent("Name updated."));
}

async function updateEmail(formData: FormData) {
  "use server";
  const supabase = createSupabaseServer();
  const email = String(formData.get("email") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/profile");

  // headers() is synchronous; give TS a tiny type so .get exists
  const hdrs = headers() as unknown as { get(name: string): string | null | undefined };
  const origin = hdrs.get("origin") ?? "http://localhost:3000";

  // Prefer configured site URL, fall back to NEXT_PUBLIC_SITE_URL, then request origin
  const siteUrl = (process.env.NEXT_PUBLIC_SUPABASE_SITE_URL ?? "").replace(/\/+$/, "");
  const fallbackSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? origin).replace(/\/+$/, "");
  const base = siteUrl || fallbackSiteUrl;

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${base}/auth/callback?next=/profile` }
  );
  if (error) redirect("/profile?error=" + encodeURIComponent(error.message));
  redirect("/profile?message=" + encodeURIComponent("Check your new inbox to confirm email change."));
}

async function updatePassword(formData: FormData) {
  "use server";
  const supabase = createSupabaseServer();
  const pwd = String(formData.get("password") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/profile");

  const { error } = await supabase.auth.updateUser({ password: pwd });
  if (error) redirect("/profile?error=" + encodeURIComponent(error.message));
  redirect("/profile?message=" + encodeURIComponent("Password updated."));
}

async function signOut() {
  "use server";
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function Page({
  searchParams,
}: {
  // Next.js 15 pattern: searchParams is a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const error = typeof sp.error === "string" ? sp.error : Array.isArray(sp.error) ? sp.error[0] : undefined;
  const message =
    typeof sp.message === "string" ? sp.message : Array.isArray(sp.message) ? sp.message[0] : undefined;

  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/profile");

  // Safely read full_name without using `any`
  const meta = user.user_metadata as Record<string, unknown> | null | undefined;
  const fullName = typeof meta?.["full_name"] === "string" ? (meta["full_name"] as string) : "";

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}
      {message && (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-green-700">{message}</div>
      )}

      <section className="rounded-xl border bg-white p-4">
        <form action={updateName} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input name="fullName" defaultValue={fullName} className="w-full rounded border px-3 py-2" />
          </div>
          <button className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
            Save name
          </button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <form action={updateEmail} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
          <input name="email" type="email" defaultValue={user.email ?? ""} className="w-full rounded border px-3 py-2" />
          </div>
          <button className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
            Update email
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500">We’ll send a confirmation link to the new address.</p>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <form action={updatePassword} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">New password</label>
            <input name="password" type="password" minLength={6} className="w-full rounded border px-3 py-2" />
          </div>
          <button className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
            Change password
          </button>
        </form>
      </section>

      <form action={signOut}>
        <button className="rounded border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50">
          Sign out
        </button>
      </form>
    </main>
  );
}
