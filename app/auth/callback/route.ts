// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/profile";

  if (code) {
    const supabase = await createSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, origin));
}
