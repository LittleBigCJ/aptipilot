// components/NavBar.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function NavBar() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          AptiPilot
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/tests">Tests</Link>
          {user ? (
            <>
              <Link href="/profile">Profile</Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in">Sign in</Link>
              <Link href="/sign-up">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
