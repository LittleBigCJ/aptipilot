// app/quiz/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QuizPage() {
  // Next 15+: cookies() is async
  const cookieStore = await cookies();

  // RSC-safe cookie adapter: we only READ cookies here.
  // (No-ops for set/remove because setting cookies in a Server Component is not allowed.
  // If you later need refresh token rotation here, move this into a Server Action or Route Handler.)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          /* no-op in RSC */
        },
        remove(_name: string, _options: CookieOptions) {
          /* no-op in RSC */
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Your Quiz</h1>
      {/* ... your quiz UI ... */}
      <p className="mt-6 text-sm">
        <a href="/set-password" className="text-blue-600 underline">
          Set or update your password
        </a>
      </p>
    </main>
  );
}
