"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const token_hash = params.get("token_hash");
      // email | signup | recovery | invite | email_change
      const type = (params.get("type") ?? "email") as
        | "email" | "signup" | "recovery" | "invite" | "email_change";

      if (!token_hash) {
        setError("Missing token hash. Please click the button in the email to sign in.");
        return;
      }

      const { error: verifyErr } = await supabase.auth.verifyOtp({ token_hash, type });
      if (verifyErr) {
        setError(verifyErr.message);
        return;
      }

      // Prefer sending users to set a password immediately
      const next = params.get("next") || "/set-password";
      router.replace(next);
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Signing you in…</h1>
      {!error ? (
        <p className="text-gray-700">Verifying your email and creating your session…</p>
      ) : (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Sign-in failed</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </main>
  );
}
