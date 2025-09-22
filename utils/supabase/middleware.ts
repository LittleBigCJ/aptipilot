// utils/supabase/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: Parameters<typeof res.cookies.set>[2]) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options?: Parameters<typeof res.cookies.set>[2]) {
          // ✅ Next 15: delete(name) OR delete({ name, ...options })
          if (options && typeof options === "object") {
            res.cookies.delete({ name, ...options });
          } else {
            res.cookies.delete(name);
          }
        },
      },
    }
  );
}
