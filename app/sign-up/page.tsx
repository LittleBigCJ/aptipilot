// app/sign-up/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

async function signUpAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!email || !password) {
    redirect("/sign-up?error=" + encodeURIComponent("Email and password are required"));
  }

  const supabase = await createSupabaseServer();
  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This route handles the code exchange and sets the session cookie
      emailRedirectTo: `${origin}/auth/callback`,
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) {
    redirect("/sign-up?error=" + encodeURIComponent(error.message));
  }

  // If your project doesn't require email confirmation, a session is present immediately
  if (data.session?.user) {
    redirect("/account");
  }

  // Otherwise show a confirmation message
  redirect(
    "/sign-up?message=" +
      encodeURIComponent("Check your email to confirm, then sign in.")
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { error?: string; message?: string };
}) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
      <p className="text-sm text-gray-600 mb-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 underline">
          Sign in
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

      <form action={signUpAction} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            Full name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className="w-full rounded border px-3 py-2"
            placeholder="Jane Pilot"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={6}
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>
    </main>
  );
}
