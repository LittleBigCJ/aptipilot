// app/sign-in/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

async function signInAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/sign-in?error=" + encodeURIComponent("Email and password are required"));
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/sign-in?error=" + encodeURIComponent(error.message));
  }

  redirect("/account");
}

export default function Page({
  searchParams,
}: {
  searchParams?: { error?: string; message?: string };
}) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
      <p className="text-sm text-gray-600 mb-6">
        No account yet?{" "}
        <Link href="/sign-up" className="text-blue-600 underline">
          Create one
        </Link>
        .
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <form action={signInAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        Forgot your password? Use Supabase’s password reset from the sign-up email,
        or add a reset page later.
      </p>
    </main>
  );
}
