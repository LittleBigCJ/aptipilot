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
    redirect(
      "/sign-in?error=" +
        encodeURIComponent("Missing auth code. Please use the button in the email (not a copied bare URL), or request a new link.")
    );
  }

  // Clear any lingering PKCE cookies so we don't present a code_verifier accidentally
  const store = await nextCookies();
  for (const c of store.getAll()) {
    const n = c.name.toLowerCase();
    if (n.includes("pkce") || n.includes("code_verifier") || n.includes("code-verifier")) {
      store.delete(c.name);
    }
  }

  const supabase = await createSupabaseServer();
  // If you're on supabase-js >= 2.46, you can also pass { skipPkce: true }
  const { error } = await supabase.auth.exchangeCodeForSession(code /* , { skipPkce: true } */);

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
  const missing = !code;

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
      {!missing ? (
        <>
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
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-4">
            It looks like your email client opened a bare URL without the security code.
            Please go back to the email and click the <strong>button</strong> (don’t copy the text),
            or paste the full link including <code>?code=…</code> below.
          </p>
          <form
            action={exchangeAction}
            method="post"
            className="space-y-3"
          >
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                Paste the code from your link
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="w-full rounded border px-3 py-2"
                placeholder="e.g. eyJhbGciOiJIUzI1..."
              />
            </div>
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        </>
      )}
    </main>
  );
}
