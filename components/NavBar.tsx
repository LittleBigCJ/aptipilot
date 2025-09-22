// components/NavBar.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/utils/supabase/server";

export default async function NavBar() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            AptiPilot
          </Link>
          {/* Always-visible links */}
          <Link href="/about" className="text-sm text-gray-700 hover:underline">
            About
          </Link>
          {/* Only show Quiz when signed in */}
          {user && (
            <Link href="/quiz" className="text-sm text-gray-700 hover:underline">
              Quiz
            </Link>
          )}
          {/* You can add more protected links here */}
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/account"
                className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Account
              </Link>
              {/* If you already have a SignOutButton client component, keep using it.
                  Otherwise, you can link to a server action on /account to sign out. */}
              <Link
                href="/account#signout"
                className="rounded-xl px-3 py-1.5 text-sm text-gray-700 hover:underline"
              >
                Sign out
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
