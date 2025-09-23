"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type U = { id: string; email?: string | null };

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<U | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Try session fast path
        const { data: { session }, error: sErr } = await supabase.auth.getSession();
        if (sErr) throw sErr;

        if (session?.user) {
          if (!mounted) return;
          setUser({ id: session.user.id, email: session.user.email });
          setLoading(false);
        } else {
          // Fallback to a fresh user call (more authoritative)
          const { data: { user }, error: uErr } = await supabase.auth.getUser();
          if (uErr) throw uErr;
          if (!mounted) return;
          if (user) setUser({ id: user.id, email: user.email });
          setLoading(false);
        }
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Unknown error");
        setLoading(false);
      }
    }

    init();

    // Stay in sync with auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  // Visible states

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Loading…</h1>
        <p className="text-slate-700">Checking your session.</p>
      </main>
    );
  }

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

  // ✅ Signed-in content
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Your Quiz</h1>
        <p className="text-slate-600">Signed in as <span className="font-medium">{user.email || user.id}</span></p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-slate-800">🎯 Ready to go. Replace this box with your quiz UI.</p>
      </section>
    </main>
  );
}
