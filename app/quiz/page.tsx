"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not signed in → send to sign-in
        window.location.href = "/sign-in";
        return;
      }
      setAuthed(true);
      setLoading(false);
    })();
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
      {/* your quiz UI goes here */}
      <p className="mt-6 text-sm">
        <a href="/set-password" className="text-blue-600 underline">Set or update your password</a>
      </p>
    </main>
  );
}
