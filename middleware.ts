// middleware.ts (project root)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // write updated cookies to the outgoing response
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  // This triggers a session refresh if needed and ensures SSR can read it next.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optional: protect /quiz
  if (!user && request.nextUrl.pathname.startsWith("/quiz")) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("message", "Please sign in to access the quiz.");
    redirectUrl.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // everything except static assets/images (adjust as needed)
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
