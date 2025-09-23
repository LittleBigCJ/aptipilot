"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function run() {
      const token_hash = params.get("token_hash");
      const type = (params.get("type") ?? "email") as
        | "email"
        | "signup"
        | "recovery"
        | "invite"
        | "email_change";

      if (!token_hash) {
        setError("Missing token hash. Please click the button in the email to sign in.");
        return;
      }

      const { error: verifyErr } = await supabase.auth.verifyOtp({ token_hash, type });
      if (verifyErr) {
        setError(verifyErr.message);
        return;
      }

      setDone(true);
      // If you also want auto-redirect, uncomment:
      // setTimeout(() => router.replace("/quiz"), 1500);
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Signing you in…</h1>

      {!error && !done && (
        <p className="text-gray-700">Verifying your email and creating your session…</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Sign-in failed</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-sm text-gray-700">
            Go back to your email and click the <strong>button</strong> again.
          </p>
        </div>
      )}

      {done && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">
          <p className="font-semibold">You’re signed in 🎉</p>
          <p className="mt-2">Continue to your quiz:</p>
          <p className="mt-3">
            <a
              href="/quiz"
              className="inline-block rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Go to the Quiz
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
