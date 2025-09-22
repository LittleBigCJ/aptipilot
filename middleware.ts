// middleware.ts (root)
import { NextResponse, type NextRequest } from "next/server";
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
          // Next 15: delete(name) or delete({ name, ...options })
          if (options && typeof options === "object") {
            res.cookies.delete({ name, ...options });
          } else {
            res.cookies.delete(name);
          }
        },
      },
    }
  );

  // Optional auth logic:
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session && req.nextUrl.pathname.startsWith("/account")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
