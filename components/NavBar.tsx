"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setAuthed(!!user);
      setLoading(false);
    }

    // initial
    load();

    // keep in sync with auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  // Render quickly; you can add a skeleton if you want
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">AptiPilot</Link>
        <div className="flex items-center gap-4">
          <Link href="/quiz" className="hover:underline">Quiz</Link>

          {!loading && !authed && (
            <>
              <Link href="/sign-in" className="hover:underline">Sign in</Link>
              <Link href="/sign-up" className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700">
                Sign up
              </Link>
            </>
          )}

          {!loading && authed && (
            <>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
                className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
