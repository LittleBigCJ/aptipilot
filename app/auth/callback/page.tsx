// app/auth/callback/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import AutoSubmit from "@/components/AutoSubmit";

async function exchangeAction(formData: FormData) {
  "use server";

  const code = String(formData.get("code") ?? "");
  const next = String(formData.get("next") ?? "/account");

  if (!code) {
    redirect("/sign-in?error=" + encodeURIComponent("Missing auth code"));
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect("/sign-in?error=" + encodeURIComponent(error.message));
  }

  redirect(next);
}

export default function Page({
  searchParams,
}: {
  searchParams?: { code?: string; next?: string };
}) {
  const code = searchParams?.code ?? "";
  const next = searchParams?.next ?? "/account";

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
      <p className="text-gray-600 mb-6">
        Hang tight—finalizing your session. You’ll be redirected automatically.
      </p>

      {/* Accessible fallback if JS is disabled */}
      <form action={exchangeAction} method="post" className="space-y-3">
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </form>

      {/* Auto-submit the form immediately when the page loads */}
      <AutoSubmit formSelector="form" />
    </main>
  );
}
