"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) {
        window.location.href = "/sign-in";
        return;
      }
      setAuthed(true);
      setLoading(false);
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session?.user);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Loading…</h1>
        <p className="text-gray-700">Checking your session.</p>
      </main>
    );
  }

  if (!authed) return null;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Your Quiz</h1>
      {/* TODO: your quiz UI */}
      <p className="mt-6 text-sm">
        Go to <a href="/profile" className="text-blue-600 underline">Profile</a> to update details.
      </p>
    </main>
  );
}
