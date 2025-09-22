// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

/**
 * Handles redirects from Supabase email confirmation / magic link / OAuth.
 * Exchanges the `code` in the URL for a session and stores it in cookies.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const supabase = await createSupabaseServer();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL("/sign-in?error=" + encodeURIComponent(error.message), url.origin)
      );
    }
    return NextResponse.redirect(new URL("/account", url.origin));
  }

  // If no code is present, just bounce to sign-in
  return NextResponse.redirect(
    new URL("/sign-in?error=" + encodeURIComponent("Missing auth code"), url.origin)
  );
}
