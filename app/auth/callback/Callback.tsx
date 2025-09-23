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
      const code = params.get("code");
      if (!code) {
        setError(
          "Missing security code (?code=…). Please click the button in the email, not a copied link."
        );
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );
      if (error) {
        setError(error.message);
        return;
      }
      router.replace("/quiz");
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Signing you in…</h1>
      {!error ? (
        <p className="text-gray-700">
          Please wait while we verify your email and create your session.
        </p>
      ) : (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Sign-in failed</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-sm text-gray-700">
            Go back to your email and click the <strong>button</strong>, or make sure the full URL (including <code>?code=…</code>) is opened.
          </p>
        </div>
      )}
    </main>
  );
}
