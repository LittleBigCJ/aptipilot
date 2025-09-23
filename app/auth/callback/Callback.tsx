"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState<string>("Finalizing sign-in…");

  useEffect(() => {
    let mounted = true;

    async function finalize() {
      try {
        // detectSessionInUrl=true (client) will parse code/hash automatically
        // Just ensure we have a session now:
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!mounted) return;

        if (session?.user) {
          setStatus("ok");
          setMsg("Signed in!");
          const next = params.get("next") || "/quiz";
          // optional: if you require password to be set, route to /set-password instead
          router.replace(next);
        } else {
          setStatus("error");
          setMsg("No active session. Please sign in again.");
        }
      } catch (e: unknown) {
        if (!mounted) return;
        setStatus("error");
        setMsg(e instanceof Error ? e.message : "Error finalizing sign-in");
      }
    }

    finalize();
    return () => { mounted = false; };
  }, [params, router]);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Authentication</h1>
      <p className={status === "error" ? "text-red-700" : "text-gray-700"}>{msg}</p>
      {status === "error" && (
        <p className="mt-3">
          Try <a href="/sign-in" className="text-blue-600 underline">signing in</a> again.
        </p>
      )}
    </main>
  );
}
