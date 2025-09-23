// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Keep env access tiny + consistent
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// (If you later wire Supabase helpers middleware, you can import from @supabase/ssr here.)
// For now this file likely only handles redirects, headers, etc.
export function middleware(req: NextRequest) {
  // Example: passthrough with a basic guard that ensures envs exist at runtime
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // In production, you might want to log to an error service instead.
    return NextResponse.json(
      { error: "Supabase envs not configured" },
      { status: 500 }
    );
  }

  return NextResponse.next();
}

// If you add matchers, keep them here
// export const config = { matcher: ["/dashboard/:path*"] };
