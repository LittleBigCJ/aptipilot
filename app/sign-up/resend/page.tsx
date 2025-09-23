// app/sign-up/resend/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

/** Server Action: resend confirmation email */
async function resendConfirmationAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/sign-up/resend?error=" + encodeURIComponent("Email is required"));
  }

  const supabase = await createSupabaseServer();

  const hdrs = await headers();
  const originFromHeaders = hdrs.get("origin") ?? "http://localhost:3000";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? originFromHeaders;

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect("/sign-up/resend?error=" + encodeURIComponent(error.message));
  }

  redirect(
    "/sign-up/resend?message=" +
      encodeURIComponent("If that email exists, we’ve sent a new confirmation link.")
  );
}

export default async function Page({
  searchParams,
}: {
  // ✅ Next 15: searchParams is async
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const error = params.error;
  const message = params.message;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Resend confirmation</h1>
      <p className="text-sm text-gray-600 mb-6">
        Already confirmed?{" "}
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

      <form action={resendConfirmationAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
        <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <button className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Resend confirmation
        </button>
      </form>
    </main>
  );
}
