"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const siteUrl =
        (process.env.NEXT_PUBLIC_SITE_URL || "https://aptipilot.vercel.app").replace(/\/+$/, "");

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: fullName ? { full_name: fullName } : undefined,
        },
      });

      if (error) throw error;

      setMessage(
        "Check your email for the confirmation link. Click the button in the email (or copy the plain link) to finish signing in."
      );
      setEmail("");
      setFullName("");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong sending your email link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
      <p className="text-sm text-gray-600 mb-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 underline">
          Sign in
        </Link>
        .
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            Full name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className="w-full rounded border px-3 py-2"
            placeholder="Jane Pilot"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Sending link…" : "Send me a sign-in link"}
        </button>
      </form>

      <div className="mt-6 text-sm">
        Didn’t get the email? Check spam or try again above.
      </div>

      <p className="mt-4 text-xs text-gray-500">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>
    </main>
  );
}
