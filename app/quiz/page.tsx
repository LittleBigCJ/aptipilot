// app/quiz/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type LiteUser = { id: string; email: string | null };

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<LiteUser | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Fast path: read current session
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        if (session?.user) {
          if (!mounted) return;
          setUser({ id: session.user.id, email: session.user.email ?? null });
          setLoading(false);
          return;
        }

        // Fallback: authoritative user fetch
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!mounted) return;
        setUser(user ? { id: user.id, email: user.email ?? null } : null);
        setLoading(false);
      } catch (e: unknown) {
        if (!mounted) return;
        setErr(e instanceof Error ? e.message : "Unknown error");
        setLoading(false);
      }
    }

    init();

    // Keep UI in sync with auth changes (e.g., after magic-link verification)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Loading…</h1>
        <p className="text-slate-700">Checking your session.</p>
      </main>
    );
  }

  // Error state
  if (err) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{err}</div>
        <p className="mt-4 text-sm text-slate-700">
          Try <a href="/sign-in" className="text-emerald-700 underline">signing in</a> again.
        </p>
      </main>
    );
  }

  // Signed-out state
  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
        <p className="text-slate-700">
          You need to be signed in to access the quiz.{" "}
          <a href="/sign-in" className="text-emerald-700 underline">Sign in</a>
        </p>
      </main>
    );
  }

  // ✅ Signed-in state
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Your Quiz</h1>
        <p className="text-slate-600">
          Signed in as <span className="font-medium">{user.email ?? user.id}</span>
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-slate-800">
          🎯 Ready to go. Replace this box with your quiz UI.
        </p>
      </section>
    </main>
  );
}
