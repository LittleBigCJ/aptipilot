// app/auth/callback/page.tsx
import { redirect } from "next/navigation";
import { cookies as nextCookies } from "next/headers";
import { createSupabaseServer } from "@/utils/supabase/server";
import AutoSubmit from "@/components/AutoSubmit";

async function exchangeAction(formData: FormData) {
  "use server";

  const code = String(formData.get("code") ?? "");
  const next = String(formData.get("next") ?? "/account");

  if (!code) {
    redirect("/sign-in?error=" + encodeURIComponent("Missing auth code"));
  }

  // 🔧 Aggressively clear *all* PKCE cookies
  const store = await nextCookies();
  for (const c of store.getAll()) {
    const n = c.name.toLowerCase();
    if (
      n.includes("pkce") ||
      n.includes("code_verifier") ||
      n.includes("code-verifier")
    ) {
              store.delete(c.name);
    }
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
        Finalizing your session and redirecting.
      </p>

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

      <AutoSubmit formSelector="form" />
    </main>
  );
}
