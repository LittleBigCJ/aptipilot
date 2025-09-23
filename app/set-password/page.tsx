// app/set-password/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function setNewPassword(formData: FormData) {
  "use server";
  const supabase = createSupabaseServer();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const next = String(formData.get("next") ?? "/quiz");

  if (password.length < 6) {
    redirect(`/set-password?error=${encodeURIComponent("Password must be at least 6 characters.")}`);
  }
  if (password !== confirm) {
    redirect(`/set-password?error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/sign-in?message=${encodeURIComponent(
        "Please sign in again to set your password."
      )}&next=${encodeURIComponent("/set-password")}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/set-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`${next}?message=${encodeURIComponent("Password updated.")}`);
}

export default async function Page({
  searchParams,
}: {
  // Next 15 typing: searchParams comes in as a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;

  const error = get("error");
  const message = get("message");
  const next = get("next") || "/quiz";

  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Set your password</h1>
      <p className="text-gray-700 mb-4">
        {user ? "You can set a password for password-based sign-in." : "Please sign in to continue."}
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}
      {message && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-green-700">
          {message}
        </div>
      )}

      {!user ? (
        <a
          href={`/sign-in?next=${encodeURIComponent("/set-password")}`}
          className="inline-block rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Sign in
        </a>
      ) : (
        <form action={setNewPassword} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="mb-1 block text-sm font-medium">New password</label>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm password</label>
            <input
              name="confirm"
              type="password"
              minLength={6}
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <button className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            Set password
          </button>
        </form>
      )}
    </main>
  );
}
