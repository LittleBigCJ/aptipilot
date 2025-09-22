// middleware.ts (root)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Build a Supabase client for Edge middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options) {
          // Next 15 supports delete(name) or delete({ name, ...options })
          if (options && typeof options === "object") {
            res.cookies.delete({ name, ...options });
          } else {
            res.cookies.delete(name);
          }
        },
      },
    }
  );

  // ---------- Auth Gate for /quiz ----------
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith("/quiz")) {
    const redirectUrl = new URL("/sign-in", req.url);
    redirectUrl.searchParams.set("message", "Please sign in to access the quiz.");
    return NextResponse.redirect(redirectUrl);
  }

  // Continue normally for all other requests
  return res;
}

// Run on every path except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
